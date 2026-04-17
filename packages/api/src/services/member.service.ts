import { db } from "../config/database";
import { workspaces, workspaceMembers } from "@kanban/db/schema";
import { generatePublicId } from "../lib/utils";
import { eq, and, isNull } from "drizzle-orm";
import type { InviteMemberInput, UpdateMemberRoleInput } from "../validations/workspace";

export class MemberService {
  /**
   * Kiểm tra quyền admin
   */
  private static async checkAdminPermission(workspacePublicId: string, userId: string) {
    const [membership] = await db
      .select()
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(
        and(
          eq(workspaces.publicId, workspacePublicId),
          eq(workspaceMembers.userId, userId),
          eq(workspaceMembers.role, "admin"),
          isNull(workspaces.deletedAt)
        )
      )
      .limit(1);

    if (!membership) {
      throw new Error("FORBIDDEN: Bạn không có quyền thực hiện thao tác này");
    }

    return membership.workspace.id;
  }

  /**
   * Kiểm tra quyền member (bất kỳ role nào)
   */
  private static async checkMemberPermission(workspacePublicId: string, userId: string) {
    const [membership] = await db
      .select()
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(
        and(
          eq(workspaces.publicId, workspacePublicId),
          eq(workspaceMembers.userId, userId),
          isNull(workspaces.deletedAt)
        )
      )
      .limit(1);

    if (!membership) {
      throw new Error("FORBIDDEN: Bạn không phải thành viên của workspace này");
    }

    return membership.workspace.id;
  }

  /**
   * Lấy danh sách thành viên
   */
  static async list(workspacePublicId: string, userId: string, filters?: { status?: string; role?: string }) {
    const workspaceId = await this.checkMemberPermission(workspacePublicId, userId);

    let conditions = [eq(workspaceMembers.workspaceId, workspaceId), isNull(workspaceMembers.deletedAt)];

    if (filters?.status) {
      conditions.push(eq(workspaceMembers.status, filters.status as any));
    }
    if (filters?.role) {
      conditions.push(eq(workspaceMembers.role, filters.role as any));
    }

    return await db
      .select({
        id: workspaceMembers.id,
        publicId: workspaceMembers.publicId,
        email: workspaceMembers.email,
        userId: workspaceMembers.userId,
        role: workspaceMembers.role,
        status: workspaceMembers.status,
        createdAt: workspaceMembers.createdAt,
      })
      .from(workspaceMembers)
      .where(and(...conditions));
  }

  /**
   * Mời thành viên mới
   */
  static async invite(workspacePublicId: string, userId: string, input: InviteMemberInput) {
    const workspaceId = await this.checkAdminPermission(workspacePublicId, userId);

    // Kiểm tra email đã tồn tại
    const [existing] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.email, input.email),
          isNull(workspaceMembers.deletedAt)
        )
      )
      .limit(1);

    if (existing) {
      throw new Error("MEMBER_EXISTS: Email đã là thành viên của workspace này");
    }

    const [member] = await db
      .insert(workspaceMembers)
      .values({
        publicId: generatePublicId(),
        workspaceId,
        email: input.email,
        role: input.role,
        status: "invited",
        createdBy: userId,
      })
      .returning();

    return member;
  }

  /**
   * Lấy chi tiết thành viên
   */
  static async getById(workspacePublicId: string, memberPublicId: string, userId: string) {
    const workspaceId = await this.checkMemberPermission(workspacePublicId, userId);

    const [member] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.publicId, memberPublicId),
          isNull(workspaceMembers.deletedAt)
        )
      )
      .limit(1);

    return member;
  }

  /**
   * Cập nhật role thành viên
   */
  static async updateRole(
    workspacePublicId: string,
    memberPublicId: string,
    userId: string,
    input: UpdateMemberRoleInput
  ) {
    const workspaceId = await this.checkAdminPermission(workspacePublicId, userId);

    return await db
      .update(workspaceMembers)
      .set({ role: input.role, updatedAt: new Date() })
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.publicId, memberPublicId),
          isNull(workspaceMembers.deletedAt)
        )
      )
      .returning();
  }

  /**
   * Xóa thành viên
   */
  static async remove(workspacePublicId: string, memberPublicId: string, userId: string) {
    const workspaceId = await this.checkMemberPermission(workspacePublicId, userId);

    // Lấy thông tin member cần xóa
    const [targetMember] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.publicId, memberPublicId),
          isNull(workspaceMembers.deletedAt)
        )
      )
      .limit(1);

    if (!targetMember) {
      throw new Error("NOT_FOUND: Member không tồn tại");
    }

    // Cho phép tự rời hoặc admin xóa
    const isSelfRemoval = targetMember.userId === userId;
    if (!isSelfRemoval) {
      await this.checkAdminPermission(workspacePublicId, userId);
    }

    return await db
      .update(workspaceMembers)
      .set({
        status: "removed",
        deletedAt: new Date(),
        deletedBy: userId,
      })
      .where(eq(workspaceMembers.id, targetMember.id))
      .returning();
  }

  /**
   * Chấp nhận lời mời
   */
  static async acceptInvitation(workspacePublicId: string, memberPublicId: string, userId: string) {
    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(and(eq(workspaces.publicId, workspacePublicId), isNull(workspaces.deletedAt)))
      .limit(1);

    if (!workspace) {
      throw new Error("NOT_FOUND: Workspace không tồn tại");
    }

    const [member] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspace.id),
          eq(workspaceMembers.publicId, memberPublicId),
          eq(workspaceMembers.status, "invited"),
          isNull(workspaceMembers.deletedAt)
        )
      )
      .limit(1);

    if (!member) {
      throw new Error("NOT_FOUND: Lời mời không tồn tại hoặc đã hết hạn");
    }

    return await db
      .update(workspaceMembers)
      .set({
        userId,
        status: "active",
        updatedAt: new Date(),
      })
      .where(eq(workspaceMembers.id, member.id))
      .returning();
  }
}
