# Tài liệu Use Cases / User Stories
## Phần mềm quản lý công việc

- **Phiên bản tài liệu:** 1.0
- **Ngày cập nhật:** 2026-01-03
- **Người phụ trách:** 

---

## Quy ước viết User Story
**Là một [Loại người dùng], tôi muốn [Thực hiện một nhiệm vụ] để [Đạt được mục tiêu/lợi ích].**

---

## US-01: Đăng ký tài khoản mới
**Là một** người dùng mới,
**Tôi muốn** đăng ký tài khoản bằng email và mật khẩu,
**Để** có thể tham gia và sử dụng các tính năng của nền tảng.

**Acceptance Criteria (Given/When/Then):**
- **AC1: Đăng ký thành công**
    - **Given:** Tôi ở trang đăng ký và điền đầy đủ thông tin hợp lệ (email chưa tồn tại, mật khẩu đủ mạnh)
    - **When:** Tôi nhấn nút "Đăng ký"
    - **Then:** Hệ thống gửi email xác thực và hiển thị thông báo "Vui lòng kiểm tra email để kích hoạt tài khoản"
- **AC2: Xử lý email trùng lặp**
    - **Given:** Tôi điền một email đã được đăng ký trong hệ thống
    - **When:** Tôi nhấn nút "Đăng ký"
    - **Then:** Hệ thống hiển thị lỗi "Email này đã được sử dụng" và không cho phép đăng ký
- **AC3: Xác thực email**
    - **Given:** Tôi nhận được email xác thực và nhấn vào link trong email
    - **When:** Link được mở trong trình duyệt
    - **Then:** Tài khoản của tôi được kích hoạt và tôi được chuyển hướng đến trang đăng nhập với thông báo "Kích hoạt tài khoản thành công"

---

## US-02: Đăng bài viết
**Là một** người dùng đã đăng nhập,
**Tôi muốn** có thể tạo và đăng một bài viết có văn bản và hình ảnh lên News Feed của tôi,
**Để** chia sẻ thông tin với những người theo dõi tôi.

**Acceptance Criteria:**
- **AC1: Đăng bài thành công**
    - **Given:** Tôi đã đăng nhập và ở trang soạn thảo bài viết, tôi đã nhập nội dung văn bản (tối thiểu 1 ký tự) và chọn một hình ảnh (tùy chọn)
    - **When:** Tôi nhấn nút "Đăng"
    - **Then:** Bài viết xuất hiện trên đầu News Feed của tôi và của những người theo dõi tôi, và tôi thấy thông báo "Đăng bài thành công"
- **AC2: Đăng bài không có nội dung**
    - **Given:** Tôi không nhập bất kỳ nội dung văn bản nào
    - **When:** Tôi nhấn nút "Đăng"
    - **Then:** Nút "Đăng" bị vô hiệu hóa hoặc hệ thống hiển thị lỗi "Vui lòng nhập nội dung bài viết"
- **AC3: Hủy đăng bài**
    - **Given:** Tôi đã nhập nội dung nhưng muốn hủy
    - **When:** Tôi nhấn nút "Hủy"
    - **Then:** Hệ thống hiển thị hộp thoại xác nhận "Bạn có chắc chắn muốn hủy?", nếu xác nhận, nội dung sẽ bị xóa và tôi quay lại News Feed.

---

## US-03: Đăng nhập
**Là một** người dùng đã có tài khoản,
**Tôi muốn** đăng nhập vào hệ thống bằng email và mật khẩu,
**Để** truy cập các tính năng của nền tảng.

**Acceptance Criteria:**
- **AC1: Đăng nhập thành công**
    - **Given:** Tôi ở trang đăng nhập và điền đúng email và mật khẩu
    - **When:** Tôi nhấn nút "Đăng nhập"
    - **Then:** Tôi được chuyển hướng đến trang News Feed
- **AC2: Đăng nhập thất bại**
    - **Given:** Tôi điền sai email hoặc mật khẩu
    - **When:** Tôi nhấn nút "Đăng nhập"
    - **Then:** Hệ thống hiển thị lỗi "Email hoặc mật khẩu không chính xác"

