import { describe, expect, it } from "vitest";
import { getAttendees, getDepartmentAttendance } from "./attendance";

describe("attendance", () => {
  it("reproduces the canonical nightly-cultural-show figures", () => {
    const rows = getDepartmentAttendance("nightly-cultural-show", "evening");
    const by = Object.fromEntries(rows.map((r) => [r.departmentCode, r]));
    expect(by.BED).toMatchObject({ invited: 742, attended: 467 });
    expect(by.CTE).toMatchObject({ invited: 509, attended: 310 });
    expect(by.CAFAE).toMatchObject({ invited: 456, attended: 324 });
    expect(rows.reduce((n, r) => n + r.invited, 0)).toBe(1707);
    expect(rows.reduce((n, r) => n + r.attended, 0)).toBe(1101);
  });
  it("generates a deterministic attendee list matching the invited/attended counts", () => {
    const a = getAttendees("nightly-cultural-show", "evening", "BED");
    const b = getAttendees("nightly-cultural-show", "evening", "BED");
    expect(a).toEqual(b);
    expect(a).toHaveLength(742);
    expect(a.filter((r) => r.timeIn !== null)).toHaveLength(467);
    expect(a.filter((r) => r.status === "absent").every((r) => r.timeIn === null && r.timeOut === null)).toBe(true);
    expect(a.filter((r) => r.status === "present").every((r) => r.timeIn && r.timeOut)).toBe(true);
    expect(a.filter((r) => r.status === "no-timeout").every((r) => r.timeIn && !r.timeOut)).toBe(true);
  });
});
