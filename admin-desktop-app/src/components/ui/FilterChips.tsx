import { registerStyle, cx } from "../../lib/registerStyle";

registerStyle(
  "filter-chips",
  `
.ud-filters {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.ud-filters__label {
  margin-right: var(--space-1);
  font-size: var(--fs-12);
  color: var(--text-muted);
}

.ud-filter {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  height: 32px;
  padding: 0 var(--space-4);
  border-radius: var(--r-pill);
  border: 1px solid var(--border);
  background: var(--surface);
  font-size: var(--fs-12);
  font-weight: var(--fw-semibold);
  color: var(--text-secondary);
  transition:
    background var(--dur-base) var(--ease-standard),
    border-color var(--dur-base) var(--ease-standard),
    color var(--dur-base) var(--ease-standard),
    box-shadow var(--dur-base) var(--ease-out),
    transform var(--dur-fast) var(--ease-out);
}

.ud-filter:hover:not([aria-pressed="true"]) {
  border-color: var(--red-200);
  color: var(--brand);
  transform: translateY(-1px);
}

.ud-filter[aria-pressed="true"] {
  background: var(--grad-brand);
  border-color: transparent;
  color: #fff;
  box-shadow: var(--sh-brand);
}

.ud-filter:active {
  transform: scale(0.96);
}

.ud-filter:focus-visible {
  box-shadow: var(--focus-ring);
}

.ud-filter__count {
  font-variant-numeric: tabular-nums;
  opacity: 0.7;
}
`,
);

export interface FilterOption<T extends string = string> {
  value: T;
  label: string;
  count?: number;
}

export interface FilterChipsProps<T extends string = string> {
  options: ReadonlyArray<FilterOption<T>>;
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}

export function FilterChips<T extends string = string>({
  options,
  value,
  onChange,
  label,
  className = "",
}: FilterChipsProps<T>) {
  return (
    <div className={cx("ud-filters", className)} role="group" aria-label={label}>
      <span className="ud-filters__label">{label}</span>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className="ud-filter"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
          {option.count !== undefined ? (
            <span className="ud-filter__count">{option.count}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

export default FilterChips;
