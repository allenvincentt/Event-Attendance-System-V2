import { getCurrentWindow } from "@tauri-apps/api/window";
import { WebviewWindow, getAllWebviewWindows } from "@tauri-apps/api/webviewWindow";
import type { Session } from "@/data/types";

export type ResizeDir =
  | "North" | "South" | "East" | "West"
  | "NorthEast" | "NorthWest" | "SouthEast" | "SouthWest";

const cur = () => getCurrentWindow();

export const getWindowLabel = () => cur().label;

export function parseWindowContext(): {
  kind: "signin" | "main" | "attendees";
  eventId?: string;
  deptCode?: string;
  session?: Session;
} {
  const label = (() => { try { return getWindowLabel(); } catch { return "main"; } })();
  const q = new URLSearchParams(typeof location !== "undefined" ? location.search : "");
  const w = q.get("w") ?? label;
  if (w === "signin") return { kind: "signin" };
  if (w.startsWith("attendees")) {
    return {
      kind: "attendees",
      eventId: q.get("event") ?? undefined,
      deptCode: q.get("dept") ?? undefined,
      session: (q.get("session") as Session) ?? undefined,
    };
  }
  return { kind: "main" };
}
export const minimizeWindow = () => cur().minimize();
export const toggleMaximizeWindow = () => cur().toggleMaximize();
export const closeWindow = () => cur().close();
export const isWindowMaximized = () => cur().isMaximized();
export const startWindowDrag = () => cur().startDragging();
export const startWindowResize = (dir: ResizeDir) =>
  cur().startResizeDragging(dir as never);

export const onWindowResized = (cb: () => void) => cur().onResized(() => cb());
export const onWindowFocusChanged = (cb: (f: boolean) => void) =>
  cur().onFocusChanged(({ payload }) => cb(payload));

const APP_URL = "index.html";

export async function openMainWindow() {
  const w = new WebviewWindow("main", {
    url: APP_URL, width: 1240, height: 820, minWidth: 1080, minHeight: 720,
    resizable: true, maximizable: true, decorations: false, center: true, title: "Event Attendance System",
  });
  await w.once("tauri://error", (e) => console.error("main window error", e));
}

export async function openSignInWindow() {
  const w = new WebviewWindow("signin", {
    url: APP_URL, width: 800, height: 500, resizable: false, maximizable: false,
    decorations: false, center: true, title: "Sign in",
  });
  await w.once("tauri://error", (e) => console.error("signin window error", e));
}

export async function openAttendeesWindow(eventId: string, deptCode: string, session: Session) {
  const label = `attendees-${eventId}-${deptCode}-${session}`;
  const all = await getAllWebviewWindows();
  const existing = all.find((w) => w.label === label);
  if (existing) {
    await existing.unminimize?.();
    await existing.setFocus();
    return;
  }
  const w = new WebviewWindow(label, {
    url: `${APP_URL}?w=attendees&event=${encodeURIComponent(eventId)}&dept=${encodeURIComponent(deptCode)}&session=${session}`,
    width: 960, height: 640, minWidth: 720, minHeight: 480,
    resizable: true, decorations: false, center: true, title: "Attendees",
  });
  await w.once("tauri://error", (e) => console.error("attendees window error", e));
}
