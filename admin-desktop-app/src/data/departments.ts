import type { Department } from "./types";
import BED from "@/assets/departments/BED.png";
import CAE from "@/assets/departments/CAE.png";
import CAFAE from "@/assets/departments/CAFAE.png";
import CASE from "@/assets/departments/CASE.png";
import CCE from "@/assets/departments/CCE.png";
import CCJE from "@/assets/departments/CCJE.png";
import CEE from "@/assets/departments/CEE.png";
import CHE from "@/assets/departments/CHE.png";
import CHSE from "@/assets/departments/CHSE.png";
import CTE from "@/assets/departments/CTE.png";
import PS from "@/assets/departments/PS.png";
import TS from "@/assets/departments/TS.png";

export const DEPARTMENTS: readonly Department[] = [
  { code: "BED", name: "Basic Education Department", shortName: "Basic Education", logo: BED },
  { code: "CAE", name: "College of Accounting Education", shortName: "Accounting Education", logo: CAE },
  { code: "CAFAE", name: "College of Architecture and Fine Arts Education", shortName: "Architecture & Fine Arts", logo: CAFAE },
  { code: "CASE", name: "College of Arts and Sciences Education", shortName: "Arts & Sciences", logo: CASE },
  { code: "CCE", name: "College of Computing Education", shortName: "Computing Education", logo: CCE },
  { code: "CCJE", name: "College of Criminal Justice Education", shortName: "Criminal Justice", logo: CCJE },
  { code: "CEE", name: "College of Engineering Education", shortName: "Engineering Education", logo: CEE },
  { code: "CHE", name: "College of Hospitality Education", shortName: "Hospitality Education", logo: CHE },
  { code: "CHSE", name: "College of Health Sciences Education", shortName: "Health Sciences", logo: CHSE },
  { code: "CTE", name: "College of Teacher Education", shortName: "Teacher Education", logo: CTE },
  { code: "PS", name: "Professional Schools", shortName: "Professional Schools", logo: PS },
  { code: "TS", name: "Technical School", shortName: "Technical School", logo: TS },
] as const;

export const DEPARTMENT_CODES = DEPARTMENTS.map((d) => d.code);

export function departmentByCode(code: string): Department {
  const d = DEPARTMENTS.find((x) => x.code === code);
  if (!d) throw new Error(`Unknown department code: ${code}`);
  return d;
}
