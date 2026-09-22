import type { SessionKey } from "../enums";
import type { AdminUser, Department, EventRecord } from "../models";
import { DEPARTMENTS, getDepartment } from "./departments";
import { EVENTS, getTurnout } from "./events";
import { percentOf } from "../lib/format";

export const ADMIN_USER: AdminUser = {
  name: "Administrator",
  role: "Events Office",
  initials: "AD",
};

export interface DepartmentSeriesPoint {
  department: Department;
  enrolled: number;
  attended: number;
  rate: number;
}

export interface SessionBar {
  key: SessionKey;
  enabled: boolean;
  rate: number;
  timedIn: number;
}

export interface TrendPoint {
  eventId: string;
  name: string;
  date: string;
  rate: number;
}

export interface DashboardMetrics {
  event: EventRecord;
  invited: number;
  present: number;
  rate: number;
  departmentCount: number;
  totalDepartments: number;
  eventCount: number;
  upcomingCount: number;
  completedCount: number;
  series: DepartmentSeriesPoint[];
  ranking: DepartmentSeriesPoint[];
  sessions: SessionBar[];
}

export function enabledSessions(event: EventRecord) {
  return event.sessions.filter((s) => s.enabled).sort((a, b) => a.start - b.start);
}

export function eventSpan(event: EventRecord): { start: number; end: number } | null {
  const active = enabledSessions(event);
  if (active.length === 0) return null;
  return {
    start: Math.min(...active.map((s) => s.start)),
    end: Math.max(...active.map((s) => s.end)),
  };
}

export function eventDepartments(event: EventRecord): Department[] {
  return event.departmentIds
    .map(getDepartment)
    .filter((d): d is Department => Boolean(d));
}

export function invitedFor(event: EventRecord): number {
  return eventDepartments(event).reduce((acc, d) => acc + d.enrolled, 0);
}

export function buildDashboardMetrics(eventId: string): DashboardMetrics | null {
  const event = EVENTS.find((e) => e.id === eventId);
  if (!event) return null;

  const turnout = getTurnout(eventId);
  const departments = eventDepartments(event);

  const series: DepartmentSeriesPoint[] = departments.map((department) => {
    const row = turnout?.departments.find((d) => d.departmentId === department.id);
    const enrolled = row?.enrolled || department.enrolled;
    const attended = row?.attended ?? 0;
    return {
      department,
      enrolled,
      attended,
      rate: percentOf(attended, enrolled),
    };
  });

  const invited = series.reduce((acc, s) => acc + s.enrolled, 0);
  const present = series.reduce((acc, s) => acc + s.attended, 0);

  const sessions: SessionBar[] = event.sessions.map((schedule) => {
    const row = turnout?.sessions.find((s) => s.key === schedule.key);
    return {
      key: schedule.key,
      enabled: schedule.enabled,
      timedIn: row?.timedIn ?? 0,
      rate: row && row.invited > 0 ? percentOf(row.timedIn, row.invited) : 0,
    };
  });

  return {
    event,
    invited,
    present,
    rate: percentOf(present, invited),
    departmentCount: departments.length,
    totalDepartments: DEPARTMENTS.length,
    eventCount: EVENTS.length,
    upcomingCount: EVENTS.filter((e) => e.status === "upcoming").length,
    completedCount: EVENTS.filter((e) => e.status === "completed").length,
    series,
    ranking: series.slice().sort((a, b) => b.rate - a.rate),
    sessions,
  };
}

export function buildTrend(): TrendPoint[] {
  return EVENTS.filter((event) => {
    const turnout = getTurnout(event.id);
    return (
      turnout !== undefined &&
      turnout.invited > 0 &&
      (event.status === "completed" || event.status === "ongoing")
    );
  })
    .map((event) => {
      const turnout = getTurnout(event.id)!;
      return {
        eventId: event.id,
        name: event.name,
        date: event.date,
        rate: percentOf(turnout.attended, turnout.invited),
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function sortedEvents(): EventRecord[] {
  return EVENTS.slice().sort((a, b) => b.date.localeCompare(a.date));
}
