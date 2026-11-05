"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export type CTALayout = "fullwidth" | "card";

interface CTAButton {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
}

interface CTABannerProps extends React.HTMLAttributes<HTMLElement> {
  layout?: CTALayout;
  headline: string;
  description?: string;
  primaryButton?: CTAButton;
  secondaryButton?: CTAButton;
  badge?: string;
  backgroundVariant?: "gradient" | "solid" | "subtle";
}

export function CTABanner({
  layout = "card",
  headline,
  description,
  primaryButton,
  secondaryButton,
  badge,
  backgroundVariant = "gradient",
  className,
  ...props
}: CTABannerProps) {
  const bgStyles = {
    gradient: "bg-gradient-to-br from-primary via-primary/90 to-accent text-primary-foreground",
    solid: "bg-primary text-primary-foreground",
    subtle: "bg-muted text-foreground border border-border",
  };

  const renderButton = (btn: CTAButton, isPrimary: boolean) => {
    const baseClass = "inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all";
    const variantClass = isPrimary
      ? backgroundVariant === "subtle"
        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
        : "bg-background text-foreground hover:bg-background/90 shadow-md"
      : backgroundVariant === "subtle"
      ? "border border-border text-foreground hover:bg-accent"
      : "border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10";

    const content = (
      <>
        {btn.label}
        {isPrimary && <ArrowRight className="size-4" />}
      </>
    );

    return btn.href ? (
      <a href={btn.href} className={cn(baseClass, variantClass)}>
        {content}
      </a>
    ) : (
      <button onClick={btn.onClick} className={cn(baseClass, variantClass)}>
        {content}
      </button>
    );
  };

  return (
    <section className={cn("w-full py-6", className)} {...props}>
      <div className={cn("mx-auto max-w-5xl px-6", layout === "fullwidth" && "max-w-full px-0")}>
        <div
          className={cn(
            "relative overflow-hidden",
            layout === "card" && "rounded-2xl shadow-lg",
            bgStyles[backgroundVariant]
          )}
        >
          {/* Background decoration */}
          {backgroundVariant !== "subtle" && (
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-black/10 blur-xl" />
            </div>
          )}

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 px-8 py-10 md:px-12">
            <div className="flex-1 text-center md:text-left">
              {badge && (
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3",
                    backgroundVariant === "subtle"
                      ? "bg-primary/10 text-primary"
                      : "bg-primary-foreground/20 text-primary-foreground"
                  )}
                >
                  {badge}
                </span>
              )}
              <h2 className="text-2xl font-bold md:text-3xl">{headline}</h2>
              {description && (
                <p className={cn("mt-2 text-base", backgroundVariant === "subtle" ? "text-muted-foreground" : "opacity-80")}>
                  {description}
                </p>
              )}
            </div>

            {(primaryButton || secondaryButton) && (
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {primaryButton && renderButton(primaryButton, true)}
                {secondaryButton && renderButton(secondaryButton, false)}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
