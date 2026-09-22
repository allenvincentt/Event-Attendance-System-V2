import { useEffect, useMemo, useState } from "react";
import { CHART } from "../../constants/themeColor";
import { formatNumber, percentOf } from "../../lib/format";
import { useElementWidth } from "../../lib/useElementWidth";
import { usePrefersReducedMotion } from "../common/motion/usePrefersReducedMotion";
import { registerStyle } from "../../lib/registerStyle";

registerStyle(
  "dept-bar-chart",
  `
.ud-bars {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-width: 0;
}

.ud-bars__plot {
  position: relative;
  width: 100%;
  min-width: 0;
}

.ud-bars__svg {
  display: block;
  width: 100%;
}

.ud-bars__grid {
  stroke: var(--viz-grid);
  stroke-width: 1;
  shape-rendering: crispEdges;
}

.ud-bars__ylabel {
  fill: var(--text-faint);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
}

.ud-bars__xlabel {
  fill: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
}

.ud-bars__bar {
  transition: height 900ms var(--ease-out), y 900ms var(--ease-out);
}

.ud-bars__hit {
  fill: transparent;
  transition: fill var(--dur-fast) var(--ease-standard);
}

.ud-bars__group:hover .ud-bars__hit {
  fill: rgba(178, 10, 7, 0.045);
}

.ud-bars__group:hover .ud-bars__bar {
  filter: brightness(1.08);
}

.ud-bars__legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-5);
  font-size: var(--fs-12);
  color: var(--text-secondary);
}

.ud-bars__legend-item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.ud-bars__swatch {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex: none;
}

.ud-bars__tip {
  position: absolute;
  z-index: 5;
  transform: translate(-50%, -110%);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--r-sm);
  background: var(--n-900);
  color: #fff;
  font-size: var(--fs-11);
  line-height: 1.6;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: var(--sh-lg);
  animation: ud-fade-in var(--dur-fast) var(--ease-out);
}

.ud-bars__tip-title {
  font-weight: var(--fw-bold);
  margin-bottom: 2px;
}

.ud-bars__tip-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  color: rgba(255, 255, 255, 0.78);
}

.ud-bars__tip-row b {
  color: #fff;
  font-variant-numeric: tabular-nums;
}

.ud-bars__tip-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  margin-right: 6px;
}
`,
);

export interface DepartmentBarDatum {
  code: string;
  name: string;
  enrolled: number;
  attended: number;
}

export interface DepartmentBarChartProps {
  data: ReadonlyArray<DepartmentBarDatum>;
  height?: number;
  enrolledLabel?: string;
  attendedLabel?: string;
}

const TICK_COUNT = 4;
const STEP_MULTIPLES = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];

function niceCeiling(value: number): number {
  if (value <= 0) return 100;
  const raw = value / TICK_COUNT;
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
  const normalised = raw / magnitude;
  const multiple =
    STEP_MULTIPLES.find((candidate) => candidate >= normalised) ?? 10;
  return multiple * magnitude * TICK_COUNT;
}

export function DepartmentBarChart({
  data,
  height = 220,
  enrolledLabel = "Enrolled students",
  attendedLabel = "Attended",
}: DepartmentBarChartProps) {
  const reduced = usePrefersReducedMotion();
  const [plotRef, width] = useElementWidth<HTMLDivElement>();
  const [grown, setGrown] = useState(reduced);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setGrown(true);
      return;
    }
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  const max = useMemo(
    () => niceCeiling(Math.max(1, ...data.map((d) => d.enrolled))),
    [data],
  );

  const padLeft = 38;
  const padRight = 10;
  const padTop = 10;
  const padBottom = 26;
  const plotW = Math.max(0, width - padLeft - padRight);
  const plotH = height - padTop - padBottom;
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  const slot = data.length > 0 ? plotW / data.length : 0;
  const barW = Math.max(6, Math.min(26, slot * 0.2));
  const gap = Math.max(3, barW * 0.28);

  return (
    <div className="ud-bars">
      <div className="ud-bars__plot" ref={plotRef}>
        {width > 0 ? (
          <svg
            className="ud-bars__svg"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={`Enrolled head-count against attendance across ${data.length} departments`}
          >
            {ticks.map((t) => {
              const y = padTop + plotH * (1 - t);
              return (
                <g key={t}>
                  <line
                    className="ud-bars__grid"
                    x1={padLeft}
                    x2={width - padRight}
                    y1={y}
                    y2={y}
                  />
                  <text className="ud-bars__ylabel" x={0} y={y + 3}>
                    {formatNumber(Math.round(max * t))}
                  </text>
                </g>
              );
            })}

            {data.map((datum, index) => {
              const cx = padLeft + slot * index + slot / 2;
              const enrolledH = grown ? (datum.enrolled / max) * plotH : 0;
              const attendedH = grown ? (datum.attended / max) * plotH : 0;
              return (
                <g
                  key={datum.code}
                  className="ud-bars__group"
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(null)}
                >
                  <rect
                    className="ud-bars__hit"
                    x={cx - slot / 2}
                    y={padTop}
                    width={slot}
                    height={plotH}
                  />
                  <rect
                    className="ud-bars__bar"
                    x={cx - barW - gap / 2}
                    y={padTop + plotH - enrolledH}
                    width={barW}
                    height={enrolledH}
                    fill={CHART.enrolled}
                    rx={2}
                  />
                  <rect
                    className="ud-bars__bar"
                    x={cx + gap / 2}
                    y={padTop + plotH - attendedH}
                    width={barW}
                    height={attendedH}
                    fill={CHART.attended}
                    rx={2}
                  />
                  <text
                    className="ud-bars__xlabel"
                    x={cx}
                    y={height - 8}
                    textAnchor="middle"
                  >
                    {datum.code}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : null}

        {hover !== null && data[hover] ? (
          <div
            className="ud-bars__tip"
            style={{
              left: padLeft + slot * hover + slot / 2,
              top: padTop + plotH * 0.32,
            }}
          >
            <div className="ud-bars__tip-title">{data[hover].name}</div>
            <div className="ud-bars__tip-row">
              <span>
                <span
                  className="ud-bars__tip-dot"
                  style={{ background: CHART.enrolled }}
                />
                {enrolledLabel}
              </span>
              <b>{formatNumber(data[hover].enrolled)}</b>
            </div>
            <div className="ud-bars__tip-row">
              <span>
                <span
                  className="ud-bars__tip-dot"
                  style={{ background: CHART.attended }}
                />
                {attendedLabel}
              </span>
              <b>{formatNumber(data[hover].attended)}</b>
            </div>
            <div className="ud-bars__tip-row">
              <span>Turnout</span>
              <b>
                {percentOf(data[hover].attended, data[hover].enrolled).toFixed(1)}%
              </b>
            </div>
          </div>
        ) : null}
      </div>

      <div className="ud-bars__legend">
        <span className="ud-bars__legend-item">
          <span className="ud-bars__swatch" style={{ background: CHART.enrolled }} />
          {enrolledLabel}
        </span>
        <span className="ud-bars__legend-item">
          <span className="ud-bars__swatch" style={{ background: CHART.attended }} />
          {attendedLabel}
        </span>
      </div>
    </div>
  );
}

export default DepartmentBarChart;
