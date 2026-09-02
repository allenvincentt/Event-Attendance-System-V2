import { useMemo, useState } from "react";
import { Button } from "@/app/components/Button";
import { DataTable, type Column, type SortState } from "@/app/components/DataTable";
import { EmptyState } from "@/app/components/EmptyState";
import { FilterChips } from "@/app/components/FilterChips";
import { Icon } from "@/app/components/Icon";
import { SearchField } from "@/app/components/SearchField";
import { StatusBadge } from "@/app/components/StatusBadge";
import { EventDetailsModal } from "./EventDetailsModal";
import { EventCreateDeleteModal } from "./EventCreateDeleteModal";
import { useEvents } from "@/data/MockDataProvider";
import { eventDateTimeRange } from "@/data/events";
import type { EventRecord } from "@/data/types";
import { tokens } from "@/app/theme/tokens";
import { formatDateShort, formatWeekday } from "@/app/lib/format";

type Filter = "all" | "ongoing" | "upcoming" | "completed";
const to12 = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

export function EventView() {
  const { events } = useEvents();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState>({ key: "date", dir: "desc" });
  const [details, setDetails] = useState<EventRecord | null>(null);
  const [editing, setEditing] = useState<EventRecord | "new" | null>(null);

  const rows = useMemo(() => {
    let r = events;
    if (filter !== "all") r = r.filter((e) => e.status === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter((e) => e.name.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q));
    }
    return [...r].sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      if (sort.key === "status") return a.status.localeCompare(b.status) * dir;
      return a.date.localeCompare(b.date) * dir;
    });
  }, [events, filter, query, sort]);

  const columns: Column<EventRecord>[] = [
    {
      key: "name", header: "Event name", sortable: false,
      render: (e) => (
        <div style={{ display: "flex", alignItems: "center", gap: tokens.space.sm }}>
          <Icon name="calendar" size={16} />
          <div>
            <div style={{ fontWeight: tokens.font.weight.semibold, color: tokens.color.text.strong }}>{e.name}</div>
            <div style={{ fontSize: tokens.font.size.sm, color: tokens.color.text.muted }}>{e.departmentCodes.length} departments</div>
          </div>
        </div>
      ),
    },
    { key: "venue", header: "Venue", render: (e) => <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="pin" size={14} />{e.venue}</span> },
    { key: "date", header: "Date", sortable: true, render: (e) => { const d = new Date(`${e.date}T00:00:00`); return <div><div>{formatDateShort(d)}</div><div style={{ fontSize: tokens.font.size.sm, color: tokens.color.text.muted }}>{formatWeekday(d)}</div></div>; } },
    { key: "time", header: "Start & end time", render: (e) => { const r = eventDateTimeRange(e); return <div><div>{to12(r.start)} – {to12(r.end)}</div><div style={{ fontSize: tokens.font.size.sm, color: tokens.color.text.muted, textTransform: "capitalize" }}>{e.sessions.map((s) => s.session).join(" · ")}</div></div>; } },
    { key: "status", header: "Status", sortable: true, render: (e) => <StatusBadge kind="event" value={e.status} /> },
    {
      key: "actions", header: "Actions", align: "right",
      render: (e) => (
        <div style={{ display: "inline-flex", gap: tokens.space.xs }} onClick={(ev) => ev.stopPropagation()}>
          <Button size="sm" variant="secondary" icon="eye" onClick={() => setDetails(e)}>View</Button>
          <Button size="sm" variant="secondary" icon="pencil" onClick={() => setEditing(e)}>Edit</Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.space.lg }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: tokens.font.size.h1, color: tokens.color.text.strong }}>Events</h1>
          <p style={{ margin: 0, color: tokens.color.text.muted }}>{events.length} events scheduled</p>
        </div>
        <Button variant="primary" icon="plus" onClick={() => setEditing("new")}>New event</Button>
      </header>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: tokens.space.md, flexWrap: "wrap" }}>
        <SearchField value={query} onChange={setQuery} placeholder="Search event, venue…" />
        <div style={{ display: "flex", alignItems: "center", gap: tokens.space.xs }}>
          <span style={{ fontSize: tokens.font.size.sm, color: tokens.color.text.muted }}>Status</span>
          <FilterChips
            ariaLabel="Filter events by status"
            value={filter}
            onChange={(v) => setFilter(v as Filter)}
            options={[{ value: "all", label: "All" }, { value: "ongoing", label: "Ongoing" }, { value: "upcoming", label: "Upcoming" }, { value: "completed", label: "Completed" }]}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(e) => e.id}
        onRowClick={(e) => setDetails(e)}
        sort={sort}
        onSortChange={setSort}
        cardTitle={(e) => e.name}
        emptyState={<EmptyState icon="calendar" title="No events match" hint="Try a different status or search term." />}
      />

      {details && <EventDetailsModal event={details} open onClose={() => setDetails(null)} onEdit={() => { setEditing(details); setDetails(null); }} />}
      {editing && <EventCreateDeleteModal open mode={editing === "new" ? "create" : "edit"} event={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
