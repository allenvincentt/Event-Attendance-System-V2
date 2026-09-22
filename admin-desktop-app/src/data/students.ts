import type { Department, Student } from "../models";
import { DEPARTMENTS } from "./departments";
import { createRng, hashSeed, randInt } from "./rng";

export const ROSTER_SIZE = 312;

const SURNAMES = [
  "Abad", "Abalos", "Acosta", "Aguilar", "Alcantara", "Alonzo", "Alvarez",
  "Andrada", "Aquino", "Arellano", "Bautista", "Belmonte", "Bernardo",
  "Buenaventura", "Cabrera", "Calderon", "Castillo", "Cordero", "Cruz",
  "Dela Cruz", "Del Rosario", "Diaz", "Domingo", "Escobar", "Espinosa",
  "Estrada", "Fajardo", "Fernandez", "Flores", "Gabriel", "Garcia",
  "Gonzales", "Guerrero", "Hernandez", "Ilagan", "Jimenez", "Lagman",
  "Lazaro", "Macaraeg", "Magbanua", "Manalo", "Mendoza", "Montemayor",
  "Morales", "Navarro", "Ocampo", "Padilla", "Panganiban", "Pascual",
  "Quiambao", "Ramos", "Reyes", "Rivera", "Robles", "Salazar", "Samson",
  "Santiago", "Santos", "Sarmiento", "Solis", "Tolentino", "Torres",
  "Valdez", "Velasco", "Villanueva", "Ybanez", "Zamora",
];

const GIVEN_NAMES = [
  "Aaron", "Adrian", "Althea", "Andrei", "Angelo", "Bea", "Bianca", "Camille",
  "Carlo", "Cielo", "Daniel", "Danica", "Dianne", "Elijah", "Erika", "Ethan",
  "Faith", "Francis", "Gabriela", "Gerard", "Hannah", "Ivan", "Jasmine",
  "Jerome", "Joana", "Kyla", "Lance", "Liam", "Mariel", "Miguel", "Neil",
  "Nicole", "Patricia", "Rafael", "Rhea", "Rico", "Samantha", "Sofia",
  "Trisha", "Vince", "Yuri", "Zeus",
];

const SECTION_LETTERS = ["A", "B", "C"];

function allocate(departments: Department[], total: number): number[] {
  const sum = departments.reduce((acc, d) => acc + d.enrolled, 0);
  const exact = departments.map((d) => (d.enrolled / sum) * total);
  const floors = exact.map(Math.floor);
  let remaining = total - floors.reduce((a, b) => a + b, 0);

  const order = exact
    .map((value, index) => ({ index, frac: value - Math.floor(value) }))
    .sort((a, b) => b.frac - a.frac);

  const counts = floors.slice();
  for (const { index } of order) {
    if (remaining <= 0) break;
    counts[index] += 1;
    remaining -= 1;
  }
  return counts;
}

function biasedIndex(rng: () => number, length: number): number {
  const r = rng();
  return Math.min(length - 1, Math.floor(r * r * length));
}

function buildSection(department: Department, rng: () => number): string {
  const program = department.programs[randInt(rng, 0, department.programs.length - 1)];
  const maxYear = department.id === "BED" ? 3 : department.id === "PS" ? 2 : 4;
  const year = randInt(rng, 1, maxYear);
  const letter = SECTION_LETTERS[randInt(rng, 0, SECTION_LETTERS.length - 1)];
  return `${program}-${year}${letter}`;
}

function buildStudents(): Student[] {
  const counts = allocate(DEPARTMENTS, ROSTER_SIZE);
  const students: Student[] = [];

  DEPARTMENTS.forEach((department, deptIndex) => {
    const rng = createRng(hashSeed(`roster:${department.id}`));
    const count = counts[deptIndex];

    for (let i = 0; i < count; i += 1) {
      const surname = SURNAMES[biasedIndex(rng, SURNAMES.length)];
      const given = GIVEN_NAMES[randInt(rng, 0, GIVEN_NAMES.length - 1)];
      const entryYear = randInt(rng, 2021, 2024);
      const serial = String(randInt(rng, 100000, 999999));

      students.push({
        id: `${department.id}-${String(i).padStart(3, "0")}`,
        name: `${surname}, ${given}`,
        studentNumber: `${entryYear}-${serial}`,
        departmentId: department.id,
        section: buildSection(department, rng),
      });
    }
  });

  return students.sort(
    (a, b) =>
      a.name.localeCompare(b.name, "en") ||
      a.studentNumber.localeCompare(b.studentNumber),
  );
}

export const STUDENTS: Student[] = buildStudents();

const BY_DEPARTMENT = STUDENTS.reduce<Record<string, Student[]>>(
  (acc, student) => {
    (acc[student.departmentId] ??= []).push(student);
    return acc;
  },
  {},
);

export function studentsOfDepartment(departmentId: string): Student[] {
  return BY_DEPARTMENT[departmentId] ?? [];
}

export function getStudent(id: string): Student | undefined {
  return STUDENTS.find((s) => s.id === id);
}
