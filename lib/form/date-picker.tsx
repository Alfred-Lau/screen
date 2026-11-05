"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  formatDate?: (date: Date) => string;
  className?: string;
  id?: string;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

function defaultFormat(date: Date): string {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function isDisabled(date: Date, minDate?: Date, maxDate?: Date, disabledDates?: Date[]): boolean {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  if (disabledDates?.some((d) => isSameDay(d, date))) return true;
  return false;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date...",
  disabled = false,
  minDate,
  maxDate,
  disabledDates,
  formatDate = defaultFormat,
  className,
  id,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [viewDate, setViewDate] = React.useState(() => value ?? new Date());
  const panelRef = React.useRef<HTMLDivElement>(null);

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

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleSelect = (day: number) => {
    const date = new Date(year, month, day);
    if (isDisabled(date, minDate, maxDate, disabledDates)) return;
    onChange?.(date);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
  };

  return (
    <div className={cn("relative", className)} ref={panelRef}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 w-full px-3 py-2.5 rounded-xl border border-input bg-background",
          "text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
          "hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
          open && "ring-2 ring-ring border-transparent"
        )}
      >
        <Calendar className="size-4 text-muted-foreground shrink-0" />
        <span className={cn("flex-1 text-left", value ? "text-foreground" : "text-muted-foreground")}>
          {value ? formatDate(value) : placeholder}
        </span>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-3.5" />
          </button>
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 rounded-xl border border-border bg-popover shadow-xl p-3 min-w-[260px]">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            <p className="text-sm font-semibold text-foreground">
              {MONTHS[month]} {year}
            </p>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(year, month, day);
              const isSelected = value && isSameDay(date, value);
              const isToday = isSameDay(date, new Date());
              const isOff = isDisabled(date, minDate, maxDate, disabledDates);

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isOff}
                  onClick={() => handleSelect(day)}
                  className={cn(
                    "flex items-center justify-center h-8 w-full rounded-lg text-sm transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground font-semibold"
                      : isToday
                      ? "border border-primary text-primary font-medium hover:bg-primary/10"
                      : "text-foreground hover:bg-accent",
                    isOff && "opacity-30 cursor-not-allowed"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Today button */}
          <div className="mt-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={() => { onChange?.(new Date()); setOpen(false); }}
              className="w-full text-center text-xs font-medium text-primary hover:underline"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
