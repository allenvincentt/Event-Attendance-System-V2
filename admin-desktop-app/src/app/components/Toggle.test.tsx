import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { Toggle } from "./Toggle";

test("toggles on click and keyboard", async () => {
  const onChange = vi.fn();
  render(<Toggle checked={false} onChange={onChange} label="Morning session" />);
  const sw = screen.getByRole("switch", { name: "Morning session" });
  expect(sw).toHaveAttribute("aria-checked", "false");
  await userEvent.click(sw);
  expect(onChange).toHaveBeenCalledWith(true);
  sw.focus();
  await userEvent.keyboard(" ");
  expect(onChange).toHaveBeenCalledTimes(2);
});
