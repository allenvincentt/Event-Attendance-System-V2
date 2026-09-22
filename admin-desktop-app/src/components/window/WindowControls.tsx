import { Icon } from "../ui/Icon";
import { registerStyle, cx } from "../../lib/registerStyle";

registerStyle(
  "window-controls",
  `
.ud-wc {
  display: flex;
  align-items: stretch;
  flex: none;
  height: 100%;
  -webkit-app-region: no-drag;
  app-region: no-drag;
}

.ud-wc__btn {
  display: grid;
  place-items: center;
  width: 46px;
  min-height: 34px;
  color: var(--text-secondary);
  background: transparent;
  transition:
    background-color var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard);
}

.ud-wc__btn:hover {
  background: var(--n-100);
  color: var(--text);
}

.ud-wc__btn:active {
  background: var(--n-200);
}

.ud-wc__btn--close:hover {
  background: #e5322c;
  color: #fff;
}

.ud-wc__btn--close:active {
  background: #c02722;
  color: #fff;
}

.ud-wc__btn:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 2px var(--brand);
}

.ud-wc--on-brand .ud-wc__btn {
  color: rgba(255, 255, 255, 0.82);
}

.ud-wc--on-brand .ud-wc__btn:hover {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
}

.ud-wc--on-brand .ud-wc__btn--close:hover {
  background: #e5322c;
}

.ud-wc__glyph {
  transition: transform var(--dur-base) var(--ease-spring);
}

.ud-wc__btn:hover .ud-wc__glyph {
  transform: scale(1.12);
}

.ud-wc__btn:active .ud-wc__glyph {
  transform: scale(0.9);
}
`,
);

export interface WindowControlsProps {
  maximized: boolean;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
  showMaximize?: boolean;
  onBrand?: boolean;
  className?: string;
}

export function WindowControls({
  maximized,
  onMinimize,
  onToggleMaximize,
  onClose,
  showMaximize = true,
  onBrand = false,
  className = "",
}: WindowControlsProps) {
  return (
    <div className={cx("ud-wc", onBrand && "ud-wc--on-brand", className)}>
      <button
        type="button"
        className="ud-wc__btn"
        aria-label="Minimize window"
        title="Minimize"
        onClick={onMinimize}
      >
        <span className="ud-wc__glyph">
          <Icon name="win-minimize" size={16} strokeWidth={1.6} />
        </span>
      </button>

      {showMaximize ? (
        <button
          type="button"
          className="ud-wc__btn"
          aria-label={maximized ? "Restore window" : "Maximize window"}
          title={maximized ? "Restore" : "Maximize"}
          onClick={onToggleMaximize}
        >
          <span className="ud-wc__glyph">
            <Icon
              name={maximized ? "win-restore" : "win-maximize"}
              size={15}
              strokeWidth={1.5}
            />
          </span>
        </button>
      ) : null}

      <button
        type="button"
        className="ud-wc__btn ud-wc__btn--close"
        aria-label="Close window"
        title="Close"
        onClick={onClose}
      >
        <span className="ud-wc__glyph">
          <Icon name="win-close" size={16} strokeWidth={1.6} />
        </span>
      </button>
    </div>
  );
}

export default WindowControls;
