import type { EventRecord } from "./types";

export const EVENTS: readonly EventRecord[] = [
  {
    id: "nightly-cultural-show", name: "Nightly Cultural Show", venue: "Open Quadrangle",
    date: "2026-08-20", status: "draft",
    sessions: [{ session: "evening", start: "18:00", end: "21:30" }],
    departmentCodes: ["BED", "CAFAE", "CTE"],
  },
  {
    id: "general-assembly-1st-sem", name: "General Assembly – First Semester", venue: "Auditorium",
    date: "2026-08-12", status: "upcoming",
    sessions: [
      { session: "morning", start: "08:00", end: "12:00" },
      { session: "afternoon", start: "13:00", end: "16:30" },
    ],
    departmentCodes: ["BED", "CAE", "CASE", "CCE", "CTE"],
  },
  {
    id: "intramurals-opening", name: "Intramurals Opening Ceremony", venue: "Athletic Field",
    date: "2026-08-05", status: "upcoming",
    sessions: [{ session: "morning", start: "06:30", end: "11:00" }],
    departmentCodes: ["BED", "CAFAE", "CASE", "CCE", "CEE", "CTE"],
  },
  {
    id: "university-foundation-day", name: "University Foundation Day 2026", venue: "Gymnasium – Main Campus",
    date: "2026-07-30", status: "ongoing",
    sessions: [
      { session: "morning", start: "07:30", end: "12:00" },
      { session: "afternoon", start: "13:00", end: "17:00" },
      { session: "evening", start: "18:00", end: "21:00" },
    ],
    departmentCodes: ["BED", "CAE", "CAFAE", "CASE", "CCE", "CCJE", "CEE", "CHE", "CHSE", "CTE", "PS", "TS"],
  },
  {
    id: "research-colloquium", name: "Research Colloquium", venue: "Learning Commons – 5th Floor",
    date: "2026-07-24", status: "completed",
    sessions: [
      { session: "morning", start: "08:30", end: "12:00" },
      { session: "afternoon", start: "13:00", end: "16:00" },
    ],
    departmentCodes: ["CASE", "CCE", "CEE", "PS"],
  },
  {
    id: "career-job-fair", name: "Career and Job Fair", venue: "Covered Court",
    date: "2026-07-18", status: "completed",
    sessions: [
      { session: "morning", start: "09:00", end: "12:00" },
      { session: "afternoon", start: "13:00", end: "17:00" },
    ],
    departmentCodes: ["CAE", "CAFAE", "CASE", "CCE", "CCJE", "CEE", "CHE"],
  },
  {
    id: "community-outreach", name: "Community Outreach – Barangay Visit", venue: "Barangay Bucana",
    date: "2026-06-28", status: "cancelled",
    sessions: [{ session: "morning", start: "07:00", end: "11:00" }],
    departmentCodes: ["BED", "CASE", "CTE"],
  },
];

export const EVENT_OVERALL_RATE: Record<string, number> = {
  "nightly-cultural-show": 0.645,
  "career-job-fair": 0.62,
  "research-colloquium": 0.48,
  "university-foundation-day": 0.73,
  "general-assembly-1st-sem": 0.0,
  "intramurals-opening": 0.0,
  "community-outreach": 0.0,
};

export function eventById(id: string): EventRecord {
  const e = EVENTS.find((x) => x.id === id);
  if (!e) throw new Error(`Unknown event id: ${id}`);
  return e;
}

export function eventDateTimeRange(e: EventRecord) {
  const starts = e.sessions.map((s) => s.start).sort();
  const ends = e.sessions.map((s) => s.end).sort();
  return { start: starts[0], end: ends[ends.length - 1] };
}
