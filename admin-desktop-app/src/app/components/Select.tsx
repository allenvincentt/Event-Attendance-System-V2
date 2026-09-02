import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { tokens } from "@/app/theme/tokens";

interface Props<T extends string> {
  options: { value: T; label: string; hint?: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
  placeholder?: string;
}

export function Select<T extends string>({ options, value, onChange, ariaLabel, placeholder }: Props<T>) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(Math.max(0, options.findIndex((o) => o.value === value)));
  const triggerRef = useRef<HTMLButtonElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!triggerRef.current?.parentElement?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const choose = (i: number) => { onChange(options[i].value); setOpen(false); triggerRef.current?.focus(); };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (["ArrowDown", "Enter", " "].includes(e.key)) { e.preventDefault(); setOpen(true); }
          if (e.key === "Escape") setOpen(false);
        }}
        style={{ display: "inline-flex", alignItems: "center", gap: tokens.space.xs, minWidth: 180, justifyContent: "space-between", border: `1px solid ${tokens.color.border.strong}`, borderRadius: tokens.radius.md, padding: `${tokens.space.xs}px ${tokens.space.sm}px`, background: tokens.color.surface.card, cursor: "pointer", fontSize: tokens.font.size.bodySm, color: current ? tokens.color.text.strong : tokens.color.text.muted }}
      >
        {current?.label ?? placeholder ?? "Select…"}
        <motion.span animate={{ rotate: open ? 180 : 0 }}><Icon name="chevronDown" size={16} /></motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={ariaLabel}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, transition: { duration: tokens.motion.dur.fast } }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, options.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
              if (e.key === "Enter") { e.preventDefault(); choose(active); }
              if (e.key === "Escape") { setOpen(false); triggerRef.current?.focus(); }
            }}
            tabIndex={-1}
            ref={(el) => el?.focus()}
            style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, minWidth: "100%", listStyle: "none", margin: 0, padding: tokens.space["2xs"], background: tokens.color.surface.card, border: `1px solid ${tokens.color.border.default}`, borderRadius: tokens.radius.md, boxShadow: tokens.elevation.e2, zIndex: 50 }}
          >
            {options.map((o, i) => (
              <li
                key={o.value}
                role="option"
                aria-selected={o.value === value}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(i)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: tokens.space.sm, padding: `${tokens.space.xs}px ${tokens.space.sm}px`, borderRadius: tokens.radius.sm, cursor: "pointer", background: i === active ? tokens.color.brand.primarySoft : "transparent", fontSize: tokens.font.size.bodySm }}
              >
                <span>{o.label}{o.hint && <span style={{ color: tokens.color.text.muted }}> · {o.hint}</span>}</span>
                {o.value === value && <Icon name="check" size={14} />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
