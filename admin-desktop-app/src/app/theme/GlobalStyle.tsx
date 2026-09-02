import { tokens } from "./tokens";

const CSS = `
*, *::before, *::after { box-sizing: border-box; }
html, body, #root { height: 100%; margin: 0; }
body {
  font-family: ${tokens.font.family};
  font-size: ${tokens.font.size.body}px;
  line-height: 1.5;
  color: ${tokens.color.text.default};
  background: ${tokens.color.surface.canvas};
  -webkit-font-smoothing: antialiased;
  user-select: none;
}
input, textarea, select, [contenteditable] { user-select: text; }
button { font: inherit; color: inherit; }
:focus:not(:focus-visible) { outline: none; }
:focus-visible { outline: 2px solid ${tokens.color.focus}; outline-offset: 2px; border-radius: 4px; }
::selection { background: ${tokens.color.brand.primarySoft}; }
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-thumb { background: ${tokens.color.border.strong}; border-radius: ${tokens.radius.pill}px; border: 2px solid transparent; background-clip: content-box; }
::-webkit-scrollbar-track { background: transparent; }
@font-face {
  font-family: "Inter";
  src: url("/src/assets/fonts/Inter.var.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}
@keyframes skeleton-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
`;

export function GlobalStyle() {
  return <style>{CSS}</style>;
}
