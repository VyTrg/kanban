# Tài liệu Use Cases / User Stories
## Phần mềm quản lý công việc

- **Phiên bản tài liệu:** 1.0
- **Ngày cập nhật:** 2026-01-03
- **Người phụ trách:** 

---

## Quy ước viết User Story
**Là một [Loại người dùng], tôi muốn [Thực hiện một nhiệm vụ] để [Đạt được mục tiêu/lợi ích].**

---
## US-: Khởi tạo Workspace mới
**Là một** Quản trị viên dự án,  
**Tôi muốn** tạo một không gian làm việc (workspace) mới,  
**Để** có thể cô lập các dự án và thành viên của các tổ chức khác nhau.

**Acceptance Criteria:**
- **AC1: Tạo workspace thành công**
    - **Given:** Tôi ở trang dashboard và điền đầy đủ thông tin (tên duy nhất, mô tả tùy chọn)
    - **When:** Tôi nhấn nút "Tạo Workspace"
    - **Then:** Workspace mới được tạo và hệ thống tự động gán tôi làm 'Owner' (Chủ sở hữu)
- **AC2: Truy cập workspace**
    - **Given:** Workspace đã được tạo thành công
    - **When:** Tôi kiểm tra danh sách workspace hoặc truy cập qua đường dẫn định danh
    - **Then:** Tôi có thể truy cập vào dashboard riêng biệt của workspace đó

---

## US-: Mời thành viên và Quản lý lời mời
**Là một** Chủ sở hữu Workspace,  
**Tôi muốn** mời người dùng vào workspace của mình,  
**Để** chúng tôi có thể cộng tác trên các nhiệm vụ trong một môi trường bảo mật.

**Acceptance Criteria:**
- **AC1: Gửi lời mời qua email/link**
    - **Given:** Tôi đang ở mục quản lý thành viên
    - **When:** Tôi nhập email người dùng hoặc tạo liên kết mời
    - **Then:** Hệ thống gửi email mời và người dùng xuất hiện trong danh sách "Pending Invitations"
- **AC2: Bảo mật truy cập**
    - **Given:** Một người dùng không có trong danh sách mời cố gắng truy cập workspace
    - **When:** Họ truy cập URL của workspace
    - **Then:** Hệ thống từ chối truy cập và yêu cầu xác thực/lời mời hợp lệ
- **AC3: Thu hồi lời mời**
    - **Given:** Có một lời mời đang ở trạng thái chờ (Pending)
    - **When:** Tôi nhấn nút "Thu hồi" (Revoke)
    - **Then:** Liên kết mời bị vô hiệu hóa và người dùng đó không thể tham gia qua link cũ

---

## US-: Phân quyền vai trò 
**Là một** Quản trị viên chú trọng bảo mật,  
**Tôi muốn** chỉ định các vai trò cụ thể (Owner, Member, Observer),  
**Để** giới hạn quyền hạn thay đổi cấu trúc của workspace.

**Acceptance Criteria:**
- **AC1: Kiểm soát quyền hạn**
    - **Given:** Người dùng đã tham gia workspace với vai trò được gán
    - **Then:** - **Owner:** Có toàn quyền (xóa workspace, cài đặt, quản lý thành viên).
        - **Member:** Có thể tạo/sửa board và card nhưng không được xóa workspace.
        - **Observer:** Chỉ có quyền xem (Read-only), không được chỉnh sửa nội dung.
- **AC2: Thay đổi vai trò**
    - **Given:** Tôi là Owner của workspace
    - **When:** Tôi thay đổi vai trò của một thành viên trong danh sách quản lý
    - **Then:** Quyền hạn của thành viên đó được cập nhật ngay lập tức theo vai trò mới

---

## US-: Tổ chức đa bảng 
**Là một** Quản lý dự án,  
**Tôi muốn** tổ chức nhiều bảng công việc trong một workspace duy nhất,  
**Để** có cái nhìn tổng quan về tất cả các hoạt động của nhóm.

**Acceptance Criteria:**
- **AC1: Hiển thị danh sách bảng**
    - **Given:** Tôi truy cập vào trang chủ của workspace
    - **When:** Tôi xem danh sách Board
    - **Then:** Tất cả các bảng đang hoạt động được hiển thị rõ ràng (dạng List)
- **AC2: Lưu trữ (Archive) bảng**
    - **Given:** Một bảng không còn cần thiết cho hoạt động hiện tại
    - **When:** Tôi chọn tính năng "Archive"
    - **Then:** Bảng đó bị ẩn khỏi màn hình chính nhưng không bị xóa vĩnh viễn dữ liệu
- **AC3: Tìm kiếm xuyên bảng**
    - **Given:** Tôi nhập từ khóa vào thanh tìm kiếm chung của Workspace
    - **When:** Tôi nhấn Enter
    - **Then:** Hệ thống hiển thị tất cả các thẻ (cards) liên quan từ mọi bảng con trong workspace đó

---

## US-: Tùy chỉnh thương hiệu & Cài đặt
**Là một** Trưởng nhóm,  
**Tôi muốn** tùy chỉnh các cài đặt của workspace như logo và giao diện,  
**Để** không gian làm việc phù hợp với bộ nhận diện của nhóm.

**Acceptance Criteria:**
- **AC1: Cập nhật Logo**
    - **Given:** Tôi chọn một file ảnh hợp lệ (PNG/JPG)
    - **When:** Tôi nhấn "Tải lên" trong phần cài đặt thương hiệu
    - **Then:** Logo mới hiển thị đồng bộ trên workspace
- **AC2: Chế độ hiển thị (Dark/Light mode)**
    - **Given:** Tôi muốn thay đổi giao diện làm việc
    - **When:** Tôi gạt nút chọn chế độ "Dark" hoặc "Light"
    - **Then:** Hệ thống cập nhật giao diện ngay lập tức cho toàn bộ người dùng hoặc cấp độ cá nhân tùy cấu hình

---
