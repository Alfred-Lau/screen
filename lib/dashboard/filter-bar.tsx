"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, X, ChevronDown, SlidersHorizontal } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  placeholder?: string;
}

interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: FilterConfig[];
  filterValues?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
  actions?: React.ReactNode;
  loading?: boolean;
}

export function FilterBar({
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  filters = [],
  filterValues = {},
  onFilterChange,
  onClear,
  showClearButton = true,
  actions,
  loading = false,
  className,
  ...props
}: FilterBarProps) {
  const hasActiveFilters =
    searchValue.length > 0 || Object.values(filterValues).some((v) => v);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        className
      )}
      {...props}
    >
      {/* Search Input */}
      <div className="relative flex-1 min-w-[180px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          disabled={loading}
          className={cn(
            "w-full pl-9 pr-9 py-2 rounded-lg border border-input bg-background",
            "text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        />
        {searchValue && (
          <button
            onClick={() => onSearchChange?.("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Filter Dropdowns */}
      {filters.map((filter) => (
        <div key={filter.key} className="relative">
          <select
            value={filterValues[filter.key] ?? ""}
            onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
            disabled={loading}
            className={cn(
              "appearance-none pl-3 pr-8 py-2 rounded-lg border border-input bg-background",
              "text-sm text-foreground cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              filterValues[filter.key] && "border-primary text-primary"
            )}
          >
            <option value="">{filter.placeholder ?? `All ${filter.label}`}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
        </div>
      ))}

      {/* Divider */}
      {(actions || (showClearButton && hasActiveFilters)) && filters.length > 0 && (
        <div className="w-px h-6 bg-border" />
      )}

      {/* Clear Button */}
      {showClearButton && hasActiveFilters && (
        <button
          onClick={onClear}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium",
            "text-muted-foreground hover:text-foreground hover:bg-accent",
            "transition-colors border border-border"
          )}
        >
          <X className="size-3.5" />
          Clear
        </button>
      )}

      {/* Custom Actions */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
