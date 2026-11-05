"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { RotateCcw } from "lucide-react";

export interface AnimationReplayProps {
  children: (replayKey: number) => React.ReactNode;
  className?: string;
  buttonClassName?: string;
  label?: string;
}

/**
 * Wraps animation demos with a replay button.
 * Pass a render function that receives the current `replayKey` (integer).
 * Increment the key to remount and replay the animation.
 */
export function AnimationReplay({
  children,
  className,
  buttonClassName,
  label = "Replay",
}: AnimationReplayProps) {
  const [replayKey, setReplayKey] = React.useState(0);
  const [spinning, setSpinning] = React.useState(false);

  function handleReplay() {
    setSpinning(true);
    setReplayKey((k) => k + 1);
    setTimeout(() => setSpinning(false), 600);
  }

  return (
    <div className={cn("relative", className)}>
      {children(replayKey)}
      <button
        onClick={handleReplay}
        className={cn(
          "absolute top-2 right-2 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg",
          "text-xs font-medium",
          "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm",
          "border border-gray-200/80 dark:border-gray-700/60",
          "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200",
          "hover:border-gray-300 dark:hover:border-gray-600",
          "shadow-sm hover:shadow transition-all duration-150",
          buttonClassName
        )}
        title="Replay animation"
      >
        <RotateCcw
          size={11}
          className={cn("transition-transform duration-500", spinning && "rotate-[-360deg]")}
          style={{ transitionTimingFunction: "ease-out" }}
        />
        {label}
      </button>
    </div>
  );
}
