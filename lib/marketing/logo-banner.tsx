"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface LogoItem {
  name: string;
  logo: React.ReactNode;
  href?: string;
}

interface LogoBannerProps extends React.HTMLAttributes<HTMLElement> {
  logos: LogoItem[];
  headline?: string;
  layout?: "static" | "marquee";
  columns?: 3 | 4 | 5 | 6;
  speed?: "slow" | "normal" | "fast";
  grayscale?: boolean;
}

const colsMap = {
  3: "grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-3 md:grid-cols-5",
  6: "sm:grid-cols-3 md:grid-cols-6",
};

const speedMap = {
  slow: "40s",
  normal: "25s",
  fast: "15s",
};

export function LogoBanner({
  logos,
  headline,
  layout = "marquee",
  columns = 5,
  speed = "normal",
  grayscale = true,
  className,
  ...props
}: LogoBannerProps) {
  const duration = speedMap[speed];

  return (
    <section className={cn("w-full py-10", className)} {...props}>
      <div className="mx-auto max-w-5xl px-6">
        {headline && (
          <p className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-widest">
            {headline}
          </p>
        )}

        {layout === "static" ? (
          <div className={cn("grid grid-cols-2 gap-8 items-center justify-items-center", colsMap[columns])}>
            {logos.map((logo, i) => (
              <LogoItem key={i} logo={logo} grayscale={grayscale} />
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div
              className="flex items-center gap-12"
              style={{
                animation: `marquee ${duration} linear infinite`,
                width: "max-content",
              }}
            >
              {/* Duplicate for seamless loop */}
              {[...logos, ...logos].map((logo, i) => (
                <LogoItem key={i} logo={logo} grayscale={grayscale} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

function LogoItem({ logo, grayscale }: { logo: LogoItem; grayscale: boolean }) {
  const content = (
    <div
      className={cn(
        "flex items-center justify-center h-10 px-4 transition-all duration-200",
        grayscale && "opacity-50 grayscale hover:opacity-100 hover:grayscale-0"
      )}
      title={logo.name}
    >
      {logo.logo}
    </div>
  );

  return logo.href ? (
    <a href={logo.href} aria-label={logo.name}>
      {content}
    </a>
  ) : (
    <div>{content}</div>
  );
}
