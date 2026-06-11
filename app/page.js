"use client";
import { useState } from "react";
import { STORES } from "@/lib/constants";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = STORES.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0D0F14", maxWidth: 430, margin: "0 auto", padding: "0 0 40px" }}>
      <div style={{ padding: "20px 16px 14px", borderBottom: "1px solid #1A1D26", background: "#10121A", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 11, color: "#C8A96E", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Corneli · Региональный директор</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#F5EFE0" }}>Выберите магазин</div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск магазина..."
          style={{ marginTop: 12, width: "100%", background: "#1A1D26", border: "1px solid #2A2D38", borderRadius: 10, color: "#E8E0D0", fontSize: 14, padding: "9px 12px", outline: "none", boxSizing: "border-box" }}
        />
      </div>

      <div style={{ padding: "12px 16px 0" }}>
        {filtered.map((store) => (
          <div key={store.id} onClick={() => router.push(`/store/${store.id}`)} style={{
            background: "#14161D", borderRadius: 14, border: "1px solid #1E2130",
            padding: "14px 16px", marginBottom: 8, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#F5EFE0" }}>{store.name}</div>
              <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>Нажмите чтобы управлять</div>
            </div>
            <div style={{ fontSize: 20, color: "#C8A96E" }}>›</div>
          </div>
        ))}
      </div>
    </div>
  );
}