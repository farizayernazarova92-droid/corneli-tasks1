export const ZONES = {
  right:   "▶ Правая сторона",
  left:    "◀ Левая сторона",
  center:  "◈ Середина зала",
  fitting: "🪞 Примерочная",
  cashier: "💳 Кассовая зона",
  stock:   "📦 Склад",
  coffee:  "☕ Кофемашина",
};

export const WEEK = {
  Понедельник: ["👕", "Топы"],
  Вторник:     ["🔄", "Корректировка мерчендайзинга"],
  Среда:       ["📷", "Парсинг и образы"],
  Четверг:     ["📸", "Фотоотчёт"],
};

export const DAYS = Object.keys(WEEK);

export const STORES = [
  { id: "almaty-mega",      name: "Almaty Mega" },
  { id: "almaty-alfarabi",  name: "Almaty Al Farabi" },
  { id: "almaty-megapark",  name: "Almaty Mega Park" },
  { id: "shymkent-kunaeva", name: "Shymkent Kunaeva" },
  { id: "shymkent-gp",      name: "Shymkent GP" },
  { id: "astana-outlet",    name: "Astana Outlet" },
  { id: "almaty-outlet",    name: "Almaty Outlet" },
  { id: "astana-megasw",    name: "Astana Mega SW" },
  { id: "astana-turan",     name: "Astana Turan" },
  { id: "atyrau-baisaar",   name: "Atyrau Baisaar" },
  { id: "aktau",            name: "Aktau" },
];

export const DEFAULT_STAFF = [
  { id: 1, name: "Сотрудник 1", zone: "right",   revenue: 0, receipts: 0, units: 0, calls: 0, task: "" },
  { id: 2, name: "Сотрудник 2", zone: "left",    revenue: 0, receipts: 0, units: 0, calls: 0, task: "" },
  { id: 3, name: "Сотрудник 3", zone: "center",  revenue: 0, receipts: 0, units: 0, calls: 0, task: "" },
  { id: 4, name: "Сотрудник 4", zone: "fitting", revenue: 0, receipts: 0, units: 0, calls: 0, task: "" },
];

export function defaultStoreState(storeId) {
  return {
    storeId,
    staff: DEFAULT_STAFF.map(s => ({ ...s, id: Date.now() + Math.random() })),
    generalTask: "",
    activeDay: "Понедельник",
  };
}

export function fmt(n) {
  if (!n || n == 0) return "—";
  return Number(n).toLocaleString("ru-RU");
}

export function initials(name) {
  return (name || "").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

export function todayName() {
  const map = { 1: "Понедельник", 2: "Вторник", 3: "Среда", 4: "Четверг" };
  return map[new Date().getDay()] || "Понедельник";
}