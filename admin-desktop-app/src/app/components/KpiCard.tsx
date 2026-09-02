import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { ProgressBar } from "./ProgressBar";
import { tokens } from "@/app/theme/tokens";
import { formatNumber } from "@/app/lib/format";
import { useCountUp } from "@/app/motion/useCountUp";
import { staggerItem } from "@/app/motion/transitions";

interface Props {
  label: string;
  value: number;
  format?: (n: number) => string;
  footnote?: ReactNode;
  accent?: string;
  progress?: number;
  icon?: IconName;
}

export function KpiCard({ label, value, format = formatNumber, footnote, accent, progress, icon }: Props) {
  const animated = useCountUp(Math.round(value * (format === formatNumber ? 1 : 1000)));
  const shown = format === formatNumber ? format(animated) : format(animated / 1000);
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -2, boxShadow: tokens.elevation.e2, borderColor: accent ?? tokens.color.border.strong }}
      style={{
        background: tokens.color.surface.card, border: `1px solid ${tokens.color.border.default}`,
        borderRadius: tokens.radius.lg, boxShadow: tokens.elevation.e1, padding: tokens.space.xl,
        display: "flex", flexDirection: "column", gap: tokens.space.xs,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: tokens.font.size.xs, letterSpacing: 0.6, textTransform: "uppercase", color: tokens.color.text.muted, fontWeight: tokens.font.weight.semibold }}>{label}</span>
        {icon && <span style={{ color: accent ?? tokens.color.text.muted }}><Icon name={icon} size={18} /></span>}
      </div>
      <span style={{ fontSize: tokens.font.size.kpi, fontWeight: tokens.font.weight.semibold, color: tokens.color.text.strong, fontVariantNumeric: "tabular-nums" }}>{shown}</span>
      {progress != null && <ProgressBar value={progress} color={accent ?? tokens.color.brand.primary} />}
      {footnote != null && <span style={{ fontSize: tokens.font.size.sm, color: tokens.color.text.muted }}>{footnote}</span>}
    </motion.div>
  );
}
