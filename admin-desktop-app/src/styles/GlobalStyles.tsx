import { registerStyle } from "../lib/registerStyle";

registerStyle(
  "tokens",
  `

:root {
  --red-50: #fef2f2;
  --red-100: #fde3e2;
  --red-200: #fbc9c7;
  --red-300: #f5a29f;
  --red-400: #ea6b67;
  --red-500: #d93b36;
  --red-600: #b20a07;
  --red-700: #8f0806;
  --red-800: #6e0705;
  --red-900: #4e0504;

  --gold-50: #fefae8;
  --gold-100: #fdf3c4;
  --gold-200: #fbe88d;
  --gold-300: #f8dc55;
  --gold-400: #f5cf28;
  --gold-500: #ddb512;
  --gold-600: #b8900d;
  --gold-700: #8f6d0b;
  --gold-800: #6b510a;
  --gold-900: #4a3707;

  --n-0: #ffffff;
  --n-25: #fafafb;
  --n-50: #f5f6f8;
  --n-100: #edeef2;
  --n-200: #e2e4ea;
  --n-300: #cbcfd8;
  --n-400: #9ba1b0;
  --n-500: #6e7585;
  --n-600: #545b6b;
  --n-700: #3d4351;
  --n-800: #272c37;
  --n-900: #161a22;

  --brand: var(--red-600);
  --brand-hover: var(--red-500);
  --brand-press: var(--red-700);
  --brand-soft: var(--red-50);
  --brand-soft-border: var(--red-100);
  --on-brand: #ffffff;

  --accent: var(--gold-400);
  --accent-strong: var(--gold-500);
  --on-accent: var(--red-900);

  --bg: var(--n-50);
  --surface: var(--n-0);
  --surface-alt: var(--n-25);
  --surface-sunken: var(--n-100);

  --text: var(--n-900);
  --text-secondary: var(--n-600);
  --text-muted: var(--n-500);
  --text-faint: var(--n-400);
  --on-dark: rgba(255, 255, 255, 0.92);
  --on-dark-muted: rgba(255, 255, 255, 0.62);

  --border: var(--n-200);
  --border-strong: var(--n-300);
  --border-subtle: var(--n-100);

  --status-draft: #d9a404;
  --status-draft-bg: #fdf6e0;
  --status-upcoming: #2563eb;
  --status-upcoming-bg: #eaf1fe;
  --status-ongoing: #16a34a;
  --status-ongoing-bg: #e8f7ee;
  --status-completed: #64748b;
  --status-completed-bg: #eef1f5;
  --status-cancelled: #dc2626;
  --status-cancelled-bg: #fdecec;

  --success: #16a34a;
  --success-bg: #e8f7ee;
  --warning: #d9a404;
  --warning-bg: #fdf6e0;
  --danger: #dc2626;
  --danger-bg: #fdecec;
  --info: #2563eb;
  --info-bg: #eaf1fe;

  --viz-enrolled: #b8900d;
  --viz-enrolled-soft: #e8c95a;
  --viz-attended: #b20a07;
  --viz-attended-soft: #e46f6b;
  --viz-track: var(--n-200);
  --viz-grid: #eceef3;

  --grad-brand: linear-gradient(106deg, var(--red-600) 37%, var(--red-800) 100%);
  --grad-brand-hover: linear-gradient(106deg, var(--red-500) 37%, var(--red-700) 100%);
  --grad-brand-press: linear-gradient(106deg, var(--red-700) 37%, var(--red-900) 100%);
  --grad-rail: linear-gradient(106deg, var(--red-600) 37%, #8a0705 100%);
  --grad-accent: linear-gradient(106deg, var(--gold-300) 37%, var(--gold-500) 100%);
  --grad-accent-soft: linear-gradient(106deg, rgba(245, 207, 40, 0.22) 37%, rgba(221, 181, 18, 0.1) 100%);

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 32px;
  --space-8: 40px;
  --space-9: 48px;

  --r-xs: 6px;
  --r-sm: 8px;
  --r-md: 10px;
  --r-lg: 12px;
  --r-xl: 16px;
  --r-2xl: 20px;
  --r-pill: 999px;

  --sh-xs: 0 1px 2px rgba(22, 26, 34, 0.05);
  --sh-sm: 0 1px 2px rgba(22, 26, 34, 0.06), 0 1px 3px rgba(22, 26, 34, 0.04);
  --sh-md: 0 2px 4px rgba(22, 26, 34, 0.05), 0 4px 12px rgba(22, 26, 34, 0.06);
  --sh-lg: 0 4px 8px rgba(22, 26, 34, 0.05), 0 12px 28px rgba(22, 26, 34, 0.1);
  --sh-xl: 0 8px 16px rgba(22, 26, 34, 0.07), 0 24px 56px rgba(22, 26, 34, 0.16);
  --sh-brand: 0 4px 14px rgba(178, 10, 7, 0.28);
  --sh-brand-lg: 0 8px 22px rgba(178, 10, 7, 0.34);
  --sh-accent: 0 4px 14px rgba(221, 181, 18, 0.32);

  --font-sans: "Segoe UI Variable Display", "Segoe UI Variable", "Segoe UI",
    Inter, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial,
    sans-serif;
  --font-num: "Segoe UI Variable Text", "Segoe UI", Inter, -apple-system,
    BlinkMacSystemFont, Roboto, sans-serif;

  --fs-11: 11px;
  --fs-12: 12px;
  --fs-13: 13px;
  --fs-14: 14px;
  --fs-16: 16px;
  --fs-18: 18px;
  --fs-20: 20px;
  --fs-24: 24px;
  --fs-30: 30px;
  --fs-36: 36px;

  --lh-tight: 1.2;
  --lh-snug: 1.35;
  --lh-normal: 1.5;

  --fw-regular: 400;
  --fw-medium: 500;
  --fw-semibold: 600;
  --fw-bold: 700;

  --tracking-wide: 0.06em;
  --tracking-wider: 0.09em;

  --dur-instant: 90ms;
  --dur-fast: 150ms;
  --dur-base: 220ms;
  --dur-slow: 320ms;
  --dur-slower: 460ms;
  --dur-reveal: 620ms;

  --ease-standard: cubic-bezier(0.2, 0, 0.15, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-spring: cubic-bezier(0.34, 1.42, 0.5, 1);
  --ease-back: cubic-bezier(0.2, 1.3, 0.4, 1);

  --rail-w: 248px;
  --rail-w-collapsed: 84px;
  --topbar-h: 52px;
  --focus-ring: 0 0 0 2px var(--n-0), 0 0 0 4px rgba(178, 10, 7, 0.45);
  --focus-ring-on-brand: 0 0 0 2px rgba(178, 10, 7, 1), 0 0 0 4px var(--gold-300);
}
`,
  "base",
);

