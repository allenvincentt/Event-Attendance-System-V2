import { motion } from "framer-motion";
import { useState } from "react";
import { Card } from "@/app/components/Card";
import { KpiCard } from "@/app/components/KpiCard";
import { ProgressBar } from "@/app/components/ProgressBar";
import { Reveal } from "@/app/motion/Reveal";
import { Select } from "@/app/components/Select";
import { AttendanceTrendChart } from "@/app/charts/AttendanceTrendChart";
import { DepartmentBarChart } from "@/app/charts/DepartmentBarChart";
import { DonutChart } from "@/app/charts/DonutChart";
import { RankingBars } from "@/app/charts/RankingBars";
import { useDashboard, useEvents } from "@/data/MockDataProvider";
import { staggerContainer } from "@/app/motion/transitions";
import { tokens } from "@/app/theme/tokens";
import { formatDateShort, formatNumber, formatPercent } from "@/app/lib/format";

const SESSION_LABEL: Record<string, string> = { morning: "Morning", afternoon: "Afternoon", evening: "Evening" };

export function DashboardView() {
  const { events } = useEvents();
  const [eventId, setEventId] = useState(events[0]?.id ?? "nightly-cultural-show");
  const d = useDashboard(eventId);
  const event = events.find((e) => e.id === eventId);
  const h3 = { fontSize: tokens.font.size.subtitle, fontWeight: tokens.font.weight.bold, margin: 0 };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.space.xl }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: tokens.space.md, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: tokens.font.size.h1, color: tokens.color.text.strong }}>Attendance overview</h1>
          <p style={{ margin: 0, color: tokens.color.text.muted }}>Live figures for the event you select.</p>
        </div>
        <Select
          ariaLabel="Event"
          value={eventId}
          onChange={setEventId}
          options={events.map((e) => ({ value: e.id, label: e.name, hint: formatDateShort(new Date(`${e.date}T00:00:00`)) }))}
        />
      </header>

      <motion.div variants={staggerContainer} initial="initial" animate="animate" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: tokens.space.md }}>
        <KpiCard label="Attendance rate" value={d.attendanceRate} format={(n) => formatPercent(n)} footnote={`${event ? event.status[0].toUpperCase() + event.status.slice(1) : ""} · ${event?.sessions.map((s) => SESSION_LABEL[s.session]).join(", ")}`} accent={tokens.color.brand.primary} icon="arrowUp" />
        <KpiCard label="Students present" value={d.studentsPresent} footnote={`of ${formatNumber(d.studentsInvited)} invited`} accent={tokens.color.status.success.base} icon="users" />
        <KpiCard label="Departments" value={d.departmentsParticipating} footnote={`of ${d.departmentsTotal} in the university`} accent={tokens.color.status.info.base} icon="dashboard" />
        <KpiCard label="Events this term" value={d.eventsThisTerm} footnote={`${d.eventsUpcoming} upcoming · ${d.eventsCompleted} completed`} accent={tokens.color.status.neutral.base} icon="calendar" />
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: tokens.space.md }}>
        <Reveal><Card>
          <h3 style={h3}>Overall turnout</h3>
          <div style={{ display: "flex", gap: tokens.space.lg, alignItems: "center", flexWrap: "wrap", marginTop: tokens.space.md }}>
            <DonutChart attended={d.turnout.attended} absent={d.turnout.absent} />
            <div style={{ flex: 1, minWidth: 180, display: "flex", flexDirection: "column", gap: tokens.space.xs }}>
              <Legend color={tokens.color.brand.primary} label="Attended" value={formatNumber(d.turnout.attended)} />
              <Legend color="#C9CBD1" label="Did not attend" value={formatNumber(d.turnout.absent)} />
              <div style={{ marginTop: tokens.space.sm, display: "flex", flexDirection: "column", gap: tokens.space.xs }}>
                {d.sessionSplit.map((s) => (
                  <div key={s.session} style={{ display: "flex", alignItems: "center", gap: tokens.space.sm }}>
                    <span style={{ width: 76, fontSize: tokens.font.size.sm, color: tokens.color.text.muted }}>{SESSION_LABEL[s.session]}</span>
                    <div style={{ flex: 1 }}><ProgressBar value={s.rate} label={`${SESSION_LABEL[s.session]} turnout`} /></div>
                    <span style={{ fontSize: tokens.font.size.sm, width: 44, textAlign: "right" }}>{s.scheduled ? formatPercent(s.rate, 0) : "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card></Reveal>

        <Reveal><Card>
          <h3 style={h3}>Students by department</h3>
          <p style={{ margin: `0 0 ${tokens.space.sm}px`, color: tokens.color.text.muted, fontSize: tokens.font.size.sm }}>Enrolled head-count against those who attended.</p>
          <DepartmentBarChart data={d.byDepartment} />
        </Card></Reveal>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: tokens.space.md }}>
        <Reveal><Card>
          <h3 style={h3}>Attendance rate over recent events</h3>
          <AttendanceTrendChart points={d.trend} />
        </Card></Reveal>
        <Reveal><Card>
          <h3 style={h3}>Department ranking</h3>
          <p style={{ margin: `0 0 ${tokens.space.md}px`, color: tokens.color.text.muted, fontSize: tokens.font.size.sm }}>Highest turnout first.</p>
          <RankingBars rows={d.ranking} />
        </Card></Reveal>
      </div>
    </div>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: tokens.space.sm }}>
      <span style={{ display: "flex", alignItems: "center", gap: tokens.space.xs, fontSize: tokens.font.size.bodySm }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: color }} />{label}
      </span>
      <strong style={{ fontSize: tokens.font.size.bodySm }}>{value}</strong>
    </div>
  );
}
