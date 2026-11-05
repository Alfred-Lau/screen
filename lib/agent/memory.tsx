"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Pin, PinOff, X } from "lucide-react";

export type MemoryKind = "preference" | "fact" | "rule";

export interface MemoryFact {
  id: string;
  label: string;
  detail: string;
  source: string;
  /** What sort of thing this is. Changes the chip, not the behaviour. */
  kind?: MemoryKind;
  /** Pinned facts survive trimming when the context window fills up. */
  pinned?: boolean;
  /** 0-100. How sure the extractor is that this is still true. */
  confidence?: number;
  /** The step that used it, so a person can see why it shaped the draft. */
  usedBy?: string;
}

interface AgentMemoryProps {
  title?: string;
  facts: MemoryFact[];
  onForget?: (id: string) => void;
  onPin?: (id: string, pinned: boolean) => void;
  className?: string;
}

const kindLabel: Record<MemoryKind, string> = {
  preference: "Preference",
  fact: "Fact",
  rule: "Rule",
};

const kindClass: Record<MemoryKind, string> = {
  preference: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
  fact: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
  rule: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
};

export function AgentMemory({ title = "Memory", facts, onForget, onPin, className }: AgentMemoryProps) {
  const ordered = React.useMemo(
    () => [...facts].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))),
    [facts],
  );
  const pinnedCount = facts.filter((fact) => fact.pinned).length;

  return (
    <section className={cn("rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950", className)}>
      <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {facts.length} facts
          {pinnedCount > 0 ? <span className="ml-1 text-gray-400">· {pinnedCount} pinned</span> : null}
        </span>
      </header>
      {ordered.length === 0 ? (
        <p className="px-4 py-3 text-xs text-gray-400">This run is not using any saved facts.</p>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {ordered.map((fact) => {
            const kind = fact.kind ?? "fact";
            return (
              <li key={fact.id} className="flex items-start justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{fact.label}</p>
                    <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-medium", kindClass[kind])}>
                      {kindLabel[kind]}
                    </span>
                    {fact.pinned ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-gray-500 dark:text-gray-400">
                        <Pin size={9} />
                        pinned
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">{fact.detail}</p>
                  <p className="mt-0.5 text-[11px] text-gray-400">
                    From {fact.source}
                    {fact.usedBy ? ` · used in ${fact.usedBy}` : ""}
                  </p>
                  {typeof fact.confidence === "number" ? (
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <div className="h-1 w-16 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            fact.confidence >= 80 ? "bg-emerald-500" : fact.confidence >= 50 ? "bg-amber-500" : "bg-rose-500",
                          )}
                          style={{ width: `${Math.min(100, Math.max(0, fact.confidence))}%` }}
                        />
                      </div>
                      <span className="text-[10px] tabular-nums text-gray-400">{fact.confidence}%</span>
                    </div>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {onPin ? (
                    <button
                      type="button"
                      aria-label={fact.pinned ? `Unpin ${fact.label}` : `Pin ${fact.label}`}
                      aria-pressed={Boolean(fact.pinned)}
                      onClick={() => onPin(fact.id, !fact.pinned)}
                      className={cn(
                        "rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800",
                        fact.pinned ? "text-gray-700 dark:text-gray-200" : "text-gray-400",
                      )}
                    >
                      {fact.pinned ? <PinOff size={13} /> : <Pin size={13} />}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => onForget?.(fact.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-600 dark:border-gray-700 dark:text-gray-300"
                  >
                    <X size={12} />
                    Forget {fact.label}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
