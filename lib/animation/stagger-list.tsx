"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";

export interface StaggerListProps {
  children: React.ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  once?: boolean;
  className?: string;
  itemClassName?: string;
  as?: "ul" | "ol" | "div";
  /** Increment this value to replay the animation */
  replayKey?: number;
}

const containerVariants = (stagger: number, initial: number): Variants => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren: initial,
      staggerChildren: stagger,
    },
  },
});

const itemVariants = (direction: StaggerListProps["direction"]): Variants => {
  const offset = 20;
  const hidden: Record<string, number> = { opacity: 0 };
  if (direction === "up") hidden.y = offset;
  if (direction === "down") hidden.y = -offset;
  if (direction === "left") hidden.x = -offset;
  if (direction === "right") hidden.x = offset;
  return {
    hidden,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };
};

export function StaggerList({
  children,
  staggerDelay = 0.08,
  initialDelay = 0,
  direction = "up",
  once = true,
  className,
  itemClassName,
  as: Tag = "div",
  replayKey,
}: StaggerListProps) {
  const childArray = React.Children.toArray(children);
  const iv = itemVariants(direction);

  return (
    <motion.div
      key={replayKey}
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      variants={containerVariants(staggerDelay, initialDelay)}
    >
      {childArray.map((child, i) => (
        <motion.div key={i} variants={iv} className={cn(itemClassName)}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
