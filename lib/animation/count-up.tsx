"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/cn";

export interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: string;
  once?: boolean;
  className?: string;
  /** Increment this value to replay the count-up animation */
  replayKey?: number;
}

function formatNumber(n: number, decimals: number, separator: string): string {
  const fixed = n.toFixed(decimals);
  const [int, dec] = fixed.split(".");
  const formatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return dec !== undefined ? `${formatted}.${dec}` : formatted;
}

export function CountUp({
  from = 0,
  to,
  duration = 2,
  delay = 0,
  prefix = "",
  suffix = "",
  decimals = 0,
  separator = ",",
  once = true,
  className,
  replayKey,
}: CountUpProps) {
  const count = useMotionValue(from);
  const [display, setDisplay] = React.useState(
    formatNumber(from, decimals, separator)
  );
  const [hasStarted, setHasStarted] = React.useState(false);

  React.useEffect(() => {
    const unsub = count.on("change", (latest) => {
      setDisplay(formatNumber(latest, decimals, separator));
    });
    return unsub;
  }, [count, decimals, separator]);

  // When replayKey changes, reset and restart
  React.useEffect(() => {
    if (replayKey === undefined || replayKey === 0) return;
    count.set(from);
    setDisplay(formatNumber(from, decimals, separator));
    setHasStarted(false);
    const timer = setTimeout(() => {
      setHasStarted(true);
      setTimeout(() => {
        animate(count, to, { duration, ease: [0.16, 1, 0.3, 1] });
      }, delay * 1000);
    }, 50);
    return () => clearTimeout(timer);
  }, [replayKey]);

  function startAnimation() {
    if (hasStarted) return;
    setHasStarted(true);
    setTimeout(() => {
      animate(count, to, {
        duration,
        ease: [0.16, 1, 0.3, 1],
      });
    }, delay * 1000);
  }

  return (
    <motion.span
      className={cn("tabular-nums", className)}
      onViewportEnter={startAnimation}
      viewport={{ once }}
    >
      {prefix}
      {display}
      {suffix}
    </motion.span>
  );
}
