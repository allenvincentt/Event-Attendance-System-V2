import { tokens } from "@/app/theme/tokens";

export const chartColors = {
  actual: tokens.color.brand.primary,
  target: "#C9CBD1",
  grid: tokens.color.border.default,
  axis: tokens.color.text.muted,
};

export const axisTick = { fontSize: 12, fill: tokens.color.text.muted } as const;

export const tooltipStyle = {
  background: tokens.color.surface.card,
  border: `1px solid ${tokens.color.border.default}`,
  borderRadius: tokens.radius.md,
  fontSize: 12,
} as const;
