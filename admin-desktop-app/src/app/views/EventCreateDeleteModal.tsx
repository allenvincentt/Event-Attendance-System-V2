import { useMemo, useState } from "react";
import { Button } from "@/app/components/Button";
import { Checkbox } from "@/app/components/Checkbox";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";
import { DateField } from "@/app/components/DateField";
import { DepartmentLogo } from "@/app/components/DepartmentLogo";
import { FloatingLabelInput } from "@/app/components/FloatingLabelInput";
import { Modal } from "@/app/components/Modal";
import { Select } from "@/app/components/Select";
import { StatusBadge } from "@/app/components/StatusBadge";
import { Stepper } from "@/app/components/Stepper";
import { TimeStampField } from "@/app/components/TimeStampField";
import { Toggle } from "@/app/components/Toggle";
import { useToast } from "@/app/components/Toast";
import { DEPARTMENTS } from "@/data/departments";
import { departmentEnrolment } from "@/data/attendance";
import { useEvents } from "@/data/MockDataProvider";
import type { EventRecord, EventStatus, Session, SessionSchedule } from "@/data/types";
import { tokens } from "@/app/theme/tokens";
import { formatDateLong, formatNumber } from "@/app/lib/format";

const SESSIONS: { key: Session; label: string; start: string; end: string }[] = [
  { key: "morning", label: "Morning", start: "08:00", end: "12:00" },
  { key: "afternoon", label: "Afternoon", start: "13:00", end: "17:00" },
  { key: "evening", label: "Evening", start: "18:00", end: "21:00" },
];
const STATUSES: EventStatus[] = ["upcoming", "ongoing", "completed", "draft", "cancelled"];

interface Props { open: boolean; mode: "create" | "edit"; event?: EventRecord; onClose: () => void; }

