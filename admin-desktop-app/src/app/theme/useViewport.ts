import { useEffect, useState } from "react";
import { tokens } from "./tokens";

type Bp = "sm" | "md" | "lg" | "xl";

function classify(w: number): Bp {
  if (w >= tokens.breakpoints.xl) return "xl";
  if (w >= tokens.breakpoints.lg) return "lg";
  if (w >= tokens.breakpoints.md) return "md";
  return "sm";
}

export function useViewport() {
  const [size, setSize] = useState(() => ({
    width: typeof window === "undefined" ? 1280 : window.innerWidth,
    height: typeof window === "undefined" ? 800 : window.innerHeight,
  }));
  useEffect(() => {
    const on = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return { ...size, bp: classify(size.width) };
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return matches;
}
