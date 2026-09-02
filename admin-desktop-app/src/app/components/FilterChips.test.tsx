import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { FilterChips } from "./FilterChips";

const opts = [
  { value: "all", label: "All" },
  { value: "ongoing", label: "Ongoing" },
  { value: "upcoming", label: "Upcoming" },
] as const;

test("selects on click", async () => {
  const onChange = vi.fn();
  render(<FilterChips options={opts as never} value="all" onChange={onChange} ariaLabel="Status" />);
  await userEvent.click(screen.getByRole("tab", { name: "Upcoming" }));
  expect(onChange).toHaveBeenCalledWith("upcoming");
});

test("moves selection with the arrow keys", async () => {
  const onChange = vi.fn();
  render(<FilterChips options={opts as never} value="all" onChange={onChange} ariaLabel="Status" />);
  screen.getByRole("tab", { name: "All" }).focus();
  await userEvent.keyboard("{ArrowRight}");
  expect(onChange).toHaveBeenCalledWith("ongoing");
});
