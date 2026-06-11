"use client";

import { useState, useEffect, useCallback } from "react";
import { ZONES, WEEK, DAYS, fmt, initials, todayName } from "@/lib/constants";

const DEFAULT_STATE = {
  staff: [
    { id: 1, name: "Сотрудник 1", zone: "right",   revenue: 0, receipts: 0, units: 0, calls: 0, task: "" },
    { id: 2, name: "Сотрудник 2", zone: "left",    revenue: 0, receipts: 0, units: 0, calls: 0, task: "" },
    { id: 3, name: "Сотрудник 3", zone: "center",  revenue: 0, receipts: 0, units: 0, calls: 0, task: "" },
    { id: 4, name: "Сотрудник 4", zone: "fitting", revenue: 0, receipts: 0, units: 0, calls: 0, task: "" },
  ],
  generalTask: "",
  activeDay: "Понедельник",
};

const S = {
  page:        { minHeight: "100vh", background: "#0D0F14", maxWidth: 430, margin: "0 auto", position: "relative" },
  header:      { padding: "14px 16px 10px", borderBottom: "1px solid #1A1D26", background: "#10121A", position: "sticky", top: 0, zIndex: 20 },
  eyebrow:     { fontSize: 11, color: "#888", letterSpacing: 2, textTransform: "uppercase" },
  h1:          { fontSize: 18, fontWeight: 700, color: "#F5EFE0", marginTop: 2 },
  tabBar:      { display: "flex", borderBottom: "1px solid #1A1D26", background: "#10121A", position: "sticky", top: 53, zIndex: 19 },
  card:        { background: "#14161D", borderRadius: 14, border: "1px solid #1E2130", padding: "13px 14px", marginBottom: 10, cursor: "pointer" },
  sectionLabel:{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 },
  kpiGrid:     { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginTop: 10 },
  kpiCell:     { background: "#0D0F14", borderRadius: 8, padding: "6px 4px", textAlign: "center" },
  input:       { width: "100%", background: "#0D0F14", border: "1px solid #2A2D38", borderRadius: 8, color: "#E8E0D0", fontSize: 14, padding: "8px 10px", outline: "none", boxSizing: "border-box" },
  modalBg:     { position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 14px", overflowY: "auto" },
  modal:       { background: "#14161D", borderRadius: 16, border: "1px solid #2A2D38", padding: 18, width: "100%", maxWidth: 360 },
  summaryGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 },
  sumCell:     { background: "#14161D", borderRadius: 10, padding: "10px 12px", border: "1px solid #1A1D26" },
};

function TabButton({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: "9px 4px", border: "none", background: "none",
      color: active ? "#C8A96E" : "#555", fontSize: 12, fontWeight: active ? 700 : 400,
      borderBottom: active ? "2px solid #C8A96E" : "2px solid transparent", cursor: "pointer",
    }}>{children}</button>
  );
}

function Field({ label, gold, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11, color: gold ? "#C8A96E" : "#888", marginBottom: 4 }}>{label}</div>
      {children}
    </div>
  );
}

