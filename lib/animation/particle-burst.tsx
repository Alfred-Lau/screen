"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  color: string;
}

const BURST_COLORS = [
  "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#EF4444",
];

export interface ParticleBurstProps {
  children?: React.ReactNode;
  particleCount?: number;
  trigger?: "hover" | "click" | "mount";
  className?: string;
}

export function ParticleBurst({
  children,
  particleCount = 20,
  trigger = "hover",
  className,
}: ParticleBurstProps) {
  const [particles, setParticles] = React.useState<Particle[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  function spawnParticles() {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const ps: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: Date.now() + i,
      x: cx,
      y: cy,
      angle: (360 / particleCount) * i + Math.random() * 10,
      speed: 30 + Math.random() * 50,
      size: 3 + Math.random() * 4,
      color: BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)],
    }));
    setParticles(ps);
    setTimeout(() => setParticles([]), 1200);
  }

  React.useEffect(() => {
    if (trigger === "mount") {
      const t = setTimeout(spawnParticles, 200);
      return () => clearTimeout(t);
    }
  }, [trigger]);

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-flex items-center justify-center", className)}
      onMouseEnter={() => trigger === "hover" && spawnParticles()}
      onClick={() => trigger === "click" && spawnParticles()}
    >
      <AnimatePresence>
        {particles.map((p) => {
          const rad = (p.angle * Math.PI) / 180;
          const tx = Math.cos(rad) * p.speed;
          const ty = Math.sin(rad) * p.speed;
          return (
            <motion.span
              key={p.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: p.x - p.size / 2,
                top: p.y - p.size / 2,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: tx, y: ty, opacity: 0, scale: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.1, 0.8, 0.3, 1] }}
            />
          );
        })}
      </AnimatePresence>
      {children}
    </div>
  );
}
