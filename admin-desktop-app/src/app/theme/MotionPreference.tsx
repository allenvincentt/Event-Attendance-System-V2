import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const Ctx = createContext(false);
const QUERY = "(prefers-reduced-motion: reduce)";

export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return <Ctx.Provider value={reduced}>{children}</Ctx.Provider>;
}

export function usePrefersReducedMotion(): boolean {
  return useContext(Ctx);
}
