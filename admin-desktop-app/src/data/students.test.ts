import { describe, expect, it } from "vitest";
import { STUDENTS } from "./students";
import { DEPARTMENT_CODES } from "./departments";

describe("students roster", () => {
  it("has exactly 312 students", () => {
    expect(STUDENTS).toHaveLength(312);
  });
  it("uses the YYYY-NNNNNN id format", () => {
    for (const s of STUDENTS) expect(s.id).toMatch(/^20(2[1-4])-\d{6}$/);
  });
  it("has unique ids", () => {
    expect(new Set(STUDENTS.map((s) => s.id)).size).toBe(312);
  });
  it("spreads across all 12 departments", () => {
    const seen = new Set(STUDENTS.map((s) => s.departmentCode));
    expect([...seen].sort()).toEqual([...DEPARTMENT_CODES].sort());
  });
  it("formats names as 'Last, First'", () => {
    for (const s of STUDENTS) expect(s.name).toMatch(/^[A-Z][a-z]+, [A-Z][a-z]+$/);
  });
  it("is deterministic across imports", async () => {
    const again = (await import("./students")).STUDENTS;
    expect(again[0]).toEqual(STUDENTS[0]);
    expect(again[311]).toEqual(STUDENTS[311]);
  });
});
