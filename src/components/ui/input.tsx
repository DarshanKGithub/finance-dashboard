import * as React from "react";

import { cn } from "@/lib/cn";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500",
        className,
      )}
      {...props}
    />
  );
}
