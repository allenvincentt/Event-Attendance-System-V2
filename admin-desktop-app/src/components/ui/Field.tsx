import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { Icon, type IconName } from "./Icon";
import { IconButton } from "./IconButton";
import { registerStyle, cx } from "../../lib/registerStyle";
import { useDismiss } from "../../lib/useDismiss";
import {
  formatDateField,
  formatTime,
  parseISODate,
  toISODate,
} from "../../lib/format";

registerStyle(
  "field",
  `


.ud-field {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.ud-field__shell {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  height: 48px;
  padding: 0 var(--space-4);
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  transition:
    border-color var(--dur-base) var(--ease-standard),
    box-shadow var(--dur-base) var(--ease-standard),
    background-color var(--dur-base) var(--ease-standard);
}

.ud-field__shell:hover:not([data-disabled="true"]) {
  border-color: var(--border-strong);
}

.ud-field__shell[data-focused="true"] {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(178, 10, 7, 0.12);
}

.ud-field__shell[data-invalid="true"] {
  border-color: var(--danger);
}

.ud-field__shell[data-invalid="true"][data-focused="true"] {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.14);
}

.ud-field__shell[data-disabled="true"] {
  background: var(--n-50);
  opacity: 0.7;
}

.ud-field--sm .ud-field__shell {
  height: 40px;
  padding: 0 var(--space-3);
  border-radius: var(--r-md);
}

.ud-field__icon {
  flex: none;
  display: grid;
  place-items: center;
  color: var(--text-faint);
  transition: color var(--dur-base) var(--ease-standard);
}

.ud-field__shell[data-focused="true"] .ud-field__icon {
  color: var(--brand);
}

.ud-field__input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--fs-14);
  color: var(--text);
}

.ud-field__input::placeholder {
  color: var(--text-faint);
  opacity: 1;
}

.ud-field__input:disabled {
  cursor: not-allowed;
}


.ud-field__label {
  position: absolute;
  left: var(--label-left, var(--space-4));
  top: 50%;
  transform: translateY(-50%);
  padding: 0 var(--space-1);
  font-size: var(--fs-14);
  color: var(--text-faint);
  pointer-events: none;
  background: transparent;
  transition:
    top var(--dur-base) var(--ease-out),
    left var(--dur-base) var(--ease-out),
    font-size var(--dur-base) var(--ease-out),
    font-weight var(--dur-base) var(--ease-out),
    color var(--dur-base) var(--ease-standard),
    background-color var(--dur-fast) var(--ease-standard);
  white-space: nowrap;
  max-width: calc(100% - var(--space-6));
  overflow: hidden;
  text-overflow: ellipsis;
}

.ud-field[data-floating="true"] .ud-field__label {
  top: 0;
  left: var(--space-3);
  font-size: var(--fs-11);
  font-weight: var(--fw-semibold);
  letter-spacing: 0.02em;
  color: var(--text-muted);
  background: var(--surface);
}

.ud-field[data-floating="true"][data-focused="true"] .ud-field__label {
  color: var(--brand);
}

.ud-field__trailing {
  flex: none;
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.ud-field__help {
  margin-top: var(--space-2);
  padding-left: var(--space-1);
  font-size: var(--fs-12);
  color: var(--text-muted);
  line-height: var(--lh-snug);
}

.ud-field__help--error {
  color: var(--danger);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.ud-field__caption {
  margin-bottom: var(--space-2);
  font-size: var(--fs-12);
  font-weight: var(--fw-semibold);
  color: var(--text-secondary);
}


.ud-search {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  height: 42px;
  padding: 0 var(--space-3) 0 var(--space-4);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  box-shadow: var(--sh-xs);
  transition:
    border-color var(--dur-base) var(--ease-standard),
    box-shadow var(--dur-base) var(--ease-standard);
}

.ud-search:focus-within {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(178, 10, 7, 0.1);
}

.ud-search__icon {
  flex: none;
  color: var(--text-faint);
  transition: color var(--dur-base) var(--ease-standard);
}

.ud-search:focus-within .ud-search__icon {
  color: var(--brand);
}

.ud-search__input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--fs-13);
  color: var(--text);
}

.ud-search__input::placeholder {
  color: var(--text-faint);
  opacity: 1;
}

.ud-search__clear {
  flex: none;
  opacity: 0;
  transform: scale(0.7);
  pointer-events: none;
  transition:
    opacity var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-spring);
}

.ud-search[data-filled="true"] .ud-search__clear {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}


.ud-select {
  position: relative;
  min-width: 0;
}

.ud-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  width: 100%;
  height: 42px;
  padding: 0 var(--space-3) 0 var(--space-4);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  font-size: var(--fs-13);
  color: var(--text);
  text-align: left;
  box-shadow: var(--sh-xs);
  transition:
    border-color var(--dur-base) var(--ease-standard),
    box-shadow var(--dur-base) var(--ease-standard),
    background-color var(--dur-base) var(--ease-standard);
}

.ud-select__trigger:hover:not(:disabled) {
  border-color: var(--border-strong);
  background: var(--n-25);
}

.ud-select__trigger[aria-expanded="true"] {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(178, 10, 7, 0.1);
}

.ud-select__trigger:focus-visible {
  box-shadow: var(--focus-ring);
}

.ud-select--sm .ud-select__trigger {
  height: 36px;
  padding: 0 var(--space-2) 0 var(--space-3);
  font-size: var(--fs-12);
  border-radius: var(--r-sm);
}

.ud-select--lg .ud-select__trigger {
  height: 48px;
  border-radius: var(--r-lg);
  font-size: var(--fs-14);
}

.ud-select__value {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  min-width: 0;
  overflow: hidden;
}

.ud-select__value-main {
  font-weight: var(--fw-semibold);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ud-select__value-meta {
  font-size: var(--fs-12);
  color: var(--text-muted);
  white-space: nowrap;
}

.ud-select__placeholder {
  color: var(--text-faint);
  font-weight: var(--fw-regular);
}

.ud-select__chevron {
  flex: none;
  color: var(--text-faint);
  transition:
    transform var(--dur-base) var(--ease-out),
    color var(--dur-base) var(--ease-standard);
}

.ud-select__trigger[aria-expanded="true"] .ud-select__chevron {
  transform: rotate(180deg);
  color: var(--brand);
}

.ud-select__menu {
  position: absolute;
  z-index: 60;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  max-height: 288px;
  overflow-y: auto;
  padding: var(--space-2);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--sh-xl);
  animation: ud-pop-in var(--dur-base) var(--ease-out);
  transform-origin: top center;
}

.ud-select__menu--up {
  top: auto;
  bottom: calc(100% + 6px);
  transform-origin: bottom center;
}

.ud-select__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--r-sm);
  font-size: var(--fs-13);
  color: var(--text-secondary);
  text-align: left;
  transition:
    background-color var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard);
}

.ud-select__option:hover,
.ud-select__option[data-active="true"] {
  background: var(--n-100);
  color: var(--text);
}

.ud-select__option[aria-selected="true"] {
  background: var(--brand-soft);
  color: var(--brand);
  font-weight: var(--fw-semibold);
}

.ud-select__option-meta {
  flex: none;
  font-size: var(--fs-11);
  color: var(--text-faint);
}

.ud-select__option[aria-selected="true"] .ud-select__option-meta {
  color: var(--red-400);
}


.ud-check {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
  font-size: var(--fs-13);
  color: var(--text-secondary);
  user-select: none;
}

.ud-check__box {
  position: relative;
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  flex: none;
  border: 1.5px solid var(--border-strong);
  border-radius: var(--r-xs);
  background: var(--surface);
  color: transparent;
  transition:
    background var(--dur-fast) var(--ease-standard),
    border-color var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard),
    transform var(--dur-fast) var(--ease-spring);
}

.ud-check__native {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.ud-check__native:checked + .ud-check__box {
  background: var(--grad-brand);
  border-color: var(--brand);
  color: #fff;
}

.ud-check__native:focus-visible + .ud-check__box {
  box-shadow: var(--focus-ring);
}

.ud-check:hover .ud-check__box {
  border-color: var(--brand);
}

.ud-check__native:active + .ud-check__box {
  transform: scale(0.9);
}

.ud-check__native:disabled + .ud-check__box {
  opacity: 0.5;
}

.ud-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  flex: none;
  width: 44px;
  height: 24px;
  padding: 3px;
  border-radius: var(--r-pill);
  background: var(--n-300);
  cursor: pointer;
  transition:
    background var(--dur-base) var(--ease-standard),
    box-shadow var(--dur-base) var(--ease-standard);
}

.ud-toggle[data-on="true"] {
  background: var(--grad-brand);
  box-shadow: var(--sh-brand);
}

.ud-toggle__knob {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: var(--sh-sm);
  transform: translateX(0);
  transition:
    transform var(--dur-base) var(--ease-spring),
    width var(--dur-fast) var(--ease-out);
}

.ud-toggle[data-on="true"] .ud-toggle__knob {
  transform: translateX(20px);
}

.ud-toggle:focus-visible {
  box-shadow: var(--focus-ring);
}

.ud-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}


.ud-datefield__value {
  flex: 1;
  min-width: 0;
  font-size: var(--fs-14);
  color: var(--text);
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: transparent;
  border: none;
}

.ud-cal {
  position: absolute;
  z-index: 70;
  top: calc(100% + 8px);
  left: 0;
  width: 280px;
  padding: var(--space-4);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--sh-xl);
  animation: ud-pop-in var(--dur-base) var(--ease-out);
  transform-origin: top left;
}

.ud-cal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.ud-cal__month {
  font-size: var(--fs-13);
  font-weight: var(--fw-bold);
  color: var(--text);
}

.ud-cal__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.ud-cal__dow {
  display: grid;
  place-items: center;
  height: 26px;
  font-size: var(--fs-11);
  font-weight: var(--fw-semibold);
  color: var(--text-faint);
}

.ud-cal__day {
  display: grid;
  place-items: center;
  height: 32px;
  border-radius: var(--r-sm);
  font-size: var(--fs-12);
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
  transition:
    background var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard),
    transform var(--dur-fast) var(--ease-spring);
}

.ud-cal__day:hover:not(:disabled) {
  background: var(--n-100);
  color: var(--text);
}

.ud-cal__day[data-outside="true"] {
  color: var(--n-300);
}

.ud-cal__day[data-today="true"] {
  font-weight: var(--fw-bold);
  color: var(--brand);
  box-shadow: inset 0 0 0 1px var(--red-200);
}

.ud-cal__day[data-selected="true"] {
  background: var(--grad-brand);
  color: #fff;
  font-weight: var(--fw-bold);
  box-shadow: var(--sh-brand);
}

.ud-cal__day:active:not(:disabled) {
  transform: scale(0.92);
}

.ud-timeparts {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.ud-timeparts__sep {
  color: var(--text-faint);
  font-weight: var(--fw-bold);
}

.ud-timeparts .ud-select__trigger {
  min-width: 66px;
  padding-right: var(--space-1);
}
`,
);



