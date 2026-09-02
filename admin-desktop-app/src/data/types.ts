export type Session = "morning" | "afternoon" | "evening";
export type EventStatus = "draft" | "upcoming" | "ongoing" | "completed" | "cancelled";
export type AttendanceStatus = "present" | "no-timeout" | "absent";

export interface Department { code: string; name: string; shortName: string; logo: string; }
export interface Student { id: string; name: string; departmentCode: string; section: string; }
export interface SessionSchedule { session: Session; start: string; end: string; }
export interface EventRecord {
  id: string; name: string; venue: string; date: string;
  status: EventStatus; sessions: SessionSchedule[]; departmentCodes: string[];
}
export interface AttendeeRecord {
  studentId: string; name: string; section: string; departmentCode: string;
  timeIn: string | null; timeOut: string | null; status: AttendanceStatus;
}
export interface DepartmentAttendance { departmentCode: string; invited: number; attended: number; }

export interface DashboardData {
  eventId: string;
  attendanceRate: number;
  studentsPresent: number;
  studentsInvited: number;
  didNotAttend: number;
  departmentsParticipating: number;
  departmentsTotal: number;
  eventsThisTerm: number;
  eventsUpcoming: number;
  eventsCompleted: number;
  turnout: { attended: number; absent: number };
  sessionSplit: { session: Session; scheduled: boolean; rate: number }[];
  byDepartment: { departmentCode: string; enrolled: number; attended: number }[];
  ranking: { departmentCode: string; rate: number; attended: number; invited: number }[];
  trend: { label: string; date: string; rate: number }[];
}
