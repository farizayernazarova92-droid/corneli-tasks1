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

export function fmt(n) {
  if (!n || n == 0) return "—";
  return Number(n).toLocaleString("ru-RU");
}

export function initials(name) {
  return (name || "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function todayName() {
  const map = { 1: "Понедельник", 2: "Вторник", 3: "Среда", 4: "Четверг" };
  return map[new Date().getDay()] || "Понедельник";
}
