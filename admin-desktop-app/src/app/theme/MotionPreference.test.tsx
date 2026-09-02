import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { MotionPreferenceProvider, usePrefersReducedMotion } from "./MotionPreference";

function Probe() {
  return <span data-testid="v">{String(usePrefersReducedMotion())}</span>;
}

test("defaults to false when the media query does not match", () => {
  render(<MotionPreferenceProvider><Probe /></MotionPreferenceProvider>);
  expect(screen.getByTestId("v")).toHaveTextContent("false");
});

test("reflects a reduce-motion preference", () => {
  vi.mocked(window.matchMedia).mockImplementation((q: string) => ({
    matches: q.includes("reduce"), media: q, onchange: null,
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
  }) as unknown as MediaQueryList);
  render(<MotionPreferenceProvider><Probe /></MotionPreferenceProvider>);
  expect(screen.getByTestId("v")).toHaveTextContent("true");
});
