"use client";

import { useEffect, useState, useMemo } from "react";
import type { TOCItem, DocTableOfContentsProps } from "../types";

function parseTocItems(content: string): TOCItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const items: TOCItem[] = [];
  const idCounts: Record<string, number> = {};
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const baseId = text
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "");

    let id = baseId;
    if (idCounts[baseId]) {
      idCounts[baseId]++;
      id = `${baseId}-${idCounts[baseId]}`;
    } else {
      idCounts[baseId] = 1;
    }

    items.push({ id, text, level });
  }

  return items;
}

export function DocTableOfContents({
  content,
  className = "",
  title = "On this page",
}: DocTableOfContentsProps) {
  const tocItems = useMemo(() => parseTocItems(content), [content]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const headings = tocItems
        .map((item) => ({
          id: item.id,
          element: document.getElementById(item.id),
        }))
        .filter((h) => h.element);

      const scrollY = window.scrollY + 100;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading.element && heading.element.offsetTop <= scrollY) {
          setActiveId(heading.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocItems]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (tocItems.length === 0) return null;

  return (
    <nav className={`sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar pb-10 ${className}`}>
      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 text-sm">
        {title}
      </h3>
      <ul className="space-y-2 text-sm border-l border-slate-200 dark:border-slate-800 pl-1">
        {tocItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => scrollToHeading(item.id)}
              className={`
                block w-full text-left py-1 px-3 -ml-[1px] border-l-2 transition-colors duration-200
                ${
                  activeId === item.id
                    ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-medium"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }
                ${item.level > 2 ? "ml-3" : ""}
              `}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
