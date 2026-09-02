import { renderHook } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { MotionPreferenceProvider } from "@/app/theme/MotionPreference";
import { useWindowChoreography } from "./windowAnimations";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MotionPreferenceProvider>{children}</MotionPreferenceProvider>
);

describe("useWindowChoreography", () => {
  it("eventually calls the OS minimize", async () => {
    vi.clearAllMocks();
    const { result } = renderHook(() => useWindowChoreography(), { wrapper });
    await act(async () => { await result.current.beginMinimize(); });
    expect(getCurrentWindow().minimize).toHaveBeenCalled();
  });
  it("toggles OS maximize", async () => {
    vi.clearAllMocks();
    const { result } = renderHook(() => useWindowChoreography(), { wrapper });
    await act(async () => { await result.current.toggleMaximize(); });
    expect(getCurrentWindow().toggleMaximize).toHaveBeenCalled();
  });
});
