# Workspace API Specification
> Kanban Project · `/api/v1/workspaces` · Framework: **Hono** · DB: **Drizzle ORM + PostgreSQL**

---

## Data Models

### Workspace
| Field | Type | Constraint |
|---|---|---|
| `id` | bigserial | PK |
| `publicId` | varchar(12) | UNIQUE, NOT NULL |
| `name` | varchar(255) | NOT NULL |
| `description` | text | nullable |
| `slug` | varchar(255) | UNIQUE, NOT NULL |
| `plan` | enum(`free`,`pro`,`enterprise`) | default `free` |
| `showEmailsToMembers` | boolean | default `true` |
| `createdBy` | uuid → users.id | SET NULL on delete |
| `createdAt` | timestamp | defaultNow |
| `updatedAt` | timestamp | nullable |
| `deletedAt` | timestamp | nullable (soft delete) |
| `deletedBy` | uuid → users.id | SET NULL on delete |

### WorkspaceMember
| Field | Type | Constraint |
|---|---|---|
| `id` | bigserial | PK |
| `publicId` | varchar(12) | UNIQUE |
| `email` | varchar(255) | NOT NULL |
| `userId` | uuid → users.id | nullable (SET NULL) |
| `workspaceId` | bigint → workspaces.id | CASCADE delete |
| `role` | enum(`admin`,`member`,`guest`) | NOT NULL |
| `roleId` | bigint → workspaceRoles.id | RESTRICT delete |
| `status` | enum(`invited`,`active`,`removed`,`paused`) | default `invited` |
| `createdBy` | uuid | NOT NULL |
| `createdAt` | timestamp | defaultNow |
| `deletedAt` | timestamp | nullable |

---

## Standard Response Format

```jsonc
// Success
{ "success": true, "data": { ... }, "message": "..." }

// Error
{ "success": false, "error": { "code": "ERROR_CODE", "message": "..." } }
```

---

## Endpoints

### 1. Workspace CRUD

#### `GET /api/v1/workspaces`
Lấy danh sách workspace mà authenticated user là thành viên.

**Auth:** JWT required

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "publicId": "ws_abc123xyz",
      "name": "My Team",
      "slug": "my-team",
      "plan": "free",
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

---

#### `POST /api/v1/workspaces`
Tạo workspace mới. Creator tự động được gán role `admin`.

**Auth:** JWT required

**Request Body:**
```json
{
  "name": "My Team",           // required, 1–255 chars
  "description": "...",        // optional
  "slug": "my-team",           // required, unique, lowercase, alphanumeric + hyphen
  "plan": "free"               // optional, default "free"
}
```

