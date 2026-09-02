import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axisTick, chartColors, tooltipStyle } from "./chartTheme";
import { formatPercent } from "@/app/lib/format";

interface Props {
  points: { label: string; rate: number }[];
  width?: number;
  height?: number;
}

export function AttendanceTrendChart({ points, width, height }: Props) {
  const data = points.map((p) => ({ label: p.label, pct: Math.round(p.rate * 100) }));
  const summary = points.map((p) => `${p.label} ${formatPercent(p.rate, 0)}`).join(", ");
  const chart = (
    <AreaChart data={data} {...(width ? { width, height } : {})}>
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={chartColors.actual} stopOpacity={0.25} />
          <stop offset="100%" stopColor={chartColors.actual} stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid stroke={chartColors.grid} vertical={false} />
      <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} />
      <YAxis domain={[0, 100]} tick={axisTick} axisLine={false} tickLine={false} unit="%" />
      <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
      <Area type="monotone" dataKey="pct" stroke={chartColors.actual} strokeWidth={2} fill="url(#trendFill)" dot={{ r: 4, fill: chartColors.actual }} />
    </AreaChart>
  );
  return (
    <div role="img" aria-label={`Attendance rate over recent events: ${summary}.`} style={{ width: width ?? "100%", height: height ?? 260 }}>
      {width ? chart : <ResponsiveContainer width="100%" height="100%">{chart}</ResponsiveContainer>}
    </div>
  );
}
