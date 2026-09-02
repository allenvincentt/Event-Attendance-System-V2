import type { CSSProperties } from "react";
import { tokens } from "@/app/theme/tokens";
export function Skeleton({ width = "100%", height = 14, radius = tokens.radius.sm, style }: { width?: number | string; height?: number | string; radius?: number; style?: CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width, height, borderRadius: radius,
        background: `linear-gradient(90deg, ${tokens.color.border.default} 25%, ${tokens.color.surface.sunken} 37%, ${tokens.color.border.default} 63%)`,
        backgroundSize: "400% 100%", animation: "skeleton-shimmer 1.4s ease infinite", ...style,
      }}
    />
  );
}
