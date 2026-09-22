import type { AttendanceState, EventStatus, SessionKey } from "../enums";

export interface Department {
  id: string;
  code: string;

  name: string;

  shortName: string;
  logo: string;

  programs: string[];
  enrolled: number;
}

export interface Student {
  id: string;

  name: string;
  studentNumber: string;
  departmentId: string;
  section: string;
}

export interface SessionSchedule {
  key: SessionKey;
  enabled: boolean;

  start: number;
  end: number;
}

export interface EventRecord {
  id: string;
  name: string;
  venue: string;

  date: string;
  status: EventStatus;
  departmentIds: string[];
  sessions: SessionSchedule[];
}

export interface DepartmentTurnout {
  departmentId: string;
  enrolled: number;
  attended: number;
}

export interface SessionTurnout {
  key: SessionKey;
  timedIn: number;
  invited: number;
}

export interface EventTurnout {
  eventId: string;
  invited: number;
  attended: number;
  departments: DepartmentTurnout[];
  sessions: SessionTurnout[];
}

export interface AttendanceRecord {
  studentId: string;

  timeIn: number | null;
  timeOut: number | null;
  state: AttendanceState;
}

export interface AdminUser {
  name: string;
  role: string;
  initials: string;
}

export type { AttendanceState, EventStatus, SessionKey };
