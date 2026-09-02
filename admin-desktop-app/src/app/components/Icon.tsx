import type React from "react";

export type IconName =
  | "dashboard" | "calendar" | "users" | "search" | "chevronDown" | "chevronRight"
  | "chevronLeft" | "close" | "minimize" | "maximize" | "restore" | "check" | "plus"
  | "eye" | "pencil" | "trash" | "refresh" | "pin" | "clock" | "sun" | "sunrise"
  | "moon" | "user" | "lock" | "arrowUp" | "arrowDown" | "filter" | "download"
  | "upload" | "logout" | "panelLeft" | "info" | "alertTriangle" | "x";

const P: Record<IconName, React.ReactNode> = {
  dashboard: (<><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>),
  calendar: (<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></>),
  users: (<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>),
  search: (<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>),
  chevronDown: (<path d="m6 9 6 6 6-6" />),
  chevronRight: (<path d="m9 6 6 6-6 6" />),
  chevronLeft: (<path d="m15 6-6 6 6 6" />),
  close: (<path d="M18 6 6 18M6 6l12 12" />),
  x: (<path d="M18 6 6 18M6 6l12 12" />),
  minimize: (<path d="M5 12h14" />),
  maximize: (<rect x="4" y="4" width="16" height="16" rx="1" />),
  restore: (<><rect x="8" y="8" width="12" height="12" rx="1" /><path d="M4 16V5a1 1 0 0 1 1-1h11" /></>),
  check: (<path d="M20 6 9 17l-5-5" />),
  plus: (<path d="M12 5v14M5 12h14" />),
  eye: (<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>),
  pencil: (<path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />),
  trash: (<><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>),
  refresh: (<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" />),
  pin: (<><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  sunrise: (<path d="M12 2v6M4.9 10.9 3.5 9.5M20.5 9.5l-1.4 1.4M2 18h20M6 18a6 6 0 0 1 12 0M8 6l4-4 4 4" />),
  sun: (<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" /></>),
  moon: (<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />),
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>),
  lock: (<><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>),
  arrowUp: (<path d="M12 19V5M6 11l6-6 6 6" />),
  arrowDown: (<path d="M12 5v14M6 13l6 6 6-6" />),
  filter: (<path d="M3 5h18l-7 8v6l-4 2v-8Z" />),
  download: (<path d="M12 3v12M7 10l5 5 5-5M5 21h14" />),
  upload: (<path d="M12 21V9M7 14l5-5 5 5M5 3h14" />),
  logout: (<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />),
  panelLeft: (<><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /></>),
  info: (<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>),
  alertTriangle: (<><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>),
};

export function Icon({
  name, size = 20, title, strokeWidth = 1.75,
}: { name: IconName; size?: number; title?: string; strokeWidth?: number }) {
  const a11y = title
    ? { role: "img" as const }
    : { "aria-hidden": true as const, focusable: false as const };
  return (
    <svg
      {...a11y}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {title ? <title>{title}</title> : null}
      {P[name]}
    </svg>
  );
}
