export const BRAND = {
  primary: "#b20a07",
  primaryHover: "#d93b36",
  primaryPress: "#8f0806",
  secondary: "#f5cf28",
  secondaryStrong: "#ddb512",
  onPrimary: "#ffffff",
  onSecondary: "#4e0504",
} as const;

export const RED = {
  50: "#fef2f2",
  100: "#fde3e2",
  200: "#fbc9c7",
  300: "#f5a29f",
  400: "#ea6b67",
  500: "#d93b36",
  600: "#b20a07",
  700: "#8f0806",
  800: "#6e0705",
  900: "#4e0504",
} as const;

export const GOLD = {
  50: "#fefae8",
  100: "#fdf3c4",
  200: "#fbe88d",
  300: "#f8dc55",
  400: "#f5cf28",
  500: "#ddb512",
  600: "#b8900d",
  700: "#8f6d0b",
  800: "#6b510a",
  900: "#4a3707",
} as const;

export const NEUTRAL = {
  0: "#ffffff",
  25: "#fafafb",
  50: "#f5f6f8",
  100: "#edeef2",
  200: "#e2e4ea",
  300: "#cbcfd8",
  400: "#9ba1b0",
  500: "#6e7585",
  600: "#545b6b",
  700: "#3d4351",
  800: "#272c37",
  900: "#161a22",
} as const;

export const CHART = {
  enrolled: "#b8900d",
  enrolledSoft: "#e8c95a",
  attended: "#b20a07",
  attendedSoft: "#e46f6b",
  track: "#e2e4ea",
  grid: "#eceef3",
  axis: "#9ba1b0",
} as const;

export type StatusTone =
  | "draft"
  | "upcoming"
  | "ongoing"
  | "completed"
  | "cancelled";

export const STATUS_COLOR: Record<
  StatusTone,
  { fg: string; bg: string; dot: string }
> = {
  draft: { fg: "#8f6d0b", bg: "#fdf6e0", dot: "#d9a404" },
  upcoming: { fg: "#1d4ed8", bg: "#eaf1fe", dot: "#2563eb" },
  ongoing: { fg: "#15803d", bg: "#e8f7ee", dot: "#16a34a" },
  completed: { fg: "#475569", bg: "#eef1f5", dot: "#64748b" },
  cancelled: { fg: "#b91c1c", bg: "#fdecec", dot: "#dc2626" },
};

export const gradient = (from: string, to: string): string =>
  `linear-gradient(106deg, ${from} 37%, ${to} 100%)`;