---

## US-04: Quản lý hồ sơ cá nhân
**Là một** người dùng đã đăng nhập,
**Tôi muốn** chỉnh sửa thông tin hồ sơ cá nhân (avatar, bio, tên hiển thị),
**Để** cá nhân hóa trang cá nhân của mình.

**Acceptance Criteria:**
- **AC1: Cập nhật thông tin thành công**
    - **Given:** Tôi ở trang chỉnh sửa hồ sơ và đã thay đổi thông tin
    - **When:** Tôi nhấn nút "Lưu"
    - **Then:** Thông tin được cập nhật và hiển thị thông báo "Cập nhật hồ sơ thành công"
- **AC2: Upload avatar**
    - **Given:** Tôi chọn một file ảnh (JPG, PNG) có kích thước < 5MB
    - **When:** Tôi nhấn "Upload"
    - **Then:** Ảnh được tải lên và hiển thị làm avatar mới

---

## US-05: Xem News Feed
**Là một** người dùng đã đăng nhập,
**Tôi muốn** xem News Feed hiển thị các bài viết từ những người tôi theo dõi,
**Để** cập nhật thông tin từ mạng lưới của mình.

**Acceptance Criteria:**
- **AC1: Hiển thị bài viết**
    - **Given:** Tôi đã đăng nhập và đang theo dõi ít nhất một người dùng khác
    - **When:** Tôi truy cập trang News Feed
    - **Then:** Các bài viết từ những người tôi theo dõi được hiển thị theo thứ tự thời gian mới nhất
- **AC2: Feed rỗng**
    - **Given:** Tôi chưa theo dõi ai
    - **When:** Tôi truy cập trang News Feed
    - **Then:** Hiển thị thông báo "Hãy theo dõi người dùng để xem bài viết" kèm gợi ý người dùng

---

## US-06: Like bài viết
**Là một** người dùng đã đăng nhập,
**Tôi muốn** like một bài viết,
**Để** thể hiện sự quan tâm đến nội dung đó.

**Acceptance Criteria:**
- **AC1: Like thành công**
    - **Given:** Tôi đang xem một bài viết chưa được like
    - **When:** Tôi nhấn nút "Like"
    - **Then:** Số lượng like tăng lên 1 và nút Like đổi trạng thái
- **AC2: Unlike**
    - **Given:** Tôi đã like một bài viết
    - **When:** Tôi nhấn nút "Like" lần nữa
    - **Then:** Số lượng like giảm đi 1 và nút Like trở về trạng thái ban đầu

---

## US-07: Bình luận bài viết
**Là một** người dùng đã đăng nhập,
**Tôi muốn** bình luận vào một bài viết,
**Để** chia sẻ ý kiến và tương tác với người đăng.

**Acceptance Criteria:**
- **AC1: Bình luận thành công**
    - **Given:** Tôi đang xem một bài viết và đã nhập nội dung bình luận
    - **When:** Tôi nhấn nút "Gửi"
    - **Then:** Bình luận xuất hiện trong danh sách bình luận của bài viết
- **AC2: Bình luận rỗng**
    - **Given:** Tôi không nhập nội dung bình luận
    - **When:** Tôi nhấn nút "Gửi"
    - **Then:** Nút "Gửi" bị vô hiệu hóa hoặc hiển thị lỗi

---

## US-08: Theo dõi người dùng
**Là một** người dùng đã đăng nhập,
**Tôi muốn** theo dõi một người dùng khác,
**Để** xem bài viết của họ trên News Feed của tôi.

**Acceptance Criteria:**
- **AC1: Theo dõi thành công**
    - **Given:** Tôi đang xem trang cá nhân của người dùng khác mà tôi chưa theo dõi
    - **When:** Tôi nhấn nút "Theo dõi"
    - **Then:** Nút đổi thành "Đang theo dõi" và bài viết của họ xuất hiện trên News Feed của tôi
