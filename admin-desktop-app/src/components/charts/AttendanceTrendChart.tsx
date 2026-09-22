import { useEffect, useRef, useState } from "react";
import { CHART } from "../../constants/themeColor";
import { formatDateShort } from "../../lib/format";
import { useElementWidth } from "../../lib/useElementWidth";
import { usePrefersReducedMotion } from "../common/motion/usePrefersReducedMotion";
import { registerStyle } from "../../lib/registerStyle";

registerStyle(
  "trend-chart",
  `
.ud-trend {
  position: relative;
  width: 100%;
  min-width: 0;
}

.ud-trend__svg {
  display: block;
  width: 100%;
}

.ud-trend__grid {
  stroke: var(--viz-grid);
  stroke-width: 1;
  shape-rendering: crispEdges;
}

.ud-trend__ylabel {
  fill: var(--text-faint);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
}

.ud-trend__xlabel {
  fill: var(--text-muted);
  font-size: 11px;
}

.ud-trend__area {
  transition: opacity var(--dur-slower) var(--ease-out);
}

.ud-trend__line {
  fill: none;
  stroke: var(--viz-attended);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ud-trend__line--draw {
  animation: ud-draw-line 1200ms var(--ease-out) forwards;
}

.ud-trend__dot {
  fill: var(--viz-attended);
  stroke: #fff;
  stroke-width: 2;
  transition: r var(--dur-fast) var(--ease-spring);
}

.ud-trend__dot[data-active="true"] {
  r: 6;
}

.ud-trend__hit {
  fill: transparent;
  cursor: default;
}

.ud-trend__cursor {
  stroke: var(--red-300);
  stroke-width: 1;
  stroke-dasharray: 3 3;
}

.ud-trend__tip {
  position: absolute;
  z-index: 5;
  transform: translate(-50%, -125%);
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

.ud-trend__tip-title {
  font-weight: var(--fw-bold);
}

.ud-trend__tip-meta {
  color: rgba(255, 255, 255, 0.72);
}

.ud-trend__tip-value {
  font-variant-numeric: tabular-nums;
  font-weight: var(--fw-bold);
}
`,
);

export interface TrendDatum {
  eventId: string;
  name: string;
  date: string;
  rate: number;
}

export interface AttendanceTrendChartProps {
  data: ReadonlyArray<TrendDatum>;
  height?: number;
}

export function AttendanceTrendChart({
  data,
  height = 200,
}: AttendanceTrendChartProps) {
  const reduced = usePrefersReducedMotion();
  const [plotRef, width] = useElementWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);

  const padLeft = 34;
  const padRight = 12;
  const padTop = 12;
  const padBottom = 26;
  const plotW = Math.max(0, width - padLeft - padRight);
  const plotH = height - padTop - padBottom;
  const ticks = [0, 25, 50, 75, 100];

  const xAt = (index: number) =>
    data.length <= 1
      ? padLeft + plotW / 2
      : padLeft + (plotW * index) / (data.length - 1);
  const yAt = (rate: number) => padTop + plotH * (1 - rate / 100);

  const line = data.map((d, i) => `${xAt(i)},${yAt(d.rate)}`).join(" L ");
  const linePath = data.length > 0 ? `M ${line}` : "";
  const areaPath =
    data.length > 0
      ? `${linePath} L ${xAt(data.length - 1)},${padTop + plotH} L ${xAt(0)},${padTop + plotH} Z`
      : "";

  useEffect(() => {
    if (lineRef.current) setLength(lineRef.current.getTotalLength());
  }, [linePath, width]);

  return (
    <div className="ud-trend" ref={plotRef}>
      {width > 0 && data.length > 0 ? (
        <svg
          className="ud-trend__svg"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Attendance rate across ${data.length} recent events`}
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="ud-trend-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART.attended} stopOpacity="0.22" />
              <stop offset="100%" stopColor={CHART.attended} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {ticks.map((t) => {
            const y = yAt(t);
            return (
              <g key={t}>
                <line
                  className="ud-trend__grid"
                  x1={padLeft}
                  x2={width - padRight}
                  y1={y}
                  y2={y}
                />
                <text className="ud-trend__ylabel" x={0} y={y + 3}>
                  {t}%
                </text>
              </g>
            );
          })}

          <path
            className="ud-trend__area"
            d={areaPath}
            fill="url(#ud-trend-fill)"
          />

          <path
            ref={lineRef}
            className={`ud-trend__line${reduced || length === 0 ? "" : " ud-trend__line--draw"}`}
            d={linePath}
            style={
              reduced || length === 0
                ? undefined
                : { strokeDasharray: length, strokeDashoffset: length }
            }
          />

          {hover !== null ? (
            <line
              className="ud-trend__cursor"
              x1={xAt(hover)}
              x2={xAt(hover)}
              y1={padTop}
              y2={padTop + plotH}
            />
          ) : null}

          {data.map((datum, index) => (
            <circle
              key={datum.eventId}
              className="ud-trend__dot"
              cx={xAt(index)}
              cy={yAt(datum.rate)}
              r={hover === index ? 6 : 4}
              data-active={hover === index}
            />
          ))}

          {data.map((datum, index) => (
            <text
              key={`${datum.eventId}-label`}
              className="ud-trend__xlabel"
              x={xAt(index)}
              y={height - 8}
              textAnchor={
                index === 0 ? "start" : index === data.length - 1 ? "end" : "middle"
              }
            >
              {formatDateShort(datum.date).replace(/,.*$/, "")}
            </text>
          ))}

          {data.map((datum, index) => {
            const slot = data.length > 1 ? plotW / (data.length - 1) : plotW;
            return (
              <rect
                key={`${datum.eventId}-hit`}
                className="ud-trend__hit"
                x={xAt(index) - slot / 2}
                y={padTop}
                width={slot}
                height={plotH}
                onMouseEnter={() => setHover(index)}
              />
            );
          })}
        </svg>
      ) : null}

      {hover !== null && data[hover] ? (
        <div
          className="ud-trend__tip"
          style={{ left: xAt(hover), top: yAt(data[hover].rate) }}
        >
          <div className="ud-trend__tip-title">{data[hover].name}</div>
          <div className="ud-trend__tip-meta">
            {formatDateShort(data[hover].date)} {"\u00b7"}{" "}
            <span className="ud-trend__tip-value">
              {data[hover].rate.toFixed(1)}%
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AttendanceTrendChart;
