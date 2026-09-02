import { Icon } from "./Icon";
import { tokens } from "@/app/theme/tokens";

interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  indeterminate?: boolean;
}

export function Checkbox({ checked, onChange, label, indeterminate = false }: Props) {
  const on = checked || indeterminate;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        display: "grid", placeItems: "center", minWidth: 44, minHeight: 44,
        border: "none", background: "transparent", cursor: "pointer",
      }}
    >
      <span
        style={{
          width: 20, height: 20, borderRadius: tokens.radius.sm,
          border: `1.5px solid ${on ? tokens.color.brand.primary : tokens.color.border.strong}`,
          background: on ? tokens.color.brand.primary : tokens.color.surface.card,
          color: tokens.color.text.onBrand, display: "grid", placeItems: "center",
        }}
      >
        {indeterminate ? <Icon name="minimize" size={14} /> : checked ? <Icon name="check" size={14} /> : null}
      </span>
    </button>
  );
}
