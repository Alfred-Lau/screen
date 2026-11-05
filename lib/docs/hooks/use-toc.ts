"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { TOCItem } from "../types";

interface UseTOCOptions {
  content: string;
  scrollOffset?: number;
}

interface UseTOCReturn {
  items: TOCItem[];
  activeId: string;
  scrollToHeading: (id: string) => void;
}

function parseTocItems(content: string): TOCItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const tocItems: TOCItem[] = [];
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

    tocItems.push({ id, text, level });
  }

  return tocItems;
}

export function useTOC({ content, scrollOffset = 100 }: UseTOCOptions): UseTOCReturn {
  const items = useMemo(() => parseTocItems(content), [content]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const headings = items
        .map((item) => ({
          id: item.id,
          element: document.getElementById(item.id),
        }))
        .filter((h) => h.element);

      const scrollY = window.scrollY + scrollOffset;

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
  }, [items, scrollOffset]);

  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  return { items, activeId, scrollToHeading };
}