**Validation rules:**
- `name`: required, non-empty, max 255 chars
- `slug`: required, unique, regex `/^[a-z0-9-]+$/`, max 255 chars
- `plan`: optional, must be one of `free | pro | enterprise`

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "publicId": "ws_abc123xyz",
    "name": "My Team",
    "slug": "my-team",
    "plan": "free",
    "createdAt": "2026-01-01T00:00:00Z"
  },
  "message": "Workspace created successfully"
}
```

**Errors:**
- `400` – Validation failed (`VALIDATION_ERROR`)
- `409` – Slug already exists (`SLUG_CONFLICT`)

---

#### `GET /api/v1/workspaces/:publicId`
Lấy chi tiết một workspace.

**Auth:** JWT required + must be member

**Path params:** `publicId` – public identifier of workspace

**Response 200:** workspace object with members count

**Errors:**
- `403` – Not a member (`FORBIDDEN`)
- `404` – Workspace not found (`WORKSPACE_NOT_FOUND`)

---

#### `PATCH /api/v1/workspaces/:publicId`
Cập nhật thông tin workspace. Chỉ `admin` mới được phép.

**Auth:** JWT required + role `admin`

**Request Body** (all fields optional):
```json
{
  "name": "New Name",
  "description": "Updated description",
  "showEmailsToMembers": false
}
```

**Response 200:** updated workspace object

**Errors:**
- `400` – Validation failed
- `403` – Not admin (`FORBIDDEN`)
- `404` – Not found

---

#### `DELETE /api/v1/workspaces/:publicId`
Soft delete workspace. Chỉ `admin` (Owner) mới được phép.

**Auth:** JWT required + role `admin`

**Behavior:** Sets `deletedAt` and `deletedBy`, does NOT physically delete.

**Response 200:**
```json
{ "success": true, "message": "Workspace deleted successfully" }
```

**Errors:**
- `403` – Not admin
- `404` – Not found

---

### 2. Member Management

#### `GET /api/v1/workspaces/:publicId/members`
Lấy danh sách thành viên (kể cả `invited`).

**Auth:** JWT required + member of workspace

**Query params:**
| Param | Type | Description |
|---|---|---|
| `status` | string | Filter: `invited \| active \| removed \| paused` |
| `role` | string | Filter: `admin \| member \| guest` |

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "publicId": "mem_xyz",
      "email": "alice@example.com",
      "role": "member",
      "status": "active",
      "userId": "uuid-...",
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

---

#### `POST /api/v1/workspaces/:publicId/members`
Mời thành viên mới vào workspace. Email được lưu với status `invited`.

**Auth:** JWT required + role `admin`

**Request Body:**
```json
{
  "email": "bob@example.com",   // required, valid email
  "role": "member"              // required: admin | member | guest
}
```

**Behavior:**
- Tạo record `workspace_members` với `status = "invited"`
- Lời mời tự động hết hạn sau 12 giờ (xử lý bởi background job)

**Response 201:**
```json
{
  "success": true,
  "data": { "publicId": "mem_abc", "email": "bob@example.com", "status": "invited" },
  "message": "Invitation sent"
}
```

**Errors:**
- `400` – Invalid email / role
- `403` – Not admin
- `409` – Email already member (`MEMBER_EXISTS`)

---

#### `PATCH /api/v1/workspaces/:publicId/members/:memberPublicId`
Thay đổi role của thành viên.

**Auth:** JWT required + role `admin`

**Request Body:**
```json
{ "role": "guest" }
```

**Response 200:** updated member object

**Errors:**
- `400` – Invalid role
- `403` – Not admin
- `404` – Member not found

---

#### `DELETE /api/v1/workspaces/:publicId/members/:memberPublicId`
Xóa (soft) thành viên khỏi workspace. Cũng dùng để thu hồi lời mời `invited`.

**Auth:** JWT required + role `admin` (hoặc self-removal)

**Behavior:** Sets `deletedAt`, status → `removed`

**Response 200:**
```json
{ "success": true, "message": "Member removed" }
```

---

### 3. Role & Permission Management

#### `GET /api/v1/workspaces/:publicId/roles`
Lấy danh sách custom roles trong workspace.

**Auth:** JWT required + member

**Response 200:** array of `workspaceRoles` objects

---

#### `POST /api/v1/workspaces/:publicId/roles`
Tạo custom role.

**Auth:** JWT required + role `admin`

**Request Body:**
```json
{
  "name": "Reviewer",
  "description": "Can review but not edit",
  "hierarchyLevel": 2
}
```

**Validation:**
- `name`: unique per workspace, max 64 chars
- `hierarchyLevel`: integer ≥ 0

**Response 201:** created role object

**Errors:**
- `409` – Role name already exists in workspace

---

## Error Code Reference

| Code | HTTP | Description |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Input fails Zod schema |
| `UNAUTHORIZED` | 401 | Missing/invalid JWT |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `WORKSPACE_NOT_FOUND` | 404 | Workspace does not exist or is deleted |
| `MEMBER_NOT_FOUND` | 404 | Member not found |
| `SLUG_CONFLICT` | 409 | Slug already taken |
| `MEMBER_EXISTS` | 409 | Email already a member |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
