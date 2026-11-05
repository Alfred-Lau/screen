"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToggleOption {
  value: string;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface ToggleGroupProps {
  options: ToggleOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline";
  disabled?: boolean;
  className?: string;
  id?: string;
}

const sizeStyles = {
  sm: "px-2.5 py-1 text-xs gap-1",
  md: "px-3.5 py-2 text-sm gap-1.5",
  lg: "px-4 py-2.5 text-base gap-2",
};

const iconOnlySizes = {
  sm: "px-2 py-1",
  md: "px-2.5 py-2",
  lg: "px-3 py-2.5",
};

export function ToggleGroup({
  options,
  value,
  onChange,
  multiple = false,
  fullWidth = false,
  size = "md",
  variant = "default",
  disabled: groupDisabled = false,
  className,
  id,
}: ToggleGroupProps) {
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  const isSelected = (v: string) => selectedValues.includes(v);

  const handleClick = (optValue: string) => {
    if (multiple) {
      const updated = isSelected(optValue)
        ? selectedValues.filter((v) => v !== optValue)
        : [...selectedValues, optValue];
      onChange?.(updated);
    } else {
      onChange?.(isSelected(optValue) ? "" : optValue);
    }
  };

  return (
    <div
      className={cn(
        "inline-flex rounded-xl overflow-hidden",
        variant === "default" && "border border-border bg-muted p-0.5 gap-0.5",
        variant === "outline" && "gap-1",
        fullWidth && "flex w-full",
        className
      )}
      role="group"
      id={id}
    >
      {options.map((opt) => {
        const isIconOnly = opt.icon && !opt.label;
        const selected = isSelected(opt.value);
        const itemDisabled = groupDisabled || opt.disabled;

        return (
          <button
            key={opt.value}
            type="button"
            disabled={itemDisabled}
            onClick={() => handleClick(opt.value)}
            className={cn(
              "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isIconOnly ? iconOnlySizes[size] : sizeStyles[size],
              fullWidth && "flex-1",
              variant === "default"
                ? selected
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                : selected
                ? "bg-primary text-primary-foreground border border-primary"
                : "border border-border text-foreground hover:bg-accent",
              itemDisabled && "opacity-40 cursor-not-allowed"
            )}
            aria-pressed={selected}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            {opt.label && opt.label}
          </button>
        );
      })}
    </div>
  );
}