- **AC2: Hủy theo dõi**
    - **Given:** Tôi đang theo dõi một người dùng
    - **When:** Tôi nhấn nút "Đang theo dõi"
    - **Then:** Hệ thống hiển thị xác nhận, nếu đồng ý, tôi hủy theo dõi người đó

---

## US-09: Tìm kiếm người dùng
**Là một** người dùng đã đăng nhập,
**Tôi muốn** tìm kiếm người dùng khác theo tên hoặc username,
**Để** kết nối với họ.

**Acceptance Criteria:**
- **AC1: Tìm kiếm có kết quả**
    - **Given:** Tôi nhập từ khóa tìm kiếm khớp với tên/username của người dùng
    - **When:** Tôi nhấn "Tìm kiếm"
    - **Then:** Danh sách người dùng phù hợp được hiển thị
- **AC2: Không có kết quả**
    - **Given:** Tôi nhập từ khóa không khớp với bất kỳ ai
    - **When:** Tôi nhấn "Tìm kiếm"
    - **Then:** Hiển thị thông báo "Không tìm thấy người dùng nào"

---

## US-10: Quên mật khẩu
**Là một** người dùng quên mật khẩu,
**Tôi muốn** đặt lại mật khẩu qua email,
**Để** lấy lại quyền truy cập tài khoản.

**Acceptance Criteria:**
- **AC1: Gửi email reset thành công**
    - **Given:** Tôi nhập email đã đăng ký
    - **When:** Tôi nhấn "Gửi link đặt lại mật khẩu"
    - **Then:** Hệ thống gửi email chứa link đặt lại mật khẩu
- **AC2: Đặt lại mật khẩu thành công**
    - **Given:** Tôi nhấn vào link trong email và nhập mật khẩu mới hợp lệ
    - **When:** Tôi nhấn "Xác nhận"
    - **Then:** Mật khẩu được cập nhật và tôi có thể đăng nhập với mật khẩu mới

---

## US-11: Báo cáo bài viết
**Là một** người dùng đã đăng nhập,
**Tôi muốn** báo cáo một bài viết vi phạm,
**Để** giúp duy trì môi trường lành mạnh.

**Acceptance Criteria:**
- **AC1: Báo cáo thành công**
    - **Given:** Tôi đang xem một bài viết và chọn "Báo cáo"
    - **When:** Tôi chọn lý do báo cáo (Spam, Hate Speech, Harassment, v.v.) và nhấn "Gửi"
    - **Then:** Báo cáo được gửi đến queue kiểm duyệt và tôi thấy thông báo "Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét trong 24-72 giờ"
- **AC2: Chọn lý do báo cáo**
    - **Given:** Tôi đang ở màn hình báo cáo
    - **When:** Tôi xem danh sách lý do
    - **Then:** Tôi thấy các tùy chọn: Spam, Hate Speech, Harassment, Misinformation, Adult Content, Other (với text field)
- **AC3: Không thể báo cáo nhiều lần**
    - **Given:** Tôi đã báo cáo một bài viết
    - **When:** Tôi cố gắng báo cáo lại bài viết đó
    - **Then:** Hệ thống hiển thị "Bạn đã báo cáo bài viết này trước đó"

---

## US-12: Block người dùng
**Là một** người dùng đã đăng nhập,
**Tôi muốn** chặn một người dùng khác,
**Để** ngăn họ xem profile và tương tác với tôi.

**Acceptance Criteria:**
- **AC1: Block thành công**
    - **Given:** Tôi đang xem profile của người dùng khác mà tôi chưa block
    - **When:** Tôi nhấn menu "..." và chọn "Chặn người dùng"
    - **Then:** Hệ thống hiển thị xác nhận "Bạn có chắc chắn muốn chặn [username]?", nếu đồng ý:
        - Người đó không còn thấy profile của tôi
        - Người đó không thể comment hoặc like bài viết của tôi
        - Nếu đang follow nhau, cả hai bị unfollow tự động
        - Tôi không thấy bài viết của họ trong feed
