export type TransactionType = "income" | "expense";
export type Role = "viewer" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type Transaction = {
  id: string;
  date: string;
  category: string;
  amount: number;
  type: TransactionType;
  note: string;
};

export type TransactionForm = {
  date: string;
  category: string;
  amount: string;
  type: TransactionType;
  note: string;
};

export type SortBy = "latest" | "oldest" | "high" | "low";

export type GroupBy = "none" | "category" | "month";
