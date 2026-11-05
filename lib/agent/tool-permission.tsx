"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Check, ChevronRight, Server, ShieldQuestion, Wrench, X } from "lucide-react";

export type PermissionScope = "once" | "session" | "always";
export type PermissionRisk = "low" | "medium" | "high";

/**
 * SECURITY: this component is presentation only.
 *
 * It renders the permission prompt and forwards the user's choice through
 * `onAllow` / `onDeny`. It does not enforce anything. Every tool call must be
 * re-checked on the server before execution — a browser-side "allow" is a UI
 * event, not an authorization grant.
 */

export interface PermissionArg {
  label: string;
  value: string;
}

interface ToolPermissionProps {
  tool: string;
  title?: string;
  description?: string;
  server?: string;
  risk?: PermissionRisk;
  args?: PermissionArg[];
  scopes?: PermissionScope[];
  defaultScope?: PermissionScope;
  allowLabel?: string;
  denyLabel?: string;
  onAllow?: (scope: PermissionScope) => void;
  onDeny?: () => void;
  className?: string;
}

const RISK_LABEL: Record<PermissionRisk, string> = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
};

const RISK_CLASS: Record<PermissionRisk, string> = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",
  medium: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
  high: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300",
};

const SCOPE_LABEL: Record<PermissionScope, string> = {
  once: "Just this time",
  session: "This session",
  always: "Always",
};

export function ToolPermission({
  tool,
  title,
  description,
  server,
  risk = "medium",
  args = [],
  scopes = ["once", "session", "always"],
  defaultScope = "once",
  allowLabel = "Allow",
  denyLabel = "Deny",
  onAllow,
  onDeny,
  className,
}: ToolPermissionProps) {
  const [scope, setScope] = React.useState<PermissionScope>(defaultScope);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      <header className="flex items-start gap-2.5 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
          <ShieldQuestion size={13} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {title ?? "Permission required"}
          </h3>
          {description ? (
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{description}</p>
          ) : null}
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
            RISK_CLASS[risk],
          )}
        >
          {risk === "high" ? <AlertTriangle size={9} /> : null}
          {RISK_LABEL[risk]}
        </span>
      </header>

      <div className="space-y-2.5 px-4 py-3">
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          {server ? (
            <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-1.5 py-1 font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              <Server size={10} className="text-gray-400" />
              {server}
              <ChevronRight size={9} className="text-gray-300" />
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-1.5 py-1 font-mono text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
            <Wrench size={10} className="text-gray-400" />
            {tool}
          </span>
        </div>

        {args.length > 0 && (
          <dl className="divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-100 dark:divide-gray-800 dark:border-gray-800">
            {args.map((arg) => (
              <div key={arg.label} className="flex gap-3 px-2.5 py-1.5">
                <dt className="w-20 shrink-0 text-[11px] text-gray-400">{arg.label}</dt>
                <dd className="min-w-0 flex-1 break-words font-mono text-[11px] text-gray-700 dark:text-gray-300">
                  {arg.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {scopes.length > 0 && (
          <div>
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Grant for
            </p>
            <div className="flex flex-wrap gap-1.5">
              {scopes.map((option) => {
                const active = option === scope;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setScope(option)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors",
                      active
                        ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-950"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:hover:border-gray-600",
                    )}
                  >
                    {active ? <Check size={10} strokeWidth={3} /> : null}
                    {SCOPE_LABEL[option]}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <footer className="flex items-center justify-end gap-1.5 border-t border-gray-100 bg-gray-50/60 px-4 py-2.5 dark:border-gray-800 dark:bg-gray-900/40">
        <button
          type="button"
          onClick={onDeny}
          className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900"
        >
          <X size={11} />
          {denyLabel}
        </button>
        <button
          type="button"
          onClick={() => onAllow?.(scope)}
          className="inline-flex items-center gap-1 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
        >
          <Check size={11} strokeWidth={2.5} />
          {allowLabel}
        </button>
      </footer>
    </section>
  );
}
