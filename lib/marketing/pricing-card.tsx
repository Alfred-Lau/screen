"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface PricingFeature {
  text: string;
  included?: boolean;
  highlight?: boolean;
}

interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  description?: string;
  price: string | number;
  period?: string;
  currency?: string;
  features: PricingFeature[];
  ctaLabel?: string;
  onCtaClick?: () => void;
  recommended?: boolean;
  badge?: string;
  footnote?: string;
  disabled?: boolean;
}

export function PricingCard({
  name,
  description,
  price,
  period = "/month",
  currency = "$",
  features,
  ctaLabel = "Get started",
  onCtaClick,
  recommended = false,
  badge,
  footnote,
  disabled = false,
  className,
  ...props
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-6 transition-all duration-200",
        recommended
          ? "border-primary bg-primary text-primary-foreground shadow-xl scale-105"
          : "border-border bg-card hover:shadow-md",
        className
      )}
      {...props}
    >
      {/* Badge */}
      {(badge ?? recommended) && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm",
              recommended
                ? "bg-background text-primary"
                : "bg-primary text-primary-foreground"
            )}
          >
            {badge ?? "Recommended"}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        <h3 className={cn("text-lg font-bold", recommended ? "text-primary-foreground" : "text-foreground")}>
          {name}
        </h3>
        {description && (
          <p className={cn("mt-1 text-sm", recommended ? "text-primary-foreground/80" : "text-muted-foreground")}>
            {description}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-end gap-1">
          {typeof price === "number" ? (
            <>
              <span className={cn("text-3xl font-bold", recommended ? "text-primary-foreground" : "text-foreground")}>
                {currency}{price}
              </span>
              <span className={cn("text-sm pb-1", recommended ? "text-primary-foreground/70" : "text-muted-foreground")}>
                {period}
              </span>
            </>
          ) : (
            <span className={cn("text-3xl font-bold", recommended ? "text-primary-foreground" : "text-foreground")}>
              {price}
            </span>
          )}
        </div>
      </div>

      {/* Features */}
      <ul className="flex-1 space-y-3 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <div
              className={cn(
                "mt-0.5 flex items-center justify-center w-4 h-4 rounded-full shrink-0",
                feature.included !== false
                  ? recommended
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground/40"
              )}
            >
              <Check className="size-2.5" />
            </div>
            <span
              className={cn(
                "text-sm",
                feature.included === false && "line-through opacity-40",
                feature.highlight && "font-semibold",
                recommended ? "text-primary-foreground" : "text-foreground"
              )}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={onCtaClick}
        disabled={disabled}
        className={cn(
          "w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          recommended
            ? "bg-background text-primary hover:bg-background/90 focus:ring-background"
            : "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary"
        )}
      >
        {ctaLabel}
      </button>

      {footnote && (
        <p className={cn("mt-3 text-center text-xs", recommended ? "text-primary-foreground/60" : "text-muted-foreground")}>
          {footnote}
        </p>
      )}
    </div>
  );
}
