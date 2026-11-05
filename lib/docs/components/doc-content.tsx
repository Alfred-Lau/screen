"use client";

import { DocCodeHighlight } from "./code-highlight";
import type { DocContentProps } from "../types";

export function DocContent({
  title,
  description,
  children,
  className = "",
}: DocContentProps) {
  return (
    <DocCodeHighlight className={className}>
      <article className="prose dark:prose-invert max-w-none docs-content">
        <header className="mb-12 border-b border-gray-200 dark:border-gray-700 pb-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl">
              {description}
            </p>
          )}
        </header>
        <div className="prose-content text-gray-800 dark:text-gray-200">
          {children}
        </div>
      </article>
    </DocCodeHighlight>
  );
}
