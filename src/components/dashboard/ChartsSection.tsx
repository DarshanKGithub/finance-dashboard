"use client";

import { Card, CardContent } from "@/components/ui/card";
import { currency } from "@/lib/finance-utils";
import { PieChart, LineChart } from "@mui/x-charts";

type TrendPoint = { id: number; label: string; net: number };
type CategoryPoint = { id: number; category: string; amount: number };

type ChartsSectionProps = {
  trendData: TrendPoint[];
  spendingByCategory: CategoryPoint[];
};

export function ChartsSection({ trendData, spendingByCategory }: ChartsSectionProps) {
  return (
    <section className="mt-6 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <Card className="reveal [animation-delay:320ms]">
        <CardContent>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Balance Trend</h2>
            <span className="text-xs text-slate-500">Time Based</span>
          </div>

          {trendData.length ? (
            <div className="mt-4 overflow-x-auto">
              <LineChart
                height={250}
                series={[{ data: trendData.map((item) => item.net), label: "Net", color: "#0369a1" }]}
                xAxis={[{ scaleType: "point", data: trendData.map((item) => item.label) }]}
                grid={{ horizontal: true }}
              />
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                {trendData.map((item) => (
                  <span key={item.id}>
                    {item.label}: {currency.format(item.net)}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-4 rounded-xl bg-slate-100 p-5 text-sm text-slate-500">No trend data available.</p>
          )}
        </CardContent>
      </Card>

      <Card className="reveal [animation-delay:420ms]">
        <CardContent>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Spending Breakdown</h2>
            <span className="text-xs text-slate-500">Category Based</span>
          </div>

          {spendingByCategory.length ? (
            <div className="mt-4">
              <PieChart
                height={250}
                series={[
                  {
                    data: spendingByCategory.map((item) => ({ id: item.id, value: item.amount, label: item.category })),
                    innerRadius: 42,
                    outerRadius: 85,
                  },
                ]}
              />
            </div>
          ) : (
            <p className="mt-4 rounded-xl bg-slate-100 p-5 text-sm text-slate-500">No expense categories to display.</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
