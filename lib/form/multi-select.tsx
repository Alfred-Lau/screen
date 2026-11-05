"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, X, Check, Search } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  group?: string;
}

interface MultiSelectProps {
  options: SelectOption[];
  value?: string[];
  onChange?: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  maxDisplay?: number;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  maxSelections?: number;
  className?: string;
  id?: string;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search...",
  maxDisplay = 3,
  searchable = true,
  clearable = true,
  disabled = false,
  maxSelections,
  className,
  id,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    const q = search.toLowerCase();
    return options.filter((o) =>
      o.label.toLowerCase().includes(q) || o.description?.toLowerCase().includes(q)
    );
  }, [options, search]);

  const toggleOption = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange?.(value.filter((v) => v !== optValue));
    } else {
      if (maxSelections && value.length >= maxSelections) return;
      onChange?.([...value, optValue]);
    }
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.([]);
  };

  const selectAll = () => {
    const allEnabled = filteredOptions
      .filter((o) => !o.disabled)
      .map((o) => o.value);
    if (maxSelections) {
      onChange?.(allEnabled.slice(0, maxSelections));
    } else {
      onChange?.(allEnabled);
    }
  };

  const selectedLabels = value.map((v) => options.find((o) => o.value === v)?.label ?? v);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {/* Trigger */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 w-full min-h-[42px] px-3 py-2 rounded-xl border border-input bg-background",
          "text-sm transition-colors focus:outline-none",
          open ? "ring-2 ring-ring border-transparent" : "hover:bg-accent/30",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex-1 flex flex-wrap items-center gap-1 min-w-0">
          {value.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            <>
              {selectedLabels.slice(0, maxDisplay).map((label, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-xs font-medium"
                >
                  {label}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleOption(value[i]); }}
                    className="hover:opacity-60"
                  >
                    <X className="size-2.5" />
                  </button>
                </span>
              ))}
              {value.length > maxDisplay && (
                <span className="text-xs text-muted-foreground font-medium">
                  +{value.length - maxDisplay} more
                </span>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {clearable && value.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-3.5" />
            </button>
          )}
          <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border border-border bg-popover shadow-xl overflow-hidden">
          {/* Search */}
          {searchable && (
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  autoFocus
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
                />
              </div>
            </div>
          )}

          {/* Select all / clear */}
          {filteredOptions.length > 0 && (
            <div className="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border">
              <button
                type="button"
                onClick={selectAll}
                className="text-xs font-medium text-primary hover:underline"
              >
                Select all
              </button>
              {value.length > 0 && (
                <button
                  type="button"
                  onClick={() => onChange?.([])}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </button>
              )}
            </div>
          )}

          {/* Options */}
          <div className="overflow-y-auto max-h-56">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-sm text-center text-muted-foreground">No options found</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = value.includes(opt.value);
                const isMaxed = !isSelected && maxSelections !== undefined && value.length >= maxSelections;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disabled || isMaxed}
                    onClick={() => toggleOption(opt.value)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors",
                      isSelected
                        ? "bg-primary/5 text-primary"
                        : "hover:bg-accent text-foreground",
                      (opt.disabled || isMaxed) && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-4 h-4 rounded border-2 shrink-0",
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-border"
                      )}
                    >
                      {isSelected && <Check className="size-2.5 text-primary-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{opt.label}</p>
                      {opt.description && (
                        <p className="text-xs text-muted-foreground truncate">{opt.description}</p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
