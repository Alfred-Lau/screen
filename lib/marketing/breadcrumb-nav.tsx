"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbNavProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  showHome?: boolean;
  homeHref?: string;
}

export function BreadcrumbNav({
  items,
  separator,
  maxItems,
  showHome = false,
  homeHref = "/",
  className,
  ...props
}: BreadcrumbNavProps) {
  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: "Home", href: homeHref, icon: <Home className="size-3.5" /> }, ...items]
    : items;

  let displayItems = allItems;
  if (maxItems && allItems.length > maxItems) {
    const front = allItems.slice(0, 1);
    const back = allItems.slice(allItems.length - (maxItems - 2));
    displayItems = [...front, { label: "...", href: undefined }, ...back];
  }

  const defaultSeparator = separator ?? <ChevronRight className="size-3.5 text-muted-foreground/60 shrink-0" />;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center", className)}
      {...props}
    >
      <ol className="flex flex-wrap items-center gap-1">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === "...";

          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && defaultSeparator}
              {isEllipsis ? (
                <span className="text-sm text-muted-foreground px-0.5">•••</span>
              ) : isLast ? (
                <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  {item.icon}
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  href={item.href}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.icon}
                  {item.label}
                </a>
              ) : (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  {item.icon}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
