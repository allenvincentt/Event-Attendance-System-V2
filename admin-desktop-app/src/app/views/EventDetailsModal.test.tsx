import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import * as win from "@/app/lib/window";
import { renderWithProviders } from "@/test/renderWithProviders";
import { eventById } from "@/data/events";
import { EventDetailsModal } from "./EventDetailsModal";

test("shows the summary and disables unscheduled sessions", () => {
  renderWithProviders(<EventDetailsModal event={eventById("nightly-cultural-show")} open onClose={() => {}} onEdit={() => {}} />);
  expect(screen.getByRole("dialog", { name: /nightly cultural show/i })).toBeInTheDocument();
  expect(screen.getAllByText(/1,707/).length).toBeGreaterThan(0);
  expect(screen.getByRole("tab", { name: "Morning" })).toHaveAttribute("aria-disabled", "true");
  expect(screen.getByText(/1,101 of 1,707 students timed in \(64\.5%\)/i)).toBeInTheDocument();
});

test("opens an attendees window per department", async () => {
  const open = vi.spyOn(win, "openAttendeesWindow").mockResolvedValue();
  renderWithProviders(<EventDetailsModal event={eventById("nightly-cultural-show")} open onClose={() => {}} onEdit={() => {}} />);
  const row = screen.getByText("Basic Education Department").closest("li, tr")!;
  await userEvent.click(within(row as HTMLElement).getByRole("button", { name: /view attendees/i }));
  expect(open).toHaveBeenCalledWith("nightly-cultural-show", "BED", "evening");
});
