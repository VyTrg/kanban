import { db } from '../config/database';
import { users, workspaces, workspaceMembers } from '@kanban/db/schema';
import { eq } from 'drizzle-orm';
import { generatePublicId } from '../lib/utils';

export class TestHelpers {
  static async createTestUser(userData: { id: string; email: string; name: string }) {
    const [user] = await db.insert(users).values({
      ...userData,
      emailVerified: true,
    }).returning();
    return user;
  }

  static async createTestWorkspace(userId: string, workspaceData: { name: string; slug: string }) {
    const publicId = generatePublicId();
    const [workspace] = await db.insert(workspaces).values({
      publicId,
      name: workspaceData.name,
      slug: `${workspaceData.slug}-${generatePublicId().slice(0, 4)}`,
      createdBy: userId,
    }).returning();

    await db.insert(workspaceMembers).values({
      publicId: generatePublicId(),
      workspaceId: workspace.id,
      userId,
      email: 'test@example.com',
      role: 'admin',
      status: 'active',
      createdBy: userId,
    });

    return workspace;
  }

  static async cleanupTestData(userId: string) {
    await db.delete(workspaceMembers).where(eq(workspaceMembers.createdBy, userId));
    await db.delete(workspaces).where(eq(workspaces.createdBy, userId));
    await db.delete(users).where(eq(users.id, userId));
  }

  static async getWorkspaceWithMembers(workspaceId: number) {
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
      with: {
        members: true,
      },
    });
    return workspace;
  }
}

export const mockRequest = (userId: string, email: string) => ({
  header: (name: string) => {
    if (name === 'x-user-id') return userId;
    if (name === 'x-user-email') return email;
    return null;
  },
  param: (name: string) => null,
  query: (name: string) => null,
  valid: (type: string) => ({}),
  json: (data: any) => data,
});
