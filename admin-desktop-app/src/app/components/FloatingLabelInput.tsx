import { motion } from "framer-motion";
import { useId, useState, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { tokens } from "@/app/theme/tokens";

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
  icon?: IconName;
  trailing?: ReactNode;
  autoFocus?: boolean;
}

export function FloatingLabelInput({ label, value, onChange, type = "text", error, icon, trailing, autoFocus }: Props) {
  const id = useId();
  const errId = useId();
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.space["2xs"] }}>
      <div
        data-floated={floated}
        style={{
          position: "relative", display: "flex", alignItems: "center", gap: tokens.space.xs,
          border: `1px solid ${error ? tokens.color.status.danger.base : focused ? tokens.color.brand.primary : tokens.color.border.strong}`,
          borderRadius: tokens.radius.md, padding: `${tokens.space.md}px ${tokens.space.md}px`,
          background: tokens.color.surface.card,
        }}
      >
        {icon && <span style={{ color: tokens.color.text.muted }}><Icon name={icon} size={16} /></span>}
        <motion.label
          htmlFor={id}
          animate={floated ? { top: 4, right: 10, fontSize: tokens.font.size.xs, color: tokens.color.text.muted } : { top: "50%", right: "auto", fontSize: tokens.font.size.body, color: tokens.color.text.muted }}
          style={{ position: "absolute", left: icon ? 34 : 12, transform: floated ? "none" : "translateY(-50%)", pointerEvents: "none" }}
        >
          {label}
        </motion.label>
        <input
          id={id}
          type={type}
          autoFocus={autoFocus}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: tokens.font.size.body, color: tokens.color.text.strong }}
        />
        {trailing}
      </div>
      {error && <p id={errId} role="alert" style={{ margin: 0, fontSize: tokens.font.size.sm, color: tokens.color.status.danger.base }}>{error}</p>}
    </div>
  );
}
