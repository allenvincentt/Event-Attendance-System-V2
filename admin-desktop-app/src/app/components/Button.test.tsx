import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { Button } from "./Button";

test("fires onClick when enabled", async () => {
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Save</Button>);
  await userEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(onClick).toHaveBeenCalledOnce();
});

test("does not fire when disabled", async () => {
  const onClick = vi.fn();
  render(<Button disabled onClick={onClick}>Save</Button>);
  await userEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(onClick).not.toHaveBeenCalled();
});

test("shows a busy state while loading and blocks clicks", async () => {
  const onClick = vi.fn();
  render(<Button loading onClick={onClick}>Create event</Button>);
  const btn = screen.getByRole("button", { name: /create event/i });
  expect(btn).toHaveAttribute("aria-busy", "true");
  await userEvent.click(btn);
  expect(onClick).not.toHaveBeenCalled();
});
