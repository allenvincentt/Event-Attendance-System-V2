import { describe, expect, it } from "vitest";
import { hashString, mulberry32, randInt } from "./rng";

describe("rng", () => {
  it("is deterministic for a given seed", () => {
    const a = mulberry32(42); const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
  it("produces values in [0,1)", () => {
    const r = mulberry32(1);
    for (let i = 0; i < 1000; i++) { const v = r(); expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThan(1); }
  });
  it("hashString is stable and numeric", () => {
    expect(hashString("BED")).toBe(hashString("BED"));
    expect(typeof hashString("x")).toBe("number");
  });
  it("randInt is inclusive and bounded", () => {
    const r = mulberry32(7);
    for (let i = 0; i < 500; i++) { const v = randInt(r, 3, 5); expect([3, 4, 5]).toContain(v); }
  });
});
