import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { Tabs } from "./Tabs";

const tabs = [
  { value: "morning", label: "Morning", disabled: true },
  { value: "afternoon", label: "Afternoon", disabled: true },
  { value: "evening", label: "Evening" },
] as const;

test("does not activate a disabled tab", async () => {
  const onChange = vi.fn();
  render(<Tabs tabs={tabs as never} value="evening" onChange={onChange} />);
  const morning = screen.getByRole("tab", { name: "Morning" });
  expect(morning).toHaveAttribute("aria-disabled", "true");
  await userEvent.click(morning);
  expect(onChange).not.toHaveBeenCalled();
});
