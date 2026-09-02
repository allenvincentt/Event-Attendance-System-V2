import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axisTick, chartColors, tooltipStyle } from "./chartTheme";
import { formatNumber } from "@/app/lib/format";

interface Props {
  data: { departmentCode: string; enrolled: number; attended: number }[];
  width?: number;
  height?: number;
}

export function DepartmentBarChart({ data, width, height }: Props) {
  const label = data.map((d) => `${d.departmentCode}: ${formatNumber(d.attended)} of ${formatNumber(d.enrolled)}`).join(". ");
  const chart = (
    <BarChart data={data} {...(width ? { width, height } : {})}>
      <CartesianGrid stroke={chartColors.grid} vertical={false} />
      <XAxis dataKey="departmentCode" tick={axisTick} axisLine={false} tickLine={false} />
      <YAxis tick={axisTick} axisLine={false} tickLine={false} />
      <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatNumber(v)} />
      <Legend />
      <Bar dataKey="enrolled" name="Enrolled students" fill={chartColors.target} radius={[4, 4, 0, 0]} />
      <Bar dataKey="attended" name="Attended" fill={chartColors.actual} radius={[4, 4, 0, 0]} />
    </BarChart>
  );
  return (
    <div role="img" aria-label={`Students by department. ${label}`} style={{ width: width ?? "100%", height: height ?? 300 }}>
      {width ? chart : <ResponsiveContainer width="100%" height="100%">{chart}</ResponsiveContainer>}
    </div>
  );
}
