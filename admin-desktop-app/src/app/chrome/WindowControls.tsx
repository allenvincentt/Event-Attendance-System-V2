import { motion } from "framer-motion";
import { Icon, type IconName } from "@/app/components/Icon";
import { tokens } from "@/app/theme/tokens";
import { closeWindow, minimizeWindow, toggleMaximizeWindow } from "@/app/lib/window";

interface Props {
  showMaximize?: boolean;
  isMaximized?: boolean;
  onMinimize?: () => void;
  onToggleMaximize?: () => void;
  onClose?: () => void;
}

function Ctrl({ label, name, danger, onClick }: { label: string; name: IconName; danger?: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      style={{
        width: 46, height: 32, display: "grid", placeItems: "center",
        background: "transparent", border: "none", cursor: "pointer",
        color: tokens.color.text.muted, borderRadius: tokens.radius.sm,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger ? tokens.color.brand.primary : tokens.color.surface.sunken;
        e.currentTarget.style.color = danger ? tokens.color.text.onBrand : tokens.color.text.strong;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = tokens.color.text.muted;
      }}
    >
      <Icon name={name} size={16} />
    </motion.button>
  );
}

export function WindowControls({
  showMaximize = true, isMaximized = false, onMinimize, onToggleMaximize, onClose,
}: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Ctrl label="Minimize" name="minimize" onClick={onMinimize ?? (() => void minimizeWindow())} />
      {showMaximize && (
        <Ctrl
          label={isMaximized ? "Restore" : "Maximize"}
          name={isMaximized ? "restore" : "maximize"}
          onClick={onToggleMaximize ?? (() => void toggleMaximizeWindow())}
        />
      )}
      <Ctrl label="Close" name="close" danger onClick={onClose ?? (() => void closeWindow())} />
    </div>
  );
}
