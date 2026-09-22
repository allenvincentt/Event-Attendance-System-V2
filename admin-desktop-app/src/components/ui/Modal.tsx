import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { Icon, type IconName } from "./Icon";
import { IconButton } from "./IconButton";
import { registerStyle, cx } from "../../lib/registerStyle";

registerStyle(
  "modal",
  `
.ud-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: var(--space-7);
  background: rgba(22, 26, 34, 0.42);
  backdrop-filter: blur(3px);
  animation: ud-fade-in var(--dur-base) var(--ease-standard);
}

.ud-overlay[data-closing="true"] {
  animation: ud-fade-out var(--dur-fast) var(--ease-in) forwards;
}

.ud-modal {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 100%;
  min-height: 0;
  background: var(--surface);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-xl);
  overflow: hidden;
  animation: ud-pop-in var(--dur-slow) var(--ease-back);
}

.ud-overlay[data-closing="true"] .ud-modal {
  animation: ud-pop-out var(--dur-fast) var(--ease-in) forwards;
}

.ud-modal--sm { max-width: 420px; }
.ud-modal--md { max-width: 620px; }
.ud-modal--lg { max-width: 880px; }
.ud-modal--xl { max-width: 1040px; }

.ud-modal__header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-5) var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
}

.ud-modal__header--plain {
  border-bottom: none;
  padding-bottom: var(--space-2);
}

.ud-modal__badge {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex: none;
  border-radius: var(--r-md);
  background: var(--brand-soft);
  color: var(--brand);
}

.ud-modal__titles {
  flex: 1;
  min-width: 0;
}

.ud-modal__title {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--fs-18);
  font-weight: var(--fw-bold);
  color: var(--text);
  letter-spacing: -0.015em;
}

.ud-modal__subtitle {
  margin-top: 2px;
  font-size: var(--fs-12);
  color: var(--text-muted);
}

.ud-modal__header-right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: none;
}

.ud-modal__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.ud-modal__body--padded {
  padding: var(--space-5);
}

.ud-modal__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--border-subtle);
  background: var(--surface-alt);
}

.ud-modal__footer-note {
  font-size: var(--fs-12);
  color: var(--text-muted);
  min-width: 0;
}

.ud-modal__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: none;
}
`,
);

export type ModalSize = "sm" | "md" | "lg" | "xl";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: IconName;
  size?: ModalSize;
  headerRight?: ReactNode;
  footerNote?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  padded?: boolean;
  plainHeader?: boolean;
  closeOnBackdrop?: boolean;
  showClose?: boolean;
  className?: string;
  height?: string;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  icon,
  size = "md",
  headerRight,
  footerNote,
  actions,
  children,
  padded = true,
  plainHeader = false,
  closeOnBackdrop = true,
  showClose = true,
  className = "",
  height,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const handleClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const nodes = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((node) => node.offsetParent !== null);
      if (nodes.length === 0) return;

      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === firstNode) {
        event.preventDefault();
        lastNode.focus();
      } else if (!event.shiftKey && active === lastNode) {
        event.preventDefault();
        firstNode.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      restoreRef.current?.focus?.();
    };
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <div
      className="ud-overlay"
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) handleClose();
      }}
    >
      <div
        ref={panelRef}
        className={cx("ud-modal", `ud-modal--${size}`, className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{ height }}
      >
        <header
          className={cx("ud-modal__header", plainHeader && "ud-modal__header--plain")}
        >
          {icon ? (
            <span className="ud-modal__badge">
              <Icon name={icon} size={20} />
            </span>
          ) : null}

          <div className="ud-modal__titles">
            <h2 className="ud-modal__title" id={titleId}>
              {title}
            </h2>
            {subtitle ? <p className="ud-modal__subtitle">{subtitle}</p> : null}
          </div>

          <div className="ud-modal__header-right">
            {headerRight}
            {showClose ? (
              <IconButton icon="x" label="Close dialog" onClick={handleClose} />
            ) : null}
          </div>
        </header>

        <div className={cx("ud-modal__body", padded && "ud-modal__body--padded")}>
          {children}
        </div>

        {actions || footerNote ? (
          <footer className="ud-modal__footer">
            <span className="ud-modal__footer-note">{footerNote}</span>
            <div className="ud-modal__actions">{actions}</div>
          </footer>
        ) : null}
      </div>
    </div>
  );
}

export default Modal;
