"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, Check, Circle, Loader2 } from "lucide-react";

export type TaskStatus = "todo" | "active" | "done" | "blocked";

export interface SubTask {
  id: string;
  title: string;
  status: TaskStatus;
}

export interface TaskItem {
  id: string;
  title: string;
  detail?: string;
  status: TaskStatus;
  owner?: string;
  subtasks?: SubTask[];
}

interface TaskListProps {
  tasks: TaskItem[];
  title?: string;
  className?: string;
}

function StatusMark({ status }: { status: TaskStatus }) {
  if (status === "done") {
    return (
      <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
        <Check size={9} strokeWidth={3.5} />
      </span>
    );
  }
  if (status === "active") {
    return <Loader2 size={14} className="shrink-0 animate-spin text-blue-500" />;
  }
  if (status === "blocked") {
    return <AlertCircle size={14} className="shrink-0 text-rose-500" />;
  }
  return <Circle size={14} className="shrink-0 text-gray-300 dark:text-gray-600" />;
}

export function TaskList({ tasks, title = "Tasks", className }: TaskListProps) {
  const all = tasks.flatMap((task) => [task, ...(task.subtasks ?? [])]);
  const done = all.filter((task) => task.status === "done").length;
  const blocked = all.filter((task) => task.status === "blocked").length;
  const percent = all.length ? Math.round((done / all.length) * 100) : 0;

  return (
    <section
      className={cn(
        "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
          <span className="text-[11px] tabular-nums text-gray-400">
            {done} of {all.length} done
          </span>
          {blocked > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-600 dark:bg-rose-950/60 dark:text-rose-300">
              <AlertCircle size={9} />
              {blocked} blocked
            </span>
          )}
        </div>
        <span className="text-[11px] tabular-nums text-gray-400">{percent}%</span>
      </header>

      <div className="h-0.5 w-full bg-gray-100 dark:bg-gray-800">
        <div
          className="h-0.5 rounded-full bg-emerald-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {tasks.map((task) => (
          <li key={task.id} className="px-4 py-2.5">
            <div className="flex items-start gap-2">
              <span className="mt-[3px]">
                <StatusMark status={task.status} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p
                    className={cn(
                      "truncate text-[12.5px]",
                      task.status === "done"
                        ? "text-gray-400 line-through dark:text-gray-500"
                        : "font-medium text-gray-800 dark:text-gray-100",
                    )}
                  >
                    {task.title}
                  </p>
                  {task.owner ? (
                    <span className="shrink-0 rounded bg-gray-100 px-1 py-0.5 text-[9.5px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      {task.owner}
                    </span>
                  ) : null}
                </div>
                {task.detail ? (
                  <p className="mt-0.5 text-[11px] text-gray-400">{task.detail}</p>
                ) : null}

                {task.subtasks && task.subtasks.length > 0 && (
                  <ul className="mt-1.5 space-y-1 border-l border-gray-100 pl-2.5 dark:border-gray-800">
                    {task.subtasks.map((subtask) => (
                      <li key={subtask.id} className="flex items-center gap-1.5">
                        <StatusMark status={subtask.status} />
                        <span
                          className={cn(
                            "truncate text-[11px]",
                            subtask.status === "done"
                              ? "text-gray-400 line-through dark:text-gray-500"
                              : "text-gray-600 dark:text-gray-300",
                          )}
                        >
                          {subtask.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
