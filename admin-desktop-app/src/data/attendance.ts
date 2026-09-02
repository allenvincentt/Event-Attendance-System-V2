import { hashString, mulberry32, pick, randInt } from "./rng";
import { EVENT_OVERALL_RATE, eventById } from "./events";
import { SECTIONS_BY_DEPT } from "./students";
import type { AttendeeRecord, DepartmentAttendance, Session } from "./types";

const SURNAMES = ["Abad", "Alcantara", "Cabrera", "Cruz", "Domingo", "Garcia", "Ilagan", "Mendoza", "Ramos", "Reyes", "Santos", "Tolentino", "Villanueva", "Yap"];
const GIVEN = ["Aaron", "Althea", "Andrei", "Bianca", "Camille", "Daniel", "Dianne", "Ethan", "Neil", "Rhea", "Rico", "Sofia"];

// Canonical, hand-set figures for the reference event.
export const EVENT_ATTENDANCE: Record<string, Record<string, { invited: number; attended: number }>> = {
  "nightly-cultural-show": {
    BED: { invited: 742, attended: 467 },
    CTE: { invited: 509, attended: 310 },
    CAFAE: { invited: 456, attended: 324 },
  },
};

// Base per-department "enrolment" used to synthesise invited counts for other events.
const BASE_ENROLMENT: Record<string, number> = {
  BED: 742, CAE: 388, CAFAE: 456, CASE: 512, CCE: 604, CCJE: 470,
  CEE: 559, CHE: 333, CHSE: 291, CTE: 509, PS: 176, TS: 214,
};

export const departmentEnrolment = (code: string) => BASE_ENROLMENT[code] ?? 300;

function figuresFor(eventId: string, deptCode: string) {
  const hand = EVENT_ATTENDANCE[eventId]?.[deptCode];
  if (hand) return hand;
  const invited = BASE_ENROLMENT[deptCode] ?? 300;
  const attended = Math.round(invited * (EVENT_OVERALL_RATE[eventId] ?? 0.55));
  return { invited, attended };
}

export function getDepartmentAttendance(eventId: string, session: Session): DepartmentAttendance[] {
  const e = eventById(eventId);
  return e.departmentCodes.map((code) => {
    const { invited, attended } = figuresFor(eventId, code);
    // sessions with no schedule contribute nothing
    const scheduled = e.sessions.some((s) => s.session === session);
    return { departmentCode: code, invited, attended: scheduled ? attended : 0 };
  });
}

export function getAttendees(eventId: string, session: Session, deptCode: string): AttendeeRecord[] {
  const e = eventById(eventId);
  const { invited, attended } = figuresFor(eventId, deptCode);
  const scheduled = e.sessions.some((s) => s.session === session);
  const effectiveAttended = scheduled ? attended : 0;
  const rand = mulberry32(hashString(`${eventId}|${session}|${deptCode}|v1`));
  const sched = e.sessions.find((s) => s.session === session);
  const [sh, sm] = (sched?.start ?? "08:00").split(":").map(Number);
  const [eh, em] = (sched?.end ?? "12:00").split(":").map(Number);
  const sessionStart = new Date(`${e.date}T00:00:00`); sessionStart.setHours(sh, sm, 0, 0);
  const sessionEnd = new Date(`${e.date}T00:00:00`); sessionEnd.setHours(eh, em, 0, 0);
  const windowMin = (sessionEnd.getTime() - sessionStart.getTime()) / 60000;
  const sections = SECTIONS_BY_DEPT[deptCode] ?? ["SEC-1A"];

  const rows: AttendeeRecord[] = [];
  for (let i = 0; i < invited; i++) {
    const attendedThis = i < effectiveAttended;
    let timeIn: string | null = null;
    let timeOut: string | null = null;
    let status: AttendeeRecord["status"] = "absent";
    if (attendedThis) {
      const inOffset = randInt(rand, -10, 45); // minutes around start
      const tIn = new Date(sessionStart.getTime() + inOffset * 60000);
      timeIn = tIn.toISOString();
      if (rand() < 0.85) {
        const outOffset = randInt(rand, Math.max(30, windowMin - 60), windowMin + 5);
        timeOut = new Date(sessionStart.getTime() + outOffset * 60000).toISOString();
        status = "present";
      } else {
        status = "no-timeout";
      }
    }
    rows.push({
      studentId: `${randInt(rand, 2021, 2024)}-${randInt(rand, 100000, 999999)}`,
      name: `${pick(rand, SURNAMES)}, ${pick(rand, GIVEN)}`,
      section: pick(rand, sections),
      departmentCode: deptCode,
      timeIn, timeOut, status,
    });
  }
  return rows.sort((a, b) => a.name.localeCompare(b.name));
}
