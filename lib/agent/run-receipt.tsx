"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, ArrowRight, Check, FileText, ImageIcon, Link2, X } from "lucide-react";

export type ReceiptStatus = "success" | "partial" | "failed";
export type ArtifactKind = "file" | "link" | "image";

export interface ReceiptStat {
  label: string;
  value: string;
  hint?: string;
}

export interface ReceiptArtifact {
  id: string;
  name: string;
  meta?: string;
  kind?: ArtifactKind;
  href?: string;
  onOpen?: () => void;
}

export interface ReceiptAction {
  id: string;
  label: string;
  primary?: boolean;
  onClick?: () => void;
}

interface RunReceiptProps {
  title?: string;
  summary?: string;
  status?: ReceiptStatus;
  time?: string;
  stats?: ReceiptStat[];
  artifacts?: ReceiptArtifact[];
  actions?: ReceiptAction[];
  className?: string;
}

const STATUS: Record<
  ReceiptStatus,
  { label: string; icon: React.ReactNode; ring: string; text: string; chip: string }
> = {
  success: {
    label: "Completed",
    icon: <Check size={12} strokeWidth={3} />,
    ring: "bg-emerald-500 text-white",
    text: "text-emerald-600 dark:text-emerald-400",
    chip: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  partial: {
    label: "Partly done",
    icon: <AlertTriangle size={12} />,
    ring: "bg-amber-500 text-white",
    text: "text-amber-600 dark:text-amber-400",
    chip: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  failed: {
    label: "Failed",
    icon: <X size={12} strokeWidth={3} />,
    ring: "bg-rose-500 text-white",
    text: "text-rose-600 dark:text-rose-400",
    chip: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  },
};

const ARTIFACT_ICON: Record<ArtifactKind, React.ReactNode> = {
  file: <FileText size={13} />,
  link: <Link2 size={13} />,
  image: <ImageIcon size={13} />,
};

export function RunReceipt({
  title = "Run complete",
  summary,
  status = "success",
  time,
  stats = [],
  artifacts = [],
  actions = [],
  className,
}: RunReceiptProps) {
  const meta = STATUS[status];

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <span
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
            meta.ring,
          )}
        >
          {meta.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[13px] font-semibold text-gray-950 dark:text-white">{title}</h3>
            <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-medium", meta.chip)}>
              {meta.label}
            </span>
            {time && (
              <span className="ml-auto shrink-0 font-mono text-[10px] tabular-nums text-gray-400">
                {time}
              </span>
            )}
          </div>
          {summary && (
            <p className="mt-1 text-[12px] leading-relaxed text-gray-600 dark:text-gray-400">
              {summary}
            </p>
          )}
        </div>
      </div>

      {stats.length > 0 && (
        <dl className="grid grid-cols-2 divide-x divide-gray-100 border-y border-gray-100 dark:divide-gray-800 dark:border-gray-800 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 py-2.5">
              <dt className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                {stat.label}
              </dt>
              <dd className="mt-0.5 font-mono text-[13px] tabular-nums text-gray-900 dark:text-white">
                {stat.value}
                {stat.hint && (
                  <span className="ml-1 font-sans text-[10px] text-gray-400">{stat.hint}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {artifacts.length > 0 && (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {artifacts.map((artifact) => {
            const content = (
              <>
                <span className="text-gray-400">
                  {ARTIFACT_ICON[artifact.kind ?? "file"]}
                </span>
                <span className="truncate font-mono text-[11.5px] text-gray-800 dark:text-gray-200">
                  {artifact.name}
                </span>
                {artifact.meta && (
                  <span className="shrink-0 text-[10px] text-gray-400">{artifact.meta}</span>
                )}
                {(artifact.href || artifact.onOpen) && (
                  <ArrowRight
                    size={12}
                    className="ml-auto shrink-0 text-gray-300 transition-colors group-hover:text-gray-600 dark:text-gray-600 dark:group-hover:text-gray-300"
                  />
                )}
              </>
            );

            return (
              <li key={artifact.id}>
                {artifact.href ? (
                  <a
                    href={artifact.href}
                    className="group flex items-center gap-2 px-4 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    {content}
                  </a>
                ) : artifact.onOpen ? (
                  <button
                    type="button"
                    onClick={artifact.onOpen}
                    className="group flex w-full items-center gap-2 px-4 py-2 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    {content}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {actions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 px-4 py-2.5 dark:border-gray-800">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                action.primary
                  ? "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800",
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
