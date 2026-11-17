# Backend (tuỳ chọn): Google Apps Script + Google Sheets

Mặc định trang web chạy ở **chế độ trình duyệt**: mỗi yêu cầu đặt phòng được gửi email về Gmail,
còn trang `/admin` chỉ thấy các yêu cầu gửi từ cùng trình duyệt. Muốn quản lý tập trung trên
nhiều máy, triển khai backend này (miễn phí, chỉ cần tài khoản Gmail), mất khoảng 5 phút.

## Các bước

1. Vào https://sheets.new tạo một Google Sheet mới, đặt tên ví dụ `ThuThuy Bookings`.
2. Trong Sheet chọn **Tiện ích mở rộng → Apps Script**.
3. Xoá nội dung mặc định, dán toàn bộ file `Code.gs` vào, bấm **Lưu**.
4. Bấm **Triển khai → Tùy chọn triển khai mới**:
   - Loại: **Ứng dụng web**
   - Thực thi với tư cách: **Tôi**
   - Ai có quyền truy cập: **Bất kỳ ai**
   - Bấm Triển khai, cấp quyền khi được hỏi (gửi email + đọc Sheet).
5. Sao chép **URL ứng dụng web** (dạng `https://script.google.com/macros/s/.../exec`).
6. Mở `js/config.js`, điền URL đó vào `apiEndpoint`, push lên GitHub.

Từ lúc này:
- Mỗi yêu cầu mới ghi vào Sheet và gửi email tới địa chỉ trong `NOTIFY_EMAIL`.
- Trang `/admin` đọc/ghi trực tiếp từ Sheet, dùng được trên mọi máy.

## Bảo mật (khuyến nghị)

Đặt một chuỗi bí mật vào `TOKEN` trong `Code.gs` và cùng giá trị vào `apiToken` trong `js/config.js`,
sau đó **triển khai lại** (Triển khai → Quản lý triển khai → Chỉnh sửa → Phiên bản mới).
