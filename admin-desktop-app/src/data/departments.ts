import type { Department } from "../models";

import BED from "../assets/departments/BED.png";
import CAE from "../assets/departments/CAE.png";
import CAFAE from "../assets/departments/CAFAE.png";
import CASE from "../assets/departments/CASE.png";
import CCE from "../assets/departments/CCE.png";
import CCJE from "../assets/departments/CCJE.png";
import CEE from "../assets/departments/CEE.png";
import CHE from "../assets/departments/CHE.png";
import CHSE from "../assets/departments/CHSE.png";
import CTE from "../assets/departments/CTE.png";
import PS from "../assets/departments/PS.png";
import TS from "../assets/departments/TS.png";

export const DEPARTMENTS: Department[] = [
  {
    id: "BED",
    code: "BED",
    name: "Basic Education Department",
    shortName: "Basic Education",
    logo: BED,
    programs: ["GRADE11", "GRADE12"],
    enrolled: 742,
  },
  {
    id: "CAE",
    code: "CAE",
    name: "College of Accounting Education",
    shortName: "Accounting Education",
    logo: CAE,
    programs: ["BSA", "BSMA"],
    enrolled: 388,
  },
  {
    id: "CAFAE",
    code: "CAFAE",
    name: "College of Architecture and Fine Arts Education",
    shortName: "Architecture & Fine Arts",
    logo: CAFAE,
    programs: ["BSARCH", "BSFA"],
    enrolled: 456,
  },
  {
    id: "CASE",
    code: "CASE",
    name: "College of Arts and Sciences Education",
    shortName: "Arts & Sciences",
    logo: CASE,
    programs: ["ABPSY", "BSBIO", "ABCOM"],
    enrolled: 612,
  },
  {
    id: "CCE",
    code: "CCE",
    name: "College of Computing Education",
    shortName: "Computing Education",
    logo: CCE,
    programs: ["BSCS", "BSIT", "BSIS"],
    enrolled: 934,
  },
  {
    id: "CCJE",
    code: "CCJE",
    name: "College of Criminal Justice Education",
    shortName: "Criminal Justice",
    logo: CCJE,
    programs: ["BSCRIM"],
    enrolled: 521,
  },
  {
    id: "CEE",
    code: "CEE",
    name: "College of Engineering Education",
    shortName: "Engineering Education",
    logo: CEE,
    programs: ["BSCE", "BSEE", "BSME"],
    enrolled: 705,
  },
  {
    id: "CHE",
    code: "CHE",
    name: "College of Hospitality Education",
    shortName: "Hospitality Education",
    logo: CHE,
    programs: ["BSTM", "BSHM"],
    enrolled: 483,
  },
  {
    id: "CHSE",
    code: "CHSE",
    name: "College of Health Sciences Education",
    shortName: "Health Sciences",
    logo: CHSE,
    programs: ["BSN", "BSPHAR"],
    enrolled: 396,
  },
  {
    id: "CTE",
    code: "CTE",
    name: "College of Teacher Education",
    shortName: "Teacher Education",
    logo: CTE,
    programs: ["BSED", "BEED"],
    enrolled: 509,
  },
  {
    id: "PS",
    code: "PS",
    name: "Professional Schools",
    shortName: "Professional Schools",
    logo: PS,
    programs: ["MBA", "MPA"],
    enrolled: 274,
  },
  {
    id: "TS",
    code: "TS",
    name: "Technical School",
    shortName: "Technical School",
    logo: TS,
    programs: ["TECHVOC"],
    enrolled: 331,
  },
];

const BY_ID = new Map(DEPARTMENTS.map((d) => [d.id, d]));

export function getDepartment(id: string): Department | undefined {
  return BY_ID.get(id);
}

export function getDepartments(ids: readonly string[]): Department[] {
  return ids
    .map((id) => BY_ID.get(id))
    .filter((d): d is Department => Boolean(d));
}

export const TOTAL_DEPARTMENTS = DEPARTMENTS.length;
