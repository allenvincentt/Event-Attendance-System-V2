import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { DataTable, type DataTableColumn } from "../../components/ui/DataTable";
import { FilterChips } from "../../components/ui/FilterChips";
import { SearchField } from "../../components/ui/Field";
import { Avatar, DepartmentLogo } from "../../components/ui/Avatar";
import { Icon } from "../../components/ui/Icon";
import { IconButton } from "../../components/ui/IconButton";
import { EmptyState } from "../../components/ui/EmptyState";
import { WindowControls } from "../../components/window/WindowControls";
import { WindowFrame, useWindowChrome } from "../../components/window/WindowFrame";
import { getAttendanceSheet, type AttendanceRow } from "../../data/attendance";
import { getDepartment } from "../../data/departments";
import { getEvent } from "../../data/events";
import { SESSION_LABEL, type AttendanceState, type SessionKey } from "../../enums";
import type { Department, EventRecord } from "../../models";
import {
  formatDateShort,
  formatDuration,
  formatNumber,
  formatTimeCompact,
  matchesQuery,
} from "../../lib/format";
import { isTauri, openAttendeesWindow, readWindowParams } from "../../lib/tauriWindow";
import { registerStyle } from "../../lib/registerStyle";

registerStyle(
  "attendees",
  `
.ud-att {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: var(--surface);
}

.ud-att__bar {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: none;
  padding-left: var(--space-5);
  border-bottom: 1px solid var(--border-subtle);
}

.ud-att__ident {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) 0;
  min-width: 0;
}

.ud-att__titles {
  min-width: 0;
}

.ud-att__title {
  font-size: var(--fs-15, 15px);
  font-weight: var(--fw-bold);
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;
}

.ud-att__subtitle {
  font-size: var(--fs-11);
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ud-att__bar-spacer {
  flex: 1;
  align-self: stretch;
  min-width: var(--space-4);
}

.ud-att__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5) var(--space-3);
}

.ud-att__toolbar .ud-search {
  width: 280px;
  flex: none;
}

.ud-att__body {
  flex: 1;
  min-height: 0;
  padding: 0 var(--space-5) var(--space-5);
  display: flex;
}

.ud-att__student {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
}

.ud-att__student-name {
  display: block;
  font-size: var(--fs-13);
  font-weight: var(--fw-semibold);
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ud-att__student-section {
  display: block;
  font-size: var(--fs-11);
  color: var(--text-muted);
}

.ud-att__dept {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--fs-12);
  color: var(--text-secondary);
}

.ud-att__time {
  display: inline-flex;
  align-items: baseline;
  gap: var(--space-2);
  font-variant-numeric: tabular-nums;
}

.ud-att__time svg {
  align-self: center;
  flex: none;
  color: var(--text-faint);
}

.ud-att__time[data-in="true"] svg {
  color: var(--success);
}

.ud-att__time-value {
  font-size: var(--fs-13);
  color: var(--text);
  font-weight: var(--fw-medium);
}

.ud-att__time-meridiem {
  font-size: var(--fs-11);
  color: var(--text-muted);
}

.ud-att__time-dur {
  font-size: var(--fs-11);
  color: var(--text-faint);
}

.ud-att__missing {
  color: var(--text-faint);
}

.ud-att__foot-note {
  font-variant-numeric: tabular-nums;
}

.ud-att__foot-hint {
  color: var(--text-faint);
}

.ud-att__float {
  position: fixed;
  z-index: 300;
  display: flex;
  flex-direction: column;
  width: min(940px, calc(100vw - 80px));
  height: min(620px, calc(100vh - 80px));
  border-radius: var(--r-xl);
  border: 1px solid var(--border);
  background: var(--surface);
  box-shadow: var(--sh-xl);
  overflow: hidden;
  animation: ud-pop-in var(--dur-slow) var(--ease-back);
}
`,
);

type StateFilter = "all" | AttendanceState;

const STATE_FILTERS: ReadonlyArray<{ value: StateFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "present", label: "Present" },
  { value: "no-timeout", label: "No time-out" },
  { value: "absent", label: "Absent" },
];

function TimeCell({
  minutes,
  duration,
  isTimeIn,
}: {
  minutes: number | null;
  duration?: number | null;
  isTimeIn?: boolean;
}) {
  if (minutes === null) {
    return (
      <span className="ud-att__time">
        <Icon name="clock" size={14} />
        <span className="ud-att__missing">{"\u2014"}</span>
      </span>
    );
  }
  const { time, meridiem } = formatTimeCompact(minutes);
  return (
    <span className="ud-att__time" data-in={Boolean(isTimeIn)}>
      <Icon name="clock" size={14} />
      <span className="ud-att__time-value">{time}</span>
      <span className="ud-att__time-meridiem">{meridiem}</span>
      {duration ? (
        <span className="ud-att__time-dur">{formatDuration(duration)}</span>
      ) : null}
    </span>
  );
}

export interface AttendeesPanelProps {
  event: EventRecord;
  department: Department;
  session: SessionKey;
  chrome?: ReactNode;
}

