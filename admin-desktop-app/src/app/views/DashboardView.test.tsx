import { screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { renderWithProviders } from "@/test/renderWithProviders";
import { DashboardView } from "./DashboardView";

test("shows the reference KPI figures for the default event", () => {
  vi.mocked(window.matchMedia).mockImplementation((q: string) => ({
    matches: q.includes("reduce"), media: q, onchange: null,
    addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
  }) as unknown as MediaQueryList);
  renderWithProviders(<DashboardView />);
  expect(screen.getByRole("heading", { name: /attendance overview/i })).toBeInTheDocument();
  expect(screen.getByText("64.5%")).toBeInTheDocument();
  expect(screen.getAllByText("1,101").length).toBeGreaterThan(0);
  expect(screen.getByText(/of 1,707 invited/i)).toBeInTheDocument();
  expect(screen.getByRole("img", { name: /turnout 64%/i })).toBeInTheDocument();
  expect(screen.getByText("College of Architecture and Fine Arts Education")).toBeInTheDocument();
});
