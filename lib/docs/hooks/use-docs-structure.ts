"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import type { DocItem } from "../types";
import { DEFAULT_DOCS_API_ENDPOINT, DEFAULT_NAV_ITEMS } from "../constants";

interface UseDocsStructureOptions {
  apiEndpoint?: string;
  fallbackItems?: DocItem[];
}

interface UseDocsStructureReturn {
  items: DocItem[];
  isLoading: boolean;
  error: Error | null;
}

export function useDocsStructure(
  options: UseDocsStructureOptions = {}
): UseDocsStructureReturn {
  const {
    apiEndpoint = DEFAULT_DOCS_API_ENDPOINT,
    fallbackItems = DEFAULT_NAV_ITEMS,
  } = options;

  const locale = useLocale();
  const [items, setItems] = useState<DocItem[]>(fallbackItems);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadDocsStructure() {
      try {
        const response = await fetch(`${apiEndpoint}?locale=${encodeURIComponent(locale)}`);
        if (response.ok) {
          const data = await response.json();
          setItems(data.items || fallbackItems);
        } else {
          setItems(fallbackItems);
        }
      } catch (err) {
        console.error("Failed to load docs structure:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setItems(fallbackItems);
      } finally {
        setIsLoading(false);
      }
    }

    loadDocsStructure();
  }, [locale, apiEndpoint, fallbackItems]);

  return { items, isLoading, error };
}
