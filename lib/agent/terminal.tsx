"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Copy, Loader2, RotateCcw, X } from "lucide-react";

export type TerminalStream = "stdout" | "stderr" | "system";
export type TerminalState = "running" | "done" | "error";

export interface TerminalLine {
  text: string;
  /** stderr renders red, system renders dim. Defaults to stdout. */
  stream?: TerminalStream;
}

interface TerminalProps {
  /** The command the agent ran, without the prompt. */
  command: string;
  /** Optional working directory shown before the prompt. */
  cwd?: string;
  lines: (string | TerminalLine)[];
  /** 0 is success, anything else is a failure, null means still running. */
  exitCode?: number | null;
  duration?: string;
  state?: TerminalState;
  /** Lines kept before the output folds. Defaults to 10. */
  maxLines?: number;
  defaultOpen?: boolean;
  prompt?: string;
  onRerun?: () => void;
  className?: string;
}

const streamClass: Record<TerminalStream, string> = {
  stdout: "text-gray-200",
  stderr: "text-rose-300",
  system: "text-gray-500",
};

function resolveState(state: TerminalState | undefined, exitCode: number | null | undefined): TerminalState {
  if (state) return state;
  if (exitCode === null || exitCode === undefined) return "running";
  return exitCode === 0 ? "done" : "error";
}

export function Terminal({
  command,
  cwd,
  lines,
  exitCode,
  duration,
  state,
  maxLines = 10,
  defaultOpen = true,
  prompt = "$",
  onRerun,
  className,
}: TerminalProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [expanded, setExpanded] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const resolved = lines.map<TerminalLine>((line) =>
    typeof line === "string" ? { text: line, stream: "stdout" } : { stream: "stdout", ...line },
  );

  const resolvedState = resolveState(state, exitCode);
  const hidden = Math.max(resolved.length - maxLines, 0);
  const truncated = hidden > 0 && !expanded;
  const visible = truncated ? resolved.slice(0, maxLines) : resolved;

  function copy() {
    const text = resolved.map((line) => line.text).join("\n");
    void navigator.clipboard?.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-label={command}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <code className="min-w-0 truncate font-mono text-[12px] text-gray-900 dark:text-white">
            {cwd && <span className="text-gray-400 dark:text-gray-500">{cwd} </span>}
            <span className="select-none text-gray-400 dark:text-gray-500">{prompt} </span>
            {command}
          </code>
          <ChevronDown
            size={14}
            className={cn(
              "shrink-0 text-gray-400 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>

        {resolvedState === "running" && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            <Loader2 size={9} className="animate-spin" />
            running
          </span>
        )}

        {resolvedState !== "running" && exitCode !== undefined && (
          <span
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold",
              exitCode === 0
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
            )}
          >
            {exitCode === 0 ? <Check size={9} /> : <X size={9} />}
            exit {exitCode}
          </span>
        )}

        {duration && (
          <span className="hidden shrink-0 font-mono text-[11px] tabular-nums text-gray-400 sm:inline">
            {duration}
          </span>
        )}

        <button
          type="button"
          onClick={copy}
          aria-label="Copy output"
          className="shrink-0 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>

        {onRerun && (
          <button
            type="button"
            onClick={onRerun}
            aria-label="Run again"
            className="shrink-0 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <RotateCcw size={12} />
          </button>
        )}
      </div>

      {open && (
        <div className="bg-gray-950 px-3 py-2.5 dark:bg-black/40">
          <pre className="m-0 font-mono text-[11.5px] leading-[1.65]">
            {visible.map((line, index) => (
              <div
                key={index}
                className={cn("whitespace-pre-wrap break-words", streamClass[line.stream ?? "stdout"])}
              >
                {line.text || " "}
              </div>
            ))}
          </pre>

          {truncated && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="mt-1.5 font-mono text-[11px] text-gray-500 transition-colors hover:text-gray-200"
            >
              Show {hidden} more {hidden === 1 ? "line" : "lines"}
            </button>
          )}

          {hidden > 0 && expanded && (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="mt-1.5 font-mono text-[11px] text-gray-500 transition-colors hover:text-gray-200"
            >
              Show less
            </button>
          )}
        </div>
      )}
    </section>
  );
}
