# Thu Thủy Hotel

Website giới thiệu khách sạn và dịch vụ lữ hành **Thu Thủy Hotel**: đặt phòng, đặt tour, dịch vụ đi kèm và thông tin liên hệ.

Địa chỉ: đảo Cát Bà, Hải Phòng · Email: thuthuy296cb@gmail.com

## Tính năng hiện có

- Trang chủ một trang (landing page) responsive, tiếng Việt
- Danh sách phòng nghỉ và tour du lịch Cát Bà (render từ `js/data.js`)
- Thanh kiểm tra phòng trống nhanh
- Form đặt phòng / đặt tour: lưu yêu cầu và **gửi email thông báo** về Gmail (qua FormSubmit)
- Bản đồ Google Maps, dịch vụ, giới thiệu, đánh giá khách hàng, liên hệ
- Trang quản trị `/admin`: đăng nhập, thống kê, quản lý yêu cầu đặt phòng (trạng thái, ghi chú), chỉnh phòng & tour, sao lưu dữ liệu

## Cấu trúc

```
.
├── index.html          # Trang chính
├── css/style.css       # Giao diện
├── js/config.js        # Cấu hình: email, mật khẩu admin, endpoint backend
├── js/data.js          # Dữ liệu phòng & tour
├── js/store.js         # Lưu trữ đặt phòng (trình duyệt hoặc Apps Script)
├── js/main.js          # Logic trang chủ: render, menu, form
├── admin/              # Trang quản trị (/admin)
├── backend/            # Apps Script tuỳ chọn + hướng dẫn
└── images/             # Ảnh (thêm sau)
```

## Trang quản trị

Mở `/admin/`, mật khẩu mặc định: `thuthuy@2026`.
Đổi mật khẩu: vào Cài đặt → tạo mã băm → dán vào `adminPasswordHash` trong `js/config.js`.

Mặc định dữ liệu đặt phòng lưu trên trình duyệt (chế độ demo). Để quản lý tập trung trên nhiều máy,
làm theo `backend/README.md` (Google Sheets + Apps Script, miễn phí, ~5 phút).

## Email thông báo

Form gửi qua [FormSubmit](https://formsubmit.co) tới địa chỉ trong `CONFIG.formEmail`.
**Lần gửi đầu tiên** FormSubmit gửi email "Activate form" tới Gmail; bấm kích hoạt một lần là xong.

## Chạy thử

Mở trực tiếp `index.html` trong trình duyệt, hoặc:

```bash
npx serve .
```

## Triển khai GitHub Pages

Settings → Pages → Source: `main` / root. Trang sẽ ở `https://<user>.github.io/thuthuy-hotel/`.

## Việc tiếp theo

- [ ] Thay ảnh thật cho phòng, tour, hero
- [ ] Cập nhật số điện thoại thật và địa chỉ cụ thể trong `js/config.js` và `index.html`
- [ ] Triển khai backend Apps Script để quản lý tập trung (xem `backend/README.md`)
- [ ] Trang chi tiết phòng / tour
- [ ] Đa ngôn ngữ (EN)
- [ ] SEO & Open Graph
