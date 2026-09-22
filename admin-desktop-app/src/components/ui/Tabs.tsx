import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { registerStyle, cx } from "../../lib/registerStyle";

registerStyle(
  "tabs",
  `
.ud-tabs {
  display: flex;
  align-items: stretch;
  gap: var(--space-1);
  border-bottom: 1px solid var(--border);
}

.ud-tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  font-size: var(--fs-13);
  font-weight: var(--fw-semibold);
  color: var(--text-faint);
  border-radius: var(--r-sm) var(--r-sm) 0 0;
  transition:
    color var(--dur-base) var(--ease-standard),
    background-color var(--dur-base) var(--ease-standard);
}

.ud-tab::after {
  content: "";
  position: absolute;
  left: var(--space-3);
  right: var(--space-3);
  bottom: -1px;
  height: 2px;
  border-radius: var(--r-pill);
  background: var(--grad-brand);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform var(--dur-base) var(--ease-out);
}

.ud-tab:hover:not(:disabled) {
  color: var(--text-secondary);
  background: var(--n-25);
}

.ud-tab[aria-selected="true"] {
  color: var(--brand);
}

.ud-tab[aria-selected="true"]::after {
  transform: scaleX(1);
}

.ud-tab:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.ud-tab:focus-visible {
  box-shadow: var(--focus-ring);
}

.ud-tab__count {
  font-size: var(--fs-11);
  font-weight: var(--fw-bold);
  font-variant-numeric: tabular-nums;
  color: var(--text-faint);
}

.ud-tab[aria-selected="true"] .ud-tab__count {
  color: var(--red-400);
}
`,
);

export interface TabItem<T extends string = string> {
  value: T;
  label: string;
  icon?: IconName;
  count?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps<T extends string = string> {
  items: ReadonlyArray<TabItem<T>>;
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}

export function Tabs<T extends string = string>({
  items,
  value,
  onChange,
  label,
  className = "",
}: TabsProps<T>) {
  const enabled = items.filter((item) => !item.disabled);

  const move = (delta: number) => {
    const index = enabled.findIndex((item) => item.value === value);
    const next = enabled[(index + delta + enabled.length) % enabled.length];
    if (next) onChange(next.value);
  };

  return (
    <div className={cx("ud-tabs", className)} role="tablist" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          className="ud-tab"
          aria-selected={item.value === value}
          tabIndex={item.value === value ? 0 : -1}
          disabled={item.disabled}
          onClick={() => onChange(item.value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              move(1);
            } else if (event.key === "ArrowLeft") {
              event.preventDefault();
              move(-1);
            }
          }}
        >
          {item.icon ? <Icon name={item.icon} size={16} /> : null}
          {item.label}
          {item.count !== undefined ? (
            <span className="ud-tab__count">{item.count}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
