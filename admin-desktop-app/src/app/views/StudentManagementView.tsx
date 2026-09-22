import { useMemo, useRef, useState } from "react";
import { DataTable, type DataTableColumn } from "../../components/ui/DataTable";
import { GeneralButton } from "../../components/ui/GeneralButton";
import { MessageBoxModal } from "../../components/ui/MessageBoxModal";
import { Modal } from "../../components/ui/Modal";
import { Avatar, DepartmentLogo } from "../../components/ui/Avatar";
import { Chip } from "../../components/ui/Badge";
import { Icon } from "../../components/ui/Icon";
import { EmptyState } from "../../components/ui/EmptyState";
import {
  FloatingLabelInput,
  SearchField,
  Select,
} from "../../components/ui/Field";
import { DEPARTMENTS, getDepartment } from "../../data/departments";
import { STUDENTS } from "../../data/students";
import type { Student } from "../../models";
import { formatNumber, matchesQuery, pluralize } from "../../lib/format";
import { useDismiss } from "../../lib/useDismiss";
import { registerStyle } from "../../lib/registerStyle";

registerStyle(
  "students",
  `
.ud-students {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  height: 100%;
  min-height: 0;
}

.ud-students__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-5);
}

.ud-students__title {
  font-size: var(--fs-24);
  font-weight: var(--fw-bold);
  letter-spacing: -0.02em;
  color: var(--text);
}

.ud-students__subtitle {
  margin-top: 2px;
  font-size: var(--fs-13);
  color: var(--text-muted);
}

.ud-students__head-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: none;
}

.ud-students__menu-wrap {
  position: relative;
}

.ud-students__menu {
  position: absolute;
  z-index: 60;
  top: calc(100% + 6px);
  right: 0;
  min-width: 210px;
  padding: var(--space-2);
  border-radius: var(--r-lg);
  border: 1px solid var(--border);
  background: var(--surface);
  box-shadow: var(--sh-xl);
  animation: ud-pop-in var(--dur-base) var(--ease-out);
  transform-origin: top right;
}

.ud-students__menu-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--r-sm);
  font-size: var(--fs-13);
  color: var(--text-secondary);
  text-align: left;
  transition: background var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard);
}

.ud-students__menu-item:hover {
  background: var(--n-100);
  color: var(--text);
}

.ud-students__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.ud-students__toolbar .ud-search {
  width: 320px;
  flex: none;
}

.ud-students__filter {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.ud-students__filter svg {
  color: var(--text-faint);
}

.ud-students__filter .ud-select {
  width: 232px;
}

.ud-students__person {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
}

.ud-students__person-name {
  display: block;
  font-size: var(--fs-13);
  font-weight: var(--fw-semibold);
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ud-students__person-id {
  display: block;
  font-size: var(--fs-11);
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.ud-students__dept {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
}

.ud-students__dept-code {
  display: block;
  font-size: var(--fs-13);
  font-weight: var(--fw-semibold);
  color: var(--text);
}

.ud-students__dept-name {
  display: block;
  font-size: var(--fs-11);
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ud-students__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.ud-students__form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.ud-students__form-label {
  display: block;
  margin-bottom: var(--space-2);
  font-size: var(--fs-12);
  font-weight: var(--fw-semibold);
  color: var(--text-secondary);
}
`,
);

const DEPARTMENT_OPTIONS = [
  { value: "all", label: "All departments" },
  ...DEPARTMENTS.map((department) => ({
    value: department.id,
    label: department.code,
    meta: department.shortName,
  })),
];

interface AddStudentDraft {
  name: string;
  studentNumber: string;
  departmentId: string;
  section: string;
}

function emptyStudent(): AddStudentDraft {
  return {
    name: "",
    studentNumber: "",
    departmentId: DEPARTMENTS[0]?.id ?? "",
    section: "",
  };
}

