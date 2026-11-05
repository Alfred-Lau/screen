"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { DocSidebarNavigation } from "./sidebar-navigation";
import { DocReadingProgress } from "./reading-progress";
import { DocSearch } from "./doc-search";
import type { DocItem, DocLayoutProps } from "../types";
import { DEFAULT_NAV_ITEMS, DEFAULT_DOCS_API_ENDPOINT } from "../constants";

export function DocLayout({
  children,
  navItems = DEFAULT_NAV_ITEMS,
  className = "",
  header,
  footer,
  searchComponent,
  structureApiEndpoint = DEFAULT_DOCS_API_ENDPOINT,
  mobileLabels,
}: DocLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentNavItems, setCurrentNavItems] = useState<DocItem[]>(navItems);
  const [isLoading, setIsLoading] = useState(true);
  const locale = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    async function loadDocsStructure() {
      try {
        const response = await fetch(`${structureApiEndpoint}?locale=${encodeURIComponent(locale)}`);
        if (response.ok) {
          const data = await response.json();
          setCurrentNavItems(data.items || navItems);
        } else {
          setCurrentNavItems(navItems);
        }
      } catch (error) {
        console.error("Failed to load docs structure:", error);
        setCurrentNavItems(navItems);
      } finally {
        setIsLoading(false);
      }
    }

    loadDocsStructure();
  }, [locale, navItems, structureApiEndpoint]);

  const mobileSidebarTitle = mobileLabels?.title || "Documentation";
  const mobileToggleLabel = mobileLabels?.toggle || "Documentation";

  return (
    <div className={`bg-white dark:bg-black min-h-screen ${className}`}>
      <DocReadingProgress />

      {/* Header slot */}
      {header && (
        <div className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-black/95 supports-backdrop-filter:bg-white/60">
          <div className="w-full mx-auto px-4 lg:px-8">
            {header}
          </div>
        </div>
      )}

      <div className="flex items-start">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`
            fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white pb-10 pt-20 dark:border-slate-800 dark:bg-black transition-transform duration-300 ease-in-out overflow-y-auto
            lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] lg:transform-none lg:pt-8 lg:pb-10 lg:z-30 lg:w-64
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
            overflow-y-hidden no-scrollbar scrollbar-hide
          `}
        >
          <div className="px-5">
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {mobileSidebarTitle}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              {searchComponent || <DocSearch />}
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <DocSidebarNavigation items={currentNavItems} />
            )}
          </div>
        </aside>

        <main className="flex-1 min-w-0 lg:pl-64">
          <div className="lg:hidden bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800 px-4 py-3 sticky top-[73px] z-20">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <Bars3Icon className="w-5 h-5" />
              <span className="font-medium">{mobileToggleLabel}</span>
            </button>
          </div>

          <div className="mx-auto max-w-7xl">
            <div className="px-6 py-10 lg:px-16 lg:py-12">{children}</div>
          </div>
        </main>
      </div>

      {/* Footer slot */}
      {footer && (
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12">
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
}
