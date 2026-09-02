import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { WindowControls } from "./WindowControls";

test("renders three labelled controls", () => {
  render(<WindowControls />);
  expect(screen.getByRole("button", { name: /minimize/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /maximize/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
});

test("hides the maximize control when disallowed", () => {
  render(<WindowControls showMaximize={false} />);
  expect(screen.queryByRole("button", { name: /maximize/i })).toBeNull();
});

test("shows Restore when maximized and fires handlers", async () => {
  const onToggleMaximize = vi.fn();
  const onClose = vi.fn();
  render(<WindowControls isMaximized onToggleMaximize={onToggleMaximize} onClose={onClose} />);
  await userEvent.click(screen.getByRole("button", { name: /restore/i }));
  await userEvent.click(screen.getByRole("button", { name: /close/i }));
  expect(onToggleMaximize).toHaveBeenCalledOnce();
  expect(onClose).toHaveBeenCalledOnce();
});
