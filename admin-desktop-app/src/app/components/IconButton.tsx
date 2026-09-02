import { motion } from "framer-motion";
import { Icon, type IconName } from "./Icon";
import { tokens } from "@/app/theme/tokens";

interface Props {
  label: string;
  icon: IconName;
  size?: number;
  variant?: "ghost" | "solid";
  disabled?: boolean;
  onClick?: () => void;
}

export function IconButton({ label, icon, size = 36, variant = "ghost", disabled = false, onClick }: Props) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? undefined : { backgroundColor: tokens.color.surface.sunken }}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      style={{
        width: size, height: size, minWidth: 44, minHeight: 44,
        display: "grid", placeItems: "center",
        border: variant === "solid" ? `1px solid ${tokens.color.border.strong}` : "none",
        background: variant === "solid" ? tokens.color.surface.card : "transparent",
        borderRadius: tokens.radius.md, cursor: disabled ? "default" : "pointer",
        color: tokens.color.text.default, opacity: disabled ? 0.5 : 1,
      }}
    >
      <Icon name={icon} size={18} />
    </motion.button>
  );
}
