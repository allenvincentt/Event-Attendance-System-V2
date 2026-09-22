import type { ReactNode } from "react";
import { Card, type CardTone } from "./Card";
import { Icon, type IconName } from "./Icon";
import { useCountUp } from "../common/motion/useCountUp";
import { formatNumber } from "../../lib/format";

export interface KpiCardProps {
  label: string;

  value: number;

  unit?: string;
  decimals?: number;
  meta?: ReactNode;
  icon: IconName;
  tone?: CardTone;

  delay?: number;
  animate?: boolean;
}

export function KpiCard({
  label,
  value,
  unit,
  decimals = 0,
  meta,
  icon,
  tone = "brand",
  delay = 0,
  animate = true,
}: KpiCardProps) {
  const shown = useCountUp(value, { delay, decimals, enabled: animate });
  const display =
    decimals > 0 ? shown.toFixed(decimals) : formatNumber(Math.round(shown));

  return (
    <Card tone={tone} interactive className="ud-kpi">
      <div className="ud-kpi__top">
        <span className="ud-kpi__label">{label}</span>
        <span className="ud-kpi__badge">
          <Icon name={icon} size={17} />
        </span>
      </div>

      <div className="ud-kpi__value">
        <span>{display}</span>
        {unit ? <span className="ud-kpi__unit">{unit}</span> : null}
      </div>

      {meta ? <div className="ud-kpi__meta">{meta}</div> : null}
    </Card>
  );
}

export default KpiCard;
