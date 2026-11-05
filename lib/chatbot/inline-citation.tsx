"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export interface Citation {
  id: string;
  title: string;
  url?: string;
  source?: string;
  snippet?: string;
}

export interface InlineCitationProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "onClick"> {
  citation: Citation;
  number?: number;
  onClick?: (citation: Citation) => void;
  showTooltip?: boolean;
}

export function InlineCitation({
  citation,
  number,
  className,
  onClick,
  showTooltip = true,
  ...props
}: InlineCitationProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (citation.url) {
      window.open(citation.url, "_blank", "noopener,noreferrer");
    }
    onClick?.(citation);
  };

  return (
    <span className="relative inline-block group" {...props}>
      <button
        onClick={handleClick}
        className={cn(
          "inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium rounded border",
          "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
          "border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30",
          "transition-colors cursor-pointer",
          className,
        )}
        title={citation.title}
      >
        {number && <span className="text-xs font-bold">{number}</span>}
        <ExternalLink size={10} />
      </button>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
            {citation.title}
          </div>
          {citation.source && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {citation.source}
            </div>
          )}
          {citation.snippet && (
            <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3">
              {citation.snippet}
            </div>
          )}
          {citation.url && (
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-2 truncate">
              {(() => {
                try {
                  return new URL(citation.url).hostname;
                } catch {
                  return citation.url;
                }
              })()}
            </div>
          )}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800" />
        </div>
      )}
    </span>
  );
}

export function parseInlineCitations(
  text: string,
  citations: Citation[],
): React.ReactNode[] {
  const citationPattern = /\[(\d+|[\w-]+)\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = citationPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const citationRef = match[1];
    let citation: Citation | undefined;

    if (/^\d+$/.test(citationRef)) {
      const index = parseInt(citationRef) - 1;
      citation = citations[index];
    } else {
      citation = citations.find((c) => c.id === citationRef);
    }

    if (citation) {
      parts.push(
        <InlineCitation
          key={`citation-${match.index}`}
          citation={citation}
          number={
            /^\d+$/.test(citationRef) ? parseInt(citationRef) : undefined
          }
        />,
      );
    } else {
      parts.push(match[0]);
    }

    lastIndex = citationPattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
