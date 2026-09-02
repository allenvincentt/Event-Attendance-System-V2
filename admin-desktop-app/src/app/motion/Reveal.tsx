import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { usePrefersReducedMotion } from "@/app/theme/MotionPreference";

export function Reveal({
  children, delay = 0, style, as = "div",
}: { children: ReactNode; delay?: number; style?: CSSProperties; as?: "div" | "section" }) {
  const reduced = usePrefersReducedMotion();
  const Tag = as === "section" ? motion.section : motion.div;
  if (reduced) {
    const Plain = as;
    return <Plain style={style}>{children}</Plain>;
  }
  return (
    <Tag
      style={style}
      initial={{ opacity: 0, y: 44, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.98, delay, ease: [0, 0, 0, 1] }}
    >
      {children}
    </Tag>
  );
}
