"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";

export interface ScaleInProps {
  children: React.ReactNode;
  from?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  /** Increment this value to replay the animation */
  replayKey?: number;
}

export function ScaleIn({
  children,
  from = 0.85,
  delay = 0,
  duration = 0.45,
  once = true,
  className,
  replayKey,
}: ScaleInProps) {
  const variants: Variants = {
    hidden: { opacity: 0, scale: from },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      },
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
