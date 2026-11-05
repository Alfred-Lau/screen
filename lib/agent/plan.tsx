"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  Ban,
  CheckCircle2,
  Circle,
  Loader2,
  RotateCcw,
  Square,
  XCircle,
} from "lucide-react";

export type PlanStepStatus = "pending" | "running" | "done" | "failed" | "blocked";

export interface PlanStep {
  id: string;
  title: string;
  detail?: string;
  status: PlanStepStatus;
  elapsed?: string;
  /** Tool or model that runs this step, shown as a small chip. */
  tool?: string;
  /** Rough time left, shown while the step is still pending. */
  estimate?: string;
}

interface AgentPlanProps {
  title?: string;
  steps: PlanStep[];
  onReorder?: (steps: PlanStep[]) => void;
  onRetry?: (id: string) => void;
  onStop?: () => void;
  className?: string;
}

function statusLabel(status: PlanStepStatus): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "running":
      return "Running";
    case "done":
      return "Done";
    case "failed":
      return "Failed";
    case "blocked":
      return "Blocked";
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

function StatusIcon({ status }: { status: PlanStepStatus }) {
  switch (status) {
    case "pending":
      return <Circle size={16} className="text-gray-300 dark:text-gray-600" />;
    case "running":
      return <Loader2 size={16} className="text-sky-500 animate-spin" />;
    case "done":
      return <CheckCircle2 size={16} className="text-emerald-500" />;
    case "failed":
      return <XCircle size={16} className="text-rose-500" />;
    case "blocked":
      return <Ban size={16} className="text-amber-500" />;
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

const chipClass =
  "rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400";

export function AgentPlan({
  title = "Plan",
  steps,
  onReorder,
  onRetry,
  onStop,
  className,
}: AgentPlanProps) {
  const doneCount = steps.filter((step) => step.status === "done").length;
  const running = steps.some((step) => step.status === "running");
  const percent = steps.length === 0 ? 0 : Math.round((doneCount / steps.length) * 100);

  function move(index: number, direction: -1 | 1) {
    if (!onReorder) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= steps.length) return;
    const next = [...steps];
    const [item] = next.splice(index, 1);
    if (!item) return;
    next.splice(nextIndex, 0, item);
    onReorder(next);
  }

  return (
    <section className={cn("rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950", className)}>
      <header className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400">
              {doneCount} of {steps.length} done
            </span>
            {running && onStop ? (
              <button
                type="button"
                onClick={onStop}
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2 py-0.5 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
              >
                <Square size={10} />
                Stop
              </button>
            ) : null}
          </div>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className="h-full rounded-full bg-gray-900 transition-[width] duration-500 dark:bg-white"
            style={{ width: `${percent}%` }}
          />
        </div>
      </header>
      <ol className="divide-y divide-gray-100 dark:divide-gray-800">
        {steps.map((step, index) => (
          <li key={step.id} className="flex items-start gap-3 px-4 py-3">
            <span className="mt-0.5">
              <StatusIcon status={step.status} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] tabular-nums text-gray-300 dark:text-gray-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{step.title}</p>
                {step.tool ? <span className={chipClass}>{step.tool}</span> : null}
                <span className="text-[11px] text-gray-400">{statusLabel(step.status)}</span>
                {step.elapsed ? (
                  <span className="text-[11px] tabular-nums text-gray-400">{step.elapsed}</span>
                ) : null}
                {!step.elapsed && step.estimate && step.status === "pending" ? (
                  <span className="text-[11px] tabular-nums text-gray-300 dark:text-gray-600">~{step.estimate}</span>
                ) : null}
              </div>
              {step.detail ? (
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{step.detail}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-1">
              {step.status === "failed" && onRetry ? (
                <button
                  type="button"
                  onClick={() => onRetry(step.id)}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <RotateCcw size={12} />
                  Retry
                </button>
              ) : null}
              {onReorder ? (
                <>
                  <button
                    type="button"
                    aria-label={`Move ${step.title} up`}
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${step.title} down`}
                    disabled={index === steps.length - 1}
                    onClick={() => move(index, 1)}
                    className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  >
                    <ArrowDown size={14} />
                  </button>
                </>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