registerStyle(
  "global",
  `

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body,
#root {
  height: 100%;
  margin: 0;
  padding: 0;
}

html {
  background: transparent;
}

body {
  font-family: var(--font-sans);
  font-size: var(--fs-14);
  line-height: var(--lh-normal);
  color: var(--text);
  background: transparent;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  overflow: hidden;
}

h1,
h2,
h3,
h4,
h5,
h6,
p,
figure {
  margin: 0;
}

h1,
h2,
h3,
h4 {
  line-height: var(--lh-tight);
  font-weight: var(--fw-bold);
  letter-spacing: -0.015em;
}

button,
input,
select,
textarea {
  font: inherit;
  color: inherit;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

a {
  color: var(--brand);
  text-decoration: none;
}

ul,
ol {
  margin: 0;
  padding: 0;
  list-style: none;
}

img,
svg {
  display: block;
  max-width: 100%;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

.tnum {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
}

:focus {
  outline: none;
}

:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
  border-radius: var(--r-xs);
}

::selection {
  background: var(--red-100);
  color: var(--red-900);
}

* {
  scrollbar-width: thin;
  scrollbar-color: var(--n-300) transparent;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--n-300);
  border: 3px solid transparent;
  border-radius: var(--r-pill);
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--n-400);
  border: 2px solid transparent;
  background-clip: content-box;
}

::-webkit-scrollbar-corner {
  background: transparent;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

[data-tauri-drag-region] {
  -webkit-app-region: drag;
  app-region: drag;
}

[data-tauri-drag-region] button,
[data-tauri-drag-region] a,
[data-tauri-drag-region] input,
[data-tauri-drag-region] select,
[data-tauri-drag-region] [role="button"],
[data-no-drag] {
  -webkit-app-region: no-drag;
  app-region: no-drag;
}

@keyframes ud-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes ud-fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes ud-pop-in {
  from {
    opacity: 0;
    transform: translate3d(0, 12px, 0) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}

@keyframes ud-pop-out {
  from {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    opacity: 0;
    transform: translate3d(0, 8px, 0) scale(0.98);
  }
}

@keyframes ud-slide-in-right {
  from {
    opacity: 0;
    transform: translate3d(24px, 0, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes ud-slide-in-left {
  from {
    opacity: 0;
    transform: translate3d(-24px, 0, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes ud-rise {
  from {
    opacity: 0;
    transform: translate3d(0, 44px, 0) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}

@keyframes ud-shimmer {
  from {
    background-position: -160% 0;
  }
  to {
    background-position: 260% 0;
  }
}

@keyframes ud-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes ud-pulse-ring {
  0% {
    box-shadow: 0 0 0 0 rgba(178, 10, 7, 0.35);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(178, 10, 7, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(178, 10, 7, 0);
  }
}

@keyframes ud-draw-line {
  to {
    stroke-dashoffset: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}

.ud-resizing *,
.ud-resizing *::before,
.ud-resizing *::after {
  transition: none !important;
  animation-play-state: paused !important;
}
`,
  "base",
);

export function GlobalStyles() {
  return null;
}

export default GlobalStyles;
