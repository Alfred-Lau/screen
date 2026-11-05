"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, ExternalLink, RotateCcw, X } from "lucide-react";

export type InboxStatus = "running" | "needs_approval" | "done" | "failed";
export type InboxFilter = "all" | "needs_you" | "running" | "failed";

export interface InboxItem {
  id: string;
  title: string;
  agent: string;
  status: InboxStatus;
  elapsed?: string;
  detail?: string;
  /** Marks a task the person has not opened yet. */
  unread?: boolean;
  /** 0-100, drawn as a thin bar while the task runs. */
  progress?: number;
}

interface AgentInboxProps {
  title?: string;
  items: InboxItem[];
  defaultFilter?: InboxFilter;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onRetry?: (id: string) => void;
  onOpen?: (id: string) => void;
  className?: string;
}

function statusLabel(status: InboxStatus): string {
  switch (status) {
    case "running":
      return "Running";
    case "needs_approval":
      return "Needs approval";
    case "done":
      return "Done";
    case "failed":
      return "Failed";
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

const statusClass: Record<InboxStatus, string> = {
  running: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
  needs_approval: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  done: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  failed: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
};

const FILTERS: { value: InboxFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "needs_you", label: "Needs you" },
  { value: "running", label: "Running" },
  { value: "failed", label: "Failed" },
];

function matches(item: InboxItem, filter: InboxFilter): boolean {
  switch (filter) {
    case "all":
      return true;
    case "needs_you":
      return item.status === "needs_approval";
    case "running":
      return item.status === "running";
    case "failed":
      return item.status === "failed";
    default: {
      const exhaustive: never = filter;
      return exhaustive;
    }
  }
}

export function AgentInbox({
  title = "Inbox",
  items,
  defaultFilter = "all",
  onApprove,
  onReject,
  onRetry,
  onOpen,
  className,
}: AgentInboxProps) {
  const [filter, setFilter] = React.useState<InboxFilter>(defaultFilter);
  const needsYou = items.filter((item) => item.status === "needs_approval").length;
  const visible = items.filter((item) => matches(item, filter));

  return (
    <section className={cn("rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950", className)}>
      <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {items.length} tasks
          {needsYou > 0 ? (
            <span className="ml-1.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              {needsYou} need you
            </span>
          ) : null}
        </span>
      </header>
      <div className="flex flex-wrap gap-1 border-b border-gray-100 px-3 py-2 dark:border-gray-800">
        {FILTERS.map((option) => {
          const count = items.filter((item) => matches(item, option.value)).length;
          const active = filter === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
                active
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
              )}
            >
              {option.label}
              <span className={cn("ml-1 tabular-nums", active ? "opacity-70" : "opacity-60")}>{count}</span>
            </button>
          );
        })}
      </div>
      {visible.length === 0 ? (
        <p className="px-4 py-6 text-center text-xs text-gray-400">Nothing here. Other tabs may have work.</p>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {visible.map((item) => (
            <li key={item.id} className="px-4 py-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-white">
                    {item.unread ? <span className="size-1.5 shrink-0 rounded-full bg-sky-500" aria-label="Unread" /> : null}
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-400">
                    {item.agent}
                    {item.elapsed ? ` · ${item.elapsed}` : ""}
                  </p>
                  {item.detail ? (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.detail}</p>
                  ) : null}
                  {item.status === "running" && typeof item.progress === "number" ? (
                    <div className="mt-2 h-1 w-40 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-full rounded-full bg-sky-500 transition-[width] duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, item.progress))}%` }}
                      />
                    </div>
                  ) : null}
                </div>
                <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium", statusClass[item.status])}>
                  {statusLabel(item.status)}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.status === "needs_approval" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onApprove?.(item.id)}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-2.5 py-1 text-[11px] font-semibold text-white dark:bg-white dark:text-gray-900"
                    >
                      <Check size={12} />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => onReject?.(item.id)}
                      className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-2.5 py-1 text-[11px] font-semibold text-rose-600 dark:border-rose-900 dark:text-rose-300"
                    >
                      <X size={12} />
                      Reject
                    </button>
                  </>
                ) : null}
                {item.status === "failed" ? (
                  <button
                    type="button"
                    onClick={() => onRetry?.(item.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200"
                  >
                    <RotateCcw size={12} />
                    Retry
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => onOpen?.(item.id)}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  <ExternalLink size={12} />
                  Open
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
