import wordmark from "../../assets/brand/UD.png";
import emblem from "../../assets/brand/UDLogo.png";
import { Icon, type IconName } from "../../components/ui/Icon";
import { registerStyle } from "../../lib/registerStyle";

registerStyle(
  "sidebar",
  `
.ud-rail {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: none;
  width: var(--rail-w);
  padding: var(--space-5) var(--space-4) var(--space-4);
  background: var(--grad-rail);
  color: #fff;
  overflow: hidden;
  transition: width var(--dur-slow) var(--ease-out), padding var(--dur-slow) var(--ease-out);
}

.ud-rail[data-collapsed="true"] {
  width: var(--rail-w-collapsed);
  padding-left: var(--space-3);
  padding-right: var(--space-3);
}

.ud-rail::after {
  content: "";
  position: absolute;
  width: 260px;
  height: 260px;
  right: -150px;
  top: -110px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  pointer-events: none;
}

.ud-rail__brand {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 96px;
  padding: var(--space-2) var(--space-2) var(--space-6);
  flex: none;
}

.ud-rail__wordmark {
  width: 100%;
  max-width: 178px;
  object-fit: contain;
  transition: opacity var(--dur-base) var(--ease-standard);
}

.ud-rail__emblem {
  width: 42px;
  height: 42px;
  object-fit: contain;
}

.ud-rail__section {
  padding: 0 var(--space-3) var(--space-2);
  font-size: var(--fs-11);
  font-weight: var(--fw-bold);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  overflow: hidden;
  transition: opacity var(--dur-fast) var(--ease-standard);
}

.ud-rail[data-collapsed="true"] .ud-rail__section {
  opacity: 0;
  height: 0;
  padding-bottom: 0;
}

.ud-rail__nav {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
  min-height: 0;
}

.ud-rail__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  height: 46px;
  padding: 0 var(--space-4);
  border-radius: var(--r-md);
  color: var(--gold-300);
  font-size: var(--fs-13);
  font-weight: var(--fw-semibold);
  white-space: nowrap;
  transition:
    background var(--dur-base) var(--ease-standard),
    color var(--dur-base) var(--ease-standard),
    transform var(--dur-fast) var(--ease-out),
    padding var(--dur-slow) var(--ease-out);
}

.ud-rail[data-collapsed="true"] .ud-rail__item {
  justify-content: center;
  padding: 0;
  border-radius: var(--r-lg);
}

.ud-rail__item:hover:not([aria-current="page"]) {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  transform: translateX(2px);
}

.ud-rail[data-collapsed="true"] .ud-rail__item:hover:not([aria-current="page"]) {
  transform: translateY(-2px);
}

.ud-rail__item:active {
  transform: scale(0.97);
}

.ud-rail__item[aria-current="page"] {
  background: var(--grad-accent);
  color: var(--red-900);
  box-shadow: var(--sh-accent);
}

.ud-rail__item:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--red-800), 0 0 0 4px var(--gold-300);
}

.ud-rail__item-icon {
  flex: none;
  display: grid;
  place-items: center;
}

.ud-rail__item-label {
  overflow: hidden;
  transition: opacity var(--dur-fast) var(--ease-standard);
}

.ud-rail[data-collapsed="true"] .ud-rail__item-label {
  opacity: 0;
  width: 0;
}

.ud-rail__marker {
  position: absolute;
  left: calc(var(--space-4) * -1);
  width: 4px;
  height: 26px;
  border-radius: 0 var(--r-pill) var(--r-pill) 0;
  background: var(--gold-300);
  transition: transform var(--dur-slow) var(--ease-spring);
  pointer-events: none;
}

.ud-rail[data-collapsed="true"] .ud-rail__marker {
  left: calc(var(--space-3) * -1);
}

.ud-rail__foot {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex: none;
  padding-top: var(--space-4);
  border-top: 1px solid rgba(255, 255, 255, 0.16);
}

.ud-rail__version {
  padding: var(--space-2) var(--space-4) 0;
  font-size: var(--fs-11);
  color: rgba(255, 255, 255, 0.42);
  white-space: nowrap;
  overflow: hidden;
  transition: opacity var(--dur-fast) var(--ease-standard);
}

.ud-rail[data-collapsed="true"] .ud-rail__version {
  opacity: 0;
}
`,
);

export type ViewKey = "dashboard" | "events" | "students";

interface NavItem {
  key: ViewKey;
  label: string;
  icon: IconName;
}

const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard" },
  { key: "events", label: "Event", icon: "calendar" },
  { key: "students", label: "Student Management", icon: "users" },
];

export interface SidebarProps {
  current: ViewKey;
  onNavigate: (view: ViewKey) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSignOut: () => void;
}

export function Sidebar({
  current,
  onNavigate,
  collapsed,
  onToggleCollapse,
  onSignOut,
}: SidebarProps) {
  const activeIndex = NAV_ITEMS.findIndex((item) => item.key === current);

  return (
    <nav
      className="ud-rail"
      data-collapsed={collapsed}
      aria-label="Primary"
      data-tauri-drag-region
    >
      <div className="ud-rail__brand">
        {collapsed ? (
          <img className="ud-rail__emblem" src={emblem} alt="" draggable={false} />
        ) : (
          <img
            className="ud-rail__wordmark"
            src={wordmark}
            alt="The University of Davao"
            draggable={false}
          />
        )}
      </div>

      <p className="ud-rail__section">Menu</p>

      <div className="ud-rail__nav">
        <span
          className="ud-rail__marker"
          aria-hidden="true"
          style={{
            transform: `translateY(${activeIndex * 54 + 10}px)`,
            opacity: activeIndex >= 0 ? 1 : 0,
          }}
        />
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className="ud-rail__item"
            aria-current={item.key === current ? "page" : undefined}
            aria-label={collapsed ? item.label : undefined}
            title={collapsed ? item.label : undefined}
            onClick={() => onNavigate(item.key)}
          >
            <span className="ud-rail__item-icon">
              <Icon name={item.icon} size={19} />
            </span>
            <span className="ud-rail__item-label">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="ud-rail__foot">
        <button
          type="button"
          className="ud-rail__item"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand menu" : "Collapse menu"}
          title={collapsed ? "Expand menu" : "Collapse menu"}
        >
          <span className="ud-rail__item-icon">
            <Icon name="panel-left" size={19} />
          </span>
          <span className="ud-rail__item-label">Collapse menu</span>
        </button>

        <button
          type="button"
          className="ud-rail__item"
          onClick={onSignOut}
          aria-label={collapsed ? "Sign out" : undefined}
          title={collapsed ? "Sign out" : undefined}
        >
          <span className="ud-rail__item-icon">
            <Icon name="log-out" size={19} />
          </span>
          <span className="ud-rail__item-label">Sign out</span>
        </button>

        <p className="ud-rail__version">v0.1 {"\u00b7"} front-end preview</p>
      </div>
    </nav>
  );
}

export default Sidebar;
