// Dữ liệu mẫu – thay bằng API/CMS khi triển khai thực tế
const ROOMS = [
  {
    name: "Phòng Standard",
    badge: "Phổ biến",
    size: "25 m²",
    bed: "1 giường đôi",
    guests: "2 khách",
    desc: "Phòng tiêu chuẩn ấm cúng, đầy đủ tiện nghi cơ bản, phù hợp cho cặp đôi hoặc khách công tác.",
    price: 650000,
    gradient: "linear-gradient(135deg,#2b9fbf,#0e6e8c)"
  },
  {
    name: "Phòng Deluxe",
    badge: "View biển",
    size: "35 m²",
    bed: "1 giường king",
    guests: "2 khách",
    desc: "Không gian rộng rãi với ban công hướng biển, bồn tắm và minibar miễn phí.",
    price: 1150000,
    gradient: "linear-gradient(135deg,#e8a33d,#0e6e8c)"
  },
  {
    name: "Suite Gia Đình",
    badge: "Gia đình",
    size: "55 m²",
    bed: "2 giường đôi",
    guests: "4 khách",
    desc: "Hai phòng ngủ liên thông, phòng khách riêng, lý tưởng cho gia đình hoặc nhóm bạn.",
    price: 1950000,
    gradient: "linear-gradient(135deg,#10232c,#2b9fbf)"
  }
];

const TOURS = [
  {
    name: "Tour Biển Đảo 2N1Đ",
    badge: "Bán chạy",
    duration: "2 ngày 1 đêm",
    group: "Tối đa 15 khách",
    desc: "Lặn ngắm san hô, chèo kayak, BBQ hải sản trên bãi biển và nghỉ đêm tại khách sạn.",
    price: 2490000,
    gradient: "linear-gradient(135deg,#35a8c7,#0a5169)"
  },
  {
    name: "Khám Phá Văn Hóa Địa Phương",
    badge: "Trải nghiệm",
    duration: "1 ngày",
    group: "Tối đa 20 khách",
    desc: "Tham quan làng nghề truyền thống, chợ phiên, thưởng thức ẩm thực đặc sản cùng hướng dẫn viên bản địa.",
    price: 890000,
    gradient: "linear-gradient(135deg,#e8a33d,#c0392b)"
  },
  {
    name: "Combo Nghỉ Dưỡng 3N2Đ",
    badge: "Tiết kiệm",
    duration: "3 ngày 2 đêm",
    group: "Theo yêu cầu",
    desc: "Gồm phòng Deluxe, ăn sáng, 1 tour trong ngày, spa 60 phút và đưa đón sân bay.",
    price: 4990000,
    gradient: "linear-gradient(135deg,#0e6e8c,#10232c)"
  }
];
