import { useRef, type ReactNode } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Card } from "./Card";
import { Checkbox } from "./Checkbox";
import { Icon } from "./Icon";
import { Skeleton } from "./Skeleton";
import { tokens } from "@/app/theme/tokens";
import { useViewport } from "@/app/theme/useViewport";

export type SortState = { key: string; dir: "asc" | "desc" };
export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortable?: boolean;
  align?: "left" | "right";
  width?: number | string;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  sort?: SortState;
  onSortChange?: (s: SortState) => void;
  selectedKeys?: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
  emptyState?: ReactNode;
  loading?: boolean;
  cardTitle?: (row: T) => ReactNode;
  layout?: "auto" | "table" | "cards";
}

const VIRTUAL_THRESHOLD = 80;

export function DataTable<T>({
  columns, rows, getRowKey, onRowClick, sort, onSortChange, selectedKeys, onSelectionChange,
  emptyState, loading, cardTitle, layout = "auto",
}: Props<T>) {
  const { bp } = useViewport();
  const asCards = layout === "cards" || (layout === "auto" && bp === "sm");
  const selectable = !!onSelectionChange;

  const toggleSort = (key: string) => {
    if (!onSortChange) return;
    onSortChange({ key, dir: sort?.key === key && sort.dir === "asc" ? "desc" : "asc" });
  };
  const toggleAll = () => {
    if (!onSelectionChange) return;
    const all = new Set(rows.map(getRowKey));
    const isAll = selectedKeys && [...all].every((k) => selectedKeys.has(k));
    onSelectionChange(isAll ? new Set() : all);
  };
  const toggleOne = (key: string) => {
    if (!onSelectionChange || !selectedKeys) return;
    const next = new Set(selectedKeys);
    next.has(key) ? next.delete(key) : next.add(key);
    onSelectionChange(next);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: tokens.space.sm }}>
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} height={44} />)}
      </div>
    );
  }
  if (rows.length === 0) return <>{emptyState ?? null}</>;

  if (asCards) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: tokens.space.sm }}>
        {rows.map((row) => (
          <Card key={getRowKey(row)} interactive={!!onRowClick} style={{ padding: tokens.space.md, cursor: onRowClick ? "pointer" : "default" }}>
            <div onClick={() => onRowClick?.(row)}>
              {cardTitle && <div style={{ fontWeight: tokens.font.weight.bold, marginBottom: tokens.space.xs }}>{cardTitle(row)}</div>}
              {columns.map((c) => (
                <div key={c.key} style={{ display: "flex", justifyContent: "space-between", gap: tokens.space.md, padding: `${tokens.space["2xs"]}px 0`, fontSize: tokens.font.size.bodySm }}>
                  <span style={{ color: tokens.color.text.muted }}>{c.header}</span>
                  <span style={{ textAlign: "right" }}>{c.render(row)}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const Body = rows.length > VIRTUAL_THRESHOLD ? VirtualBody : PlainBody;
  return (
    <div style={{ border: `1px solid ${tokens.color.border.default}`, borderRadius: tokens.radius.lg, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: tokens.font.size.bodySm }}>
        <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
          <tr style={{ background: tokens.color.surface.sunken }}>
            {selectable && (
              <th style={{ width: 44, padding: tokens.space.sm }}>
                <Checkbox
                  label="Select all rows"
                  checked={!!selectedKeys && rows.length > 0 && rows.every((r) => selectedKeys.has(getRowKey(r)))}
                  indeterminate={!!selectedKeys && selectedKeys.size > 0 && !rows.every((r) => selectedKeys.has(getRowKey(r)))}
                  onChange={toggleAll}
                />
              </th>
            )}
            {columns.map((c) => (
              <th key={c.key} style={{ textAlign: c.align ?? "left", padding: `${tokens.space.sm}px ${tokens.space.md}px`, fontSize: tokens.font.size.xs, letterSpacing: 0.5, textTransform: "uppercase", color: tokens.color.text.muted, width: c.width }}>
                {c.sortable && onSortChange ? (
                  <button type="button" onClick={() => toggleSort(c.key)} style={{ display: "inline-flex", alignItems: "center", gap: 4, border: "none", background: "transparent", cursor: "pointer", font: "inherit", color: "inherit", textTransform: "inherit", letterSpacing: "inherit" }}>
                    {c.header}
                    {sort?.key === c.key && <Icon name={sort.dir === "asc" ? "arrowUp" : "arrowDown"} size={12} />}
                  </button>
                ) : c.header}
              </th>
            ))}
          </tr>
        </thead>
        <Body {...{ rows, columns, getRowKey, onRowClick, selectable, selectedKeys, toggleOne }} />
      </table>
    </div>
  );
}

interface BodyProps<T> {
  rows: T[];
  columns: Column<T>[];
  getRowKey: (r: T) => string;
  onRowClick?: (r: T) => void;
  selectable: boolean;
  selectedKeys?: Set<string>;
  toggleOne: (key: string) => void;
}

function Row<T>({ row, columns, getRowKey, onRowClick, selectable, selectedKeys, toggleOne }: BodyProps<T> & { row: T }) {
  const key = getRowKey(row);
  return (
    <tr
      onClick={() => onRowClick?.(row)}
      style={{ borderTop: `1px solid ${tokens.color.border.default}`, cursor: onRowClick ? "pointer" : "default" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = tokens.color.brand.primarySoft)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {selectable && (
        <td style={{ padding: tokens.space.sm }} onClick={(e) => e.stopPropagation()}>
          <Checkbox label={`Select row`} checked={!!selectedKeys?.has(key)} onChange={() => toggleOne(key)} />
        </td>
      )}
      {columns.map((c) => (
        <td key={c.key} style={{ padding: `${tokens.space.sm}px ${tokens.space.md}px`, textAlign: c.align ?? "left" }}>{c.render(row)}</td>
      ))}
    </tr>
  );
}

function PlainBody<T>(props: BodyProps<T>) {
  return <tbody>{props.rows.map((row) => <Row key={props.getRowKey(row)} row={row} {...props} />)}</tbody>;
}

function VirtualBody<T>(props: BodyProps<T>) {
  const { columns, getRowKey, onRowClick, selectable, selectedKeys, toggleOne } = props;
  const parentRef = useRef<HTMLTableSectionElement>(null);
  const virt = useVirtualizer({
    count: props.rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 12,
  });
  return (
    <tbody ref={parentRef} style={{ display: "block", maxHeight: 520, overflow: "auto", position: "relative" }}>
      <tr style={{ display: "block", height: virt.getTotalSize() }} />
      {virt.getVirtualItems().map((vi) => {
        const row = props.rows[vi.index];
        const key = getRowKey(row);
        return (
          <tr
            key={key}
            onClick={() => onRowClick?.(row)}
            style={{ display: "table", tableLayout: "fixed", width: "100%", position: "absolute", top: 0, transform: `translateY(${vi.start}px)`, borderTop: `1px solid ${tokens.color.border.default}`, cursor: onRowClick ? "pointer" : "default" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = tokens.color.brand.primarySoft)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {selectable && (
              <td style={{ width: 44, padding: tokens.space.sm }} onClick={(e) => e.stopPropagation()}>
                <Checkbox label={`Select row`} checked={!!selectedKeys?.has(key)} onChange={() => toggleOne(key)} />
              </td>
            )}
            {columns.map((c) => (
              <td key={c.key} style={{ padding: `${tokens.space.sm}px ${tokens.space.md}px`, textAlign: c.align ?? "left" }}>{c.render(row)}</td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
}
