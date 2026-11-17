// Dữ liệu phòng & tour. Có thể chỉnh trong /admin rồi tải file này về thay thế.
const ROOMS = [
  {
    id: "standard",
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
    id: "deluxe",
    name: "Phòng Deluxe",
    badge: "View biển",
    size: "35 m²",
    bed: "1 giường king",
    guests: "2 khách",
    desc: "Không gian rộng rãi với ban công hướng vịnh Lan Hạ, bồn tắm và minibar miễn phí.",
    price: 1150000,
    gradient: "linear-gradient(135deg,#e8a33d,#0e6e8c)"
  },
  {
    id: "family",
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
    id: "lanha",
    name: "Tour Vịnh Lan Hạ 1 Ngày",
    badge: "Bán chạy",
    duration: "1 ngày",
    group: "Tối đa 15 khách",
    desc: "Du thuyền vịnh Lan Hạ, chèo kayak qua hang Sáng – hang Tối, tắm biển Ba Trái Đào, ăn trưa hải sản trên tàu.",
    price: 890000,
    gradient: "linear-gradient(135deg,#35a8c7,#0a5169)"
  },
  {
    id: "vqg",
    name: "Khám Phá Vườn Quốc Gia Cát Bà",
    badge: "Trải nghiệm",
    duration: "Nửa ngày",
    group: "Tối đa 20 khách",
    desc: "Trekking đỉnh Ngự Lâm, thăm động Trung Trang, làng Việt Hải cùng hướng dẫn viên bản địa.",
    price: 550000,
    gradient: "linear-gradient(135deg,#2e8b57,#0e6e8c)"
  },
  {
    id: "combo3n2d",
    name: "Combo Cát Bà 3N2Đ",
    badge: "Tiết kiệm",
    duration: "3 ngày 2 đêm",
    group: "Theo yêu cầu",
    desc: "Gồm phòng Deluxe, ăn sáng, tour vịnh Lan Hạ, vé Vườn Quốc Gia, đưa đón bến phà Cái Viềng.",
    price: 3990000,
    gradient: "linear-gradient(135deg,#0e6e8c,#10232c)"
  }
];
