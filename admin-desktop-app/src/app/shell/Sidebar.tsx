import { motion } from "framer-motion";
import lockup from "@/assets/brand/UD.png";
import mark from "@/assets/brand/UDLogo.png";
import { Icon, type IconName } from "@/app/components/Icon";
import { tokens } from "@/app/theme/tokens";

export type AppView = "dashboard" | "events" | "students";

const ITEMS: { view: AppView; label: string; icon: IconName }[] = [
  { view: "dashboard", label: "Dashboard", icon: "dashboard" },
  { view: "events", label: "Event", icon: "calendar" },
  { view: "students", label: "Student Management", icon: "users" },
];

interface Props {
  view: AppView;
  onNavigate: (v: AppView) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onSignOut: () => void;
}

export function Sidebar({ view, onNavigate, collapsed, onToggleCollapsed, onSignOut }: Props) {
  return (
    <motion.nav
      layout
      style={{
        width: collapsed ? 84 : 248, flexShrink: 0, height: "100%",
        background: tokens.sidebarGradient, color: tokens.color.text.onSidebar,
        display: "flex", flexDirection: "column", padding: tokens.space.md,
        borderTopRightRadius: collapsed ? tokens.radius.lg : 0, borderBottomRightRadius: collapsed ? tokens.radius.lg : 0,
      }}
    >
      <div style={{ height: 48, display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", marginBottom: tokens.space.xl }}>
        <img src={collapsed ? mark : lockup} alt="University of Davao" style={{ height: collapsed ? 32 : 40, objectFit: "contain" }} />
      </div>
      {!collapsed && <span style={{ fontSize: tokens.font.size.xs, letterSpacing: 1, color: tokens.color.text.onSidebarMuted, marginBottom: tokens.space.sm }}>MENU</span>}
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: tokens.space["2xs"] }}>
        {ITEMS.map((item) => {
          const active = item.view === view;
          return (
            <li key={item.view} style={{ position: "relative" }}>
              <a
                role="link"
                tabIndex={0}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                onClick={() => onNavigate(item.view)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onNavigate(item.view); } }}
                style={{
                  display: "flex", alignItems: "center", gap: tokens.space.sm,
                  justifyContent: collapsed ? "center" : "flex-start",
                  padding: `${tokens.space.sm}px ${tokens.space.md}px`, borderRadius: tokens.radius.md,
                  cursor: "pointer", color: active ? "#fff" : tokens.color.text.onSidebarMuted,
                  fontWeight: active ? tokens.font.weight.semibold : tokens.font.weight.medium,
                  background: active ? tokens.color.brand.goldSoft : "transparent",
                }}
              >
                {active && <motion.span layoutId="side-active" style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 3, background: tokens.color.brand.gold, borderRadius: 2 }} />}
                <Icon name={item.icon} size={22} />
                {!collapsed && <span>{item.label}</span>}
              </a>
            </li>
          );
        })}
      </ul>
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: tokens.space["2xs"] }}>
        <button type="button" aria-expanded={!collapsed} onClick={onToggleCollapsed} style={ghost(collapsed)}>
          <motion.span animate={{ rotate: collapsed ? 180 : 0 }}><Icon name="panelLeft" size={18} /></motion.span>
          {!collapsed && <span>Collapse menu</span>}
        </button>
        <button type="button" onClick={onSignOut} style={ghost(collapsed)}>
          <Icon name="logout" size={18} />
          {!collapsed && <span>Sign out</span>}
        </button>
        {!collapsed && <span style={{ fontSize: 10, color: tokens.color.text.onSidebarMuted, marginTop: tokens.space.xs }}>v0.1 · front-end preview</span>}
      </div>
    </motion.nav>
  );
}

function ghost(collapsed: boolean): React.CSSProperties {
  return {
    display: "flex", alignItems: "center", gap: tokens.space.sm, justifyContent: collapsed ? "center" : "flex-start",
    border: "none", background: "transparent", color: tokens.color.text.onSidebarMuted, cursor: "pointer",
    padding: `${tokens.space.sm}px ${tokens.space.md}px`, borderRadius: tokens.radius.md, font: "inherit",
  };
}
