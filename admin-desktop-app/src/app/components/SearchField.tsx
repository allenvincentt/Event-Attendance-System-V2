import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { tokens } from "@/app/theme/tokens";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchField({ value, onChange, placeholder = "Search…", debounceMs = 200 }: Props) {
  const [local, setLocal] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => setLocal(value), [value]);
  const push = (v: string) => {
    setLocal(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(v), debounceMs);
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: tokens.space.xs, border: `1px solid ${tokens.color.border.strong}`, borderRadius: tokens.radius.md, padding: `${tokens.space.xs}px ${tokens.space.sm}px`, background: tokens.color.surface.card, minWidth: 220 }}>
      <span style={{ color: tokens.color.text.muted }}><Icon name="search" size={16} /></span>
      <input
        type="search"
        placeholder={placeholder}
        value={local}
        onChange={(e) => push(e.target.value)}
        style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: tokens.font.size.bodySm }}
      />
      {local && (
        <button type="button" aria-label="Clear search" onClick={() => push("")} style={{ border: "none", background: "transparent", cursor: "pointer", color: tokens.color.text.muted }}>
          <Icon name="close" size={14} />
        </button>
      )}
    </div>
  );
}
