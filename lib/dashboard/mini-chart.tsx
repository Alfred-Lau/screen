"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type MiniChartType = "line" | "bar" | "area";

interface MiniChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[];
  type?: MiniChartType;
  color?: string;
  height?: number;
  showDots?: boolean;
  animated?: boolean;
  trend?: "up" | "down" | "neutral";
}

function normalizeData(data: number[]): number[] {
  if (data.length === 0) return [];
  const min = Math.min(...data);
  const max = Math.max(...data);
  if (max === min) return data.map(() => 0.5);
  return data.map((v) => (v - min) / (max - min));
}

function buildLinePath(points: { x: number; y: number }[], height: number): string {
  if (points.length === 0) return "";
  const d = points.map((p, i) =>
    i === 0 ? `M ${p.x} ${height - p.y}` : `L ${p.x} ${height - p.y}`
  );
  return d.join(" ");
}

function buildAreaPath(points: { x: number; y: number }[], height: number, width: number): string {
  if (points.length === 0) return "";
  const linePart = buildLinePath(points, height);
  return `${linePart} L ${width} ${height} L 0 ${height} Z`;
}

export function MiniChart({
  data,
  type = "line",
  color,
  height = 48,
  showDots = false,
  animated = true,
  trend = "neutral",
  className,
  ...props
}: MiniChartProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [width, setWidth] = React.useState(120);

  React.useEffect(() => {
    if (svgRef.current) {
      setWidth(svgRef.current.clientWidth || 120);
    }
  }, []);

  const trendColors = {
    up: "hsl(var(--chart-2, 142 71% 45%))",
    down: "hsl(var(--destructive, 0 72% 51%))",
    neutral: "hsl(var(--primary))",
  };

  const strokeColor = color ?? trendColors[trend];
  const normalizedData = normalizeData(data);
  const padding = 4;
  const chartHeight = height - padding * 2;
  const barWidth = data.length > 1 ? (width - padding * 2) / (data.length * 1.4) : 10;
  const barGap = data.length > 1 ? (width - padding * 2 - barWidth * data.length) / (data.length - 1) : 0;

  const points = normalizedData.map((v, i) => ({
    x: padding + (data.length > 1 ? (i / (data.length - 1)) * (width - padding * 2) : width / 2),
    y: padding + v * chartHeight,
  }));

  if (type === "bar") {
    return (
      <div className={cn("w-full", className)} {...props}>
        <svg
          ref={svgRef}
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          {normalizedData.map((v, i) => {
            const barHeight = Math.max(2, v * chartHeight);
            const x = padding + i * (barWidth + barGap);
            const y = height - padding - barHeight;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={2}
                fill={strokeColor}
                opacity={0.85}
              />
            );
          })}
        </svg>
      </div>
    );
  }

  const linePath = buildLinePath(points, height - padding);
  const areaPath = buildAreaPath(points, height - padding, width);
  const gradientId = React.useId();

  return (
    <div className={cn("w-full", className)} {...props}>
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        {type === "area" && (
          <>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
                <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#${gradientId})`} />
          </>
        )}
        <path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {showDots &&
          points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={height - padding - (normalizedData[i] * chartHeight)}
              r="2.5"
              fill={strokeColor}
            />
          ))}
      </svg>
    </div>
  );
}
