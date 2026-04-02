import { Card, CardContent } from "@/components/ui/card";

type Insights = {
  topCategory: string;
  monthlyText: string;
  observation: string;
};

type InsightsSectionProps = {
  insights: Insights;
};

export function InsightsSection({ insights }: InsightsSectionProps) {
  return (
    <Card className="reveal h-fit [animation-delay:620ms]">
      <CardContent>
        <h2 className="text-lg font-semibold text-slate-900">Insights</h2>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-slate-100 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Highest Spending Category</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{insights.topCategory}</p>
          </div>
          <div className="rounded-xl bg-slate-100 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Monthly Comparison</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{insights.monthlyText}</p>
          </div>
          <div className="rounded-xl bg-slate-100 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Observation</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{insights.observation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
