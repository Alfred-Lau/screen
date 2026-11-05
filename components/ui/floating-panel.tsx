"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FloatingPanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isVisible: boolean;
  position?: { x: number; y: number };
  children: React.ReactNode;
}

const FloatingPanel = React.forwardRef<HTMLDivElement, FloatingPanelProps>(
  ({ className, isVisible, position, children, ...props }, ref) => {
    if (!isVisible) return null;

    const style: React.CSSProperties = {
      position: "fixed",
      zIndex: 50,
      ...(position && {
        left: position.x,
        top: position.y,
      }),
    };

    return (
      <div
        ref={ref}
        data-floating-panel
        className={cn(
          "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg",
          "animate-in fade-in-0 zoom-in-95 duration-200",
          "min-w-[280px] max-w-sm",
          className
        )}
        style={style}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FloatingPanel.displayName = "FloatingPanel";

export { FloatingPanel };
