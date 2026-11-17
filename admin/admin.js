// ========== Trang quản trị Thu Thủy Hotel ==========
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const fmtVND = (n) => Number(n || 0).toLocaleString("vi-VN") + "đ";
  const fmtDate = (s) => (s ? new Date(s).toLocaleDateString("vi-VN") : "-");
  const fmtDT = (s) => (s ? new Date(s).toLocaleString("vi-VN") : "-");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const STATUS = { new: "Mới", confirmed: "Đã xác nhận", done: "Hoàn thành", cancelled: "Đã huỷ" };
  const TYPE = { room: "Đặt phòng", tour: "Đặt tour", combo: "Combo" };

  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  const toast = (t) => { const el = $("#toast"); el.textContent = t; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 2200); };

  // ---------- Auth ----------
  const SESSION = "tth_admin";
  const isAuthed = () => sessionStorage.getItem(SESSION) === CONFIG.adminPasswordHash;
  function showApp(authed) { $("#loginView").hidden = authed; $("#appView").hidden = !authed; if (authed) init(); }
  $("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const h = await sha256($("#password").value);
    if (h === CONFIG.adminPasswordHash) { sessionStorage.setItem(SESSION, h); $("#loginErr").textContent = ""; showApp(true); }
    else { $("#loginErr").textContent = "Mật khẩu không đúng."; }
  });
  $("#logoutBtn").addEventListener("click", () => { sessionStorage.removeItem(SESSION); location.hash = ""; showApp(false); });

  // ---------- Router ----------
  function route() {
    const v = (location.hash || "#overview").slice(1);
    const known = ["overview", "bookings", "catalog", "settings"];
    const view = known.includes(v) ? v : "overview";
    $$(".view").forEach((s) => (s.hidden = s.id !== "view-" + view));
    $$("[data-view]").forEach((a) => a.classList.toggle("active", a.dataset.view === view));
  }
  window.addEventListener("hashchange", route);

  // ---------- Bookings ----------
  let bookings = [];
  async function loadBookings() {
    try { bookings = await Store.list(); }
    catch (e) { console.error(e); toast("Không tải được dữ liệu: " + e.message); bookings = []; }
    renderStats(); renderRecent(); renderBookings();
    $("#newCount").textContent = bookings.filter((b) => b.status === "new").length;
  }
  function renderStats() {
    const d30 = Date.now() - 30 * 864e5;
    $("#stNew").textContent = bookings.filter((b) => b.status === "new").length;
    $("#stConfirmed").textContent = bookings.filter((b) => b.status === "confirmed").length;
    $("#stMonth").textContent = bookings.filter((b) => new Date(b.createdAt).getTime() > d30).length;
    $("#stTotal").textContent = bookings.length;
  }
  const rowHTML = (b) => `
    <tr data-id="${esc(b.id)}">
      <td><b>${esc(b.id)}</b><br><span class="type">${fmtDT(b.createdAt)}</span></td>
      <td>${esc(b.name)}<br><span class="type">${esc(b.phone)}</span></td>
      <td>${TYPE[b.type] || esc(b.type)}</td>
      <td>${fmtDate(b.checkin)} → ${fmtDate(b.checkout)}</td>
      <td><span class="badge badge--${esc(b.status)}">${STATUS[b.status] || esc(b.status)}</span></td>
      <td class="actions"><button class="btn btn--ghost btn--sm" data-open="${esc(b.id)}">Chi tiết</button></td>
    </tr>`;
  const headHTML = `<thead><tr><th>Mã / Thời gian</th><th>Khách</th><th>Loại</th><th>Ngày</th><th>Trạng thái</th><th></th></tr></thead>`;
  function renderRecent() {
    $("#recentTable").innerHTML = headHTML + "<tbody>" + bookings.slice(0, 5).map(rowHTML).join("") + "</tbody>";
    if (!bookings.length) $("#recentTable").innerHTML += `<tbody><tr><td colspan="6" class="empty">Chưa có yêu cầu nào.</td></tr></tbody>`;
  }
  function renderBookings() {
    const q = $("#search").value.trim().toLowerCase();
    const st = $("#filterStatus").value, ty = $("#filterType").value;
    const list = bookings.filter((b) =>
      (!st || b.status === st) && (!ty || b.type === ty) &&
      (!q || [b.id, b.name, b.phone, b.email, b.note].join(" ").toLowerCase().includes(q)));
    $("#bookingTable").innerHTML = headHTML + "<tbody>" + list.map(rowHTML).join("") + "</tbody>";
    $("#bookingEmpty").hidden = list.length > 0;
  }
  ["#search", "#filterStatus", "#filterType"].forEach((s) => $(s).addEventListener("input", renderBookings));
  $("#refreshBtn").addEventListener("click", () => loadBookings().then(() => toast("Đã tải lại")));

  // ---------- Modal ----------
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open]");
    if (btn) openModal(btn.dataset.open);
  });
  function openModal(id) {
    const b = bookings.find((x) => x.id === id); if (!b) return;
    $("#mTitle").textContent = "Yêu cầu " + b.id;
    $("#mBody").innerHTML = `
      <dl class="dl">
        <dt>Khách</dt><dd><b>${esc(b.name)}</b></dd>
        <dt>Điện thoại</dt><dd><a href="tel:${esc(b.phone)}">${esc(b.phone)}</a></dd>
        <dt>Email</dt><dd>${b.email ? `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : "-"}</dd>
        <dt>Loại</dt><dd>${TYPE[b.type] || esc(b.type)}</dd>
        <dt>Ngày</dt><dd>${fmtDate(b.checkin)} → ${fmtDate(b.checkout)}</dd>
        <dt>Ghi chú khách</dt><dd>${esc(b.note) || "-"}</dd>
        <dt>Gửi lúc</dt><dd>${fmtDT(b.createdAt)}</dd>
      </dl>
      <label>Trạng thái</label>
      <select id="mStatus">${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${b.status === k ? "selected" : ""}>${v}</option>`).join("")}</select>
      <label>Ghi chú nội bộ</label>
      <textarea id="mNote" rows="3">${esc(b.adminNote || "")}</textarea>
      <div class="modal__actions">
        <button class="btn btn--ghost" id="mDelete" style="color:var(--red)">Xoá</button>
        <button class="btn btn--primary" id="mSave">Lưu</button>
      </div>`;
    $("#modal").hidden = false;
    $("#mSave").onclick = async () => {
      try { await Store.update(id, { status: $("#mStatus").value, adminNote: $("#mNote").value }); toast("Đã lưu"); closeModal(); loadBookings(); }
      catch (err) { toast("Lỗi: " + err.message); }
    };
    $("#mDelete").onclick = async () => {
      if (!confirm("Xoá yêu cầu " + id + "?")) return;
      try { await Store.remove(id); toast("Đã xoá"); closeModal(); loadBookings(); }
      catch (err) { toast("Lỗi: " + err.message); }
    };
  }
  const closeModal = () => ($("#modal").hidden = true);
  $("#mClose").addEventListener("click", closeModal);
  $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });

  // ---------- Catalog ----------
  const CAT_KEY = "tth_catalog";
  let catalog;
  function loadCatalog() {
    try { catalog = JSON.parse(localStorage.getItem(CAT_KEY)); } catch { catalog = null; }
    if (!catalog) catalog = { rooms: structuredClone(ROOMS), tours: structuredClone(TOURS) };
  }
  const saveCatalog = () => localStorage.setItem(CAT_KEY, JSON.stringify(catalog));
  function itemHTML(kind, it, i) {
    const extra = kind === "rooms"
      ? `<div class="item__grid">
           <label>Diện tích<input data-f="size" value="${esc(it.size)}"></label>
           <label>Giường<input data-f="bed" value="${esc(it.bed)}"></label>
           <label>Số khách<input data-f="guests" value="${esc(it.guests)}"></label>
           <label>Nhãn<input data-f="badge" value="${esc(it.badge)}"></label>
         </div>`
      : `<div class="item__grid">
           <label>Thời lượng<input data-f="duration" value="${esc(it.duration)}"></label>
           <label>Nhóm<input data-f="group" value="${esc(it.group)}"></label>
           <label>Nhãn<input data-f="badge" value="${esc(it.badge)}"></label>
         </div>`;
    return `<div class="item" data-kind="${kind}" data-i="${i}">
      <div class="item__thumb" style="background:${esc(it.gradient)}"></div>
      <label>Tên<input data-f="name" value="${esc(it.name)}"></label>
      <label>Giá (VNĐ)<input data-f="price" type="number" value="${it.price}"></label>
      ${extra}
      <label>Mô tả<textarea data-f="desc" rows="3">${esc(it.desc)}</textarea></label>
    </div>`;
  }
  function renderCatalog() {
    $("#roomCatalog").innerHTML = catalog.rooms.map((r, i) => itemHTML("rooms", r, i)).join("");
    $("#tourCatalog").innerHTML = catalog.tours.map((t, i) => itemHTML("tours", t, i)).join("");
  }
  document.addEventListener("input", (e) => {
    const item = e.target.closest(".item"); if (!item) return;
    const f = e.target.dataset.f; if (!f) return;
    const obj = catalog[item.dataset.kind][item.dataset.i];
    obj[f] = f === "price" ? Number(e.target.value) : e.target.value;
    saveCatalog();
  });
  $("#resetCatalogBtn").addEventListener("click", () => {
    if (!confirm("Khôi phục dữ liệu phòng & tour về mặc định của data.js?")) return;
    localStorage.removeItem(CAT_KEY); loadCatalog(); renderCatalog(); toast("Đã khôi phục");
  });
  $("#exportCatalogBtn").addEventListener("click", () => {
    const js = "// Dữ liệu phòng & tour. Có thể chỉnh trong /admin rồi tải file này về thay thế.\n" +
      "const ROOMS = " + JSON.stringify(catalog.rooms, null, 2) + ";\n\n" +
      "const TOURS = " + JSON.stringify(catalog.tours, null, 2) + ";\n";
    download("data.js", js, "text/javascript");
  });
  function download(name, text, type) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click();
    URL.revokeObjectURL(a.href);
  }

  // ---------- Settings ----------
  $("#hashBtn").addEventListener("click", async () => {
    const p = $("#newPass").value;
    if (p.length < 6) return toast("Mật khẩu tối thiểu 6 ký tự");
    $("#hashOut").value = await sha256(p);
  });
  $("#exportBtn").addEventListener("click", () => download("bookings.json", Store.exportJSON(), "application/json"));
  $("#importFile").addEventListener("change", async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { const n = Store.importJSON(await f.text()); toast("Đã nhập " + n + " yêu cầu"); loadBookings(); }
    catch (err) { toast("Lỗi: " + err.message); }
    e.target.value = "";
  });

  // ---------- Init ----------
  let inited = false;
  function init() {
    if (!inited) { inited = true; loadCatalog(); renderCatalog(); }
    const remote = Store.mode() === "remote";
    const notice = $("#modeNotice");
    notice.classList.toggle("ok", remote);
    notice.innerHTML = remote
      ? "✅ Đang kết nối Google Apps Script – dữ liệu dùng chung cho mọi máy."
      : "⚠️ <b>Chế độ trình duyệt:</b> yêu cầu đặt phòng chỉ hiển thị trên trình duyệt mà khách đã gửi. Thông báo email vẫn gửi về Gmail bình thường. Để quản lý tập trung, xem mục <a href=\"#settings\">Cài đặt</a>.";
    $("#settingsMode").innerHTML = remote ? `Đang dùng endpoint: <code>${esc(CONFIG.apiEndpoint)}</code>` : "Hiện lưu trên trình duyệt (localStorage).";
    $("#settingsEmail").textContent = CONFIG.formEmail || "(chưa cấu hình)";
    $("#localTools").hidden = remote;
    route(); loadBookings();
  }
  showApp(isAuthed());
})();
