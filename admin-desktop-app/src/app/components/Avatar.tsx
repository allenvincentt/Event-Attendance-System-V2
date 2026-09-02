import { tokens } from "@/app/theme/tokens";
import { initials } from "@/app/lib/format";
export function Avatar({ name, size = "sm", color = tokens.color.brand.primary }: { name: string; size?: "sm" | "md"; color?: string }) {
  const px = size === "md" ? 40 : 32;
  return (
    <span aria-hidden="true" style={{ width: px, height: px, borderRadius: "50%", background: color, color: tokens.color.text.onBrand, display: "grid", placeItems: "center", fontSize: size === "md" ? tokens.font.size.body : tokens.font.size.sm, fontWeight: tokens.font.weight.semibold }}>
      {initials(name)}
    </span>
  );
}
