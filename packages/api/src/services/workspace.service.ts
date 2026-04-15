import { db } from "../config/database";
import { workspaces, workspaceMembers } from "@kanban/db/schema";
import { generatePublicId, slugify } from "../lib/utils";
import { eq, and, isNull } from "drizzle-orm";
import type { CreateWorkspaceInput, UpdateWorkspaceInput } from "../validations/workspace";

export class WorkspaceService {
  /**
   * Tạo Workspace mới và gán người tạo làm Admin
   */
  static async create(userId: string, userEmail: string, input: CreateWorkspaceInput) {
    const publicId = generatePublicId();
    const slug = input.slug || slugify(input.name);

    return await db.transaction(async (tx) => {
      // 1. Tạo Workspace
      const [workspace] = await tx
        .insert(workspaces)
        .values({
          publicId,
          name: input.name,
          description: input.description,
          slug: `${slug}-${generatePublicId().slice(0, 4)}`, // Đảm bảo slug duy nhất bằng cách thêm suffix ngắn
          createdBy: userId,
        })
        .returning();

      // 2. Thêm người tạo vào danh sách thành viên với quyền Admin
      await tx.insert(workspaceMembers).values({
        publicId: generatePublicId(),
        workspaceId: workspace.id,
        userId: userId,
        email: userEmail,
        role: "admin",
        status: "active",
        createdBy: userId,
      });

      return workspace;
    });
  }

  /**
   * Lấy danh sách workspace mà user tham gia
   */
  static async listByUser(userId: string) {
    return await db
      .select({
        id: workspaces.id,
        publicId: workspaces.publicId,
        name: workspaces.name,
        slug: workspaces.slug,
        role: workspaceMembers.role,
      })
      .from(workspaces)
      .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(
        and(
          eq(workspaceMembers.userId, userId),
          isNull(workspaces.deletedAt)
        )
      );
  }

  /**
   * Lấy chi tiết Workspace theo Public ID
   */
  static async getByPublicId(publicId: string, userId: string) {
    const [workspace] = await db
      .select()
      .from(workspaces)
      .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(
        and(
          eq(workspaces.publicId, publicId),
          eq(workspaceMembers.userId, userId),
          isNull(workspaces.deletedAt)
        )
      )
      .limit(1);

    return workspace;
  }

  /**
   * Cập nhật thông tin Workspace
   */
  static async update(publicId: string, userId: string, input: UpdateWorkspaceInput) {
    // Kiểm tra quyền (chỉ Admin mới được sửa - tạm thời kiểm tra đơn giản)
    const [membership] = await db
      .select()
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(
        and(
          eq(workspaces.publicId, publicId),
          eq(workspaceMembers.userId, userId),
          eq(workspaceMembers.role, "admin")
        )
      );

    if (!membership) {
      throw new Error("Bạn không có quyền cập nhật workspace này hoặc workspace không tồn tại");
    }

    const updateData: any = { ...input, updatedAt: new Date() };
    if (input.name && !input.slug) {
        // Nếu đổi tên mà không truyền slug mới, ta có thể cập nhật slug (tùy logic UX)
    }

    return await db
      .update(workspaces)
      .set(updateData)
      .where(eq(workspaces.publicId, publicId))
      .returning();
  }

  /**
   * Xóa mềm Workspace (Soft Delete)
   */
  static async softDelete(publicId: string, userId: string) {
    return await db
      .update(workspaces)
      .set({
        deletedAt: new Date(),
        deletedBy: userId,
      })
      .where(
        and(
          eq(workspaces.publicId, publicId),
          eq(workspaces.createdBy, userId) // Chỉ chủ sở hữu thực sự mới được xóa
        )
      )
      .returning();
  }
}
