import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { Checkbox } from "./Checkbox";

test("reports mixed state and toggles with space", async () => {
  const onChange = vi.fn();
  const { rerender } = render(<Checkbox checked={false} indeterminate onChange={onChange} label="Select all" />);
  const cb = screen.getByRole("checkbox", { name: "Select all" });
  expect(cb).toHaveAttribute("aria-checked", "mixed");
  cb.focus();
  await userEvent.keyboard(" ");
  expect(onChange).toHaveBeenCalledWith(true);
  rerender(<Checkbox checked onChange={onChange} label="Select all" />);
  expect(screen.getByRole("checkbox", { name: "Select all" })).toHaveAttribute("aria-checked", "true");
});
