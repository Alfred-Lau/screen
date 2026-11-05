"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { FeatureCard } from "./feature-card";

interface FeatureItem {
  icon?: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

interface FeatureGridProps extends React.HTMLAttributes<HTMLElement> {
  headline?: string;
  subheadline?: string;
  description?: string;
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
  cardVariant?: "simple" | "bordered" | "gradient";
  align?: "center" | "left";
}

const colsMap = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function FeatureGrid({
  headline,
  subheadline,
  description,
  features,
  columns = 3,
  cardVariant = "bordered",
  align = "center",
  className,
  ...props
}: FeatureGridProps) {
  return (
    <section className={cn("w-full py-16", className)} {...props}>
      <div className="mx-auto max-w-5xl px-6">
        {(headline || description) && (
          <div className={cn("mb-12", align === "center" && "text-center")}>
            {subheadline && (
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                {subheadline}
              </p>
            )}
            {headline && (
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">{headline}</h2>
            )}
            {description && (
              <p className={cn("mt-4 text-muted-foreground text-base md:text-lg leading-relaxed", align === "center" && "max-w-2xl mx-auto")}>
                {description}
              </p>
            )}
          </div>
        )}

        <div className={cn("grid grid-cols-1 gap-6", colsMap[columns])}>
          {features.map((feature, i) => (
            <FeatureCard
              key={i}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              badge={feature.badge}
              variant={cardVariant}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
