"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";

export type TextRevealMode = "words" | "chars" | "lines";

export interface TextRevealProps {
  text: string;
  mode?: TextRevealMode;
  delay?: number;
  stagger?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  wordClassName?: string;
  /** Increment this value to replay the text reveal animation */
  replayKey?: number;
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.06,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const charVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.025,
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function TextReveal({
  text,
  mode = "words",
  delay = 0,
  once = true,
  className,
  wordClassName,
  replayKey,
}: TextRevealProps) {
  const [started, setStarted] = React.useState(false);

  // Reset and restart when replayKey changes
  React.useEffect(() => {
    if (replayKey === undefined || replayKey === 0) return;
    setStarted(false);
    const timer = setTimeout(() => setStarted(true), 50);
    return () => clearTimeout(timer);
  }, [replayKey]);

  if (mode === "chars") {
    const chars = text.split("");
    return (
      <motion.span
        className={cn("inline-flex flex-wrap", className)}
        onViewportEnter={() => setStarted(true)}
        viewport={{ once }}
      >
        {chars.map((char, i) => (
          <motion.span
            key={i}
            className={cn("inline-block", wordClassName)}
            custom={i + delay * 16}
            variants={charVariants}
            initial="hidden"
            animate={started ? "visible" : "hidden"}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  const words = text.split(" ");
  return (
    <motion.span
      className={cn("inline-flex flex-wrap gap-x-[0.25em]", className)}
      onViewportEnter={() => setStarted(true)}
      viewport={{ once }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className={cn("inline-block", wordClassName)}
          custom={i + delay * 16}
          variants={wordVariants}
          initial="hidden"
          animate={started ? "visible" : "hidden"}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
