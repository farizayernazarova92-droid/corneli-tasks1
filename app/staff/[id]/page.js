"use client";

import { useEffect, useState } from "react";
import { ZONES, WEEK, fmt } from "@/lib/constants";

export default function StaffPage({ params }) {
  const staffId = Number(params.id);
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then((data) => {
        setState(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner} />
        <div style={{ marginTop: 12, color: "#666", fontSize: 14 }}>Загружаю задачи...</div>
      </div>
    );
  }

  if (!state) {
    return (
      <div style={styles.center}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>😕</div>
        <div style={{ color: "#666", fontSize: 14 }}>Не удалось загрузить. Попробуйте позже.</div>
      </div>
    );
  }

  const person = state.staff?.find((p) => p.id === staffId);
  if (!person) {
    return (
      <div style={styles.center}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
        <div style={{ color: "#666", fontSize: 14 }}>Сотрудник не найден.</div>
      </div>
    );
  }

  const day = state.activeDay || "Понедельник";
  const [icon, task] = WEEK[day] || ["📋", ""];
  const now = new Date();
  const dateStr = now.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.eyebrow}>Corneli · {dateStr}</div>
        <div style={styles.name}>{person.name}</div>
        <div style={styles.zone}>{ZONES[person.zone] || person.zone}</div>
      </div>

      <div style={styles.body}>
        {/* Day pill */}
        <div style={styles.dayPill}>
          <span style={{ fontSize: 22 }}>{icon}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#C8A96E" }}>{day}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{task}</div>
          </div>
        </div>

        {/* KPIs */}
        <div style={styles.sectionLabel}>Мои планы на сегодня</div>
        <div style={styles.kpiGrid}>
          {[
            ["ТО план", person.revenue ? fmt(person.revenue) + " ₸" : "—"],
            ["Чеков", person.receipts || "—"],
            ["Единиц (UPT)", person.units || "—"],
            ["Звонков", person.calls || "—"],
          ].map(([l, v]) => (
            <div key={l} style={styles.kpiCell}>
              <div style={styles.kpiLabel}>{l}</div>
              <div style={{ ...styles.kpiVal, color: v === "—" ? "#333" : "#E8E0D0" }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Star task */}
        {person.task && (
          <div style={styles.starTask}>
            <div style={styles.starLabel}>⭐ Задача от директора</div>
            <div style={styles.starText}>{person.task}</div>
          </div>
        )}

        {/* General task */}
        {state.generalTask && (
          <div style={styles.card}>
            <div style={styles.sectionLabel}>Общая задача</div>
            <div style={{ fontSize: 14, color: "#E8E0D0", lineHeight: 1.7, marginTop: 6 }}>{state.generalTask}</div>
          </div>
        )}

        {/* Zone */}
        <div style={styles.sectionLabel}>Моя зона</div>
        <div style={styles.card}>
          <div style={{ fontSize: 26, marginBottom: 6 }}>{ZONES[person.zone]?.split(" ")[0]}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#E8E0D0" }}>{ZONES[person.zone]}</div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>Вы отвечаете за эту зону сегодня</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0D0F14", maxWidth: 430, margin: "0 auto" },
  center: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  header: { padding: "16px 16px 12px", borderBottom: "1px solid #1A1D26", background: "#10121A", position: "sticky", top: 0 },
  eyebrow: { fontSize: 11, color: "#888", letterSpacing: 2, textTransform: "uppercase" },
  name: { fontSize: 22, fontWeight: 700, color: "#F5EFE0", marginTop: 3 },
  zone: { fontSize: 13, color: "#666", marginTop: 3 },
  body: { padding: "14px 16px 40px" },
  dayPill: { background: "#1A1D26", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
  sectionLabel: { fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 },
  kpiGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 },
  kpiCell: { background: "#14161D", borderRadius: 10, padding: "10px 12px", border: "1px solid #1A1D26" },
  kpiLabel: { fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1 },
  kpiVal: { fontSize: 16, fontWeight: 700, marginTop: 3 },
  starTask: { background: "#16121A", border: "1px solid #2A1E30", borderRadius: 12, padding: "12px 14px", marginBottom: 12 },
  starLabel: { fontSize: 11, color: "#C8A96E", fontWeight: 700, marginBottom: 4 },
  starText: { fontSize: 14, color: "#D0C0E0", lineHeight: 1.6 },
  card: { background: "#14161D", borderRadius: 12, padding: "13px 14px", border: "1px solid #1E2130", marginBottom: 14 },
  spinner: { width: 32, height: 32, border: "3px solid #1E2130", borderTopColor: "#C8A96E", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
};
