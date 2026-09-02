import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { WindowFrame } from "@/app/chrome/WindowFrame";
import { Sidebar, type AppView } from "@/app/shell/Sidebar";
import { TopBar } from "@/app/shell/TopBar";
import { DashboardView } from "@/app/views/DashboardView";
import { EventView } from "@/app/views/EventView";
import { StudentManagementView } from "@/app/views/StudentManagementView";
import { tokens } from "@/app/theme/tokens";
import { viewSwitch } from "@/app/motion/transitions";
import { closeWindow, openSignInWindow } from "@/app/lib/window";

const VIEWS: Record<AppView, () => React.JSX.Element> = {
  dashboard: DashboardView,
  events: EventView,
  students: StudentManagementView,
};

export function AppShellWindow() {
  const [view, setView] = useState<AppView>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const Active = VIEWS[view];
  const signOut = async () => { await openSignInWindow(); await closeWindow(); };

  return (
    <WindowFrame
      title="Event Attendance System"
      titleBarHeight={52}
      titleBarRight={<TopBar onRefresh={() => location.reload()} userName="Administrator" userRole="Events Office" onSignOut={signOut} />}
    >
      <div style={{ display: "flex", height: "100%", background: tokens.color.surface.canvas }}>
        <Sidebar view={view} onNavigate={setView} collapsed={collapsed} onToggleCollapsed={() => setCollapsed((c) => !c)} onSignOut={signOut} />
        <main style={{ flex: 1, minWidth: 0, overflow: "auto", padding: `${tokens.space.xl}px ${tokens.space["2xl"]}px` }}>
          <AnimatePresence mode="wait">
            <motion.div key={view} variants={viewSwitch} initial="initial" animate="animate" exit="exit">
              <Active />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </WindowFrame>
  );
}

export default AppShellWindow;
