import { Icon, type IconName } from "./Icon";
import { registerStyle, cx } from "../../lib/registerStyle";

registerStyle(
  "stepper",
  `
.ud-stepper {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0;
  padding: var(--space-2) 0;
}

.ud-stepper__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  flex: none;
  width: 108px;
  text-align: center;
}

.ud-stepper__dot {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: var(--r-pill);
  background: var(--n-100);
  color: var(--text-faint);
  border: 1px solid var(--border);
  transition:
    background var(--dur-slow) var(--ease-out),
    color var(--dur-slow) var(--ease-standard),
    border-color var(--dur-slow) var(--ease-standard),
    box-shadow var(--dur-slow) var(--ease-out),
    transform var(--dur-slow) var(--ease-spring);
}

.ud-stepper__step[data-state="current"] .ud-stepper__dot {
  background: var(--grad-brand);
  border-color: transparent;
  color: #fff;
  box-shadow: var(--sh-brand);
  transform: scale(1.06);
}

.ud-stepper__step[data-state="done"] .ud-stepper__dot {
  background: var(--grad-brand);
  border-color: transparent;
  color: #fff;
}

.ud-stepper__label {
  font-size: var(--fs-12);
  font-weight: var(--fw-semibold);
  color: var(--text-faint);
  transition: color var(--dur-base) var(--ease-standard);
}

.ud-stepper__step[data-state="current"] .ud-stepper__label,
.ud-stepper__step[data-state="done"] .ud-stepper__label {
  color: var(--text);
}

.ud-stepper__line {
  flex: 1;
  height: 2px;
  min-width: 24px;
  margin-top: 18px;
  border-radius: var(--r-pill);
  background: var(--border);
  overflow: hidden;
}

.ud-stepper__line-fill {
  display: block;
  height: 100%;
  width: 0;
  border-radius: inherit;
  background: var(--grad-brand);
  transition: width var(--dur-slower) var(--ease-out);
}

.ud-stepper__line[data-done="true"] .ud-stepper__line-fill {
  width: 100%;
}
`,
);

export interface StepDefinition {
  key: string;
  label: string;
  icon: IconName;
}

export interface StepperProps {
  steps: ReadonlyArray<StepDefinition>;
  current: number;
  className?: string;
}

export function Stepper({ steps, current, className = "" }: StepperProps) {
  return (
    <ol className={cx("ud-stepper", className)} aria-label="Progress">
      {steps.map((step, index) => {
        const state =
          index < current ? "done" : index === current ? "current" : "todo";
        return (
          <li key={step.key} style={{ display: "contents" }}>
            <div
              className="ud-stepper__step"
              data-state={state}
              aria-current={state === "current" ? "step" : undefined}
            >
              <span className="ud-stepper__dot">
                <Icon name={state === "done" ? "check" : step.icon} size={17} />
              </span>
              <span className="ud-stepper__label">{step.label}</span>
            </div>
            {index < steps.length - 1 ? (
              <span
                className="ud-stepper__line"
                data-done={index < current}
                aria-hidden="true"
              >
                <span className="ud-stepper__line-fill" />
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export default Stepper;
