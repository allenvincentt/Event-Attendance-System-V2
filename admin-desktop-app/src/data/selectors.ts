import { EVENTS, EVENT_OVERALL_RATE, eventById } from "./events";
import { getDepartmentAttendance } from "./attendance";
import { DEPARTMENTS } from "./departments";
import { formatDateShort } from "@/app/lib/format";
import type { DashboardData, Session } from "./types";

export const TREND_EVENT_IDS = ["career-job-fair", "research-colloquium", "university-foundation-day"];
const SESSIONS: Session[] = ["morning", "afternoon", "evening"];

export function getDashboardData(eventId: string): DashboardData {
  const e = eventById(eventId);
  const scheduledSessions = e.sessions.map((s) => s.session);
  // aggregate across scheduled sessions, de-duplicated by department (invited counted once)
  const perDept = e.departmentCodes.map((code) => {
    const rows = scheduledSessions.flatMap((s) => getDepartmentAttendance(eventId, s).filter((r) => r.departmentCode === code));
    const invited = rows[0]?.invited ?? 0;
    const attended = Math.max(...rows.map((r) => r.attended), 0);
    return { departmentCode: code, invited, attended };
  });
  const studentsInvited = perDept.reduce((n, r) => n + r.invited, 0);
  const studentsPresent = perDept.reduce((n, r) => n + r.attended, 0);
  const attendanceRate = studentsInvited ? studentsPresent / studentsInvited : 0;

  const ranking = [...perDept]
    .map((r) => ({ departmentCode: r.departmentCode, attended: r.attended, invited: r.invited, rate: r.invited ? r.attended / r.invited : 0 }))
    .sort((a, b) => b.rate - a.rate);

  const sessionSplit = SESSIONS.map((session) => ({
    session,
    scheduled: scheduledSessions.includes(session),
    rate: scheduledSessions.includes(session) ? attendanceRate : 0,
  }));

  const trend = TREND_EVENT_IDS.map((id) => {
    const te = eventById(id);
    return { label: formatDateShort(new Date(`${te.date}T00:00:00`)).replace(/,.*/, ""), date: te.date, rate: EVENT_OVERALL_RATE[id] ?? 0 };
  });

  return {
    eventId,
    attendanceRate,
    studentsPresent,
    studentsInvited,
    didNotAttend: studentsInvited - studentsPresent,
    departmentsParticipating: e.departmentCodes.length,
    departmentsTotal: DEPARTMENTS.length,
    eventsThisTerm: EVENTS.length,
    eventsUpcoming: EVENTS.filter((x) => x.status === "upcoming").length,
    eventsCompleted: EVENTS.filter((x) => x.status === "completed").length,
    turnout: { attended: studentsPresent, absent: studentsInvited - studentsPresent },
    sessionSplit,
    byDepartment: perDept.map((r) => ({ departmentCode: r.departmentCode, enrolled: r.invited, attended: r.attended })),
    ranking,
    trend,
  };
}
