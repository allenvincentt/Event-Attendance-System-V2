import { useState } from "react";
import { departmentByCode } from "@/data/departments";
import { tokens } from "@/app/theme/tokens";
export function DepartmentLogo({ code, size = "sm" }: { code: string; size?: "sm" | "lg" }) {
  const dept = departmentByCode(code);
  const px = size === "lg" ? 64 : 36;
  const [failed, setFailed] = useState(false);
  return (
    <span style={{ width: px, height: px, borderRadius: "50%", background: tokens.color.surface.sunken, border: `1px solid ${tokens.color.border.default}`, display: "grid", placeItems: "center", overflow: "hidden", flexShrink: 0 }}>
      {failed ? (
        <span style={{ fontSize: size === "lg" ? tokens.font.size.body : tokens.font.size.sm, fontWeight: tokens.font.weight.bold, color: tokens.color.brand.primary }}>{code}</span>
      ) : (
        <img src={dept.logo} alt={dept.name} width={px - 8} height={px - 8} style={{ objectFit: "contain" }} onError={() => setFailed(true)} />
      )}
    </span>
  );
}
