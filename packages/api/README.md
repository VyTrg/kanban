# @kanban/api

Đây là backend service cho hệ thống Kanban, được xây dựng theo kiến trúc SOA (Service Oriented Architecture) và RESTful API.

## 🛠 Tech Stack
- **Framework**: [Hono](https://hono.dev/) - Siêu nhẹ, siêu nhanh và hỗ trợ TypeScript hoàn hảo.
- **Runtime**: Node.js (tương thích tốt với Next.js ecosystem).
- **Validation**: [Zod](https://zod.dev/) - Đảm bảo dữ liệu đầu vào luôn chính xác.
- **Database**: [@kanban/db](../db/) (Drizzle ORM + PostgreSQL).
- **Server**: `@hono/node-server` (dễ dàng deploy bằng Docker/VPS).

## 📂 Cấu trúc thư mục (Folder Structure)

```text
packages/api/
├── src/
│   ├── index.ts              # Entry point (Khởi tạo Hono server)
│   ├── app.ts                # Cấu hình chính (Middleware, Error handling)
│   ├── routes/               # Định nghĩa các Endpoint (GET, POST, PATCH, DELETE)
│   │   └── v1/               # API version 1
│   │       ├── index.ts      # Gom tất cả routes v1
│   │       └── boards/       # Tài nguyên Boards (theo api.md)
│   ├── services/             # Tầng xử lý Logic & Database (Business Logic)
│   ├── scripts/              # Các script tiện ích (Test DB, Seed, Migration)
│   ├── middlewares/          # Bộ lọc trung gian (Auth, Logger, Validation)
│   ├── validations/          # Định nghĩa Zod Schemas
│   ├── lib/                  # Tiện ích dùng chung (Response formatter, JWT)
│   ├── types/                # Định nghĩa TypeScript dùng chung
│   └── config/               # Quản lý biến môi trường (.env)
├── package.json
└── tsconfig.json
```

## 🚀 Nguyên tắc phát triển (Development Principles)

### 1. Phản hồi chuẩn (Standard Response)
Tất cả API phải trả về format như sau (đã định nghĩa trong `src/lib/response.ts`):
- **Thành công**: `{ "success": true, "data": { ... }, "message": "..." }`
- **Thất bại**: `{ "success": false, "error": { "code": "...", "message": "..." } }`

### 2. Phân tách nhiệm vụ (Separation of Concerns)
- **Routes**: Chỉ làm nhiệm vụ định tuyến và gọi Service.
- **Services**: Nơi thực hiện query database (`@kanban/db`) và xử lý logic nghiệp vụ.
- **Validations**: Luôn kiểm tra `request.body` bằng Zod trước khi vào Controller/Service.

### 3. Type-safety
Tận dụng tối đa kiểu dữ liệu từ `@kanban/db` để backend luôn đồng bộ với cấu trúc database.

## ⚙️ Chuẩn bị môi trường (Prerequisites)
Trước khi chạy ứng dụng hoặc thực hiện test, hãy đảm bảo:
1. **Khởi động Database**:
   ```bash
   cd packages/db
   docker-compose up -d
   ```
2. **Đồng bộ Schema**:
   ```bash
   cd packages/db
   npm run db:push
   ```
3. **Cấu hình Environment**: Copy file `.env` vào `packages/api/` (xem `.example.env` ở root).

## 💻 Lệnh thực thi (Scripts)
- `npm run dev`: Chạy server ở chế độ development (watch mode).
- `npm run test:db`: Kiểm tra kết nối tới database pool.
- `npm run build`: Build dự án sang JS thuần.
- `npm run start`: Chạy bản build trong môi trường production.