- **AC2: Xem danh sách người đã block**
    - **Given:** Tôi ở trang Settings > Privacy
    - **When:** Tôi chọn "Blocked Users"
    - **Then:** Hiển thị danh sách tất cả người dùng tôi đã block với nút "Unblock"
- **AC3: Unblock người dùng**
    - **Given:** Tôi đang xem danh sách người đã block
    - **When:** Tôi nhấn "Unblock" trên một người dùng
    - **Then:** Hệ thống xác nhận, nếu đồng ý, người đó được unblock và có thể tương tác lại với tôi
- **AC4: Người bị block không biết**
    - **Given:** Tôi đã block một người dùng
    - **When:** Họ cố gắng truy cập profile của tôi
    - **Then:** Họ thấy thông báo "User not found" hoặc "This account is private" (không hiển thị rõ là bị block)

---

## US-13: Mute người dùng
**Là một** người dùng đã đăng nhập,
**Tôi muốn** tắt tiếng (mute) một người dùng,
**Để** không thấy bài viết của họ trong feed mà không cần unfollow.

**Acceptance Criteria:**
- **AC1: Mute thành công**
    - **Given:** Tôi đang theo dõi một người dùng
    - **When:** Tôi chọn menu "..." trên bài viết của họ và chọn "Mute"
    - **Then:** Bài viết của người đó không còn hiển thị trong News Feed của tôi, nhưng follow relationship vẫn giữ nguyên
- **AC2: Người bị mute không biết**
    - **Given:** Tôi đã mute một người dùng
    - **When:** Họ kiểm tra danh sách followers của họ
    - **Then:** Họ vẫn thấy tôi trong danh sách (không biết bị mute)
- **AC3: Unmute người dùng**
    - **Given:** Tôi đã mute một người dùng
    - **When:** Tôi vào Settings > Muted Accounts và chọn "Unmute"
    - **Then:** Bài viết của họ xuất hiện lại trong feed của tôi

---

## US-14: Quản lý thông báo (Notification Preferences)
**Là một** người dùng đã đăng nhập,
**Tôi muốn** tùy chỉnh loại thông báo tôi nhận được,
**Để** giảm nhiễu và chỉ nhận thông báo quan trọng.

**Acceptance Criteria:**
- **AC1: Cấu hình theo loại thông báo**
    - **Given:** Tôi ở trang Settings > Notifications
    - **When:** Tôi xem danh sách các loại thông báo
    - **Then:** Tôi thấy các tùy chọn:
        - Likes: Off / Real-time / Daily digest
        - Comments: Off / Real-time / Hourly / Daily digest
        - New Followers: Off / Real-time / Daily digest
        - Follow Requests: Real-time (không thể tắt)
        - Security Alerts: Real-time (không thể tắt)
- **AC2: Lưu cài đặt thành công**
    - **Given:** Tôi đã thay đổi các cài đặt thông báo
    - **When:** Tôi nhấn "Save"
    - **Then:** Cài đặt được lưu và tôi thấy thông báo "Notification preferences updated"
- **AC3: Tắt thông báo từ người cụ thể**
    - **Given:** Tôi đang xem profile của một người dùng tôi theo dõi
    - **When:** Tôi chọn "Turn off notifications from [username]"
    - **Then:** Tôi không còn nhận thông báo khi họ đăng bài mới hoặc tương tác với tôi
- **AC4: Quiet Hours (Giờ nghỉ)**
    - **Given:** Tôi ở trang Notification Settings
    - **When:** Tôi bật "Quiet Hours" và chọn thời gian (e.g., 22:00 - 08:00)
    - **Then:** Không có thông báo nào được gửi trong khoảng thời gian này (trừ Security Alerts)

---

## US-15: Cài đặt quyền riêng tư (Privacy Settings)
**Là một** người dùng đã đăng nhập,
**Tôi muốn** kiểm soát ai có thể xem profile và bài viết của tôi,
**Để** bảo vệ quyền riêng tư cá nhân.

