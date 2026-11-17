// ========== Thu Thủy Hotel – Main JS ==========
(function () {
  const fmtVND = (n) => n.toLocaleString("vi-VN") + "đ";

  // Render rooms
  const roomList = document.getElementById("roomList");
  if (roomList && typeof ROOMS !== "undefined") {
    roomList.innerHTML = ROOMS.map((r) => `
      <article class="card">
        <div class="card__img" style="background:${r.gradient}">
          ${r.badge ? `<span class="card__badge">${r.badge}</span>` : ""}
        </div>
        <div class="card__body">
          <h3 class="card__title">${r.name}</h3>
          <div class="card__meta">
            <span>📐 ${r.size}</span><span>🛏 ${r.bed}</span><span>👤 ${r.guests}</span>
          </div>
          <p class="card__desc">${r.desc}</p>
          <div class="card__foot">
            <span class="card__price">${fmtVND(r.price)} <small>/ đêm</small></span>
            <a href="#booking" class="card__link" data-type="room">Đặt phòng →</a>
          </div>
        </div>
      </article>`).join("");
  }

  // Render tours
  const tourList = document.getElementById("tourList");
  if (tourList && typeof TOURS !== "undefined") {
    tourList.innerHTML = TOURS.map((t) => `
      <article class="card">
        <div class="card__img" style="background:${t.gradient}">
          ${t.badge ? `<span class="card__badge">${t.badge}</span>` : ""}
        </div>
        <div class="card__body">
          <h3 class="card__title">${t.name}</h3>
          <div class="card__meta">
            <span>⏱ ${t.duration}</span><span>👥 ${t.group}</span>
          </div>
          <p class="card__desc">${t.desc}</p>
          <div class="card__foot">
            <span class="card__price">${fmtVND(t.price)} <small>/ khách</small></span>
            <a href="#booking" class="card__link" data-type="tour">Đặt tour →</a>
          </div>
        </div>
      </article>`).join("");
  }

  // Pre-select booking type when clicking a card link
  document.addEventListener("click", (e) => {
    const link = e.target.closest(".card__link");
    if (!link) return;
    const sel = document.getElementById("bType");
    if (sel) sel.value = link.dataset.type || "room";
  });

  // Sticky header
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("header--scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll);
  onScroll();

  // Mobile nav
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  toggle?.addEventListener("click", () => nav.classList.toggle("open"));
  nav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));

  // Dates: min = today, checkout > checkin
  const today = new Date().toISOString().split("T")[0];
  document.querySelectorAll('input[type="date"]').forEach((i) => (i.min = today));
  const linkDates = (inId, outId) => {
    const inEl = document.getElementById(inId), outEl = document.getElementById(outId);
    inEl?.addEventListener("change", () => {
      outEl.min = inEl.value;
      if (outEl.value && outEl.value <= inEl.value) outEl.value = "";
    });
  };
  linkDates("qCheckin", "qCheckout");
  linkDates("bCheckin", "bCheckout");

  // Quick book -> fill booking form
  document.getElementById("quickBookForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("bCheckin").value = document.getElementById("qCheckin").value;
    document.getElementById("bCheckout").value = document.getElementById("qCheckout").value;
    document.getElementById("bNote").value = `Số khách: ${document.getElementById("qGuests").value}`;
    document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
  });

  // Booking form: lưu vào Store + gửi email thông báo
  const form = document.getElementById("bookingForm");
  const msg = document.getElementById("formMsg");
  const submitBtn = form?.querySelector('button[type="submit"]');

  async function notifyByEmail(data) {
    if (!CONFIG.formEmail) return;
    const typeLabel = { room: "Đặt phòng", tour: "Đặt tour", combo: "Combo phòng + tour" }[data.type] || data.type;
    const payload = {
      _subject: `[${CONFIG.hotelName}] ${typeLabel} mới từ ${data.name}`,
      _template: "table",
      _captcha: "false",
      "Mã yêu cầu": data.id,
      "Loại": typeLabel,
      "Họ tên": data.name,
      "Điện thoại": data.phone,
      "Email": data.email || "-",
      "Ngày đến": data.checkin,
      "Ngày đi": data.checkout,
      "Ghi chú": data.note || "-"
    };
    const res = await fetch(`https://formsubmit.co/ajax/${CONFIG.formEmail}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Email service " + res.status);
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.classList.remove("error");
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.name || !data.phone || !data.checkin || !data.checkout) {
      msg.textContent = "Vui lòng điền đầy đủ họ tên, số điện thoại và ngày đến / đi.";
      msg.classList.add("error");
      return;
    }
    if (!/^(\+84|0)\d{9,10}$/.test(data.phone.replace(/\s/g, ""))) {
      msg.textContent = "Số điện thoại không hợp lệ.";
      msg.classList.add("error");
      return;
    }
    if (data.checkout <= data.checkin) {
      msg.textContent = "Ngày đi phải sau ngày đến.";
      msg.classList.add("error");
      return;
    }
    submitBtn.disabled = true;
    msg.textContent = "Đang gửi yêu cầu...";
    try {
      const saved = await Store.add(data);
      // Chế độ remote: Apps Script tự gửi email, không cần FormSubmit
      if (Store.mode() === "local") {
        try { await notifyByEmail(saved); } catch (err) { console.warn("Không gửi được email:", err); }
      }
      msg.textContent = `Cảm ơn ${data.name}! Yêu cầu ${saved.id} đã được ghi nhận, chúng tôi sẽ liên hệ sớm.`;
      form.reset();
    } catch (err) {
      console.error(err);
      msg.textContent = "Có lỗi khi gửi yêu cầu. Vui lòng gọi hotline hoặc thử lại sau.";
      msg.classList.add("error");
    } finally {
      submitBtn.disabled = false;
    }
  });

  // Footer year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
