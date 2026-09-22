import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { registerStyle } from "../../lib/registerStyle";

registerStyle(
  "card",
  `
.ud-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--sh-sm);
  transition:
    transform var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out),
    border-color var(--dur-base) var(--ease-standard),
    background-color var(--dur-base) var(--ease-standard);
}

.ud-card--flush { border-radius: var(--r-lg); }
.ud-card--pad { padding: var(--space-5); }
.ud-card--pad-sm { padding: var(--space-4); }
.ud-card--fill { flex: 1; }

.ud-card--interactive {
  cursor: pointer;
}

.ud-card--interactive:hover,
.ud-card--interactive:focus-visible {
  transform: translateY(-3px);
  background: var(--surface);
  border-color: var(--tone-border, var(--red-200));
  box-shadow: var(--tone-shadow, var(--sh-lg));
}

.ud-card--interactive:active {
  transform: translateY(-1px) scale(0.995);
  transition-duration: var(--dur-instant);
}

.ud-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-5) 0;
}

.ud-card__header--tight {
  padding-bottom: var(--space-2);
}

.ud-card__titles {
  min-width: 0;
}

.ud-card__title {
  font-size: var(--fs-16);
  font-weight: var(--fw-bold);
  color: var(--text);
  letter-spacing: -0.01em;
}

.ud-card__subtitle {
  margin-top: 2px;
  font-size: var(--fs-12);
  color: var(--text-muted);
  line-height: var(--lh-snug);
}

.ud-card__action {
  flex: none;
  font-size: var(--fs-11);
  color: var(--text-faint);
}

.ud-card__body {
  padding: var(--space-4) var(--space-5) var(--space-5);
  flex: 1;
  min-height: 0;
}

.ud-kpi {
  padding: var(--space-4) var(--space-5) var(--space-5);
  gap: var(--space-3);
  overflow: hidden;
}

.ud-kpi::after {
  content: "";
  position: absolute;
  inset: auto -30% -60% auto;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: var(--tone-wash, transparent);
  opacity: 0;
  transition: opacity var(--dur-slow) var(--ease-standard);
  pointer-events: none;
}

.ud-kpi:hover::after {
  opacity: 1;
}

.ud-kpi__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}

.ud-kpi__label {
  font-size: var(--fs-11);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--text-muted);
  line-height: 1.4;
}

.ud-kpi__badge {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: var(--r-md);
  background: var(--tone-bg, var(--brand-soft));
  color: var(--tone-fg, var(--brand));
  transition: transform var(--dur-base) var(--ease-spring);
}

.ud-card--interactive:hover .ud-kpi__badge {
  transform: scale(1.08) rotate(-4deg);
}

.ud-kpi__value {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  font-size: var(--fs-30);
  font-weight: var(--fw-bold);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.ud-kpi__unit {
  font-size: var(--fs-20);
  font-weight: var(--fw-semibold);
  color: var(--text-secondary);
}

.ud-kpi__meta {
  font-size: var(--fs-12);
  color: var(--text-muted);
  line-height: var(--lh-snug);
}

.ud-kpi__meta strong {
  color: var(--text-secondary);
  font-weight: var(--fw-semibold);
}

@media (max-width: 1180px) {
  .ud-kpi__value { font-size: var(--fs-24); }
  .ud-kpi__unit { font-size: var(--fs-18); }
}
`,
);

export type CardTone = "brand" | "success" | "accent" | "info" | "neutral";

const TONE_STYLE: Record<CardTone, CSSProperties> = {
  brand: {
    "--tone-bg": "var(--brand-soft)",
    "--tone-fg": "var(--brand)",
    "--tone-border": "var(--red-200)",
    "--tone-shadow": "0 10px 28px rgba(178, 10, 7, 0.14)",
    "--tone-wash": "radial-gradient(circle, rgba(178,10,7,0.05), transparent 70%)",
  } as CSSProperties,
  success: {
    "--tone-bg": "var(--success-bg)",
    "--tone-fg": "var(--success)",
    "--tone-border": "#bfe6cd",
    "--tone-shadow": "0 10px 28px rgba(22, 163, 74, 0.14)",
    "--tone-wash": "radial-gradient(circle, rgba(22,163,74,0.05), transparent 70%)",
  } as CSSProperties,
  accent: {
    "--tone-bg": "var(--gold-50)",
    "--tone-fg": "var(--gold-600)",
    "--tone-border": "var(--gold-200)",
    "--tone-shadow": "0 10px 28px rgba(184, 144, 13, 0.16)",
    "--tone-wash": "radial-gradient(circle, rgba(245,207,40,0.12), transparent 70%)",
  } as CSSProperties,
  info: {
    "--tone-bg": "var(--info-bg)",
    "--tone-fg": "var(--info)",
    "--tone-border": "#c3d7fb",
    "--tone-shadow": "0 10px 28px rgba(37, 99, 235, 0.14)",
    "--tone-wash": "radial-gradient(circle, rgba(37,99,235,0.05), transparent 70%)",
  } as CSSProperties,
  neutral: {
    "--tone-bg": "var(--n-100)",
    "--tone-fg": "var(--text-secondary)",
    "--tone-border": "var(--border-strong)",
    "--tone-shadow": "var(--sh-lg)",
    "--tone-wash": "radial-gradient(circle, rgba(22,26,34,0.04), transparent 70%)",
  } as CSSProperties,
};

export function toneStyle(tone: CardTone): CSSProperties {
  return TONE_STYLE[tone];
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: CardTone;
  interactive?: boolean;
  padded?: boolean | "sm";
  fill?: boolean;
}

export function Card({
  tone = "neutral",
  interactive = false,
  padded = false,
  fill = false,
  className = "",
  style,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={[
        "ud-card",
        interactive ? "ud-card--interactive" : "",
        padded === true ? "ud-card--pad" : padded === "sm" ? "ud-card--pad-sm" : "",
        fill ? "ud-card--fill" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ ...TONE_STYLE[tone], ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  tight?: boolean;
}

export function CardHeader({ title, subtitle, action, tight }: CardHeaderProps) {
  return (
    <div className={`ud-card__header${tight ? " ud-card__header--tight" : ""}`}>
      <div className="ud-card__titles">
        <h3 className="ud-card__title">{title}</h3>
        {subtitle ? <p className="ud-card__subtitle">{subtitle}</p> : null}
      </div>
      {action ? <div className="ud-card__action">{action}</div> : null}
    </div>
  );
}

export function CardBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`ud-card__body ${className}`.trim()}>{children}</div>;
}

export default Card;
