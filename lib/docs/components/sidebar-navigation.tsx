"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import type { DocItem, DocSidebarNavigationProps } from "../types";
import { DEFAULT_DOCS_BASE_PATH } from "../constants";

interface NavigationItemProps {
  item: DocItem;
  level?: number;
  onToggle?: (item: DocItem) => void;
  expandedItems: Set<string>;
  basePath: string;
}

function NavigationItem({
  item,
  level = 0,
  onToggle,
  expandedItems,
  basePath,
}: NavigationItemProps) {
  const pathname = usePathname();

  const hasChildren = item.children && item.children.length > 0;
  const isDirectory = item.isDirectory;
  const isFile = item.isFile;
  const isExpanded = expandedItems.has(item.href);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasChildren) {
      onToggle?.(item);
    }
  };

  const getItemHref = () => `${basePath}/${item.href}`;

  const isCurrentActive = () => {
    const itemHref = getItemHref();
    if (pathname === itemHref) return true;
    if (pathname.startsWith(itemHref + "/")) return true;
    return false;
  };

  const isActive = isCurrentActive();

  return (
    <div className="w-full relative">
      {level > 0 && (
        <div
          className="absolute top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800"
          style={{ left: `${(level - 1) * 12 + 12}px` }}
        />
      )}

      <div
        className={`
          flex items-center gap-2 py-1.5 pr-3 rounded-md transition-colors duration-200 text-sm
          cursor-pointer group select-none relative
          ${
            isActive
              ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
          }
        `}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
        onClick={hasChildren ? handleToggle : undefined}
      >
        {hasChildren && (
          <div className="flex-shrink-0 w-4 h-4">
            {isExpanded ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : (
              <ChevronRightIcon className="w-4 h-4" />
            )}
          </div>
        )}

        {!hasChildren && (
          <div className="flex-shrink-0 w-4 h-4">
            {isDirectory ? (
              <FolderIcon className="w-4 h-4" />
            ) : isFile ? (
              <DocumentIcon className="w-4 h-4" />
            ) : (
              <span className="text-sm">{item.icon || "📄"}</span>
            )}
          </div>
        )}

        {isFile ? (
          <Link
            href={getItemHref()}
            className="flex-1 min-w-0 truncate font-medium hover:text-blue-600 dark:hover:text-blue-400"
            onClick={(e) => e.stopPropagation()}
          >
            {item.title}
          </Link>
        ) : (
          <span className="flex-1 min-w-0 truncate font-medium">
            {item.title}
          </span>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-1 relative">
          {item.children!.map((child) => (
            <NavigationItem
              key={child.href}
              item={child}
              level={level + 1}
              onToggle={onToggle}
              expandedItems={expandedItems}
              basePath={basePath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function DocSidebarNavigation({
  items,
  className = "",
  basePath,
}: DocSidebarNavigationProps) {
  const locale = useLocale();
  const pathname = usePathname();

  const resolvedBasePath = basePath || `/${locale}${DEFAULT_DOCS_BASE_PATH}`;

  const initialExpanded = useMemo(() => {
    const result = new Set<string>();

    function findAndExpandPath(navItems: DocItem[], targetPath: string) {
      for (const navItem of navItems) {
        if (navItem.children) {
          const hasTarget = navItem.children.some(
            (child) =>
              child.href === targetPath ||
              (child.children && findAndExpandPath(child.children, targetPath)),
          );

          if (hasTarget) {
            result.add(navItem.href);
            findAndExpandPath(navItem.children, targetPath);
            break;
          }
        }
      }
    }

    const pathSegments = pathname.split("/");
    const slug = pathSegments[pathSegments.length - 1];

    if (slug && slug !== "docs") {
      const fullPath = pathSegments
        .slice(pathSegments.indexOf("docs") + 1)
        .join("/");
      if (fullPath) {
        findAndExpandPath(items, fullPath);
      }
    }

    return result;
  }, [items, pathname]);

  const [expandedItems, setExpandedItems] = useState<Set<string>>(initialExpanded);

  useEffect(() => {
    setExpandedItems(initialExpanded);
  }, [initialExpanded]);

  const handleToggle = (item: DocItem) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(item.href)) {
      newExpandedItems.delete(item.href);
    } else {
      newExpandedItems.add(item.href);
    }
    setExpandedItems(newExpandedItems);
  };

  return (
    <nav className={`space-y-1 ${className}`}>
      {items.map((item) => (
        <NavigationItem
          key={item.href}
          item={item}
          onToggle={handleToggle}
          expandedItems={expandedItems}
          basePath={resolvedBasePath}
        />
      ))}
    </nav>
  );
}
