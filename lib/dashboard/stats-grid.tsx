"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MetricCard } from "./metric-card";
import type { MetricTrend } from "./metric-card";

interface StatItem {
  title: string;
  value: string | number;
  trend?: MetricTrend;
  trendValue?: string;
  trendLabel?: string;
  icon?: React.ReactNode;
  description?: string;
}

interface StatsGridProps extends React.HTMLAttributes<HTMLDivElement> {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  loading?: boolean;
}

const colsConfig = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function StatsGrid({
  stats,
  columns = 4,
  loading = false,
  className,
  ...props
}: StatsGridProps) {
  return (
    <div
      className={cn("grid gap-4", colsConfig[columns], className)}
      {...props}
    >
      {loading
        ? Array.from({ length: columns }).map((_, i) => (
            <MetricCard
              key={i}
              title=""
              value=""
              loading
            />
          ))
        : stats.map((stat, i) => (
            <MetricCard
              key={i}
              title={stat.title}
              value={stat.value}
              trend={stat.trend}
              trendValue={stat.trendValue}
              trendLabel={stat.trendLabel}
              icon={stat.icon}
              description={stat.description}
            />
          ))}
    </div>
  );
}
