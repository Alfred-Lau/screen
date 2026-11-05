"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Lightbulb, ArrowRight, Sparkles } from "lucide-react";

// Suggestions Component
interface SuggestionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
}

export function Suggestions({
  children,
  title = "Suggestions",
  icon,
  className,
  ...props
}: SuggestionsProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-amber-200 dark:border-amber-800",
        "bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-amber-200/50 dark:border-amber-800/50">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/50">
          {icon || <Lightbulb className="size-4 text-amber-600 dark:text-amber-400" />}
        </div>
        <span className="font-medium text-sm text-amber-800 dark:text-amber-200">
          {title}
        </span>
      </div>
      <div className="p-3">
        {children}
      </div>
    </div>
  );
}

// SuggestionsList
interface SuggestionsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SuggestionsList({
  children,
  className,
  ...props
}: SuggestionsListProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)} {...props}>
      {children}
    </div>
  );
}

// SuggestionItem
interface SuggestionItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "primary" | "outline";
  icon?: React.ReactNode;
}

export function SuggestionItem({
  children,
  variant = "default",
  icon,
  className,
  ...props
}: SuggestionItemProps) {
  return (
    <button
      className={cn(
        "group inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
        "transition-all duration-200",
        variant === "default" && [
          "bg-white dark:bg-gray-800",
          "border border-amber-200 dark:border-amber-700",
          "text-amber-800 dark:text-amber-200",
          "hover:bg-amber-50 dark:hover:bg-amber-900/30",
          "hover:border-amber-300 dark:hover:border-amber-600",
          "hover:shadow-sm",
        ],
        variant === "primary" && [
          "bg-amber-500 dark:bg-amber-600",
          "text-white",
          "hover:bg-amber-600 dark:hover:bg-amber-500",
          "shadow-sm hover:shadow-md",
        ],
        variant === "outline" && [
          "bg-transparent",
          "border border-dashed border-amber-300 dark:border-amber-700",
          "text-amber-700 dark:text-amber-300",
          "hover:bg-amber-50 dark:hover:bg-amber-900/20",
          "hover:border-solid",
        ],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
      <ArrowRight className="size-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
    </button>
  );
}

// Quick Suggestion Grid
interface QuickSuggestionsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  items: Array<{
    text: string;
    icon?: React.ReactNode;
  }>;
  onSelect?: (suggestion: string, index: number) => void;
  columns?: 1 | 2 | 3 | 4;
}

export function QuickSuggestions({
  items,
  onSelect,
  columns = 2,
  className,
  ...props
}: QuickSuggestionsProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={cn("grid gap-2", gridCols[columns], className)}
      {...props}
    >
      {items.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect?.(suggestion.text, index)}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl",
            "bg-white dark:bg-gray-800/50",
            "border border-gray-200 dark:border-gray-700",
            "text-left text-sm text-gray-700 dark:text-gray-300",
            "hover:bg-gray-50 dark:hover:bg-gray-800",
            "hover:border-blue-300 dark:hover:border-blue-700",
            "hover:shadow-sm",
            "transition-all duration-200",
            "group"
          )}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 shrink-0">
            {suggestion.icon || <Sparkles className="size-4 text-blue-500 dark:text-blue-400" />}
          </div>
          <span className="flex-1 line-clamp-2">{suggestion.text}</span>
          <ArrowRight className="size-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      ))}
    </div>
  );
}
