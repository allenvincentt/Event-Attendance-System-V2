import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { StatusBadge } from "./StatusBadge";
test("prettifies attendance labels", () => {
  render(<StatusBadge kind="attendance" value="no-timeout" />);
  expect(screen.getByText("No time-out")).toBeInTheDocument();
});
test("renders an event status", () => {
  render(<StatusBadge kind="event" value="ongoing" />);
  expect(screen.getByText("Ongoing")).toBeInTheDocument();
});
