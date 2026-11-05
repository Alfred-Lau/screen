"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export type TagColor = "default" | "blue" | "green" | "yellow" | "red" | "purple";

interface TagInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  tagColor?: TagColor;
  allowDuplicates?: boolean;
  separators?: string[];
  disabled?: boolean;
  className?: string;
  id?: string;
}

const tagColorStyles: Record<TagColor, { bg: string; text: string; border: string }> = {
  default: {
    bg: "bg-muted",
    text: "text-foreground",
    border: "border-border",
  },
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/40",
    text: "text-blue-800 dark:text-blue-200",
    border: "border-blue-200 dark:border-blue-700",
  },
  green: {
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    text: "text-emerald-800 dark:text-emerald-200",
    border: "border-emerald-200 dark:border-emerald-700",
  },
  yellow: {
    bg: "bg-yellow-100 dark:bg-yellow-900/40",
    text: "text-yellow-800 dark:text-yellow-200",
    border: "border-yellow-200 dark:border-yellow-700",
  },
  red: {
    bg: "bg-red-100 dark:bg-red-900/40",
    text: "text-red-800 dark:text-red-200",
    border: "border-red-200 dark:border-red-700",
  },
  purple: {
    bg: "bg-violet-100 dark:bg-violet-900/40",
    text: "text-violet-800 dark:text-violet-200",
    border: "border-violet-200 dark:border-violet-700",
  },
};

export function TagInput({
  value = [],
  onChange,
  placeholder = "Add tag...",
  maxTags,
  tagColor = "default",
  allowDuplicates = false,
  separators = ["Enter", ","],
  disabled = false,
  className,
  id,
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const colors = tagColorStyles[tagColor];

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (!allowDuplicates && value.includes(trimmed)) return;
    if (maxTags && value.length >= maxTags) return;
    onChange?.([...value, trimmed]);
    setInputValue("");
  };

  const removeTag = (index: number) => {
    onChange?.(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (separators.includes(e.key)) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.endsWith(",")) {
      addTag(val.slice(0, -1));
    } else {
      setInputValue(val);
    }
  };

  const isAtMax = maxTags !== undefined && value.length >= maxTags;

  return (
    <div
      className={cn(
        "flex flex-wrap gap-1.5 min-h-[42px] p-1.5 rounded-xl border border-input bg-background",
        "focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent",
        "transition-colors cursor-text",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, i) => (
        <span
          key={i}
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium border",
            colors.bg,
            colors.text,
            colors.border
          )}
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(i); }}
              className="hover:opacity-60 transition-opacity ml-0.5"
            >
              <X className="size-2.5" />
            </button>
          )}
        </span>
      ))}

      {!isAtMax && (
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (inputValue) addTag(inputValue); }}
          placeholder={value.length === 0 ? placeholder : ""}
          disabled={disabled}
          className="flex-1 min-w-[80px] text-sm bg-transparent outline-none placeholder:text-muted-foreground text-foreground py-0.5 px-1"
        />
      )}
    </div>
  );
}
