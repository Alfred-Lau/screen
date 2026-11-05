"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "./user-avatar";

export type ActivityPrefixType = "avatar" | "icon" | "dot";
export type ActivityItemStatus = "default" | "success" | "warning" | "error" | "info";

interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  prefixType?: ActivityPrefixType;
  avatar?: { src?: string; name?: string };
  icon?: React.ReactNode;
  status?: ActivityItemStatus;
  action?: React.ReactNode;
}

interface ActivityFeedProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ActivityItem[];
  showConnector?: boolean;
  loading?: boolean;
  emptyMessage?: string;
}

const statusDotColors: Record<ActivityItemStatus, string> = {
  default: "bg-muted-foreground",
  success: "bg-emerald-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

const statusIconBg: Record<ActivityItemStatus, string> = {
  default: "bg-muted text-muted-foreground",
  success: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400",
  warning: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400",
  error: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400",
  info: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",
};

export function ActivityFeed({
  items,
  showConnector = true,
  loading = false,
  emptyMessage = "No activity yet",
  className,
  ...props
}: ActivityFeedProps) {
  if (loading) {
    return (
      <div className={cn("space-y-4", className)} {...props}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={cn("flex items-center justify-center py-8 text-muted-foreground text-sm", className)} {...props}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)} {...props}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const prefixType = item.prefixType ?? "dot";
        const status = item.status ?? "default";

        return (
          <div key={item.id} className="flex gap-3">
            {/* Prefix column */}
            <div className="flex flex-col items-center shrink-0">
              {prefixType === "avatar" && (
                <UserAvatar
                  src={item.avatar?.src}
                  name={item.avatar?.name}
                  size="sm"
                  showStatus={false}
                />
              )}
              {prefixType === "icon" && (
                <div className={cn("flex items-center justify-center w-8 h-8 rounded-full shrink-0", statusIconBg[status])}>
                  {item.icon}
                </div>
              )}
              {prefixType === "dot" && (
                <div className="flex items-center justify-center w-8 h-8 shrink-0">
                  <div className={cn("w-2.5 h-2.5 rounded-full", statusDotColors[status])} />
                </div>
              )}
              {showConnector && !isLast && (
                <div className="w-px flex-1 min-h-[12px] bg-border mt-1" />
              )}
            </div>

            {/* Content */}
            <div className={cn("flex-1 pb-4", isLast && "pb-0")}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground leading-snug">{item.title}</p>
                  {item.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.action}
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{item.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