export interface FloatingLabelInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  icon?: IconName;
  trailing?: ReactNode;
  error?: string;
  help?: string;
  size?: "sm" | "md";
  containerClassName?: string;
}


export function FloatingLabelInput({
  label,
  icon,
  trailing,
  error,
  help,
  size = "md",
  containerClassName = "",
  className = "",
  id,
  value,
  defaultValue,
  onFocus,
  onBlur,
  disabled,
  ...rest
}: FloatingLabelInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(
    () => Boolean(value ?? defaultValue ?? ""),
  );

  const filled = value !== undefined ? Boolean(value) : hasValue;
  const floating = focused || filled;
  const describedBy = error || help ? `${inputId}-help` : undefined;

  return (
    <div
      className={cx("ud-field", size === "sm" && "ud-field--sm", containerClassName)}
      data-floating={floating}
      data-focused={focused}
      style={{ "--label-left": icon ? "42px" : undefined } as CSSProperties}
    >
      <div
        className="ud-field__shell"
        data-focused={focused}
        data-invalid={Boolean(error)}
        data-disabled={Boolean(disabled)}
      >
        {icon ? (
          <span className="ud-field__icon">
            <Icon name={icon} size={18} />
          </span>
        ) : null}

        <input
          id={inputId}
          className={cx("ud-field__input", className)}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            setHasValue(Boolean(event.currentTarget.value));
            onBlur?.(event);
          }}
          onInput={(event) => setHasValue(Boolean(event.currentTarget.value))}
          {...rest}
        />

        {trailing ? <span className="ud-field__trailing">{trailing}</span> : null}
      </div>

      <label className="ud-field__label" htmlFor={inputId}>
        {label}
      </label>

      {error ? (
        <p className="ud-field__help ud-field__help--error" id={describedBy}>
          <Icon name="alert" size={13} />
          {error}
        </p>
      ) : help ? (
        <p className="ud-field__help" id={describedBy}>
          {help}
        </p>
      ) : null}
    </div>
  );
}



