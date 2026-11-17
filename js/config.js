// ========== Cấu hình chung Thu Thủy Hotel ==========
// File này được dùng bởi cả trang chủ và trang /admin.
const CONFIG = {
  hotelName: "Thu Thủy Hotel",
  contactEmail: "thuthuy296cb@gmail.com",
  phone: "0900 000 000",           // TODO: thay số điện thoại thật
  address: "Đảo Cát Bà, Cát Hải, TP. Hải Phòng",

  // Email nhận thông báo đặt phòng (qua dịch vụ FormSubmit, miễn phí).
  // Lần gửi đầu tiên FormSubmit sẽ gửi 1 email "Activate form" tới địa chỉ này,
  // bấm xác nhận một lần là các lần sau nhận bình thường.
  formEmail: "thuthuy296cb@gmail.com",

  // (Tuỳ chọn) Endpoint Google Apps Script để lưu đặt phòng tập trung.
  // Để trống = lưu trên trình duyệt (chế độ demo). Xem backend/README.md.
  apiEndpoint: "",
  apiToken: "",

  // Mật khẩu trang /admin, lưu dạng SHA-256. Mặc định: thuthuy@2026
  // Đổi mật khẩu: vào /admin → Cài đặt → "Tạo mã mật khẩu mới" rồi dán vào đây.
  adminPasswordHash: "0f1f2b985efec6fd5df0847c3ab69cbace4515cc412c3fc20f05573111cd88c3"
};