export default function DirectorPage() {
  const [appState, setAppStateRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("staff");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then((data) => {
        setAppStateRaw(data || DEFAULT_STATE);
        setLoading(false);
      })
      .catch(() => {
        setAppStateRaw(DEFAULT_STATE);
        setLoading(false);
      });
  }, []);

  const save = useCallback(async (newState) => {
    setSaving(true);
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: newState }),
      });
    } catch(e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }, []);

  const setAppState = useCallback((updater) => {
    setAppStateRaw((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      save(next);
      return next;
    });
  }, [save]);

  if (loading) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>⏳</div>
          <div style={{ color: "#666", fontSize: 14 }}>Загружаю данные...</div>
        </div>
      </div>
    );
  }

  const st = appState;
  const [icon, task] = WEEK[st.activeDay] || ["📋", ""];
  const totalRevenue  = st.staff.reduce((s, p) => s + Number(p.revenue  || 0), 0);
  const totalReceipts = st.staff.reduce((s, p) => s + Number(p.receipts || 0), 0);
  const totalUnits    = st.staff.reduce((s, p) => s + Number(p.units    || 0), 0);
  const totalCalls    = st.staff.reduce((s, p) => s + Number(p.calls    || 0), 0);
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const openEdit = (p) => { setForm({ ...p }); setModal(p.id); };
  const openAdd  = () => { setForm({ name: "", zone: "right", revenue: "", receipts: "", units: "", calls: "", task: "" }); setModal("new"); };

  const saveModal = () => {
    const d = { ...form, revenue: Number(form.revenue)||0, receipts: Number(form.receipts)||0, units: Number(form.units)||0, calls: Number(form.calls)||0 };
    if (modal === "new") {
      setAppState(s => ({ ...s, staff: [...s.staff, { id: Date.now(), ...d }] }));
    } else {
      setAppState(s => ({ ...s, staff: s.staff.map(p => p.id === modal ? { ...p, ...d } : p) }));
    }
    setModal(null);
  };

  const delStaff = () => {
    setAppState(s => ({ ...s, staff: s.staff.filter(p => p.id !== modal) }));
    setModal(null);
  };

  const copyLink = (id) => {
    const url = `${origin}/staff/${id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={S.eyebrow}>Директор · Corneli {saving && "· сохраняю..."}</div>
        <div style={S.h1}>{st.activeDay} · {icon} {task}</div>
      </div>

      <div style={S.tabBar}>
        <TabButton active={tab === "staff"}  onClick={() => setTab("staff")}>👥 Задачи</TabButton>
        <TabButton active={tab === "links"}  onClick={() => setTab("links")}>🔗 Ссылки</TabButton>
        <TabButton active={tab === "week"}   onClick={() => setTab("week")}>📅 Неделя</TabButton>
      </div>

      {tab === "staff" && (
        <div style={{ padding: "12px 16px 0" }}>
          <div style={S.summaryGrid}>
            {[["ТО итого", totalRevenue ? fmt(totalRevenue)+" ₸" : "—"], ["Чеков", totalReceipts||"—"], ["Единиц", totalUnits||"—"], ["Звонков", totalCalls||"—"]].map(([l,v]) => (
              <div key={l} style={S.sumCell}>
                <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#C8A96E", marginTop: 3 }}>{v}</div>
              </div>
            ))}
          </div>

          {st.staff.map((p) => (
            <div key={p.id} style={S.card} onClick={() => openEdit(p)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#F5EFE0" }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{ZONES[p.zone]}</div>
                </div>
                <span style={{ fontSize: 14, color: "#444" }}>✏️</span>
              </div>
              <div style={S.kpiGrid}>
                {[["ТО", p.revenue ? fmt(p.revenue)+"₸" : "—"], ["Чеки", p.receipts||"—"], ["Ед.", p.units||"—"], ["Звонки", p.calls||"—"]].map(([l,v]) => (
                  <div key={l} style={S.kpiCell}>
                    <div style={{ fontSize: 9, color: "#444" }}>{l}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: v==="—"?"#333":"#E8E0D0", marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
              {p.task && (
                <div style={{ marginTop: 10, background: "#16121A", borderRadius: 8, padding: "7px 10px", border: "1px solid #2A1E30" }}>
                  <span style={{ fontSize: 11, color: "#C8A96E", fontWeight: 700 }}>⭐ </span>
                  <span style={{ fontSize: 12, color: "#C0B0D0" }}>{p.task}</span>
                </div>
              )}
            </div>
          ))}

          <div style={{ ...S.card, cursor: "default" }}>
            <div style={S.sectionLabel}>Общая задача для всех</div>
            <textarea
              value={st.generalTask}
              onChange={e => setAppState(s => ({ ...s, generalTask: e.target.value }))}
              placeholder="Общая задача на день..."
              style={{ ...S.input, minHeight: 52, lineHeight: 1.6 }}
            />
          </div>

          <button onClick={openAdd} style={{ width: "100%", padding: 12, background: "#14161D", border: "1px dashed #2A2D38", borderRadius: 12, color: "#555", fontSize: 13, marginBottom: 24 }}>
            + Добавить сотрудника
          </button>
        </div>
      )}

      {tab === "links" && (
        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ fontSize: 13, color: "#666", lineHeight: 1.7, marginBottom: 16 }}>
            Отправьте каждому сотруднику его личную ссылку в WhatsApp или Telegram.
          </div>
          {st.staff.map((p) => (
            <div key={p.id} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#E8E0D0", marginBottom: 5 }}>{p.name}</div>
              <div onClick={() => copyLink(p.id)} style={{ background: "#14161D", border: "1px solid #1E2130", borderRadius: 10, padding: "10px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ flex: 1, fontSize: 12, color: "#7AB3E0", wordBreak: "break-all" }}>
                  {origin}/staff/{p.id}
                </span>
                <span style={{ fontSize: 11, color: copiedId === p.id ? "#5DBF8A" : "#555", flexShrink: 0, fontWeight: 700, whiteSpace: "nowrap" }}>
                  {copiedId === p.id ? "✓ Скопировано" : "Копировать"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "week" && (
        <div style={{ padding: "14px 16px 0" }}>
          {DAYS.map((d) => {
            const [ic, tsk] = WEEK[d];
            const isActive = d === st.activeDay;
            return (
              <div key={d} onClick={() => setAppState(s => ({ ...s, activeDay: d }))} style={{
                background: isActive ? "#1A1D26" : "#14161D",
                border: `1px solid ${isActive ? "#C8A96E44" : "#1A1D26"}`,
                borderRadius: 12, padding: "13px 14px", marginBottom: 8, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{ fontSize: 22 }}>{ic}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: isActive ? "#C8A96E" : "#E8E0D0" }}>{d}</div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 1 }}>{tsk}</div>
                </div>
                {isActive && <span style={{ marginLeft: "auto", fontSize: 10, background: "#C8A96E22", color: "#C8A96E", padding: "3px 8px", borderRadius: 6, fontWeight: 700 }}>Активный</span>}
              </div>
            );
          })}
        </div>
      )}

      {modal !== null && (
        <div style={S.modalBg} onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div style={S.modal}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#F5EFE0", marginBottom: 16 }}>
              {modal === "new" ? "Новый сотрудник" : form.name}
            </div>
            <Field label="Имя">
              <input style={S.input} value={form.name||""} placeholder="Имя Фамилия" onChange={e => setForm(v=>({...v, name: e.target.value}))} />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[["revenue","ТО план (₸)"],["receipts","Чеков"],["units","Единиц (UPT)"],["calls","Звонков"]].map(([f,l]) => (
                <Field key={f} label={l}>
                  <input style={S.input} type="number" value={form[f]||""} placeholder="0" onChange={e => setForm(v=>({...v,[f]:e.target.value}))} />
                </Field>
              ))}
            </div>
            <Field label="Зона">
              <select style={{ ...S.input, appearance: "auto" }} value={form.zone||"right"} onChange={e => setForm(v=>({...v, zone: e.target.value}))}>
                {Object.entries(ZONES).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <Field label="⭐ Задача от директора" gold>
              <textarea style={{ ...S.input, minHeight: 56, lineHeight: 1.6 }} value={form.task||""} placeholder="Персональная задача..." onChange={e => setForm(v=>({...v, task: e.target.value}))} />
            </Field>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: 10, background: "#1E2130", border: "1px solid #2A2D38", borderRadius: 8, color: "#888", fontSize: 13 }}>Отмена</button>
              {modal !== "new" && (
                <button onClick={delStaff} style={{ padding: "10px 14px", background: "#2A1414", border: "1px solid #C0392B44", borderRadius: 8, color: "#E57373", fontSize: 13 }}>🗑</button>
              )}
              <button onClick={saveModal} style={{ flex: 1, padding: 10, background: "#C8A96E22", border: "1px solid #C8A96E55", borderRadius: 8, color: "#C8A96E", fontSize: 13, fontWeight: 700 }}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
