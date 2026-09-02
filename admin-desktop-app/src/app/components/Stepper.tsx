import { AnimatePresence, motion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { tokens } from "@/app/theme/tokens";
import { slidePanel } from "@/app/motion/transitions";

interface Props {
  steps: { key: string; label: string; content: ReactNode }[];
  step: number;
  onStepChange: (i: number) => void;
  title: ReactNode;
  subtitle?: ReactNode;
  canProceed: boolean[];
  submitLabel: string;
  submitting?: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export function Stepper({ steps, step, onStepChange, title, subtitle, canProceed, submitLabel, submitting = false, onSubmit, onCancel }: Props) {
  const last = steps.length - 1;
  const dir = useRef<1 | -1>(1);
  const go = (i: number) => { dir.current = i > step ? 1 : -1; onStepChange(Math.min(Math.max(i, 0), last)); };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: tokens.space.lg }}>
        <div>
          <div style={{ fontSize: tokens.font.size.subtitle, fontWeight: tokens.font.weight.bold, color: tokens.color.text.strong }}>{title}</div>
          {subtitle && <div style={{ fontSize: tokens.font.size.sm, color: tokens.color.text.muted }}>{subtitle}</div>}
        </div>
        <span style={{ fontSize: tokens.font.size.xs, fontWeight: tokens.font.weight.bold, color: tokens.color.text.muted, background: tokens.color.surface.sunken, borderRadius: tokens.radius.pill, padding: `${tokens.space["2xs"]}px ${tokens.space.sm}px` }}>{step + 1}/{steps.length}</span>
      </div>

      <div role="tablist" aria-label="Steps" style={{ display: "flex", alignItems: "center", marginBottom: tokens.space.xl }}>
        {steps.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={s.key} style={{ display: "flex", alignItems: "center", flex: i === last ? "0 0 auto" : 1 }}>
              <button
                role="tab"
                aria-selected={active}
                disabled={i > step}
                onClick={() => i <= step && go(i)}
                style={{ display: "inline-flex", alignItems: "center", gap: tokens.space.xs, border: "none", background: "transparent", cursor: i <= step ? "pointer" : "default" }}
              >
                <span style={{ width: 28, height: 28, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: tokens.font.size.sm, fontWeight: tokens.font.weight.bold,
                  background: done ? tokens.color.brand.primary : active ? tokens.color.surface.card : tokens.color.surface.sunken,
                  color: done ? tokens.color.text.onBrand : tokens.color.text.default,
                  border: active ? `2px solid ${tokens.color.brand.primary}` : `1px solid ${tokens.color.border.strong}`,
                  boxShadow: active ? tokens.elevation.e2 : "none" }}>
                  {done ? <Icon name="check" size={14} /> : i + 1}
                </span>
                <span style={{ fontSize: tokens.font.size.bodySm, fontWeight: active ? tokens.font.weight.bold : tokens.font.weight.medium, color: i <= step ? tokens.color.text.strong : tokens.color.text.muted }}>{s.label}</span>
              </button>
              {i < last && (
                <span style={{ flex: 1, height: 3, margin: `0 ${tokens.space.sm}px`, borderRadius: 2, background: i < step ? tokens.sidebarGradient : tokens.color.border.default }} />
              )}
            </div>
          );
        })}
      </div>

      <div style={{ position: "relative", minHeight: 120 }}>
        <AnimatePresence mode="wait" custom={dir.current}>
          <motion.div key={steps[step].key} variants={slidePanel(dir.current)} initial="initial" animate="animate" exit="exit">
            {steps[step].content}
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: tokens.space.xl }}>
        <Button variant="secondary" onClick={() => (step === 0 ? onCancel() : go(step - 1))} disabled={submitting}>
          {step === 0 ? "Cancel" : "Back"}
        </Button>
        {step === last ? (
          <Button variant="primary" onClick={onSubmit} loading={submitting} disabled={!canProceed[step]}>{submitLabel}</Button>
        ) : (
          <Button variant="primary" onClick={() => go(step + 1)} disabled={!canProceed[step]}>Next</Button>
        )}
      </div>
    </div>
  );
}
