import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  closeWindow,
  isWindowMaximized,
  minimizeWindow,
  onWindowResized,
  startResizeDragging,
  toggleMaximizeWindow,
  type ResizeDirection,
} from "../../lib/tauriWindow";
import { registerStyle, cx } from "../../lib/registerStyle";

registerStyle(
  "window-frame",
  `
.ud-frame {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: var(--bg);
  border-radius: 10px;
  border: 1px solid rgba(22, 26, 34, 0.14);
  box-shadow: 0 18px 48px rgba(22, 26, 34, 0.24);
  transform-origin: center;
  transition:
    border-radius var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out),
    border-color var(--dur-base) var(--ease-out);
}

.ud-frame[data-maximized="true"] {
  border-radius: 0;
  border-color: transparent;
  box-shadow: none;
}

.ud-frame[data-phase="maximizing"],
.ud-frame[data-phase="restoring-size"] {
  animation: ud-win-settle 280ms var(--ease-out);
}

.ud-frame[data-phase="minimizing"] {
  animation: ud-win-minimize 170ms var(--ease-in) forwards;
}

.ud-frame[data-phase="reopening"] {
  animation: ud-win-reopen 300ms var(--ease-back);
}

@keyframes ud-win-settle {
  from {
    transform: scale(0.988);
    opacity: 0.82;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes ud-win-minimize {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.9);
    opacity: 0;
  }
}

@keyframes ud-win-reopen {
  from {
    transform: scale(0.94);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.ud-frame--fixed {
  border-radius: 12px;
}

.ud-frame__drag {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  z-index: 1;
}

.ud-frame__grip {
  position: absolute;
  z-index: 40;
  -webkit-app-region: no-drag;
  app-region: no-drag;
}

.ud-frame[data-maximized="true"] .ud-frame__grip {
  display: none;
}

.ud-frame__grip[data-dir="North"] { top: 0; left: 8px; right: 8px; height: 5px; cursor: ns-resize; }
.ud-frame__grip[data-dir="South"] { bottom: 0; left: 8px; right: 8px; height: 5px; cursor: ns-resize; }
.ud-frame__grip[data-dir="West"] { left: 0; top: 8px; bottom: 8px; width: 5px; cursor: ew-resize; }
.ud-frame__grip[data-dir="East"] { right: 0; top: 8px; bottom: 8px; width: 5px; cursor: ew-resize; }
.ud-frame__grip[data-dir="NorthWest"] { top: 0; left: 0; width: 10px; height: 10px; cursor: nwse-resize; }
.ud-frame__grip[data-dir="NorthEast"] { top: 0; right: 0; width: 10px; height: 10px; cursor: nesw-resize; }
.ud-frame__grip[data-dir="SouthWest"] { bottom: 0; left: 0; width: 10px; height: 10px; cursor: nesw-resize; }
.ud-frame__grip[data-dir="SouthEast"] { bottom: 0; right: 0; width: 10px; height: 10px; cursor: nwse-resize; }
`,
);

const RESIZE_DIRECTIONS: ResizeDirection[] = [
  "North",
  "South",
  "East",
  "West",
  "NorthWest",
  "NorthEast",
  "SouthWest",
  "SouthEast",
];

type Phase =
  | "idle"
  | "minimizing"
  | "reopening"
  | "maximizing"
  | "restoring-size";

export interface WindowChromeValue {
  maximized: boolean;
  resizing: boolean;
  minimize: () => void;
  toggleMaximize: () => void;
  close: () => void;
}

const WindowChromeContext = createContext<WindowChromeValue | null>(null);

export function useWindowChrome(): WindowChromeValue {
  const value = useContext(WindowChromeContext);
  if (!value) {
    throw new Error("useWindowChrome must be used inside a WindowFrame");
  }
  return value;
}

export interface WindowFrameProps {
  children: ReactNode;
  resizable?: boolean;
  className?: string;
}

export function WindowFrame({
  children,
  resizable = true,
  className = "",
}: WindowFrameProps) {
  const [maximized, setMaximized] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [resizing, setResizing] = useState(false);
  const minimizedRef = useRef(false);
  const resizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alive = true;
    void isWindowMaximized().then((value) => {
      if (alive) setMaximized(value);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let dispose = () => {};
    void onWindowResized(() => {
      setResizing(true);
      document.documentElement.classList.add("ud-resizing");
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(() => {
        setResizing(false);
        document.documentElement.classList.remove("ud-resizing");
        void isWindowMaximized().then(setMaximized);
      }, 140);
    }).then((fn) => {
      dispose = fn;
    });

    return () => {
      dispose();
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
      document.documentElement.classList.remove("ud-resizing");
    };
  }, []);

  useEffect(() => {
    const onFocus = () => {
      if (!minimizedRef.current) return;
      minimizedRef.current = false;
      setPhase("reopening");
      setTimeout(() => setPhase("idle"), 320);
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const minimize = useCallback(() => {
    setPhase("minimizing");
    minimizedRef.current = true;
    setTimeout(() => {
      void minimizeWindow();
      setPhase("idle");
    }, 165);
  }, []);

  const toggleMaximize = useCallback(() => {
    if (!resizable) return;
    void toggleMaximizeWindow().then((next) => {
      setMaximized(next);
      setPhase(next ? "maximizing" : "restoring-size");
      setTimeout(() => setPhase("idle"), 300);
    });
  }, [resizable]);

  const close = useCallback(() => {
    void closeWindow();
  }, []);

  const value: WindowChromeValue = {
    maximized,
    resizing,
    minimize,
    toggleMaximize,
    close,
  };

  return (
    <WindowChromeContext.Provider value={value}>
      <div
        className={cx("ud-frame", !resizable && "ud-frame--fixed", className)}
        data-maximized={maximized}
        data-phase={phase}
      >
        {resizable ? (
          <>
            <div
              className="ud-frame__drag"
              data-tauri-drag-region
              onDoubleClick={toggleMaximize}
            />
            {RESIZE_DIRECTIONS.map((direction) => (
              <div
                key={direction}
                className="ud-frame__grip"
                data-dir={direction}
                onPointerDown={(pointer) => {
                  if (pointer.button !== 0 || maximized) return;
                  pointer.preventDefault();
                  void startResizeDragging(direction);
                }}
              />
            ))}
          </>
        ) : null}
        {children}
      </div>
    </WindowChromeContext.Provider>
  );
}

export default WindowFrame;
