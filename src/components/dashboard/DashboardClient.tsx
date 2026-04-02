"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { AllTransactionsPanel } from "@/components/dashboard/AllTransactionsPanel";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { InsightsSection } from "@/components/dashboard/InsightsSection";
import { LoginPanel } from "@/components/dashboard/LoginPanel";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { TransactionFormSection } from "@/components/dashboard/TransactionFormSection";
import { TransactionsSection } from "@/components/dashboard/TransactionsSection";
import { emptyForm, seedTransactions, STORAGE_KEY } from "@/data/mockTransactions";
import { AUTH_STORAGE_KEY } from "@/data/mockUsers";
import {
  getInsights,
  getSpendingByCategory,
  getSummary,
  getTrendData,
  monthLabel,
} from "@/lib/finance-utils";
import { fetchMockTransactions } from "@/lib/mock-api";
import { AuthUser, GroupBy, SortBy, Transaction, TransactionForm, TransactionType } from "@/types/finance";

const THEME_STORAGE_KEY = "finance-dashboard-theme-v1";

export default function DashboardClient() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(seedTransactions);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortBy>("latest");
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TransactionForm>(emptyForm);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const role = authUser?.role ?? "viewer";

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const authRaw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (authRaw) {
        try {
          const parsedAuth = JSON.parse(authRaw) as AuthUser;
          if (parsedAuth?.id && parsedAuth?.role && !cancelled) {
            setAuthUser(parsedAuth);
          }
        } catch {
          window.localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }

      const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
      if ((storedTheme === "light" || storedTheme === "dark") && !cancelled) {
        setTheme(storedTheme);
      }

      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Transaction[];
          if (Array.isArray(parsed) && !cancelled) {
            setTransactions(parsed);
          }
        } catch {
          // Keep seed data when local data is malformed.
        }
      } else {
        try {
          const remote = await fetchMockTransactions();
          if (!cancelled) {
            setTransactions(remote);
          }
        } catch {
          // Keep seed data if mock API load fails.
        }
      }

      if (!cancelled) {
        setHydrated(true);
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const categories = useMemo(() => {
    const categorySet = new Set(transactions.map((item) => item.category));
    return Array.from(categorySet).sort((a, b) => a.localeCompare(b));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const text = search.trim().toLowerCase();
    return transactions
      .filter((item) => {
        const matchesType = typeFilter === "all" || item.type === typeFilter;
        const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
        const matchesSearch =
          !text ||
          item.category.toLowerCase().includes(text) ||
          item.note.toLowerCase().includes(text) ||
          item.date.includes(text);
        return matchesType && matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "latest") {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === "high") {
          return b.amount - a.amount;
        }
        return a.amount - b.amount;
      });
  }, [transactions, search, typeFilter, categoryFilter, sortBy]);

  const summary = useMemo(() => getSummary(transactions), [transactions]);
  const trendData = useMemo(() => getTrendData(transactions), [transactions]);
  const spendingByCategory = useMemo(() => getSpendingByCategory(transactions), [transactions]);
  const insights = useMemo(() => getInsights(transactions), [transactions]);

  const monthlyComparison = useMemo(() => {
    const monthMap = new Map<string, { income: number; expense: number }>();
    transactions.forEach((item) => {
      const month = item.date.slice(0, 7);
      const entry = monthMap.get(month) ?? { income: 0, expense: 0 };
      if (item.type === "income") {
        entry.income += item.amount;
      } else {
        entry.expense += item.amount;
      }
      monthMap.set(month, entry);
    });

    const ordered = Array.from(monthMap.entries()).sort(([a], [b]) => a.localeCompare(b));
    const current = ordered.at(-1)?.[1] ?? { income: 0, expense: 0 };
    const previous = ordered.at(-2)?.[1] ?? { income: 0, expense: 0 };

    const balanceDelta = previous.income - previous.expense !== 0 ? Math.round((((current.income - current.expense) - (previous.income - previous.expense)) / Math.max(Math.abs(previous.income - previous.expense), 1)) * 100) : 0;
    const incomeDelta = previous.income !== 0 ? Math.round(((current.income - previous.income) / previous.income) * 100) : 0;
    const expensesDelta = previous.expense !== 0 ? Math.round(((current.expense - previous.expense) / previous.expense) * 100) : 0;

    return { balanceDelta, incomeDelta, expensesDelta };
  }, [transactions]);

  const groupedRows = useMemo(() => {
    if (groupBy === "none") {
      return [];
    }

    const map = new Map<string, { count: number; income: number; expense: number }>();
    filteredTransactions.forEach((item) => {
      const key = groupBy === "category" ? item.category : monthLabel(`${item.date.slice(0, 7)}-01`);
      const entry = map.get(key) ?? { count: 0, income: 0, expense: 0 };
      entry.count += 1;
      if (item.type === "income") {
        entry.income += item.amount;
      } else {
        entry.expense += item.amount;
      }
      map.set(key, entry);
    });

    return Array.from(map.entries())
      .map(([label, values]) => ({
        label,
        count: values.count,
        income: values.income,
        expense: values.expense,
        net: values.income - values.expense,
      }))
      .sort((a, b) => b.net - a.net);
  }, [filteredTransactions, groupBy]);

  function persist(next: Transaction[]) {
    setTransactions(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }

  function handleLogin(user: AuthUser) {
    setAuthUser(user);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }

  function handleLogout() {
    setAuthUser(null);
    setEditingId(null);
    setForm(emptyForm);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  function clearForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  function downloadFile(content: string, fileName: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function exportJson() {
    downloadFile(JSON.stringify(filteredTransactions, null, 2), "transactions.json", "application/json");
  }

  function exportCsv() {
    const header = ["id", "date", "category", "amount", "type", "note"];
    const rows = filteredTransactions.map((item) =>
      [item.id, item.date, item.category, String(item.amount), item.type, item.note]
        .map((value) => `"${value.replaceAll('"', '""')}"`)
        .join(","),
    );
    downloadFile([header.join(","), ...rows].join("\n"), "transactions.csv", "text/csv");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (role !== "admin") {
      return;
    }

    const parsedAmount = Number(form.amount);
    if (!form.date || !form.category.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    if (editingId) {
      const next = transactions.map((item) =>
        item.id === editingId
          ? {
              ...item,
              date: form.date,
              category: form.category.trim(),
              amount: parsedAmount,
              type: form.type,
              note: form.note.trim(),
            }
          : item,
      );
      persist(next);
    } else {
      persist([
        {
          id: `t-${Date.now()}`,
          date: form.date,
          category: form.category.trim(),
          amount: parsedAmount,
          type: form.type,
          note: form.note.trim(),
        },
        ...transactions,
      ]);
    }

    clearForm();
  }

  function startEdit(item: Transaction) {
    if (role !== "admin") {
      return;
    }
    setEditingId(item.id);
    setForm({
      date: item.date,
      category: item.category,
      amount: String(item.amount),
      type: item.type,
      note: item.note,
    });
  }

  function removeTransaction(id: string) {
    if (role !== "admin") {
      return;
    }
    const next = transactions.filter((item) => item.id !== id);
    persist(next);
    if (editingId === id) {
      clearForm();
    }
  }

  if (!hydrated) {
    return (
      <main className="mx-auto w-full max-w-7xl p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">Loading workspace...</div>
      </main>
    );
  }

  if (!authUser) {
    return <LoginPanel onLogin={handleLogin} theme={theme} onThemeToggle={toggleTheme} />;
  }

  return (
    <div className="dashboard-shell">
      <div className="orb orb-a" />
      <div className="orb orb-b" />

      <main className="grid min-h-screen w-full lg:grid-cols-[300px_minmax(0,1fr)]">
        <DashboardSidebar user={authUser} balance={summary.balance} onLogout={handleLogout} />

        <div className="min-w-0 p-4 pb-10 sm:p-6 lg:p-8 xl:p-10">
          <div className="space-y-6">
            <section id="overview">
              <DashboardHeader
                user={authUser}
                onLogout={handleLogout}
                theme={theme}
                onThemeToggle={toggleTheme}
              />
            </section>
            <SummaryCards
              income={summary.income}
              expenses={summary.expenses}
              balance={summary.balance}
              balanceDelta={monthlyComparison.balanceDelta}
              incomeDelta={monthlyComparison.incomeDelta}
              expensesDelta={monthlyComparison.expensesDelta}
            />
            <ChartsSection trendData={trendData} spendingByCategory={spendingByCategory} />
            <AllTransactionsPanel transactions={transactions} />

            <TransactionsSection
              role={role}
              categories={categories}
              rows={filteredTransactions}
              search={search}
              typeFilter={typeFilter}
              categoryFilter={categoryFilter}
              sortBy={sortBy}
              onSearchChange={setSearch}
              onTypeFilterChange={setTypeFilter}
              onCategoryFilterChange={setCategoryFilter}
              onSortChange={setSortBy}
              groupBy={groupBy}
              groupedRows={groupedRows}
              onGroupByChange={setGroupBy}
              onExportCsv={exportCsv}
              onExportJson={exportJson}
              onEdit={startEdit}
              onDelete={removeTransaction}
            />

            <div id="insights" className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
              <InsightsSection insights={insights} />

              <div id="access">
                {role === "admin" ? (
                  <TransactionFormSection
                    role={role}
                    form={form}
                    isEditing={Boolean(editingId)}
                    onFormChange={setForm}
                    onSubmit={onSubmit}
                    onClear={clearForm}
                  />
                ) : (
                  <div className="reveal rounded-2xl border border-slate-200 bg-white/80 p-5 text-sm text-slate-600 shadow-sm">
                    Transaction management is restricted to Admin access. Viewer mode is read-only.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
