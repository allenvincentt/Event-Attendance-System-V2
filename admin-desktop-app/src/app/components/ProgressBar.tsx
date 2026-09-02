import { motion } from "framer-motion";
import { tokens } from "@/app/theme/tokens";

export function ProgressBar({
  value, color = tokens.color.brand.primary, trackColor = tokens.color.border.default, label,
}: { value: number; color?: string; trackColor?: string; label?: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ height: 8, borderRadius: tokens.radius.pill, background: trackColor, overflow: "hidden" }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: tokens.motion.dur.slow, ease: tokens.motion.ease.decel }}
        style={{ height: "100%", background: color, borderRadius: tokens.radius.pill }}
      />
    </div>
  );
}