export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchField({
  value,
  onChange,
  placeholder = "Search...",
  label,
  className = "",
  autoFocus,
}: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cx("ud-search", className)} data-filled={value.length > 0}>
      <span className="ud-search__icon">
        <Icon name="search" size={17} />
      </span>
      <input
        ref={inputRef}
        className="ud-search__input"
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        autoFocus={autoFocus}
        onChange={(event) => onChange(event.target.value)}
      />
      <span className="ud-search__clear">
        <IconButton
          icon="x"
          label="Clear search"
          size="xs"
          round
          tabIndex={value ? 0 : -1}
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
        />
      </span>
    </div>
  );
}



export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  
  meta?: string;
}

export interface SelectProps<T extends string = string> {
  value: T | null;
  options: ReadonlyArray<SelectOption<T>>;
  onChange: (value: T) => void;
  placeholder?: string;
  label: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  
  dropUp?: boolean;
  triggerClassName?: string;
}


export function Select<T extends string = string>({
  value,
  options,
  onChange,
  placeholder = "Select...",
  label,
  size = "md",
  disabled = false,
  className = "",
  dropUp = false,
  triggerClassName = "",
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedIndex = useMemo(
    () => options.findIndex((option) => option.value === value),
    [options, value],
  );
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  const close = useCallback(() => setOpen(false), []);
  useDismiss(rootRef, open, close);

  useEffect(() => {
    if (open) setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`,
    );
    node?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const commit = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
  };

  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (!open) {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(options.length - 1, i + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      commit(activeIndex);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div
      className={cx("ud-select", size !== "md" && `ud-select--${size}`, className)}
      ref={rootRef}
    >
      <button
        type="button"
        className={cx("ud-select__trigger", triggerClassName)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
      >
        <span className="ud-select__value">
          {selected ? (
            <>
              <span className="ud-select__value-main">{selected.label}</span>
              {selected.meta ? (
                <span className="ud-select__value-meta">{selected.meta}</span>
              ) : null}
            </>
          ) : (
            <span className="ud-select__value-main ud-select__placeholder">
              {placeholder}
            </span>
          )}
        </span>
        <span className="ud-select__chevron">
          <Icon name="chevron-down" size={16} />
        </span>
      </button>

      {open ? (
        <div
          className={cx("ud-select__menu", dropUp && "ud-select__menu--up")}
          role="listbox"
          aria-label={label}
          ref={listRef}
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              className="ud-select__option"
              role="option"
              data-index={index}
              data-active={index === activeIndex}
              aria-selected={option.value === value}
              onClick={() => commit(index)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span>{option.label}</span>
              {option.meta ? (
                <span className="ud-select__option-meta">{option.meta}</span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}



export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
  className?: string;
  
  indeterminate?: boolean;
  ariaLabel?: string;
}

export function Checkbox({
  checked,
  onChange,
  label,
  disabled,
  className = "",
  indeterminate = false,
  ariaLabel,
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate && !checked;
  }, [indeterminate, checked]);

  return (
    <label className={cx("ud-check", className)}>
      <input
        ref={ref}
        type="checkbox"
        className="ud-check__native"
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="ud-check__box" aria-hidden="true">
        <Icon name={indeterminate && !checked ? "minus" : "check"} size={12} strokeWidth={3} />
      </span>
      {label ? <span>{label}</span> : null}
    </label>
  );
}

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
  className = "",
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      data-on={checked}
      className={cx("ud-toggle", className)}
      onClick={() => onChange(!checked)}
    >
      <span className="ud-toggle__knob" />
    </button>
  );
}



const DOW = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export interface DateFieldProps {
  
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}


export function DateField({
  value,
  onChange,
  label,
  disabled,
  className = "",
}: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = useMemo(() => parseISODate(value), [value]);
  const [cursor, setCursor] = useState(
    () => new Date(selected.getFullYear(), selected.getMonth(), 1),
  );

  const close = useCallback(() => setOpen(false), []);
  useDismiss(rootRef, open, close);

  useEffect(() => {
    if (open) setCursor(new Date(selected.getFullYear(), selected.getMonth(), 1));
  }, [open, selected]);

  const todayISO = toISODate(new Date());


  const days = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    return Array.from({ length: 42 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  }, [cursor]);

  const shift = (months: number) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + months, 1));

  return (
    <div className={cx("ud-field", className)} ref={rootRef}>
      <div
        className="ud-field__shell"
        data-focused={open}
        data-disabled={Boolean(disabled)}
      >
        <button
          type="button"
          className="ud-datefield__value"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={`${label}. Selected ${formatDateField(value)}`}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
        >
          {formatDateField(value)}
        </button>
        <span className="ud-field__trailing">
          <IconButton
            icon="calendar"
            label={open ? "Close date picker" : "Open date picker"}
            size="sm"
            disabled={disabled}
            onClick={() => setOpen((o) => !o)}
          />
        </span>
      </div>

      {open ? (
        <div className="ud-cal" role="dialog" aria-label={label}>
          <div className="ud-cal__head">
            <IconButton
              icon="chevron-left"
              label="Previous month"
              size="sm"
              onClick={() => shift(-1)}
            />
            <span className="ud-cal__month">
              {MONTH_NAMES[cursor.getMonth()]} {cursor.getFullYear()}
            </span>
            <IconButton
              icon="chevron-right"
              label="Next month"
              size="sm"
              onClick={() => shift(1)}
            />
          </div>

          <div className="ud-cal__grid">
            {DOW.map((d, i) => (
              <span className="ud-cal__dow" key={`${d}-${i}`} aria-hidden="true">
                {d}
              </span>
            ))}
            {days.map((day) => {
              const iso = toISODate(day);
              return (
                <button
                  key={iso}
                  type="button"
                  className="ud-cal__day"
                  data-outside={day.getMonth() !== cursor.getMonth()}
                  data-today={iso === todayISO}
                  data-selected={iso === value}
                  aria-label={formatDateField(iso)}
                  aria-current={iso === todayISO ? "date" : undefined}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}



const HOUR_OPTIONS: SelectOption[] = Array.from({ length: 12 }, (_, i) => {
  const hour = String(i + 1).padStart(2, "0");
  return { value: hour, label: hour };
});

const MINUTE_OPTIONS: SelectOption[] = Array.from({ length: 12 }, (_, i) => {
  const minute = String(i * 5).padStart(2, "0");
  return { value: minute, label: minute };
});

const MERIDIEM_OPTIONS: SelectOption[] = [
  { value: "AM", label: "AM" },
  { value: "PM", label: "PM" },
];


function splitMinutes(minutes: number) {
  const total = ((minutes % 1440) + 1440) % 1440;
  const h24 = Math.floor(total / 60);
  const meridiem = h24 < 12 ? "AM" : "PM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return {
    hour: String(h12).padStart(2, "0"),
    minute: String(total % 60).padStart(2, "0"),
    meridiem,
  };
}

function joinMinutes(hour: string, minute: string, meridiem: string): number {
  let h = Number(hour) % 12;
  if (meridiem === "PM") h += 12;
  return h * 60 + Number(minute);
}

export interface TimeFieldProps {
  
  value: number;
  onChange: (minutes: number) => void;
  label: string;
  disabled?: boolean;
}


export function TimeField({ value, onChange, label, disabled }: TimeFieldProps) {
  const { hour, minute, meridiem } = splitMinutes(value);


  const minuteValue = MINUTE_OPTIONS.some((o) => o.value === minute)
    ? minute
    : String(Math.round(Number(minute) / 5) * 5 % 60).padStart(2, "0");

  return (
    <span className="ud-timeparts" role="group" aria-label={label}>
      <Select
        size="sm"
        label={`${label} hour`}
        value={hour}
        options={HOUR_OPTIONS}
        disabled={disabled}
        onChange={(next) => onChange(joinMinutes(next, minuteValue, meridiem))}
      />
      <span className="ud-timeparts__sep" aria-hidden="true">
        :
      </span>
      <Select
        size="sm"
        label={`${label} minutes`}
        value={minuteValue}
        options={MINUTE_OPTIONS}
        disabled={disabled}
        onChange={(next) => onChange(joinMinutes(hour, next, meridiem))}
      />
      <Select
        size="sm"
        label={`${label} AM or PM`}
        value={meridiem}
        options={MERIDIEM_OPTIONS}
        disabled={disabled}
        onChange={(next) => onChange(joinMinutes(hour, minuteValue, next))}
      />
    </span>
  );
}


export function TimeRangeLabel({ start, end }: { start: number; end: number }) {
  return (
    <span className="tnum">
      {formatTime(start)} {"\u2013"} {formatTime(end)}
    </span>
  );
}
