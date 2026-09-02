import { describe, expect, it } from "vitest";
import { DEPARTMENTS, departmentByCode } from "./departments";

describe("departments", () => {
  it("has exactly the 12 university departments", () => {
    expect(DEPARTMENTS).toHaveLength(12);
    expect(DEPARTMENTS.map((d) => d.code).sort()).toEqual(
      ["BED", "CAE", "CAFAE", "CASE", "CCE", "CCJE", "CEE", "CHE", "CHSE", "CTE", "PS", "TS"].sort(),
    );
  });
  it("looks a department up by code", () => {
    expect(departmentByCode("CTE").name).toBe("College of Teacher Education");
  });
  it("throws on an unknown code", () => {
    expect(() => departmentByCode("ZZZ")).toThrow();
  });
});
