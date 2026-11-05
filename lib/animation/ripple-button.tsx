"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export interface RippleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  rippleColor?: string;
  duration?: number;
  className?: string;
  children: React.ReactNode;
}

export const RippleButton = React.forwardRef<
  HTMLButtonElement,
  RippleButtonProps
>(
  (
    {
      rippleColor = "rgba(255,255,255,0.35)",
      duration = 0.6,
      className,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = React.useState<Ripple[]>([]);
    const containerRef = React.useRef<HTMLButtonElement>(null);

    function addRipple(e: React.MouseEvent<HTMLButtonElement>) {
      const btn = containerRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x, y, size }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, duration * 1000 + 100);
      onClick?.(e);
    }

    return (
      <button
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden px-6 py-3 rounded-full font-medium select-none",
          className
        )}
        onClick={addRipple}
        {...props}
      >
        <AnimatePresence>
          {ripples.map((r) => (
            <motion.span
              key={r.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: r.x,
                top: r.y,
                width: r.size,
                height: r.size,
                backgroundColor: rippleColor,
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

RippleButton.displayName = "RippleButton";
