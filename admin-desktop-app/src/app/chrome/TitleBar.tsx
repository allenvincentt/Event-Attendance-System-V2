import type { ReactNode } from "react";
import mark from "@/assets/brand/UDLogo.png";
import { tokens } from "@/app/theme/tokens";
import { WindowControls } from "./WindowControls";

interface Props {
  title: ReactNode;
  right?: ReactNode;
  showMaximize?: boolean;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  height?: number;
}

export function TitleBar({ title, right, showMaximize = true, isMaximized, onToggleMaximize, height = 40 }: Props) {
  return (
    <div
      data-tauri-drag-region
      onDoubleClick={(e) => {
        if (e.target === e.currentTarget && showMaximize) onToggleMaximize?.();
      }}
      style={{
        height, minHeight: height, display: "flex", alignItems: "center", gap: tokens.space.sm,
        padding: `0 ${tokens.space.xs}px 0 ${tokens.space.md}px`,
        background: tokens.color.surface.card, borderBottom: `1px solid ${tokens.color.border.default}`,
        userSelect: "none",
      }}
    >
      <img src={mark} alt="" aria-hidden width={18} height={18} style={{ pointerEvents: "none" }} />
      <div style={{ fontSize: tokens.font.size.bodySm, fontWeight: tokens.font.weight.semibold, color: tokens.color.text.strong }}>
        {title}
      </div>
      <div style={{ flex: 1 }} />
      {right}
      <WindowControls showMaximize={showMaximize} isMaximized={isMaximized} onToggleMaximize={onToggleMaximize} />
    </div>
  );
}
