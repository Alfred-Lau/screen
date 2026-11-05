"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export type StatsTrend = "up" | "down" | "neutral";

interface StatsBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: string | number;
  trend?: StatsTrend;
  showIcon?: boolean;
  showDot?: boolean;
  size?: "sm" | "md";
}

export function StatsBadge({
  value,
  trend = "neutral",
  showIcon = true,
  showDot = true,
  size = "md",
  className,
  ...props
}: StatsBadgeProps) {
  const trendConfig = {
    up: {
      icon: <TrendingUp className={cn(size === "sm" ? "size-3" : "size-3.5")} />,
      textClass: "text-emerald-700 dark:text-emerald-300",
      bgClass: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
      dotClass: "bg-emerald-500",
    },
    down: {
      icon: <TrendingDown className={cn(size === "sm" ? "size-3" : "size-3.5")} />,
      textClass: "text-red-700 dark:text-red-300",
      bgClass: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800",
      dotClass: "bg-red-500",
    },
    neutral: {
      icon: <Minus className={cn(size === "sm" ? "size-3" : "size-3.5")} />,
      textClass: "text-muted-foreground",
      bgClass: "bg-muted border-border",
      dotClass: "bg-muted-foreground",
    },
  };

  const config = trendConfig[trend];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2 py-0.5 text-xs",
        config.bgClass,
        config.textClass,
        className
      )}
      {...props}
    >
      {showDot && (
        <span className={cn("rounded-full shrink-0", size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2", config.dotClass)} />
      )}
      {showIcon && config.icon}
      {value}
    </span>
  );
}
