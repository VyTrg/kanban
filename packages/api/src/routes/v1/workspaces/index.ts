import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { 
  createWorkspaceSchema, 
  updateWorkspaceSchema 
} from "../../../validations/workspace";
import { WorkspaceService } from "../../../services/workspace.service";

const workspaceRoutes = new Hono();

/**
 * Helper để lấy User Info tạm thời từ headers
 * (Trong thực tế sẽ dùng Auth Middleware)
 */
const getUserInfo = (c: any) => {
  const userId = c.req.header("x-user-id");
  const userEmail = c.req.header("x-user-email") || "test@example.com";
  
  if (!userId) {
    throw new Error("Missing x-user-id header for testing");
  }
  
  return { userId, userEmail };
};

// 1. Lấy danh sách workspace của user
workspaceRoutes.get("/", async (c) => {
  try {
    const { userId } = getUserInfo(c);
    const list = await WorkspaceService.listByUser(userId);
    return c.json({ success: true, data: list });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

// 2. Tạo Workspace mới
workspaceRoutes.post("/", zValidator("json", createWorkspaceSchema), async (c) => {
  try {
    const { userId, userEmail } = getUserInfo(c);
    const body = c.req.valid("json");
    
    const workspace = await WorkspaceService.create(userId, userEmail, body);
    return c.json({ success: true, data: workspace }, 201);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

// 3. Lấy chi tiết Workspace
workspaceRoutes.get("/:id", async (c) => {
  try {
    const { userId } = getUserInfo(c);
    const publicId = c.req.param("id");
    
    const workspace = await WorkspaceService.getByPublicId(publicId, userId);
    
    if (!workspace) {
      return c.json({ success: false, message: "Workspace không tồn tại" }, 404);
    }
    
    return c.json({ success: true, data: workspace });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

// 4. Cập nhật Workspace
workspaceRoutes.patch("/:id", zValidator("json", updateWorkspaceSchema), async (c) => {
  try {
    const { userId } = getUserInfo(c);
    const publicId = c.req.param("id");
    const body = c.req.valid("json");
    
    const updated = await WorkspaceService.update(publicId, userId, body);
    return c.json({ success: true, data: updated });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

// 5. Xóa Workspace (Soft Delete)
workspaceRoutes.delete("/:id", async (c) => {
  try {
    const { userId } = getUserInfo(c);
    const publicId = c.req.param("id");
    
    await WorkspaceService.softDelete(publicId, userId);
    return c.json({ success: true, message: "Đã xóa workspace thành công" });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
});

export default workspaceRoutes;
