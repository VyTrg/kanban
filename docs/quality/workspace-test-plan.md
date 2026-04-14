# Test Plan – Workspace Module
> Kanban API · Version 1.0 · April 2026

---

## 1. Mục tiêu & Phạm vi

**Mục tiêu:** Đảm bảo module Workspace hoạt động đúng về business logic, bảo mật phân quyền, và xử lý lỗi trước khi release.

**Phạm vi in-scope:**
- CRUD workspace (tạo, đọc, sửa, xoá mềm)
- Quản lý thành viên (mời, đổi role, xoá, thu hồi lời mời)
- Phân quyền role (admin / member / guest)
- Validation đầu vào (Zod schema)
- Error handling và response format

**Phạm vi out-of-scope:**
- Module Board, Card, List
- Email service thực tế (mock)
- Background job hết hạn lời mời 12h (unit test riêng)
- UI / Frontend

---

## 2. Chiến lược kiểm thử (Test Pyramid)

```
         ┌──────────┐
         │  E2E (5%)│  ← Postman / Manual smoke test
        ┌┴──────────┴┐
        │Integration │  ← Supertest + real DB / test DB
        │   (35%)    │
       ┌┴────────────┴┐
       │  Unit (60%)  │  ← Jest, mock DB
       └──────────────┘
```

**Stack:**
- **Unit Test:** Jest + TypeScript
- **Integration Test:** Jest + Supertest (Hono test client) + PostgreSQL test DB
- **Coverage target:** 80% line coverage cho workspace module

---

## 3. Test Cases

### TC-WS-01: Tạo Workspace (POST /api/v1/workspaces)

| ID | Tên | Input | Expected |
|---|---|---|---|
| WS-01-01 | Tạo workspace thành công | `{ name, slug, plan:"free" }` valid | 201, trả về object có `publicId`, creator là `admin` |
| WS-01-02 | Thiếu `name` | `{ slug: "abc" }` | 400, `VALIDATION_ERROR` |
| WS-01-03 | Thiếu `slug` | `{ name: "X" }` | 400, `VALIDATION_ERROR` |
| WS-01-04 | `slug` có ký tự đặc biệt | `slug: "My Team!"` | 400, `VALIDATION_ERROR` |
| WS-01-05 | `slug` đã tồn tại | Tạo 2 workspace cùng slug | 409, `SLUG_CONFLICT` |
| WS-01-06 | `plan` không hợp lệ | `plan: "premium"` | 400, `VALIDATION_ERROR` |
| WS-01-07 | Không có JWT | Không gửi token | 401, `UNAUTHORIZED` |
| WS-01-08 | `name` = 256 ký tự | Chuỗi 256 chars | 400, vượt max length |
| WS-01-09 | `description` là null/omit | Không gửi field | 201, `description: null` acceptable |

---

### TC-WS-02: Lấy danh sách Workspace (GET /api/v1/workspaces)

| ID | Tên | Điều kiện | Expected |
|---|---|---|---|
| WS-02-01 | User là thành viên 2 workspace | Auth OK | 200, mảng 2 phần tử |
| WS-02-02 | User chưa tham gia workspace nào | Auth OK | 200, mảng rỗng `[]` |
| WS-02-03 | Workspace đã bị soft delete | `deletedAt != null` | Không xuất hiện trong list |
| WS-02-04 | Không có JWT | - | 401 |

---

### TC-WS-03: Lấy chi tiết Workspace (GET /api/v1/workspaces/:publicId)

| ID | Tên | Điều kiện | Expected |
|---|---|---|---|
| WS-03-01 | Thành viên truy cập | valid `publicId`, member | 200, full object |
| WS-03-02 | Người ngoài truy cập | không phải member | 403, `FORBIDDEN` |
| WS-03-03 | publicId không tồn tại | random `publicId` | 404, `WORKSPACE_NOT_FOUND` |
| WS-03-04 | Workspace đã xoá mềm | `deletedAt` != null | 404 |

---

### TC-WS-04: Cập nhật Workspace (PATCH /api/v1/workspaces/:publicId)

| ID | Tên | Actor | Expected |
|---|---|---|---|
| WS-04-01 | Admin cập nhật `name` | admin | 200, `name` updated |
| WS-04-02 | Admin cập nhật `showEmailsToMembers` | admin | 200, field updated |
| WS-04-03 | Member cố cập nhật | member role | 403, `FORBIDDEN` |
| WS-04-04 | Guest cố cập nhật | guest role | 403, `FORBIDDEN` |
| WS-04-05 | Cập nhật workspace không tồn tại | admin, sai publicId | 404 |
| WS-04-06 | Gửi body rỗng `{}` | admin | 200, không thay đổi gì |

---

### TC-WS-05: Xoá Workspace (DELETE /api/v1/workspaces/:publicId)

| ID | Tên | Actor | Expected |
|---|---|---|---|
| WS-05-01 | Admin xoá workspace | admin | 200, `deletedAt` set, không mất data |
| WS-05-02 | Member cố xoá | member | 403 |
| WS-05-03 | Xoá workspace đã xoá trước đó | admin | 404 |
| WS-05-04 | Verify soft delete | sau khi xoá, GET lại | 404 |

---

### TC-WS-06: Quản lý Thành viên – Mời (POST /api/v1/workspaces/:publicId/members)

