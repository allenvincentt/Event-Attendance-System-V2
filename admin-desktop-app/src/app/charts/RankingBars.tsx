import { DepartmentLogo } from "@/app/components/DepartmentLogo";
import { ProgressBar } from "@/app/components/ProgressBar";
import { departmentByCode } from "@/data/departments";
import { tokens } from "@/app/theme/tokens";
import { formatNumber, formatPercent } from "@/app/lib/format";

export function RankingBars({ rows }: { rows: { departmentCode: string; rate: number; attended: number; invited: number }[] }) {
  return (
    <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: tokens.space.md }}>
      {rows.map((r) => {
        const dept = departmentByCode(r.departmentCode);
        return (
          <li key={r.departmentCode} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: tokens.space.sm }}>
            <DepartmentLogo code={r.departmentCode} />
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.space["2xs"], minWidth: 0 }}>
              <span style={{ fontSize: tokens.font.size.bodySm, fontWeight: tokens.font.weight.semibold, color: tokens.color.text.strong, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{dept.name}</span>
              <ProgressBar value={r.rate} label={`${dept.name} turnout`} />
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: tokens.font.size.bodySm, fontWeight: tokens.font.weight.bold }}>{formatPercent(r.rate, 0)}</div>
              <div style={{ fontSize: tokens.font.size.sm, color: tokens.color.text.muted }}>{formatNumber(r.attended)} of {formatNumber(r.invited)}</div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
