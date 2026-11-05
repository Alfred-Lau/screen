"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface HeroButton {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  icon?: React.ReactNode;
}

interface HeroSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  badge?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: string;
  buttons?: HeroButton[];
  media?: React.ReactNode;
  align?: "center" | "left";
  socialProof?: React.ReactNode;
  backgroundDecorator?: boolean;
}

export function HeroSection({
  badge,
  title,
  subtitle,
  description,
  buttons = [],
  media,
  align = "center",
  socialProof,
  backgroundDecorator = true,
  className,
  ...props
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden py-16 md:py-24",
        className
      )}
      {...props}
    >
      {/* Background decorator */}
      {backgroundDecorator && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-accent/10 blur-2xl" />
        </div>
      )}

      <div className={cn("relative mx-auto max-w-5xl px-6", align === "center" && "text-center")}>
        {/* Badge */}
        {badge && (
          <div className={cn("mb-6 flex", align === "center" ? "justify-center" : "justify-start")}>
            {badge}
          </div>
        )}

        {/* Title */}
        <h1
          className={cn(
            "text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl",
            "leading-[1.1]"
          )}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-4 text-xl font-medium text-primary md:text-2xl">
            {subtitle}
          </p>
        )}

        {/* Description */}
        {description && (
          <p
            className={cn(
              "mt-5 text-base text-muted-foreground md:text-lg leading-relaxed",
              align === "center" && "max-w-2xl mx-auto"
            )}
          >
            {description}
          </p>
        )}

        {/* Buttons */}
        {buttons.length > 0 && (
          <div
            className={cn(
              "mt-8 flex flex-wrap gap-3",
              align === "center" ? "justify-center" : "justify-start"
            )}
          >
            {buttons.map((btn, i) => {
              const baseClass = "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
              const variantClass = {
                primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary shadow-md",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary",
                outline: "border-2 border-border text-foreground hover:bg-accent hover:border-primary/30 focus:ring-primary",
              }[btn.variant ?? "primary"];

              const content = (
                <>
                  {btn.icon}
                  {btn.label}
                  {!btn.icon && btn.variant === "primary" && <ArrowRight className="size-4" />}
                </>
              );

              return btn.href ? (
                <a key={i} href={btn.href} className={cn(baseClass, variantClass)}>
                  {content}
                </a>
              ) : (
                <button key={i} onClick={btn.onClick} className={cn(baseClass, variantClass)}>
                  {content}
                </button>
              );
            })}
          </div>
        )}

        {/* Social Proof */}
        {socialProof && (
          <div className={cn("mt-8", align === "center" && "flex justify-center")}>
            {socialProof}
          </div>
        )}

        {/* Media */}
        {media && (
          <div className="mt-12 rounded-2xl overflow-hidden border border-border shadow-2xl">
            {media}
          </div>
        )}
      </div>
    </section>
  );
}
