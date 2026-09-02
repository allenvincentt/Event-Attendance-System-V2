import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { DepartmentLogo } from "./DepartmentLogo";
test("uses the department name as alt text", () => {
  render(<DepartmentLogo code="CTE" />);
  expect(screen.getByAltText("College of Teacher Education")).toBeInTheDocument();
});
