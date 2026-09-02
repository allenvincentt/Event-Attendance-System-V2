import { motion } from "framer-motion";
import { useId } from "react";
import { Icon, type IconName } from "./Icon";
import { tokens } from "@/app/theme/tokens";

interface Props<T extends string> {
  tabs: { value: T; label: string; icon?: IconName; disabled?: boolean }[];
  value: T;
  onChange: (v: T) => void;
}

export function Tabs<T extends string>({ tabs, value, onChange }: Props<T>) {
  const groupId = useId();
  const activate = (i: number) => {
    const t = tabs[(i + tabs.length) % tabs.length];
    if (t && !t.disabled) onChange(t.value);
  };
  return (
    <div role="tablist" style={{ display: "flex", gap: tokens.space.lg, borderBottom: `1px solid ${tokens.color.border.default}` }}>
      {tabs.map((t, i) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            aria-disabled={t.disabled || undefined}
            tabIndex={active && !t.disabled ? 0 : -1}
            onClick={() => { if (!t.disabled) onChange(t.value); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") { e.preventDefault(); activate(i + 1); }
              if (e.key === "ArrowLeft") { e.preventDefault(); activate(i - 1); }
            }}
            style={{
              position: "relative", border: "none", background: "transparent",
              cursor: t.disabled ? "default" : "pointer",
              padding: `${tokens.space.sm}px ${tokens.space["2xs"]}px`,
              display: "inline-flex", alignItems: "center", gap: tokens.space.xs,
              fontSize: tokens.font.size.body,
              fontWeight: active ? tokens.font.weight.bold : tokens.font.weight.medium,
              color: t.disabled ? tokens.color.text.muted : active ? tokens.color.text.strong : tokens.color.text.muted,
              opacity: t.disabled ? 0.4 : 1,
            }}
          >
            {t.icon && <Icon name={t.icon} size={16} />}
            {t.label}
            {active && (
              <motion.span
                layoutId={`tab-${groupId}`}
                style={{ position: "absolute", left: 0, right: 0, bottom: -1, height: 2, background: tokens.color.brand.primary }}
                transition={{ duration: tokens.motion.dur.base, ease: tokens.motion.ease.standard }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
