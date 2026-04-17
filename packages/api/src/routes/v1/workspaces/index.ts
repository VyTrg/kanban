import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { 
  createWorkspaceSchema, 
  updateWorkspaceSchema 
} from "../../../validations/workspace";
import { WorkspaceService } from "../../../services/workspace.service";
import memberRoutes from "./members";

const workspaceRoutes = new Hono();

const getUserInfo = (c: any) => {
  const userId = c.req.header("x-user-id");
  const userEmail = c.req.header("x-user-email") || "test@example.com";
  
  if (!userId) {
    return c.json({ success: false, error: { code: "UNAUTHORIZED", message: "Missing x-user-id header" } }, 401);
  }
  
  return { userId: userId as string, userEmail: userEmail as string };
};

const handleError = (c: any, error: any) => {
  if (error.message.includes("không có quyền") || error.message.includes("FORBIDDEN")) {
    return c.json({ success: false, error: { code: "FORBIDDEN", message: error.message } }, 403);
  }
  if (error.message.includes("không tồn tại") || error.message.includes("NOT_FOUND")) {
    return c.json({ success: false, error: { code: "WORKSPACE_NOT_FOUND", message: error.message } }, 404);
  }
  if (error.message.includes("CONFLICT") || error.code === "23505") {
    return c.json({ success: false, error: { code: "SLUG_CONFLICT", message: error.message } }, 409);
  }
  return c.json({ success: false, error: { code: "INTERNAL_ERROR", message: error.message } }, 500);
};

// List workspaces
workspaceRoutes.get("/", async (c) => {
  const userInfo = getUserInfo(c);
  if (userInfo instanceof Response) return userInfo;
  
  try {
    const list = await WorkspaceService.listByUser(userInfo.userId);
    return c.json({ success: true, data: list });
  } catch (error: any) {
    return handleError(c, error);
  }
});

// Create workspace
workspaceRoutes.post("/", zValidator("json", createWorkspaceSchema), async (c) => {
  const userInfo = getUserInfo(c);
  if (userInfo instanceof Response) return userInfo;
  
  try {
    const body = c.req.valid("json");
    const workspace = await WorkspaceService.create(userInfo.userId, userInfo.userEmail, body);
    return c.json({ success: true, data: workspace }, 201);
  } catch (error: any) {
    return handleError(c, error);
  }
});

// Get workspace details
workspaceRoutes.get("/:publicId", async (c) => {
  const userInfo = getUserInfo(c);
  if (userInfo instanceof Response) return userInfo;
  
  try {
    const publicId = c.req.param("publicId");
    const workspace = await WorkspaceService.getByPublicId(publicId, userInfo.userId);
    
    if (!workspace) {
      return c.json({ success: false, error: { code: "WORKSPACE_NOT_FOUND", message: "Workspace không tồn tại" } }, 404);
    }
    
    return c.json({ success: true, data: workspace });
  } catch (error: any) {
    return handleError(c, error);
  }
});

// Update workspace
workspaceRoutes.patch("/:publicId", zValidator("json", updateWorkspaceSchema), async (c) => {
  const userInfo = getUserInfo(c);
  if (userInfo instanceof Response) return userInfo;
  
  try {
    const publicId = c.req.param("publicId");
    const body = c.req.valid("json");
    const [updated] = await WorkspaceService.update(publicId, userInfo.userId, body);
    return c.json({ success: true, data: updated });
  } catch (error: any) {
    return handleError(c, error);
  }
});

// Soft delete workspace
workspaceRoutes.delete("/:publicId", async (c) => {
  const userInfo = getUserInfo(c);
  if (userInfo instanceof Response) return userInfo;
  
  try {
    const publicId = c.req.param("publicId");
    await WorkspaceService.softDelete(publicId, userInfo.userId);
    return c.json({ success: true, message: "Đã xóa workspace thành công" });
  } catch (error: any) {
    return handleError(c, error);
  }
});

// Mount member routes
workspaceRoutes.route("/:publicId/members", memberRoutes);

export default workspaceRoutes;
