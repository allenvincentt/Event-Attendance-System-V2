import { DepartmentLogo } from "../ui/Avatar";
import { ProgressBar } from "../ui/ProgressBar";
import { formatNumber } from "../../lib/format";
import type { Department } from "../../models";
import { registerStyle } from "../../lib/registerStyle";

registerStyle(
  "ranking-bars",
  `
.ud-rank {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.ud-rank__row {
  display: grid;
  grid-template-columns: 34px 1fr auto;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-1) 0;
}

.ud-rank__body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ud-rank__name {
  font-size: var(--fs-13);
  font-weight: var(--fw-semibold);
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ud-rank__figures {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex: none;
}

.ud-rank__pct {
  font-size: var(--fs-13);
  font-weight: var(--fw-bold);
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.ud-rank__count {
  font-size: var(--fs-11);
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
`,
);

export interface RankingDatum {
  department: Department;
  enrolled: number;
  attended: number;
  rate: number;
}

export interface RankingBarsProps {
  data: ReadonlyArray<RankingDatum>;
}

export function RankingBars({ data }: RankingBarsProps) {
  return (
    <div className="ud-rank">
      {data.map((item) => (
        <div className="ud-rank__row" key={item.department.id}>
          <DepartmentLogo
            department={item.department}
            size="sm"
            variant="code"
          />
          <div className="ud-rank__body">
            <span className="ud-rank__name" title={item.department.name}>
              {item.department.code}
            </span>
            <ProgressBar
              value={item.rate}
              size="sm"
              label={`${item.department.name} turnout`}
            />
          </div>
          <div className="ud-rank__figures">
            <span className="ud-rank__pct">{Math.round(item.rate)}%</span>
            <span className="ud-rank__count">
              {formatNumber(item.attended)} of {formatNumber(item.enrolled)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RankingBars;
