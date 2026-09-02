import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { Select } from "./Select";

const options = [
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "draft", label: "Draft" },
] as const;

test("opens, selects, and closes", async () => {
  const onChange = vi.fn();
  render(<Select options={options as never} value="upcoming" onChange={onChange} ariaLabel="Status" />);
  const trigger = screen.getByRole("button", { name: /status/i });
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  await userEvent.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  await userEvent.click(screen.getByRole("option", { name: "Draft" }));
  expect(onChange).toHaveBeenCalledWith("draft");
  expect(trigger).toHaveAttribute("aria-expanded", "false");
});