**Acceptance Criteria:**
- **AC1: Chuyển sang Private Account**
    - **Given:** Tôi đang có account công khai (Public)
    - **When:** Tôi vào Settings > Privacy và chọn "Make account private"
    - **Then:** 
        - Profile của tôi chỉ followers hiện tại xem được
        - Người khác muốn follow phải gửi request
        - Bài viết cũ chỉ hiển thị cho followers
- **AC2: Cấu hình ai có thể comment**
    - **Given:** Tôi ở trang Privacy Settings
    - **When:** Tôi chọn "Who can comment on my posts"
    - **Then:** Tôi thấy các tùy chọn:
        - Everyone
        - Followers only
        - People I follow (mutual)
        - No one (disable comments)
- **AC3: Ẩn danh sách followers**
    - **Given:** Tôi ở trang Privacy Settings
    - **When:** Tôi chọn "Who can see my followers/following list"
    - **Then:** Tôi thấy các tùy chọn:
        - Everyone
        - Followers only
        - Only me
- **AC4: Approve follow requests**
    - **Given:** Tôi có private account và nhận follow request
    - **When:** Tôi vào Notifications > Follow Requests
    - **Then:** Tôi thấy danh sách requests với nút "Accept" và "Decline"
- **AC5: Cài đặt ai có thể xem bài viết**
    - **Given:** Tôi đang soạn một bài viết mới
    - **When:** Tôi chọn audience trước khi đăng
    - **Then:** Tôi thấy các tùy chọn:
        - Public (Everyone)
        - Followers only
        - Specific users (chọn từ danh sách)

---

## US-16 [Admin]: Review báo cáo vi phạm
**Là một** Admin/Moderator,
**Tôi muốn** xem và xử lý các báo cáo từ người dùng,
**Để** duy trì môi trường lành mạnh trên nền tảng.

**Acceptance Criteria:**
- **AC1: Xem queue báo cáo**
    - **Given:** Tôi đăng nhập với quyền Admin/Moderator
    - **When:** Tôi truy cập Admin Dashboard > Reports
    - **Then:** Tôi thấy danh sách báo cáo được sắp xếp theo priority:
        - Priority 1 (Critical): Hate speech, Violence - màu đỏ
        - Priority 2 (High): Harassment, Spam - màu cam
        - Priority 3 (Normal): Other - màu xám
- **AC2: Xem chi tiết báo cáo**
    - **Given:** Tôi đang xem danh sách báo cáo
    - **When:** Tôi click vào một báo cáo
    - **Then:** Tôi thấy:
        - Nội dung bị báo cáo (bài viết/comment)
        - Lý do báo cáo
        - Người báo cáo (có thể anonymous)
        - Thời gian báo cáo
        - Lịch sử vi phạm của người bị báo cáo (nếu có)
        - AI confidence score (nếu có)
- **AC3: Take action - Approve (No violation)**
    - **Given:** Tôi đang review một báo cáo
    - **When:** Tôi chọn "Approve" và nhập lý do
    - **Then:** 
        - Báo cáo được đánh dấu là "No violation"
        - Nội dung được giữ nguyên
        - Người báo cáo nhận notification: "Your report has been reviewed. No violation found."
- **AC4: Take action - Remove content**
    - **Given:** Tôi xác định có vi phạm
    - **When:** Tôi chọn "Remove" và chọn lý do (Spam, Hate Speech, v.v.)
    - **Then:**
        - Nội dung bị xóa khỏi hệ thống
        - Người đăng nhận warning notification với lý do
        - Người báo cáo nhận notification: "Thank you for reporting. Content has been removed."
        - Action được log vào violation history của user
- **AC5: Take action - Warn user**
    - **Given:** Vi phạm lần đầu hoặc không nghiêm trọng
    - **When:** Tôi chọn "Warn"
    - **Then:**
        - Nội dung được giữ
        - User nhận warning notification
        - Warning count tăng lên
        - Nếu warning >= 3, suggest suspend
