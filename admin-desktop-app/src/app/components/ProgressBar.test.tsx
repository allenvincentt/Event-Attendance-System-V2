import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { ProgressBar } from "./ProgressBar";
test("exposes progressbar semantics", () => {
  render(<ProgressBar value={0.63} label="BED turnout" />);
  const bar = screen.getByRole("progressbar", { name: "BED turnout" });
  expect(bar).toHaveAttribute("aria-valuenow", "63");
  expect(bar).toHaveAttribute("aria-valuemax", "100");
});
