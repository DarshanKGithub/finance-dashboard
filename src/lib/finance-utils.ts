import { Transaction } from "@/types/finance";

export const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function monthLabel(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

export function getSummary(transactions: Transaction[]) {
  const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  return {
    income,
    expenses,
    balance: income - expenses,
  };
}

export function getTrendData(transactions: Transaction[]) {
  const map = new Map<string, number>();
  transactions.forEach((item) => {
    const month = item.date.slice(0, 7);
    const signedAmount = item.type === "income" ? item.amount : -item.amount;
    map.set(month, (map.get(month) ?? 0) + signedAmount);
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, net], index) => ({
      id: index,
      month,
      label: monthLabel(`${month}-01`),
      net,
    }));
}

export function getSpendingByCategory(transactions: Transaction[]) {
  const categoryMap = new Map<string, number>();
  transactions
    .filter((item) => item.type === "expense")
    .forEach((item) => {
      categoryMap.set(item.category, (categoryMap.get(item.category) ?? 0) + item.amount);
    });

  return Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount], index) => ({
      id: index,
      category,
      amount,
    }));
}

export function getInsights(transactions: Transaction[]) {
  if (!transactions.length) {
    return {
      topCategory: "No data",
      monthlyText: "No monthly data",
      observation: "Add transactions to unlock insights.",
    };
  }

  const summary = getSummary(transactions);
  const byCategory = getSpendingByCategory(transactions);
  const topCategory = byCategory[0]
    ? `${byCategory[0].category} (${currency.format(byCategory[0].amount)})`
    : "No expense data";

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

  const orderedMonths = Array.from(monthMap.entries()).sort(([a], [b]) => a.localeCompare(b));
  const latest = orderedMonths.at(-1);
  const previous = orderedMonths.at(-2);

  const monthlyText =
    latest && previous
      ? `${monthLabel(`${latest[0]}-01`)} expense is ${currency.format(latest[1].expense)} vs ${currency.format(previous[1].expense)} in ${monthLabel(`${previous[0]}-01`)}.`
      : "Need at least two months for comparison.";

  const savingsRate = summary.income > 0 ? Math.round((summary.balance / summary.income) * 100) : 0;
  const observation =
    summary.balance >= 0
      ? `Positive cash flow this period with an estimated ${savingsRate}% savings rate.`
      : "Spending is ahead of income; review high-expense categories.";

  return {
    topCategory,
    monthlyText,
    observation,
  };
}
