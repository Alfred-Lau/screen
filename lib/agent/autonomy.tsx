"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Gauge, ShieldQuestion, Wallet } from "lucide-react";

export type AutonomyLevel = "ask" | "review" | "auto";

interface AutonomyOption {
  value: AutonomyLevel;
  label: string;
  detail: string;
}

const options: AutonomyOption[] = [
  { value: "ask", label: "Ask first", detail: "Stop before each step that leaves the product." },
  { value: "review", label: "Review the send", detail: "Draft freely. Stop only before the email goes out." },
  { value: "auto", label: "Send on its own", detail: "Finish the run without asking." },
];

export interface AutonomyOverride {
  id: string;
  label: string;
  level: AutonomyLevel;
}

export interface AutonomyLimits {
  maxSteps?: number;
  maxCostUsd?: number;
  maxMinutes?: number;
}

interface AgentAutonomyProps {
  title?: string;
  value: AutonomyLevel;
  onChange?: (value: AutonomyLevel) => void;
  /** Per-action exceptions. They win over the level above. */
  overrides?: AutonomyOverride[];
  onOverrideChange?: (id: string, level: AutonomyLevel) => void;
  /** Hard stops that apply even at auto. */
  limits?: AutonomyLimits;
  className?: string;
}

const levelShort: Record<AutonomyLevel, string> = {
  ask: "Ask",
  review: "Review",
  auto: "Auto",
};

const stopsBefore: Record<AutonomyLevel, string> = {
  ask: "every step that leaves the product",
  review: "the send, the refund, and any delete",
  auto: "nothing, apart from the limits below",
};

export function AgentAutonomy({
  title = "Autonomy",
  value,
  onChange,
  overrides,
  onOverrideChange,
  limits,
  className,
}: AgentAutonomyProps) {
  const limitChips = [
    limits?.maxSteps ? { icon: <Gauge size={10} />, text: `${limits.maxSteps} steps` } : null,
    limits?.maxCostUsd ? { icon: <Wallet size={10} />, text: `$${limits.maxCostUsd.toFixed(2)} cap` } : null,
    limits?.maxMinutes ? { icon: <ShieldQuestion size={10} />, text: `${limits.maxMinutes} min` } : null,
  ].filter(Boolean) as { icon: React.ReactNode; text: string }[];

  return (
    <section className={cn("rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950", className)}>
      <header className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
      </header>
      <div role="radiogroup" aria-label={title} className="grid gap-2 p-3">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange?.(option.value)}
              className={cn(
                "rounded-xl border px-3 py-2 text-left",
                selected
                  ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
                  : "border-gray-200 text-gray-700 dark:border-gray-800 dark:text-gray-200",
              )}
            >
              <span className="block text-sm font-semibold">{option.label}</span>
              <span className={cn("mt-0.5 block text-xs", selected ? "text-white/70 dark:text-gray-500" : "text-gray-400")}>
                {option.detail}
              </span>
            </button>
          );
        })}
      </div>
      {overrides && overrides.length > 0 ? (
        <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Exceptions</p>
          <ul className="mt-1.5 space-y-1.5">
            {overrides.map((override) => (
              <li key={override.id} className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate text-xs text-gray-700 dark:text-gray-200">{override.label}</span>
                <div className="inline-flex shrink-0 rounded-full border border-gray-200 p-0.5 dark:border-gray-700">
                  {(["ask", "review", "auto"] as const).map((level) => {
                    const active = override.level === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onOverrideChange?.(override.id, level)}
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                          active
                            ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                            : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200",
                        )}
                      >
                        {levelShort[level]}
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <footer className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-gray-100 px-4 py-2.5 dark:border-gray-800">
        <p className="text-[11px] text-gray-500 dark:text-gray-400">Always stops before {stopsBefore[value]}.</p>
        {limitChips.map((chip) => (
          <span
            key={chip.text}
            className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400"
          >
            {chip.icon}
            {chip.text}
          </span>
        ))}
      </footer>
    </section>
  );
}
