import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { renderWithProviders } from "@/test/renderWithProviders";
import { EventView } from "./EventView";

test("lists events and filters by status", async () => {
  renderWithProviders(<EventView />);
  expect(screen.getByText("Nightly Cultural Show")).toBeInTheDocument();
  expect(screen.getByText(/7 events scheduled/i)).toBeInTheDocument();
  await userEvent.click(screen.getByRole("tab", { name: "Completed" }));
  expect(screen.getByText("Research Colloquium")).toBeInTheDocument();
  expect(screen.queryByText("Nightly Cultural Show")).toBeNull();
});

test("opens the details modal from the View action", async () => {
  renderWithProviders(<EventView />);
  const row = screen.getByText("Nightly Cultural Show").closest("tr")!;
  await userEvent.click(within(row).getByRole("button", { name: /view/i }));
  expect(await screen.findByRole("dialog", { name: /nightly cultural show/i })).toBeInTheDocument();
});
