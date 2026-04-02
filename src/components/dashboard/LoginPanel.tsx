"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockUsers, type AuthUser } from "@/data/mockUsers";

type LoginPanelProps = {
  onLogin: (user: AuthUser) => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
};

export function LoginPanel({ onLogin, theme, onThemeToggle }: LoginPanelProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const match = mockUsers.find(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password,
    );

    if (!match) {
      setError("Invalid credentials. Try one of the demo accounts below.");
      return;
    }

    const authUser: AuthUser = {
      id: match.id,
      name: match.name,
      email: match.email,
      role: match.role,
    };
    setError("");
    onLogin(authUser);
  }

  return (
    <div className="dashboard-shell min-h-screen">
      <div className="orb orb-a" />
      <div className="orb orb-b" />

      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center p-4 sm:p-8">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_1fr]">
          <section className="reveal rounded-3xl border border-white/40 bg-slate-900/90 p-8 text-slate-100 shadow-2xl backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Zorvyn Platform</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight">Control finance operations like a modern SaaS team.</h1>
            <p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
              Sign in as Admin or Viewer to explore role-based permissions, live insights, and transaction analytics.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/20 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-300">Admin Demo</p>
                <p className="mt-2 text-sm text-slate-100">admin@zorvyn.com</p>
                <p className="text-sm text-slate-300">admin123</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-300">Viewer Demo</p>
                <p className="mt-2 text-sm text-slate-100">viewer@zorvyn.com</p>
                <p className="text-sm text-slate-300">viewer123</p>
              </div>
            </div>
          </section>

          <Card className="reveal border-white/30 bg-white/85 shadow-xl backdrop-blur [animation-delay:140ms]">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Sign In</h2>
                  <p className="mt-1 text-sm text-slate-600">Access your dashboard workspace</p>
                </div>
                <Button type="button" variant="outline" onClick={onThemeToggle}>
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </Button>
              </div>

              <form onSubmit={handleLogin} className="mt-6 space-y-3">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                {error ? <p className="text-sm text-rose-600">{error}</p> : null}
                <Button type="submit" className="h-11 w-full bg-cyan-700 hover:bg-cyan-600">
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
