"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type StepOrientation = "horizontal" | "vertical";

interface Step {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface StepProcessProps extends React.HTMLAttributes<HTMLElement> {
  steps: Step[];
  orientation?: StepOrientation;
  headline?: string;
  description?: string;
  numbered?: boolean;
  activeStep?: number;
  showConnector?: boolean;
}

export function StepProcess({
  steps,
  orientation = "horizontal",
  headline,
  description,
  numbered = true,
  activeStep,
  showConnector = true,
  className,
  ...props
}: StepProcessProps) {
  return (
    <section className={cn("w-full py-16", className)} {...props}>
      <div className="mx-auto max-w-5xl px-6">
        {(headline || description) && (
          <div className="text-center mb-12">
            {headline && (
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">{headline}</h2>
            )}
            {description && (
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">{description}</p>
            )}
          </div>
        )}

        {orientation === "horizontal" ? (
          <div className="flex flex-col sm:flex-row items-start gap-0">
            {steps.map((step, i) => {
              const isActive = activeStep !== undefined && i <= activeStep;
              const isLast = i === steps.length - 1;

              return (
                <div key={i} className="flex flex-row sm:flex-col items-start sm:items-center flex-1 gap-4 sm:gap-0">
                  {/* Number/Icon + Connector */}
                  <div className="flex sm:flex-col items-center gap-0">
                    <div
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold text-sm shrink-0 transition-all",
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground"
                      )}
                    >
                      {step.icon ?? (numbered ? i + 1 : null)}
                    </div>
                    {showConnector && !isLast && (
                      <div className={cn(
                        "hidden sm:block h-px w-full flex-1 mx-2 min-w-[24px] mt-5 -translate-y-5",
                        isActive ? "bg-primary" : "bg-border"
                      )} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="sm:text-center sm:mt-4 pb-8 sm:pb-0 sm:px-2">
                    {step.badge && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-1.5">
                        {step.badge}
                      </span>
                    )}
                    <p className={cn("text-sm font-semibold", isActive ? "text-foreground" : "text-muted-foreground")}>
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="mt-1 text-xs text-muted-foreground">{step.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-0">
            {steps.map((step, i) => {
              const isActive = activeStep !== undefined && i <= activeStep;
              const isLast = i === steps.length - 1;

              return (
                <div key={i} className="flex gap-6">
                  {/* Left column: number + connector */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold text-sm shrink-0 transition-all",
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground"
                      )}
                    >
                      {step.icon ?? (numbered ? i + 1 : null)}
                    </div>
                    {showConnector && !isLast && (
                      <div className={cn("w-px flex-1 min-h-[24px] my-1", isActive ? "bg-primary" : "bg-border")} />
                    )}
                  </div>

                  {/* Right column: content */}
                  <div className={cn("pb-10", isLast && "pb-0")}>
                    {step.badge && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-1.5">
                        {step.badge}
                      </span>
                    )}
                    <p className={cn("text-base font-semibold", isActive ? "text-foreground" : "text-muted-foreground")}>
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
