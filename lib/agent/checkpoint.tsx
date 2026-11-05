"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, FileText, History, MessageSquare, RotateCcw } from "lucide-react";

export type CheckpointScope = "files" | "conversation" | "both";

export interface Checkpoint {
  id: string;
  label: string;
  time?: string;
  detail?: string;
  files?: number;
  additions?: number;
  deletions?: number;
  current?: boolean;
  disabled?: boolean;
}

interface CheckpointProps {
  checkpoints: Checkpoint[];
  title?: string;
  defaultOpen?: boolean;
  onRestore?: (id: string, scope: CheckpointScope) => void;
  className?: string;
}

const SCOPES: { scope: CheckpointScope; label: string; icon: React.ReactNode }[] = [
  { scope: "files", label: "Files", icon: <FileText size={11} /> },
  { scope: "conversation", label: "Chat", icon: <MessageSquare size={11} /> },
  { scope: "both", label: "Both", icon: <RotateCcw size={11} /> },
];

export function Checkpoint({
  checkpoints,
  title = "Checkpoints",
  defaultOpen = true,
  onRestore,
  className,
}: CheckpointProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [pending, setPending] = React.useState<string | null>(null);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 border-b border-gray-100 px-4 py-2.5 text-left dark:border-gray-800"
      >
        <History size={14} className="text-gray-400" />
        <span className="text-[13px] font-medium text-gray-900 dark:text-white">{title}</span>
        <span className="text-[11px] text-gray-400">{checkpoints.length}</span>
        <ChevronDown
          size={14}
          className={cn(
            "ml-auto text-gray-400 transition-transform",
            open ? "rotate-180" : "rotate-0",
          )}
        />
      </button>

      {open && (
        <ol className="px-4 pt-3">
          {checkpoints.map((checkpoint, index) => {
            const isLast = index === checkpoints.length - 1;
            const isPending = pending === checkpoint.id;

            return (
              <li key={checkpoint.id} className="flex gap-3">
                <div className="flex flex-col items-center pt-[3px]">
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                      checkpoint.current
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-950",
                    )}
                  >
                    {checkpoint.current && <Check size={9} strokeWidth={3} />}
                  </span>
                  {!isLast && <span className="my-1 w-px flex-1 bg-gray-200 dark:bg-gray-800" />}
                </div>

                <div className={cn("min-w-0 flex-1", isLast ? "pb-3" : "pb-4")}>
                  <div className="flex items-baseline gap-2">
                    <p
                      className={cn(
                        "truncate text-[13px]",
                        checkpoint.current
                          ? "font-medium text-gray-950 dark:text-white"
                          : "text-gray-700 dark:text-gray-300",
                      )}
                    >
                      {checkpoint.label}
                    </p>
                    {checkpoint.current && (
                      <span className="shrink-0 rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                        Current
                      </span>
                    )}
                    {checkpoint.time && (
                      <span className="ml-auto shrink-0 font-mono text-[10px] tabular-nums text-gray-400">
                        {checkpoint.time}
                      </span>
                    )}
                  </div>

                  {(checkpoint.detail || checkpoint.files !== undefined) && (
                    <p className="mt-0.5 truncate text-[11px] text-gray-500 dark:text-gray-400">
                      {checkpoint.detail}
                      {checkpoint.files !== undefined && (
                        <span className="font-mono">
                          {checkpoint.detail ? " · " : ""}
                          {checkpoint.files} {checkpoint.files === 1 ? "file" : "files"}
                          {checkpoint.additions ? ` +${checkpoint.additions}` : ""}
                          {checkpoint.deletions ? ` −${checkpoint.deletions}` : ""}
                        </span>
                      )}
                    </p>
                  )}

                  {!checkpoint.current && !checkpoint.disabled && onRestore && (
                    <button
                      type="button"
                      onClick={() => setPending(isPending ? null : checkpoint.id)}
                      aria-expanded={isPending}
                      className="mt-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
                    >
                      Restore
                    </button>
                  )}

                  {isPending && onRestore && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {SCOPES.map((item) => (
                        <button
                          key={item.scope}
                          type="button"
                          onClick={() => {
                            onRestore(checkpoint.id, item.scope);
                            setPending(null);
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
