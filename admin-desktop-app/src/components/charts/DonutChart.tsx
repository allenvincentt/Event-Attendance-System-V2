import { useEffect, useState } from "react";
import { CHART } from "../../constants/themeColor";
import { usePrefersReducedMotion } from "../common/motion/usePrefersReducedMotion";
import { registerStyle } from "../../lib/registerStyle";

registerStyle(
  "donut-chart",
  `
.ud-donut {
  display: grid;
  place-items: center;
  position: relative;
}

.ud-donut__svg {
  transform: rotate(-90deg);
  overflow: visible;
}

.ud-donut__value {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  pointer-events: none;
}

.ud-donut__number {
  font-size: var(--fs-24);
  font-weight: var(--fw-bold);
  color: var(--text);
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.ud-donut__caption {
  font-size: var(--fs-11);
  color: var(--text-muted);
}

.ud-donut__arc {
  transition: stroke-dashoffset 1100ms var(--ease-out);
}
`,
);

export interface DonutChartProps {
  value: number;
  caption?: string;
  size?: number;
  thickness?: number;
  label: string;
}

export function DonutChart({
  value,
  caption = "turnout",
  size = 168,
  thickness = 26,
  label,
}: DonutChartProps) {
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setProgress(value);
      return;
    }
    const id = requestAnimationFrame(() => setProgress(value));
    return () => cancelAnimationFrame(id);
  }, [value, reduced]);

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, progress)) / 100);

  return (
    <div className="ud-donut" style={{ width: size, height: size }}>
      <svg
        className="ud-donut__svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${label}: ${value.toFixed(1)} percent`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={CHART.track}
          strokeWidth={thickness}
        />
        <circle
          className="ud-donut__arc"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={CHART.attended}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="ud-donut__value">
        <span className="ud-donut__number">{Math.round(value)}%</span>
        <span className="ud-donut__caption">{caption}</span>
      </span>
    </div>
  );
}

export default DonutChart;
