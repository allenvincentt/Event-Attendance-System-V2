import type { ReactNode } from "react";
import { registerStyle, cx } from "../../lib/registerStyle";

registerStyle(
  "data-table",
  `
.ud-table-wrap {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--sh-sm);
  overflow: hidden;
}

.ud-table-scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.ud-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
}

.ud-table thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: var(--space-4) var(--space-3);
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  font-size: var(--fs-11);
  font-weight: var(--fw-bold);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--text-muted);
  text-align: left;
  white-space: nowrap;
}

.ud-table th[data-align="right"],
.ud-table td[data-align="right"] { text-align: right; }

.ud-table th[data-align="center"],
.ud-table td[data-align="center"] { text-align: center; }

.ud-table tbody td {
  padding: var(--space-3) var(--space-3);
  border-bottom: 1px solid var(--border-subtle);
  font-size: var(--fs-13);
  color: var(--text-secondary);
  vertical-align: middle;
}

.ud-table tbody tr:last-child td {
  border-bottom: none;
}

.ud-table tbody tr {
  transition: background-color var(--dur-fast) var(--ease-standard);
}

.ud-table tbody tr[data-hoverable="true"]:hover {
  background: var(--n-25);
  cursor: pointer;
}

.ud-table tbody tr[data-selected="true"] {
  background: var(--brand-soft);
}

.ud-table tbody tr[data-selected="true"] td:first-child {
  box-shadow: inset 3px 0 0 var(--brand);
}

.ud-table tbody tr[data-selected="true"]:hover {
  background: var(--red-100);
}

.ud-table tbody tr:focus-visible {
  outline: none;
  background: var(--n-25);
  box-shadow: inset 0 0 0 2px var(--brand);
}

.ud-table__empty {
  padding: var(--space-9) var(--space-6);
  text-align: center;
}

.ud-table__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-5);
  border-top: 1px solid var(--border);
  background: var(--surface-alt);
  font-size: var(--fs-12);
  color: var(--text-muted);
}
`,
);

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  width?: string;
  align?: "left" | "right" | "center";
  render: (row: T, index: number) => ReactNode;
}

export interface DataTableProps<T> {
  columns: ReadonlyArray<DataTableColumn<T>>;
  rows: ReadonlyArray<T>;
  rowKey: (row: T, index: number) => string;
  caption: string;
  selectedKey?: string | null;
  onRowSelect?: (row: T) => void;
  empty?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  caption,
  selectedKey = null,
  onRowSelect,
  empty,
  footer,
  className = "",
}: DataTableProps<T>) {
  const interactive = Boolean(onRowSelect);

  return (
    <div className={cx("ud-table-wrap", className)}>
      <div className="ud-table-scroll">
        <table className="ud-table">
          <caption className="sr-only">{caption}</caption>
          <colgroup>
            {columns.map((column) => (
              <col key={column.key} style={{ width: column.width }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  data-align={column.align ?? "left"}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="ud-table__empty" colSpan={columns.length}>
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => {
                const key = rowKey(row, index);
                return (
                  <tr
                    key={key}
                    data-hoverable={interactive}
                    data-selected={selectedKey === key}
                    tabIndex={interactive ? 0 : undefined}
                    aria-selected={interactive ? selectedKey === key : undefined}
                    onClick={interactive ? () => onRowSelect?.(row) : undefined}
                    onKeyDown={
                      interactive
                        ? (event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              onRowSelect?.(row);
                            }
                          }
                        : undefined
                    }
                  >
                    {columns.map((column) => (
                      <td key={column.key} data-align={column.align ?? "left"}>
                        {column.render(row, index)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {footer ? <div className="ud-table__foot">{footer}</div> : null}
    </div>
  );
}

export default DataTable;
