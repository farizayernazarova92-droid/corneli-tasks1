"use client";

import { useEffect, useState } from "react";
import { ZONES, WEEK, fmt, STORES } from "@/lib/constants";

export default function StaffPage({ params }) {
  const { storeId, staffId } = params;
  const store = STORES.find(s => s.id === storeId);
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tasks?store=${storeId}`)
      .then(r => r.json())
      .then(data => { setState(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [storeId]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0D0F14", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>⏳</div>
        <div style={{ color: "#666", fontSize: 14 }}>Загружаю задачи...</div>
      </div>
    </div>
  );

  const person = state?.staff?.find(p => String(p.id) === String(staffId));

  if (!person) return (
    <div style={{ minHeight: "100vh", background: "#0D0F14", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>😕</div>
        <div style={{ color: "#666", fontSize: 14 }}>Сотрудник не найден</div>
      </div>
    </div>
  );

  const day = state?.activeDay || "Понедельник";
  const [icon, task] = WEEK[day] || ["📋", ""];
  const dateStr = new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long" });

  return (
    <div style={{ minHeight: "100vh", background: "#0D0F14", maxWidth: 430, margin: "0 auto", paddingBottom: 40 }}>
      <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #1A1D26", background: "#10121A", position: "sticky", top: 0 }}>
        <div style={{ fontSize: 11, color: "#888", letterSpacing: 2, textTransform: "uppercase" }}>Corneli · {store?.name} · {dateStr}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#F5EFE0", marginTop: 3 }}>{person.name}</div>
        <div style={{ fontSize: 13, color: "#666", marginTop: 3 }}>{ZONES[person.zone] || person.zone}</div>
      </div>

      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ background: "#1A1D26", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 22 }}>{icon}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#C8A96E" }}>{day}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{task}</div>
          </div>
        </div>

        <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Мои планы на сегодня</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {[["ТО план", person.revenue ? fmt(person.revenue)+" ₸" : "—"], ["Чеков", person.receipts||"—"], ["Единиц (UPT)", person.units||"—"], ["Звонков", person.calls||"—"]].map(([l,v]) => (
            <div key={l} style={{ background: "#14161D", borderRadius: 10, padding: "10px 12px", border: "1px solid #1A1D26" }}>
              <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: v==="—"?"#333":"#E8E0D0", marginTop: 3 }}>{v}</div>
            </div>
          ))}
        </div>

        {person.task && (
          <div style={{ background: "#16121A", border: "1px solid #2A1E30", borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "#C8A96E", fontWeight: 700, marginBottom: 4 }}>⭐ Задача от директора</div>
            <div style={{ fontSize: 14, color: "#D0C0E0", lineHeight: 1.6 }}>{person.task}</div>
          </div>
        )}

        {state?.generalTask && (
          <div style={{ background: "#14161D", border: "1px solid #1E2130", borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Общая задача</div>
            <div style={{ fontSize: 14, color: "#E8E0D0", lineHeight: 1.6 }}>{state.generalTask}</div>
          </div>
        )}

        <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Моя зона</div>
        <div style={{ background: "#14161D", borderRadius: 12, padding: "14px", border: "1px solid #1E2130" }}>
          <div style={{ fontSize: 24, marginBottom: 6 }}>{ZONES[person.zone]?.split(" ")[0]}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#E8E0D0" }}>{ZONES[person.zone]}</div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>Вы отвечаете за эту зону сегодня</div>
        </div>
      </div>
    </div>
  );
}