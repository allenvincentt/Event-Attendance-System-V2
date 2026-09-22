import { useEffect, useState } from "react";
import { Avatar } from "../../components/ui/Avatar";
import { Icon } from "../../components/ui/Icon";
import { IconButton } from "../../components/ui/IconButton";
import { WindowControls } from "../../components/window/WindowControls";
import { useWindowChrome } from "../../components/window/WindowFrame";
import { formatChipDate, formatChipTime } from "../../lib/format";
import type { AdminUser } from "../../models";
import { registerStyle } from "../../lib/registerStyle";

registerStyle(
  "topbar",
  `
.ud-topbar {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: none;
  height: var(--topbar-h);
  padding-left: var(--space-4);
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.ud-topbar__spacer {
  flex: 1;
  align-self: stretch;
}

.ud-topbar__chips {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.ud-topbar__chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  height: 30px;
  padding: 0 var(--space-3);
  border-radius: var(--r-sm);
  border: 1px solid var(--border);
  background: var(--surface-alt);
  font-size: var(--fs-12);
  font-weight: var(--fw-medium);
  color: var(--text-secondary);
  white-space: nowrap;
}

.ud-topbar__chip svg {
  color: var(--text-faint);
}

.ud-topbar__chip-value {
  font-variant-numeric: tabular-nums;
}

.ud-topbar__divider {
  width: 1px;
  height: 24px;
  background: var(--border);
  flex: none;
}

.ud-topbar__user {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 0 var(--space-2);
}

.ud-topbar__user-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  min-width: 0;
}

.ud-topbar__user-name {
  font-size: var(--fs-13);
  font-weight: var(--fw-semibold);
  color: var(--text);
  white-space: nowrap;
}

.ud-topbar__user-role {
  font-size: var(--fs-11);
  color: var(--text-muted);
  white-space: nowrap;
}
`,
);

function useNow(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export interface TopBarProps {
  user: AdminUser;
  onRefresh: () => void;
}

export function TopBar({ user, onRefresh }: TopBarProps) {
  const now = useNow();
  const { maximized, minimize, toggleMaximize, close } = useWindowChrome();

  return (
    <header className="ud-topbar">
      <IconButton icon="refresh" label="Refresh data" onClick={onRefresh} />

      <div
        className="ud-topbar__spacer"
        data-tauri-drag-region
        onDoubleClick={toggleMaximize}
      />

      <div className="ud-topbar__chips">
        <span className="ud-topbar__chip">
          <Icon name="calendar" size={14} />
          <span className="ud-topbar__chip-value">{formatChipDate(now)}</span>
        </span>
        <span className="ud-topbar__chip">
          <Icon name="clock" size={14} />
          <span className="ud-topbar__chip-value">{formatChipTime(now)}</span>
        </span>
      </div>

      <span className="ud-topbar__divider" />

      <div className="ud-topbar__user">
        <Avatar name={user.name} size="sm" />
        <span className="ud-topbar__user-text">
          <span className="ud-topbar__user-name">{user.name}</span>
          <span className="ud-topbar__user-role">{user.role}</span>
        </span>
      </div>

      <WindowControls
        maximized={maximized}
        onMinimize={minimize}
        onToggleMaximize={toggleMaximize}
        onClose={close}
      />
    </header>
  );
}

export default TopBar;
