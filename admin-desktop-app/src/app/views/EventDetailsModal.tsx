import { useState } from "react";
import { Button } from "@/app/components/Button";
import { DepartmentLogo } from "@/app/components/DepartmentLogo";
import { Modal } from "@/app/components/Modal";
import { StatusBadge } from "@/app/components/StatusBadge";
import { Tabs } from "@/app/components/Tabs";
import { useDashboard } from "@/data/MockDataProvider";
import { departmentByCode } from "@/data/departments";
import { eventDateTimeRange } from "@/data/events";
import type { EventRecord, Session } from "@/data/types";
import { openAttendeesWindow } from "@/app/lib/window";
import { tokens } from "@/app/theme/tokens";
import { formatDateLong, formatNumber, formatPercent } from "@/app/lib/format";

const ALL: Session[] = ["morning", "afternoon", "evening"];
const LABEL: Record<Session, string> = { morning: "Morning", afternoon: "Afternoon", evening: "Evening" };
const to12 = (hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`; };

export function EventDetailsModal({ event, open, onClose, onEdit }: { event: EventRecord; open: boolean; onClose: () => void; onEdit: () => void }) {
  const d = useDashboard(event.id);
  const scheduled = new Set(event.sessions.map((s) => s.session));
  const [session, setSession] = useState<Session>(event.sessions[0]?.session ?? "evening");
  const range = eventDateTimeRange(event);
  const sessSched = event.sessions.find((s) => s.session === session);

  return (
    <Modal open={open} onClose={onClose} width={940}
      title={<span style={{ display: "inline-flex", alignItems: "center", gap: tokens.space.sm }}>{event.name}<StatusBadge kind="event" value={event.status} /></span>}
      footer={<><Button variant="secondary" onClick={onEdit}>Edit event</Button><Button variant="primary" onClick={onClose}>Close</Button></>}
    >
      <p style={{ marginTop: 0, color: tokens.color.text.muted, fontSize: tokens.font.size.bodySm }}>
        {formatDateLong(new Date(`${event.date}T00:00:00`))} · {event.venue} · {to12(range.start)} – {to12(range.end)}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: tokens.space.md, margin: `${tokens.space.md}px 0` }}>
        <Stat label="Departments" value={String(event.departmentCodes.length)} />
        <Stat label="Students invited" value={formatNumber(d.studentsInvited)} />
        <Stat label="Sessions" value={event.sessions.map((s) => LABEL[s.session]).join(", ")} />
        <Stat label="Overall turnout" value={formatPercent(d.attendanceRate)} />
      </div>

      <Tabs
        value={session}
        onChange={setSession}
        tabs={ALL.map((s) => ({ value: s, label: LABEL[s], disabled: !scheduled.has(s) }))}
      />

      {sessSched && (
        <p style={{ color: tokens.color.text.muted, fontSize: tokens.font.size.bodySm }}>
          {to12(sessSched.start)} – {to12(sessSched.end)} · {formatNumber(d.studentsPresent)} of {formatNumber(d.studentsInvited)} students timed in ({formatPercent(d.attendanceRate)})
        </p>
      )}

      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: tokens.space.xs }}>
        {event.departmentCodes.map((code) => (
          <li key={code} style={{ display: "flex", alignItems: "center", gap: tokens.space.sm, padding: tokens.space.sm, border: `1px solid ${tokens.color.border.default}`, borderRadius: tokens.radius.md }}>
            <DepartmentLogo code={code} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: tokens.font.weight.semibold }}>{departmentByCode(code).name}</div>
              <div style={{ fontSize: tokens.font.size.sm, color: tokens.color.text.muted }}>{code}</div>
            </div>
            <Button size="sm" variant="secondary" icon="eye" onClick={() => void openAttendeesWindow(event.id, code, session)}>View Attendees</Button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: tokens.font.size.xs, textTransform: "uppercase", letterSpacing: 0.5, color: tokens.color.text.muted }}>{label}</div>
      <div style={{ fontSize: tokens.font.size.subtitle, fontWeight: tokens.font.weight.bold, color: tokens.color.text.strong }}>{value}</div>
    </div>
  );
}
