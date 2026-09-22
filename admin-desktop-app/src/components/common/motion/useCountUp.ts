import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export interface CountUpOptions {
  duration?: number;
  delay?: number;
  decimals?: number;
  enabled?: boolean;
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function useCountUp(
  target: number,
  { duration = 900, delay = 0, decimals = 0, enabled = true }: CountUpOptions = {},
): number {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(reduced || !enabled ? target : 0);
  const frame = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduced || !enabled) {
      setValue(target);
      return;
    }

    const factor = Math.pow(10, decimals);
    const start = performance.now() + delay;

    const step = (now: number) => {
      if (now < start) {
        frame.current = requestAnimationFrame(step);
        return;
      }
      const progress = Math.min(1, (now - start) / duration);
      const next = target * easeOutExpo(progress);
      setValue(Math.round(next * factor) / factor);
      if (progress < 1) {
        frame.current = requestAnimationFrame(step);
      }
    };

    frame.current = requestAnimationFrame(step);

    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      if (timer.current !== null) clearTimeout(timer.current);
    };
  }, [target, duration, delay, decimals, enabled, reduced]);

  return value;
}

export default useCountUp;
