import { describe, expect, it } from "vitest";
import { tokens } from "./tokens";

describe("tokens", () => {
  it("exposes the locked brand colors", () => {
    expect(tokens.color.brand.primary).toBe("#B20A07");
    expect(tokens.color.brand.gold).toBe("#F5CF28");
  });
  it("builds the 106deg / 37% / 100% signature gradient", () => {
    expect(tokens.gradient("#000", "#fff")).toBe("linear-gradient(106deg, #000 37%, #fff 100%)");
  });
  it("has the dashboard-dense spacing scale", () => {
    expect(tokens.space["2xs"]).toBe(4);
    expect(tokens.space["4xl"]).toBe(48);
  });
  it("provides all five status families with base + soft", () => {
    for (const k of ["success", "warning", "danger", "info", "neutral"] as const) {
      expect(tokens.color.status[k].base).toMatch(/^#|rgb/);
      expect(tokens.color.status[k].soft).toMatch(/^#|rgb/);
    }
  });
  it("keeps duration seconds and ms in sync", () => {
    expect(tokens.motion.durMs.base).toBe(Math.round(tokens.motion.dur.base * 1000));
  });
});
