"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, FileText, Undo2, X } from "lucide-react";

export type DiffLineKind = "context" | "add" | "remove";
export type DiffStatus = "pending" | "accepted" | "rejected";
export type DiffView = "unified" | "split";

export interface DiffLine {
  kind: DiffLineKind;
  content: string;
  /** Optional. When omitted the number is derived from the hunk header. */
  oldLine?: number;
  newLine?: number;
}

export interface DiffHunk {
  id: string;
  /** The `@@ -12,7 +12,9 @@` line. */
  header: string;
  lines: DiffLine[];
  status?: DiffStatus;
}

export interface DiffFile {
  id: string;
  path: string;
  hunks: DiffHunk[];
  status?: DiffStatus;
  additions?: number;
  deletions?: number;
}

interface DiffProps {
  files: DiffFile[];
  title?: string;
  view?: DiffView;
  defaultOpen?: boolean;
  onAccept?: (fileId: string, hunkId?: string) => void;
  onReject?: (fileId: string, hunkId?: string) => void;
  onAcceptAll?: () => void;
  onRejectAll?: () => void;
  className?: string;
}

function countLines(file: DiffFile) {
  let additions = 0;
  let deletions = 0;
  for (const hunk of file.hunks) {
    for (const line of hunk.lines) {
      if (line.kind === "add") additions += 1;
      if (line.kind === "remove") deletions += 1;
    }
  }
  return {
    additions: file.additions ?? additions,
    deletions: file.deletions ?? deletions,
  };
}

function withLineNumbers(hunk: DiffHunk): DiffLine[] {
  const oldStart = Number(hunk.header.match(/@@\s*-(\d+)/)?.[1] ?? 1);
  const newStart = Number(hunk.header.match(/\+\s*(\d+)/)?.[1] ?? 1);
  let oldLine = oldStart;
  let newLine = newStart;

  return hunk.lines.map((line) => {
    const resolved: DiffLine = { ...line };

    if (line.kind === "context") {
      resolved.oldLine = line.oldLine ?? oldLine;
      resolved.newLine = line.newLine ?? newLine;
      oldLine += 1;
      newLine += 1;
    } else if (line.kind === "remove") {
      resolved.oldLine = line.oldLine ?? oldLine;
      oldLine += 1;
    } else {
      resolved.newLine = line.newLine ?? newLine;
      newLine += 1;
    }

    return resolved;
  });
}

function toSplitRows(lines: DiffLine[]) {
  const rows: { left?: DiffLine; right?: DiffLine }[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.kind === "context") {
      rows.push({ left: line, right: line });
      index += 1;
      continue;
    }

    const removes: DiffLine[] = [];
    const adds: DiffLine[] = [];

    while (index < lines.length && lines[index].kind === "remove") {
      removes.push(lines[index]);
      index += 1;
    }

    while (index < lines.length && lines[index].kind === "add") {
      adds.push(lines[index]);
      index += 1;
    }

    const length = Math.max(removes.length, adds.length);
    for (let offset = 0; offset < length; offset += 1) {
      rows.push({ left: removes[offset], right: adds[offset] });
    }
  }

  return rows;
}

const lineClass: Record<DiffLineKind, string> = {
  context: "bg-white dark:bg-gray-950",
  add: "bg-emerald-50/80 dark:bg-emerald-950/25",
  remove: "bg-rose-50/80 dark:bg-rose-950/25",
};

const gutterClass: Record<DiffLineKind, string> = {
  context: "text-gray-300 dark:text-gray-600",
  add: "text-emerald-600/70 dark:text-emerald-400/60",
  remove: "text-rose-600/70 dark:text-rose-400/60",
};

const signClass: Record<DiffLineKind, string> = {
  context: "text-gray-300 dark:text-gray-600",
  add: "text-emerald-600 dark:text-emerald-400",
  remove: "text-rose-600 dark:text-rose-400",
};

