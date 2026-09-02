import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { renderWithProviders } from "@/test/renderWithProviders";
import { EventCreateDeleteModal } from "./EventCreateDeleteModal";

test("blocks step 1 until required fields are filled", async () => {
  renderWithProviders(<EventCreateDeleteModal open mode="create" onClose={() => {}} />);
  expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  await userEvent.type(screen.getByLabelText("Name of event"), "Test Night");
  await userEvent.type(screen.getByLabelText("Venue"), "Quad");
  // morning session is on by default → Next enabled
  expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
});

test("walks all three steps and creates the event", async () => {
  renderWithProviders(<EventCreateDeleteModal open mode="create" onClose={() => {}} />);
  await userEvent.type(screen.getByLabelText("Name of event"), "Test Night");
  await userEvent.type(screen.getByLabelText("Venue"), "Quad");
  await userEvent.click(screen.getByRole("button", { name: "Next" }));
  await userEvent.click(await screen.findByRole("checkbox", { name: /^CAE$/i }));
  await userEvent.click(screen.getByRole("button", { name: "Next" }));
  expect(await screen.findByText(/1 department/i)).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Create event" }));
  expect(await screen.findByText(/event created/i)).toBeInTheDocument();
});
