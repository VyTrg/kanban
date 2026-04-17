import { test, expect } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:3000';
const TEST_USER_ID = '550e8400-e29b-41d4-a716-446655440000';
const TEST_USER_EMAIL = 'e2e@test.com';

test.describe('Workspace E2E Tests', () => {
  let workspaceId: string;
  let memberId: string;

  test('E2E-01: Complete workspace lifecycle', async ({ request }) => {
    // 1. Create workspace
    const createResponse = await request.post(`${API_URL}/v1/workspaces`, {
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': TEST_USER_ID,
        'x-user-email': TEST_USER_EMAIL,
      },
      data: {
        name: 'E2E Test Workspace',
        slug: 'e2e-test-workspace',
        description: 'E2E test',
      },
    });

    expect(createResponse.ok()).toBeTruthy();
    const createData = await createResponse.json();
    expect(createData.success).toBe(true);
    workspaceId = createData.data.publicId;

    // 2. List workspaces
    const listResponse = await request.get(`${API_URL}/v1/workspaces`, {
      headers: {
        'x-user-id': TEST_USER_ID,
        'x-user-email': TEST_USER_EMAIL,
      },
    });

    expect(listResponse.ok()).toBeTruthy();
    const listData = await listResponse.json();
    expect(listData.data.some((w: any) => w.publicId === workspaceId)).toBe(true);

    // 3. Get workspace details
    const getResponse = await request.get(`${API_URL}/v1/workspaces/${workspaceId}`, {
      headers: {
        'x-user-id': TEST_USER_ID,
        'x-user-email': TEST_USER_EMAIL,
      },
    });

    expect(getResponse.ok()).toBeTruthy();
    const getData = await getResponse.json();
    expect(getData.data.workspace.name).toBe('E2E Test Workspace');

    // 4. Update workspace
    const updateResponse = await request.patch(`${API_URL}/v1/workspaces/${workspaceId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': TEST_USER_ID,
        'x-user-email': TEST_USER_EMAIL,
      },
      data: {
        name: 'Updated E2E Workspace',
      },
    });

    expect(updateResponse.ok()).toBeTruthy();
    const updateData = await updateResponse.json();
    expect(updateData.data.name).toBe('Updated E2E Workspace');

    // 5. Invite member
    const inviteResponse = await request.post(`${API_URL}/v1/workspaces/${workspaceId}/members`, {
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': TEST_USER_ID,
        'x-user-email': TEST_USER_EMAIL,
      },
      data: {
        email: 'e2e-member@test.com',
        role: 'member',
      },
    });

    expect(inviteResponse.ok()).toBeTruthy();
    const inviteData = await inviteResponse.json();
    expect(inviteData.data.status).toBe('invited');
    memberId = inviteData.data.publicId;

    // 6. List members
    const membersResponse = await request.get(`${API_URL}/v1/workspaces/${workspaceId}/members`, {
      headers: {
        'x-user-id': TEST_USER_ID,
        'x-user-email': TEST_USER_EMAIL,
      },
    });

    expect(membersResponse.ok()).toBeTruthy();
    const membersData = await membersResponse.json();
    expect(membersData.data.length).toBeGreaterThanOrEqual(2);

    // 7. Update member role
    const roleResponse = await request.patch(`${API_URL}/v1/workspaces/${workspaceId}/members/${memberId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': TEST_USER_ID,
        'x-user-email': TEST_USER_EMAIL,
      },
      data: {
        role: 'guest',
      },
    });

    expect(roleResponse.ok()).toBeTruthy();
    const roleData = await roleResponse.json();
    expect(roleData.data.role).toBe('guest');

    // 8. Remove member
    const removeResponse = await request.delete(`${API_URL}/v1/workspaces/${workspaceId}/members/${memberId}`, {
      headers: {
        'x-user-id': TEST_USER_ID,
        'x-user-email': TEST_USER_EMAIL,
      },
    });

    expect(removeResponse.ok()).toBeTruthy();

    // 9. Delete workspace
    const deleteResponse = await request.delete(`${API_URL}/v1/workspaces/${workspaceId}`, {
      headers: {
        'x-user-id': TEST_USER_ID,
        'x-user-email': TEST_USER_EMAIL,
      },
    });

    expect(deleteResponse.ok()).toBeTruthy();

    // 10. Verify deletion
    const verifyResponse = await request.get(`${API_URL}/v1/workspaces/${workspaceId}`, {
      headers: {
        'x-user-id': TEST_USER_ID,
        'x-user-email': TEST_USER_EMAIL,
      },
    });

    expect(verifyResponse.status()).toBe(404);
  });

  test('E2E-02: Authorization flow', async ({ request }) => {
    // Test without auth
    const noAuthResponse = await request.get(`${API_URL}/v1/workspaces`);
    expect(noAuthResponse.status()).toBe(401);

    // Test with auth
    const withAuthResponse = await request.get(`${API_URL}/v1/workspaces`, {
      headers: {
        'x-user-id': TEST_USER_ID,
        'x-user-email': TEST_USER_EMAIL,
      },
    });
    expect(withAuthResponse.ok()).toBeTruthy();
  });

  test('E2E-03: Validation errors', async ({ request }) => {
    // Invalid email
    const invalidEmailResponse = await request.post(`${API_URL}/v1/workspaces`, {
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': TEST_USER_ID,
        'x-user-email': TEST_USER_EMAIL,
      },
      data: {
        name: '',
        slug: 'test',
      },
    });

    expect(invalidEmailResponse.status()).toBe(400);
  });
});