const statusClass: Record<DiffStatus, string> = {
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  accepted: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  rejected: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

function statusLabel(status: DiffStatus) {
  switch (status) {
    case "pending":
      return "Review";
    case "accepted":
      return "Accepted";
    case "rejected":
      return "Rejected";
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

function signFor(kind: DiffLineKind) {
  if (kind === "add") return "+";
  if (kind === "remove") return "-";
  return " ";
}

function SplitCell({ line, side }: { line?: DiffLine; side: "left" | "right" }) {
  if (!line) {
    return (
      <div
        className={cn(
          "bg-gray-50/70 dark:bg-gray-900/40",
          side === "right" && "border-l border-gray-100 dark:border-gray-800",
        )}
      />
    );
  }

  const number = side === "left" ? line.oldLine : line.newLine;

  return (
    <div
      className={cn(
        "flex min-w-0",
        lineClass[line.kind],
        side === "right" && "border-l border-gray-100 dark:border-gray-800",
      )}
    >
      <span
        className={cn(
          "w-9 shrink-0 select-none px-1.5 text-right font-mono text-[11px] leading-5 tabular-nums",
          gutterClass[line.kind],
        )}
      >
        {number ?? ""}
      </span>
      <span
        className={cn(
          "w-4 shrink-0 select-none text-center font-mono text-[11px] leading-5",
          signClass[line.kind],
        )}
      >
        {signFor(line.kind)}
      </span>
      <code className="min-w-0 flex-1 whitespace-pre-wrap break-words pr-3 font-mono text-[12px] leading-5 text-gray-800 dark:text-gray-200">
        {line.content || " "}
      </code>
    </div>
  );
}

function HunkActions({
  status,
  onAccept,
  onReject,
}: {
  status?: DiffStatus;
  onAccept?: () => void;
  onReject?: () => void;
}) {
  if (!onAccept && !onReject && (!status || status === "pending")) return null;

  return (
    <span className="flex items-center gap-1">
      {onAccept && (
        <button
          type="button"
          onClick={onAccept}
          aria-label="Accept hunk"
          className="rounded-md p-1 text-gray-400 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
        >
          <Check size={12} />
        </button>
      )}
      {onReject && (
        <button
          type="button"
          onClick={onReject}
          aria-label="Reject hunk"
          className="rounded-md p-1 text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
        >
          <X size={12} />
        </button>
      )}
      {status && status !== "pending" && (
        <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-medium", statusClass[status])}>
          {statusLabel(status)}
        </span>
      )}
    </span>
  );
}

function FileBlock({
  file,
  view,
  open,
  onToggle,
  onAccept,
  onReject,
}: {
  file: DiffFile;
  view: DiffView;
  open: boolean;
  onToggle: () => void;
  onAccept?: (hunkId?: string) => void;
  onReject?: (hunkId?: string) => void;
}) {
  const { additions, deletions } = countLines(file);
  const status = file.status ?? "pending";

  return (
    <div className="border-t border-gray-100 first:border-t-0 dark:border-gray-800">
      <div className="flex items-center gap-2 px-3 py-2">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-lg py-0.5 text-left"
        >
          <ChevronDown
            size={13}
            className={cn(
              "shrink-0 text-gray-400 transition-transform duration-200",
              !open && "-rotate-90",
            )}
          />
          <FileText size={13} className="shrink-0 text-gray-400" />
          <span className="truncate font-mono text-[11px] text-gray-700 dark:text-gray-200">{file.path}</span>
        </button>

        <span className="shrink-0 font-mono text-[11px] tabular-nums">
          <span className="text-emerald-600 dark:text-emerald-400">+{additions}</span>{" "}
          <span className="text-rose-600 dark:text-rose-400">-{deletions}</span>
        </span>

        {status !== "pending" && (
          <span className={cn("shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium", statusClass[status])}>
            {statusLabel(status)}
          </span>
        )}

        <HunkActions
          onAccept={onAccept ? () => onAccept() : undefined}
          onReject={onReject ? () => onReject() : undefined}
        />
      </div>

      {open && (
        <div className="border-t border-gray-100 dark:border-gray-800">
          {file.hunks.map((hunk) => {
            const lines = withLineNumbers(hunk);
            const rows = view === "split" ? toSplitRows(lines) : null;
            const hunkStatus = hunk.status ?? "pending";

            return (
              <div
                key={hunk.id}
                className={cn(
                  "border-t border-gray-100 first:border-t-0 dark:border-gray-800",
                  hunkStatus === "rejected" && "opacity-50",
                )}
              >
                <div className="flex items-center gap-2 bg-gray-50/80 px-3 py-1 dark:bg-gray-900/50">
                  <code className="min-w-0 flex-1 truncate font-mono text-[11px] text-gray-500 dark:text-gray-400">
                    {hunk.header}
                  </code>
                  <HunkActions
                    status={hunkStatus}
                    onAccept={onAccept ? () => onAccept(hunk.id) : undefined}
                    onReject={onReject ? () => onReject(hunk.id) : undefined}
                  />
                </div>

                <div className="overflow-x-auto">
                  {rows ? (
                    <div className="grid min-w-[44rem] grid-cols-2">
                      {rows.map((row, index) => (
                        <React.Fragment key={index}>
                          <SplitCell line={row.left} side="left" />
                          <SplitCell line={row.right} side="right" />
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    <div className="min-w-[28rem]">
                      {lines.map((line, index) => (
                        <div key={index} className={cn("flex min-w-0", lineClass[line.kind])}>
                          <span
                            className={cn(
                              "w-9 shrink-0 select-none px-1.5 text-right font-mono text-[11px] leading-5 tabular-nums",
                              gutterClass[line.kind],
                            )}
                          >
                            {line.oldLine ?? ""}
                          </span>
                          <span
                            className={cn(
                              "w-9 shrink-0 select-none px-1.5 text-right font-mono text-[11px] leading-5 tabular-nums",
                              gutterClass[line.kind],
                            )}
                          >
                            {line.newLine ?? ""}
                          </span>
                          <span
                            className={cn(
                              "w-4 shrink-0 select-none text-center font-mono text-[11px] leading-5",
                              signClass[line.kind],
                            )}
                          >
                            {signFor(line.kind)}
                          </span>
                          <code className="min-w-0 flex-1 whitespace-pre-wrap break-words pr-3 font-mono text-[12px] leading-5 text-gray-800 dark:text-gray-200">
                            {line.content || " "}
                          </code>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Diff({
  files,
  title = "Changes",
  view: initialView = "unified",
  defaultOpen = true,
  onAccept,
  onReject,
  onAcceptAll,
  onRejectAll,
  className,
}: DiffProps) {
  const [view, setView] = React.useState<DiffView>(initialView);
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const file of files) initial[file.id] = !defaultOpen;
    return initial;
  });

  const totals = files.reduce(
    (accumulator, file) => {
      const counted = countLines(file);
      return {
        additions: accumulator.additions + counted.additions,
        deletions: accumulator.deletions + counted.deletions,
      };
    },
    { additions: 0, deletions: 0 },
  );

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {files.length} {files.length === 1 ? "file" : "files"} ·{" "}
            <span className="font-mono text-emerald-600 dark:text-emerald-400">+{totals.additions}</span>{" "}
            <span className="font-mono text-rose-600 dark:text-rose-400">-{totals.deletions}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-gray-200 p-0.5 dark:border-gray-700">
            {(["unified", "split"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setView(option)}
                aria-pressed={view === option}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize transition-colors",
                  view === option
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100",
                )}
              >
                {option}
              </button>
            ))}
          </div>

          {onAcceptAll && (
            <button
              type="button"
              onClick={onAcceptAll}
              className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-2.5 py-1 text-[11px] font-semibold text-white dark:bg-white dark:text-gray-900"
            >
              <Check size={12} />
              Accept all
            </button>
          )}
          {onRejectAll && (
            <button
              type="button"
              onClick={onRejectAll}
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200"
            >
              <Undo2 size={12} />
              Reject all
            </button>
          )}
        </div>
      </header>

      <div>
        {files.map((file) => (
          <FileBlock
            key={file.id}
            file={file}
            view={view}
            open={!collapsed[file.id]}
            onToggle={() =>
              setCollapsed((current) => ({ ...current, [file.id]: !current[file.id] }))
            }
            onAccept={onAccept ? (hunkId) => onAccept(file.id, hunkId) : undefined}
            onReject={onReject ? (hunkId) => onReject(file.id, hunkId) : undefined}
          />
        ))}
      </div>
    </section>
  );
}
