import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { DEPARTMENTS } from "./departments";
import { EVENTS } from "./events";
import { STUDENTS } from "./students";
import { getAttendees } from "./attendance";
import { getDashboardData } from "./selectors";
import type { Department, EventRecord, Session, Student } from "./types";

export const LATENCY_MS = 0;

interface Ctx {
  departments: readonly Department[];
  events: EventRecord[];
  students: Student[];
  addEvent(e: Omit<EventRecord, "id">): EventRecord;
  updateEvent(id: string, patch: Partial<EventRecord>): void;
  deleteEvent(id: string): void;
  addStudent(s: Omit<Student, "id"> & { id?: string }): Student;
}

const DataCtx = createContext<Ctx | null>(null);

let eventSeq = 1000;
const slug = (name: string) =>
  `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${++eventSeq}`;

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventRecord[]>(() => EVENTS.map((e) => ({ ...e })));
  const [students, setStudents] = useState<Student[]>(() => STUDENTS.map((s) => ({ ...s })));

  const addEvent = useCallback((e: Omit<EventRecord, "id">) => {
    const created: EventRecord = { ...e, id: slug(e.name || "event") };
    setEvents((list) => [created, ...list]);
    return created;
  }, []);
  const updateEvent = useCallback((id: string, patch: Partial<EventRecord>) => {
    setEvents((list) => list.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }, []);
  const deleteEvent = useCallback((id: string) => {
    setEvents((list) => list.filter((e) => e.id !== id));
  }, []);
  const addStudent = useCallback((s: Omit<Student, "id"> & { id?: string }) => {
    const created: Student = { ...s, id: s.id ?? `20${20 + Math.ceil(Math.random() * 5)}-${Math.floor(100000 + Math.random() * 899999)}` };
    setStudents((list) => [...list, created]);
    return created;
  }, []);

  const value = useMemo<Ctx>(
    () => ({ departments: DEPARTMENTS, events, students, addEvent, updateEvent, deleteEvent, addStudent }),
    [events, students, addEvent, updateEvent, deleteEvent, addStudent],
  );
  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>;
}

function useData(): Ctx {
  const c = useContext(DataCtx);
  if (!c) throw new Error("useData must be used within <MockDataProvider>");
  return c;
}

export const useDepartments = () => useData().departments;
export const useEvents = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useData();
  return { events, addEvent, updateEvent, deleteEvent };
};
export const useEvent = (id: string) => useData().events.find((e) => e.id === id);
export const useStudents = () => {
  const { students, addStudent } = useData();
  return { students, addStudent };
};
export const useDashboard = (eventId: string) => {
  useData(); // subscribe to provider
  return useMemo(() => getDashboardData(eventId), [eventId]);
};
export const useAttendees = (eventId: string, session: Session, deptCode: string) =>
  useMemo(() => getAttendees(eventId, session, deptCode), [eventId, session, deptCode]);
