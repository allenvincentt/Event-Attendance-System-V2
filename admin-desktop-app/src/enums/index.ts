export const EVENT_STATUSES = [
  "draft",
  "upcoming",
  "ongoing",
  "completed",
  "cancelled",
] as const;

export type EventStatus = (typeof EVENT_STATUSES)[number];

export const EVENT_STATUS_LABEL: Record<EventStatus, string> = {
  draft: "Draft",
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const SESSION_KEYS = ["morning", "afternoon", "evening"] as const;

export type SessionKey = (typeof SESSION_KEYS)[number];

export const SESSION_LABEL: Record<SessionKey, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

export const ATTENDANCE_STATES = ["present", "no-timeout", "absent"] as const;

export type AttendanceState = (typeof ATTENDANCE_STATES)[number];

export const ATTENDANCE_STATE_LABEL: Record<AttendanceState, string> = {
  present: "Present",
  "no-timeout": "No time-out",
  absent: "Absent",
};
