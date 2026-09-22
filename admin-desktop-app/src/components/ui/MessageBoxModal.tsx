import type { CSSProperties, ReactNode } from "react";
import { Modal } from "./Modal";
import { GeneralButton } from "./GeneralButton";
import { Icon, type IconName } from "./Icon";
import { registerStyle } from "../../lib/registerStyle";

registerStyle(
  "message-box",
  `
.ud-msgbox__body {
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
}

.ud-msgbox__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: none;
  border-radius: var(--r-pill);
  background: var(--tone-bg);
  color: var(--tone-fg);
}

.ud-msgbox__text {
  min-width: 0;
  font-size: var(--fs-13);
  line-height: var(--lh-normal);
  color: var(--text-secondary);
}

.ud-msgbox__text strong {
  color: var(--text);
  font-weight: var(--fw-semibold);
}
`,
);

export type MessageTone = "info" | "success" | "warning" | "danger";

const TONE: Record<
  MessageTone,
  { icon: IconName; fg: string; bg: string; confirmVariant: "primary" | "danger" }
> = {
  info: {
    icon: "info",
    fg: "var(--info)",
    bg: "var(--info-bg)",
    confirmVariant: "primary",
  },
  success: {
    icon: "circle-check",
    fg: "var(--success)",
    bg: "var(--success-bg)",
    confirmVariant: "primary",
  },
  warning: {
    icon: "alert",
    fg: "var(--warning)",
    bg: "var(--warning-bg)",
    confirmVariant: "primary",
  },
  danger: {
    icon: "alert",
    fg: "var(--danger)",
    bg: "var(--danger-bg)",
    confirmVariant: "danger",
  },
};

export interface MessageBoxModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: ReactNode;
  tone?: MessageTone;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
}

export function MessageBoxModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  tone = "info",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  busy = false,
}: MessageBoxModalProps) {
  const config = TONE[tone];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      plainHeader
      showClose={false}
      closeOnBackdrop={!busy}
      actions={
        <>
          <GeneralButton variant="neutral" onClick={onClose} disabled={busy}>
            {cancelLabel}
          </GeneralButton>
          {onConfirm ? (
            <GeneralButton
              variant={config.confirmVariant}
              onClick={onConfirm}
              loading={busy}
            >
              {confirmLabel}
            </GeneralButton>
          ) : null}
        </>
      }
    >
      <div
        className="ud-msgbox__body"
        style={
          { "--tone-fg": config.fg, "--tone-bg": config.bg } as CSSProperties
        }
      >
        <span className="ud-msgbox__icon">
          <Icon name={config.icon} size={22} />
        </span>
        <div className="ud-msgbox__text">{message}</div>
      </div>
    </Modal>
  );
}

export default MessageBoxModal;
