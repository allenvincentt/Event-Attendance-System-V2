import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { registerStyle } from "../../lib/registerStyle";

registerStyle(
  "general-button",
  `
.ud-btn {
  --btn-lift: -3px;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border-radius: var(--r-pill);
  font-weight: var(--fw-semibold);
  white-space: nowrap;
  text-align: center;
  isolation: isolate;
  transition:
    transform var(--dur-fast) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out),
    background-color var(--dur-base) var(--ease-standard),
    border-color var(--dur-base) var(--ease-standard),
    color var(--dur-base) var(--ease-standard),
    filter var(--dur-base) var(--ease-standard);
}

.ud-btn--primary::before,
.ud-btn--danger::before {
  content: "";
  position: absolute;
  inset: 1px 1px auto;
  height: 42%;
  border-radius: inherit;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.24),
    rgba(255, 255, 255, 0)
  );
  opacity: 0.9;
  pointer-events: none;
  z-index: -1;
}

.ud-btn--sm {
  height: 30px;
  padding: 0 var(--space-3);
  font-size: var(--fs-12);
}

.ud-btn--md {
  height: 38px;
  padding: 0 var(--space-4);
  font-size: var(--fs-13);
}

.ud-btn--lg {
  height: 44px;
  padding: 0 var(--space-6);
  font-size: var(--fs-14);
}

.ud-btn--block {
  width: 100%;
}

.ud-btn--primary {
  background: var(--grad-brand);
  color: var(--on-brand);
  box-shadow: var(--sh-brand);
}

.ud-btn--primary:hover:not(:disabled),
.ud-btn--primary:focus-visible:not(:disabled) {
  background: var(--grad-brand-hover);
  box-shadow: var(--sh-brand-lg);
  transform: translateY(var(--btn-lift));
}

.ud-btn--primary:active:not(:disabled) {
  background: var(--grad-brand-press);
}

.ud-btn--secondary {
  background: var(--surface);
  color: var(--brand);
  border: 1px solid var(--red-200);
  box-shadow: var(--sh-xs);
}

.ud-btn--secondary:hover:not(:disabled),
.ud-btn--secondary:focus-visible:not(:disabled) {
  background: var(--brand-soft);
  border-color: var(--red-300);
  box-shadow: var(--sh-md);
  transform: translateY(var(--btn-lift));
}

.ud-btn--neutral {
  background: var(--surface);
  color: var(--text-secondary);
  border: 1px solid var(--border);
  box-shadow: var(--sh-xs);
}

.ud-btn--neutral:hover:not(:disabled),
.ud-btn--neutral:focus-visible:not(:disabled) {
  background: var(--n-50);
  border-color: var(--border-strong);
  color: var(--text);
  box-shadow: var(--sh-md);
  transform: translateY(var(--btn-lift));
}

.ud-btn--ghost {
  background: transparent;
  color: var(--text-secondary);
}

.ud-btn--ghost:hover:not(:disabled),
.ud-btn--ghost:focus-visible:not(:disabled) {
  background: var(--n-100);
  color: var(--text);
}

.ud-btn--danger {
  background: linear-gradient(106deg, #dc2626 37%, #991b1b 100%);
  color: #fff;
  box-shadow: 0 4px 14px rgba(220, 38, 38, 0.3);
}

.ud-btn--danger:hover:not(:disabled),
.ud-btn--danger:focus-visible:not(:disabled) {
  filter: brightness(1.06);
  box-shadow: 0 8px 22px rgba(220, 38, 38, 0.36);
  transform: translateY(var(--btn-lift));
}

.ud-btn:active:not(:disabled) {
  transform: translateY(0) scale(0.96);
  transition-duration: var(--dur-instant);
}

.ud-btn:focus-visible {
  box-shadow: var(--focus-ring);
}

.ud-btn:disabled {
  opacity: 0.5;
  box-shadow: none;
  transform: none;
  filter: none;
}

.ud-btn__icon {
  flex: none;
  display: grid;
  place-items: center;
}

.ud-btn__label {
  display: inline-flex;
  align-items: center;
}

.ud-btn__suffix {
  font-size: 1.15em;
  font-weight: var(--fw-medium);
  opacity: 0.72;
  line-height: 1;
}

.ud-btn__spinner {
  width: 1em;
  height: 1em;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-right-color: transparent;
  animation: ud-spin 620ms linear infinite;
}
`,
);

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "neutral"
  | "ghost"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export interface GeneralButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;

  icon?: IconName;

  suffix?: ReactNode;
  block?: boolean;
  loading?: boolean;
}

export function GeneralButton({
  variant = "primary",
  size = "md",
  icon,
  suffix,
  block = false,
  loading = false,
  disabled,
  className = "",
  children,
  type = "button",
  ...rest
}: GeneralButtonProps) {
  const classes = [
    "ud-btn",
    `ud-btn--${variant}`,
    `ud-btn--${size}`,
    block ? "ud-btn--block" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const iconSize = size === "sm" ? 14 : size === "lg" ? 18 : 16;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span className="ud-btn__spinner" aria-hidden="true" />
      ) : icon ? (
        <span className="ud-btn__icon">
          <Icon name={icon} size={iconSize} />
        </span>
      ) : null}
      {children ? <span className="ud-btn__label">{children}</span> : null}
      {suffix ? <span className="ud-btn__suffix">{suffix}</span> : null}
    </button>
  );
}

export default GeneralButton;
