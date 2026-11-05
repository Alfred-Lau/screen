"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ChevronDown,
  Cpu,
  LifeBuoy,
  Pencil,
  RotateCcw,
  SkipForward,
} from "lucide-react";

export type RecoveryKind = "retry" | "skip" | "edit" | "model" | "help";

export interface RecoveryOption {
  id: string;
  label: string;
  description?: string;
  kind?: RecoveryKind;
  disabled?: boolean;
}

interface ErrorRecoveryProps {
  title?: string;
  step?: string;
  message: string;
  code?: string;
  detail?: string;
  options?: RecoveryOption[];
  onSelect?: (id: string) => void;
  className?: string;
}

const KIND_ICON: Record<RecoveryKind, React.ReactNode> = {
  retry: <RotateCcw size={13} />,
  skip: <SkipForward size={13} />,
  edit: <Pencil size={13} />,
  model: <Cpu size={13} />,
  help: <LifeBuoy size={13} />,
};

const DEFAULT_OPTIONS: RecoveryOption[] = [
  { id: "retry", label: "Retry step", kind: "retry", description: "Run it again as is" },
  { id: "edit", label: "Edit and retry", kind: "edit", description: "Change the input first" },
  { id: "skip", label: "Skip", kind: "skip", description: "Continue without this step" },
];

export function ErrorRecovery({
  title = "Step failed",
  step,
  message,
  code,
  detail,
  options = DEFAULT_OPTIONS,
  onSelect,
  className,
}: ErrorRecoveryProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-rose-200 bg-rose-50/50 dark:border-rose-900/60 dark:bg-rose-950/20",
        className,
      )}
    >
      <div className="flex items-start gap-2.5 px-4 py-3">
        <AlertTriangle size={14} className="mt-0.5 shrink-0 text-rose-500" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[13px] font-semibold text-rose-900 dark:text-rose-100">{title}</h3>
            {code && (
              <span className="rounded-full bg-rose-100 px-1.5 py-0.5 font-mono text-[10px] text-rose-700 dark:bg-rose-900/50 dark:text-rose-200">
                {code}
              </span>
            )}
          </div>
          {step && (
            <p className="mt-0.5 truncate text-[11px] text-rose-800/70 dark:text-rose-200/60">
              {step}
            </p>
          )}
          <p className="mt-1.5 font-mono text-[11.5px] leading-relaxed text-rose-900/90 dark:text-rose-100/90">
            {message}
          </p>
        </div>
      </div>

      {detail && (
        <div className="border-t border-rose-200/70 dark:border-rose-900/50">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            className="flex w-full items-center gap-1 px-4 py-1.5 text-left text-[11px] font-medium text-rose-800/80 transition-colors hover:text-rose-900 dark:text-rose-200/70 dark:hover:text-rose-100"
          >
            <ChevronDown
              size={12}
              className={cn("transition-transform", open ? "rotate-180" : "rotate-0")}
            />
            {open ? "Hide details" : "Show details"}
          </button>
          {open && (
            <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words border-t border-rose-200/70 bg-white/60 px-4 py-2 font-mono text-[10.5px] leading-relaxed text-gray-700 dark:border-rose-900/50 dark:bg-black/20 dark:text-gray-300">
              {detail}
            </pre>
          )}
        </div>
      )}

      {options.length > 0 && (
        <div className="grid gap-1.5 border-t border-rose-200/70 px-3 py-2.5 dark:border-rose-900/50 sm:grid-cols-3">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              disabled={option.disabled}
              onClick={() => onSelect?.(option.id)}
              className={cn(
                "flex items-start gap-2 rounded-xl border border-rose-200/80 bg-white px-2.5 py-2 text-left transition-colors dark:border-rose-900/60 dark:bg-gray-950",
                option.disabled
                  ? "cursor-not-allowed opacity-50"
                  : "hover:border-rose-300 hover:bg-white dark:hover:border-rose-800 dark:hover:bg-gray-900",
              )}
            >
              <span className="mt-0.5 shrink-0 text-gray-500 dark:text-gray-400">
                {KIND_ICON[option.kind ?? "retry"]}
              </span>
              <span className="min-w-0">
                <span className="block text-[11.5px] font-medium text-gray-900 dark:text-white">
                  {option.label}
                </span>
                {option.description && (
                  <span className="mt-0.5 block text-[10.5px] leading-snug text-gray-500 dark:text-gray-400">
                    {option.description}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
