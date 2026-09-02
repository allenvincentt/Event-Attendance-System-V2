import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { IconButton } from "./IconButton";

test("exposes its label as the accessible name", async () => {
  const onClick = vi.fn();
  render(<IconButton label="Refresh dashboard" icon="refresh" onClick={onClick} />);
  const btn = screen.getByRole("button", { name: "Refresh dashboard" });
  await userEvent.click(btn);
  expect(onClick).toHaveBeenCalledOnce();
});
