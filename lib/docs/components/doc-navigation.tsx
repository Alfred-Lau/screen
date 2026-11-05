"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import type { DocNavigationProps, DocItem } from "../types";
import { DEFAULT_DOCS_BASE_PATH } from "../constants";

function flattenItems(items: DocItem[], parentPath = ""): DocItem[] {
  const result: DocItem[] = [];
  for (const item of items) {
    const fullPath = parentPath ? `${parentPath}/${item.href}` : item.href;
    if (item.isFile) {
      result.push({ ...item, href: fullPath });
    }
    if (item.children) {
      result.push(...flattenItems(item.children, fullPath));
    }
  }
  return result;
}

export function DocNavigation({
  currentSlug,
  className = "",
  items,
  basePath,
  labels,
}: DocNavigationProps) {
  const locale = useLocale();
  const resolvedBasePath = basePath || `/${locale}${DEFAULT_DOCS_BASE_PATH}`;

  if (!items || items.length === 0) return null;

  const flatItems = flattenItems(items);
  const currentIndex = flatItems.findIndex((item) => item.href === currentSlug);

  if (currentIndex === -1) return null;

  const prevDoc = currentIndex > 0 ? flatItems[currentIndex - 1] : null;
  const nextDoc =
    currentIndex < flatItems.length - 1 ? flatItems[currentIndex + 1] : null;

  if (!prevDoc && !nextDoc) return null;

  return (
    <nav className={`flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-8 mt-12 ${className}`}>
      <div className="flex-1">
        {prevDoc && (
          <Link
            href={`${resolvedBasePath}/${prevDoc.href}`}
            className="group flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                {labels?.prev || "Previous"}
              </div>
              <div className="text-gray-900 dark:text-gray-100">
                {prevDoc.title}
              </div>
            </div>
          </Link>
        )}
      </div>

      <div className="flex-1 text-right">
        {nextDoc && (
          <Link
            href={`${resolvedBasePath}/${nextDoc.href}`}
            className="group flex items-center justify-end text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <div className="text-right">
              <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                {labels?.next || "Next"}
              </div>
              <div className="text-gray-900 dark:text-gray-100">
                {nextDoc.title}
              </div>
            </div>
            <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </nav>
  );
}
