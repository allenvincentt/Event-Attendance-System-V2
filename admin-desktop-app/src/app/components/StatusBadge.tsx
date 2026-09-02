import { tokens, type StatusKey } from "@/app/theme/tokens";

const EVENT_MAP: Record<string, StatusKey> = {
  draft: "neutral", upcoming: "info", ongoing: "success", completed: "neutral", cancelled: "danger",
};
const ATTENDANCE_MAP: Record<string, StatusKey> = {
  present: "success", "no-timeout": "warning", absent: "danger",
};
const LABELS: Record<string, string> = {
  draft: "Draft", upcoming: "Upcoming", ongoing: "Ongoing", completed: "Completed", cancelled: "Cancelled",
  present: "Present", "no-timeout": "No time-out", absent: "Absent",
};

export function StatusBadge({ kind, value }: { kind: "event" | "attendance"; value: string }) {
  const family = (kind === "event" ? EVENT_MAP : ATTENDANCE_MAP)[value] ?? "neutral";
  const c = tokens.color.status[family];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: tokens.space["2xs"], padding: `${tokens.space["2xs"]}px ${tokens.space.sm}px`, borderRadius: tokens.radius.pill, background: c.soft, color: c.base, fontSize: tokens.font.size.sm, fontWeight: tokens.font.weight.semibold }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.base }} />
      {LABELS[value] ?? value}
    </span>
  );
}
