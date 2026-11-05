"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
  trackColor?: string;
  showValue?: boolean;
  animated?: boolean;
  formatValue?: (value: number) => string;
}

export function ProgressRing({
  value,
  max = 100,
  size = 80,
  strokeWidth = 6,
  label,
  sublabel,
  color,
  trackColor,
  showValue = true,
  animated = true,
  formatValue,
  className,
  ...props
}: ProgressRingProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const [animatedOffset, setAnimatedOffset] = React.useState(circumference);

  React.useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedOffset(strokeDashoffset);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedOffset(strokeDashoffset);
    }
  }, [strokeDashoffset, animated]);

  const displayValue = formatValue
    ? formatValue(value)
    : `${Math.round(percentage)}%`;

  const gradientId = React.useId();

  return (
    <div
      className={cn("inline-flex flex-col items-center gap-2", className)}
      {...props}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color ?? "hsl(var(--primary))"} />
              <stop offset="100%" stopColor={color ?? "hsl(var(--primary))"} stopOpacity="0.7" />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor ?? "hsl(var(--muted))"}
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animatedOffset}
            style={animated ? { transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)" } : undefined}
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-bold text-foreground leading-none"
              style={{ fontSize: size * 0.18 }}
            >
              {displayValue}
            </span>
          </div>
        )}
      </div>
      {(label || sublabel) && (
        <div className="text-center">
          {label && <p className="text-sm font-medium text-foreground">{label}</p>}
          {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
        </div>
      )}
    </div>
  );
}
