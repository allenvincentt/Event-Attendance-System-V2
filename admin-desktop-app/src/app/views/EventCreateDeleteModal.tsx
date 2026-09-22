import { useEffect, useMemo, useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { MessageBoxModal } from "../../components/ui/MessageBoxModal";
import { Stepper, type StepDefinition } from "../../components/ui/Stepper";
import { GeneralButton } from "../../components/ui/GeneralButton";
import { Chip, StatusBadge } from "../../components/ui/Badge";
import { DepartmentLogo } from "../../components/ui/Avatar";
import { Icon, type IconName } from "../../components/ui/Icon";
import {
  Checkbox,
  DateField,
  FloatingLabelInput,
  Select,
  TimeField,
  Toggle,
} from "../../components/ui/Field";
import { DEPARTMENTS } from "../../data/departments";
import { defaultSessions } from "../../data/events";
import {
  EVENT_STATUSES,
  EVENT_STATUS_LABEL,
  SESSION_LABEL,
  type EventStatus,
  type SessionKey,
} from "../../enums";
import type { EventRecord, SessionSchedule } from "../../models";
import {
  formatDateLong,
  formatNumber,
  formatTimeRange,
  pluralize,
  toISODate,
} from "../../lib/format";
import { registerStyle } from "../../lib/registerStyle";

registerStyle(
  "event-editor",
  `
.ud-wiz__steps {
  padding: var(--space-4) var(--space-5) var(--space-2);
  border-bottom: 1px solid var(--border-subtle);
}

.ud-wiz__hint {
  padding: var(--space-3) var(--space-5);
  font-size: var(--fs-12);
  color: var(--text-muted);
  background: var(--surface-alt);
  border-bottom: 1px solid var(--border-subtle);
}

.ud-wiz__pane {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  animation: ud-slide-in-right var(--dur-slow) var(--ease-out);
}

.ud-wiz__pane[data-direction="back"] {
  animation-name: ud-slide-in-left;
}

.ud-wiz__section-title {
  font-size: var(--fs-15, 15px);
  font-weight: var(--fw-bold);
  color: var(--text);
}

.ud-wiz__section-sub {
  margin-top: 2px;
  font-size: var(--fs-12);
  color: var(--text-muted);
}

.ud-wiz__section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
}

.ud-wiz__grid2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.ud-wiz__field-label {
  display: block;
  margin-bottom: var(--space-2);
  font-size: var(--fs-12);
  font-weight: var(--fw-semibold);
  color: var(--text-secondary);
}

.ud-wiz__divider {
  height: 1px;
  background: var(--border-subtle);
}

.ud-wiz__sessions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.ud-wiz__session {
  display: grid;
  grid-template-columns: 22px 44px 96px 1fr auto;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  background: var(--surface);
  transition:
    border-color var(--dur-base) var(--ease-standard),
    background var(--dur-base) var(--ease-standard),
    box-shadow var(--dur-base) var(--ease-out);
}

.ud-wiz__session[data-on="true"] {
  border-color: var(--red-200);
  background: var(--brand-soft);
  box-shadow: var(--sh-xs);
}

.ud-wiz__session-icon {
  display: grid;
  place-items: center;
  color: var(--text-faint);
}

.ud-wiz__session[data-on="true"] .ud-wiz__session-icon {
  color: var(--brand);
}

.ud-wiz__session-name {
  font-size: var(--fs-13);
  font-weight: var(--fw-semibold);
  color: var(--text-secondary);
}

.ud-wiz__session[data-on="true"] .ud-wiz__session-name {
  color: var(--text);
}

.ud-wiz__session-times {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.ud-wiz__session-times[data-off="true"] {
  opacity: 0.5;
}

.ud-wiz__time-group {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--fs-12);
  color: var(--text-muted);
}

.ud-wiz__session-range {
  justify-self: end;
  font-size: var(--fs-12);
  font-weight: var(--fw-semibold);
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.ud-wiz__session[data-on="false"] .ud-wiz__session-range {
  color: var(--text-faint);
  font-weight: var(--fw-regular);
}
`,
);

registerStyle(
  "event-editor-depts",
  `
.ud-wiz__depts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-4);
}

.ud-wiz__dept {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-3);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  background: var(--surface);
  text-align: center;
  transition:
    border-color var(--dur-base) var(--ease-standard),
    background var(--dur-base) var(--ease-standard),
    box-shadow var(--dur-base) var(--ease-out),
    transform var(--dur-fast) var(--ease-out);
}

.ud-wiz__dept:hover {
  border-color: var(--red-200);
  box-shadow: var(--sh-md);
  transform: translateY(-3px);
}

.ud-wiz__dept:active {
  transform: scale(0.98);
}

.ud-wiz__dept[aria-pressed="true"] {
  border-color: var(--brand);
  background: var(--brand-soft);
  box-shadow: 0 8px 20px rgba(178, 10, 7, 0.14);
}

.ud-wiz__dept:focus-visible {
  box-shadow: var(--focus-ring);
}

.ud-wiz__dept-mark {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--grad-brand);
  color: #fff;
  opacity: 0;
  transform: scale(0.5);
  transition:
    opacity var(--dur-fast) var(--ease-out),
    transform var(--dur-base) var(--ease-spring);
}

.ud-wiz__dept[aria-pressed="true"] .ud-wiz__dept-mark {
  opacity: 1;
  transform: scale(1);
}

.ud-wiz__dept-code {
  font-size: var(--fs-13);
  font-weight: var(--fw-bold);
  color: var(--text);
}

.ud-wiz__dept[aria-pressed="true"] .ud-wiz__dept-code {
  color: var(--brand);
}

.ud-wiz__dept-name {
  font-size: var(--fs-11);
  color: var(--text-muted);
  line-height: 1.35;
}

.ud-wiz__review {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.ud-wiz__review-card {
  padding: var(--space-4) var(--space-5);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  background: var(--surface);
}

.ud-wiz__review-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
}

.ud-wiz__review-label {
  font-size: var(--fs-11);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--text-muted);
}

.ud-wiz__review-name {
  margin-top: var(--space-1);
  font-size: var(--fs-20);
  font-weight: var(--fw-bold);
  color: var(--text);
  letter-spacing: -0.015em;
  word-break: break-word;
}

.ud-wiz__review-meta {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
  margin-top: var(--space-3);
  font-size: var(--fs-12);
  color: var(--text-muted);
}

.ud-wiz__review-meta span {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.ud-wiz__review-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.ud-wiz__review-rows {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.ud-wiz__review-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  font-size: var(--fs-13);
  color: var(--text-secondary);
}

.ud-wiz__review-row b {
  font-weight: var(--fw-semibold);
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.ud-wiz__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.ud-wiz__note {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--r-md);
  background: var(--warning-bg);
  border: 1px solid var(--gold-200);
  font-size: var(--fs-12);
  color: var(--gold-800);
}

.ud-wiz__note svg {
  flex: none;
  color: var(--gold-600);
  margin-top: 1px;
}

.ud-wiz__count {
  flex: none;
}
`,
);

const STEPS: StepDefinition[] = [
  { key: "details", label: "Event details", icon: "calendar" },
  { key: "departments", label: "Departments", icon: "users" },
  { key: "review", label: "Review", icon: "eye" },
];

const STEP_HINTS = [
  "Event name, venue, date, status and session time stamps.",
  "Colleges and departments taking part.",
  "Final check before the event is saved.",
];

const SESSION_ICON: Record<SessionKey, IconName> = {
  morning: "sunrise",
  afternoon: "sun",
  evening: "moon",
};

const STATUS_OPTIONS = EVENT_STATUSES.map((status) => ({
  value: status,
  label: EVENT_STATUS_LABEL[status],
}));

interface Draft {
  id: string;
  name: string;
  venue: string;
  date: string;
  status: EventStatus;
  departmentIds: string[];
  sessions: SessionSchedule[];
}

function emptyDraft(): Draft {
  return {
    id: "",
    name: "",
    venue: "",
    date: toISODate(new Date()),
    status: "upcoming",
    departmentIds: [],
    sessions: defaultSessions(["morning"]),
  };
}

function draftFrom(event: EventRecord): Draft {
  return {
    id: event.id,
    name: event.name,
    venue: event.venue,
    date: event.date,
    status: event.status,
    departmentIds: [...event.departmentIds],
    sessions: event.sessions.map((session) => ({ ...session })),
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export interface EventCreateDeleteModalProps {
  open: boolean;
  event: EventRecord | null;
  onClose: () => void;
  onSave: (event: EventRecord) => void;
  onDelete: (id: string) => void;
}

export function EventCreateDeleteModal({
  open,
  event,
  onClose,
  onSave,
  onDelete,
}: EventCreateDeleteModalProps) {
  const isEdit = Boolean(event);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"next" | "back">("next");
  const [draft, setDraft] = useState<Draft>(() =>
    event ? draftFrom(event) : emptyDraft(),
  );
  const [touched, setTouched] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDraft(event ? draftFrom(event) : emptyDraft());
    setStep(0);
    setDirection("next");
    setTouched(false);
  }, [open, event]);

  const activeSessions = draft.sessions.filter((session) => session.enabled);
  const selectedDepartments = useMemo(
    () => DEPARTMENTS.filter((d) => draft.departmentIds.includes(d.id)),
    [draft.departmentIds],
  );
  const headCount = selectedDepartments.reduce((acc, d) => acc + d.enrolled, 0);

  const detailsValid =
    draft.name.trim().length > 0 &&
    draft.venue.trim().length > 0 &&
    activeSessions.length > 0;
  const departmentsValid = draft.departmentIds.length > 0;
  const canAdvance = step === 0 ? detailsValid : step === 1 ? departmentsValid : true;

  const patch = (changes: Partial<Draft>) =>
    setDraft((current) => ({ ...current, ...changes }));

  const patchSession = (key: SessionKey, changes: Partial<SessionSchedule>) =>
    setDraft((current) => ({
      ...current,
      sessions: current.sessions.map((session) =>
        session.key === key ? { ...session, ...changes } : session,
      ),
    }));

  const toggleDepartment = (id: string) =>
    setDraft((current) => ({
      ...current,
      departmentIds: current.departmentIds.includes(id)
        ? current.departmentIds.filter((value) => value !== id)
        : [...current.departmentIds, id],
    }));

  const allSelected = draft.departmentIds.length === DEPARTMENTS.length;

  const goNext = () => {
    setTouched(true);
    if (!canAdvance) return;
    if (step < STEPS.length - 1) {
      setDirection("next");
      setStep((value) => value + 1);
      setTouched(false);
    } else {
      onSave({
        id: draft.id || `${slugify(draft.name)}-${Date.now().toString(36)}`,
        name: draft.name.trim(),
        venue: draft.venue.trim(),
        date: draft.date,
        status: draft.status,
        departmentIds: draft.departmentIds,
        sessions: draft.sessions,
      });
    }
  };

  const goBack = () => {
    if (step === 0) return;
    setDirection("back");
    setStep((value) => value - 1);
    setTouched(false);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        size="lg"
        height="min(760px, 100%)"
        padded={false}
        icon="calendar"
        title={isEdit ? "Edit event" : "Create event"}
        subtitle="Three quick steps to publish an event."
        headerRight={
          <Chip tone="outline" className="ud-wiz__count">
            {step + 1}/{STEPS.length}
          </Chip>
        }
        footerNote={`Step ${step + 1} of ${STEPS.length} \u2014 ${STEPS[step].label.toLowerCase()}`}
        actions={
          <>
            {isEdit ? (
              <GeneralButton
                variant="ghost"
                icon="trash"
                onClick={() => setConfirmDelete(true)}
              >
                Delete
              </GeneralButton>
            ) : null}
            <GeneralButton variant="ghost" onClick={onClose}>
              Cancel
            </GeneralButton>
            <GeneralButton variant="neutral" onClick={goBack} disabled={step === 0}>
              Back
            </GeneralButton>
            <GeneralButton onClick={goNext} disabled={touched && !canAdvance}>
              {step === STEPS.length - 1
                ? isEdit
                  ? "Save changes"
                  : "Create event"
                : "Next"}
            </GeneralButton>
          </>
        }
      >
        <div className="ud-wiz__steps">
          <Stepper steps={STEPS} current={step} />
        </div>
        <p className="ud-wiz__hint">{STEP_HINTS[step]}</p>

        {step === 0 ? (
          <div className="ud-wiz__pane" data-direction={direction} key="details">
            <div>
              <h3 className="ud-wiz__section-title">Event details</h3>
              <p className="ud-wiz__section-sub">
                Name, place and date are required.
              </p>
            </div>

            <div className="ud-wiz__grid2">
              <FloatingLabelInput
                label="Name of event"
                icon="calendar"
                value={draft.name}
                error={
                  touched && !draft.name.trim() ? "Give the event a name." : undefined
                }
                onChange={(e) => patch({ name: e.target.value })}
              />
              <FloatingLabelInput
                label="Venue"
                icon="map-pin"
                value={draft.venue}
                error={
                  touched && !draft.venue.trim() ? "Where does it happen?" : undefined
                }
                onChange={(e) => patch({ venue: e.target.value })}
              />
            </div>

            <div className="ud-wiz__grid2">
              <div>
                <span className="ud-wiz__field-label">Date</span>
                <DateField
                  label="Event date"
                  value={draft.date}
                  onChange={(date) => patch({ date })}
                />
              </div>
              <div>
                <span className="ud-wiz__field-label">Status</span>
                <Select
                  label="Event status"
                  size="lg"
                  value={draft.status}
                  options={STATUS_OPTIONS}
                  onChange={(status) => patch({ status })}
                />
              </div>
            </div>

            <div className="ud-wiz__divider" />

            <div className="ud-wiz__section-head">
              <div>
                <h3 className="ud-wiz__section-title">Time stamps</h3>
                <p className="ud-wiz__section-sub">
                  Switch on only the sessions this event runs {"\u2014"} morning,
                  afternoon, evening, or any mix.
                </p>
              </div>
              <Chip tone={activeSessions.length > 0 ? "brand" : "outline"}>
                {activeSessions.length}{" "}
                {pluralize(activeSessions.length, "session")} on
              </Chip>
            </div>

            {touched && activeSessions.length === 0 ? (
              <p className="ud-field__help ud-field__help--error">
                <Icon name="alert" size={13} />
                Switch on at least one session.
              </p>
            ) : null}

            <div className="ud-wiz__sessions">
              {draft.sessions.map((session) => (
                <div
                  className="ud-wiz__session"
                  key={session.key}
                  data-on={session.enabled}
                >
                  <span className="ud-wiz__session-icon">
                    <Icon name={SESSION_ICON[session.key]} size={18} />
                  </span>
                  <Toggle
                    checked={session.enabled}
                    label={`${SESSION_LABEL[session.key]} session`}
                    onChange={(enabled) => patchSession(session.key, { enabled })}
                  />
                  <span className="ud-wiz__session-name">
                    {SESSION_LABEL[session.key]}
                  </span>
                  <span
                    className="ud-wiz__session-times"
                    data-off={!session.enabled}
                  >
                    <span className="ud-wiz__time-group">
                      Start
                      <TimeField
                        label={`${SESSION_LABEL[session.key]} start`}
                        value={session.start}
                        disabled={!session.enabled}
                        onChange={(start) => patchSession(session.key, { start })}
                      />
                    </span>
                    <span className="ud-wiz__time-group">
                      End
                      <TimeField
                        label={`${SESSION_LABEL[session.key]} end`}
                        value={session.end}
                        disabled={!session.enabled}
                        onChange={(end) => patchSession(session.key, { end })}
                      />
                    </span>
                  </span>
                  <span className="ud-wiz__session-range">
                    {session.enabled
                      ? formatTimeRange(session.start, session.end)
                      : "Not scheduled"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="ud-wiz__pane" data-direction={direction} key="departments">
            <div className="ud-wiz__section-head">
              <div>
                <h3 className="ud-wiz__section-title">Choose departments</h3>
                <p className="ud-wiz__section-sub">
                  Pick every college or department that takes part.
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-4)",
                }}
              >
                <Chip tone={departmentsValid ? "brand" : "outline"}>
                  {draft.departmentIds.length} of {DEPARTMENTS.length} selected
                </Chip>
                <Checkbox
                  checked={allSelected}
                  indeterminate={draft.departmentIds.length > 0}
                  label="Select all"
                  onChange={(checked) =>
                    patch({
                      departmentIds: checked ? DEPARTMENTS.map((d) => d.id) : [],
                    })
                  }
                />
              </div>
            </div>

            {touched && !departmentsValid ? (
              <p className="ud-field__help ud-field__help--error">
                <Icon name="alert" size={13} />
                Select at least one department.
              </p>
            ) : null}

            <div className="ud-wiz__depts">
              {DEPARTMENTS.map((department) => {
                const selected = draft.departmentIds.includes(department.id);
                return (
                  <button
                    type="button"
                    key={department.id}
                    className="ud-wiz__dept"
                    aria-pressed={selected}
                    onClick={() => toggleDepartment(department.id)}
                  >
                    <span className="ud-wiz__dept-mark">
                      <Icon name="check" size={13} strokeWidth={3} />
                    </span>
                    <DepartmentLogo department={department} size="lg" ring />
                    <span className="ud-wiz__dept-code">{department.code}</span>
                    <span className="ud-wiz__dept-name">
                      {department.shortName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="ud-wiz__pane" data-direction={direction} key="review">
            <div>
              <h3 className="ud-wiz__section-title">Review and confirm</h3>
              <p className="ud-wiz__section-sub">
                Check the details below, then save the event.
              </p>
            </div>

            <div className="ud-wiz__review">
              <div className="ud-wiz__review-card">
                <div className="ud-wiz__review-head">
                  <div>
                    <span className="ud-wiz__review-label">Event</span>
                    <p className="ud-wiz__review-name">
                      {draft.name.trim() || "Untitled event"}
                    </p>
                  </div>
                  <StatusBadge status={draft.status} appearance="filled" />
                </div>
                <div className="ud-wiz__review-meta">
                  <span>
                    <Icon name="map-pin" size={14} />
                    {draft.venue.trim() || "No venue"}
                  </span>
                  <span>
                    <Icon name="calendar" size={14} />
                    {formatDateLong(draft.date)}
                  </span>
                </div>
              </div>

              <div className="ud-wiz__review-grid">
                <div className="ud-wiz__review-card">
                  <span className="ud-wiz__review-label">Time stamps</span>
                  <div className="ud-wiz__review-rows">
                    {activeSessions.length > 0 ? (
                      activeSessions.map((session) => (
                        <div className="ud-wiz__review-row" key={session.key}>
                          <span>{SESSION_LABEL[session.key]}</span>
                          <b>{formatTimeRange(session.start, session.end)}</b>
                        </div>
                      ))
                    ) : (
                      <span className="ud-wiz__section-sub">No session switched on.</span>
                    )}
                  </div>
                </div>

                <div className="ud-wiz__review-card">
                  <div className="ud-wiz__review-head">
                    <span className="ud-wiz__review-label">Departments</span>
                    <span className="ud-wiz__review-label">
                      {formatNumber(headCount)} students
                    </span>
                  </div>
                  <div className="ud-wiz__chips">
                    {selectedDepartments.length > 0 ? (
                      selectedDepartments.map((department) => (
                        <Chip
                          key={department.id}
                          tone="brand"
                          title={department.name}
                        >
                          <DepartmentLogo
                            department={department}
                            size="xs"
                            variant="code"
                          />
                          {department.shortName}
                        </Chip>
                      ))
                    ) : (
                      <span className="ud-wiz__section-sub">
                        No department selected.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="ud-wiz__note">
                <Icon name="info" size={15} />
                Attendance sheets are generated per department for every session you
                switched on.
              </p>
            </div>
          </div>
        ) : null}
      </Modal>

      <MessageBoxModal
        open={confirmDelete}
        tone="danger"
        title="Delete this event?"
        confirmLabel="Delete event"
        message={
          <>
            <strong>{event?.name}</strong> and every attendance sheet generated for
            it will be removed. This cannot be undone.
          </>
        }
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          if (event) onDelete(event.id);
        }}
      />
    </>
  );
}

export default EventCreateDeleteModal;
