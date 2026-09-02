import { Cell, Pie, PieChart } from "recharts";
import { chartColors } from "./chartTheme";
import { tokens } from "@/app/theme/tokens";
import { formatNumber, formatPercent } from "@/app/lib/format";

export function DonutChart({ attended, absent, size = 220 }: { attended: number; absent: number; size?: number }) {
  const total = attended + absent || 1;
  const pct = formatPercent(attended / total, 0);
  const data = [
    { name: "Attended", value: attended },
    { name: "Did not attend", value: absent },
  ];
  return (
    <div
      role="img"
      aria-label={`Turnout ${pct}. Attended ${formatNumber(attended)}, did not attend ${formatNumber(absent)}.`}
      style={{ position: "relative", width: size, height: size }}
    >
      <PieChart width={size} height={size}>
        <Pie data={data} dataKey="value" innerRadius={size * 0.32} outerRadius={size * 0.46} startAngle={90} endAngle={-270} stroke="none">
          <Cell fill={chartColors.actual} />
          <Cell fill={chartColors.target} />
        </Pie>
      </PieChart>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
        <div>
          <div style={{ fontSize: tokens.font.size.h2, fontWeight: tokens.font.weight.bold, color: tokens.color.text.strong }}>{pct}</div>
          <div style={{ fontSize: tokens.font.size.sm, color: tokens.color.text.muted }}>turnout</div>
        </div>
      </div>
    </div>
  );
}
