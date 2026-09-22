import { clamp } from "../../lib/format";
import { registerStyle } from "../../lib/registerStyle";

registerStyle(
  "progress-bar",
  `
.ud-progress {
  position: relative;
  width: 100%;
  border-radius: var(--r-pill);
  background: var(--viz-track);
  overflow: hidden;
}

.ud-progress--xs { height: 5px; }
.ud-progress--sm { height: 7px; }
.ud-progress--md { height: 10px; }

.ud-progress__fill {
  height: 100%;
  border-radius: inherit;
  background: var(--grad-brand);
  transform-origin: left center;
  transition: width var(--dur-slower) var(--ease-out);
}

.ud-progress--accent .ud-progress__fill {
  background: var(--grad-accent);
}

.ud-progress--muted .ud-progress__fill {
  background: linear-gradient(106deg, var(--n-400) 37%, var(--n-500) 100%);
}

.ud-progress__fill[data-empty="true"] {
  min-width: 0;
}
`,
);

export interface ProgressBarProps {
  value: number;
  size?: "xs" | "sm" | "md";
  tone?: "brand" | "accent" | "muted";
  label?: string;
  className?: string;
}

export function ProgressBar({
  value,
  size = "sm",
  tone = "brand",
  label,
  className = "",
}: ProgressBarProps) {
  const pct = clamp(value, 0, 100);
  return (
    <div
      className={[
        "ud-progress",
        `ud-progress--${size}`,
        tone !== "brand" ? `ud-progress--${tone}` : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className="ud-progress__fill"
        style={{ width: `${pct}%` }}
        data-empty={pct === 0}
      />
    </div>
  );
}

export default ProgressBar;
