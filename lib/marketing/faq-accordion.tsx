"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Search } from "lucide-react";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
  category?: string;
}

interface FAQAccordionProps extends React.HTMLAttributes<HTMLElement> {
  headline?: string;
  subheadline?: string;
  description?: string;
  items: FAQItem[];
  searchable?: boolean;
  showCategories?: boolean;
  defaultOpen?: number;
}

export function FAQAccordion({
  headline = "Frequently asked questions",
  subheadline,
  description,
  items,
  searchable = true,
  showCategories = true,
  defaultOpen,
  className,
  ...props
}: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(defaultOpen ?? null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string>("all");

  const categories = React.useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
    return cats as string[];
  }, [items]);

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (typeof item.answer === "string" && item.answer.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        activeCategory === "all" || !item.category || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, activeCategory]);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={cn("w-full py-16", className)} {...props}>
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="text-center mb-10">
          {subheadline && (
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              {subheadline}
            </p>
          )}
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">{headline}</h2>
          {description && (
            <p className="mt-4 text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Search */}
        {searchable && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className={cn(
                "w-full pl-9 pr-4 py-2.5 rounded-xl border border-input bg-background",
                "text-sm placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              )}
            />
          </div>
        )}

        {/* Category tabs */}
        {showCategories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Accordion items */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No questions match your search.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredItems.map((item, i) => {
              const originalIndex = items.indexOf(item);
              const isOpen = openIndex === originalIndex;

              return (
                <div
                  key={originalIndex}
                  className={cn(
                    "rounded-xl border border-border overflow-hidden transition-all",
                    isOpen && "border-primary/30"
                  )}
                >
                  <button
                    onClick={() => toggle(originalIndex)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-accent/40 transition-colors"
                  >
                    <span className="text-sm font-semibold text-foreground">{item.question}</span>
                    <ChevronDown
                      className={cn(
                        "size-4 text-muted-foreground shrink-0 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3 animate-in slide-in-from-top-1 duration-150">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
