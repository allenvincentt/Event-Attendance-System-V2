import { motion } from "framer-motion";
import { useId } from "react";
import { tokens } from "@/app/theme/tokens";

interface Props<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}

export function FilterChips<T extends string>({ options, value, onChange, ariaLabel }: Props<T>) {
  const groupId = useId();
  const idx = options.findIndex((o) => o.value === value);
  const move = (next: number) => {
    const clamped = (next + options.length) % options.length;
    onChange(options[clamped].value);
  };
  return (
    <div role="tablist" aria-label={ariaLabel} style={{ display: "inline-flex", gap: tokens.space["2xs"], background: tokens.color.surface.sunken, padding: tokens.space["2xs"], borderRadius: tokens.radius.pill }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") { e.preventDefault(); move(idx + 1); }
              if (e.key === "ArrowLeft") { e.preventDefault(); move(idx - 1); }
              if (e.key === "Home") { e.preventDefault(); move(0); }
              if (e.key === "End") { e.preventDefault(); move(options.length - 1); }
            }}
            style={{
              position: "relative", border: "none", background: "transparent", cursor: "pointer",
              padding: `${tokens.space.xs}px ${tokens.space.md}px`, borderRadius: tokens.radius.pill,
              fontSize: tokens.font.size.bodySm, fontWeight: tokens.font.weight.semibold,
              color: active ? tokens.color.text.onBrand : tokens.color.text.muted,
            }}
          >
            {active && (
              <motion.span
                layoutId={`chip-${groupId}`}
                style={{ position: "absolute", inset: 0, background: tokens.color.brand.primary, borderRadius: tokens.radius.pill, zIndex: -1 }}
                transition={{ duration: tokens.motion.dur.base, ease: tokens.motion.ease.standard }}
              />
            )}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
