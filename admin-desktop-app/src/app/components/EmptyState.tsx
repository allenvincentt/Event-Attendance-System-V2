import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { tokens } from "@/app/theme/tokens";
export function EmptyState({ icon = "info", title, hint, action }: { icon?: IconName; title: string; hint?: string; action?: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: tokens.space.sm, padding: tokens.space["3xl"], textAlign: "center", color: tokens.color.text.muted }}>
      <Icon name={icon} size={28} />
      <div style={{ fontSize: tokens.font.size.subtitle, fontWeight: tokens.font.weight.semibold, color: tokens.color.text.strong }}>{title}</div>
      {hint && <div style={{ fontSize: tokens.font.size.bodySm }}>{hint}</div>}
      {action}
    </div>
  );
}
