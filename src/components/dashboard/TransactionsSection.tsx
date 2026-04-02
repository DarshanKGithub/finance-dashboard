import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { currency } from "@/lib/finance-utils";
import { GroupBy, Role, SortBy, Transaction, TransactionType } from "@/types/finance";

type TransactionsSectionProps = {
  role: Role;
  categories: string[];
  rows: Transaction[];
  search: string;
  typeFilter: "all" | TransactionType;
  categoryFilter: string;
  sortBy: SortBy;
  groupBy: GroupBy;
  groupedRows: Array<{ label: string; count: number; income: number; expense: number; net: number }>;
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value: "all" | TransactionType) => void;
  onCategoryFilterChange: (value: string) => void;
  onSortChange: (value: SortBy) => void;
  onGroupByChange: (value: GroupBy) => void;
  onExportCsv: () => void;
  onExportJson: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
};

export function TransactionsSection({
  role,
  categories,
  rows,
  search,
  typeFilter,
  categoryFilter,
  sortBy,
  groupBy,
  groupedRows,
  onSearchChange,
  onTypeFilterChange,
  onCategoryFilterChange,
  onSortChange,
  onGroupByChange,
  onExportCsv,
  onExportJson,
  onEdit,
  onDelete,
}: TransactionsSectionProps) {
  return (
    <Card id="transactions" className="reveal overflow-hidden [animation-delay:520ms]">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Transactions</h2>
            <p className="text-xs text-slate-500">Search, filter, and sort the active view</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={onExportCsv}>Export CSV</Button>
            <Button variant="outline" onClick={onExportJson}>Export JSON</Button>
            <a
              href="#all-transactions"
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700"
            >
              View all transactions
            </a>
          </div>
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-5">
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by note/category/date"
          />

          <Select value={typeFilter} onChange={(event) => onTypeFilterChange(event.target.value as "all" | TransactionType)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>

          <Select value={categoryFilter} onChange={(event) => onCategoryFilterChange(event.target.value)}>
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>

          <Select value={sortBy} onChange={(event) => onSortChange(event.target.value as SortBy)}>
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="high">Amount: High to Low</option>
            <option value="low">Amount: Low to High</option>
          </Select>

          <Select value={groupBy} onChange={(event) => onGroupByChange(event.target.value as GroupBy)}>
            <option value="none">No Grouping</option>
            <option value="category">Group by Category</option>
            <option value="month">Group by Month</option>
          </Select>
        </div>

        {groupBy !== "none" ? (
          <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {groupedRows.length ? (
              groupedRows.map((group) => (
                <div key={group.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">{group.label}</p>
                  <p>{group.count} transactions</p>
                  <p>Income: {currency.format(group.income)}</p>
                  <p>Expense: {currency.format(group.expense)}</p>
                  <p className="font-semibold">Net: {currency.format(group.net)}</p>
                </div>
              ))
            ) : (
              <p className="rounded-xl bg-slate-100 p-4 text-sm text-slate-500">No grouped data available for current filters.</p>
            )}
          </div>
        ) : null}

        <div className="mt-4">
          {rows.length ? (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: "1px solid var(--table-border)",
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "var(--table-bg)",
              }}
            >
              <Table size="small" stickyHeader aria-label="transactions table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: "var(--table-header-text)", backgroundColor: "var(--table-header-bg)" }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "var(--table-header-text)", backgroundColor: "var(--table-header-bg)" }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "var(--table-header-text)", backgroundColor: "var(--table-header-bg)" }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "var(--table-header-text)", backgroundColor: "var(--table-header-bg)" }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "var(--table-header-text)", backgroundColor: "var(--table-header-bg)" }}>Note</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: "var(--table-header-text)", backgroundColor: "var(--table-header-bg)" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((item) => (
                    <TableRow key={item.id} hover sx={{ "& td": { borderColor: "var(--table-row-border)", color: "var(--table-row-text)" } }}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{item.category}</TableCell>
                      <TableCell>
                        <Badge variant={item.type === "income" ? "income" : "expense"}>{item.type}</Badge>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{currency.format(item.amount)}</TableCell>
                      <TableCell sx={{ maxWidth: 220 }}>{item.note || "-"}</TableCell>
                      <TableCell align="right">
                        {role === "admin" ? (
                          <div className="inline-flex gap-2">
                            <Button variant="outline" onClick={() => onEdit(item)}>
                              Edit
                            </Button>
                            <Button variant="ghost" className="text-rose-700" onClick={() => onDelete(item.id)}>
                              Delete
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">View only</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p className="rounded-xl bg-slate-100 p-6 text-center text-sm text-slate-500">
              No transactions found for the current filters.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
