import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";
import { tokens } from "@/app/theme/tokens";
import { modalBackdrop, modalPanel } from "@/app/motion/transitions";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  width?: number;
  dismissOnBackdrop?: boolean;
  footer?: ReactNode;
  children: ReactNode;
}

export function Modal({ open, onClose, title, width = 560, dismissOnBackdrop = true, footer, children }: Props) {
  const labelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnFocusTo.current = document.activeElement as HTMLElement;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); }
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (f.length === 0) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      returnFocusTo.current?.focus();
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          data-testid="modal-backdrop"
          variants={modalBackdrop}
          initial="initial" animate="animate" exit="exit"
          onMouseDown={(e) => { if (dismissOnBackdrop && e.target === e.currentTarget) onClose(); }}
          style={{ position: "fixed", inset: 0, background: "rgba(20,20,22,0.45)", display: "grid", placeItems: "center", zIndex: 900, padding: tokens.space.xl }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? labelId : undefined}
            aria-label={title ? undefined : "Dialog"}
            tabIndex={-1}
            variants={modalPanel}
            initial="initial" animate="animate" exit="exit"
            style={{ width, maxWidth: "100%", maxHeight: "88vh", display: "flex", flexDirection: "column", background: tokens.color.surface.card, borderRadius: tokens.radius.xl, boxShadow: tokens.elevation.e3, overflow: "hidden" }}
          >
            {title != null && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `${tokens.space.md}px ${tokens.space.lg}px`, borderBottom: `1px solid ${tokens.color.border.default}` }}>
                <h2 id={labelId} style={{ margin: 0, fontSize: tokens.font.size.subtitle, fontWeight: tokens.font.weight.bold, color: tokens.color.text.strong }}>{title}</h2>
                <button type="button" aria-label="Close" onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", color: tokens.color.text.muted }}>
                  <Icon name="close" size={18} />
                </button>
              </div>
            )}
            <div style={{ padding: tokens.space.lg, overflow: "auto", flex: 1 }}>{children}</div>
            {footer != null && (
              <div style={{ display: "flex", justifyContent: "flex-end", gap: tokens.space.sm, padding: `${tokens.space.md}px ${tokens.space.lg}px`, borderTop: `1px solid ${tokens.color.border.default}` }}>{footer}</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
