const brand = {
  primary: "#B20A07",
  primaryHover: "#C81410",
  primaryPressed: "#8E0805",
  primarySoft: "rgba(178,10,7,0.08)",
  gold: "#F5CF28",
  goldSoft: "rgba(245,207,40,0.16)",
} as const;

const gradient = (from: string, to: string) =>
  `linear-gradient(106deg, ${from} 37%, ${to} 100%)`;

export const tokens = {
  color: {
    brand,
    surface: { canvas: "#F4F5F7", card: "#FFFFFF", sunken: "#FAFAFA" },
    text: {
      strong: "#1A1A1A",
      default: "#3F3F46",
      muted: "#71717A",
      onBrand: "#FFFFFF",
      onSidebar: "rgba(255,255,255,0.92)",
      onSidebarMuted: "rgba(255,255,255,0.72)",
    },
    border: { default: "#E7E7EA", strong: "#D4D4D8" },
    focus: "#2563EB",
    status: {
      success: { base: "#15803D", soft: "#E7F3EC" },
      warning: { base: "#B45309", soft: "#FBF0E4" },
      danger: { base: "#B20A07", soft: "#F7E5E4" },
      info: { base: "#1D4ED8", soft: "#E6ECFB" },
      neutral: { base: "#52525B", soft: "#EEEEEF" },
    },
  },
  space: { "2xs": 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, "2xl": 32, "3xl": 40, "4xl": 48 },
  radius: { sm: 6, md: 10, lg: 14, xl: 20, pill: 999 },
  elevation: {
    e1: "0 1px 2px rgba(16,16,20,0.04), 0 1px 3px rgba(16,16,20,0.06)",
    e2: "0 4px 12px rgba(16,16,20,0.10), 0 2px 4px rgba(16,16,20,0.06)",
    e3: "0 24px 48px rgba(16,16,20,0.20), 0 8px 16px rgba(16,16,20,0.12)",
  },
  font: {
    family: `Inter, "Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif`,
    size: { xs: 11, sm: 12, bodySm: 13, body: 14, subtitle: 16, h3: 20, h2: 24, h1: 32, kpi: 28 },
    weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  },
  motion: {
    dur: { fast: 0.12, base: 0.2, slow: 0.32, window: 0.26 },
    durMs: { fast: 120, base: 200, slow: 320, window: 260 },
    ease: { standard: [0.2, 0, 0, 1], decel: [0, 0, 0, 1] },
  },
  breakpoints: { sm: 640, md: 760, lg: 1024, xl: 1280 },
  gradient,
  sidebarGradient: gradient(brand.primary, brand.primaryPressed),
} as const;

export type StatusKey = keyof typeof tokens.color.status;
export type SpaceKey = keyof typeof tokens.space;
