import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { inviteMemberSchema, updateMemberRoleSchema } from "../../../validations/workspace";
import { MemberService } from "../../../services/member.service";

const memberRoutes = new Hono();

const getUserInfo = (c: any) => {
  const userId = c.req.header("x-user-id");
  if (!userId) {
    return c.json({ success: false, error: { code: "UNAUTHORIZED", message: "Missing x-user-id header" } }, 401);
  }
  return { userId: userId as string };
};

const handleError = (c: any, error: any) => {
  if (error.message.includes("không có quyền") || error.message.includes("FORBIDDEN")) {
    return c.json({ success: false, error: { code: "FORBIDDEN", message: error.message } }, 403);
  }
  if (error.message.includes("không tồn tại") || error.message.includes("NOT_FOUND")) {
    return c.json({ success: false, error: { code: "MEMBER_NOT_FOUND", message: error.message } }, 404);
  }
  if (error.message.includes("đã là thành viên") || error.message.includes("EXISTS")) {
    return c.json({ success: false, error: { code: "MEMBER_EXISTS", message: error.message } }, 409);
  }
  return c.json({ success: false, error: { code: "INTERNAL_ERROR", message: error.message } }, 500);
};

// List members
memberRoutes.get("/", async (c) => {
  const userInfo = getUserInfo(c);
  if (userInfo instanceof Response) return userInfo;
  
  try {
    const workspaceId = c.req.param("publicId");
    const status = c.req.query("status");
    const role = c.req.query("role");
    
    const members = await MemberService.list(workspaceId, userInfo.userId, { status, role });
    return c.json({ success: true, data: members });
  } catch (error: any) {
    return handleError(c, error);
  }
});

// Invite member
memberRoutes.post("/", zValidator("json", inviteMemberSchema), async (c) => {
  const userInfo = getUserInfo(c);
  if (userInfo instanceof Response) return userInfo;
  
  try {
    const workspaceId = c.req.param("publicId");
    const body = c.req.valid("json");
    
    const member = await MemberService.invite(workspaceId, userInfo.userId, body);
    return c.json({ success: true, data: member, message: "Invitation sent" }, 201);
  } catch (error: any) {
    return handleError(c, error);
  }
});

// Get member details
memberRoutes.get("/:memberId", async (c) => {
  const userInfo = getUserInfo(c);
  if (userInfo instanceof Response) return userInfo;
  
  try {
    const workspaceId = c.req.param("publicId");
    const memberId = c.req.param("memberId");
    
    const member = await MemberService.getById(workspaceId, memberId, userInfo.userId);
    if (!member) {
      return c.json({ success: false, error: { code: "MEMBER_NOT_FOUND", message: "Member không tồn tại" } }, 404);
    }
    
    return c.json({ success: true, data: member });
  } catch (error: any) {
    return handleError(c, error);
  }
});

// Update member role
memberRoutes.patch("/:memberId", zValidator("json", updateMemberRoleSchema), async (c) => {
  const userInfo = getUserInfo(c);
  if (userInfo instanceof Response) return userInfo;
  
  try {
    const workspaceId = c.req.param("publicId");
    const memberId = c.req.param("memberId");
    const body = c.req.valid("json");
    
    const [updated] = await MemberService.updateRole(workspaceId, memberId, userInfo.userId, body);
    return c.json({ success: true, data: updated });
  } catch (error: any) {
    return handleError(c, error);
  }
});

// Remove member
memberRoutes.delete("/:memberId", async (c) => {
  const userInfo = getUserInfo(c);
  if (userInfo instanceof Response) return userInfo;
  
  try {
    const workspaceId = c.req.param("publicId");
    const memberId = c.req.param("memberId");
    
    await MemberService.remove(workspaceId, memberId, userInfo.userId);
    return c.json({ success: true, message: "Member removed" });
  } catch (error: any) {
    return handleError(c, error);
  }
});

// Accept invitation
memberRoutes.post("/:memberId/accept", async (c) => {
  const userInfo = getUserInfo(c);
  if (userInfo instanceof Response) return userInfo;
  
  try {
    const workspaceId = c.req.param("publicId");
    const memberId = c.req.param("memberId");
    
    const [accepted] = await MemberService.acceptInvitation(workspaceId, memberId, userInfo.userId);
    return c.json({ success: true, data: accepted, message: "Invitation accepted" });
  } catch (error: any) {
    return handleError(c, error);
  }
});

export default memberRoutes;
