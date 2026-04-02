import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthUser, Role } from "@/types/finance";

type DashboardHeaderProps = {
  user: AuthUser;
  onLogout: () => void;
  onRoleChange: (role: Role) => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
};

export function DashboardHeader({ user, onLogout, onRoleChange, theme, onThemeToggle }: DashboardHeaderProps) {
  return (
    <Card className="reveal border-white/40 bg-white/80 backdrop-blur-md">
      <CardContent className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Finance Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">Fintech SaaS Command Center</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Track cash flow, monitor spending, and manage transactions with role-based controls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 lg:justify-end">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
          <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">
            {user.role}
          </span>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span>Role</span>
            <select
              aria-label="Role switch"
              className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
              value={user.role}
              onChange={(event) => onRoleChange(event.target.value as Role)}
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <Button variant="outline" onClick={onThemeToggle}>
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </Button>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
