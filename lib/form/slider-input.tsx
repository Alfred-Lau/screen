"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: number | [number, number];
  onChange?: (value: number | [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  range?: boolean;
  showValue?: boolean;
  showMinMax?: boolean;
  formatValue?: (value: number) => string;
  disabled?: boolean;
  id?: string;
}

export function SliderInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  range = false,
  showValue = true,
  showMinMax = false,
  formatValue,
  disabled = false,
  id,
  className,
  ...props
}: SliderInputProps) {
  const format = formatValue ?? String;

  const singleValue = Array.isArray(value) ? value[0] : (value ?? min);
  const rangeValues: [number, number] = Array.isArray(value)
    ? value
    : [min, value ?? max];

  const getPercent = (v: number) => ((v - min) / (max - min)) * 100;

  const handleSingleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(Number(e.target.value));
  };

  const handleRangeChange = (index: 0 | 1, e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    const updated: [number, number] = [...rangeValues] as [number, number];
    updated[index] = newVal;
    if (index === 0 && newVal > updated[1]) updated[0] = updated[1];
    if (index === 1 && newVal < updated[0]) updated[1] = updated[0];
    onChange?.(updated);
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      {showValue && (
        <div className={cn("flex items-center mb-2", range ? "justify-between" : "justify-end")}>
          {range ? (
            <>
              <span className="text-sm font-semibold text-foreground">{format(rangeValues[0])}</span>
              <span className="text-sm font-semibold text-foreground">{format(rangeValues[1])}</span>
            </>
          ) : (
            <span className="text-sm font-semibold text-foreground">{format(singleValue)}</span>
          )}
        </div>
      )}

      <div className="relative">
        {range ? (
          <div className="relative h-5 flex items-center">
            {/* Track */}
            <div className="absolute h-1.5 w-full rounded-full bg-muted">
              <div
                className="absolute h-full rounded-full bg-primary"
                style={{
                  left: `${getPercent(rangeValues[0])}%`,
                  right: `${100 - getPercent(rangeValues[1])}%`,
                }}
              />
            </div>
            {/* Min slider */}
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={rangeValues[0]}
              onChange={(e) => handleRangeChange(0, e)}
              disabled={disabled}
              className={cn(
                "absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer",
                "slider-thumb",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            />
            {/* Max slider */}
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={rangeValues[1]}
              onChange={(e) => handleRangeChange(1, e)}
              disabled={disabled}
              className={cn(
                "absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer",
                "slider-thumb",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            />
          </div>
        ) : (
          <div className="relative h-5 flex items-center">
            {/* Track */}
            <div className="absolute h-1.5 w-full rounded-full bg-muted">
              <div
                className="absolute h-full rounded-full bg-primary left-0"
                style={{ width: `${getPercent(singleValue)}%` }}
              />
            </div>
            <input
              id={id}
              type="range"
              min={min}
              max={max}
              step={step}
              value={singleValue}
              onChange={handleSingleChange}
              disabled={disabled}
              className={cn(
                "relative w-full h-1.5 appearance-none bg-transparent cursor-pointer z-10",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              style={{
                WebkitAppearance: "none",
              }}
            />
          </div>
        )}
      </div>

      {showMinMax && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">{format(min)}</span>
          <span className="text-xs text-muted-foreground">{format(max)}</span>
        </div>
      )}

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: hsl(var(--primary));
          border: 2px solid hsl(var(--background));
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          cursor: pointer;
          transition: transform 0.1s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        input[type=range]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: hsl(var(--primary));
          border: 2px solid hsl(var(--background));
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
