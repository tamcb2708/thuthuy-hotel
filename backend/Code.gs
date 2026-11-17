/**
 * Backend Google Apps Script cho Thu Thủy Hotel.
 * - Lưu đặt phòng vào Google Sheet
 * - Gửi email thông báo khi có yêu cầu mới
 * Hướng dẫn triển khai: xem backend/README.md
 */
const SHEET_NAME = "Bookings";
const NOTIFY_EMAIL = "thuthuy296cb@gmail.com";
const TOKEN = ""; // tuỳ chọn: đặt chuỗi bí mật và điền vào CONFIG.apiToken

const COLS = ["id", "createdAt", "status", "type", "name", "phone", "email", "checkin", "checkout", "note", "adminNote"];

function sheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) { sh = ss.insertSheet(SHEET_NAME); sh.appendRow(COLS); sh.setFrozenRows(1); }
  return sh;
}
const out = (obj) => ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);

function list() {
  const rows = sheet().getDataRange().getValues();
  return rows.slice(1).filter((r) => r[0]).map((r) => Object.fromEntries(COLS.map((c, i) => [c, r[i] instanceof Date ? r[i].toISOString() : r[i]])))
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}
function findRow(id) {
  const ids = sheet().getRange(2, 1, Math.max(sheet().getLastRow() - 1, 1), 1).getValues().map((r) => r[0]);
  const i = ids.indexOf(id);
  return i === -1 ? -1 : i + 2;
}

function doGet() { return out({ ok: true, data: list() }); }

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    if (TOKEN && body.token !== TOKEN) return out({ ok: false, error: "Unauthorized" });
    const sh = sheet();
    switch (body.action) {
      case "list": return out({ ok: true, data: list() });
      case "add": {
        const b = body.booking;
        sh.appendRow(COLS.map((c) => b[c] || ""));
        notify(b);
        return out({ ok: true, data: b });
      }
      case "update": {
        const row = findRow(body.id); if (row < 0) return out({ ok: false, error: "Not found" });
        Object.entries(body.patch || {}).forEach(([k, v]) => { const c = COLS.indexOf(k); if (c >= 0) sh.getRange(row, c + 1).setValue(v); });
        return out({ ok: true, data: true });
      }
      case "delete": {
        const row = findRow(body.id); if (row < 0) return out({ ok: false, error: "Not found" });
        sh.deleteRow(row);
        return out({ ok: true, data: true });
      }
      default: return out({ ok: false, error: "Unknown action" });
    }
  } catch (err) { return out({ ok: false, error: String(err) }); }
}

function notify(b) {
  if (!NOTIFY_EMAIL) return;
  const type = { room: "Đặt phòng", tour: "Đặt tour", combo: "Combo phòng + tour" }[b.type] || b.type;
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: `[Thu Thủy Hotel] ${type} mới từ ${b.name}`,
    htmlBody: `<p>Có yêu cầu mới <b>${b.id}</b>:</p>
      <table border="1" cellpadding="6" style="border-collapse:collapse">
        <tr><td>Loại</td><td>${type}</td></tr>
        <tr><td>Họ tên</td><td>${b.name}</td></tr>
        <tr><td>Điện thoại</td><td>${b.phone}</td></tr>
        <tr><td>Email</td><td>${b.email || "-"}</td></tr>
        <tr><td>Ngày đến</td><td>${b.checkin}</td></tr>
        <tr><td>Ngày đi</td><td>${b.checkout}</td></tr>
        <tr><td>Ghi chú</td><td>${b.note || "-"}</td></tr>
      </table>`
  });
}
