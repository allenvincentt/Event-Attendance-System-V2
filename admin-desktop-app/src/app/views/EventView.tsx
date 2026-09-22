import { useMemo, useState } from "react";
import { DataTable, type DataTableColumn } from "../../components/ui/DataTable";
import { FilterChips } from "../../components/ui/FilterChips";
import { SearchField } from "../../components/ui/Field";
import { GeneralButton } from "../../components/ui/GeneralButton";
import { StatusBadge } from "../../components/ui/Badge";
import { Icon } from "../../components/ui/Icon";
import { EmptyState } from "../../components/ui/EmptyState";
import { EventDetailsModal } from "./EventDetailsModal";
import { EventCreateDeleteModal } from "./EventCreateDeleteModal";
import { EVENTS } from "../../data/events";
import { enabledSessions, eventSpan } from "../../data/selectors";
import { SESSION_LABEL, type EventStatus } from "../../enums";
import type { EventRecord } from "../../models";
import {
  formatDateShort,
  formatTimeRange,
  formatWeekday,
  matchesQuery,
  pluralize,
} from "../../lib/format";
import { registerStyle } from "../../lib/registerStyle";

registerStyle(
  "event-view",
  `
.ud-events {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  height: 100%;
  min-height: 0;
}

.ud-events__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-5);
}

.ud-events__title {
  font-size: var(--fs-24);
  font-weight: var(--fw-bold);
  letter-spacing: -0.02em;
  color: var(--text);
}

.ud-events__subtitle {
  margin-top: 2px;
  font-size: var(--fs-13);
  color: var(--text-muted);
}

.ud-events__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.ud-events__toolbar .ud-search {
  width: 300px;
  flex: none;
}

.ud-events__name {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.ud-events__stack {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.ud-events__name-tile {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  flex: none;
  border-radius: var(--r-sm);
  background: var(--brand-soft);
  color: var(--brand);
}

.ud-events__name-text {
  min-width: 0;
}

.ud-events__name-main {
  display: block;
  font-size: var(--fs-13);
  font-weight: var(--fw-semibold);
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ud-events__name-sub {
  display: block;
  font-size: var(--fs-11);
  color: var(--text-muted);
}

.ud-events__inline {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.ud-events__inline svg {
  flex: none;
  color: var(--text-faint);
}

.ud-events__inline span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ud-events__stack-main {
  display: block;
  font-size: var(--fs-12);
  color: var(--text);
  white-space: nowrap;
}

.ud-events__stack-sub {
  display: block;
  font-size: var(--fs-11);
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ud-events__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-1);
}

.ud-events__actions .ud-btn {
  height: 28px;
  padding: 0 var(--space-3);
  font-size: var(--fs-11);
  gap: var(--space-1);
}

.ud-events .ud-status {
  font-size: var(--fs-11);
}

`,
);

type StatusFilter = "all" | EventStatus;

const STATUS_FILTERS: ReadonlyArray<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "ongoing", label: "Ongoing" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
];

