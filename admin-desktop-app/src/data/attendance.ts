import type { AttendanceState, SessionKey } from "../enums";
import type { AttendanceRecord, Student } from "../models";
import { getEvent, getTurnout } from "./events";
import { createRng, hashSeed, randInt, shuffle } from "./rng";
import { studentsOfDepartment } from "./students";

export interface AttendanceRow extends AttendanceRecord {
  student: Student;

  duration: number | null;
}

export interface AttendanceSheet {
  eventId: string;
  departmentId: string;
  session: SessionKey;
  rows: AttendanceRow[];
  total: number;
  timedIn: number;
  withoutTimeout: number;
  absent: number;
}

const NO_TIMEOUT_SHARE = 0.18;

const cache = new Map<string, AttendanceSheet>();

export function getAttendanceSheet(
  eventId: string,
  departmentId: string,
  session: SessionKey,
): AttendanceSheet {
  const key = `${eventId}|${departmentId}|${session}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const event = getEvent(eventId);
  const students = studentsOfDepartment(departmentId);
  const schedule = event?.sessions.find((s) => s.key === session);
  const turnout = getTurnout(eventId);
  const dept = turnout?.departments.find((d) => d.departmentId === departmentId);

  const rate = dept && dept.enrolled > 0 ? dept.attended / dept.enrolled : 0;
  const total = students.length;
  const timedIn = Math.round(total * rate);
  const withoutTimeout = timedIn > 0 ? Math.round(timedIn * NO_TIMEOUT_SHARE) : 0;

  const rng = createRng(hashSeed(key));

  const order = shuffle(
    rng,
    students.map((_, index) => index),
  );
  const attendedSet = new Set(order.slice(0, timedIn));
  const noTimeoutSet = new Set(order.slice(timedIn - withoutTimeout, timedIn));

  const start = schedule?.start ?? 480;
  const end = schedule?.end ?? 720;

  const arrivalWindow = Math.max(10, Math.round((end - start) * 0.2));
  const departureWindow = Math.max(10, Math.round((end - start) * 0.18));

  const rows: AttendanceRow[] = students.map((student, index) => {
    if (!attendedSet.has(index)) {
      return {
        student,
        studentId: student.id,
        timeIn: null,
        timeOut: null,
        duration: null,
        state: "absent" as AttendanceState,
      };
    }

    const timeIn = start + randInt(rng, 0, arrivalWindow);

    if (noTimeoutSet.has(index)) {
      return {
        student,
        studentId: student.id,
        timeIn,
        timeOut: null,
        duration: null,
        state: "no-timeout" as AttendanceState,
      };
    }

    const timeOut = Math.max(timeIn + 20, end - randInt(rng, 0, departureWindow));
    return {
      student,
      studentId: student.id,
      timeIn,
      timeOut,
      duration: timeOut - timeIn,
      state: "present" as AttendanceState,
    };
  });

  const sheet: AttendanceSheet = {
    eventId,
    departmentId,
    session,
    rows,
    total,
    timedIn,
    withoutTimeout,
    absent: total - timedIn,
  };

  cache.set(key, sheet);
  return sheet;
}
