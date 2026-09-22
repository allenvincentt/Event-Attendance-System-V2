import { useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { Tabs } from "../../components/ui/Tabs";
import { DataTable, type DataTableColumn } from "../../components/ui/DataTable";
import { GeneralButton } from "../../components/ui/GeneralButton";
import { StatusBadge } from "../../components/ui/Badge";
import { DepartmentLogo } from "../../components/ui/Avatar";
import { Icon, type IconName } from "../../components/ui/Icon";
import { EmptyState } from "../../components/ui/EmptyState";
import { AttendeesLauncher } from "./EventAttendeesWindow";
import { getEvent, getTurnout } from "../../data/events";
import { enabledSessions, eventDepartments, eventSpan } from "../../data/selectors";
import { SESSION_LABEL, type SessionKey } from "../../enums";
import type { Department, EventRecord } from "../../models";
import {
  formatDateLong,
  formatNumber,
  formatTimeRange,
  percentOf,
  pluralize,
} from "../../lib/format";
import { registerStyle } from "../../lib/registerStyle";

registerStyle(
  "event-details",
  `
.ud-details__meta {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
  font-size: var(--fs-12);
  color: var(--text-muted);
}

.ud-details__meta-item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.ud-details__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--border-subtle);
  background: var(--surface-alt);
}

.ud-details__stat-label {
  font-size: var(--fs-11);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--text-muted);
}

.ud-details__stat-value {
  margin-top: 2px;
  font-size: var(--fs-16);
  font-weight: var(--fw-bold);
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.ud-details__stat-value--accent {
  color: var(--brand);
}

.ud-details__tabs {
  padding: 0 var(--space-5);
}

.ud-details__session {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-5);
  font-size: var(--fs-12);
  color: var(--text-secondary);
}

.ud-details__session-left {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.ud-details__session-left svg {
  color: var(--text-faint);
  flex: none;
}

.ud-details__session-count {
  color: var(--text-muted);
}

.ud-details__session-right {
  flex: none;
  font-size: var(--fs-11);
  color: var(--text-faint);
}

.ud-details__table {
  padding: 0 var(--space-5) var(--space-5);
  min-height: 0;
  flex: 1;
}

.ud-details__dept {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
}

.ud-details__dept-name {
  display: block;
  font-size: var(--fs-13);
  font-weight: var(--fw-semibold);
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ud-details__dept-code {
  display: block;
  font-size: var(--fs-11);
  color: var(--text-muted);
}
`,
);

const SESSION_ICON: Record<SessionKey, IconName> = {
  morning: "sunrise",
  afternoon: "sun",
  evening: "moon",
};

export interface EventDetailsModalProps {
  eventId: string | null;
  onClose: () => void;
  onEdit: (event: EventRecord) => void;
}

export function EventDetailsModal({
  eventId,
  onClose,
  onEdit,
}: EventDetailsModalProps) {
  const event = eventId ? getEvent(eventId) : undefined;
  const turnout = eventId ? getTurnout(eventId) : undefined;
  const active = useMemo(() => (event ? enabledSessions(event) : []), [event]);
  const [session, setSession] = useState<SessionKey>("morning");
  const [attendees, setAttendees] = useState<{
    departmentId: string;
    session: SessionKey;
  } | null>(null);
  const closeAttendees = useCallback(() => setAttendees(null), []);

  useEffect(() => {
    if (active.length > 0) setSession(active[0].key);
  }, [active]);

  if (!event || !eventId) return null;

  const departments = eventDepartments(event);
  const span = eventSpan(event);
  const invited = turnout?.invited ?? 0;
  const rate = turnout ? percentOf(turnout.attended, turnout.invited) : 0;

  const schedule = event.sessions.find((item) => item.key === session);
  const sessionTurnout = turnout?.sessions.find((item) => item.key === session);
  const timedIn = sessionTurnout?.timedIn ?? 0;
  const sessionRate = invited > 0 ? percentOf(timedIn, invited) : 0;

  const columns: ReadonlyArray<DataTableColumn<Department>> = [
    {
      key: "department",
      header: "Department name",
      render: (department) => (
        <div className="ud-details__dept">
          <DepartmentLogo department={department} size="sm" variant="code" />
          <span>
            <span className="ud-details__dept-name">{department.name}</span>
            <span className="ud-details__dept-code">{department.code}</span>
          </span>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      width: "180px",
      align: "right",
      render: (department) => (
        <GeneralButton
          variant="secondary"
          size="sm"
          icon="eye"
          onClick={() =>
            setAttendees({ departmentId: department.id, session })
          }
        >
          View Attendees
        </GeneralButton>
      ),
    },
  ];

  return (
    <>
      <Modal
        open={Boolean(eventId)}
        onClose={onClose}
        size="lg"
        height="min(720px, 100%)"
        padded={false}
        title={event.name}
        headerRight={<StatusBadge status={event.status} appearance="filled" />}
        subtitle={
          <span className="ud-details__meta">
            <span className="ud-details__meta-item">
              <Icon name="calendar" size={14} />
              {formatDateLong(event.date)}
            </span>
            <span className="ud-details__meta-item">
              <Icon name="map-pin" size={14} />
              {event.venue}
            </span>
            {span ? (
              <span className="ud-details__meta-item">
                <Icon name="clock" size={14} />
                {formatTimeRange(span.start, span.end)}
              </span>
            ) : null}
          </span>
        }
        footerNote={
          schedule
            ? `${SESSION_LABEL[session]} session \u00b7 ${formatTimeRange(schedule.start, schedule.end)}`
            : "No session scheduled"
        }
        actions={
          <>
            <GeneralButton variant="neutral" onClick={() => onEdit(event)}>
              Edit event
            </GeneralButton>
            <GeneralButton onClick={onClose}>Close</GeneralButton>
          </>
        }
      >
        <div className="ud-details__stats">
          <div>
            <div className="ud-details__stat-label">Departments</div>
            <div className="ud-details__stat-value">{departments.length}</div>
          </div>
          <div>
            <div className="ud-details__stat-label">Students invited</div>
            <div className="ud-details__stat-value">{formatNumber(invited)}</div>
          </div>
          <div>
            <div className="ud-details__stat-label">Sessions</div>
            <div className="ud-details__stat-value">
              {active.length > 0
                ? active.map((item) => SESSION_LABEL[item.key]).join(", ")
                : "\u2014"}
            </div>
          </div>
          <div>
            <div className="ud-details__stat-label">Overall turnout</div>
            <div className="ud-details__stat-value ud-details__stat-value--accent">
              {rate.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="ud-details__tabs">
          <Tabs
            label="Session"
            value={session}
            onChange={setSession}
            items={event.sessions.map((item) => ({
              value: item.key,
              label: SESSION_LABEL[item.key],
              icon: SESSION_ICON[item.key],
              disabled: !item.enabled,
            }))}
          />
        </div>

        <div className="ud-details__session">
          <span className="ud-details__session-left">
            <Icon name="clock" size={14} />
            {schedule ? (
              <>
                {formatTimeRange(schedule.start, schedule.end)}
                <span className="ud-details__session-count">
                  {" \u00b7 "}
                  {formatNumber(timedIn)} of {formatNumber(invited)} students timed
                  in ({sessionRate.toFixed(1)}%)
                </span>
              </>
            ) : (
              <span className="ud-details__session-count">Not scheduled</span>
            )}
          </span>
          <span className="ud-details__session-right">
            {departments.length} {pluralize(departments.length, "department")}
          </span>
        </div>

        <div className="ud-details__table">
          <DataTable
            caption={`Departments taking part in ${event.name}`}
            columns={columns}
            rows={departments}
            rowKey={(department) => department.id}
            empty={
              <EmptyState
                icon="building"
                title="No departments assigned"
                description="Edit this event to add the colleges taking part."
              />
            }
          />
        </div>
      </Modal>

      <AttendeesLauncher
        eventId={attendees ? eventId : null}
        departmentId={attendees?.departmentId ?? null}
        session={attendees?.session ?? null}
        onClose={closeAttendees}
      />
    </>
  );
}

export default EventDetailsModal;
