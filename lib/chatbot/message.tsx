"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { User, Copy, RefreshCcw, ThumbsUp, ThumbsDown, Share2 } from "lucide-react";

// Message Component
interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  from: "user" | "assistant" | "system";
  children: React.ReactNode;
  avatar?: React.ReactNode;
  timestamp?: string | Date;
}

export function Message({
  from,
  children,
  avatar,
  timestamp,
  className,
  ...props
}: MessageProps) {
  const isUser = from === "user";

  // Timestamps depend on the viewer's time zone and locale, so render them only
  // after mount. Otherwise the server HTML and the client HTML disagree and
  // React throws a hydration mismatch.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const formatTime = (time: string | Date | undefined) => {
    if (!time) return "";
    try {
      const date = typeof time === "string" ? new Date(time) : time;
      return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);
    } catch {
      return "";
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 w-full",
        isUser ? "justify-end" : "justify-start",
        className
      )}
      {...props}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          {avatar || (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 ring-gray-200 dark:ring-gray-700 bg-gradient-to-br from-blue-500 to-purple-600">
              <svg
                height="14"
                strokeLinejoin="round"
                viewBox="0 0 16 16"
                width="14"
                className="text-white"
              >
                <path
                  d="M2.5 0.5V0H3.5V0.5C3.5 1.60457 4.39543 2.5 5.5 2.5H6V3V3.5H5.5C4.39543 3.5 3.5 4.39543 3.5 5.5V6H3H2.5V5.5C2.5 4.39543 1.60457 3.5 0.5 3.5H0V3V2.5H0.5C1.60457 2.5 2.5 1.60457 2.5 0.5Z"
                  fill="currentColor"
                />
                <path
                  d="M14.5 4.5V5H13.5V4.5C13.5 3.94772 13.0523 3.5 12.5 3.5H12V3V2.5H12.5C13.0523 2.5 13.5 2.05228 13.5 1.5V1H14H14.5V1.5C14.5 2.05228 14.9477 2.5 15.5 2.5H16V3V3.5H15.5C14.9477 3.5 14.5 3.94772 14.5 4.5Z"
                  fill="currentColor"
                />
                <path
                  d="M8.40706 4.92939L8.5 4H9.5L9.59294 4.92939C9.82973 7.29734 11.7027 9.17027 14.0706 9.40706L15 9.5V10.5L14.0706 10.5929C11.7027 10.8297 9.82973 12.7027 9.59294 15.0706L9.5 16H8.5L8.40706 15.0706C8.17027 12.7027 6.29734 10.8297 3.92939 10.5929L3 10.5V9.5L3.92939 9.40706C6.29734 9.17027 8.17027 7.29734 8.40706 4.92939Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          "flex flex-col max-w-[calc(100%-3rem)]",
          isUser ? "items-end" : "items-start"
        )}
      >
        {timestamp && mounted && (
          <span className="text-[10px] text-gray-500 dark:text-gray-400 mb-1 px-1">
            {formatTime(timestamp)}
          </span>
        )}
        {children}
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          {avatar || (
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300">
              <User size={16} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Message Content
interface MessageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "user" | "assistant";
}

export function MessageContent({
  children,
  variant = "assistant",
  className,
  ...props
}: MessageContentProps) {
  const isUser = variant === "user";

  return (
    <div
      className={cn(
        "text-sm break-words leading-relaxed",
        isUser
          ? "px-3 py-2 rounded-2xl rounded-br-md bg-blue-600 text-white"
          : "px-3 py-2 text-gray-800 dark:text-gray-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Message Response (for assistant messages)
interface MessageResponseProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function MessageResponse({ children, className, ...props }: MessageResponseProps) {
  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none",
        "prose-p:my-1 prose-p:leading-relaxed",
        "prose-headings:mt-3 prose-headings:mb-2",
        "prose-ul:my-2 prose-li:my-0.5",
        "prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:bg-gray-100 dark:prose-code:bg-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Message Actions
interface MessageActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function MessageActions({ children, className, ...props }: MessageActionsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Message Action Button
interface MessageActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  label?: string;
  active?: boolean;
}

export function MessageAction({
  children,
  label,
  active,
  className,
  ...props
}: MessageActionProps) {
  return (
    <button
      className={cn(
        "p-1.5 rounded-md transition-colors",
        "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        active && "text-blue-500 dark:text-blue-400",
        className
      )}
      title={label}
      {...props}
    >
      {children}
    </button>
  );
}

// Pre-built action buttons
export function MessageActionCopy({ onClick, className }: { onClick?: () => void; className?: string }) {
  return (
    <MessageAction label="Copy" onClick={onClick} className={className}>
      <Copy size={14} />
    </MessageAction>
  );
}

export function MessageActionRegenerate({ onClick, className }: { onClick?: () => void; className?: string }) {
  return (
    <MessageAction label="Regenerate" onClick={onClick} className={className}>
      <RefreshCcw size={14} />
    </MessageAction>
  );
}

export function MessageActionLike({ onClick, active, className }: { onClick?: () => void; active?: boolean; className?: string }) {
  return (
    <MessageAction label="Like" onClick={onClick} active={active} className={className}>
      <ThumbsUp size={14} />
    </MessageAction>
  );
}

export function MessageActionDislike({ onClick, active, className }: { onClick?: () => void; active?: boolean; className?: string }) {
  return (
    <MessageAction label="Dislike" onClick={onClick} active={active} className={className}>
      <ThumbsDown size={14} />
    </MessageAction>
  );
}

export function MessageActionShare({ onClick, className }: { onClick?: () => void; className?: string }) {
  return (
    <MessageAction label="Share" onClick={onClick} className={className}>
      <Share2 size={14} />
    </MessageAction>
  );
}
