# Tài liệu Use Cases / User Stories
## Phần mềm quản lý công việc

- **Phiên bản tài liệu:** 1.0
- **Ngày cập nhật:** 2026-03-01
- **Người phụ trách: Nguyễn Phước Tiến** 

---

## Quy ước viết User Story
**Là một [Loại người dùng], tôi muốn [Thực hiện một nhiệm vụ] để [Đạt được mục tiêu/lợi ích].**

---

### US-01: Xem Dashboard thống kê dự án
**Là một** thành viên hoặc quản trị viên dự án, **Tôi muốn** xem biểu đồ và số lượng tổng hợp các công việc (mới, đang làm, đã hoàn thành), **Để** tôi có cái nhìn tổng quan nhanh chóng về tiến độ và hiệu suất của dự án.

**Acceptance Criteria (Given/When/Then):**

* **AC1: Hiển thị số lượng công việc theo trạng thái**
    * **Given:** Tôi đang ở trang Dashboard chính.
    * **When:** Trang web được tải xong.
    * **Then:** Hệ thống hiển thị các con số tổng hợp trực quan (ví dụ: 10 việc mới, 5 việc đang làm, 20 việc hoàn thành) trong khoảng thời gian mặc định (ví dụ: 7 ngày qua).
* **AC2: Lọc dữ liệu theo thời gian**
    * **Given:** Tôi đang ở trang Dashboard.
    * **When:** Tôi chọn bộ lọc thời gian là "Tháng này" hoặc "Hôm nay".
    * **Then:** Các con số thống kê và biểu đồ tự động cập nhật để phản ánh đúng dữ liệu trong khung giờ đã chọn.
* **AC3: Hiển thị biểu đồ xu hướng**
    * **Given:** Có dữ liệu về các thay đổi trạng thái công việc trong hệ thống.
    * **When:** Tôi xem phần biểu đồ trên Dashboard.
    * **Then:** Hệ thống hiển thị biểu đồ đường (line chart) hoặc biểu đồ cột biểu thị lượng công việc hoàn thành qua từng ngày.



---

### US-02: Theo dõi dòng hoạt động của thành viên
**Là một** trưởng nhóm (Team Lead), **Tôi muốn** xem danh sách các hoạt động gần đây của các thành viên khác, **Để** tôi nắm bắt được ai đang làm gì và sự tương tác trong nhóm diễn ra như thế nào.

**Acceptance Criteria (Given/When/Then):**

* **AC1: Hiển thị danh sách hoạt động theo thời gian thực**
    * **Given:** Tôi đang ở mục "Hoạt động gần đây" trên Dashboard hoặc trang báo cáo.
    * **When:** Có thành viên thực hiện các thao tác (tạo task, comment, đổi trạng thái task, đính kèm file).
    * **Then:** Hệ thống hiển thị một dòng thông báo theo định dạng: `[Tên thành viên] đã [Hành động] trên [Tên công việc] vào lúc [Thời gian]`.
* **AC2: Phân loại hành động bằng màu sắc hoặc icon**
    * **Given:** Danh sách hoạt động đang hiển thị.
    * **When:** Tôi quan sát danh sách.
    * **Then:** Các hành động quan trọng (như hoàn thành task) được đánh dấu màu xanh, các hành động mang tính xóa hoặc hủy được đánh dấu màu đỏ để dễ nhận biết.
* **AC3: Truy cập nhanh từ dòng hoạt động**
    * **Given:** Tôi thấy một dòng thông báo về một công việc cụ thể.
    * **When:** Tôi nhấn vào tên công việc hoặc link trong dòng hoạt động đó.
    * **Then:** Hệ thống điều hướng tôi trực tiếp đến trang chi tiết của công việc đó.