export function EventView() {
  const [events, setEvents] = useState<EventRecord[]>(() =>
    EVENTS.slice().sort((a, b) => b.date.localeCompare(a.date)),
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<EventRecord | null>(null);

  const visible = useMemo(
    () =>
      events.filter(
        (event) =>
          (status === "all" || event.status === status) &&
          matchesQuery(query, event.name, event.venue),
      ),
    [events, query, status],
  );

  const openCreate = () => {
    setEditing(null);
    setEditorOpen(true);
  };

  const openEdit = (event: EventRecord) => {
    setEditing(event);
    setEditorOpen(true);
  };

  const saveEvent = (record: EventRecord) => {
    setEvents((current) => {
      const exists = current.some((event) => event.id === record.id);
      const next = exists
        ? current.map((event) => (event.id === record.id ? record : event))
        : [record, ...current];
      return next.sort((a, b) => b.date.localeCompare(a.date));
    });
    setEditorOpen(false);
    setEditing(null);
  };

  const deleteEvent = (id: string) => {
    setEvents((current) => current.filter((event) => event.id !== id));
    setEditorOpen(false);
    setEditing(null);
    setDetailsId((current) => (current === id ? null : current));
  };

  const columns: ReadonlyArray<DataTableColumn<EventRecord>> = [
    {
      key: "name",
      header: "Event name",
      width: "156px",
      render: (event) => (
        <div className="ud-events__name">
          <span className="ud-events__name-tile">
            <Icon name="calendar" size={17} />
          </span>
          <span className="ud-events__name-text">
            <span className="ud-events__name-main" title={event.name}>
              {event.name}
            </span>
            <span className="ud-events__name-sub">
              {event.departmentIds.length}{" "}
              {pluralize(event.departmentIds.length, "department")}
            </span>
          </span>
        </div>
      ),
    },
    {
      key: "venue",
      header: "Venue",
      width: "88px",
      render: (event) => (
        <span className="ud-events__inline">
          <Icon name="map-pin" size={15} />
          <span title={event.venue}>{event.venue}</span>
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      width: "112px",
      render: (event) => (
        <span className="ud-events__stack">
          <span className="ud-events__stack-main">
            {formatDateShort(event.date)}
          </span>
          <span className="ud-events__stack-sub">{formatWeekday(event.date)}</span>
        </span>
      ),
    },
    {
      key: "time",
      header: "Start & end time",
      width: "168px",
      render: (event) => {
        const span = eventSpan(event);
        const sessions = enabledSessions(event);
        return (
          <span className="ud-events__inline">
            <Icon name="clock" size={15} />
            <span className="ud-events__stack">
              <span className="ud-events__stack-main">
                {span ? formatTimeRange(span.start, span.end) : "\u2014"}
              </span>
              <span className="ud-events__stack-sub">
                {sessions.length > 0
                  ? sessions.map((s) => SESSION_LABEL[s.key]).join(" \u00b7 ")
                  : "No session"}
              </span>
            </span>
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      width: "104px",
      render: (event) => <StatusBadge status={event.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      width: "156px",
      align: "right",
      render: (event) => (
        <div className="ud-events__actions">
          <GeneralButton
            variant="secondary"
            size="sm"
            icon="eye"
            onClick={() => setDetailsId(event.id)}
          >
            View
          </GeneralButton>
          <GeneralButton
            variant="secondary"
            size="sm"
            icon="pencil"
            onClick={() => openEdit(event)}
          >
            Edit
          </GeneralButton>
        </div>
      ),
    },
  ];

  return (
    <div className="ud-events">
      <header className="ud-events__head">
        <div>
          <h1 className="ud-events__title">Events</h1>
          <p className="ud-events__subtitle">
            {events.length} {pluralize(events.length, "event")} scheduled
          </p>
        </div>
        <GeneralButton icon="plus" size="lg" onClick={openCreate}>
          New event
        </GeneralButton>
      </header>

      <div className="ud-events__toolbar">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search event, venue..."
          label="Search events"
        />
        <FilterChips
          label="Status"
          options={STATUS_FILTERS}
          value={status}
          onChange={setStatus}
        />
      </div>

      <DataTable
        caption="Scheduled events"
        columns={columns}
        rows={visible}
        rowKey={(event) => event.id}
        selectedKey={detailsId}
        onRowSelect={(event) => setDetailsId(event.id)}
        empty={
          <EmptyState
            icon="calendar"
            title="No events match your filters"
            description="Try a different search term or clear the status filter."
          />
        }
      />

      <EventDetailsModal
        eventId={detailsId}
        onClose={() => setDetailsId(null)}
        onEdit={(event) => {
          setDetailsId(null);
          openEdit(event);
        }}
      />

      <EventCreateDeleteModal
        open={editorOpen}
        event={editing}
        onClose={() => {
          setEditorOpen(false);
          setEditing(null);
        }}
        onSave={saveEvent}
        onDelete={deleteEvent}
      />
    </div>
  );
}

export default EventView;
