import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { TransactionsSection } from "@/components/dashboard/TransactionsSection";

const rows = [
  {
    id: "t-1",
    date: "2026-03-08",
    category: "Salary",
    amount: 4200,
    type: "income" as const,
    note: "Main payroll",
  },
];

describe("TransactionsSection", () => {
  it("shows empty-state for no rows", () => {
    render(
      <TransactionsSection
        role="viewer"
        categories={[]}
        rows={[]}
        search=""
        typeFilter="all"
        categoryFilter="all"
        sortBy="latest"
        groupBy="none"
        groupedRows={[]}
        onSearchChange={() => undefined}
        onTypeFilterChange={() => undefined}
        onCategoryFilterChange={() => undefined}
        onSortChange={() => undefined}
        onGroupByChange={() => undefined}
        onExportCsv={() => undefined}
        onExportJson={() => undefined}
        onEdit={() => undefined}
        onDelete={() => undefined}
      />,
    );

    expect(screen.getByText(/No transactions found/i)).toBeInTheDocument();
  });

  it("shows admin action buttons", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <TransactionsSection
        role="admin"
        categories={["Salary"]}
        rows={rows}
        search=""
        typeFilter="all"
        categoryFilter="all"
        sortBy="latest"
        groupBy="none"
        groupedRows={[]}
        onSearchChange={() => undefined}
        onTypeFilterChange={() => undefined}
        onCategoryFilterChange={() => undefined}
        onSortChange={() => undefined}
        onGroupByChange={() => undefined}
        onExportCsv={() => undefined}
        onExportJson={() => undefined}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(onEdit).toHaveBeenCalledWith(rows[0]);
    expect(onDelete).toHaveBeenCalledWith("t-1");
  });

  it("shows viewer read-only state", () => {
    render(
      <TransactionsSection
        role="viewer"
        categories={["Salary"]}
        rows={rows}
        search=""
        typeFilter="all"
        categoryFilter="all"
        sortBy="latest"
        groupBy="none"
        groupedRows={[]}
        onSearchChange={() => undefined}
        onTypeFilterChange={() => undefined}
        onCategoryFilterChange={() => undefined}
        onSortChange={() => undefined}
        onGroupByChange={() => undefined}
        onExportCsv={() => undefined}
        onExportJson={() => undefined}
        onEdit={() => undefined}
        onDelete={() => undefined}
      />,
    );

    expect(screen.getByText("View only")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
  });
});
