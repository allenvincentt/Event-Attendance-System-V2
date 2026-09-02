export const formatNumber = (n: number) => n.toLocaleString("en-US");

export const formatPercent = (ratio: number, digits = 1) =>
  `${(ratio * 100).toFixed(digits)}%`;

export const formatTime = (d: Date) =>
  d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

export const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const formatDateShort = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const formatWeekday = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "long" });

export const formatDateLong = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

export const initials = (fullName: string) => {
  const parts = fullName.split(/[,\s]+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return (a + b).toUpperCase();
};
