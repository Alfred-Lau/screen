"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, ChevronDown } from "lucide-react";

export type TraceKind = "llm" | "tool" | "agent";
export type TraceStatus = "pending" | "running" | "done" | "error";
export type TraceLayout = "list" | "waterfall";

export interface TraceSpan {
  id: string;
  name: string;
  kind: TraceKind;
  status: TraceStatus;
  durationMs: number;
  /** Start offset from the beginning of the run. Auto-stacked when omitted. */
  offsetMs?: number;
  tokens?: number;
  costUsd?: number;
  model?: string;
  error?: string;
  detail?: string;
  children?: TraceSpan[];
}

interface AgentTraceProps {
  title?: string;
  spans: TraceSpan[];
  layout?: TraceLayout;
  className?: string;
}

function kindLabel(kind: TraceKind): string {
  switch (kind) {
    case "llm":
      return "Model";
    case "tool":
      return "Tool";
    case "agent":
      return "Agent";
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
}

function statusLabel(status: TraceStatus): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "running":
      return "Running";
    case "done":
      return "Done";
    case "error":
      return "Error";
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

function formatDuration(durationMs: number): string {
  if (durationMs < 1000) return `${durationMs}ms`;
  return `${(durationMs / 1000).toFixed(1)}s`;
}

function formatCost(costUsd: number): string {
  if (costUsd < 0.01) return `$${costUsd.toFixed(4)}`;
  return `$${costUsd.toFixed(2)}`;
}

const barClass: Record<TraceStatus, string> = {
  pending: "bg-gray-200 dark:bg-gray-700",
  running: "bg-sky-500",
  done: "bg-emerald-500",
  error: "bg-rose-500",
};

interface FlatSpan {
  span: TraceSpan;
  depth: number;
}

function flatten(spans: TraceSpan[], depth = 0): FlatSpan[] {
  return spans.flatMap((span) => [
    { span, depth },
    ...flatten(span.children ?? [], depth + 1),
  ]);
}

function withOffsets(rows: FlatSpan[]): (FlatSpan & { start: number; end: number })[] {
  const explicit = rows.some((row) => typeof row.span.offsetMs === "number");
  let cursor = 0;
  return rows.map((row) => {
    const start = explicit ? (row.span.offsetMs ?? 0) : cursor;
    const end = start + row.span.durationMs;
    if (!explicit) cursor = end;
    return { ...row, start, end };
  });
}

export function AgentTrace({ title = "Trace", spans, layout = "list", className }: AgentTraceProps) {
  const rows = React.useMemo(() => withOffsets(flatten(spans)), [spans]);
  const wall = Math.max(...rows.map((row) => row.end), 1);
  const sum = rows.reduce((total, row) => total + row.span.durationMs, 0);
  const failures = rows.filter((row) => row.span.status === "error").length;
  const [open, setOpen] = React.useState<string | null>(null);

  return (
    <section
      className={cn(
        "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
          {failures > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-600 dark:bg-rose-950/50 dark:text-rose-300">
              <AlertCircle size={9} />
              {failures} failed
            </span>
          )}
        </div>
        <span className="shrink-0 text-xs tabular-nums text-gray-500 dark:text-gray-400">
          {formatDuration(layout === "waterfall" ? wall : sum)}
        </span>
      </header>

      {layout === "waterfall" && (
        <div className="grid grid-cols-[7.5rem_1fr_2.75rem] items-center gap-3 border-b border-gray-100 px-4 py-1.5 dark:border-gray-800 sm:grid-cols-[11rem_1fr_3rem]">
          <span className="text-[10px] uppercase tracking-wide text-gray-400">Span</span>
          <div className="flex justify-between text-[9px] tabular-nums text-gray-400">
            <span>0</span>
            <span>{formatDuration(Math.round(wall * 0.25))}</span>
            <span>{formatDuration(Math.round(wall * 0.5))}</span>
            <span>{formatDuration(Math.round(wall * 0.75))}</span>
            <span>{formatDuration(wall)}</span>
          </div>
          <span />
        </div>
      )}

      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {rows.map(({ span, depth, start }) => {
          const hasDetail = Boolean(
            span.detail || span.model || span.tokens || span.costUsd || span.error,
          );
          const expanded = open === span.id;

          if (layout === "list") {
            const maxDuration = Math.max(...rows.map((row) => row.span.durationMs), 1);
            const width = Math.max(8, Math.round((span.durationMs / maxDuration) * 100));
            return (
              <li key={span.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {span.name}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {kindLabel(span.kind)} · {statusLabel(span.status)}
                      {span.tokens ? ` · ${span.tokens} tokens` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-gray-500">
                    {formatDuration(span.durationMs)}
                  </span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className={cn("h-1.5 rounded-full", barClass[span.status])}
                    style={{ width: `${width}%` }}
                  />
                </div>
                {span.detail ? (
                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{span.detail}</p>
                ) : null}
              </li>
            );
          }

          const left = (start / wall) * 100;
          const width = Math.max((span.durationMs / wall) * 100, 0.6);

          return (
            <li key={span.id}>
              <button
                type="button"
                onClick={() => hasDetail && setOpen(expanded ? null : span.id)}
                className={cn(
                  "grid w-full grid-cols-[7.5rem_1fr_2.75rem] items-center gap-3 px-4 py-1.5 text-left transition-colors sm:grid-cols-[11rem_1fr_3rem]",
                  hasDetail ? "hover:bg-gray-50 dark:hover:bg-gray-900/60" : "cursor-default",
                )}
              >
                <span
                  className="flex min-w-0 items-center gap-1"
                  style={{ paddingLeft: depth * 10 }}
                >
                  {hasDetail ? (
                    <ChevronDown
                      size={9}
                      className={cn(
                        "shrink-0 text-gray-300 transition-transform",
                        expanded ? "" : "-rotate-90",
                      )}
                    />
                  ) : (
                    <span className="w-[9px] shrink-0" />
                  )}
                  <span
                    className={cn(
                      "truncate text-[11.5px]",
                      depth === 0
                        ? "font-medium text-gray-800 dark:text-gray-100"
                        : "text-gray-500 dark:text-gray-400",
                    )}
                  >
                    {span.name}
                  </span>
                </span>

                <span className="relative block h-4 rounded bg-gray-50 dark:bg-gray-900/70">
                  <span
                    className={cn(
                      "absolute inset-y-1 rounded-sm",
                      barClass[span.status],
                      span.status === "running" && "animate-pulse",
                    )}
                    style={{ left: `${left}%`, width: `${width}%` }}
                  />
                </span>

                <span className="text-right text-[10.5px] tabular-nums text-gray-500 dark:text-gray-400">
                  {formatDuration(span.durationMs)}
                </span>
              </button>

              {expanded && (
                <dl className="mx-4 mb-2 grid grid-cols-2 gap-x-3 gap-y-1 rounded-lg bg-gray-50 px-2.5 py-2 text-[10.5px] dark:bg-gray-900/60 sm:grid-cols-4">
                  <Detail label="Kind" value={kindLabel(span.kind)} />
                  <Detail label="Status" value={statusLabel(span.status)} />
                  <Detail label="Latency" value={formatDuration(span.durationMs)} />
                  <Detail label="Start" value={`+${formatDuration(Math.round(start))}`} />
                  {span.model ? <Detail label="Model" value={span.model} mono /> : null}
                  {span.tokens ? <Detail label="Tokens" value={span.tokens.toLocaleString()} /> : null}
                  {span.costUsd ? <Detail label="Cost" value={formatCost(span.costUsd)} /> : null}
                  {span.detail ? (
                    <div className="col-span-2 sm:col-span-4">
                      <dt className="text-gray-400">Detail</dt>
                      <dd className="break-words text-gray-600 dark:text-gray-300">{span.detail}</dd>
                    </div>
                  ) : null}
                  {span.error ? (
                    <div className="col-span-2 sm:col-span-4">
                      <dt className="text-rose-500">Error</dt>
                      <dd className="break-words font-mono text-rose-600 dark:text-rose-300">
                        {span.error}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-gray-400">{label}</dt>
      <dd
        className={cn(
          "truncate text-gray-700 dark:text-gray-200",
          mono && "font-mono text-[10px]",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
