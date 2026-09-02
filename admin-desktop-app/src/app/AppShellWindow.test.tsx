import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { renderWithProviders } from "@/test/renderWithProviders";
import { AppShellWindow } from "./AppShellWindow";

test.skip("switches views from the sidebar", async () => {
  renderWithProviders(<AppShellWindow />);
  expect(screen.getByRole("heading", { name: /attendance overview/i })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("link", { name: /student management/i }));
  expect(await screen.findByRole("heading", { name: /student management/i })).toBeInTheDocument();
});
