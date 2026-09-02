import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MockDataProvider, useEvents, useStudents } from "./MockDataProvider";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockDataProvider>{children}</MockDataProvider>
);

describe("MockDataProvider mutations", () => {
  it("adds, updates and deletes events in memory", () => {
    const { result } = renderHook(() => useEvents(), { wrapper });
    const before = result.current.events.length;
    let created!: { id: string };
    act(() => { created = result.current.addEvent({
      name: "Test", venue: "Hall", date: "2026-09-02", status: "upcoming",
      sessions: [{ session: "morning", start: "08:00", end: "12:00" }], departmentCodes: ["CAE"],
    }); });
    expect(result.current.events.length).toBe(before + 1);
    act(() => result.current.updateEvent(created.id, { name: "Renamed" }));
    expect(result.current.events.find((e) => e.id === created.id)!.name).toBe("Renamed");
    act(() => result.current.deleteEvent(created.id));
    expect(result.current.events.length).toBe(before);
  });
  it("adds a student with a generated id", () => {
    const { result } = renderHook(() => useStudents(), { wrapper });
    const before = result.current.students.length;
    act(() => result.current.addStudent({ name: "Zzz, Aaa", departmentCode: "CAE", section: "BSA-1A" }));
    expect(result.current.students.length).toBe(before + 1);
    expect(result.current.students.at(-1)!.id).toMatch(/^20\d{2}-\d{6}$/);
  });
});
