"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, ChevronRight, Undo2 } from "lucide-react";

export type ChangeStatus = "proposed" | "applied" | "reverted";

export interface AgentChange {
  id: string;
  label: string;
  before: string;
  after: string;
  status: ChangeStatus;
  /** When it happened, or when it was proposed. */
  at?: string;
  /** Who or what made the change. */
  by?: string;
  /** One line of context, shown when the row is expanded. */
  detail?: string;
}

interface AgentLedgerProps {
  title?: string;
  changes: AgentChange[];
  onApply?: (id: string) => void;
  onRevert?: (id: string) => void;
  onApplyAll?: () => void;
  className?: string;
}

function statusLabel(status: ChangeStatus): string {
  switch (status) {
    case "proposed":
      return "Proposed";
    case "applied":
      return "Applied";
    case "reverted":
      return "Reverted";
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

const statusClass: Record<ChangeStatus, string> = {
  proposed: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  applied: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  reverted: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
};

export function AgentLedger({
  title = "Changes",
  changes,
  onApply,
  onRevert,
  onApplyAll,
  className,
}: AgentLedgerProps) {
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const proposed = changes.filter((change) => change.status === "proposed").length;
  const applied = changes.filter((change) => change.status === "applied").length;

  function toggle(id: string) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section className={cn("rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950", className)}>
      <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400">
            {applied} of {changes.length} applied
          </span>
          {onApplyAll && proposed > 1 ? (
            <button
              type="button"
              onClick={onApplyAll}
              className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-2.5 py-1 text-[11px] font-semibold text-white dark:bg-white dark:text-gray-900"
            >
              <Check size={11} />
              Apply all {proposed}
            </button>
          ) : null}
        </div>
      </header>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {changes.map((change) => {
          const open = expanded.has(change.id);
          return (
            <li key={change.id} className="px-4 py-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{change.label}</p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {change.before} → {change.after}
                  </p>
                  {change.at || change.by ? (
                    <p className="mt-0.5 text-[11px] text-gray-400">
                      {[change.by, change.at].filter(Boolean).join(" · ")}
                    </p>
                  ) : null}
                </div>
                <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium", statusClass[change.status])}>
                  {statusLabel(change.status)}
                </span>
              </div>
              {open ? (
                <div className="mt-2 overflow-hidden rounded-xl border border-gray-100 font-mono text-[11px] leading-relaxed dark:border-gray-800">
                  <p className="bg-rose-50 px-2 py-1 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
                    - {change.before}
                  </p>
                  <p className="bg-emerald-50 px-2 py-1 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                    + {change.after}
                  </p>
                  {change.detail ? (
                    <p className="border-t border-gray-100 px-2 py-1 font-sans text-gray-500 dark:border-gray-800 dark:text-gray-400">
                      {change.detail}
                    </p>
                  ) : null}
                </div>
              ) : null}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {change.status === "applied" ? (
                  <button
                    type="button"
                    onClick={() => onRevert?.(change.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200"
                  >
                    <Undo2 size={12} />
                    Revert {change.label}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onApply?.(change.id)}
                    className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-2.5 py-1 text-[11px] font-semibold text-white dark:bg-white dark:text-gray-900"
                  >
                    <Check size={12} />
                    Apply {change.label}
                  </button>
                )}
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => toggle(change.id)}
                  className="inline-flex items-center gap-1 rounded-full px-1.5 py-1 text-[11px] font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  {open ? "Hide diff" : "Show diff"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
