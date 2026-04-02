import {
  getInsights,
  getSpendingByCategory,
  getSummary,
  getTrendData,
  monthLabel,
} from "@/lib/finance-utils";
import type { Transaction } from "@/types/finance";

const sample: Transaction[] = [
  { id: "1", date: "2026-01-01", category: "Salary", amount: 2000, type: "income", note: "pay" },
  { id: "2", date: "2026-01-05", category: "Rent", amount: 1000, type: "expense", note: "rent" },
  { id: "3", date: "2026-02-02", category: "Salary", amount: 2100, type: "income", note: "pay" },
  { id: "4", date: "2026-02-08", category: "Groceries", amount: 300, type: "expense", note: "food" },
  { id: "5", date: "2026-02-10", category: "Rent", amount: 1000, type: "expense", note: "rent" },
];

describe("finance-utils", () => {
  it("formats month labels", () => {
    expect(monthLabel("2026-01-01")).toBe("Jan 26");
  });

  it("computes summary totals", () => {
    expect(getSummary(sample)).toEqual({
      income: 4100,
      expenses: 2300,
      balance: 1800,
    });
  });

  it("groups trend data by month and signs expenses negative", () => {
    expect(getTrendData(sample)).toEqual([
      { id: 0, month: "2026-01", label: "Jan 26", net: 1000 },
      { id: 1, month: "2026-02", label: "Feb 26", net: 800 },
    ]);
  });

  it("aggregates expense categories and sorts descending", () => {
    expect(getSpendingByCategory(sample)).toEqual([
      { id: 0, category: "Rent", amount: 2000 },
      { id: 1, category: "Groceries", amount: 300 },
    ]);
  });

  it("returns empty-state insights", () => {
    expect(getInsights([])).toEqual({
      topCategory: "No data",
      monthlyText: "No monthly data",
      observation: "Add transactions to unlock insights.",
    });
  });

  it("returns populated insights including monthly comparison", () => {
    const insights = getInsights(sample);
    expect(insights.topCategory).toContain("Rent");
    expect(insights.monthlyText).toContain("Feb 26 expense is");
    expect(insights.observation).toContain("Positive cash flow");
  });
});
