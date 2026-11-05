"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ExternalLink, Globe, Image as ImageIcon } from "lucide-react";

// WebPreview Component
interface WebPreviewProps extends React.HTMLAttributes<HTMLAnchorElement> {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
}

export function WebPreview({
  url,
  title,
  description,
  image,
  siteName,
  favicon,
  className,
  ...props
}: WebPreviewProps) {
  const [imageError, setImageError] = React.useState(false);

  // Extract domain from URL
  let domain = "";
  try {
    domain = new URL(url).hostname;
  } catch {
    domain = url;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "block rounded-xl border border-gray-200 dark:border-gray-700",
        "bg-white dark:bg-gray-900/50",
        "overflow-hidden",
        "hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700",
        "transition-all duration-200",
        "group",
        className
      )}
      {...props}
    >
      {/* Image Preview */}
      {image && !imageError && (
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <img
            src={image}
            alt={title || "Preview"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Site Info */}
        <div className="flex items-center gap-2 mb-2">
          {favicon ? (
            <img
              src={favicon}
              alt=""
              className="w-4 h-4 rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <Globe className="size-4 text-gray-400" />
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {siteName || domain}
          </span>
        </div>

        {/* Title */}
        {title && (
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {description}
          </p>
        )}

        {/* URL with external link icon */}
        <div className="flex items-center gap-1 mt-3 text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
          <span className="truncate">{url}</span>
          <ExternalLink className="size-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </a>
  );
}

// Compact WebPreview
interface WebPreviewCompactProps extends React.HTMLAttributes<HTMLAnchorElement> {
  url: string;
  title?: string;
  favicon?: string;
}

export function WebPreviewCompact({
  url,
  title,
  favicon,
  className,
  ...props
}: WebPreviewCompactProps) {
  let domain = "";
  try {
    domain = new URL(url).hostname;
  } catch {
    domain = url;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 px-3 py-2 rounded-lg",
        "bg-gray-50 dark:bg-gray-800/50",
        "border border-gray-200 dark:border-gray-700",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "hover:border-blue-300 dark:hover:border-blue-700",
        "transition-all duration-200",
        "group",
        className
      )}
      {...props}
    >
      {favicon ? (
        <img
          src={favicon}
          alt=""
          className="w-4 h-4 rounded shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <Globe className="size-4 text-gray-400 shrink-0" />
      )}
      <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px] group-hover:text-blue-600 dark:group-hover:text-blue-400">
        {title || domain}
      </span>
      <ExternalLink className="size-3 text-gray-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}

// WebPreviewGrid
interface WebPreviewGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
}

export function WebPreviewGrid({
  children,
  columns = 2,
  className,
  ...props
}: WebPreviewGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)} {...props}>
      {children}
    </div>
  );
}
