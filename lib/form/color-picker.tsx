"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899",
  "#6b7280", "#1e293b", "#ffffff", "#000000",
];

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  presetColors?: string[];
  showCustomInput?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}

function isValidHex(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

export function ColorPicker({
  value = "#3b82f6",
  onChange,
  presetColors = PRESET_COLORS,
  showCustomInput = true,
  disabled = false,
  className,
  id,
}: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handlePresetClick = (color: string) => {
    onChange?.(color);
    setInputValue(color);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (isValidHex(val)) {
      onChange?.(val);
    }
  };

  return (
    <div className={cn("relative inline-block", className)} ref={panelRef}>
      {/* Trigger */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl border border-input bg-background",
          "text-sm text-foreground transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-ring",
          "hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <span
          className="w-5 h-5 rounded-md border border-border/50 shadow-sm shrink-0"
          style={{ backgroundColor: value }}
        />
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
        <ChevronDown className={cn("size-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 p-3 rounded-xl border border-border bg-popover shadow-xl min-w-[200px]">
          {/* Preset grid */}
          <div className="grid grid-cols-6 gap-1.5 mb-3">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handlePresetClick(color)}
                className={cn(
                  "w-7 h-7 rounded-md border border-border/50 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring relative",
                )}
                style={{ backgroundColor: color }}
                title={color}
              >
                {value === color && (
                  <Check
                    className="absolute inset-0 m-auto size-3.5"
                    style={{ color: isLightColor(color) ? "#000" : "#fff" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Custom hex input */}
          {showCustomInput && (
            <div className="flex items-center gap-2 border-t border-border pt-3">
              <span
                className="w-6 h-6 rounded border border-border/50 shrink-0"
                style={{ backgroundColor: isValidHex(inputValue) ? inputValue : value }}
              />
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="#000000"
                maxLength={7}
                className={cn(
                  "flex-1 text-xs font-mono px-2 py-1 rounded-lg border border-input bg-background",
                  "focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
                )}
              />
              {/* Native color picker fallback */}
              <input
                type="color"
                value={isValidHex(value) ? value : "#3b82f6"}
                onChange={(e) => { onChange?.(e.target.value); setInputValue(e.target.value); }}
                className="w-7 h-7 rounded border border-border cursor-pointer p-0.5 bg-background"
                title="Pick custom color"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}
