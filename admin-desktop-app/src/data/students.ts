import { hashString, mulberry32, pick, randInt } from "./rng";
import { DEPARTMENT_CODES } from "./departments";
import type { Student } from "./types";

const SURNAMES = [
  "Abad", "Alcantara", "Bautista", "Cabrera", "Castillo", "Cruz", "Dela", "Domingo",
  "Espinosa", "Fernandez", "Garcia", "Gonzales", "Hernandez", "Ilagan", "Jimenez",
  "Lazaro", "Mendoza", "Navarro", "Ocampo", "Pascual", "Quinto", "Ramos", "Reyes",
  "Santos", "Tolentino", "Uy", "Villanueva", "Ventura", "Yap", "Zamora",
];
const GIVEN = [
  "Aaron", "Althea", "Andrei", "Bianca", "Carlo", "Camille", "Daniel", "Dianne",
  "Ethan", "Erika", "Francis", "Gabriela", "Hannah", "Ivan", "Jasmine", "Kyla",
  "Liam", "Mika", "Neil", "Olivia", "Paolo", "Rhea", "Rico", "Sofia", "Tristan",
  "Ulysses", "Valerie", "Wyatt", "Xander", "Yuri", "Zoe",
];

export const SECTIONS_BY_DEPT: Record<string, readonly string[]> = {
  BED: ["GRADE11-1B", "GRADE11-2A", "GRADE11-3B", "GRADE12-1C", "GRADE12-2C", "GRADE12-3C"],
  CAE: ["BSA-1A", "BSA-2B", "BSA-3A", "BSA-4B", "BSMA-2A"],
  CAFAE: ["BSARCH-1A", "BSARCH-2B", "BSARCH-4B", "BFA-2A", "BSID-3A"],
  CASE: ["ABPSY-1B", "ABPSY-3C", "BSBIO-2B", "ABCOM-2A", "ABENG-4A"],
  CCE: ["BSCS-2A", "BSIT-1C", "BSIS-3A", "BSCS-4B", "BSIT-3A"],
  CCJE: ["BSCRIM-1A", "BSCRIM-2C", "BSCRIM-3B", "BSCRIM-4A"],
  CEE: ["BSCE-1B", "BSEE-2C", "BSEE-3C", "BSME-1A", "BSCE-3A"],
  CHE: ["BSHM-1A", "BSTM-3A", "BSHM-2B", "BSTM-4A"],
  CHSE: ["BSN-1A", "BSN-2B", "BSPHARM-3A", "BSMT-2A"],
  CTE: ["BSED-2B", "BEED-4A", "BSED-1A", "BPED-3B", "BECED-2A"],
  PS: ["MBA-1A", "MPA-2A", "PHD-ED-1A"],
  TS: ["TECHVOC-1A", "TECHVOC-2A", "AUTOMECH-1B", "ELECTECH-2A"],
};

function generate(): Student[] {
  const rand = mulberry32(hashString("ud-roster-v1"));
  const out: Student[] = [];
  const usedIds = new Set<string>();
  // even-ish distribution: 26 per department * 12 = 312
  for (const code of DEPARTMENT_CODES) {
    const sections = SECTIONS_BY_DEPT[code];
    for (let i = 0; i < 26; i++) {
      let id: string;
      do {
        id = `20${randInt(rand, 21, 24)}-${randInt(rand, 100000, 999999)}`;
      } while (usedIds.has(id));
      usedIds.add(id);
      out.push({
        id,
        name: `${pick(rand, SURNAMES)}, ${pick(rand, GIVEN)}`,
        departmentCode: code,
        section: pick(rand, sections),
      });
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

export const STUDENTS: readonly Student[] = generate();

export const studentsByDepartment = (code: string) =>
  STUDENTS.filter((s) => s.departmentCode === code);
