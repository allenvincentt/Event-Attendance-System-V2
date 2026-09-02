import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { tokens } from "@/app/theme/tokens";

export function Card({
  as = "div", interactive = false, accent, style, children,
}: { as?: "div" | "section"; interactive?: boolean; accent?: string; style?: CSSProperties; children: ReactNode }) {
  const Tag = as === "section" ? motion.section : motion.div;
  return (
    <Tag
      whileHover={interactive ? { y: -2, boxShadow: tokens.elevation.e2, borderColor: accent ?? tokens.color.border.strong } : undefined}
      style={{
        background: tokens.color.surface.card,
        border: `1px solid ${tokens.color.border.default}`,
        borderRadius: tokens.radius.lg,
        boxShadow: tokens.elevation.e1,
        padding: tokens.space.xl,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
