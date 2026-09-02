import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { TopBar } from "./TopBar";

test("refreshes and opens the user menu", async () => {
  const onRefresh = vi.fn();
  const onSignOut = vi.fn();
  render(<TopBar onRefresh={onRefresh} onSignOut={onSignOut} userName="Administrator" userRole="Events Office" />);
  await userEvent.click(screen.getByRole("button", { name: /refresh/i }));
  expect(onRefresh).toHaveBeenCalledOnce();
  await userEvent.click(screen.getByRole("button", { name: /account menu/i }));
  await userEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));
  expect(onSignOut).toHaveBeenCalledOnce();
});
