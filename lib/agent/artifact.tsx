"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Code2, Copy, Download, ExternalLink, FileText, ImageIcon, Table2 } from "lucide-react";

export type ArtifactKind = "code" | "document" | "image" | "table";

export interface ArtifactItem {
  id: string;
  name: string;
  kind: ArtifactKind;
  language?: string;
  content?: string;
  src?: string;
  meta?: string;
  lines?: number;
}

interface ArtifactProps {
  items: ArtifactItem[];
  defaultId?: string;
  title?: string;
  onDownload?: (id: string) => void;
  onOpen?: (id: string) => void;
  className?: string;
}

const KIND_ICON: Record<ArtifactKind, React.ReactNode> = {
  code: <Code2 size={12} />,
  document: <FileText size={12} />,
  image: <ImageIcon size={12} />,
  table: <Table2 size={12} />,
};

export function Artifact({
  items,
  defaultId,
  title = "Artifacts",
  onDownload,
  onOpen,
  className,
}: ArtifactProps) {
  const [active, setActive] = React.useState(defaultId ?? items[0]?.id);
  const [copied, setCopied] = React.useState(false);
  const current = items.find((item) => item.id === active) ?? items[0];

  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-2.5 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
          <span className="text-[11px] text-gray-400">{items.length}</span>
        </div>
        {current && (
          <div className="flex items-center gap-1">
            {current.content && (
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard?.writeText(current.content ?? "");
                  setCopied(true);
                }}
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-900"
              >
                {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
            {onDownload && (
              <button
                type="button"
                onClick={() => onDownload(current.id)}
                className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-900"
                aria-label={`Download ${current.name}`}
              >
                <Download size={11} />
              </button>
            )}
            {onOpen && (
              <button
                type="button"
                onClick={() => onOpen(current.id)}
                className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-900"
                aria-label={`Open ${current.name}`}
              >
                <ExternalLink size={11} />
              </button>
            )}
          </div>
        )}
      </header>

      <div className="flex gap-1 overflow-x-auto border-b border-gray-100 px-2 py-1.5 dark:border-gray-800">
        {items.map((item) => {
          const selected = item.id === current?.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
                selected
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-900",
              )}
            >
              <span className={selected ? "text-gray-500 dark:text-gray-300" : "text-gray-400"}>
                {KIND_ICON[item.kind]}
              </span>
              <span className="max-w-[11rem] truncate font-mono">{item.name}</span>
            </button>
          );
        })}
      </div>

      {current ? (
        <div>
          {current.kind === "image" && current.src ? (
            <div className="flex items-center justify-center bg-gray-50 px-4 py-4 dark:bg-gray-900/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.src}
                alt={current.name}
                className="max-h-52 rounded-lg border border-gray-200 object-contain dark:border-gray-800"
              />
            </div>
          ) : current.content ? (
            <pre className="max-h-60 overflow-auto bg-gray-50 px-4 py-3 font-mono text-[11px] leading-relaxed text-gray-700 dark:bg-gray-900/60 dark:text-gray-300">
              {current.content}
            </pre>
          ) : (
            <div className="px-4 py-6 text-center text-[11px] text-gray-400">Nothing to preview.</div>
          )}

          <footer className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-gray-100 px-4 py-2 text-[10.5px] text-gray-400 dark:border-gray-800">
            <span className="font-mono uppercase">{current.language ?? current.kind}</span>
            {current.lines ? <span>{current.lines} lines</span> : null}
            {current.meta ? <span>{current.meta}</span> : null}
          </footer>
        </div>
      ) : null}
    </section>
  );
}
