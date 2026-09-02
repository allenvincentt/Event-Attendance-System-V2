import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { WebviewWindow, getAllWebviewWindows } from "@tauri-apps/api/webviewWindow";
import { minimizeWindow, openAttendeesWindow, toggleMaximizeWindow } from "./window";

describe("window wrapper", () => {
  beforeEach(() => vi.clearAllMocks());

  it("delegates minimize / toggle-maximize to the current window", async () => {
    await minimizeWindow();
    await toggleMaximizeWindow();
    const w = getCurrentWindow();
    expect(w.minimize).toHaveBeenCalledOnce();
    expect(w.toggleMaximize).toHaveBeenCalledOnce();
  });

  it("focuses an existing attendees window instead of creating a duplicate", async () => {
    const existing = { label: "attendees-nightly-cultural-show-BED-evening", setFocus: vi.fn().mockResolvedValue(undefined), unminimize: vi.fn().mockResolvedValue(undefined) };
    vi.mocked(getAllWebviewWindows).mockResolvedValueOnce([existing as never]);
    await openAttendeesWindow("nightly-cultural-show", "BED", "evening");
    expect(existing.setFocus).toHaveBeenCalled();
    expect(WebviewWindow).not.toHaveBeenCalled();
  });

  it("creates the attendees window when none exists", async () => {
    vi.mocked(getAllWebviewWindows).mockResolvedValueOnce([]);
    await openAttendeesWindow("nightly-cultural-show", "CTE", "evening");
    expect(WebviewWindow).toHaveBeenCalledWith(
      "attendees-nightly-cultural-show-CTE-evening",
      expect.objectContaining({ width: 960, height: 640 }),
    );
  });
});
