"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Clock, ShieldAlert, ShieldCheck, ShieldX, UserRound } from "lucide-react";

export type ApprovalRisk = "low" | "medium" | "high";
export type ApprovalDecision = "once" | "always" | "deny";

/**
 * SECURITY: this component is presentation only.
 *
 * An approval click is a UI event, not an authorization grant. Validate the
 * decision server-side against the actual request before acting on it.
 */

export interface ApprovalRequest {
  title: string;
  description: string;
  risk: ApprovalRisk;
  preview?: string;
  /** Why the agent cannot finish without this decision. */
  reason?: string;
  /** Who is asking, shown next to the risk badge. */
  agent?: string;
  /** Seconds until the request expires and the run continues without it. */
  expiresIn?: number;
}

interface ApprovalCardProps {
  request: ApprovalRequest;
  decision?: ApprovalDecision | null;
  onDecide?: (decision: ApprovalDecision) => void;
  onExpire?: () => void;
  className?: string;
}

function riskLabel(risk: ApprovalRisk): string {
  switch (risk) {
    case "low":
      return "Low risk";
    case "medium":
      return "Medium risk";
    case "high":
      return "High risk";
    default: {
      const exhaustive: never = risk;
      return exhaustive;
    }
  }
}

function decisionLabel(decision: ApprovalDecision): string {
  switch (decision) {
    case "once":
      return "Allowed once";
    case "always":
      return "Always allowed";
    case "deny":
      return "Denied";
    default: {
      const exhaustive: never = decision;
      return exhaustive;
    }
  }
}

const riskClass: Record<ApprovalRisk, string> = {
  low: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  medium: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  high: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
};

function formatSeconds(total: number): string {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function ApprovalCard({
  request,
  decision = null,
  onDecide,
  onExpire,
  className,
}: ApprovalCardProps) {
  const resolved = decision !== null;
  const [remaining, setRemaining] = React.useState(request.expiresIn ?? null);
  const expiredRef = React.useRef(false);

  React.useEffect(() => {
    setRemaining(request.expiresIn ?? null);
    expiredRef.current = false;
  }, [request.expiresIn]);

  React.useEffect(() => {
    if (remaining === null || resolved) return;
    if (remaining <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true;
        onExpire?.();
      }
      return;
    }
    const timer = window.setTimeout(() => setRemaining((value) => (value === null ? null : value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [remaining, resolved, onExpire]);

  const expired = remaining !== null && remaining <= 0 && !resolved;

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (resolved || expired || !onDecide) return;
    if (event.key === "Enter") {
      event.preventDefault();
      onDecide("once");
    } else if (event.key === "Escape") {
      event.preventDefault();
      onDecide("deny");
    }
  }

  return (
    <section
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "rounded-2xl border bg-white outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10 dark:bg-gray-950 dark:focus-visible:ring-white/20",
        expired ? "border-gray-200 dark:border-gray-800" : "border-gray-200 dark:border-gray-800",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Approval</p>
          <h3 className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-white">{request.title}</h3>
          {request.agent ? (
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-gray-400">
              <UserRound size={11} />
              {request.agent}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", riskClass[request.risk])}>
            {riskLabel(request.risk)}
          </span>
          {remaining !== null && !resolved ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[11px] tabular-nums",
                expired ? "text-rose-500" : remaining <= 30 ? "text-amber-600" : "text-gray-400",
              )}
            >
              <Clock size={11} />
              {expired ? "Expired" : `Expires in ${formatSeconds(remaining)}`}
            </span>
          ) : null}
        </div>
      </header>
      <div className="px-4 py-3 space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-300">{request.description}</p>
        {request.reason ? (
          <div className="rounded-xl border border-dashed border-gray-200 px-3 py-2 dark:border-gray-800">
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Why it is asking</p>
            <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">{request.reason}</p>
          </div>
        ) : null}
        {request.preview ? (
          <pre className="overflow-x-auto rounded-xl bg-gray-50 dark:bg-gray-900 px-3 py-2 text-xs leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {request.preview}
          </pre>
        ) : null}
        {resolved ? (
          <div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-100">
            {decision === "deny" ? <ShieldX size={16} className="text-rose-500" /> : <ShieldCheck size={16} className="text-emerald-500" />}
            {decisionLabel(decision)}
          </div>
        ) : expired ? (
          <div className="flex items-center gap-2 text-sm font-medium text-rose-600 dark:text-rose-300">
            <ShieldX size={16} />
            Expired. The run continued without this step.
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onDecide?.("once")}
                className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
              >
                <ShieldCheck size={13} />
                Allow once
              </button>
              <button
                type="button"
                onClick={() => onDecide?.("always")}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
              >
                Always
              </button>
              <button
                type="button"
                onClick={() => onDecide?.("deny")}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
              >
                <ShieldAlert size={13} />
                Deny
              </button>
            </div>
            <p className="text-[11px] text-gray-400">
              <kbd className="rounded border border-gray-200 px-1 dark:border-gray-700">↵</kbd> allow once
              <span className="mx-1.5">·</span>
              <kbd className="rounded border border-gray-200 px-1 dark:border-gray-700">esc</kbd> deny
            </p>
          </>
        )}
      </div>
    </section>
  );
}
