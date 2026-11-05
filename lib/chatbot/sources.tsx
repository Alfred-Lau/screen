"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ExternalLink, FileText, Globe } from "lucide-react";

// Sources Context
interface SourcesContextValue {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SourcesContext = React.createContext<SourcesContextValue | null>(null);

function useSources() {
  const context = React.useContext(SourcesContext);
  if (!context) {
    throw new Error("useSources must be used within a Sources");
  }
  return context;
}

// Sources Component
interface SourcesProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Sources({
  children,
  defaultOpen = false,
  className,
  ...props
}: SourcesProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <SourcesContext.Provider value={{ isOpen, setIsOpen }}>
      <div
        className={cn(
          "w-full rounded-lg border",
          "border-gray-200 dark:border-gray-700",
          "bg-gray-50/50 dark:bg-gray-800/50",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SourcesContext.Provider>
  );
}

// Sources Trigger
interface SourcesTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  count?: number;
  label?: string;
}

export function SourcesTrigger({
  count,
  label = "Sources",
  className,
  ...props
}: SourcesTriggerProps) {
  const { isOpen, setIsOpen } = useSources();

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2",
        "text-sm font-medium text-gray-700 dark:text-gray-300",
        "hover:bg-gray-100/50 dark:hover:bg-gray-700/50",
        "rounded-t-lg transition-colors",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <FileText size={16} className="text-blue-500" />
        <span>{label}</span>
        {count !== undefined && (
          <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
            {count}
          </span>
        )}
      </div>
      <ChevronDown
        size={16}
        className={cn(
          "transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </button>
  );
}

// Sources Content
interface SourcesContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SourcesContent({ children, className, ...props }: SourcesContentProps) {
  const { isOpen } = useSources();

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "px-3 pb-3",
        "border-t border-gray-200 dark:border-gray-700",
        "animate-in slide-in-from-top-2 duration-200",
        className
      )}
      {...props}
    >
      <div className="pt-2 space-y-2">
        {children}
      </div>
    </div>
  );
}

// Single Source
interface SourceProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  title: string;
  description?: string;
  favicon?: string;
  type?: "url" | "document";
}

export function Source({
  href,
  title,
  description,
  favicon,
  type = "url",
  className,
  ...props
}: SourceProps) {
  const Icon = type === "url" ? Globe : FileText;

  // Extract domain from URL for display
  let displayDomain = href;
  try {
    const url = new URL(href);
    displayDomain = url.hostname;
  } catch {
    // Keep original href if invalid URL
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-start gap-3 p-2 rounded-md",
        "hover:bg-gray-100 dark:hover:bg-gray-700",
        "transition-colors group",
        className
      )}
      {...props}
    >
      <div className="flex-shrink-0 mt-0.5">
        {favicon ? (
          <img
            src={favicon}
            alt=""
            className="w-4 h-4 rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <Icon size={16} className="text-gray-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {title}
          </span>
          <ExternalLink
            size={12}
            className="flex-shrink-0 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
            {description}
          </p>
        )}
        <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
          {displayDomain}
        </span>
      </div>
    </a>
  );
}

// Inline source citation badge
interface SourceBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  index: number;
  href?: string;
}

export function SourceBadge({ index, href, className, ...props }: SourceBadgeProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        "w-4 h-4 text-[10px] font-medium",
        "rounded bg-blue-100 dark:bg-blue-900",
        "text-blue-600 dark:text-blue-400",
        "hover:bg-blue-200 dark:hover:bg-blue-800",
        "transition-colors cursor-pointer",
        className
      )}
      {...props}
    >
      {index}
    </span>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
}
