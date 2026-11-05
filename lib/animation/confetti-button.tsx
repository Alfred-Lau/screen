"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

const COLORS = [
  "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF",
  "#FF6BFF", "#FF922B", "#74C0FC", "#A9E34B",
];

export interface ConfettiButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  particleCount?: number;
  duration?: number;
  className?: string;
  children: React.ReactNode;
}

export const ConfettiButton = React.forwardRef<
  HTMLButtonElement,
  ConfettiButtonProps
>(
  (
    { particleCount = 30, duration = 1.2, className, children, onClick, ...props },
    ref
  ) => {
    const [particles, setParticles] = React.useState<Particle[]>([]);
    const containerRef = React.useRef<HTMLButtonElement>(null);

    function burst(e: React.MouseEvent<HTMLButtonElement>) {
      const btn = containerRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.4;
        const speed = 60 + Math.random() * 80;
        return {
          id: Date.now() + i,
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 4 + Math.random() * 5,
        };
      });
      setParticles(newParticles);
      setTimeout(() => setParticles([]), (duration + 0.2) * 1000);
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
          "relative inline-flex items-center justify-center overflow-visible px-6 py-3 rounded-full font-medium select-none",
          className
        )}
        onClick={burst}
        {...props}
      >
        <AnimatePresence>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-sm pointer-events-none"
              style={{
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                originX: "50%",
                originY: "50%",
              }}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{
                x: p.vx,
                y: p.vy,
                opacity: 0,
                rotate: Math.random() > 0.5 ? 180 : -180,
              }}
              transition={{ duration, ease: [0.1, 0.9, 0.3, 1] }}
            />
          ))}
        </AnimatePresence>
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

ConfettiButton.displayName = "ConfettiButton";
