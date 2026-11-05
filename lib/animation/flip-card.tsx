"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  trigger?: "hover" | "click";
  direction?: "horizontal" | "vertical";
  className?: string;
  frontClassName?: string;
  backClassName?: string;
  height?: string | number;
}

export function FlipCard({
  front,
  back,
  trigger = "hover",
  direction = "horizontal",
  className,
  frontClassName,
  backClassName,
  height = 200,
}: FlipCardProps) {
  const [flipped, setFlipped] = React.useState(false);

  const isH = direction === "horizontal";
  const flipAxis = isH ? "rotateY" : "rotateX";

  const handleClick = () => {
    if (trigger === "click") setFlipped((v) => !v);
  };
  const hoverProps =
    trigger === "hover"
      ? {
          onHoverStart: () => setFlipped(true),
          onHoverEnd: () => setFlipped(false),
        }
      : {};

  return (
    <motion.div
      className={cn("relative cursor-pointer", className)}
      style={{ height, perspective: 1200 }}
      onClick={handleClick}
      {...hoverProps}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ [flipAxis]: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Front */}
        <div
          className={cn(
            "absolute inset-0 rounded-xl overflow-hidden",
            frontClassName
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          {front}
        </div>
        {/* Back */}
        <div
          className={cn(
            "absolute inset-0 rounded-xl overflow-hidden",
            backClassName
          )}
          style={{
            backfaceVisibility: "hidden",
            transform: `${flipAxis}(180deg)`,
          }}
        >
          {back}
        </div>
      </motion.div>
    </motion.div>
  );
}
