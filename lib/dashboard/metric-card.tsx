"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export type MetricTrend = "up" | "down" | "neutral";

interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  trend?: MetricTrend;
  trendValue?: string;
  trendLabel?: string;
  icon?: React.ReactNode;
  description?: string;
  loading?: boolean;
}

export function MetricCard({
  title,
  value,
  trend = "neutral",
  trendValue,
  trendLabel,
  icon,
  description,
  loading = false,
  className,
  ...props
}: MetricCardProps) {
  const trendConfig = {
    up: {
      icon: <TrendingUp className="size-3.5" />,
      textClass: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    down: {
      icon: <TrendingDown className="size-3.5" />,
      textClass: "text-red-600 dark:text-red-400",
      bgClass: "bg-red-50 dark:bg-red-950/30",
    },
    neutral: {
      icon: <Minus className="size-3.5" />,
      textClass: "text-muted-foreground",
      bgClass: "bg-muted",
    },
  };

  const config = trendConfig[trend];

  if (loading) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-card p-5",
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
            <div className="h-3 w-20 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-10 w-10 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5",
        "transition-shadow duration-200 hover:shadow-md",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
          <p className="mt-1 text-2xl font-bold text-card-foreground tracking-tight">
            {value}
          </p>
          {(trendValue || trendLabel) && (
            <div className="mt-2 flex items-center gap-1.5">
              {trendValue && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-xs font-medium",
                    config.bgClass,
                    config.textClass
                  )}
                >
                  {config.icon}
                  {trendValue}
                </span>
              )}
              {trendLabel && (
                <span className="text-xs text-muted-foreground">{trendLabel}</span>
              )}
            </div>
          )}
          {description && (
            <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {icon && (
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
