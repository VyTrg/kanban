# API Architecture Guide (SOA & RESTful)

Tài liệu này quy định các tiêu chuẩn và cấu trúc cho các API Services trong hệ thống Kanban.

## 1. Nguyên tắc chung (Core Principles)
- **Stateless**: Mỗi request phải độc lập và chứa đầy đủ thông tin xác thực (Sử dụng JWT).
- **Versioning**: Tiền tố phiên bản bắt buộc: `/api/v1/...`.
- **RESTful naming**: Sử dụng danh từ số nhiều cho tài nguyên (vd: `/boards`, `/tasks`).
- **HTTP Methods**: Sử dụng đúng ý nghĩa của các phương thức truyền tin.

---

## 2. Định dạng phản hồi chuẩn (Response Format)

### Thành công (Success)
```json
{
  "success": true,
  "data": { ... },
  "message": "Thao tác thành công"
}
```

### Lỗi (Error)
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mô tả lỗi chi tiết"
  }
}
```

---

## 3. Mẫu ví dụ chuẩn RESTful (Resource: Boards)

Dưới đây là mẫu ví dụ áp dụng cho tài nguyên **Boards** (`/api/v1/boards`):

### **A. Lấy dữ liệu (GET)**
*   **Lấy danh sách**: `GET /api/v1/boards`
*   **Lấy chi tiết**: `GET /api/v1/boards/:id`
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        { "id": "b1", "name": "Dự án A", "workspaceId": "ws1" }
      ]
    }
    ```

### **B. Tạo mới (POST)**
*   **Endpoint**: `POST /api/v1/boards`
*   **Request Body**:
    ```json
    {
      "name": "Bảng Kế Hoạch Mới",
      "workspaceId": "ws1"
    }
    ```
*   **Response (201 Created)**:
    ```json
    {
      "success": true,
      "data": { "id": "b2", "name": "Bảng Kế Hoạch Mới" },
      "message": "Đã tạo bảng thành công"
    }
    ```

### **C. Cập nhật (PATCH/PUT)**
*   **Endpoint**: `PATCH /api/v1/boards/:id`
*   **Mô tả**: Dùng `PATCH` để cập nhật một vài trường dữ liệu.
*   **Request Body**:
    ```json
    {
      "name": "Tên Bảng Đã Chỉnh Sửa"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": { "id": "b2", "name": "Tên Bảng Đã Chỉnh Sửa" }
    }
    ```

### **D. Xóa (DELETE)**
*   **Endpoint**: `DELETE /api/v1/boards/:id`
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Đã xóa bảng thành công"
    }
    ```

---

## 4. Các mã lỗi thường gặp (HTTP Status Codes)

| Status | Ý nghĩa | Trường hợp sử dụng |
| :--- | :--- | :--- |
| **200** | OK | Truy vấn hoặc cập nhật/xóa thành công. |
| **201** | Created | Tạo mới tài nguyên thành công. |
| **400** | Bad Request | Dữ liệu gửi lên không hợp lệ (sai định dạng). |
| **401** | Unauthorized | Người dùng chưa đăng nhập hoặc token hết hạn. |
| **403** | Forbidden | Đã đăng nhập nhưng không có quyền truy cập tài nguyên. |
| **404** | Not Found | Không tìm thấy ID tài nguyên yêu cầu. |
| **500** | Internal Server Error | Lỗi hệ thống từ phía server. |
