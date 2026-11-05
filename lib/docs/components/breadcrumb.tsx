"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";
import type { DocBreadcrumbProps } from "../types";
import { DEFAULT_DOCS_BASE_PATH } from "../constants";

function formatSegmentName(slug: string): string {
  return slug
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim();
}

export function DocBreadcrumb({
  slug,
  title,
  className = "",
  basePath,
  getSegmentName,
  labels,
}: DocBreadcrumbProps) {
  const locale = useLocale();
  const resolvedBasePath = basePath || `/${locale}${DEFAULT_DOCS_BASE_PATH}`;

  const resolveSegmentName = (segment: string) => {
    if (getSegmentName) return getSegmentName(segment);
    return formatSegmentName(segment);
  };

  const pathSegments = slug.split("/");

  return (
    <nav className={`flex mb-6 ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            {labels?.home || "Home"}
          </Link>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <Link
              href={resolvedBasePath}
              className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-blue-500"
            >
              {labels?.docs || "Docs"}
            </Link>
          </div>
        </li>

        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const pathToSegment = pathSegments.slice(0, index + 1).join("/");

          return (
            <li key={segment} aria-current={isLast ? "page" : undefined}>
              <div className="flex items-center">
                <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                {isLast ? (
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                    {title || resolveSegmentName(segment)}
                  </span>
                ) : (
                  <Link
                    href={`${resolvedBasePath}/${pathToSegment}`}
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-blue-500"
                  >
                    {resolveSegmentName(segment)}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
