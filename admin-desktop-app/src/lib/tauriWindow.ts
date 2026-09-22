export type WindowKind = "signin" | "shell" | "attendees";

export interface WindowProfile {
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  resizable: boolean;
  center?: boolean;
}

export const WINDOW_PROFILES: Record<WindowKind, WindowProfile> = {
  signin: { width: 800, height: 500, resizable: false, center: true },
  shell: {
    width: 1440,
    height: 900,
    minWidth: 1080,
    minHeight: 720,
    resizable: true,
    center: true,
  },
  attendees: {
    width: 940,
    height: 620,
    minWidth: 720,
    minHeight: 480,
    resizable: true,
  },
};

export function isTauri(): boolean {
  return (
    typeof window !== "undefined" &&
    ("__TAURI_INTERNALS__" in window || "__TAURI__" in window)
  );
}

type AnyWindow = any;

async function currentWindow(): Promise<AnyWindow | null> {
  if (!isTauri()) return null;
  try {
    const mod = await import("@tauri-apps/api/window");
    return mod.getCurrentWindow();
  } catch {
    return null;
  }
}

async function dpi() {
  const mod = await import("@tauri-apps/api/dpi");
  return mod;
}

export async function minimizeWindow(): Promise<void> {
  const w = await currentWindow();
  await w?.minimize();
}

export async function maximizeWindow(): Promise<void> {
  const w = await currentWindow();
  await w?.maximize();
}

export async function unmaximizeWindow(): Promise<void> {
  const w = await currentWindow();
  await w?.unmaximize();
}

export async function toggleMaximizeWindow(): Promise<boolean> {
  const w = await currentWindow();
  if (!w) return false;
  await w.toggleMaximize();
  try {
    return await w.isMaximized();
  } catch {
    return false;
  }
}

export async function closeWindow(): Promise<void> {
  const w = await currentWindow();
  if (w) {
    await w.close();
  }
}

export async function isWindowMaximized(): Promise<boolean> {
  const w = await currentWindow();
  if (!w) return false;
  try {
    return await w.isMaximized();
  } catch {
    return false;
  }
}

export async function startDragging(): Promise<void> {
  const w = await currentWindow();
  try {
    await w?.startDragging();
  } catch {
  }
}

export type ResizeDirection =
  | "North"
  | "South"
  | "East"
  | "West"
  | "NorthEast"
  | "NorthWest"
  | "SouthEast"
  | "SouthWest";

export async function startResizeDragging(
  direction: ResizeDirection,
): Promise<void> {
  const w = await currentWindow();
  try {
    await w?.startResizeDragging(direction);
  } catch {
  }
}

export async function onWindowResized(
  handler: () => void,
): Promise<() => void> {
  const w = await currentWindow();
  if (!w) return () => {};
  try {
    const unlisten = await w.onResized(handler);
    return () => {
      void unlisten();
    };
  } catch {
    return () => {};
  }
}

export async function applyWindowProfile(kind: WindowKind): Promise<void> {
  const w = await currentWindow();
  if (!w) return;
  const profile = WINDOW_PROFILES[kind];

  try {
    const { LogicalSize } = await dpi();

    await w.setMinSize(null);
    await w.setMaxSize(null);
    await w.setResizable(true);

    await w.setSize(new LogicalSize(profile.width, profile.height));

    if (profile.minWidth && profile.minHeight) {
      await w.setMinSize(new LogicalSize(profile.minWidth, profile.minHeight));
    } else {
      await w.setMinSize(new LogicalSize(profile.width, profile.height));
      await w.setMaxSize(new LogicalSize(profile.width, profile.height));
    }

    await w.setResizable(profile.resizable);
    if (profile.center) await w.center();
  } catch {
  }
}

export interface AttendeesWindowParams {
  eventId: string;
  departmentId: string;
  session: string;
}

export async function openAttendeesWindow(
  params: AttendeesWindowParams,
  label: string,
  title: string,
): Promise<boolean> {
  if (!isTauri()) return false;
  try {
    const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow");

    const existing = await WebviewWindow.getByLabel(label);
    if (existing) {
      await existing.setFocus();
      return true;
    }

    const profile = WINDOW_PROFILES.attendees;
    const query = new URLSearchParams({
      window: "attendees",
      event: params.eventId,
      dept: params.departmentId,
      session: params.session,
    });

    const win = new WebviewWindow(label, {
      url: `index.html?${query.toString()}`,
      title,
      width: profile.width,
      height: profile.height,
      minWidth: profile.minWidth,
      minHeight: profile.minHeight,
      resizable: true,
      decorations: false,
      transparent: true,
      focus: true,
    } as AnyWindow);

    return await new Promise<boolean>((resolve) => {
      win.once("tauri://created", () => resolve(true));
      win.once("tauri://error", () => resolve(false));

      setTimeout(() => resolve(true), 1200);
    });
  } catch {
    return false;
  }
}

export function readWindowKind(): WindowKind | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("window");
  if (value === "attendees" || value === "signin" || value === "shell") {
    return value;
  }
  return null;
}

export function readWindowParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  return Object.fromEntries(
    new URLSearchParams(window.location.search).entries(),
  );
}
