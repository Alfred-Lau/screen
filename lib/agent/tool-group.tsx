"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Circle,
  FileText,
  Globe,
  Loader2,
  PenLine,
  Search,
  Terminal,
  Wrench,
} from "lucide-react";

export type ToolCallState = "waiting" | "running" | "done" | "error";

export interface ToolCall {
  id: string;
  /** Verb shown in the row, e.g. "Read", "Grep", "Bash". */
  name: string;
  /** The argument the agent passed, e.g. "app/page.tsx" or "pnpm build". */
  target?: string;
  state: ToolCallState;
  duration?: string;
  detail?: string;
  output?: React.ReactNode;
}

interface ToolGroupProps {
  calls: ToolCall[];
  /** Accessible name for the group. Falls back to the generated summary. */
  title?: string;
  /** Override the generated one-line summary. */
  summary?: string;
  defaultOpen?: boolean;
  onOpen?: (id: string) => void;
  className?: string;
}

const iconRules: { pattern: RegExp; icon: typeof Wrench }[] = [
  { pattern: /read|open|file|cat/i, icon: FileText },
  { pattern: /grep|search|find|glob/i, icon: Search },
  { pattern: /bash|run|shell|exec|command|terminal/i, icon: Terminal },
  { pattern: /edit|write|patch|apply|update/i, icon: PenLine },
  { pattern: /fetch|web|http|browse|url/i, icon: Globe },
];

function iconFor(name: string) {
  const rule = iconRules.find((entry) => entry.pattern.test(name));
  return rule?.icon ?? Wrench;
}

function buildSummary(calls: ToolCall[]) {
  const order: string[] = [];
  const counts = new Map<string, number>();

  for (const call of calls) {
    if (!counts.has(call.name)) order.push(call.name);
    counts.set(call.name, (counts.get(call.name) ?? 0) + 1);
  }

  return order
    .map((name) => {
      const count = counts.get(name) ?? 0;
      return count > 1 ? `${name} ${count}` : name;
    })
    .join(" · ");
}

function totalDuration(calls: ToolCall[]) {
  let milliseconds = 0;
  let found = false;

  for (const call of calls) {
    if (!call.duration) continue;
    const value = call.duration.trim();
    const seconds = value.match(/^([\d.]+)\s*s$/i);
    const millis = value.match(/^([\d.]+)\s*ms$/i);

    if (seconds) {
      milliseconds += Number(seconds[1]) * 1000;
      found = true;
    } else if (millis) {
      milliseconds += Number(millis[1]);
      found = true;
    }
  }

  if (!found) return undefined;
  return milliseconds >= 1000 ? `${(milliseconds / 1000).toFixed(1)}s` : `${Math.round(milliseconds)}ms`;
}

function StateMark({ state }: { state: ToolCallState }) {
  switch (state) {
    case "running":
      return <Loader2 size={12} className="animate-spin text-blue-500" aria-label="Running" />;
    case "done":
      return <Check size={12} className="text-emerald-600 dark:text-emerald-400" aria-label="Done" />;
    case "error":
      return <AlertCircle size={12} className="text-rose-600 dark:text-rose-400" aria-label="Failed" />;
    case "waiting":
      return <Circle size={12} className="text-gray-300 dark:text-gray-600" aria-label="Waiting" />;
    default: {
      const exhaustive: never = state;
      return exhaustive;
    }
  }
}

export function ToolGroup({
  calls,
  title,
  summary,
  defaultOpen = false,
  onOpen,
  className,
}: ToolGroupProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [openCall, setOpenCall] = React.useState<string | null>(null);

  const failed = calls.filter((call) => call.state === "error").length;
  const running = calls.filter((call) => call.state === "running").length;
  const duration = totalDuration(calls);
  const label = summary ?? buildSummary(calls);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={title ?? label}
        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-900/40"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <Wrench size={12} />
        </span>

        <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-gray-900 dark:text-white">
          {label}
        </span>

        {failed > 0 && (
          <span className="shrink-0 rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            {failed} failed
          </span>
        )}

        {running > 0 && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            <Loader2 size={9} className="animate-spin" />
            {running} running
          </span>
        )}

        {duration && (
          <span className="shrink-0 font-mono text-[11px] tabular-nums text-gray-400">{duration}</span>
        )}

        <ChevronDown
          size={14}
          className={cn("shrink-0 text-gray-400 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul className="border-t border-gray-100 dark:border-gray-800">
          {calls.map((call) => {
            const Icon = iconFor(call.name);
            const expandable = Boolean(call.output);
            const expanded = openCall === call.id;

            const content = (
              <>
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md",
                    call.state === "error"
                      ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
                  )}
                >
                  <Icon size={11} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="shrink-0 text-[12px] font-semibold text-gray-900 dark:text-white">
                      {call.name}
                    </span>
                    {call.target && (
                      <code className="min-w-0 truncate font-mono text-[11px] text-gray-500 dark:text-gray-400">
                        {call.target}
                      </code>
                    )}
                  </span>
                  {call.detail && (
                    <span className="mt-0.5 block text-[11px] text-gray-500 dark:text-gray-400">
                      {call.detail}
                    </span>
                  )}
                </span>

                {call.duration && (
                  <span className="shrink-0 font-mono text-[11px] tabular-nums text-gray-400">
                    {call.duration}
                  </span>
                )}

                <span className="shrink-0">
                  <StateMark state={call.state} />
                </span>
              </>
            );

            return (
              <li key={call.id} className="border-t border-gray-100 first:border-t-0 dark:border-gray-800">
                {expandable ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOpenCall(expanded ? null : call.id);
                      onOpen?.(call.id);
                    }}
                    aria-expanded={expanded}
                    className="flex w-full items-start gap-2.5 px-4 py-2 text-left transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-900/40"
                  >
                    {content}
                  </button>
                ) : (
                  <div className="flex items-start gap-2.5 px-4 py-2">{content}</div>
                )}

                {expanded && call.output && (
                  <div className="border-t border-gray-100 bg-gray-50/80 px-4 py-2 font-mono text-[11px] leading-5 text-gray-600 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-300">
                    {call.output}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
