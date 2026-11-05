"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

export type FloatingBadgePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface FloatingBadgeProps {
  children: React.ReactNode;
  badge: React.ReactNode;
  position?: FloatingBadgePosition;
  pulse?: boolean;
  visible?: boolean;
  className?: string;
  badgeClassName?: string;
}

const positionClass: Record<FloatingBadgePosition, string> = {
  "top-left": "-top-2 -left-2",
  "top-right": "-top-2 -right-2",
  "bottom-left": "-bottom-2 -left-2",
  "bottom-right": "-bottom-2 -right-2",
};

export function FloatingBadge({
  children,
  badge,
  position = "top-right",
  pulse = false,
  visible = true,
  className,
  badgeClassName,
}: FloatingBadgeProps) {
  return (
    <div className={cn("relative inline-flex", className)}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            className={cn("absolute z-10", positionClass[position])}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {pulse && (
              <span className="absolute inset-0 rounded-full animate-ping bg-current opacity-30" />
            )}
            <span className={cn("relative flex items-center justify-center", badgeClassName)}>
              {badge}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