- **AC6: Filter và search**
    - **Given:** Tôi ở trang Reports
    - **When:** Tôi sử dụng filters
    - **Then:** Tôi có thể filter theo:
        - Status: Pending, In Review, Resolved
        - Priority: Critical, High, Normal
        - Type: Spam, Hate Speech, Harassment, etc.
        - Date range

---

## US-17 [Admin]: Ban/Suspend người dùng
**Là một** Admin/Moderator,
**Tôi muốn** tạm ngưng hoặc cấm vĩnh viễn tài khoản vi phạm,
**Để** bảo vệ cộng đồng.

**Acceptance Criteria:**
- **AC1: Temporary Suspend**
    - **Given:** Tôi đang review một user vi phạm
    - **When:** Tôi chọn "Suspend" và chọn thời gian (1 day, 7 days, 30 days)
    - **Then:**
        - User không thể đăng nhập trong thời gian suspend
        - Tất cả bài viết của user bị ẩn tạm thời
        - User nhận email thông báo với lý do và thời gian suspend
        - Sau khi hết hạn, account tự động được khôi phục
- **AC2: Permanent Ban**
    - **Given:** User vi phạm nghiêm trọng hoặc tái phạm nhiều lần
    - **When:** Tôi chọn "Permanent Ban" và nhập lý do
    - **Then:**
        - Account bị khóa vĩnh viễn
        - User nhận email thông báo
        - User không thể đăng ký lại với cùng email
        - Tất cả nội dung của user bị xóa hoặc ẩn
        - User có thể appeal trong 30 ngày
- **AC3: Xem lịch sử vi phạm**
    - **Given:** Tôi đang review một user
    - **When:** Tôi click vào "Violation History"
    - **Then:** Tôi thấy:
        - Tất cả warnings, suspensions trước đó
        - Nội dung vi phạm
        - Actions đã được thực hiện
        - Timeline vi phạm
- **AC4: Unban user**
    - **Given:** User bị ban nhầm hoặc appeal thành công
    - **When:** Tôi vào User Management, tìm user và chọn "Unban"
    - **Then:**
        - Account được khôi phục
        - User nhận email thông báo
        - User có thể đăng nhập lại

---

## US-18 [Admin]: Xóa bài viết vi phạm
**Là một** Admin/Moderator,
**Tôi muốn** xóa nhanh các bài viết vi phạm,
**Để** ngăn chặn lan truyền nội dung xấu.

**Acceptance Criteria:**
- **AC1: Xóa bài viết từ report**
    - **Given:** Tôi đang review một báo cáo về bài viết vi phạm
    - **When:** Tôi chọn "Remove Post" và chọn lý do
    - **Then:**
        - Bài viết bị xóa khỏi feed và database (soft delete)
        - Author nhận notification: "Your post has been removed for [reason]"
        - Báo cáo được đánh dấu là "Resolved"
        - Action được log
- **AC2: Bulk delete (Xóa hàng loạt)**
    - **Given:** Phát hiện spam campaign từ nhiều posts
    - **When:** Tôi chọn multiple posts và chọn "Bulk Remove"
    - **Then:**
        - Tất cả posts được chọn bị xóa
        - Author nhận một notification tổng hợp
        - Có thể trigger automatic suspend nếu > 5 posts bị xóa cùng lúc
- **AC3: Restore bị xóa nhầm**
    - **Given:** Post bị xóa nhầm
    - **When:** Tôi vào Admin > Deleted Posts, tìm post và chọn "Restore"
    - **Then:**
        - Post được khôi phục lên feed
        - Author nhận notification: "Your post has been restored. We apologize for the error."
- **AC4: Add note khi xóa**
    - **Given:** Tôi đang xóa một bài viết
    - **When:** Tôi thêm internal note (chỉ admin thấy)
    - **Then:** Note được lưu cùng log, giúp các moderator khác hiểu context

---

*(Các User Stories khác sẽ được bổ sung khi cần thiết)*
