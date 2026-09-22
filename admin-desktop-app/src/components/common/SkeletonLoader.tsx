import type { CSSProperties } from "react";
import { registerStyle } from "../../lib/registerStyle";

registerStyle(
  "skeleton",
  `
.ud-skeleton {
  position: relative;
  overflow: hidden;
  border-radius: var(--r-sm);
  background: var(--n-100);
}

.ud-skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    106deg,
    transparent 20%,
    rgba(255, 255, 255, 0.72) 50%,
    transparent 80%
  );
  background-size: 220% 100%;
  animation: ud-shimmer 1.4s var(--ease-standard) infinite;
}

.ud-skeleton--text { height: 12px; border-radius: var(--r-pill); }
.ud-skeleton--title { height: 20px; border-radius: var(--r-xs); }
.ud-skeleton--circle { border-radius: 50%; }
.ud-skeleton--block { height: 100%; border-radius: var(--r-md); }

.ud-skeleton-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
}

.ud-skeleton-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

@media (prefers-reduced-motion: reduce) {
  .ud-skeleton::after { animation: none; opacity: 0.4; }
}
`,
);

export interface SkeletonLoaderProps {
  variant?: "text" | "title" | "circle" | "block";
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
}

export function SkeletonLoader({
  variant = "text",
  width,
  height,
  className = "",
  style,
}: SkeletonLoaderProps) {
  return (
    <span
      className={`ud-skeleton ud-skeleton--${variant} ${className}`.trim()}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
}

export function SkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="ud-skeleton-group" role="status" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div className="ud-skeleton-row" key={i}>
          <SkeletonLoader variant="circle" width={30} height={30} />
          <SkeletonLoader variant="text" width={`${40 + ((i * 13) % 35)}%`} />
          <SkeletonLoader variant="text" width={80} />
        </div>
      ))}
    </div>
  );
}

export default SkeletonLoader;
