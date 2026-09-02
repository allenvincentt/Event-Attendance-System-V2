import { motion } from "framer-motion";
import { tokens } from "@/app/theme/tokens";

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        display: "inline-flex", alignItems: "center", minWidth: 44, minHeight: 44,
        border: "none", background: "transparent", cursor: "pointer", padding: tokens.space.xs,
      }}
    >
      <span
        style={{
          width: 40, height: 22, borderRadius: tokens.radius.pill, padding: 2,
          background: checked ? tokens.color.brand.primary : tokens.color.border.strong,
          transition: `background ${tokens.motion.durMs.fast}ms`,
          display: "flex", justifyContent: checked ? "flex-end" : "flex-start",
        }}
      >
        <motion.span layout style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff" }} transition={{ duration: tokens.motion.dur.fast }} />
      </span>
    </button>
  );
}
