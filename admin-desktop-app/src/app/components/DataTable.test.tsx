import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { DataTable, type Column } from "./DataTable";

interface Row { id: string; name: string; venue: string; }
const rows: Row[] = [
  { id: "1", name: "Nightly Cultural Show", venue: "Open Quadrangle" },
  { id: "2", name: "Career and Job Fair", venue: "Covered Court" },
];
const columns: Column<Row>[] = [
  { key: "name", header: "Event name", render: (r) => r.name, sortable: true },
  { key: "venue", header: "Venue", render: (r) => r.venue },
];

describe("DataTable", () => {
  test("renders headers and rows", () => {
    render(<DataTable columns={columns} rows={rows} getRowKey={(r) => r.id} />);
    expect(screen.getByText("Event name")).toBeInTheDocument();
    expect(screen.getByText("Nightly Cultural Show")).toBeInTheDocument();
  });
  test("toggles sort on a sortable header", async () => {
    const onSortChange = vi.fn();
    render(<DataTable columns={columns} rows={rows} getRowKey={(r) => r.id} sort={{ key: "name", dir: "asc" }} onSortChange={onSortChange} />);
    await userEvent.click(screen.getByRole("button", { name: /event name/i }));
    expect(onSortChange).toHaveBeenCalledWith({ key: "name", dir: "desc" });
  });
  test("fires onRowClick", async () => {
    const onRowClick = vi.fn();
    render(<DataTable columns={columns} rows={rows} getRowKey={(r) => r.id} onRowClick={onRowClick} />);
    await userEvent.click(screen.getByText("Career and Job Fair"));
    expect(onRowClick).toHaveBeenCalledWith(rows[1]);
  });
  test("shows the empty state when there are no rows", () => {
    render(<DataTable columns={columns} rows={[]} getRowKey={(r) => r.id} emptyState={<p>Nothing here</p>} />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });
  test("renders cards (no table) in card layout", () => {
    render(<DataTable columns={columns} rows={rows} getRowKey={(r) => r.id} layout="cards" />);
    expect(screen.queryByRole("table")).toBeNull();
    // column headers become labels
    expect(screen.getAllByText("Venue").length).toBeGreaterThan(0);
  });
  test("selection: header checkbox selects all", async () => {
    const onSelectionChange = vi.fn();
    render(<DataTable columns={columns} rows={rows} getRowKey={(r) => r.id} selectedKeys={new Set()} onSelectionChange={onSelectionChange} />);
    await userEvent.click(screen.getByRole("checkbox", { name: /select all/i }));
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(["1", "2"]));
  });
});
