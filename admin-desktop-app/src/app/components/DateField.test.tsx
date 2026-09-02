import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { DateField } from "./DateField";

test("shows the long date and opens a calendar", async () => {
  render(<DateField label="Date" value="2026-09-02" onChange={vi.fn()} />);
  expect(screen.getByRole("button", { name: /wednesday, september 2, 2026/i })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: /september/i }));
  expect(screen.getByRole("dialog", { name: /choose a date/i })).toBeInTheDocument();
});
