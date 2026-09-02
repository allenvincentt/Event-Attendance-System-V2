import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { MotionPreferenceProvider } from "@/app/theme/MotionPreference";
import { MockDataProvider } from "@/data/MockDataProvider";
import { ToastProvider } from "@/app/components/Toast";

function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionPreferenceProvider>
      <MockDataProvider>
        <ToastProvider>{children}</ToastProvider>
      </MockDataProvider>
    </MotionPreferenceProvider>
  );
}

export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: Providers, ...options });
}
