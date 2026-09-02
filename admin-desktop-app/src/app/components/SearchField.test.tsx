import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { SearchField } from "./SearchField";

test("debounces change events", async () => {
  vi.useFakeTimers();
  const onChange = vi.fn();
  render(<SearchField value="" onChange={onChange} placeholder="Search" debounceMs={200} />);
  const input = screen.getByPlaceholderText("Search");

  // Simulate typing with fireEvent for compatibility with fake timers
  fireEvent.change(input, { target: { value: "c" } });
  fireEvent.change(input, { target: { value: "ca" } });
  fireEvent.change(input, { target: { value: "caf" } });
  fireEvent.change(input, { target: { value: "cafa" } });
  fireEvent.change(input, { target: { value: "cafae" } });

  expect(onChange).not.toHaveBeenCalled();
  vi.advanceTimersByTime(250);
  expect(onChange).toHaveBeenCalledWith("cafae");
  vi.useRealTimers();
});
