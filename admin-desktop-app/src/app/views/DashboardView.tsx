import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { KpiCard } from "../../components/ui/KpiCard";
import { Select } from "../../components/ui/Field";
import { Icon, type IconName } from "../../components/ui/Icon";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { DonutChart } from "../../components/charts/DonutChart";
import { DepartmentBarChart } from "../../components/charts/DepartmentBarChart";
import { AttendanceTrendChart } from "../../components/charts/AttendanceTrendChart";
import { RankingBars } from "../../components/charts/RankingBars";
import { ScrollReveal } from "../../components/common/motion/ScrollReveal";
import { EmptyState } from "../../components/ui/EmptyState";
import {
  buildDashboardMetrics,
  buildTrend,
  sortedEvents,
} from "../../data/selectors";
import { EVENT_STATUS_LABEL, SESSION_LABEL, type SessionKey } from "../../enums";
import { formatDateShort, formatNumber } from "../../lib/format";
import { registerStyle } from "../../lib/registerStyle";

registerStyle(
  "dashboard",
  `
.ud-dash {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.ud-dash__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-5);
}

.ud-dash__title {
  font-size: var(--fs-24);
  font-weight: var(--fw-bold);
  color: var(--text);
  letter-spacing: -0.02em;
}

.ud-dash__subtitle {
  margin-top: 2px;
  font-size: var(--fs-13);
  color: var(--text-muted);
}

.ud-dash__picker {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: none;
}

.ud-dash__picker-label {
  font-size: var(--fs-13);
  color: var(--text-secondary);
}

.ud-dash__picker .ud-select {
  width: 300px;
}

.ud-dash__kpis {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-4);
}

.ud-dash__split {
  display: grid;
  grid-template-columns: minmax(340px, 1fr) minmax(0, 1.75fr);
  gap: var(--space-4);
  align-items: stretch;
}

.ud-dash__split--even {
  grid-template-columns: minmax(0, 1.35fr) minmax(320px, 1fr);
}

.ud-dash__turnout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.ud-dash__legend {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.ud-dash__legend-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--fs-13);
  color: var(--text-secondary);
}

.ud-dash__legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex: none;
}

.ud-dash__legend-value {
  margin-left: auto;
  font-weight: var(--fw-semibold);
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.ud-dash__sessions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border-subtle);
  border-radius: var(--r-md);
  background: var(--surface-alt);
}

.ud-dash__session {
  display: grid;
  grid-template-columns: 18px 76px 1fr 40px;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--fs-12);
  color: var(--text-secondary);
}

.ud-dash__session[data-off="true"] {
  color: var(--text-faint);
}

.ud-dash__session-icon {
  display: grid;
  place-items: center;
  color: var(--text-faint);
}

.ud-dash__session[data-off="false"] .ud-dash__session-icon {
  color: var(--brand);
}

.ud-dash__session-value {
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-weight: var(--fw-semibold);
  color: var(--text);
}

.ud-dash__session[data-off="true"] .ud-dash__session-value {
  color: var(--text-faint);
  font-weight: var(--fw-regular);
}

.ud-dash__hint {
  font-size: var(--fs-11);
  color: var(--text-faint);
}
`,
);

const SESSION_ICON: Record<SessionKey, IconName> = {
  morning: "sunrise",
  afternoon: "sun",
  evening: "moon",
};

