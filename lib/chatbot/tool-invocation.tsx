"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Wrench,
  CheckCircle,
  XCircle,
  Loader2,
  Circle,
  Code,
  Copy,
  Check,
} from "lucide-react";

// Tool State Types
export type ToolState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error";

// Tool Context
interface ToolContextValue {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  state: ToolState;
  showTimeline: boolean;
  isFirst: boolean;
  isLast: boolean;
}

const ToolContext = React.createContext<ToolContextValue | null>(null);

function useTool() {
  const context = React.useContext(ToolContext);
  if (!context) {
    throw new Error("useTool must be used within a ToolInvocation");
  }
  return context;
}

// ToolInvocation Component
interface ToolInvocationProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  state?: ToolState;
  defaultOpen?: boolean;
  showTimeline?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

export function ToolInvocation({
  children,
  state = "input-available",
  defaultOpen = false,
  showTimeline = false,
  isFirst = false,
  isLast = false,
  className,
  ...props
}: ToolInvocationProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <ToolContext.Provider value={{ isOpen, setIsOpen, state, showTimeline, isFirst, isLast }}>
      <div className={cn("relative", showTimeline && "pl-8")} {...props}>
        {/* Timeline */}
        {showTimeline && (
          <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
            {!isFirst && (
              <div className="w-0.5 h-4 bg-blue-400 dark:bg-blue-500" />
            )}
            <div className={cn(
              "w-2.5 h-2.5 rounded-full z-10 shadow-sm",
              state === "output-available" && "bg-green-500 shadow-green-500/50",
              state === "output-error" && "bg-red-500 shadow-red-500/50",
              state === "input-available" && "bg-blue-500 shadow-blue-500/50 animate-pulse",
              state === "input-streaming" && "bg-gray-400 shadow-gray-400/50"
            )} />
            {!isLast && (
              <div className="w-0.5 flex-1 bg-blue-400 dark:bg-blue-500" />
            )}
          </div>
        )}

        {/* Tool Card */}
        <div
          className={cn(
            "rounded-xl border transition-all duration-200",
            "bg-white dark:bg-gray-900/50",
            state === "output-available" && "border-green-200 dark:border-green-800",
            state === "output-error" && "border-red-200 dark:border-red-800",
            state === "input-available" && "border-blue-200 dark:border-blue-800",
            state === "input-streaming" && "border-gray-200 dark:border-gray-700",
            "hover:shadow-md",
            className
          )}
        >
          {children}
        </div>
      </div>
    </ToolContext.Provider>
  );
}

// ToolInvocationHeader
interface ToolInvocationHeaderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  icon?: React.ReactNode;
  statusLabel?: string;
}

export function ToolInvocationHeader({
  name,
  icon,
  statusLabel,
  className,
  onClick,
  ...props
}: ToolInvocationHeaderProps) {
  const { isOpen, setIsOpen, state } = useTool();

  const statusConfig = {
    "input-streaming": {
      label: "Preparing",
      icon: <Circle className="size-3 animate-pulse" />,
      className: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
    },
    "input-available": {
      label: "Running",
      icon: <Loader2 className="size-3 animate-spin" />,
      className: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
    },
    "output-available": {
      label: "Done",
      icon: <CheckCircle className="size-3" />,
      className: "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400",
    },
    "output-error": {
      label: "Error",
      icon: <XCircle className="size-3" />,
      className: "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400",
    },
  };

  const status = statusConfig[state];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-t-xl",
        "transition-colors duration-200",
        state === "output-available" && "bg-green-50/50 dark:bg-green-950/20",
        state === "output-error" && "bg-red-50/50 dark:bg-red-950/20",
        state === "input-available" && "bg-blue-50/50 dark:bg-blue-950/20",
        state === "input-streaming" && "bg-gray-50/50 dark:bg-gray-950/20",
        "hover:bg-opacity-80",
        className
      )}
      {...props}
    >
      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-lg",
        state === "output-available" && "bg-green-100 dark:bg-green-900/50",
        state === "output-error" && "bg-red-100 dark:bg-red-900/50",
        state === "input-available" && "bg-blue-100 dark:bg-blue-900/50",
        state === "input-streaming" && "bg-gray-100 dark:bg-gray-800"
      )}>
        {icon || <Wrench className={cn(
          "size-4",
          state === "output-available" && "text-green-600 dark:text-green-400",
          state === "output-error" && "text-red-600 dark:text-red-400",
          state === "input-available" && "text-blue-600 dark:text-blue-400",
          state === "input-streaming" && "text-gray-600 dark:text-gray-400"
        )} />}
      </div>

      <div className="flex-1 text-left">
        <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
          {name}
        </span>
      </div>

      <div className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        status.className
      )}>
        {status.icon}
        <span>{statusLabel ?? status.label}</span>
      </div>

      <ChevronDown
        className={cn(
          "size-4 text-gray-500 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </button>
  );
}

// ToolInvocationContent
interface ToolInvocationContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ToolInvocationContent({
  children,
  className,
  ...props
}: ToolInvocationContentProps) {
  const { isOpen } = useTool();

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "animate-in slide-in-from-top-2 duration-200",
        "border-t border-gray-100 dark:border-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ToolInvocationInput
interface ToolInvocationInputProps extends React.HTMLAttributes<HTMLDivElement> {
  input: unknown;
  label?: string;
}

export function ToolInvocationInput({
  input,
  label = "Input",
  className,
  ...props
}: ToolInvocationInputProps) {
  const [copied, setCopied] = React.useState(false);
  const inputStr = typeof input === "string" ? input : JSON.stringify(input, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(inputStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-950/30",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full" />
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            {label}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="Copy"
        >
          {copied ? (
            <Check className="size-3.5 text-green-500" />
          ) : (
            <Copy className="size-3.5 text-gray-500" />
          )}
        </button>
      </div>
      <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <pre className="p-3 text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto">
          <code>{inputStr}</code>
        </pre>
      </div>
    </div>
  );
}

// ToolInvocationOutput
interface ToolInvocationOutputProps extends React.HTMLAttributes<HTMLDivElement> {
  output?: React.ReactNode;
  error?: string;
  label?: string;
  errorLabel?: string;
}

export function ToolInvocationOutput({
  output,
  error,
  label = "Result",
  errorLabel = "Execution error",
  className,
  ...props
}: ToolInvocationOutputProps) {
  if (!output && !error) return null;

  const isError = !!error;

  return (
    <div
      className={cn(
        "p-4 bg-gradient-to-br",
        isError
          ? "from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20"
          : "from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={cn(
          "w-1 h-4 rounded-full",
          isError ? "bg-red-500" : "bg-green-500"
        )} />
        <span className={cn(
          "text-xs font-semibold uppercase tracking-wide",
          isError ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
        )}>
          {isError ? errorLabel : label}
        </span>
      </div>
      <div
        className={cn(
          "rounded-lg p-3 text-sm",
          isError
            ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
            : "bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
        )}
      >
        {isError ? (
          <div className="flex items-start gap-2">
            <XCircle className="size-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <CheckCircle className="size-5 shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
            <div className="flex-1 overflow-x-auto">{output}</div>
          </div>
        )}
      </div>
    </div>
  );
}
