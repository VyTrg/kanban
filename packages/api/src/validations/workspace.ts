import { z } from "zod";

/**
 * Schema dùng khi tạo Workspace mới
 */
export const createWorkspaceSchema = z.object({
  name: z.string()
    .min(1, "Tên workspace không được để trống")
    .max(255, "Tên workspace quá dài (tối đa 255 ký tự)"),
  description: z.string()
    .max(1000, "Mô tả quá dài (tối đa 1000 ký tự)")
    .optional(),
  // Slug có thể để trống, ta sẽ tự sinh nếu không có
  slug: z.string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9-]+$/, "Slug chỉ được chứa chữ thường, số và dấu gạch ngang")
    .optional(),
});

/**
 * Schema dùng khi cập nhật Workspace (mọi trường đều không bắt buộc)
 */
export const updateWorkspaceSchema = createWorkspaceSchema.partial();

/**
 * Schema dùng khi mời thành viên
 */
export const inviteMemberSchema = z.object({
  email: z.string().email("Định dạng email không hợp lệ"),
  role: z.enum(["admin", "member", "guest"], {
    errorMap: () => ({ message: "Vai trò phải là admin, member hoặc guest" }),
  }),
});

/**
 * Types suy diễn từ Schema để dùng trong code
 */
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
