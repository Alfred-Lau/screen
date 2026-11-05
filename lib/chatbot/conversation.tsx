"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

// Conversation Context
interface ConversationContextValue {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  setScrollContainer: (node: HTMLDivElement | null) => void;
  scrollToBottom: () => void;
  showScrollButton: boolean;
  setShowScrollButton: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConversationContext = React.createContext<ConversationContextValue | null>(null);

export function useConversation() {
  const context = React.useContext(ConversationContext);
  if (!context) {
    throw new Error("useConversation must be used within a Conversation");
  }
  return context;
}

// Conversation Root
interface ConversationProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Conversation({ children, className, ...props }: ConversationProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = React.useState(false);
  const setScrollContainer = React.useCallback((node: HTMLDivElement | null) => {
    scrollContainerRef.current = node;
  }, []);

  const scrollToBottom = React.useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <ConversationContext.Provider
      value={{
        scrollContainerRef,
        setScrollContainer,
        scrollToBottom,
        showScrollButton,
        setShowScrollButton,
      }}
    >
      <div
        className={cn("relative flex flex-col h-full w-full", className)}
        {...props}
      >
        {children}
      </div>
    </ConversationContext.Provider>
  );
}

// Conversation Content
interface ConversationContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ConversationContent = React.forwardRef<HTMLDivElement, ConversationContentProps>(
  ({ children, className, ...props }, ref) => {
    const context = React.useContext(ConversationContext);
    const internalRef = React.useRef<HTMLDivElement>(null);
    
    // Use forwarded ref or internal ref
    const containerRef = (ref as React.RefObject<HTMLDivElement | null>) || internalRef;

    React.useEffect(() => {
      const container = containerRef.current;
      if (!container || !context) return;
      context.setScrollContainer(container);

      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        context.setShowScrollButton(distanceFromBottom > 120);
      };

      container.addEventListener("scroll", handleScroll);
      handleScroll();

      return () => container.removeEventListener("scroll", handleScroll);
    }, [containerRef, context]);

    return (
      <div
        ref={ref || internalRef}
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-4",
          "scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ConversationContent.displayName = "ConversationContent";

// Conversation Scroll Button
interface ConversationScrollButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function ConversationScrollButton({ 
  children, 
  className, 
  ...props 
}: ConversationScrollButtonProps) {
  const { scrollToBottom, showScrollButton } = useConversation();

  if (!showScrollButton) return null;

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
      <button
        onClick={scrollToBottom}
        className={cn(
          "flex items-center justify-center w-10 h-10",
          "bg-white/90 dark:bg-gray-800/90",
          "hover:bg-gray-100 dark:hover:bg-gray-700",
          "text-gray-600 dark:text-gray-300",
          "rounded-full shadow-lg hover:shadow-xl",
          "transition-all duration-200 transform hover:scale-105",
          "backdrop-blur-sm border border-gray-200 dark:border-gray-700",
          className
        )}
        {...props}
      >
        {children || <ChevronDown size={16} />}
      </button>
    </div>
  );
}
