import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { registerStyle } from "../../../lib/registerStyle";

registerStyle(
  "scroll-reveal",
  `
.ud-reveal {
  will-change: opacity, transform;
}

.ud-reveal--hidden {
  opacity: 0;
  transform: translate3d(0, var(--reveal-distance, 44px), 0)
    scale(var(--reveal-scale, 0.985));
}

.ud-reveal--shown {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1);
  transition:
    opacity var(--reveal-duration, 620ms) var(--ease-out) var(--reveal-delay, 0ms),
    transform var(--reveal-duration, 620ms) var(--ease-out) var(--reveal-delay, 0ms);
}

.ud-reveal--settled {
  will-change: auto;
}
`,
);

export interface ScrollRevealProps {
  children: ReactNode;

  delay?: number;

  duration?: number;

  distance?: number;

  scale?: number;

  threshold?: number;
  enabled?: boolean;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

export function ScrollReveal({
  children,
  delay = 0,
  duration = 620,
  distance = 44,
  scale = 0.985,
  threshold = 0.12,
  enabled = true,
  as: Tag = "div",
  className = "",
  style,
}: ScrollRevealProps) {
  const reduced = usePrefersReducedMotion();
  const skip = reduced || !enabled;
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(skip);
  const [settled, setSettled] = useState(skip);

  useEffect(() => {
    if (skip) {
      setShown(true);
      setSettled(true);
      return;
    }
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [skip, threshold]);

  useEffect(() => {
    if (!shown || settled) return;
    const id = setTimeout(() => setSettled(true), duration + delay + 60);
    return () => clearTimeout(id);
  }, [shown, settled, duration, delay]);

  const Component = Tag as ElementType;

  return (
    <Component
      ref={ref}
      className={[
        "ud-reveal",
        shown ? "ud-reveal--shown" : "ud-reveal--hidden",
        settled ? "ud-reveal--settled" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          "--reveal-delay": `${delay}ms`,
          "--reveal-duration": `${duration}ms`,
          "--reveal-distance": `${distance}px`,
          "--reveal-scale": scale,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </Component>
  );
}

export default ScrollReveal;
