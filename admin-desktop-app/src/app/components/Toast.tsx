import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { tokens, type StatusKey } from "@/app/theme/tokens";

type Kind = "success" | "error" | "info";
interface ToastItem { id: number; kind: Kind; message: string; }

const ICONS: Record<Kind, IconName> = { success: "check", error: "alertTriangle", info: "info" };
const FAMILY: Record<Kind, StatusKey> = { success: "success", error: "danger", info: "info" };

const Ctx = createContext<{ show: (t: { kind?: Kind; message: string }) => void } | null>(null);

export function ToastProvider({ children, dismissMs = 4000 }: { children: ReactNode; dismissMs?: number }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seq = useRef(0);
  const remove = useCallback((id: number) => setItems((l) => l.filter((t) => t.id !== id)), []);
  const show = useCallback((t: { kind?: Kind; message: string }) => {
    const item: ToastItem = { id: ++seq.current, kind: t.kind ?? "info", message: t.message };
    setItems((l) => [...l, item]);
    setTimeout(() => remove(item.id), dismissMs);
  }, [remove, dismissMs]);

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <div role="status" aria-live="polite" style={{ position: "fixed", right: tokens.space.xl, bottom: tokens.space.xl, display: "flex", flexDirection: "column", gap: tokens.space.sm, zIndex: 1000 }}>
        <AnimatePresence>
          {items.map((t) => {
            const c = tokens.color.status[FAMILY[t.kind]];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24, transition: { duration: tokens.motion.dur.fast } }}
                style={{ display: "flex", alignItems: "center", gap: tokens.space.sm, padding: `${tokens.space.sm}px ${tokens.space.md}px`, background: tokens.color.surface.card, border: `1px solid ${tokens.color.border.default}`, borderLeft: `3px solid ${c.base}`, borderRadius: tokens.radius.md, boxShadow: tokens.elevation.e2, minWidth: 260 }}
              >
                <span style={{ color: c.base }}><Icon name={ICONS[t.kind]} size={16} /></span>
                <span style={{ flex: 1, fontSize: tokens.font.size.bodySm }}>{t.message}</span>
                <button type="button" aria-label="Dismiss" onClick={() => remove(t.id)} style={{ border: "none", background: "transparent", cursor: "pointer", color: tokens.color.text.muted }}>
                  <Icon name="close" size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useToast must be used within <ToastProvider>");
  return c;
}
