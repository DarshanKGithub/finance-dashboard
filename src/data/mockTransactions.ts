import { Transaction, TransactionForm } from "@/types/finance";

export const STORAGE_KEY = "finance-dashboard-transactions-v2";

export const seedTransactions: Transaction[] = [
  { id: "t-1", date: "2026-01-02", category: "Salary", amount: 4200, type: "income", note: "Main payroll" },
  { id: "t-2", date: "2026-01-06", category: "Rent", amount: 1250, type: "expense", note: "Apartment rent" },
  { id: "t-3", date: "2026-01-11", category: "Groceries", amount: 180, type: "expense", note: "Weekly market" },
  { id: "t-4", date: "2026-01-18", category: "Transport", amount: 72, type: "expense", note: "Fuel and metro" },
  { id: "t-5", date: "2026-02-03", category: "Freelance", amount: 860, type: "income", note: "Website milestone" },
  { id: "t-6", date: "2026-02-08", category: "Dining", amount: 95, type: "expense", note: "Team dinner" },
  { id: "t-7", date: "2026-02-13", category: "Utilities", amount: 145, type: "expense", note: "Electric and internet" },
  { id: "t-8", date: "2026-02-24", category: "Investment", amount: 350, type: "income", note: "Dividend payout" },
  { id: "t-9", date: "2026-03-04", category: "Travel", amount: 410, type: "expense", note: "Weekend trip" },
  { id: "t-10", date: "2026-03-08", category: "Salary", amount: 4200, type: "income", note: "Main payroll" },
  { id: "t-11", date: "2026-03-16", category: "Health", amount: 120, type: "expense", note: "Clinic visit" },
  { id: "t-12", date: "2026-03-27", category: "Groceries", amount: 220, type: "expense", note: "Monthly stock-up" },
];

export const emptyForm: TransactionForm = {
  date: "",
  category: "",
  amount: "",
  type: "expense",
  note: "",
};
