import { useCallback, useEffect, useState } from "react";
import type { MotionProps } from "framer-motion";
import { usePrefersReducedMotion } from "@/app/theme/MotionPreference";
import { tokens } from "@/app/theme/tokens";
import {
  isWindowMaximized, minimizeWindow, onWindowFocusChanged, onWindowResized,
  toggleMaximizeWindow,
} from "@/app/lib/window";

export function useWindowChoreography(): {
  contentProps: MotionProps;
  isMaximized: boolean;
  beginMinimize: () => Promise<void>;
  toggleMaximize: () => Promise<void>;
} {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<"idle" | "minimizing" | "settling">("idle");
  const [isMax, setIsMax] = useState(false);

  useEffect(() => {
    let un1: (() => void) | undefined;
    let un2: (() => void) | undefined;
    isWindowMaximized().then(setIsMax).catch(() => {});
    onWindowResized(() => {
      isWindowMaximized().then(setIsMax).catch(() => {});
      if (!reduced) { setPhase("settling"); setTimeout(() => setPhase("idle"), tokens.motion.durMs.fast); }
    }).then((u) => (un1 = u));
    onWindowFocusChanged((focused) => {
      if (focused) setPhase("idle");
    }).then((u) => (un2 = u));
    return () => { un1?.(); un2?.(); };
  }, [reduced]);

  const beginMinimize = useCallback(async () => {
    if (reduced) { await minimizeWindow(); return; }
    setPhase("minimizing");
    await new Promise((r) => setTimeout(r, tokens.motion.durMs.window));
    await minimizeWindow();
    setPhase("idle");
  }, [reduced]);

  const toggleMaximize = useCallback(async () => {
    await toggleMaximizeWindow();
  }, []);

  const animate =
    phase === "minimizing"
      ? { opacity: 0, scale: 0.92, y: 8 }
      : phase === "settling"
        ? { opacity: [0.85, 1], scale: [0.99, 1], y: 0 }
        : { opacity: 1, scale: 1, y: 0 };

  const contentProps: MotionProps = reduced
    ? {}
    : {
        style: { transformOrigin: "bottom center", height: "100%" },
        animate,
        transition: { duration: tokens.motion.dur.window, ease: tokens.motion.ease.decel },
      };

  return { contentProps, isMaximized: isMax, beginMinimize, toggleMaximize };
}
