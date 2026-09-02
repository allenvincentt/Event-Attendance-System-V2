import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Avatar } from "./Avatar";
test("renders initials from a 'Last, First' name", () => {
  render(<Avatar name="Abad, Rhea" />);
  expect(screen.getByText("AR")).toBeInTheDocument();
});
