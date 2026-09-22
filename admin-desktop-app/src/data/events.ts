import type { EventRecord, EventTurnout, SessionSchedule } from "../models";
import type { SessionKey } from "../enums";

export const DEFAULT_SESSION_TIMES: Record<
  SessionKey,
  { start: number; end: number }
> = {
  morning: { start: 480, end: 720 },
  afternoon: { start: 780, end: 1020 },
  evening: { start: 1080, end: 1260 },
};

export function defaultSessions(enabled: SessionKey[] = ["morning"]): SessionSchedule[] {
  return (Object.keys(DEFAULT_SESSION_TIMES) as SessionKey[]).map((key) => ({
    key,
    enabled: enabled.includes(key),
    start: DEFAULT_SESSION_TIMES[key].start,
    end: DEFAULT_SESSION_TIMES[key].end,
  }));
}

function sessions(
  config: Partial<Record<SessionKey, [number, number]>>,
): SessionSchedule[] {
  return (Object.keys(DEFAULT_SESSION_TIMES) as SessionKey[]).map((key) => {
    const range = config[key];
    return {
      key,
      enabled: Boolean(range),
      start: range ? range[0] : DEFAULT_SESSION_TIMES[key].start,
      end: range ? range[1] : DEFAULT_SESSION_TIMES[key].end,
    };
  });
}

export const EVENTS: EventRecord[] = [
  {
    id: "nightly-cultural-show",
    name: "Nightly Cultural Show",
    venue: "Open Quadrangle",
    date: "2026-08-20",
    status: "draft",
    departmentIds: ["BED", "CAFAE", "CTE"],
    sessions: sessions({ evening: [1080, 1290] }),
  },
  {
    id: "general-assembly-first-sem",
    name: "General Assembly \u2013 First Semester",
    venue: "Auditorium",
    date: "2026-08-12",
    status: "upcoming",
    departmentIds: ["BED", "CAE", "CASE", "CCE", "CTE"],
    sessions: sessions({ morning: [480, 720], afternoon: [780, 990] }),
  },
  {
    id: "intramurals-opening",
    name: "Intramurals Opening Ceremony",
    venue: "Athletic Field",
    date: "2026-08-05",
    status: "upcoming",
    departmentIds: ["BED", "CAFAE", "CASE", "CCE", "CEE", "CTE"],
    sessions: sessions({ morning: [390, 660] }),
  },
  {
    id: "foundation-day-2026",
    name: "University Foundation Day 2026",
    venue: "Gymnasium \u2013 Main Campus",
    date: "2026-07-30",
    status: "ongoing",
    departmentIds: [
      "BED", "CAE", "CAFAE", "CASE", "CCE", "CCJE",
      "CEE", "CHE", "CHSE", "CTE", "PS", "TS",
    ],
    sessions: sessions({
      morning: [450, 690],
      afternoon: [780, 1020],
      evening: [1080, 1260],
    }),
  },
  {
    id: "research-colloquium",
    name: "Research Colloquium",
    venue: "Learning Commons \u2013 5th Floor",
    date: "2026-07-24",
    status: "completed",
    departmentIds: ["CASE", "CCE", "CEE", "CHSE"],
    sessions: sessions({ morning: [510, 720], afternoon: [780, 960] }),
  },
  {
    id: "career-job-fair",
    name: "Career and Job Fair",
    venue: "Covered Court",
    date: "2026-07-18",
    status: "completed",
    departmentIds: ["CAE", "CASE", "CCE", "CCJE", "CEE", "CHE", "CTE"],
    sessions: sessions({ morning: [540, 720], afternoon: [780, 1020] }),
  },
  {
    id: "community-outreach-barangay",
    name: "Community Outreach \u2013 Barangay Visit",
    venue: "Barangay Bucana",
    date: "2026-06-28",
    status: "cancelled",
    departmentIds: ["BED", "CHSE", "CTE"],
    sessions: sessions({ morning: [420, 660] }),
  },
];

const TURNOUT_TABLE: Record<
  string,
  { departments: Array<[string, number, number]>; sessions: Array<[SessionKey, number]> }
> = {
  "nightly-cultural-show": {
    departments: [
      ["BED", 742, 467],
      ["CAFAE", 456, 324],
      ["CTE", 509, 310],
    ],
    sessions: [["evening", 1101]],
  },
  "foundation-day-2026": {
    departments: [
      ["BED", 742, 505],
      ["CAE", 388, 244],
      ["CAFAE", 456, 324],
      ["CASE", 612, 379],
      ["CCE", 934, 616],
      ["CCJE", 521, 318],
      ["CEE", 705, 451],
      ["CHE", 483, 324],
      ["CHSE", 396, 257],
      ["CTE", 509, 351],
      ["PS", 274, 151],
      ["TS", 331, 209],
    ],
    sessions: [
      ["morning", 3810],
      ["afternoon", 3492],
      ["evening", 2604],
    ],
  },
  "research-colloquium": {
    departments: [
      ["CASE", 612, 294],
      ["CCE", 934, 495],
      ["CEE", 705, 345],
      ["CHSE", 396, 190],
    ],
    sessions: [
      ["morning", 1240],
      ["afternoon", 1050],
    ],
  },
  "career-job-fair": {
    departments: [
      ["CAE", 388, 237],
      ["CASE", 612, 337],
      ["CCE", 934, 551],
      ["CCJE", 521, 271],
      ["CEE", 705, 409],
      ["CHE", 483, 261],
      ["CTE", 509, 305],
    ],
    sessions: [
      ["morning", 2210],
      ["afternoon", 1980],
    ],
  },
};

function buildTurnout(event: EventRecord): EventTurnout {
  const table = TURNOUT_TABLE[event.id];
  const enabled = event.sessions.filter((s) => s.enabled);

  if (!table) {
    const departments = event.departmentIds.map((departmentId) => ({
      departmentId,
      enrolled: 0,
      attended: 0,
    }));
    return {
      eventId: event.id,
      invited: 0,
      attended: 0,
      departments,
      sessions: enabled.map((s) => ({ key: s.key, timedIn: 0, invited: 0 })),
    };
  }

  const departments = table.departments.map(([departmentId, enrolled, attended]) => ({
    departmentId,
    enrolled,
    attended,
  }));
  const invited = departments.reduce((acc, d) => acc + d.enrolled, 0);
  const attended = departments.reduce((acc, d) => acc + d.attended, 0);

  return {
    eventId: event.id,
    invited,
    attended,
    departments,
    sessions: table.sessions.map(([key, timedIn]) => ({ key, timedIn, invited })),
  };
}

export const TURNOUTS: Record<string, EventTurnout> = Object.fromEntries(
  EVENTS.map((event) => [event.id, buildTurnout(event)]),
);

export function getEvent(id: string): EventRecord | undefined {
  return EVENTS.find((e) => e.id === id);
}

export function getTurnout(eventId: string): EventTurnout | undefined {
  return TURNOUTS[eventId];
}

export function invitedCount(event: EventRecord, enrolledById: Map<string, number>): number {
  return event.departmentIds.reduce(
    (acc, id) => acc + (enrolledById.get(id) ?? 0),
    0,
  );
}