export function AttendeesPanel({
  event,
  department,
  session,
  chrome,
}: AttendeesPanelProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StateFilter>("all");

  const sheet = useMemo(
    () => getAttendanceSheet(event.id, department.id, session),
    [event.id, department.id, session],
  );

  const rows = useMemo(
    () =>
      sheet.rows.filter(
        (row) =>
          (filter === "all" || row.state === filter) &&
          matchesQuery(query, row.student.name, row.student.section, row.student.studentNumber),
      ),
    [sheet.rows, filter, query],
  );

  const columns: ReadonlyArray<DataTableColumn<AttendanceRow>> = [
    {
      key: "student",
      header: "Student name",
      width: "38%",
      render: (row) => (
        <div className="ud-att__student">
          <Avatar name={row.student.name} size="xs" tone="neutral" />
          <span>
            <span className="ud-att__student-name">{row.student.name}</span>
            <span className="ud-att__student-section">{row.student.section}</span>
          </span>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
      width: "20%",
      render: () => (
        <span className="ud-att__dept">
          <DepartmentLogo department={department} size="xs" variant="code" />
          {department.code}
        </span>
      ),
    },
    {
      key: "in",
      header: "Time in",
      width: "21%",
      render: (row) => <TimeCell minutes={row.timeIn} isTimeIn />,
    },
    {
      key: "out",
      header: "Time out",
      width: "21%",
      render: (row) => (
        <TimeCell minutes={row.timeOut} duration={row.duration} />
      ),
    },
  ];

  return (
    <div className="ud-att">
      <div className="ud-att__bar" data-tauri-drag-region>
        <div className="ud-att__ident">
          <DepartmentLogo department={department} size="sm" variant="code" />
          <div className="ud-att__titles">
            <div className="ud-att__title">
              Attendees {"\u2014"} {department.name}
            </div>
            <div className="ud-att__subtitle">
              {event.name} {"\u00b7"} {SESSION_LABEL[session]} session {"\u00b7"}{" "}
              {formatDateShort(event.date)}
            </div>
          </div>
        </div>
        <div className="ud-att__bar-spacer" data-tauri-drag-region />
        {chrome}
      </div>

      <div className="ud-att__toolbar">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search student, section..."
          label="Search attendees"
        />
        <FilterChips
          label=""
          options={STATE_FILTERS}
          value={filter}
          onChange={setFilter}
        />
      </div>

      <div className="ud-att__body">
        <DataTable
          caption={`Attendance for ${department.name}`}
          columns={columns}
          rows={rows}
          rowKey={(row) => row.student.id}
          empty={
            <EmptyState
              icon="users"
              title="No students match your filters"
              description="Clear the search or choose a different attendance state."
            />
          }
          footer={
            <>
              <span className="ud-att__foot-note">
                Showing {formatNumber(rows.length)} of {formatNumber(sheet.total)}{" "}
                {"\u00b7"} {formatNumber(sheet.timedIn)} timed in {"\u00b7"}{" "}
                {formatNumber(sheet.withoutTimeout)} without time-out
              </span>
              <span className="ud-att__foot-hint">
                Non-modal window {"\u2014"} keep it open while you browse other
                departments.
              </span>
            </>
          }
        />
      </div>
    </div>
  );
}

function AttendeesChrome() {
  const { maximized, minimize, toggleMaximize, close } = useWindowChrome();
  return (
    <WindowControls
      maximized={maximized}
      onMinimize={minimize}
      onToggleMaximize={toggleMaximize}
      onClose={close}
    />
  );
}

export function EventAttendeesWindow() {
  const params = readWindowParams();
  const event = getEvent(params.event ?? "");
  const department = getDepartment(params.dept ?? "");
  const session = (params.session ?? "morning") as SessionKey;

  if (!event || !department) {
    return (
      <WindowFrame>
        <EmptyState
          icon="alert"
          title="Attendance sheet unavailable"
          description="This window was opened without a valid event or department."
        />
      </WindowFrame>
    );
  }

  return (
    <WindowFrame>
      <AttendeesPanel
        event={event}
        department={department}
        session={session}
        chrome={<AttendeesChrome />}
      />
    </WindowFrame>
  );
}

export interface AttendeesLauncherProps {
  eventId: string | null;
  departmentId: string | null;
  session: SessionKey | null;
  onClose: () => void;
}

export function AttendeesLauncher({
  eventId,
  departmentId,
  session,
  onClose,
}: AttendeesLauncherProps) {
  const [floating, setFloating] = useState<{
    event: EventRecord;
    department: Department;
    session: SessionKey;
  } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!eventId || !departmentId || !session) {
      setFloating(null);
      return;
    }

    const event = getEvent(eventId);
    const department = getDepartment(departmentId);
    if (!event || !department) {
      setFloating(null);
      return;
    }

    let cancelled = false;
    const label = `attendees-${eventId}-${departmentId}-${session}`;

    void openAttendeesWindow(
      { eventId, departmentId, session },
      label,
      `Attendees - ${department.name}`,
    ).then((opened) => {
      if (cancelled) return;
      if (opened) {
        closeRef.current();
      } else {
        setOffset({ x: 0, y: 0 });
        setFloating({ event, department, session });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [eventId, departmentId, session]);

  if (!floating || isTauri()) return null;

  const onPointerDown = (event: ReactPointerEvent) => {
    drag.current = { x: event.clientX - offset.x, y: event.clientY - offset.y };
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent) => {
    if (!drag.current) return;
    setOffset({
      x: event.clientX - drag.current.x,
      y: event.clientY - drag.current.y,
    });
  };

  const endDrag = () => {
    drag.current = null;
  };

  return (
    <div
      className="ud-att__float"
      role="dialog"
      aria-label={`Attendees for ${floating.department.name}`}
      style={{
        left: "50%",
        top: "50%",
        transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <AttendeesPanel
        event={floating.event}
        department={floating.department}
        session={floating.session}
        chrome={
          <IconButton
            icon="x"
            label="Close attendees window"
            onClick={() => {
              setFloating(null);
              closeRef.current();
            }}
          />
        }
      />
    </div>
  );
}

export default EventAttendeesWindow;
