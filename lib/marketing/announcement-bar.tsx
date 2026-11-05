"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X, Megaphone, Info, AlertTriangle, Sparkles } from "lucide-react";

export type AnnouncementVariant = "default" | "info" | "warning" | "success" | "promo";

interface AnnouncementBarProps extends React.HTMLAttributes<HTMLDivElement> {
  message: React.ReactNode;
  variant?: AnnouncementVariant;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  link?: { href: string; label: string };
  ctaButton?: { label: string; onClick: () => void };
}

const variantConfig: Record<AnnouncementVariant, { bg: string; text: string; icon: React.ReactNode }> = {
  default: {
    bg: "bg-muted",
    text: "text-foreground",
    icon: <Megaphone className="size-4" />,
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-800 dark:text-blue-200",
    icon: <Info className="size-4" />,
  },
  warning: {
    bg: "bg-yellow-50 dark:bg-yellow-950/40",
    text: "text-yellow-800 dark:text-yellow-200",
    icon: <AlertTriangle className="size-4" />,
  },
  success: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-800 dark:text-emerald-200",
    icon: <Sparkles className="size-4" />,
  },
  promo: {
    bg: "bg-gradient-to-r from-primary to-accent",
    text: "text-primary-foreground",
    icon: <Sparkles className="size-4" />,
  },
};

export function AnnouncementBar({
  message,
  variant = "default",
  dismissible = true,
  onDismiss,
  icon,
  link,
  ctaButton,
  className,
  ...props
}: AnnouncementBarProps) {
  const [dismissed, setDismissed] = React.useState(false);
  const config = variantConfig[variant];

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      className={cn(
        "w-full px-4 py-2.5 flex items-center justify-center gap-3",
        config.bg,
        config.text,
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 flex-1 justify-center min-w-0">
        <span className="shrink-0 opacity-80">{icon ?? config.icon}</span>
        <p className="text-sm font-medium truncate">{message}</p>
        {link && (
          <a
            href={link.href}
            className="shrink-0 text-sm font-semibold underline underline-offset-2 hover:no-underline ml-1"
          >
            {link.label} →
          </a>
        )}
        {ctaButton && (
          <button
            onClick={ctaButton.onClick}
            className="shrink-0 ml-2 px-3 py-0.5 rounded-md text-xs font-semibold border border-current opacity-80 hover:opacity-100 transition-opacity"
          >
            {ctaButton.label}
          </button>
        )}
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="shrink-0 p-0.5 rounded opacity-60 hover:opacity-100 transition-opacity ml-auto"
          aria-label="Dismiss"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