| ID | Tên | Input | Expected |
|---|---|---|---|
| WS-06-01 | Mời email hợp lệ với role `member` | admin, valid email | 201, `status:"invited"` |
| WS-06-02 | Mời với role `guest` | admin | 201, `role:"guest"` |
| WS-06-03 | Mời email không hợp lệ | `"not-an-email"` | 400, `VALIDATION_ERROR` |
| WS-06-04 | Role không hợp lệ | `role: "superuser"` | 400 |
| WS-06-05 | Email đã là thành viên active | admin, dup email | 409, `MEMBER_EXISTS` |
| WS-06-06 | Member cố mời người khác | member role | 403 |
| WS-06-07 | Thiếu `email` field | admin | 400 |

---

### TC-WS-07: Danh sách Thành viên (GET /api/v1/workspaces/:publicId/members)

| ID | Tên | Điều kiện | Expected |
|---|---|---|---|
| WS-07-01 | Lấy tất cả members | admin | 200, bao gồm `invited` + `active` |
| WS-07-02 | Lọc theo `status=active` | admin | 200, chỉ active |
| WS-07-03 | Lọc theo `role=admin` | admin | 200, chỉ admin |
| WS-07-04 | Member lấy list | member | 200 (có quyền xem) |
| WS-07-05 | Người ngoài truy cập | không phải member | 403 |

---

### TC-WS-08: Đổi Role Thành viên (PATCH /api/v1/workspaces/:publicId/members/:memberPublicId)

| ID | Tên | Expected |
|---|---|---|
| WS-08-01 | Admin đổi role member → guest | 200, role updated |
| WS-08-02 | Admin đổi role guest → admin | 200 |
| WS-08-03 | Member cố đổi role | 403 |
| WS-08-04 | Role không hợp lệ | 400 |
| WS-08-05 | memberPublicId không tồn tại | 404 |

---

### TC-WS-09: Xoá / Thu hồi Thành viên (DELETE /api/v1/workspaces/:publicId/members/:memberPublicId)

| ID | Tên | Điều kiện | Expected |
|---|---|---|---|
| WS-09-01 | Admin xoá member active | admin | 200, status → `removed` |
| WS-09-02 | Thu hồi lời mời `invited` | admin | 200, `deletedAt` set |
| WS-09-03 | Member tự rời workspace (self-removal) | member, own publicId | 200 |
| WS-09-04 | Member xoá người khác | member | 403 |
| WS-09-05 | memberPublicId không tồn tại | admin | 404 |

---

### TC-WS-10: Custom Roles

| ID | Tên | Expected |
|---|---|---|
| WS-10-01 | Admin tạo role mới | 201, role created |
| WS-10-02 | Tên role trùng trong cùng workspace | 409 |
| WS-10-03 | `name` > 64 ký tự | 400 |
| WS-10-04 | Member cố tạo role | 403 |
| WS-10-05 | Lấy danh sách roles | 200, array |

---

## 4. Edge Cases & Security

| ID | Loại | Mô tả |
|---|---|---|
| SEC-01 | Auth bypass | Gửi request không có `Authorization` header → 401 |
| SEC-02 | Token giả | JWT sai signature → 401 |
| SEC-03 | Token hết hạn | expired JWT → 401 |
| SEC-04 | IDOR | User A dùng publicId workspace của User B không phải member → 403 |
| SEC-05 | Privilege escalation | Member cố PATCH lên role admin → 403 |
| EDGE-01 | SQL Injection | `name: "'; DROP TABLE workspace; --"` | 400 hoặc sanitized |
| EDGE-02 | XSS in name | `name: "<script>alert(1)</script>"` | escaped hoặc stripped |
| EDGE-03 | Empty string | `name: ""` | 400, validation |
| EDGE-04 | Whitespace only | `name: "   "` | 400 |

---

## 5. Test Data Setup

```typescript
// Fixtures cần chuẩn bị
const fixtures = {
  users: {
    adminUser:  { id: "uuid-admin",  email: "admin@test.com",  role: "admin" },
    memberUser: { id: "uuid-member", email: "member@test.com", role: "member" },
    guestUser:  { id: "uuid-guest",  email: "guest@test.com",  role: "guest" },
    outsider:   { id: "uuid-out",    email: "outside@test.com" }
  },
  workspace: {
    active:  { publicId: "ws_active01", name: "Active WS",  slug: "active-ws",  deletedAt: null },
    deleted: { publicId: "ws_del001",   name: "Deleted WS", slug: "deleted-ws", deletedAt: new Date() }
  }
}
```

---

## 6. Acceptance Criteria

Một test pass khi:
1. HTTP status code khớp với spec
2. Response body có `success: true/false` đúng
3. `data` chứa đầy đủ các field quan trọng
4. Soft delete KHÔNG xoá vật lý dữ liệu trong DB
5. Không có side effects ngoài ý muốn (ví dụ: xoá workspace không xoá user)

---

## 7. Definition of Done

- [ ] Tất cả test cases từ TC-WS-01 đến TC-WS-10 được viết và pass
- [ ] Tất cả SEC cases pass
- [ ] Coverage ≥ 80%
- [ ] Không có `console.error` rò rỉ thông tin DB ra response
- [ ] CI pipeline chạy test tự động khi push
