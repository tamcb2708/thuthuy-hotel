# Thu Thủy Hotel

Website giới thiệu khách sạn và dịch vụ lữ hành **Thu Thủy Hotel**: đặt phòng, đặt tour, dịch vụ đi kèm và thông tin liên hệ.

## Tính năng hiện có

- Trang chủ một trang (landing page) responsive, tiếng Việt
- Danh sách phòng nghỉ và tour du lịch (render từ `js/data.js`)
- Thanh kiểm tra phòng trống nhanh
- Form đặt phòng / đặt tour có kiểm tra dữ liệu (chưa nối backend)
- Dịch vụ, giới thiệu, đánh giá khách hàng, liên hệ

## Cấu trúc

```
.
├── index.html        # Trang chính
├── css/style.css     # Giao diện
├── js/data.js        # Dữ liệu phòng & tour (mẫu)
├── js/main.js        # Logic: render, menu, form
└── images/           # Ảnh (thêm sau)
```

## Chạy thử

Mở trực tiếp `index.html` trong trình duyệt, hoặc:

```bash
npx serve .
```

## Triển khai GitHub Pages

Settings → Pages → Source: `main` / root. Trang sẽ ở `https://<user>.github.io/thuthuy-hotel/`.

## Việc tiếp theo

- [ ] Thay ảnh thật cho phòng, tour, hero
- [ ] Nối form đặt phòng với backend hoặc dịch vụ email (Formspree, EmailJS, API riêng)
- [ ] Trang chi tiết phòng / tour
- [ ] Đa ngôn ngữ (EN)
- [ ] SEO & Open Graph
