import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { currency } from "@/lib/finance-utils";
import { Transaction } from "@/types/finance";

type AllTransactionsPanelProps = {
  transactions: Transaction[];
};

export function AllTransactionsPanel({ transactions }: AllTransactionsPanelProps) {
  return (
    <Card id="all-transactions" className="reveal overflow-hidden [animation-delay:460ms]">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">All Transactions</h2>
            <p className="text-xs text-slate-500">Complete history, independent of search and filters</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {transactions.length} records
          </span>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {transactions.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.category}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.date}</p>
                </div>
                <Badge variant={item.type === "income" ? "income" : "expense"}>{item.type}</Badge>
              </div>

              <p className="mt-4 text-2xl font-semibold text-slate-900">{currency.format(item.amount)}</p>
              <p className="mt-2 text-sm text-slate-600">{item.note || "No note provided"}</p>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
