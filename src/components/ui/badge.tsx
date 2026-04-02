import * as React from "react";

import { cn } from "@/lib/cn";

type BadgeVariant = "income" | "expense" | "neutral";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        variant === "income" && "bg-emerald-100 text-emerald-700",
        variant === "expense" && "bg-rose-100 text-rose-700",
        variant === "neutral" && "bg-slate-100 text-slate-700",
        className,
      )}
      {...props}
    />
  );
}
