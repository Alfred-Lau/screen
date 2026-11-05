"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TestimonialCard } from "./testimonial-card";

interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating?: number;
  featured?: boolean;
}

interface TestimonialGridProps extends React.HTMLAttributes<HTMLElement> {
  headline?: string;
  subheadline?: string;
  description?: string;
  testimonials: Testimonial[];
  layout?: "grid" | "masonry";
  columns?: 2 | 3;
}

export function TestimonialGrid({
  headline,
  subheadline,
  description,
  testimonials,
  layout = "grid",
  columns = 3,
  className,
  ...props
}: TestimonialGridProps) {
  return (
    <section className={cn("w-full py-16", className)} {...props}>
      <div className="mx-auto max-w-5xl px-6">
        {(headline || description) && (
          <div className="text-center mb-12">
            {subheadline && (
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                {subheadline}
              </p>
            )}
            {headline && (
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">{headline}</h2>
            )}
            {description && (
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">{description}</p>
            )}
          </div>
        )}

        {layout === "masonry" ? (
          <div className={cn(
            "columns-1 gap-6",
            columns === 2 ? "sm:columns-2" : "sm:columns-2 lg:columns-3"
          )}>
            {testimonials.map((t, i) => (
              <div key={i} className="break-inside-avoid mb-6">
                <TestimonialCard
                  quote={t.quote}
                  author={t.author}
                  role={t.role}
                  company={t.company}
                  avatar={t.avatar}
                  rating={t.rating}
                  featured={t.featured}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={cn(
            "grid grid-cols-1 gap-6",
            columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
          )}>
            {testimonials.map((t, i) => (
              <TestimonialCard
                key={i}
                quote={t.quote}
                author={t.author}
                role={t.role}
                company={t.company}
                avatar={t.avatar}
                rating={t.rating}
                featured={t.featured}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