export function EventCreateDeleteModal({ open, mode, event, onClose }: Props) {
  const { addEvent, updateEvent, deleteEvent } = useEvents();
  const { show } = useToast();
  const [step, setStep] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState(event?.name ?? "");
  const [venue, setVenue] = useState(event?.venue ?? "");
  const [date, setDate] = useState(event?.date ?? new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<EventStatus>(event?.status ?? "upcoming");
  const [sessions, setSessions] = useState<Record<Session, SessionSchedule | null>>(() => {
    const base: Record<Session, SessionSchedule | null> = { morning: null, afternoon: null, evening: null };
    (event?.sessions ?? [{ session: "morning", start: "08:00", end: "12:00" }]).forEach((s) => { base[s.session] = s; });
    return base;
  });
  const [depts, setDepts] = useState<Set<string>>(new Set(event?.departmentCodes ?? []));

  const activeSessions = SESSIONS.filter((s) => sessions[s.key]);
  const studentTotal = useMemo(() => [...depts].reduce((n, c) => n + departmentEnrolment(c), 0), [depts]);

  const canProceed = [
    name.trim().length > 0 && venue.trim().length > 0 && !!date && activeSessions.length > 0,
    depts.size > 0,
    true,
  ];

  const submit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 250));
    const payload = {
      name: name.trim(), venue: venue.trim(), date, status,
      sessions: activeSessions.map((s) => sessions[s.key]!) as SessionSchedule[],
      departmentCodes: [...depts],
    };
    if (mode === "edit" && event) { updateEvent(event.id, payload); show({ kind: "success", message: "Changes saved" }); }
    else { addEvent(payload); show({ kind: "success", message: "Event created" }); }
    setSubmitting(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} width={720} title={mode === "edit" ? "Edit event" : "Create event"}>
      <Stepper
        step={step}
        onStepChange={setStep}
        title={mode === "edit" ? "Edit event" : "Create event"}
        subtitle="Three quick steps to publish an event."
        canProceed={canProceed}
        submitLabel={mode === "edit" ? "Save changes" : "Create event"}
        submitting={submitting}
        onSubmit={submit}
        onCancel={onClose}
        steps={[
          {
            key: "details", label: "Event details",
            content: (
              <div style={{ display: "flex", flexDirection: "column", gap: tokens.space.md }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: tokens.space.md }}>
                  <FloatingLabelInput label="Name of event" value={name} onChange={setName} />
                  <FloatingLabelInput label="Venue" value={venue} onChange={setVenue} icon="pin" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: tokens.space.md }}>
                  <DateField label="Date" value={date} onChange={setDate} />
                  <Select ariaLabel="Status" value={status} onChange={(v) => setStatus(v as EventStatus)} options={STATUSES.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))} />
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong style={{ fontSize: tokens.font.size.bodySm }}>Time stamps</strong>
                    <span style={{ fontSize: tokens.font.size.sm, color: tokens.color.brand.primary }}>{activeSessions.length} session on</span>
                  </div>
                  {SESSIONS.map((s) => (
                    <div key={s.key} style={{ display: "flex", alignItems: "center", gap: tokens.space.sm, padding: `${tokens.space.xs}px 0` }}>
                      <Toggle label={`${s.label} session`} checked={!!sessions[s.key]} onChange={(on) => setSessions((prev) => ({ ...prev, [s.key]: on ? { session: s.key, start: s.start, end: s.end } : null }))} />
                      <TimeStampField
                        label={s.label}
                        start={sessions[s.key]?.start ?? s.start}
                        end={sessions[s.key]?.end ?? s.end}
                        disabled={!sessions[s.key]}
                        onChange={(next) => setSessions((prev) => ({ ...prev, [s.key]: { session: s.key, ...next } }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ),
          },
          {
            key: "departments", label: "Departments",
            content: (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: tokens.space.sm }}>
                  <strong>Choose departments</strong>
                  <span style={{ fontSize: tokens.font.size.sm, color: tokens.color.text.muted }}>{depts.size} of {DEPARTMENTS.length} selected</span>
                  <Checkbox label="Select all" checked={depts.size === DEPARTMENTS.length} indeterminate={depts.size > 0 && depts.size < DEPARTMENTS.length} onChange={(on) => setDepts(on ? new Set(DEPARTMENTS.map((d) => d.code)) : new Set())} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: tokens.space.sm }}>
                  {DEPARTMENTS.map((d) => {
                    const on = depts.has(d.code);
                    return (
                      <label key={d.code} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: tokens.space.xs, padding: tokens.space.sm, border: `2px solid ${on ? tokens.color.brand.primary : tokens.color.border.default}`, borderRadius: tokens.radius.md, cursor: "pointer" }}>
                        <Checkbox label={d.code} checked={on} onChange={() => setDepts((prev) => { const n = new Set(prev); n.has(d.code) ? n.delete(d.code) : n.add(d.code); return n; })} />
                        <DepartmentLogo code={d.code} size="lg" />
                        <strong style={{ fontSize: tokens.font.size.sm }}>{d.code}</strong>
                        <span style={{ fontSize: tokens.font.size.xs, color: tokens.color.text.muted, textAlign: "center" }}>{d.shortName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ),
          },
          {
            key: "review", label: "Review",
            content: (
              <div style={{ display: "flex", flexDirection: "column", gap: tokens.space.md }}>
                <div style={{ padding: tokens.space.md, border: `1px solid ${tokens.color.border.default}`, borderRadius: tokens.radius.md }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong style={{ fontSize: tokens.font.size.subtitle }}>{name || "Untitled event"}</strong>
                    <StatusBadge kind="event" value={status} />
                  </div>
                  <div style={{ color: tokens.color.text.muted, fontSize: tokens.font.size.sm }}>{venue} · {formatDateLong(new Date(`${date}T00:00:00`))}</div>
                </div>
                <div style={{ display: "flex", gap: tokens.space.lg, flexWrap: "wrap" }}>
                  <div><div style={{ fontSize: tokens.font.size.xs, textTransform: "uppercase", color: tokens.color.text.muted }}>Time stamps</div>{activeSessions.map((s) => <div key={s.key} style={{ fontSize: tokens.font.size.bodySm }}>{s.label}</div>)}</div>
                  <div><div style={{ fontSize: tokens.font.size.xs, textTransform: "uppercase", color: tokens.color.text.muted }}>Departments · {formatNumber(studentTotal)} students</div><div style={{ fontSize: tokens.font.size.bodySm }}>{depts.size} department{depts.size === 1 ? "" : "s"}</div></div>
                </div>
                <p style={{ margin: 0, padding: tokens.space.sm, background: tokens.color.brand.gold, borderRadius: tokens.radius.md, fontSize: tokens.font.size.sm }}>Attendance sheets are generated per department for every session you switched on.</p>
              </div>
            ),
          },
        ]}
      />

      {mode === "edit" && event && (
        <div style={{ marginTop: tokens.space.md, textAlign: "right" }}>
          <Button variant="ghost" icon="trash" onClick={() => setConfirmDelete(true)}>Delete event</Button>
        </div>
      )}
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => { if (event) { deleteEvent(event.id); show({ kind: "success", message: "Event deleted" }); onClose(); } }}
        title="Delete event"
        message={<>Remove “{event?.name}”? This cannot be undone.</>}
      />
    </Modal>
  );
}
