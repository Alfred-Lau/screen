"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Code,
  FileCode,
} from "lucide-react";

// CodeBlock Component
interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  filename?: string;
  title?: string;
  showLineNumbers?: boolean;
  maxHeight?: number;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  allowCopy?: boolean;
  allowDownload?: boolean;
  highlightLines?: number[];
}

export function CodeBlock({
  code,
  language = "text",
  filename,
  title,
  showLineNumbers = false,
  maxHeight = 400,
  collapsible = false,
  defaultCollapsed = false,
  allowCopy = true,
  allowDownload = false,
  highlightLines = [],
  className,
  children,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || `code.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const lines = code.split("\n");
  const displayTitle = title || filename || language;

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 dark:border-gray-700",
        "bg-gray-950 dark:bg-gray-900",
        "overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 dark:bg-gray-800 border-b border-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <FileCode className="size-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">
            {displayTitle}
          </span>
          {language && language !== displayTitle && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-gray-800 dark:bg-gray-700 text-gray-400">
              {language}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-md hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              {isCollapsed ? (
                <ChevronDown className="size-4 text-gray-400" />
              ) : (
                <ChevronUp className="size-4 text-gray-400" />
              )}
            </button>
          )}
          {allowDownload && (
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-md hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              title="Download"
            >
              <Download className="size-4 text-gray-400" />
            </button>
          )}
          {allowCopy && (
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              title="Copy"
            >
              {copied ? (
                <Check className="size-4 text-green-400" />
              ) : (
                <Copy className="size-4 text-gray-400" />
              )}
            </button>
          )}
          {children}
        </div>
      </div>

      {/* Code Content */}
      {!isCollapsed && (
        <div
          className="overflow-auto"
          style={{ maxHeight: maxHeight ? `${maxHeight}px` : undefined }}
        >
          <pre className="p-4 text-sm leading-relaxed">
            <code className="font-mono">
              {showLineNumbers ? (
                <table className="w-full border-collapse">
                  <tbody>
                    {lines.map((line, index) => {
                      const lineNumber = index + 1;
                      const isHighlighted = highlightLines.includes(lineNumber);
                      return (
                        <tr
                          key={index}
                          className={cn(
                            isHighlighted && "bg-yellow-500/10"
                          )}
                        >
                          <td className="pr-4 text-right text-gray-500 dark:text-gray-600 select-none w-[1%] whitespace-nowrap">
                            {lineNumber}
                          </td>
                          <td className="text-gray-200 dark:text-gray-300 whitespace-pre">
                            {line || " "}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <span className="text-gray-200 dark:text-gray-300 whitespace-pre-wrap break-words">
                  {code}
                </span>
              )}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}

// InlineCode Component
interface InlineCodeProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function InlineCode({
  children,
  className,
  ...props
}: InlineCodeProps) {
  return (
    <code
      className={cn(
        "px-1.5 py-0.5 rounded text-sm font-mono",
        "bg-gray-100 dark:bg-gray-800",
        "text-pink-600 dark:text-pink-400",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}

// CodeBlockCopyButton (for use as child)
interface CodeBlockCopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  code?: string;
}

export function CodeBlockCopyButton({
  code,
  className,
  ...props
}: CodeBlockCopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "p-1.5 rounded-md hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors",
        className
      )}
      title="Copy code"
      {...props}
    >
      {copied ? (
        <Check className="size-4 text-green-400" />
      ) : (
        <Copy className="size-4 text-gray-400" />
      )}
    </button>
  );
}
