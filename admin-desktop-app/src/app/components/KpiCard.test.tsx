import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { MotionPreferenceProvider } from "@/app/theme/MotionPreference";
import { KpiCard } from "./KpiCard";
import { formatPercent } from "@/app/lib/format";

test("shows the final value under reduced motion", () => {
  vi.mocked(window.matchMedia).mockImplementation((q: string) => ({
    matches: q.includes("reduce"), media: q, onchange: null,
    addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
  }) as unknown as MediaQueryList);
  render(
    <MotionPreferenceProvider>
      <KpiCard label="Attendance rate" value={0.645} format={(n) => formatPercent(n)} footnote="Draft · Evening" />
    </MotionPreferenceProvider>,
  );
  expect(screen.getByText("Attendance rate")).toBeInTheDocument();
  expect(screen.getByText("64.5%")).toBeInTheDocument();
  expect(screen.getByText("Draft · Evening")).toBeInTheDocument();
});
