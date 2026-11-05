"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  gap?: number;
  className?: string;
  itemClassName?: string;
}

export function Marquee({
  children,
  speed = 40,
  reverse = false,
  pauseOnHover = true,
  gap = 32,
  className,
  itemClassName,
}: MarqueeProps) {
  const [isPaused, setIsPaused] = React.useState(false);
  const items = React.Children.toArray(children);
  // Duplicate items to create seamless loop
  const duplicated = [...items, ...items, ...items];

  return (
    <div
      className={cn("overflow-hidden w-full", className)}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <motion.div
        className="flex"
        style={{ gap }}
        animate={
          isPaused
            ? {}
            : { x: reverse ? ["-33.333%", "0%"] : ["0%", "-33.333%"] }
        }
        transition={{
          duration: (items.length * 120) / speed,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {duplicated.map((child, i) => (
          <div key={i} className={cn("shrink-0", itemClassName)}>
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
