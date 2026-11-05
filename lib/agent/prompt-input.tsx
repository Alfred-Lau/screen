"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  ArrowUp,
  AtSign,
  ChevronDown,
  FileText,
  Folder,
  Globe,
  ImageIcon,
  Paperclip,
  Square,
  Sparkles,
  X,
} from "lucide-react";

export type ContextKind = "file" | "folder" | "url" | "image";

export interface PromptContext {
  id: string;
  label: string;
  kind?: ContextKind;
}

export interface PromptOption {
  id: string;
  label: string;
}

interface PromptInputProps {
  defaultValue?: string;
  placeholder?: string;
  contexts?: PromptContext[];
  onRemoveContext?: (id: string) => void;
  models?: PromptOption[];
  model?: string;
  onModelChange?: (id: string) => void;
  efforts?: PromptOption[];
  effort?: string;
  onEffortChange?: (id: string) => void;
  running?: boolean;
  hint?: string;
  onSubmit?: (value: string) => void;
  onStop?: () => void;
  className?: string;
}

const CONTEXT_ICON: Record<ContextKind, React.ReactNode> = {
  file: <FileText size={11} />,
  folder: <Folder size={11} />,
  url: <Globe size={11} />,
  image: <ImageIcon size={11} />,
};

function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 py-1 pl-1.5 pr-5 text-[11px] font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function PromptInput({
  defaultValue = "",
  placeholder = "Ask anything, or type @ to add context",
  contexts = [],
  onRemoveContext,
  models = [],
  model,
  onModelChange,
  efforts = [],
  effort,
  onEffortChange,
  running = false,
  hint = "⏎ to send · ⇧⏎ for a new line",
  onSubmit,
  onStop,
  className,
}: PromptInputProps) {
  const [value, setValue] = React.useState(defaultValue);
  const canSend = value.trim().length > 0 || contexts.length > 0;

  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {contexts.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-3 pt-2.5">
          {contexts.map((context) => (
            <span
              key={context.id}
              className="inline-flex items-center gap-1 rounded-md bg-gray-100 py-1 pl-1.5 pr-1 text-[11px] font-medium text-gray-700 dark:bg-gray-900 dark:text-gray-300"
            >
              <span className="text-gray-400">
                {CONTEXT_ICON[context.kind ?? "file"]}
              </span>
              <span className="max-w-[12rem] truncate font-mono">{context.label}</span>
              {onRemoveContext && (
                <button
                  type="button"
                  onClick={() => onRemoveContext(context.id)}
                  aria-label={`Remove ${context.label}`}
                  className="rounded p-0.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                >
                  <X size={10} />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (canSend && !running) onSubmit?.(value);
          }
        }}
        rows={2}
        placeholder={placeholder}
        className="field-sizing-content max-h-40 w-full resize-none bg-transparent px-3 py-2.5 text-[13px] leading-relaxed text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500"
      />

      <div className="flex flex-wrap items-center gap-1.5 border-t border-gray-100 px-2.5 py-2 dark:border-gray-800">
        <button
          type="button"
          aria-label="Attach a file"
          className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-900 dark:hover:text-gray-200"
        >
          <Paperclip size={13} />
        </button>
        <button
          type="button"
          aria-label="Add context"
          className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-900 dark:hover:text-gray-200"
        >
          <AtSign size={13} />
        </button>

        {models.length > 0 && (
          <Pill>
            <select
              value={model}
              onChange={(event) => onModelChange?.(event.target.value)}
              aria-label="Model"
              className="appearance-none bg-transparent pr-0 text-[11px] font-medium outline-none"
            >
              {models.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown size={10} className="pointer-events-none absolute right-1.5 text-gray-400" />
          </Pill>
        )}

        {efforts.length > 0 && (
          <Pill>
            <Sparkles size={10} className="text-gray-400" />
            <select
              value={effort}
              onChange={(event) => onEffortChange?.(event.target.value)}
              aria-label="Effort"
              className="appearance-none bg-transparent pr-0 text-[11px] font-medium outline-none"
            >
              {efforts.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown size={10} className="pointer-events-none absolute right-1.5 text-gray-400" />
          </Pill>
        )}

        <span className="ml-auto hidden text-[10px] text-gray-400 sm:block">{hint}</span>

        {running ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-950"
          >
            <Square size={11} strokeWidth={2.5} />
          </button>
        ) : (
          <button
            type="button"
            disabled={!canSend}
            onClick={() => onSubmit?.(value)}
            aria-label="Send"
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
              canSend
                ? "bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
                : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-900 dark:text-gray-600",
            )}
          >
            <ArrowUp size={13} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}
