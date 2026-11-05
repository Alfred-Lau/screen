"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";

export type FadeInDirection = "up" | "down" | "left" | "right" | "none";

export interface FadeInProps {
  children: React.ReactNode;
  direction?: FadeInDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
  /** Increment this value to replay the animation */
  replayKey?: number;
}

const directionMap: Record<FadeInDirection, { x?: number; y?: number }> = {
  up: { y: 24 },
  down: { y: -24 },
  left: { x: 24 },
  right: { x: -24 },
  none: {},
};

export function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  distance,
  once = true,
  className,
  replayKey,
}: FadeInProps) {
  const offset = distance ?? 24;
  const rawDir = directionMap[direction];
  const initial = {
    opacity: 0,
    ...(rawDir.y !== undefined ? { y: rawDir.y > 0 ? offset : -offset } : {}),
    ...(rawDir.x !== undefined ? { x: rawDir.x > 0 ? offset : -offset } : {}),
  };

  const variants: Variants = {
    hidden: initial,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      key={replayKey}
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
