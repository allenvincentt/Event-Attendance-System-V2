import type { ButtonHTMLAttributes } from "react";
import { Icon, type IconName } from "./Icon";
import { registerStyle } from "../../lib/registerStyle";

registerStyle(
  "icon-button",
  `
.ud-iconbtn {
  display: inline-grid;
  place-items: center;
  flex: none;
  border-radius: var(--r-md);
  color: var(--text-muted);
  background: transparent;
  transition:
    background-color var(--dur-base) var(--ease-standard),
    color var(--dur-base) var(--ease-standard),
    transform var(--dur-fast) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out);
}

.ud-iconbtn--xs { width: 26px; height: 26px; }
.ud-iconbtn--sm { width: 30px; height: 30px; }
.ud-iconbtn--md { width: 34px; height: 34px; }
.ud-iconbtn--lg { width: 40px; height: 40px; }

.ud-iconbtn--round {
  border-radius: var(--r-pill);
}

.ud-iconbtn:hover:not(:disabled),
.ud-iconbtn:focus-visible:not(:disabled) {
  background: var(--n-100);
  color: var(--text);
  transform: translateY(-1px);
}

.ud-iconbtn:active:not(:disabled) {
  transform: scale(0.94);
  transition-duration: var(--dur-instant);
}

.ud-iconbtn--brand:hover:not(:disabled),
.ud-iconbtn--brand:focus-visible:not(:disabled) {
  background: var(--brand-soft);
  color: var(--brand);
}

.ud-iconbtn--danger:hover:not(:disabled),
.ud-iconbtn--danger:focus-visible:not(:disabled) {
  background: var(--danger-bg);
  color: var(--danger);
}

.ud-iconbtn--on-brand {
  color: var(--on-dark-muted);
}

.ud-iconbtn--on-brand:hover:not(:disabled),
.ud-iconbtn--on-brand:focus-visible:not(:disabled) {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
}

.ud-iconbtn:focus-visible {
  box-shadow: var(--focus-ring);
}

.ud-iconbtn:disabled {
  opacity: 0.45;
  transform: none;
}
`,
);

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icon: IconName;

  label: string;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "brand" | "danger" | "on-brand";
  round?: boolean;
  iconSize?: number;
}

export function IconButton({
  icon,
  label,
  size = "md",
  variant = "default",
  round = false,
  iconSize,
  className = "",
  type = "button",
  ...rest
}: IconButtonProps) {
  const fallbackIconSize =
    size === "xs" ? 14 : size === "sm" ? 15 : size === "lg" ? 20 : 17;

  return (
    <button
      type={type}
      className={[
        "ud-iconbtn",
        `ud-iconbtn--${size}`,
        variant !== "default" ? `ud-iconbtn--${variant}` : "",
        round ? "ud-iconbtn--round" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={label}
      title={label}
      {...rest}
    >
      <Icon name={icon} size={iconSize ?? fallbackIconSize} />
    </button>
  );
}

export default IconButton;
