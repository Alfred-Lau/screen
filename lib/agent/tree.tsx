"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";

export type AgentNodeStatus = "pending" | "running" | "done" | "failed";

export interface AgentNode {
  id: string;
  name: string;
  role: string;
  status: AgentNodeStatus;
  elapsed?: string;
  tokens?: number;
  costUsd?: number;
  model?: string;
  children?: AgentNode[];
}

interface AgentTreeProps {
  title?: string;
  root: AgentNode;
  /** Start with every branch folded, so a wide tree stays one screen tall. */
  defaultCollapsed?: boolean;
  className?: string;
}

function statusLabel(status: AgentNodeStatus): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "running":
      return "Running";
    case "done":
      return "Done";
    case "failed":
      return "Failed";
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

const statusDot: Record<AgentNodeStatus, string> = {
  pending: "bg-gray-300 dark:bg-gray-600",
  running: "bg-sky-500 animate-pulse",
  done: "bg-emerald-500",
  failed: "bg-rose-500",
};

function collectIds(node: AgentNode, acc: string[] = []): string[] {
  if (node.children?.length) acc.push(node.id);
  for (const child of node.children ?? []) collectIds(child, acc);
  return acc;
}

function countNodes(node: AgentNode): number {
  return 1 + (node.children ?? []).reduce((sum, child) => sum + countNodes(child), 0);
}

function totalCost(node: AgentNode): number {
  return (node.costUsd ?? 0) + (node.children ?? []).reduce((sum, child) => sum + totalCost(child), 0);
}

function NodeRow({
  node,
  collapsed,
  onToggle,
}: {
  node: AgentNode;
  collapsed: Set<string>;
  onToggle: (id: string) => void;
}) {
  const hasChildren = Boolean(node.children?.length);
  const folded = collapsed.has(node.id);
  const hiddenCount = folded ? countNodes(node) - 1 : 0;

  return (
    <li>
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          {hasChildren ? (
            <button
              type="button"
              aria-label={folded ? `Expand ${node.name}` : `Collapse ${node.name}`}
              aria-expanded={!folded}
              onClick={() => onToggle(node.id)}
              className="shrink-0 rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              {folded ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
            </button>
          ) : (
            <span className="size-3.5 shrink-0" />
          )}
          <span className={cn("size-1.5 shrink-0 rounded-full", statusDot[node.status])} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {node.name}
              {folded && hiddenCount > 0 ? (
                <span className="ml-1.5 text-[11px] font-normal text-gray-400">+{hiddenCount}</span>
              ) : null}
            </p>
            <p className="truncate text-[11px] text-gray-400">
              {node.role}
              {node.model ? ` · ${node.model}` : ""} · {statusLabel(node.status)}
              {typeof node.tokens === "number" ? ` · ${node.tokens.toLocaleString()} tok` : ""}
            </p>
          </div>
        </div>
        <span className="shrink-0 text-right text-xs tabular-nums text-gray-500">
          {node.elapsed ? <span className="block">{node.elapsed}</span> : null}
          {typeof node.costUsd === "number" ? (
            <span className="block text-[11px] text-gray-400">${node.costUsd.toFixed(3)}</span>
          ) : null}
        </span>
      </div>
      {hasChildren && !folded ? (
        <ul className="ml-[1.6rem] border-l border-gray-100 dark:border-gray-800">
          {node.children?.map((child) => (
            <NodeRow key={child.id} node={child} collapsed={collapsed} onToggle={onToggle} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function AgentTree({ title = "Agents", root, defaultCollapsed = false, className }: AgentTreeProps) {
  const [collapsed, setCollapsed] = React.useState<Set<string>>(() =>
    new Set(defaultCollapsed ? collectIds(root) : []),
  );

  function toggle(id: string) {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const nodes = countNodes(root);
  const cost = totalCost(root);

  return (
    <section className={cn("rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950", className)}>
      <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400">
          {nodes} {nodes === 1 ? "node" : "nodes"}
          {cost > 0 ? ` · $${cost.toFixed(3)}` : ""}
        </span>
      </header>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        <NodeRow node={root} collapsed={collapsed} onToggle={toggle} />
      </ul>
    </section>
  );
}
