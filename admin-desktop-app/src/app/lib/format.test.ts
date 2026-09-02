import { describe, expect, it } from "vitest";
import * as f from "./format";

describe("format", () => {
  it("formats numbers with thousands separators", () => {
    expect(f.formatNumber(1707)).toBe("1,707");
  });
  it("formats percentages", () => {
    expect(f.formatPercent(0.645)).toBe("64.5%");
    expect(f.formatPercent(0.71, 0)).toBe("71%");
  });
  it("formats a clock time", () => {
    expect(f.formatTime(new Date(2026, 7, 20, 18, 6))).toBe("6:06 PM");
  });
  it("formats a duration", () => {
    expect(f.formatDuration(197)).toBe("3h 17m");
    expect(f.formatDuration(40)).toBe("40m");
  });
  it("formats dates", () => {
    const d = new Date(2026, 7, 20);
    expect(f.formatDateShort(d)).toBe("Aug 20, 2026");
    expect(f.formatWeekday(d)).toBe("Thursday");
    expect(f.formatDateLong(d)).toBe("Thursday, August 20, 2026");
  });
  it("derives initials from 'Last, First'", () => {
    expect(f.initials("Abad, Rhea")).toBe("AR");
  });
});
