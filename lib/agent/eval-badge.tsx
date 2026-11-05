"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Check, ChevronDown, ShieldCheck, X } from "lucide-react";

export type EvalVerdict = "pass" | "warn" | "fail";

export interface EvalScore {
  label: string;
  value: number;
  max?: number;
  verdict?: EvalVerdict;
  detail?: string;
}

interface EvalBadgeProps {
  verdict: EvalVerdict;
  suite?: string;
  passed?: number;
  total?: number;
  scores?: EvalScore[];
  runId?: string;
  ranAt?: string;
  onOpen?: () => void;
  defaultOpen?: boolean;
  className?: string;
}

const VERDICT_STYLE: Record<EvalVerdict, { wrap: string; icon: React.ReactNode; label: string }> = {
  pass: {
    wrap: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",
    icon: <Check size={10} strokeWidth={3} />,
    label: "Passed",
  },
  warn: {
    wrap: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
    icon: <AlertTriangle size={10} />,
    label: "Needs review",
  },
  fail: {
    wrap: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300",
    icon: <X size={10} strokeWidth={3} />,
    label: "Failed",
  },
};

export function EvalBadge({
  verdict,
  suite = "eval suite",
  passed,
  total,
  scores = [],
  runId,
  ranAt,
  onOpen,
  defaultOpen = false,
  className,
}: EvalBadgeProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const style = VERDICT_STYLE[verdict];
  const hasDetail = scores.length > 0 || Boolean(runId);

  return (
    <div className={cn("inline-block w-full max-w-md", className)}>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <button
          type="button"
          onClick={() => (hasDetail ? setOpen((current) => !current) : onOpen?.())}
          className="flex w-full items-center gap-2 px-3 py-2 text-left"
        >
          <ShieldCheck size={13} className="shrink-0 text-gray-400" />
          <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-gray-800 dark:text-gray-100">
            {suite}
          </span>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium",
              style.wrap,
            )}
          >
            {style.icon}
            {style.label}
            {typeof passed === "number" && typeof total === "number" ? ` ${passed}/${total}` : ""}
          </span>
          {hasDetail && (
            <ChevronDown
              size={11}
              className={cn("shrink-0 text-gray-400 transition-transform", open ? "" : "-rotate-90")}
            />
          )}
        </button>

        {open && (
          <div className="border-t border-gray-100 px-3 py-2 dark:border-gray-800">
            <ul className="space-y-1.5">
              {scores.map((score) => {
                const max = score.max ?? 100;
                const percent = Math.max(0, Math.min(100, Math.round((score.value / max) * 100)));
                const tone =
                  score.verdict === "fail"
                    ? "bg-rose-500"
                    : score.verdict === "warn"
                      ? "bg-amber-500"
                      : "bg-emerald-500";
                return (
                  <li key={score.label}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[11px] text-gray-600 dark:text-gray-300">
                        {score.label}
                      </span>
                      <span className="shrink-0 text-[10.5px] tabular-nums text-gray-400">
                        {score.value}/{max}
                      </span>
                    </div>
                    <div className="mt-1 h-1 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                      <div className={cn("h-1 rounded-full", tone)} style={{ width: `${percent}%` }} />
                    </div>
                    {score.detail ? (
                      <p className="mt-0.5 text-[10px] text-gray-400">{score.detail}</p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-gray-400">
              <span className="font-mono">{runId ? runId.slice(0, 12) : ""}</span>
              <span>{ranAt}</span>
            </div>
            {onOpen ? (
              <button
                type="button"
                onClick={onOpen}
                className="mt-1.5 text-[10.5px] font-medium text-gray-500 underline-offset-2 hover:underline dark:text-gray-400"
              >
                Open full report
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