export function StudentManagementView() {
  const [students, setStudents] = useState<Student[]>(() => STUDENTS.slice());
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft] = useState<AddStudentDraft>(emptyStudent);
  const [touched, setTouched] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useDismiss(menuRef, menuOpen, () => setMenuOpen(false));

  const visible = useMemo(
    () =>
      students.filter(
        (student) =>
          (department === "all" || student.departmentId === department) &&
          matchesQuery(query, student.name, student.section, student.studentNumber),
      ),
    [students, query, department],
  );

  const draftValid =
    draft.name.trim().length > 0 &&
    draft.studentNumber.trim().length > 0 &&
    draft.section.trim().length > 0;

  const addStudent = () => {
    setTouched(true);
    if (!draftValid) return;
    const student: Student = {
      id: `${draft.departmentId}-new-${Date.now().toString(36)}`,
      name: draft.name.trim(),
      studentNumber: draft.studentNumber.trim(),
      departmentId: draft.departmentId,
      section: draft.section.trim().toUpperCase(),
    };
    setStudents((current) =>
      [student, ...current].sort((a, b) => a.name.localeCompare(b.name, "en")),
    );
    setAddOpen(false);
    setDraft(emptyStudent());
    setTouched(false);
  };

  const columns: ReadonlyArray<DataTableColumn<Student>> = [
    {
      key: "student",
      header: "Student name",
      width: "40%",
      render: (student) => (
        <div className="ud-students__person">
          <Avatar name={student.name} size="sm" tone="soft" />
          <span>
            <span className="ud-students__person-name">{student.name}</span>
            <span className="ud-students__person-id">{student.studentNumber}</span>
          </span>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
      width: "40%",
      render: (student) => {
        const dept = getDepartment(student.departmentId);
        if (!dept) return null;
        return (
          <div className="ud-students__dept">
            <DepartmentLogo department={dept} size="sm" variant="code" />
            <span>
              <span className="ud-students__dept-code">{dept.code}</span>
              <span className="ud-students__dept-name">{dept.name}</span>
            </span>
          </div>
        );
      },
    },
    {
      key: "section",
      header: "Section",
      width: "20%",
      render: (student) => <Chip tone="brand">{student.section}</Chip>,
    },
  ];

  return (
    <div className="ud-students">
      <header className="ud-students__head">
        <div>
          <h1 className="ud-students__title">Student Management</h1>
          <p className="ud-students__subtitle">
            {formatNumber(students.length)}{" "}
            {pluralize(students.length, "student")} across {DEPARTMENTS.length}{" "}
            departments
          </p>
        </div>

        <div className="ud-students__head-actions">
          <div className="ud-students__menu-wrap" ref={menuRef}>
            <GeneralButton
              variant="neutral"
              size="lg"
              icon="download"
              suffix={<Icon name="chevron-down" size={14} />}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              Import / export
            </GeneralButton>

            {menuOpen ? (
              <div className="ud-students__menu" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  className="ud-students__menu-item"
                  onClick={() => {
                    setMenuOpen(false);
                    setNotice("import");
                  }}
                >
                  <Icon name="upload" size={16} />
                  Import from CSV
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="ud-students__menu-item"
                  onClick={() => {
                    setMenuOpen(false);
                    setNotice("export");
                  }}
                >
                  <Icon name="download" size={16} />
                  Export current list
                </button>
              </div>
            ) : null}
          </div>

          <GeneralButton size="lg" icon="plus" onClick={() => setAddOpen(true)}>
            Add student
          </GeneralButton>
        </div>
      </header>

      <div className="ud-students__toolbar">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search name, section, ID..."
          label="Search students"
        />
        <div className="ud-students__filter">
          <Icon name="filter" size={17} />
          <Select
            label="Filter by department"
            value={department}
            options={DEPARTMENT_OPTIONS}
            onChange={setDepartment}
          />
        </div>
      </div>

      <DataTable
        caption="Student roster"
        columns={columns}
        rows={visible}
        rowKey={(student) => student.id}
        empty={
          <EmptyState
            icon="users"
            title="No students match your filters"
            description="Try a different search term or choose another department."
          />
        }
        footer={
          <>
            <span>
              Showing {formatNumber(visible.length)} of{" "}
              {formatNumber(students.length)} students
            </span>
            <span>
              {department === "all"
                ? "All departments"
                : getDepartment(department)?.name}
            </span>
          </>
        }
      />

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add student"
        subtitle="Register a student on the roster."
        icon="user"
        size="md"
        actions={
          <>
            <GeneralButton variant="neutral" onClick={() => setAddOpen(false)}>
              Cancel
            </GeneralButton>
            <GeneralButton onClick={addStudent}>Add student</GeneralButton>
          </>
        }
      >
        <div className="ud-students__form">
          <FloatingLabelInput
            label="Full name (Surname, Given)"
            icon="user"
            value={draft.name}
            error={
              touched && !draft.name.trim() ? "Enter the student's name." : undefined
            }
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <div className="ud-students__form-grid">
            <FloatingLabelInput
              label="Student number"
              value={draft.studentNumber}
              error={
                touched && !draft.studentNumber.trim() ? "Required." : undefined
              }
              onChange={(e) => setDraft({ ...draft, studentNumber: e.target.value })}
            />
            <FloatingLabelInput
              label="Section"
              value={draft.section}
              error={touched && !draft.section.trim() ? "Required." : undefined}
              onChange={(e) => setDraft({ ...draft, section: e.target.value })}
            />
          </div>
          <div>
            <span className="ud-students__form-label">Department</span>
            <Select
              label="Student department"
              size="lg"
              value={draft.departmentId}
              options={DEPARTMENTS.map((d) => ({
                value: d.id,
                label: d.code,
                meta: d.name,
              }))}
              onChange={(departmentId) => setDraft({ ...draft, departmentId })}
            />
          </div>
        </div>
      </Modal>

      <MessageBoxModal
        open={notice !== null}
        tone="info"
        title={notice === "import" ? "Import from CSV" : "Export current list"}
        confirmLabel="Got it"
        cancelLabel="Close"
        message={
          notice === "import" ? (
            <>
              Bulk import reads a CSV of name, student number, department and
              section. The file picker is wired up once the backend is connected.
            </>
          ) : (
            <>
              Export writes the {formatNumber(visible.length)} students currently
              listed to CSV. Connect the backend to enable the download.
            </>
          )
        }
        onClose={() => setNotice(null)}
        onConfirm={() => setNotice(null)}
      />
    </div>
  );
}

export default StudentManagementView;
