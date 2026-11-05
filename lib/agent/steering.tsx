"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CornerDownLeft, X, Zap } from "lucide-react";

export type SteeringMode = "queue" | "interrupt";
export type SteeringStatus = "queued" | "applied" | "dropped";

export interface SteeringNote {
  id: string;
  text: string;
  appliedTo?: string;
  status?: SteeringStatus;
}

interface AgentSteeringProps {
  title?: string;
  notes: SteeringNote[];
  onSubmit?: (text: string, mode: SteeringMode) => void;
  onRemove?: (id: string) => void;
  placeholder?: string;
  className?: string;
}

const statusLabel: Record<SteeringStatus, string> = {
  queued: "Queued",
  applied: "Applied",
  dropped: "Dropped",
};

const statusClass: Record<SteeringStatus, string> = {
  queued: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  applied: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  dropped: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300",
};

export function AgentSteering({
  title = "Steering",
  notes,
  onSubmit,
  onRemove,
  placeholder = "Add a note for the next step",
  className,
}: AgentSteeringProps) {
  const [draft, setDraft] = React.useState("");
  const [mode, setMode] = React.useState<SteeringMode>("queue");
  const waiting = notes.filter((note) => (note.status ?? "queued") === "queued").length;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSubmit?.(text, mode);
    setDraft("");
  }

  return (
    <section className={cn("rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950", className)}>
      <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {waiting > 0 ? `${waiting} waiting` : "No notes waiting"}
        </span>
      </header>
      <form onSubmit={submit} className="px-4 py-3 space-y-2">
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-3 py-2 text-xs font-semibold text-white dark:bg-white dark:text-gray-900"
          >
            {mode === "queue" ? <CornerDownLeft size={12} /> : <Zap size={12} />}
            {mode === "queue" ? "Queue" : "Interrupt"}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div role="radiogroup" aria-label="Delivery" className="inline-flex rounded-full border border-gray-200 p-0.5 dark:border-gray-700">
            {(["queue", "interrupt"] as const).map((option) => {
              const active = mode === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setMode(option)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize",
                    active ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "text-gray-500 dark:text-gray-400",
                  )}
                >
                  {option === "queue" ? <CornerDownLeft size={10} /> : <Zap size={10} />}
                  {option}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-gray-400">
            {mode === "queue" ? "Applies to the next unfinished step." : "Stops the run now and applies it."}
          </p>
        </div>
      </form>
      {notes.length > 0 ? (
        <ul className="divide-y divide-gray-100 border-t border-gray-100 dark:divide-gray-800 dark:border-gray-800">
          {notes.map((note) => {
            const status = note.status ?? "queued";
            return (
              <li key={note.id} className="flex items-start justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-sm text-gray-800 dark:text-gray-100",
                      status === "dropped" && "text-gray-400 line-through dark:text-gray-500",
                    )}
                  >
                    {note.text}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-gray-400">
                    <span className={cn("rounded-full px-1.5 py-0.5 font-medium", statusClass[status])}>
                      {statusLabel[status]}
                    </span>
                    {note.appliedTo ? `for ${note.appliedTo}` : "waiting for the next step"}
                  </p>
                </div>
                {onRemove ? (
                  <button
                    type="button"
                    aria-label={`Remove note: ${note.text}`}
                    onClick={() => onRemove(note.id)}
                    className="shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  >
                    <X size={13} />
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="px-4 pb-3 text-xs text-gray-400">Notes wait for the next unfinished step.</p>
      )}
    </section>
  );
}
