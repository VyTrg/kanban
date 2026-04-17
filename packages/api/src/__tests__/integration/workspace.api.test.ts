import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../../app';
import { db } from '../../config/database';
import { users, workspaces, workspaceMembers } from '@kanban/db/schema';
import { eq } from 'drizzle-orm';
import { fixtures } from '../fixtures';

describe('Workspace API - Integration Tests', () => {
  let testUserId: string;
  let testWorkspaceId: string;
  let testMemberId: string;

  beforeAll(async () => {
    // Create test user
    const [user] = await db.insert(users).values({
      id: fixtures.users.admin.id,
      email: fixtures.users.admin.email,
      name: fixtures.users.admin.name,
      emailVerified: true,
    }).onConflictDoNothing().returning();
    testUserId = (user?.id as string) || fixtures.users.admin.id;
  });

  afterAll(async () => {
    // Cleanup
    await db.delete(workspaceMembers).where(eq(workspaceMembers.createdBy, testUserId));
    await db.delete(workspaces).where(eq(workspaces.createdBy, testUserId));
    await db.delete(users).where(eq(users.id, testUserId));
  });

  describe('TC-WS-01: Create Workspace', () => {
    it('WS-01-01: should create workspace successfully', async () => {
      const req = new Request('http://localhost/v1/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': testUserId,
          'x-user-email': fixtures.users.admin.email,
        },
        body: JSON.stringify({
          name: 'Integration Test Workspace',
          slug: 'integration-test-ws',
          description: 'Test description',
        }),
      });

      const response = await app.fetch(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('publicId');
      expect(data.data.name).toBe('Integration Test Workspace');
      
      testWorkspaceId = data.data.publicId;
    });

    it('WS-01-02: should fail with missing name', async () => {
      const req = new Request('http://localhost/v1/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': testUserId,
          'x-user-email': fixtures.users.admin.email,
        },
        body: JSON.stringify({
          slug: 'test-slug',
        }),
      });

      const response = await app.fetch(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('WS-01-07: should fail without JWT', async () => {
      const req = new Request('http://localhost/v1/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test',
          slug: 'test',
        }),
      });

      const response = await app.fetch(req);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('TC-WS-02: List Workspaces', () => {
    it('WS-02-01: should return user workspaces', async () => {
      const req = new Request('http://localhost/v1/workspaces', {
        method: 'GET',
        headers: {
          'x-user-id': testUserId,
          'x-user-email': fixtures.users.admin.email,
        },
      });

      const response = await app.fetch(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);
    });

    it('WS-02-04: should fail without auth', async () => {
      const req = new Request('http://localhost/v1/workspaces', {
        method: 'GET',
      });

      const response = await app.fetch(req);

      expect(response.status).toBe(401);
    });
  });

  describe('TC-WS-03: Get Workspace Details', () => {
    it('WS-03-01: should return workspace details for member', async () => {
      const req = new Request(`http://localhost/v1/workspaces/${testWorkspaceId}`, {
        method: 'GET',
        headers: {
          'x-user-id': testUserId,
          'x-user-email': fixtures.users.admin.email,
        },
      });

      const response = await app.fetch(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('workspace');
    });

    it('WS-03-03: should return 404 for non-existent workspace', async () => {
      const req = new Request('http://localhost/v1/workspaces/nonexistent123', {
        method: 'GET',
        headers: {
          'x-user-id': testUserId,
          'x-user-email': fixtures.users.admin.email,
        },
      });

      const response = await app.fetch(req);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error.code).toBe('WORKSPACE_NOT_FOUND');
    });
  });

  describe('TC-WS-04: Update Workspace', () => {
    it('WS-04-01: should allow admin to update workspace', async () => {
      const req = new Request(`http://localhost/v1/workspaces/${testWorkspaceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': testUserId,
          'x-user-email': fixtures.users.admin.email,
        },
        body: JSON.stringify({
          name: 'Updated Workspace Name',
          description: 'Updated description',
        }),
      });

      const response = await app.fetch(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('Updated Workspace Name');
    });

    it('WS-04-06: should accept empty body', async () => {
      const req = new Request(`http://localhost/v1/workspaces/${testWorkspaceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': testUserId,
          'x-user-email': fixtures.users.admin.email,
        },
        body: JSON.stringify({}),
      });

      const response = await app.fetch(req);

      expect(response.status).toBe(200);
    });
  });

  describe('TC-WS-06: Invite Member', () => {
    it('WS-06-01: should invite member successfully', async () => {
      const req = new Request(`http://localhost/v1/workspaces/${testWorkspaceId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': testUserId,
          'x-user-email': fixtures.users.admin.email,
        },
        body: JSON.stringify({
          email: 'newmember@test.com',
          role: 'member',
        }),
      });

      const response = await app.fetch(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.status).toBe('invited');
      expect(data.data.email).toBe('newmember@test.com');
      
      testMemberId = data.data.publicId;
    });

    it('WS-06-03: should fail with invalid email', async () => {
      const req = new Request(`http://localhost/v1/workspaces/${testWorkspaceId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': testUserId,
          'x-user-email': fixtures.users.admin.email,
        },
        body: JSON.stringify({
          email: 'not-an-email',
          role: 'member',
        }),
      });

      const response = await app.fetch(req);

      expect(response.status).toBe(400);
    });
  });

  describe('TC-WS-07: List Members', () => {
    it('WS-07-01: should list all members', async () => {
      const req = new Request(`http://localhost/v1/workspaces/${testWorkspaceId}/members`, {
        method: 'GET',
        headers: {
          'x-user-id': testUserId,
          'x-user-email': fixtures.users.admin.email,
        },
      });

      const response = await app.fetch(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThanOrEqual(2);
    });

    it('WS-07-02: should filter by status', async () => {
      const req = new Request(`http://localhost/v1/workspaces/${testWorkspaceId}/members?status=invited`, {
        method: 'GET',
        headers: {
          'x-user-id': testUserId,
          'x-user-email': fixtures.users.admin.email,
        },
      });

      const response = await app.fetch(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.every((m: any) => m.status === 'invited')).toBe(true);
    });
  });

  describe('TC-WS-08: Update Member Role', () => {
    it('WS-08-01: should update member role', async () => {
      const req = new Request(`http://localhost/v1/workspaces/${testWorkspaceId}/members/${testMemberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': testUserId,
          'x-user-email': fixtures.users.admin.email,
        },
        body: JSON.stringify({
          role: 'guest',
        }),
      });

      const response = await app.fetch(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.role).toBe('guest');
    });
  });

  describe('TC-WS-09: Remove Member', () => {
    it('WS-09-01: should remove member', async () => {
      const req = new Request(`http://localhost/v1/workspaces/${testWorkspaceId}/members/${testMemberId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': testUserId,
          'x-user-email': fixtures.users.admin.email,
        },
      });

      const response = await app.fetch(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe('TC-WS-05: Delete Workspace', () => {
    it('WS-05-01: should soft delete workspace', async () => {
      const req = new Request(`http://localhost/v1/workspaces/${testWorkspaceId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': testUserId,
          'x-user-email': fixtures.users.admin.email,
        },
      });

      const response = await app.fetch(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('WS-05-04: should return 404 after soft delete', async () => {
      const req = new Request(`http://localhost/v1/workspaces/${testWorkspaceId}`, {
        method: 'GET',
        headers: {
          'x-user-id': testUserId,
          'x-user-email': fixtures.users.admin.email,
        },
      });

      const response = await app.fetch(req);

      expect(response.status).toBe(404);
    });
  });

  describe('SEC: Security Tests', () => {
    it('SEC-01: should reject request without auth header', async () => {
      const req = new Request('http://localhost/v1/workspaces', {
        method: 'GET',
      });

      const response = await app.fetch(req);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error.code).toBe('UNAUTHORIZED');
    });

    it('EDGE-03: should reject empty name', async () => {
      const req = new Request('http://localhost/v1/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': testUserId,
          'x-user-email': fixtures.users.admin.email,
        },
        body: JSON.stringify({
          name: '',
          slug: 'test',
        }),
      });

      const response = await app.fetch(req);

      expect(response.status).toBe(400);
    });
  });
});
