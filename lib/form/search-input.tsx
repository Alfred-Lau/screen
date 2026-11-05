"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, X, Loader2 } from "lucide-react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  loading?: boolean;
  showClear?: boolean;
  shortcut?: string;
  onShortcut?: () => void;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  variant?: "default" | "ghost" | "pill";
}

export function SearchInput({
  value,
  onValueChange,
  loading = false,
  showClear = true,
  shortcut,
  onShortcut,
  leftSlot,
  rightSlot,
  variant = "default",
  className,
  onChange,
  ...props
}: SearchInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange?.(e.target.value);
    onChange?.(e);
  };

  const handleClear = () => {
    onValueChange?.("");
    inputRef.current?.focus();
  };

  React.useEffect(() => {
    if (!shortcut || !onShortcut) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onShortcut();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcut, onShortcut]);

  const variantStyles = {
    default: "border border-input rounded-xl bg-background",
    ghost: "border-0 bg-transparent",
    pill: "border border-input rounded-full bg-background",
  };

  return (
    <div
      className={cn(
        "relative flex items-center w-full",
        variantStyles[variant],
        "focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all",
        className
      )}
    >
      {/* Left: search icon or custom slot */}
      <div className="flex items-center pl-3 text-muted-foreground shrink-0">
        {leftSlot ?? <Search className="size-4" />}
      </div>

      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={handleChange}
        className="flex-1 py-2.5 px-2 text-sm bg-transparent text-foreground placeholder:text-muted-foreground outline-none [appearance:textfield] [&::-webkit-search-cancel-button]:hidden"
        {...props}
      />

      {/* Right: loading, clear, shortcut, or custom slot */}
      <div className="flex items-center gap-1 pr-3 shrink-0">
        {loading && <Loader2 className="size-4 text-muted-foreground animate-spin" />}
        {showClear && value && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
        {shortcut && !value && !loading && (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border bg-muted text-xs text-muted-foreground font-mono">
            {shortcut}
          </kbd>
        )}
        {rightSlot}
      </div>
    </div>
  );
}
