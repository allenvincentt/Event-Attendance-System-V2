import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { Sidebar } from "./Sidebar";

const base = { view: "dashboard" as const, onNavigate: vi.fn(), collapsed: false, onToggleCollapsed: vi.fn(), onSignOut: vi.fn() };

test("marks the active view and navigates on click", async () => {
  const onNavigate = vi.fn();
  render(<Sidebar {...base} onNavigate={onNavigate} />);
  expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute("aria-current", "page");
  await userEvent.click(screen.getByRole("link", { name: /student management/i }));
  expect(onNavigate).toHaveBeenCalledWith("students");
});

test("toggles collapse and signs out", async () => {
  const onToggleCollapsed = vi.fn();
  const onSignOut = vi.fn();
  render(<Sidebar {...base} onToggleCollapsed={onToggleCollapsed} onSignOut={onSignOut} />);
  await userEvent.click(screen.getByRole("button", { name: /collapse menu/i }));
  await userEvent.click(screen.getByRole("button", { name: /sign out/i }));
  expect(onToggleCollapsed).toHaveBeenCalledOnce();
  expect(onSignOut).toHaveBeenCalledOnce();
});

test("keeps accessible names when collapsed", () => {
  render(<Sidebar {...base} collapsed />);
  expect(screen.getByRole("link", { name: /event/i })).toBeInTheDocument();
});
