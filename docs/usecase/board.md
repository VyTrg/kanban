# TÀI LIỆU ĐẶC TẢ YÊU CẦU & USE CASE - PROJECT MANAGEMENT SYSTEM

## 1. Danh sách User Stories (US)

| Mã US | Tên User Story | Mô tả tóm tắt |
| :--- | :--- | :--- |
| **US01** | Tạo công việc | Tạo Card mới vào một List cụ thể. |
| **US02** | Chỉnh sửa Card | Cập nhật tiêu đề và mô tả công việc. |
| **US03** | Xóa công việc | Loại bỏ Card kèm hộp thoại xác nhận. |
| **US04** | Phân công công việc | Gán thành viên chịu trách nhiệm cho Card. |
| **US05** | Gắn thẻ công việc | Thêm/Xóa/Cập nhật nhãn (Labels) cho Card. |
| **US06** | Thiết lập hạn | Cài đặt ngày hết hạn (Due date) cho công việc. |
| **US07** | Tạo Danh sách | Tạo cột (List) mới để phân loại công việc. |
| **US08** | Chỉnh sửa List | Thay đổi tên của Danh sách. |
| **US09** | Thay đổi List của Card | Di chuyển Card giữa các List (Dropdown/Detail). |
| **US10** | Xóa/Lưu trữ List | Loại bỏ toàn bộ List khỏi bảng làm việc. |

---

## 2. Đặc tả chi tiết Use Case (UC Specification)

### UC01 – Tạo công việc
- **Mã ID**: UC01
- **Actor**: Thành viên
- **Mô tả**: Cho phép tạo Card mới trong không gian làm việc.
- **Tiền điều kiện**: Đã đăng nhập và đang ở trong một Board.
- **Luồng chính**:
  1. Thành viên nhấn “Thêm công việc”.
  2. Nhập tiêu đề và mô tả.
  3. Nhấn “Lưu”.
  4. Hệ thống kiểm tra, lưu Database và hiển thị ở cuối List.
- **Luồng thay thế**: Nếu tiêu đề trống, nút “Lưu” bị khóa và hiển thị lỗi.

### UC05 – Phân công thành viên
- **Mã ID**: UC05
- **Actor**: Quản lý dự án / Thành viên
- **Luồng chính**:
  1. Mở chi tiết Card, chọn “Thêm thành viên”.
  2. Hệ thống hiển thị danh sách thành viên dự án.
  3. Chọn thành viên cần gán.
  4. Hệ thống lưu và hiển thị Avatar trên thẻ Card.

### UC10 – Lưu trữ Danh sách (List)
- **Mã ID**: UC11 (Theo tài liệu US10)
- **Actor**: Quản lý / Thành viên
- **Luồng chính**:
  1. Chọn Menu tại List cần xóa.
  2. Chọn “Lưu trữ danh sách” và xác nhận.
  3. Hệ thống gỡ List và các Card bên trong khỏi Board.

---

## 3. Quy tắc Thiết kế API (Dành cho Team Lead)

Để đảm bảo tính nhất quán (Consistency) trong quá trình phát triển, các API cần tuân thủ cấu trúc sau:

### Tiêu chuẩn Header
- `Authorization`: `Bearer <MemberToken>`
- `Content-Type`: `application/json`

### Danh sách API Endpoint mẫu
| Chức năng | Method | Endpoint | Body (Ví dụ) |
| :--- | :--- | :--- | :--- |
| **Tạo Card** | `POST` | `/lists/{list_id}/Cards` | `{"title": "Card A"}` |
| **Sửa Card** | `PATCH` | `/Cards/{Card_id}` | `{"description": "New content"}` |
| **Xóa Card** | `DELETE` | `/Cards/{Card_id}` | N/A |
| **Gán Member** | `POST` | `/Cards/{Card_id}/assignees` | `{"user_id": 101}` |
| **Sửa List** | `PATCH` | `/lists/{list_id}` | `{"name": "Done Cards"}` |

---

## 4. Biểu đồ Hoạt động (Activity Diagram)

### Luồng: Tạo công việc mới
1. **Bắt đầu** -> Người dùng nhấn "Thêm thẻ".
2. **Kiểm tra**: Tiêu đề có trống không?
   - **Có**: Disable nút Lưu, hiển thị cảnh báo.
   - **Không**: Cho phép nhấn Lưu.
3. **Server xử lý**: Lưu vào DB.
4. **Kết thúc**: Hiển thị Card mới ở cuối danh sách.

### Luồng: Xóa công việc
1. **Bắt đầu** -> Nhấn "Xóa".
2. **Hệ thống**: Hiển thị Modal xác nhận.
3. **Lựa chọn**:
   - **Hủy**: Đóng Modal, không làm gì cả.
   - **Xác nhận**: Gọi API DELETE -> Hiển thị thông báo "Xóa thành công".
4. **Kết thúc**.