import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { tokens } from "@/app/theme/tokens";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const bg: Record<Variant, string> = {
  primary: tokens.gradient(tokens.color.brand.primary, tokens.color.brand.primaryPressed),
  danger: tokens.gradient(tokens.color.brand.primary, tokens.color.brand.primaryPressed),
  secondary: tokens.color.surface.card,
  ghost: "transparent",
};
const fg: Record<Variant, string> = {
  primary: tokens.color.text.onBrand,
  danger: tokens.color.text.onBrand,
  secondary: tokens.color.text.strong,
  ghost: tokens.color.text.default,
};

interface Props {
  variant?: Variant;
  size?: "sm" | "md";
  icon?: IconName;
  suffix?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  children: ReactNode;
}

export function Button({
  variant = "secondary", size = "md", icon, suffix, loading = false, disabled = false,
  type = "button", onClick, children,
}: Props) {
  const inert = disabled || loading;
  const pad = size === "sm" ? `${tokens.space.xs}px ${tokens.space.md}px` : `${tokens.space.sm}px ${tokens.space.lg}px`;
  return (
    <motion.button
      type={type}
      aria-disabled={disabled || undefined}
      aria-busy={loading || undefined}
      onClick={() => { if (!inert) onClick?.(); }}
      whileHover={inert ? undefined : { y: -3 }}
      whileTap={inert ? undefined : { scale: 0.96 }}
      style={{
        display: "inline-flex", alignItems: "center", gap: tokens.space.xs,
        padding: pad, borderRadius: tokens.radius.pill,
        border: variant === "secondary" ? `1px solid ${tokens.color.border.strong}` : "none",
        background: bg[variant], color: fg[variant],
        font: "inherit", fontSize: tokens.font.size.body, fontWeight: tokens.font.weight.semibold,
        cursor: inert ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        boxShadow: variant === "primary" || variant === "danger" ? tokens.elevation.e1 : "none",
      }}
    >
      {loading ? (
        <span style={{ display: "inline-flex", animation: "spin 0.8s linear infinite" }}>
          <Icon name="refresh" size={16} />
        </span>
      ) : icon ? (
        <Icon name={icon} size={16} />
      ) : null}
      <span>{children}</span>
      {suffix != null && <span style={{ fontSize: tokens.font.size.subtitle, opacity: 0.85 }}>{suffix}</span>}
    </motion.button>
  );
}
