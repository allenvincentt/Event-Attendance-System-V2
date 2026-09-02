import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { GlobalStyle } from "@/app/theme/GlobalStyle";
import { tokens } from "@/app/theme/tokens";
import { startWindowResize, type ResizeDir } from "@/app/lib/window";
import { useWindowChoreography } from "@/app/motion/windowAnimations";
import { TitleBar } from "./TitleBar";

const DIRS: { dir: ResizeDir; style: React.CSSProperties }[] = [
  { dir: "North", style: { top: 0, left: 6, right: 6, height: 6, cursor: "ns-resize" } },
  { dir: "South", style: { bottom: 0, left: 6, right: 6, height: 6, cursor: "ns-resize" } },
  { dir: "West", style: { left: 0, top: 6, bottom: 6, width: 6, cursor: "ew-resize" } },
  { dir: "East", style: { right: 0, top: 6, bottom: 6, width: 6, cursor: "ew-resize" } },
  { dir: "NorthWest", style: { top: 0, left: 0, width: 10, height: 10, cursor: "nwse-resize" } },
  { dir: "NorthEast", style: { top: 0, right: 0, width: 10, height: 10, cursor: "nesw-resize" } },
  { dir: "SouthWest", style: { bottom: 0, left: 0, width: 10, height: 10, cursor: "nesw-resize" } },
  { dir: "SouthEast", style: { bottom: 0, right: 0, width: 10, height: 10, cursor: "nwse-resize" } },
];

interface Props {
  title: ReactNode;
  titleBarRight?: ReactNode;
  resizable?: boolean;
  showMaximize?: boolean;
  onMinimize?: () => void;
  onClose?: () => void;
  children: ReactNode;
}

export function WindowFrame({
  title, titleBarRight, resizable = true, showMaximize = true, onMinimize, onClose, children,
}: Props) {
  const { contentProps, isMaximized, beginMinimize, toggleMaximize } = useWindowChoreography();
  const radius = isMaximized ? 0 : tokens.radius.lg;

  return (
    <div
      style={{
        position: "fixed", inset: 0, display: "flex", flexDirection: "column",
        background: tokens.color.surface.card, borderRadius: radius, overflow: "hidden",
        border: `1px solid ${tokens.color.border.default}`,
      }}
    >
      <GlobalStyle />
      <TitleBar
        title={title}
        right={titleBarRight}
        showMaximize={showMaximize}
        isMaximized={isMaximized}
        onToggleMaximize={toggleMaximize}
        onMinimize={onMinimize ?? beginMinimize}
        onClose={onClose}
      />
      <motion.div {...contentProps} style={{ ...(contentProps.style ?? {}), flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        {children}
      </motion.div>
      {resizable && !isMaximized &&
        DIRS.map(({ dir, style }) => (
          <div
            key={dir}
            data-resize-dir={dir}
            onMouseDown={(e) => { e.preventDefault(); void startWindowResize(dir); }}
            style={{ position: "absolute", zIndex: 20, ...style }}
          />
        ))}
    </div>
  );
}
