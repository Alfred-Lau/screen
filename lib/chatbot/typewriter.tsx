"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TypewriterProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  speed?: number;
  enabled?: boolean;
  cursor?: boolean;
  cursorChar?: string;
  renderContent?: (text: string) => React.ReactNode;
  onComplete?: () => void;
}

export function Typewriter({
  text,
  speed = 30,
  enabled = true,
  cursor = true,
  cursorChar = "|",
  renderContent,
  onComplete,
  className,
  ...props
}: TypewriterProps) {
  const [displayText, setDisplayText] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(!enabled);

  React.useEffect(() => {
    if (!enabled) {
      setDisplayText(text);
      setIsComplete(true);
      return;
    }

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex > 0 && !isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, speed, enabled, isComplete, onComplete]);

  React.useEffect(() => {
    setCurrentIndex(0);
    setDisplayText("");
    setIsComplete(!enabled);
  }, [text, enabled]);

  const content = renderContent ? renderContent(displayText) : displayText;

  return (
    <span className={cn("inline", className)} {...props}>
      {content}
      {cursor && enabled && !isComplete && (
        <span className="animate-pulse">{cursorChar}</span>
      )}
    </span>
  );
}
