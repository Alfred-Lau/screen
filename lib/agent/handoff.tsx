"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Bot, User, Wrench } from "lucide-react";

export type HandoffStatus = "done" | "running" | "error";

export interface HandoffLane {
  id: string;
  name: string;
  kind?: "agent" | "human" | "tool";
}

export interface HandoffSpan {
  id: string;
  laneId: string;
  label: string;
  startMs: number;
  durationMs: number;
  status?: HandoffStatus;
}

export interface HandoffTransfer {
  id: string;
  fromLaneId: string;
  toLaneId: string;
  atMs: number;
  label?: string;
}

interface HandoffProps {
  lanes: HandoffLane[];
  spans: HandoffSpan[];
  transfers?: HandoffTransfer[];
  title?: string;
  totalMs?: number;
  className?: string;
}

const LANE_TONE = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
];

const KIND_ICON: Record<NonNullable<HandoffLane["kind"]>, React.ReactNode> = {
  agent: <Bot size={10} />,
  human: <User size={10} />,
  tool: <Wrench size={10} />,
};

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function Handoff({
  lanes,
  spans,
  transfers = [],
  title = "Handoff",
  totalMs,
  className,
}: HandoffProps) {
  const total =
    totalMs ??
    Math.max(
      ...spans.map((span) => span.startMs + span.durationMs),
      ...transfers.map((transfer) => transfer.atMs),
      1,
    );

  const laneIndex = new Map(lanes.map((lane, index) => [lane.id, index]));
  const laneCount = Math.max(lanes.length, 1);
  const pct = (value: number) => `${Math.max(0, Math.min(100, (value / total) * 100))}%`;

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
          <span className="text-[11px] text-gray-400">
            {lanes.length} {lanes.length === 1 ? "lane" : "lanes"}
            {transfers.length > 0 ? ` · ${transfers.length} handoffs` : ""}
          </span>
        </div>
        <span className="shrink-0 text-xs tabular-nums text-gray-500 dark:text-gray-400">
          {formatDuration(total)}
        </span>
      </header>

      <div className="px-4 py-3">
        <div className="relative grid grid-cols-[6.5rem_1fr] gap-x-2">
          {lanes.map((lane, index) => {
            const laneSpans = spans.filter((span) => span.laneId === lane.id);
            return (
              <React.Fragment key={lane.id}>
                <div className="flex h-10 items-center gap-1.5">
                  <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", LANE_TONE[index % LANE_TONE.length])} />
                  <span className="truncate text-[11px] font-medium text-gray-700 dark:text-gray-200">
                    {lane.name}
                  </span>
                  {lane.kind ? (
                    <span className="text-gray-300 dark:text-gray-600">{KIND_ICON[lane.kind]}</span>
                  ) : null}
                </div>
                <div className="relative h-10">
                  <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gray-100 dark:bg-gray-800" />
                  {laneSpans.map((span) => {
                    const tone =
                      span.status === "error"
                        ? "bg-rose-500"
                        : span.status === "running"
                          ? "bg-sky-500 animate-pulse"
                          : LANE_TONE[index % LANE_TONE.length];
                    const width = (span.durationMs / total) * 100;
                    return (
                      <div
                        key={span.id}
                        title={`${span.label} · ${formatDuration(span.durationMs)}`}
                        className={cn(
                          "absolute top-1/2 flex h-5 -translate-y-1/2 items-center overflow-hidden rounded-md px-1.5 text-[9.5px] font-medium text-white shadow-sm",
                          tone,
                        )}
                        style={{ left: pct(span.startMs), width: pct(span.durationMs) }}
                      >
                        {width > 9 ? <span className="truncate">{span.label}</span> : null}
                      </div>
                    );
                  })}
                </div>
              </React.Fragment>
            );
          })}

          {transfers.length > 0 && (
            <div
              className="pointer-events-none absolute inset-y-0"
              style={{ left: "calc(6.5rem + 0.5rem)", right: 0 }}
            >
              {transfers.map((transfer) => {
                const from = laneIndex.get(transfer.fromLaneId);
                const to = laneIndex.get(transfer.toLaneId);
                if (from === undefined || to === undefined) return null;
                const yFrom = ((from + 0.5) / laneCount) * 100;
                const yTo = ((to + 0.5) / laneCount) * 100;
                const top = Math.min(yFrom, yTo);
                const height = Math.abs(yTo - yFrom);
                const down = yTo > yFrom;
                return (
                  <div
                    key={transfer.id}
                    className="absolute"
                    style={{ left: pct(transfer.atMs), top: `${top}%`, height: `${height}%` }}
                  >
                    <div className="h-full border-l border-dashed border-gray-300 dark:border-gray-600" />
                    <span
                      className={cn(
                        "absolute -left-[5px] flex h-2.5 w-2.5 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-950",
                        down ? "-bottom-1.5" : "-top-1.5",
                      )}
                    >
                      {down ? <ArrowDown size={7} /> : <ArrowUp size={7} />}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {transfers.length > 0 && (
        <ul className="divide-y divide-gray-100 border-t border-gray-100 dark:divide-gray-800 dark:border-gray-800">
          {transfers.map((transfer) => {
            const from = lanes.find((lane) => lane.id === transfer.fromLaneId);
            const to = lanes.find((lane) => lane.id === transfer.toLaneId);
            return (
              <li key={transfer.id} className="flex items-center gap-2 px-4 py-1.5 text-[11px]">
                <span className="shrink-0 tabular-nums text-gray-400">+{formatDuration(transfer.atMs)}</span>
                <span className="shrink-0 font-medium text-gray-700 dark:text-gray-200">
                  {from?.name ?? transfer.fromLaneId}
                </span>
                <span className="shrink-0 text-gray-300">→</span>
                <span className="shrink-0 font-medium text-gray-700 dark:text-gray-200">
                  {to?.name ?? transfer.toLaneId}
                </span>
                {transfer.label ? (
                  <span className="min-w-0 truncate text-gray-400">{transfer.label}</span>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
