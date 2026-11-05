"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export type TestimonialVariant = "compact" | "full";

interface TestimonialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating?: number;
  variant?: TestimonialVariant;
  featured?: boolean;
}

export function TestimonialCard({
  quote,
  author,
  role,
  company,
  avatar,
  rating,
  variant = "full",
  featured = false,
  className,
  ...props
}: TestimonialCardProps) {
  const initials = author
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 flex flex-col gap-4",
        "transition-shadow duration-200 hover:shadow-md",
        featured && "border-primary/30 bg-primary/5",
        variant === "compact" && "p-4 gap-3",
        className
      )}
      {...props}
    >
      {/* Rating */}
      {rating !== undefined && (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "size-4",
                i < rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
              )}
            />
          ))}
        </div>
      )}

      {/* Quote */}
      <blockquote className={cn("text-foreground leading-relaxed", variant === "compact" ? "text-sm" : "text-sm")}>
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 mt-auto">
        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-primary/10 flex items-center justify-center">
          {avatar ? (
            <img src={avatar} alt={author} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-semibold text-primary">{initials}</span>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground leading-tight">{author}</p>
          {(role || company) && (
            <p className="text-xs text-muted-foreground leading-tight">
              {[role, company].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
