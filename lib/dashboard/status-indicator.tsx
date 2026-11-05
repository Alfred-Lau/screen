"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type StatusVariant = "online" | "offline" | "degraded" | "maintenance";

interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusVariant;
  label?: string;
  showLabel?: boolean;
  showPulse?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StatusIndicator({
  status,
  label,
  showLabel = true,
  showPulse = true,
  size = "md",
  className,
  ...props
}: StatusIndicatorProps) {
  const statusConfig: Record<
    StatusVariant,
    { dotClass: string; pulseClass: string; textClass: string; defaultLabel: string }
  > = {
    online: {
      dotClass: "bg-emerald-500",
      pulseClass: "bg-emerald-400",
      textClass: "text-emerald-700 dark:text-emerald-400",
      defaultLabel: "Online",
    },
    offline: {
      dotClass: "bg-red-500",
      pulseClass: "bg-red-400",
      textClass: "text-red-700 dark:text-red-400",
      defaultLabel: "Offline",
    },
    degraded: {
      dotClass: "bg-yellow-500",
      pulseClass: "bg-yellow-400",
      textClass: "text-yellow-700 dark:text-yellow-400",
      defaultLabel: "Degraded",
    },
    maintenance: {
      dotClass: "bg-blue-500",
      pulseClass: "bg-blue-400",
      textClass: "text-blue-700 dark:text-blue-400",
      defaultLabel: "Maintenance",
    },
  };

  const sizeConfig = {
    sm: { dot: "w-1.5 h-1.5", pulse: "w-1.5 h-1.5", text: "text-xs" },
    md: { dot: "w-2 h-2", pulse: "w-2 h-2", text: "text-sm" },
    lg: { dot: "w-3 h-3", pulse: "w-3 h-3", text: "text-base" },
  };

  const config = statusConfig[status];
  const sizes = sizeConfig[size];
  const displayLabel = label ?? config.defaultLabel;

  return (
    <div className={cn("inline-flex items-center gap-2", className)} {...props}>
      <span className="relative flex shrink-0">
        {showPulse && status !== "offline" && (
          <span
            className={cn(
              "absolute inline-flex rounded-full opacity-75 animate-ping",
              sizes.pulse,
              config.pulseClass
            )}
          />
        )}
        <span
          className={cn("relative inline-flex rounded-full", sizes.dot, config.dotClass)}
        />
      </span>
      {showLabel && (
        <span className={cn("font-medium", sizes.text, config.textClass)}>
          {displayLabel}
        </span>
      )}
    </div>
  );
}
