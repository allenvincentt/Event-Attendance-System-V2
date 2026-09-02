import "@testing-library/jest-dom/vitest";
import { vi, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => cleanup());

// jsdom lacks these; components and Recharts need them.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

class IO {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}
// @ts-expect-error test polyfill
window.IntersectionObserver = IO;
// @ts-expect-error test polyfill
window.ResizeObserver = IO;

// Default Tauri mocks — individual tests override with vi.mocked(...).
const fakeWindow = {
  label: "main",
  minimize: vi.fn().mockResolvedValue(undefined),
  unminimize: vi.fn().mockResolvedValue(undefined),
  maximize: vi.fn().mockResolvedValue(undefined),
  unmaximize: vi.fn().mockResolvedValue(undefined),
  toggleMaximize: vi.fn().mockResolvedValue(undefined),
  close: vi.fn().mockResolvedValue(undefined),
  show: vi.fn().mockResolvedValue(undefined),
  setFocus: vi.fn().mockResolvedValue(undefined),
  isMaximized: vi.fn().mockResolvedValue(false),
  startDragging: vi.fn().mockResolvedValue(undefined),
  startResizeDragging: vi.fn().mockResolvedValue(undefined),
  onResized: vi.fn().mockResolvedValue(() => {}),
  onFocusChanged: vi.fn().mockResolvedValue(() => {}),
  onMoved: vi.fn().mockResolvedValue(() => {}),
};

vi.mock("@tauri-apps/api/window", () => ({
  getCurrentWindow: () => fakeWindow,
  Window: vi.fn(() => fakeWindow),
  currentMonitor: vi.fn().mockResolvedValue({ size: { width: 1920, height: 1080 }, position: { x: 0, y: 0 }, scaleFactor: 1 }),
}));

vi.mock("@tauri-apps/api/webviewWindow", () => ({
  WebviewWindow: vi.fn().mockImplementation((label: string) => ({ ...fakeWindow, label, once: vi.fn(), emit: vi.fn() })),
  getAllWebviewWindows: vi.fn().mockResolvedValue([]),
  getCurrentWebviewWindow: () => fakeWindow,
}));

vi.mock("@tauri-apps/api/event", () => ({
  listen: vi.fn().mockResolvedValue(() => {}),
  emit: vi.fn().mockResolvedValue(undefined),
}));
