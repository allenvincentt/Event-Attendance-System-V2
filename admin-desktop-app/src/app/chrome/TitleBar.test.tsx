import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { TitleBar } from "./TitleBar";

test("marks the bar as a drag region and shows the title + controls", () => {
  const { container } = render(<TitleBar title="Event Attendance System" right={<span>chip</span>} />);
  expect(container.querySelector("[data-tauri-drag-region]")).toBeTruthy();
  expect(screen.getByText("Event Attendance System")).toBeInTheDocument();
  expect(screen.getByText("chip")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
});
