import { initialsOf } from "../../lib/format";
import type { Department } from "../../models";
import { registerStyle } from "../../lib/registerStyle";

registerStyle(
  "avatar",
  `
.ud-avatar {
  display: inline-grid;
  place-items: center;
  flex: none;
  border-radius: var(--r-pill);
  background: var(--grad-brand);
  color: #fff;
  font-weight: var(--fw-bold);
  letter-spacing: 0.02em;
  line-height: 1;
  user-select: none;
  box-shadow: var(--sh-sm);
}

.ud-avatar--xs { width: 24px; height: 24px; font-size: 9px; }
.ud-avatar--sm { width: 30px; height: 30px; font-size: var(--fs-11); }
.ud-avatar--md { width: 36px; height: 36px; font-size: var(--fs-13); }
.ud-avatar--lg { width: 44px; height: 44px; font-size: var(--fs-16); }

.ud-avatar--soft {
  background: var(--brand-soft);
  color: var(--brand);
  box-shadow: none;
}

.ud-avatar--neutral {
  background: var(--n-100);
  color: var(--text-muted);
  box-shadow: none;
}

.ud-deptlogo {
  position: relative;
  display: inline-grid;
  place-items: center;
  flex: none;
  border-radius: var(--r-pill);
  overflow: hidden;
  background: var(--surface);
  transition:
    transform var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out);
}

.ud-deptlogo--xs { width: 24px; height: 24px; }
.ud-deptlogo--sm { width: 30px; height: 30px; }
.ud-deptlogo--md { width: 38px; height: 38px; }
.ud-deptlogo--lg { width: 64px; height: 64px; }
.ud-deptlogo--xl { width: 96px; height: 96px; }

.ud-deptlogo__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8%;
}

.ud-deptlogo--ring {
  border: 1px solid var(--border);
  box-shadow: var(--sh-xs);
}

.ud-deptlogo--code {
  background: var(--brand-soft);
  color: var(--brand);
  font-weight: var(--fw-bold);
  line-height: 1;
  overflow: hidden;
}

.ud-deptlogo--code.ud-deptlogo--xs { font-size: 8px; }
.ud-deptlogo--code.ud-deptlogo--sm { font-size: 9px; }
.ud-deptlogo--code.ud-deptlogo--md { font-size: var(--fs-11); }
.ud-deptlogo--code.ud-deptlogo--lg { font-size: var(--fs-14); }

.ud-deptlogo--code[data-len="4"] { font-size: 0.86em; }
.ud-deptlogo--code[data-len="5"] { font-size: 0.72em; letter-spacing: -0.02em; }

.ud-deptlogo__code {
  padding: 0 2px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: clip;
  white-space: nowrap;
}
`,
);

export type AvatarSize = "xs" | "sm" | "md" | "lg";

export interface AvatarProps {
  name: string;
  size?: AvatarSize;
  tone?: "brand" | "soft" | "neutral";
  className?: string;
}

export function Avatar({
  name,
  size = "md",
  tone = "brand",
  className = "",
}: AvatarProps) {
  return (
    <span
      className={[
        "ud-avatar",
        `ud-avatar--${size}`,
        tone !== "brand" ? `ud-avatar--${tone}` : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      {initialsOf(name)}
    </span>
  );
}

export type DepartmentLogoSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface DepartmentLogoProps {
  department: Department;
  size?: DepartmentLogoSize;

  variant?: "image" | "code";
  ring?: boolean;
  className?: string;
}

export function DepartmentLogo({
  department,
  size = "md",
  variant = "image",
  ring = false,
  className = "",
}: DepartmentLogoProps) {
  const classes = [
    "ud-deptlogo",
    `ud-deptlogo--${size}`,
    variant === "code" ? "ud-deptlogo--code" : "",
    ring ? "ud-deptlogo--ring" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (variant === "code") {
    return (
      <span
        className={classes}
        data-len={Math.min(5, department.code.length)}
        aria-hidden="true"
      >
        <span className="ud-deptlogo__code">{department.code}</span>
      </span>
    );
  }

  return (
    <span className={classes}>
      <img
        className="ud-deptlogo__img"
        src={department.logo}
        alt={`${department.name} seal`}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </span>
  );
}

export default Avatar;
