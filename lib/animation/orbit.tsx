"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface OrbitItem {
  content: React.ReactNode;
  radius?: number;
  duration?: number;
  delay?: number;
  reverse?: boolean;
  className?: string;
}

export interface OrbitProps {
  center: React.ReactNode;
  items: OrbitItem[];
  className?: string;
  size?: number;
}

export function Orbit({ center, items, className, size = 220 }: OrbitProps) {
  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {/* Center */}
      <div className="relative z-10 flex items-center justify-center">
        {center}
      </div>

      {/* Orbit rings and items */}
      {items.map((item, i) => {
        const radius = item.radius ?? size * 0.42;
        const dur = item.duration ?? 8 + i * 2;
        const delay = item.delay ?? i * -1.5;
        const dir = item.reverse ? 1 : -1;

        return (
          <React.Fragment key={i}>
            {/* Ring */}
            <div
              className="absolute rounded-full border border-dashed border-gray-200 dark:border-gray-700"
              style={{
                width: radius * 2,
                height: radius * 2,
              }}
            />
            {/* Item */}
            <motion.div
              className="absolute"
              style={{
                width: radius * 2,
                height: radius * 2,
              }}
              animate={{ rotate: dir * 360 }}
              transition={{
                duration: dur,
                ease: "linear",
                repeat: Infinity,
                delay,
              }}
            >
              {/* Counter-rotate so item stays upright */}
              <motion.div
                className={cn("absolute -translate-x-1/2 -translate-y-1/2 top-0 left-1/2", item.className)}
                animate={{ rotate: -dir * 360 }}
                transition={{
                  duration: dur,
                  ease: "linear",
                  repeat: Infinity,
                  delay,
                }}
              >
                {item.content}
              </motion.div>
            </motion.div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
