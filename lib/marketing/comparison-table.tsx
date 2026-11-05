"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, X, Minus } from "lucide-react";

type CellValue = boolean | string | React.ReactNode;

interface ComparisonRow {
  feature: string;
  description?: string;
  values: CellValue[];
}

interface ComparisonPlan {
  name: string;
  badge?: string;
  recommended?: boolean;
}

interface ComparisonTableProps extends React.HTMLAttributes<HTMLElement> {
  plans: ComparisonPlan[];
  rows: ComparisonRow[];
  headline?: string;
  description?: string;
  stickyHeader?: boolean;
}

function CellRenderer({ value, recommended }: { value: CellValue; recommended?: boolean }) {
  if (value === true) {
    return (
      <div className={cn(
        "flex items-center justify-center w-6 h-6 rounded-full mx-auto",
        recommended ? "bg-primary-foreground/20" : "bg-emerald-100 dark:bg-emerald-900/30"
      )}>
        <Check className={cn("size-3.5", recommended ? "text-primary-foreground" : "text-emerald-600 dark:text-emerald-400")} />
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted mx-auto">
        <X className="size-3.5 text-muted-foreground/40" />
      </div>
    );
  }
  if (value === null || value === undefined) {
    return <Minus className="size-4 text-muted-foreground/40 mx-auto" />;
  }
  return <span className="text-sm font-medium">{value as React.ReactNode}</span>;
}

export function ComparisonTable({
  plans,
  rows,
  headline,
  description,
  stickyHeader = true,
  className,
  ...props
}: ComparisonTableProps) {
  return (
    <section className={cn("w-full py-16", className)} {...props}>
      <div className="mx-auto max-w-5xl px-6">
        {(headline || description) && (
          <div className="text-center mb-10">
            {headline && (
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">{headline}</h2>
            )}
            {description && (
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">{description}</p>
            )}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full">
            <thead className={cn(stickyHeader && "sticky top-0 z-10")}>
              <tr>
                <th className="text-left px-5 py-4 bg-muted/50 border-b border-border text-sm font-semibold text-muted-foreground w-2/5">
                  Features
                </th>
                {plans.map((plan, i) => (
                  <th
                    key={i}
                    className={cn(
                      "px-5 py-4 border-b border-border text-center text-sm font-bold",
                      plan.recommended
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-foreground"
                    )}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {plan.name}
                      {plan.badge && (
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-semibold",
                            plan.recommended
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-primary/10 text-primary"
                          )}
                        >
                          {plan.badge}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    "border-b border-border last:border-0",
                    rowIndex % 2 === 1 && "bg-muted/20"
                  )}
                >
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-foreground">{row.feature}</p>
                    {row.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{row.description}</p>
                    )}
                  </td>
                  {row.values.map((val, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn(
                        "px-5 py-3.5 text-center",
                        plans[colIndex]?.recommended && "bg-primary/5"
                      )}
                    >
                      <CellRenderer value={val} recommended={plans[colIndex]?.recommended} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
