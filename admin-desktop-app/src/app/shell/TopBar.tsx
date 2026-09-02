import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Avatar } from "@/app/components/Avatar";
import { Icon } from "@/app/components/Icon";
import { IconButton } from "@/app/components/IconButton";
import { tokens } from "@/app/theme/tokens";
import { formatDateShort, formatWeekday } from "@/app/lib/format";

const chip: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: tokens.space["2xs"],
  padding: `${tokens.space["2xs"]}px ${tokens.space.sm}px`, borderRadius: tokens.radius.pill,
  background: tokens.color.surface.sunken, border: `1px solid ${tokens.color.border.default}`,
  fontSize: tokens.font.size.sm, color: tokens.color.text.default, fontVariantNumeric: "tabular-nums",
};

interface Props {
  onRefresh: () => void;
  userName: string;
  userRole: string;
  onSignOut: () => void;
  onProfile?: () => void;
}

export function TopBar({ onRefresh, userName, userRole, onSignOut, onProfile }: Props) {
  const [now, setNow] = useState(() => new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [spin, setSpin] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: tokens.space.sm }}>
      <motion.span animate={{ rotate: spin }} transition={{ duration: tokens.motion.dur.slow }}>
        <IconButton label="Refresh data" icon="refresh" onClick={() => { setSpin((s) => s + 360); onRefresh(); }} />
      </motion.span>
      <span style={chip}><Icon name="calendar" size={14} />{`${formatWeekday(now).slice(0, 3)}, ${formatDateShort(now)}`}</span>
      <span style={chip}><Icon name="clock" size={14} />{now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" })}</span>
      <div style={{ position: "relative" }}>
        <button
          type="button"
          aria-label="Account menu"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          style={{ display: "flex", alignItems: "center", gap: tokens.space.xs, border: "none", background: "transparent", cursor: "pointer" }}
        >
          <Avatar name={userName} />
          <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.2 }}>
            <strong style={{ fontSize: tokens.font.size.bodySm }}>{userName}</strong>
            <span style={{ fontSize: tokens.font.size.sm, color: tokens.color.text.muted }}>{userRole}</span>
          </span>
          <motion.span animate={{ rotate: menuOpen ? 180 : 0 }}><Icon name="chevronDown" size={14} /></motion.span>
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              role="menu"
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4, transition: { duration: tokens.motion.dur.fast } }}
              style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", background: tokens.color.surface.card, border: `1px solid ${tokens.color.border.default}`, borderRadius: tokens.radius.md, boxShadow: tokens.elevation.e2, minWidth: 160, padding: tokens.space["2xs"], zIndex: 80 }}
            >
              <button role="menuitem" type="button" onClick={() => { setMenuOpen(false); onProfile?.(); }} style={menuItem}>Profile</button>
              <button role="menuitem" type="button" onClick={() => { setMenuOpen(false); onSignOut(); }} style={menuItem}>Sign out</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const menuItem: React.CSSProperties = {
  display: "block", width: "100%", textAlign: "left", border: "none", background: "transparent",
  padding: `${tokens.space.xs}px ${tokens.space.sm}px`, borderRadius: tokens.radius.sm, cursor: "pointer",
  fontSize: tokens.font.size.bodySm, color: tokens.color.text.default,
};
