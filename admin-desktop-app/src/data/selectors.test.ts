import { describe, expect, it } from "vitest";
import { getDashboardData } from "./selectors";

describe("getDashboardData for nightly-cultural-show", () => {
  const d = getDashboardData("nightly-cultural-show");
  it("matches the KPI figures", () => {
    expect(d.studentsInvited).toBe(1707);
    expect(d.studentsPresent).toBe(1101);
    expect(d.didNotAttend).toBe(606);
    expect(Number(d.attendanceRate.toFixed(3))).toBe(0.645);
    expect(d.departmentsParticipating).toBe(3);
    expect(d.departmentsTotal).toBe(12);
    expect(d.eventsThisTerm).toBe(7);
    expect(d.eventsUpcoming).toBe(2);
    expect(d.eventsCompleted).toBe(2);
  });
  it("ranks departments highest turnout first", () => {
    expect(d.ranking.map((r) => r.departmentCode)).toEqual(["CAFAE", "BED", "CTE"]);
    expect(d.ranking.map((r) => Math.round(r.rate * 100))).toEqual([71, 63, 61]);
  });
  it("reports the evening session split and empty morning/afternoon", () => {
    const bySession = Object.fromEntries(d.sessionSplit.map((s) => [s.session, s]));
    expect(bySession.evening.scheduled).toBe(true);
    expect(Math.round(bySession.evening.rate * 100)).toBe(64); // 1101/1707 = 64.5%, rounds to 64
    expect(bySession.morning.scheduled).toBe(false);
  });
  it("produces the 3-point recent-events trend", () => {
    expect(d.trend.map((t) => t.label)).toEqual(["Jul 18", "Jul 24", "Jul 30"]);
    expect(d.trend.map((t) => Math.round(t.rate * 100))).toEqual([62, 48, 73]);
  });
});
