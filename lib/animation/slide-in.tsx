"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";

export type SlideDirection = "up" | "down" | "left" | "right";

export interface SlideInProps {
  children: React.ReactNode;
  direction?: SlideDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
  /** Increment this value to replay the animation */
  replayKey?: number;
}

export function SlideIn({
  children,
  direction = "left",
  delay = 0,
  duration = 0.6,
  distance = 40,
  once = true,
  className,
  replayKey,
}: SlideInProps) {
  const initial: Record<string, number | string> = { opacity: 0 };
  if (direction === "up") initial.y = distance;
  if (direction === "down") initial.y = -distance;
  if (direction === "left") initial.x = -distance;
  if (direction === "right") initial.x = distance;

  const variants: Variants = {
    hidden: initial,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      key={replayKey}
      className={cn("overflow-hidden", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
