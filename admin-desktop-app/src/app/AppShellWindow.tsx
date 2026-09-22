import { useCallback, useState } from "react";
import { Sidebar, type ViewKey } from "./shell/Sidebar";
import { TopBar } from "./shell/TopBar";
import { DashboardView } from "./views/DashboardView";
import { EventView } from "./views/EventView";
import { StudentManagementView } from "./views/StudentManagementView";
import { WindowFrame } from "../components/window/WindowFrame";
import { ADMIN_USER } from "../data/selectors";
import { registerStyle } from "../lib/registerStyle";

registerStyle(
  "app-shell",
  `
.ud-shell {
  display: flex;
  flex: 1;
  min-height: 0;
}

.ud-shell__main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
  background: var(--bg);
}

.ud-shell__content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--space-6) var(--space-6) var(--space-7);
}

.ud-shell__view {
  animation: ud-view-in var(--dur-slower) var(--ease-out);
}

@keyframes ud-view-in {
  from {
    opacity: 0;
    transform: translate3d(0, 10px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
`,
);

export interface AppShellWindowProps {
  onSignOut: () => void;
}

export function AppShellWindow({ onSignOut }: AppShellWindowProps) {
  const [view, setView] = useState<ViewKey>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  const refresh = useCallback(() => setRefreshToken((token) => token + 1), []);

  return (
    <WindowFrame>
      <div className="ud-shell">
        <Sidebar
          current={view}
          onNavigate={setView}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((value) => !value)}
          onSignOut={onSignOut}
        />

        <div className="ud-shell__main">
          <TopBar user={ADMIN_USER} onRefresh={refresh} />

          <main className="ud-shell__content">
            <div className="ud-shell__view" key={`${view}-${refreshToken}`}>
              {view === "dashboard" ? <DashboardView /> : null}
              {view === "events" ? <EventView /> : null}
              {view === "students" ? <StudentManagementView /> : null}
            </div>
          </main>
        </div>
      </div>
    </WindowFrame>
  );
}

export default AppShellWindow;
