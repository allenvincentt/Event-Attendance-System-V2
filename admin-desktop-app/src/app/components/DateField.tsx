import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Icon } from "./Icon";
import { tokens } from "@/app/theme/tokens";
import { formatDateLong } from "@/app/lib/format";

function monthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function DateField({ label, value, onChange }: { label: string; value: string; onChange: (iso: string) => void }) {
  const selected = new Date(`${value}T00:00:00`);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState({ y: selected.getFullYear(), m: selected.getMonth() });
  const cells = monthMatrix(view.y, view.m);

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: tokens.space["2xs"] }}>
      <span style={{ fontSize: tokens.font.size.sm, color: tokens.color.text.muted }}>{label}</span>
      <button
        type="button"
        aria-label={formatDateLong(selected)}
        onClick={() => setOpen((o) => !o)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: tokens.space.sm, border: `1px solid ${tokens.color.border.strong}`, borderRadius: tokens.radius.md, padding: `${tokens.space.sm}px ${tokens.space.md}px`, background: tokens.color.surface.card, cursor: "pointer", fontSize: tokens.font.size.body }}
      >
        {formatDateLong(selected)}
        <Icon name="calendar" size={16} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Choose a date"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, transition: { duration: tokens.motion.dur.fast } }}
            style={{ position: "absolute", top: "calc(100% + 4px)", zIndex: 60, background: tokens.color.surface.card, border: `1px solid ${tokens.color.border.default}`, borderRadius: tokens.radius.md, boxShadow: tokens.elevation.e2, padding: tokens.space.md, width: 280 }}
            onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: tokens.space.sm }}>
              <button type="button" aria-label="Previous month" onClick={() => setView((v) => ({ y: v.m === 0 ? v.y - 1 : v.y, m: (v.m + 11) % 12 }))} style={{ border: "none", background: "transparent", cursor: "pointer" }}><Icon name="chevronLeft" size={16} /></button>
              <strong style={{ fontSize: tokens.font.size.bodySm }}>{new Date(view.y, view.m, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</strong>
              <button type="button" aria-label="Next month" onClick={() => setView((v) => ({ y: v.m === 11 ? v.y + 1 : v.y, m: (v.m + 1) % 12 }))} style={{ border: "none", background: "transparent", cursor: "pointer" }}><Icon name="chevronRight" size={16} /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
              {cells.map((d) => {
                const inMonth = d.getMonth() === view.m;
                const isSel = iso(d) === value;
                return (
                  <button
                    key={d.toISOString()}
                    type="button"
                    onClick={() => { onChange(iso(d)); setOpen(false); }}
                    style={{ border: "none", borderRadius: tokens.radius.sm, padding: tokens.space.xs, cursor: "pointer", fontSize: tokens.font.size.sm, background: isSel ? tokens.color.brand.primary : "transparent", color: isSel ? tokens.color.text.onBrand : inMonth ? tokens.color.text.strong : tokens.color.text.muted }}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
