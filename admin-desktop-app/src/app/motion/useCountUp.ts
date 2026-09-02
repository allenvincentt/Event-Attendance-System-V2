import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/app/theme/MotionPreference";

export function useCountUp(target: number, opts: { durationMs?: number } = {}): number {
  const { durationMs = 900 } = opts;
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(reduced ? target : 0);
  const fromRef = useRef(0);

  useEffect(() => {
    if (reduced) { setValue(target); return; }
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = from + (target - from) * eased;
      setValue(current);
      if (t < 1) raf = requestAnimationFrame(tick);
      else { fromRef.current = target; setValue(target); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, reduced]);

  return reduced ? target : Math.round(value);
}
