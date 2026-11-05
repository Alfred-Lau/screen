"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/cn";

export interface MagneticButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof motion.button>, "ref"> {
  strength?: number;
  className?: string;
  children: React.ReactNode;
}

export const MagneticButton = React.forwardRef<
  HTMLButtonElement,
  MagneticButtonProps
>(({ strength = 0.3, className, children, ...props }, ref) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      ref={containerRef}
      className="inline-flex"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.button
        ref={ref}
        style={{ x: sx, y: sy }}
        className={cn(
          "relative inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-colors",
          className
        )}
        whileTap={{ scale: 0.96 }}
        {...props}
      >
        {children}
      </motion.button>
    </div>
  );
});

MagneticButton.displayName = "MagneticButton";
