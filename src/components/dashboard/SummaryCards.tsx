import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import SouthWestRoundedIcon from "@mui/icons-material/SouthWestRounded";

import { Card, CardContent } from "@/components/ui/card";
import { currency } from "@/lib/finance-utils";

type SummaryCardsProps = {
  income: number;
  expenses: number;
  balance: number;
  balanceDelta: number;
  incomeDelta: number;
  expensesDelta: number;
};

function DeltaPill({ value }: { value: number }) {
  const positive = value >= 0;
  const Icon = positive ? TrendingUpRoundedIcon : TrendingDownRoundedIcon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        positive ? "bg-emerald-400/15 text-emerald-100" : "bg-rose-400/15 text-rose-100"
      }`}
    >
      <Icon fontSize="inherit" />
      {positive ? "+" : ""}
      {value}% vs last month
    </span>
  );
}

export function SummaryCards({ income, expenses, balance, balanceDelta, incomeDelta, expensesDelta }: SummaryCardsProps) {
  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="reveal border-none bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-900 text-slate-100 shadow-2xl">
        <CardContent>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Total Balance</p>
              <p className="mt-3 text-3xl font-semibold">{currency.format(balance)}</p>
            </div>
            <AccountBalanceWalletRoundedIcon fontSize="small" />
          </div>
          <div className="mt-4">
            <DeltaPill value={balanceDelta} />
          </div>
        </CardContent>
      </Card>

      <Card className="reveal border-none bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 text-emerald-50 shadow-2xl [animation-delay:120ms]">
        <CardContent>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-100">Income</p>
              <p className="mt-3 text-3xl font-semibold">{currency.format(income)}</p>
            </div>
            <NorthEastRoundedIcon fontSize="small" />
          </div>
          <div className="mt-4">
            <DeltaPill value={incomeDelta} />
          </div>
        </CardContent>
      </Card>

      <Card className="reveal border-none bg-gradient-to-br from-rose-600 via-rose-700 to-orange-700 text-rose-50 shadow-2xl [animation-delay:240ms]">
        <CardContent>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-rose-100">Expenses</p>
              <p className="mt-3 text-3xl font-semibold">{currency.format(expenses)}</p>
            </div>
            <SouthWestRoundedIcon fontSize="small" />
          </div>
          <div className="mt-4">
            <DeltaPill value={-expensesDelta} />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
