"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Loader Variants
type LoaderVariant = "dots" | "typing" | "spinner" | "pulse";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: LoaderVariant;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function Loader({
  variant = "dots",
  size = "md",
  text,
  className,
  ...props
}: LoaderProps) {
  const sizeClasses = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-3 w-3",
  };

  const spinnerSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {variant === "dots" && (
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                sizeClasses[size],
                "rounded-full bg-gray-400 dark:bg-gray-500",
                "animate-bounce"
              )}
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      )}

      {variant === "typing" && (
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  sizeClasses[size],
                  "rounded-full bg-blue-500 dark:bg-blue-400"
                )}
                style={{
                  animation: "typing 1.4s infinite",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
          <style
            dangerouslySetInnerHTML={{
              __html: `
            @keyframes typing {
              0%,
              60%,
              100% {
                transform: translateY(0);
                opacity: 0.4;
              }
              30% {
                transform: translateY(-4px);
                opacity: 1;
              }
            }
          `,
            }}
          />
        </div>
      )}

      {variant === "spinner" && (
        <div
          className={cn(
            spinnerSizes[size],
            "border-2 border-gray-200 dark:border-gray-700",
            "border-t-blue-500 dark:border-t-blue-400",
            "rounded-full animate-spin"
          )}
        />
      )}

      {variant === "pulse" && (
        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              "rounded-full bg-gradient-to-r from-blue-500 to-purple-500",
              "animate-pulse",
              size === "sm" && "h-3 w-3",
              size === "md" && "h-4 w-4",
              size === "lg" && "h-5 w-5"
            )}
          />
          <span className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
            {text || "Thinking..."}
          </span>
        </div>
      )}

      {text && variant !== "pulse" && (
        <span className="text-sm text-gray-500 dark:text-gray-400">{text}</span>
      )}
    </div>
  );
}

// Skeleton Loader for content
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  animated?: boolean;
}

export function Skeleton({
  lines = 3,
  animated = true,
  className,
  ...props
}: SkeletonProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 rounded bg-gray-200 dark:bg-gray-700",
            animated && "animate-pulse",
            i === lines - 1 && "w-2/3" // Last line shorter
          )}
        />
      ))}
    </div>
  );
}

// Streaming cursor
interface StreamingCursorProps extends React.HTMLAttributes<HTMLSpanElement> {
  visible?: boolean;
}

export function StreamingCursor({
  visible = true,
  className,
  ...props
}: StreamingCursorProps) {
  if (!visible) return null;

  return (
    <span
      className={cn(
        "inline-block w-0.5 h-4 bg-blue-500 ml-0.5 align-middle",
        "animate-blink",
        className
      )}
      {...props}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `,
        }}
      />
    </span>
  );
}
