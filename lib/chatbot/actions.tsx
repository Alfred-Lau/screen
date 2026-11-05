"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  RefreshCcw,
  Square,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Check,
} from "lucide-react";

export interface ActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
  onStop?: () => void;
  onReload?: () => void;
  onCopy?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onShare?: () => void;
  showLikeDislike?: boolean;
  showCopy?: boolean;
  showShare?: boolean;
  messageContent?: string;
  labels?: {
    stop?: string;
    reload?: string;
    copy?: string;
    copied?: string;
    like?: string;
    dislike?: string;
    share?: string;
  };
}

export function Actions({
  isLoading = false,
  onStop,
  onReload,
  onCopy,
  onLike,
  onDislike,
  onShare,
  showLikeDislike = true,
  showCopy = true,
  showShare = true,
  className,
  messageContent,
  labels = {},
  ...props
}: ActionsProps) {
  const [copied, setCopied] = React.useState(false);
  const [liked, setLiked] = React.useState<boolean | null>(null);

  const {
    stop: stopLabel = "Stop",
    reload: reloadLabel = "Reload",
    copy: copyLabel = "Copy",
    copied: copiedLabel = "Copied",
    like: likeLabel = "Like",
    dislike: dislikeLabel = "Dislike",
    share: shareLabel = "Share",
  } = labels;

  const handleCopy = async () => {
    try {
      if (messageContent) {
        await navigator.clipboard.writeText(messageContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        onCopy?.();
      }
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleLike = () => {
    setLiked(liked === true ? null : true);
    onLike?.();
  };

  const handleDislike = () => {
    setLiked(liked === false ? null : false);
    onDislike?.();
  };

  const handleShare = async () => {
    try {
      if (messageContent && navigator.share) {
        await navigator.share({
          text: messageContent,
          title: "AI Response",
        });
      } else if (messageContent) {
        await navigator.clipboard.writeText(messageContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      onShare?.();
    } catch (error) {
      console.error("Failed to share:", error);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 transition-opacity duration-200",
        isLoading ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        className,
      )}
      {...props}
    >
      {isLoading && onStop ? (
        <button
          onClick={onStop}
          className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={stopLabel}
          title={stopLabel}
        >
          <Square size={14} />
        </button>
      ) : (
        onReload && (
          <button
            onClick={onReload}
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={reloadLabel}
            title={reloadLabel}
          >
            <RefreshCcw size={14} />
          </button>
        )
      )}

      {showCopy && messageContent && (
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={copied ? copiedLabel : copyLabel}
          title={copied ? copiedLabel : copyLabel}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      )}

      {showLikeDislike && (
        <>
          <button
            onClick={handleLike}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              liked === true
                ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
            )}
            aria-label={likeLabel}
            title={likeLabel}
          >
            <ThumbsUp size={14} />
          </button>
          <button
            onClick={handleDislike}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              liked === false
                ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
            )}
            aria-label={dislikeLabel}
            title={dislikeLabel}
          >
            <ThumbsDown size={14} />
          </button>
        </>
      )}

      {showShare && messageContent && (
        <button
          onClick={handleShare}
          className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={shareLabel}
          title={shareLabel}
        >
          <Share2 size={14} />
        </button>
      )}
    </div>
  );
}
