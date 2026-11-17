// ========== Lưu trữ đặt phòng ==========
// Chế độ "local": lưu trong localStorage của trình duyệt (demo / 1 máy).
// Chế độ "remote": gọi Google Apps Script (CONFIG.apiEndpoint), dữ liệu dùng chung.
const Store = (() => {
  const KEY = "tth_bookings";
  const mode = () => (CONFIG.apiEndpoint ? "remote" : "local");

  const readLocal = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  };
  const writeLocal = (list) => localStorage.setItem(KEY, JSON.stringify(list));

  const uid = () => "BK" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();

  async function remote(action, payload = {}) {
    const body = JSON.stringify({ action, token: CONFIG.apiToken, ...payload });
    const res = await fetch(CONFIG.apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // tránh CORS preflight với Apps Script
      body
    });
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || "API error");
    return json.data;
  }

  return {
    mode,
    uid,
    async list() {
      if (mode() === "remote") return remote("list");
      return readLocal().sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    },
    async add(booking) {
      const item = { id: uid(), status: "new", createdAt: new Date().toISOString(), ...booking };
      if (mode() === "remote") return remote("add", { booking: item });
      const list = readLocal(); list.unshift(item); writeLocal(list);
      return item;
    },
    async update(id, patch) {
      if (mode() === "remote") return remote("update", { id, patch });
      const list = readLocal().map((b) => (b.id === id ? { ...b, ...patch } : b));
      writeLocal(list);
      return list.find((b) => b.id === id);
    },
    async remove(id) {
      if (mode() === "remote") return remote("delete", { id });
      writeLocal(readLocal().filter((b) => b.id !== id));
      return true;
    },
    // Chỉ dùng cho chế độ local
    exportJSON: () => JSON.stringify(readLocal(), null, 2),
    importJSON(text) {
      const data = JSON.parse(text);
      if (!Array.isArray(data)) throw new Error("File không đúng định dạng");
      writeLocal(data);
      return data.length;
    }
  };
})();
