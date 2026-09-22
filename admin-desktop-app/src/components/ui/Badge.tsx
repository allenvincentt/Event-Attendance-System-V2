import type { CSSProperties, ReactNode } from "react";
import { EVENT_STATUS_LABEL, type EventStatus } from "../../enums";
import { STATUS_COLOR } from "../../constants/themeColor";
import { registerStyle } from "../../lib/registerStyle";

registerStyle(
  "badge",
  `
.ud-status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--fs-12);
  font-weight: var(--fw-semibold);
  line-height: 1;
  white-space: nowrap;
  color: var(--tone-fg);
}

.ud-status--filled {
  padding: 5px var(--space-3) 5px var(--space-2);
  border-radius: var(--r-pill);
  background: var(--tone-bg);
}

.ud-status__dot {
  width: 7px;
  height: 7px;
  flex: none;
  border-radius: 50%;
  background: var(--tone-dot);
}

.ud-status--pulse .ud-status__dot {
  animation: ud-status-pulse 2.4s var(--ease-standard) infinite;
}

@keyframes ud-status-pulse {
  0% { box-shadow: 0 0 0 0 var(--tone-dot); }
  60% { box-shadow: 0 0 0 5px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}

.ud-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 5px var(--space-3);
  border-radius: var(--r-pill);
  font-size: var(--fs-12);
  font-weight: var(--fw-medium);
  line-height: 1.1;
  white-space: nowrap;
  background: var(--n-100);
  color: var(--text-secondary);
  border: 1px solid transparent;
}

.ud-chip--brand {
  background: var(--brand-soft);
  color: var(--brand);
  border-color: var(--brand-soft-border);
}

.ud-chip--accent {
  background: var(--gold-50);
  color: var(--gold-700);
  border-color: var(--gold-200);
}

.ud-chip--outline {
  background: var(--surface);
  border-color: var(--border);
}

.ud-chip--count {
  font-variant-numeric: tabular-nums;
}
`,
);

export interface StatusBadgeProps {
  status: EventStatus;

  appearance?: "filled" | "bare";
  className?: string;
}

export function StatusBadge({
  status,
  appearance = "bare",
  className = "",
}: StatusBadgeProps) {
  const tone = STATUS_COLOR[status];
  const style = {
    "--tone-fg": tone.fg,
    "--tone-bg": tone.bg,
    "--tone-dot": tone.dot,
  } as CSSProperties;

  return (
    <span
      className={[
        "ud-status",
        appearance === "filled" ? "ud-status--filled" : "",
        status === "ongoing" ? "ud-status--pulse" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <span className="ud-status__dot" aria-hidden="true" />
      {EVENT_STATUS_LABEL[status]}
    </span>
  );
}

export interface ChipProps {
  children: ReactNode;
  tone?: "neutral" | "brand" | "accent" | "outline";
  className?: string;
  title?: string;
}

export function Chip({
  children,
  tone = "neutral",
  className = "",
  title,
}: ChipProps) {
  return (
    <span
      className={[
        "ud-chip",
        tone !== "neutral" ? `ud-chip--${tone}` : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      title={title}
    >
      {children}
    </span>
  );
}

export default StatusBadge;
