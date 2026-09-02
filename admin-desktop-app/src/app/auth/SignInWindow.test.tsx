import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import * as win from "@/app/lib/window";
import { renderWithProviders } from "@/test/renderWithProviders";
import { SignInWindow } from "./SignInWindow";

test("rejects an empty submit with an inline error", async () => {
  renderWithProviders(<SignInWindow />);
  await userEvent.click(screen.getByRole("button", { name: /log-in/i }));
  expect(await screen.findByText(/enter your username and password/i)).toBeInTheDocument();
});

test("opens the main window on a valid submit", async () => {
  const openMain = vi.spyOn(win, "openMainWindow").mockResolvedValue();
  const close = vi.spyOn(win, "closeWindow").mockResolvedValue();
  renderWithProviders(<SignInWindow />);
  await userEvent.type(screen.getByLabelText("Username"), "admin");
  await userEvent.type(screen.getByLabelText("Password"), "admin");
  await userEvent.click(screen.getByRole("button", { name: /log-in/i }));
  await waitFor(() => expect(openMain).toHaveBeenCalled());
  expect(close).toHaveBeenCalled();
});
