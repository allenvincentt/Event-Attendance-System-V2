import { render, screen, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { MotionPreferenceProvider } from "@/app/theme/MotionPreference";
import { useCountUp } from "./useCountUp";

function Probe({ target }: { target: number }) {
  return <span data-testid="n">{useCountUp(target, { durationMs: 20 })}</span>;
}

test("counts up to the target", async () => {
  render(<MotionPreferenceProvider><Probe target={100} /></MotionPreferenceProvider>);
  await waitFor(() => expect(screen.getByTestId("n")).toHaveTextContent("100"));
});

test("jumps straight to target under reduced motion", () => {
  vi.mocked(window.matchMedia).mockImplementation((q: string) => ({
    matches: q.includes("reduce"), media: q, onchange: null,
    addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
  }) as unknown as MediaQueryList);
  render(<MotionPreferenceProvider><Probe target={42} /></MotionPreferenceProvider>);
  expect(screen.getByTestId("n")).toHaveTextContent("42");
});
