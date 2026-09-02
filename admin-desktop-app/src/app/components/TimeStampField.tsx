import { Select } from "./Select";
import { tokens } from "@/app/theme/tokens";

const to12 = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const mer = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return { h12: String(h12), m: String(m).padStart(2, "0"), mer };
};
const to24 = (h12: string, m: string, mer: string) => {
  let h = Number(h12) % 12;
  if (mer === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${m}`;
};
const label12 = (hhmm: string) => {
  const { h12, m, mer } = to12(hhmm);
  return `${h12}:${m} ${mer}`;
};

const HOURS = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));
const MINS = ["00", "15", "30", "45"].map((v) => ({ value: v, label: v }));
const MER = [{ value: "AM", label: "AM" }, { value: "PM", label: "PM" }];

interface Props {
  label: string;
  start: string;
  end: string;
  onChange: (next: { start: string; end: string }) => void;
  disabled?: boolean;
}

export function TimeStampField({ label, start, end, onChange, disabled = false }: Props) {
  const s = to12(start), e = to12(end);
  const setStart = (p: Partial<typeof s>) => onChange({ start: to24(p.h12 ?? s.h12, p.m ?? s.m, p.mer ?? s.mer), end });
  const setEnd = (p: Partial<typeof e>) => onChange({ start, end: to24(p.h12 ?? e.h12, p.m ?? e.m, p.mer ?? e.mer) });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: tokens.space.md, opacity: disabled ? 0.5 : 1 }}>
      <span style={{ minWidth: 96, fontSize: tokens.font.size.bodySm, fontWeight: tokens.font.weight.semibold }}>{label}</span>
      {disabled ? (
        <span style={{ color: tokens.color.text.muted, fontSize: tokens.font.size.bodySm }}>Not scheduled</span>
      ) : (
        <>
          <div style={{ display: "flex", gap: tokens.space["2xs"] }}>
            <Select options={HOURS} value={s.h12} onChange={(h12) => setStart({ h12 })} ariaLabel={`${label} start hour`} />
            <Select options={MINS} value={s.m} onChange={(m) => setStart({ m })} ariaLabel={`${label} start minute`} />
            <Select options={MER} value={s.mer} onChange={(mer) => setStart({ mer })} ariaLabel={`${label} start meridiem`} />
          </div>
          <span>–</span>
          <div style={{ display: "flex", gap: tokens.space["2xs"] }}>
            <Select options={HOURS} value={e.h12} onChange={(h12) => setEnd({ h12 })} ariaLabel={`${label} end hour`} />
            <Select options={MINS} value={e.m} onChange={(m) => setEnd({ m })} ariaLabel={`${label} end minute`} />
            <Select options={MER} value={e.mer} onChange={(mer) => setEnd({ mer })} ariaLabel={`${label} end meridiem`} />
          </div>
          <span style={{ marginLeft: "auto", fontSize: tokens.font.size.sm, color: tokens.color.text.muted }}>{label12(start)} – {label12(end)}</span>
        </>
      )}
    </div>
  );
}
