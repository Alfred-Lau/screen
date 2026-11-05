"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { MagnifyingGlassIcon, DocumentIcon } from "@heroicons/react/24/outline";
import type { DocItem, DocSearchProps } from "../types";
import { DEFAULT_DOCS_API_ENDPOINT, DEFAULT_DOCS_BASE_PATH } from "../constants";

function flattenDocs(
  items: DocItem[],
  parentPath = "",
  seenPaths: Set<string> = new Set()
): DocItem[] {
  let flattened: DocItem[] = [];

  items.forEach((item) => {
    const fullPath = parentPath ? `${parentPath}/${item.href}` : item.href;
    if (item.children && item.children.length > 0) {
      flattened = flattened.concat(
        flattenDocs(item.children, fullPath, seenPaths)
      );
    } else {
      if (!seenPaths.has(fullPath)) {
        seenPaths.add(fullPath);
        flattened.push({ ...item, href: fullPath });
      }
    }
  });
  return flattened;
}

const defaultLabels = {
  buttonText: "Search docs...",
  placeholder: "Search documentation...",
  dialogTitle: "Search Documentation",
  noResults: "No results found.",
  groupHeading: "Documentation",
};

export function DocSearch({
  className = "",
  structureApiEndpoint = DEFAULT_DOCS_API_ENDPOINT,
  basePath,
  labels,
}: DocSearchProps) {
  const [open, setOpen] = useState(false);
  const [docs, setDocs] = useState<DocItem[]>([]);
  const router = useRouter();
  const locale = useLocale();

  const resolvedLabels = { ...defaultLabels, ...labels };
  const resolvedBasePath = basePath || `/${locale}${DEFAULT_DOCS_BASE_PATH}`;

  useEffect(() => {
    async function fetchDocs() {
      try {
        const response = await fetch(`${structureApiEndpoint}?locale=${encodeURIComponent(locale)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.items) {
            setDocs(flattenDocs(data.items));
          }
        }
      } catch (error) {
        console.error("Failed to fetch docs for search:", error);
      }
    }
    fetchDocs();
  }, [locale, structureApiEndpoint]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  const handleSelect = (href: string) => {
    runCommand(() => router.push(`${resolvedBasePath}/${href}`));
  };

  return (
    <div className={className}>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
      >
        <MagnifyingGlassIcon className="w-4 h-4" />
        <span className="flex-1 text-left">{resolvedLabels.buttonText}</span>
        <kbd className="inline-flex items-center px-2 py-1 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
          ⌘K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={resolvedLabels.placeholder} />
        <DialogTitle className="sr-only">{resolvedLabels.dialogTitle}</DialogTitle>
        <CommandList>
          <CommandEmpty>{resolvedLabels.noResults}</CommandEmpty>
          <CommandGroup heading={resolvedLabels.groupHeading} className="py-2">
            {docs.map((doc, index) => (
              <CommandItem
                key={`${index}-${doc.href}`}
                value={doc.title}
                onSelect={() => handleSelect(doc.href)}
                className="cursor-pointer"
              >
                <DocumentIcon className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>{doc.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
