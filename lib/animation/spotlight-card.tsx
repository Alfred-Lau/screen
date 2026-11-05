"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/cn";

export interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(139, 92, 246, 0.12)",
  spotlightSize = 300,
}: SpotlightCardProps) {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const background = useTransform(
    [mouseX, mouseY],
    ([mx, my]) =>
      `radial-gradient(${spotlightSize}px circle at ${mx}px ${my}px, ${spotlightColor}, transparent 70%)`
  );

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  function handleMouseLeave() {
    mouseX.set(-1000);
    mouseY.set(-1000);
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white dark:bg-gray-900/40",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spotlight overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{ background }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
