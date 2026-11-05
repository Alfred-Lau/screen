"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type FeatureCardVariant = "simple" | "bordered" | "gradient";

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  variant?: FeatureCardVariant;
  badge?: string;
  link?: { href: string; label: string };
}

export function FeatureCard({
  icon,
  title,
  description,
  variant = "simple",
  badge,
  link,
  className,
  ...props
}: FeatureCardProps) {
  const variantStyles: Record<FeatureCardVariant, string> = {
    simple: "bg-transparent",
    bordered: "bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow",
    gradient:
      "bg-gradient-to-br from-primary/5 via-accent/5 to-background border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-all",
  };

  return (
    <div className={cn(variantStyles[variant], variant === "simple" && "py-4", className)} {...props}>
      {badge && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3">
          {badge}
        </span>
      )}
      {icon && (
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      {link && (
        <a
          href={link.href}
          className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary hover:underline"
        >
          {link.label}
          <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      )}
    </div>
  );
}