export function DashboardView() {
  const events = useMemo(() => sortedEvents(), []);
  const [eventId, setEventId] = useState(events[0]?.id ?? "");

  const metrics = useMemo(() => buildDashboardMetrics(eventId), [eventId]);
  const trend = useMemo(() => buildTrend(), []);

  const options = useMemo(
    () =>
      events.map((event) => ({
        value: event.id,
        label: event.name,
        meta: formatDateShort(event.date),
      })),
    [events],
  );

  if (!metrics) {
    return (
      <EmptyState
        icon="calendar"
        title="No event selected"
        description="Create an event to start recording attendance."
      />
    );
  }

  const { event, invited, present, rate, series, ranking, sessions } = metrics;
  const activeSessions = sessions.filter((session) => session.enabled);
  const absent = invited - present;

  return (
    <div className="ud-dash">
      <header className="ud-dash__head">
        <div>
          <h1 className="ud-dash__title">Attendance overview</h1>
          <p className="ud-dash__subtitle">Live figures for the event you select.</p>
        </div>
        <div className="ud-dash__picker">
          <span className="ud-dash__picker-label">Event</span>
          <Select
            label="Select event"
            value={eventId}
            options={options}
            onChange={setEventId}
            size="lg"
          />
        </div>
      </header>

      <ScrollReveal className="ud-dash__kpis" duration={520}>
        <KpiCard
          label="Attendance rate"
          value={rate}
          unit="%"
          decimals={1}
          icon="trending-up"
          tone="brand"
          delay={0}
          meta={
            <>
              {EVENT_STATUS_LABEL[event.status]}
              {activeSessions.length > 0 ? (
                <>
                  {" \u00b7 "}
                  {activeSessions.map((s) => SESSION_LABEL[s.key]).join(", ")}
                </>
              ) : null}
            </>
          }
        />
        <KpiCard
          label="Students present"
          value={present}
          icon="users"
          tone="success"
          delay={80}
          meta={<>of {formatNumber(invited)} invited</>}
        />
        <KpiCard
          label="Departments"
          value={metrics.departmentCount}
          icon="building"
          tone="accent"
          delay={160}
          meta={<>of {metrics.totalDepartments} in the university</>}
        />
        <KpiCard
          label="Events this term"
          value={metrics.eventCount}
          icon="calendar-days"
          tone="info"
          delay={240}
          meta={
            <>
              {metrics.upcomingCount} upcoming {"\u00b7"} {metrics.completedCount}{" "}
              completed
            </>
          }
        />
      </ScrollReveal>

      <ScrollReveal className="ud-dash__split" duration={560} delay={80}>
        <Card>
          <CardHeader
            title="Overall turnout"
            subtitle={
              <>
                {formatDateShort(event.date)} {"\u00b7"} {event.venue}
              </>
            }
          />
          <CardBody>
            <div className="ud-dash__turnout">
              <DonutChart value={rate} label="Overall turnout" />

              <div className="ud-dash__legend">
                <div className="ud-dash__legend-row">
                  <span
                    className="ud-dash__legend-dot"
                    style={{ background: "var(--viz-attended)" }}
                  />
                  Attended
                  <span className="ud-dash__legend-value">
                    {formatNumber(present)}
                  </span>
                </div>
                <div className="ud-dash__legend-row">
                  <span
                    className="ud-dash__legend-dot"
                    style={{ background: "var(--viz-track)" }}
                  />
                  Did not attend
                  <span className="ud-dash__legend-value">
                    {formatNumber(Math.max(0, absent))}
                  </span>
                </div>
              </div>

              <div className="ud-dash__sessions">
                {sessions.map((session) => (
                  <div
                    className="ud-dash__session"
                    key={session.key}
                    data-off={!session.enabled}
                  >
                    <span className="ud-dash__session-icon">
                      <Icon name={SESSION_ICON[session.key]} size={15} />
                    </span>
                    <span>{SESSION_LABEL[session.key]}</span>
                    <ProgressBar
                      value={session.enabled ? session.rate : 0}
                      size="xs"
                      tone={session.enabled ? "brand" : "muted"}
                      label={`${SESSION_LABEL[session.key]} attendance`}
                    />
                    <span className="ud-dash__session-value">
                      {session.enabled ? `${Math.round(session.rate)}%` : "\u2014"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Students by department"
            subtitle="Enrolled head-count against those who attended."
            action="Hover a column for exact figures"
          />
          <CardBody>
            <DepartmentBarChart
              data={series.map((point) => ({
                code: point.department.code,
                name: point.department.name,
                enrolled: point.enrolled,
                attended: point.attended,
              }))}
            />
          </CardBody>
        </Card>
      </ScrollReveal>

      <ScrollReveal
        className="ud-dash__split ud-dash__split--even"
        duration={560}
        delay={140}
      >
        <Card>
          <CardHeader
            title="Attendance rate over recent events"
            subtitle="Share of invited students who timed in."
          />
          <CardBody>
            {trend.length > 0 ? (
              <AttendanceTrendChart data={trend} />
            ) : (
              <EmptyState
                icon="trending-up"
                title="No completed events yet"
                description="The trend appears once an event has recorded attendance."
              />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Department ranking" subtitle="Highest turnout first." />
          <CardBody>
            {ranking.length > 0 ? (
              <RankingBars data={ranking} />
            ) : (
              <EmptyState
                icon="building"
                title="No departments assigned"
                description="Add departments to this event to see a ranking."
              />
            )}
          </CardBody>
        </Card>
      </ScrollReveal>
    </div>
  );
}

export default DashboardView;
