"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { PricingCard } from "./pricing-card";

interface PricingFeature {
  text: string;
  included?: boolean;
  highlight?: boolean;
}

interface PricingPlan {
  name: string;
  description?: string;
  price: number | string;
  yearlyPrice?: number;
  features: PricingFeature[];
  ctaLabel?: string;
  recommended?: boolean;
  badge?: string;
  footnote?: string;
}

interface PricingSectionProps extends React.HTMLAttributes<HTMLElement> {
  headline?: string;
  subheadline?: string;
  description?: string;
  plans: PricingPlan[];
  showToggle?: boolean;
  discountBadge?: string;
  currency?: string;
  period?: string;
  onPlanSelect?: (planName: string, isYearly: boolean) => void;
}

export function PricingSection({
  headline = "Simple, transparent pricing",
  subheadline,
  description,
  plans,
  showToggle = true,
  discountBadge = "Save 20%",
  currency = "$",
  period,
  onPlanSelect,
  className,
  ...props
}: PricingSectionProps) {
  const [isYearly, setIsYearly] = React.useState(false);

  return (
    <section className={cn("w-full py-16", className)} {...props}>
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="text-center mb-10">
          {subheadline && (
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              {subheadline}
            </p>
          )}
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">{headline}</h2>
          {description && (
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">{description}</p>
          )}

          {/* Toggle */}
          {showToggle && (
            <div className="mt-8 inline-flex items-center gap-3 p-1 bg-muted rounded-xl">
              <button
                onClick={() => setIsYearly(false)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                  !isYearly
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                  isYearly
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Yearly
                {discountBadge && (
                  <span className="px-1.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                    {discountBadge}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Plans */}
        <div className={cn(
          "grid gap-6 items-center",
          plans.length === 2 && "sm:grid-cols-2",
          plans.length === 3 && "sm:grid-cols-2 lg:grid-cols-3",
          plans.length >= 4 && "sm:grid-cols-2 lg:grid-cols-4"
        )}>
          {plans.map((plan, i) => {
            const displayPrice = isYearly && plan.yearlyPrice !== undefined
              ? plan.yearlyPrice
              : plan.price;
            const displayPeriod = period ?? (isYearly ? "/year" : "/month");

            return (
              <PricingCard
                key={i}
                name={plan.name}
                description={plan.description}
                price={displayPrice}
                period={displayPeriod}
                currency={currency}
                features={plan.features}
                ctaLabel={plan.ctaLabel}
                recommended={plan.recommended}
                badge={plan.badge}
                footnote={plan.footnote}
                onCtaClick={() => onPlanSelect?.(plan.name, isYearly)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
