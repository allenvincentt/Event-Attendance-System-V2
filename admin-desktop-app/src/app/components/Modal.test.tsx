import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { Modal } from "./Modal";

test("is not in the DOM when closed", () => {
  render(<Modal open={false} onClose={() => {}} title="X"><p>body</p></Modal>);
  expect(screen.queryByRole("dialog")).toBeNull();
});

test("renders with dialog semantics and traps initial focus", () => {
  render(<Modal open onClose={() => {}} title="Edit event"><p>body</p></Modal>);
  const dialog = screen.getByRole("dialog", { name: "Edit event" });
  expect(dialog).toHaveAttribute("aria-modal", "true");
});

test("closes on Escape and on backdrop click", async () => {
  const onClose = vi.fn();
  render(<Modal open onClose={onClose} title="X"><p>body</p></Modal>);
  await userEvent.keyboard("{Escape}");
  expect(onClose).toHaveBeenCalledTimes(1);
  await userEvent.click(screen.getByTestId("modal-backdrop"));
  expect(onClose).toHaveBeenCalledTimes(2);
});

test("does not close on backdrop when disabled", async () => {
  const onClose = vi.fn();
  render(<Modal open onClose={onClose} dismissOnBackdrop={false} title="X"><p>body</p></Modal>);
  await userEvent.click(screen.getByTestId("modal-backdrop"));
  expect(onClose).not.toHaveBeenCalled();
});
