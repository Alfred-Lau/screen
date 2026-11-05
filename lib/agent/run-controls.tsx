"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Clock, Coins, Hash, Pause, Play, RotateCcw, Square } from "lucide-react";

export type RunState = "running" | "paused" | "waiting" | "done" | "stopped" | "error";

interface RunControlsProps {
  state: RunState;
  /** What the agent is doing right now, e.g. "Editing lib/pricing.ts". */
  step?: string;
  stepIndex?: number;
  stepTotal?: number;
  /** Formatted clock, e.g. "01:24". */
  elapsed?: string;
  tokens?: number;
  /** Pre-formatted, e.g. "$0.42". */
  cost?: string;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
  onRetry?: () => void;
  onRestart?: () => void;
  className?: string;
}

const meta: Record<RunState, { label: string; dot: string; labelClass: string }> = {
  running: {
    label: "Running",
    dot: "bg-blue-500",
    labelClass: "text-gray-900 dark:text-white",
  },
  paused: {
    label: "Paused",
    dot: "bg-amber-500",
    labelClass: "text-gray-900 dark:text-white",
  },
  waiting: {
    label: "Waiting on you",
    dot: "bg-amber-500",
    labelClass: "text-amber-700 dark:text-amber-300",
  },
  done: {
    label: "Done",
    dot: "bg-emerald-500",
    labelClass: "text-gray-900 dark:text-white",
  },
  stopped: {
    label: "Stopped",
    dot: "bg-gray-400",
    labelClass: "text-gray-700 dark:text-gray-300",
  },
  error: {
    label: "Failed",
    dot: "bg-rose-500",
    labelClass: "text-rose-700 dark:text-rose-300",
  },
};

function formatTokens(tokens?: number) {
  if (tokens === undefined) return undefined;
  if (tokens < 1000) return String(tokens);
  return `${(tokens / 1000).toFixed(1)}k`;
}

function Metric({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value?: string;
  label: string;
}) {
  if (!value) return null;
  return (
    <span
      title={label}
      className="flex items-center gap-1 font-mono text-[11px] tabular-nums text-gray-500 dark:text-gray-400"
    >
      <span className="text-gray-300 dark:text-gray-600">{icon}</span>
      {value}
    </span>
  );
}

function Action({
  label,
  icon,
  onClick,
  variant = "ghost",
}: {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors",
        variant === "primary" &&
          "bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200",
        variant === "ghost" &&
          "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800",
        variant === "danger" &&
          "border border-gray-200 text-rose-600 hover:bg-rose-50 dark:border-gray-700 dark:text-rose-400 dark:hover:bg-rose-950/40",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

export function RunControls({
  state,
  step,
  stepIndex,
  stepTotal,
  elapsed,
  tokens,
  cost,
  onPause,
  onResume,
  onStop,
  onRetry,
  onRestart,
  className,
}: RunControlsProps) {
  const current = meta[state];
  const progress =
    stepTotal && stepIndex ? Math.min(Math.round((stepIndex / stepTotal) * 100), 100) : undefined;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2.5">
        <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
          <span className={cn("h-2 w-2 rounded-full", current.dot)} />
          {state === "running" && (
            <span className={cn("absolute h-2 w-2 animate-ping rounded-full opacity-60", current.dot)} />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className={cn("text-[13px] font-semibold", current.labelClass)}>{current.label}</span>
            {stepIndex !== undefined && stepTotal !== undefined && (
              <span className="font-mono text-[11px] tabular-nums text-gray-400">
                step {stepIndex} of {stepTotal}
              </span>
            )}
          </div>
          {step && (
            <p className="mt-0.5 truncate text-[11px] text-gray-500 dark:text-gray-400">{step}</p>
          )}
        </div>

        <div className="hidden shrink-0 items-center gap-3 sm:flex">
          <Metric icon={<Clock size={11} />} value={elapsed} label="Elapsed" />
          <Metric icon={<Hash size={11} />} value={formatTokens(tokens)} label="Tokens" />
          <Metric icon={<Coins size={11} />} value={cost} label="Cost" />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {state === "running" && (
            <>
              <Action label="Pause" icon={<Pause size={11} />} onClick={onPause} />
              <Action
                label="Stop"
                icon={<Square size={11} />}
                onClick={onStop}
                variant="danger"
              />
            </>
          )}

          {state === "paused" && (
            <>
              <Action
                label="Resume"
                icon={<Play size={11} />}
                onClick={onResume}
                variant="primary"
              />
              <Action label="Stop" icon={<Square size={11} />} onClick={onStop} variant="danger" />
            </>
          )}

          {state === "waiting" && (
            <Action label="Stop" icon={<Square size={11} />} onClick={onStop} variant="danger" />
          )}

          {state === "error" && (
            <Action
              label="Retry"
              icon={<RotateCcw size={11} />}
              onClick={onRetry}
              variant="primary"
            />
          )}

          {(state === "done" || state === "stopped") && (
            <Action label="Run again" icon={<RotateCcw size={11} />} onClick={onRestart} />
          )}
        </div>
      </div>

      {progress !== undefined && (
        <div className="h-0.5 w-full bg-gray-100 dark:bg-gray-800">
          <div
            className={cn(
              "h-full transition-[width] duration-500",
              state === "error" ? "bg-rose-500" : state === "done" ? "bg-emerald-500" : "bg-blue-500",
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </section>
  );
}
