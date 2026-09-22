const elements = new Map<string, HTMLStyleElement>();
let layersDeclared = false;

export type StyleLayer = "base" | "components";

function declareLayers(): void {
  if (layersDeclared) return;
  layersDeclared = true;
  const el = document.createElement("style");
  el.setAttribute("data-ud-layers", "");
  el.textContent = "@layer ud-base, ud-components;";
  document.head.prepend(el);
}

export function registerStyle(
  id: string,
  css: string,
  layer: StyleLayer = "components",
): void {
  if (typeof document === "undefined") return;

  declareLayers();

  const text = `@layer ud-${layer} {\n${css}\n}`;
  const existing =
    elements.get(id) ??
    document.head.querySelector<HTMLStyleElement>(`style[data-ud-style="${id}"]`);

  if (existing) {
    elements.set(id, existing);
    if (existing.textContent !== text) existing.textContent = text;
    return;
  }

  const el = document.createElement("style");
  el.setAttribute("data-ud-style", id);
  el.textContent = text;
  document.head.appendChild(el);
  elements.set(id, el);
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
