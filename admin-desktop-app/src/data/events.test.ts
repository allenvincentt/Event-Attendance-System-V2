import { describe, expect, it } from "vitest";
import { EVENTS, eventById, eventDateTimeRange } from "./events";

describe("events", () => {
  it("has the 7 scheduled events", () => {
    expect(EVENTS).toHaveLength(7);
  });
  it("counts 2 upcoming and 2 completed", () => {
    expect(EVENTS.filter((e) => e.status === "upcoming")).toHaveLength(2);
    expect(EVENTS.filter((e) => e.status === "completed")).toHaveLength(2);
  });
  it("nightly cultural show is a draft evening event for 3 departments", () => {
    const e = eventById("nightly-cultural-show");
    expect(e.status).toBe("draft");
    expect(e.sessions.map((s) => s.session)).toEqual(["evening"]);
    expect(e.departmentCodes.sort()).toEqual(["BED", "CAFAE", "CTE"].sort());
    expect(e.venue).toBe("Open Quadrangle");
  });
  it("derives the displayed time range from sessions", () => {
    expect(eventDateTimeRange(eventById("nightly-cultural-show"))).toEqual({ start: "18:00", end: "21:30" });
  });
});
