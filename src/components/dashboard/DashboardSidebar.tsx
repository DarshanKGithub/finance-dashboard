import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthUser } from "@/types/finance";

type DashboardSidebarProps = {
  user: AuthUser;
  balance: number;
  onLogout: () => void;
};

export function DashboardSidebar({ user, balance, onLogout }: DashboardSidebarProps) {
  const navItems = [
    { label: "Overview", icon: DashboardRoundedIcon, href: "#overview" },
    { label: "Transactions", icon: ReceiptLongRoundedIcon, href: "#all-transactions" },
    { label: "Insights", icon: InsightsRoundedIcon, href: "#insights" },
    { label: "Access", icon: ShieldRoundedIcon, href: "#access" },
  ];

  return (
    <aside className="reveal hidden lg:block lg:sticky lg:top-0 lg:h-screen lg:w-[300px] lg:shrink-0">
      <Card className="flex h-full flex-col rounded-none border-0 border-r border-white/10 bg-slate-950/95 text-slate-100 shadow-2xl backdrop-blur">
        <CardContent className="flex h-full flex-col gap-6 overflow-y-auto p-6 xl:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Zorvyn</p>
            <h2 className="mt-2 text-2xl font-semibold">Workspace</h2>
            <p className="mt-2 text-sm text-slate-300">Modern finance operations for your team.</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 transition hover:border-cyan-400/30 hover:bg-white/10"
                >
                  <Icon fontSize="small" className="text-cyan-300" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
            <p className="text-xs uppercase tracking-wide text-cyan-200">Signed in as</p>
            <p className="mt-1 font-medium text-slate-50">{user.name}</p>
            <p className="text-sm text-slate-300">{user.role} access</p>
            <p className="mt-3 text-3xl font-semibold text-cyan-300">${balance.toLocaleString("en-US", { maximumFractionDigits: 0 })}</p>
            <p className="text-xs text-slate-300">Current balance snapshot</p>
          </div>

          <Button className="w-full bg-white text-slate-900 hover:bg-slate-100" onClick={onLogout}>
            Logout
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
