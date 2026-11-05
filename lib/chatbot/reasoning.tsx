"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Brain, Sparkles } from "lucide-react";

// Reasoning Component
interface ReasoningProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isStreaming?: boolean;
  defaultOpen?: boolean;
}

export function Reasoning({
  children,
  isStreaming = false,
  defaultOpen = false,
  className,
  ...props
}: ReasoningProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen || isStreaming);

  // Auto-open when streaming
  React.useEffect(() => {
    if (isStreaming) {
      setIsOpen(true);
    }
  }, [isStreaming]);

  return (
    <div
      className={cn(
        "w-full rounded-lg border",
        "border-purple-200 dark:border-purple-800",
        "bg-purple-50/50 dark:bg-purple-900/20",
        className
      )}
      {...props}
    >
      <ReasoningContext.Provider value={{ isOpen, setIsOpen, isStreaming }}>
        {children}
      </ReasoningContext.Provider>
    </div>
  );
}

// Reasoning Context
interface ReasoningContextValue {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isStreaming: boolean;
}

const ReasoningContext = React.createContext<ReasoningContextValue | null>(null);

function useReasoning() {
  const context = React.useContext(ReasoningContext);
  if (!context) {
    throw new Error("useReasoning must be used within a Reasoning");
  }
  return context;
}

// Reasoning Trigger
interface ReasoningTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  label?: string;
}

export function ReasoningTrigger({
  children,
  label = "Thinking",
  className,
  ...props
}: ReasoningTriggerProps) {
  const { isOpen, setIsOpen, isStreaming } = useReasoning();

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2",
        "text-sm font-medium text-purple-700 dark:text-purple-300",
        "hover:bg-purple-100/50 dark:hover:bg-purple-800/30",
        "rounded-t-lg transition-colors",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {isStreaming ? (
          <Sparkles size={16} className="animate-pulse text-purple-500" />
        ) : (
          <Brain size={16} className="text-purple-500" />
        )}
        <span>
          {children || (isStreaming ? `${label}...` : label)}
        </span>
        {isStreaming && (
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </span>
        )}
      </div>
      <ChevronDown
        size={16}
        className={cn(
          "transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </button>
  );
}

// Reasoning Content
interface ReasoningContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxHeight?: number;
}

export function ReasoningContent({ 
  children, 
  className, 
  maxHeight = 200,
  ...props 
}: ReasoningContentProps) {
  const { isOpen, isStreaming } = useReasoning();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showTopFade, setShowTopFade] = React.useState(false);
  const [showBottomFade, setShowBottomFade] = React.useState(false);

  // Inline style for hiding scrollbar in Webkit browsers
  const scrollbarHideStyle = `
    .reasoning-scroll::-webkit-scrollbar {
      display: none;
    }
  `;

  // Check scroll position to show/hide fade effects
  const handleScroll = React.useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    
    // Show top fade when scrolled down
    setShowTopFade(scrollTop > 10);
    // Show bottom fade when not at bottom
    setShowBottomFade(scrollTop < scrollHeight - clientHeight - 10);
  }, []);

  // Check on mount and content change
  React.useEffect(() => {
    if (isOpen) {
      // Delay to ensure content is rendered
      const timer = setTimeout(() => {
        handleScroll();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, children, handleScroll]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "relative text-sm",
        "text-purple-700/80 dark:text-purple-300/80",
        "border-t border-purple-200 dark:border-purple-800",
        "animate-in slide-in-from-top-2 duration-200",
        className
      )}
      {...props}
    >
      {/* Inject scrollbar hide styles */}
      <style dangerouslySetInnerHTML={{ __html: scrollbarHideStyle }} />

      {/* Top fade gradient */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-6 z-10 pointer-events-none",
          "bg-gradient-to-b from-purple-50/90 dark:from-purple-900/40 to-transparent",
          "transition-opacity duration-200",
          showTopFade ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="reasoning-scroll overflow-y-auto px-3 py-2"
        style={{ 
          maxHeight: `${maxHeight}px`,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className={cn(
          "whitespace-pre-wrap",
          isStreaming && "animate-pulse"
        )}>
          {children}
        </div>
      </div>

      {/* Bottom fade gradient */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-6 z-10 pointer-events-none",
          "bg-gradient-to-t from-purple-50/90 dark:from-purple-900/40 to-transparent",
          "transition-opacity duration-200",
          showBottomFade ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
