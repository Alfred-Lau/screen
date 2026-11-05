"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

export type NewsletterLayout = "horizontal" | "vertical";
export type NewsletterState = "idle" | "loading" | "success" | "error";

interface NewsletterFormProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  layout?: NewsletterLayout;
  placeholder?: string;
  ctaLabel?: string;
  privacyNote?: React.ReactNode;
  successMessage?: string;
  errorMessage?: string;
  onSubmit?: (email: string) => Promise<void> | void;
}

export function NewsletterForm({
  layout = "horizontal",
  placeholder = "Enter your email",
  ctaLabel = "Subscribe",
  privacyNote,
  successMessage = "You're subscribed! Check your inbox.",
  errorMessage = "Something went wrong. Please try again.",
  onSubmit,
  className,
  ...props
}: NewsletterFormProps) {
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState<NewsletterState>("idle");
  const [message, setMessage] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setState("loading");
    try {
      await onSubmit?.(email);
      setState("success");
      setMessage(successMessage);
      setEmail("");
    } catch {
      setState("error");
      setMessage(errorMessage);
    }
  };

  if (state === "success") {
    return (
      <div className={cn("flex items-center gap-3 py-3 text-emerald-600 dark:text-emerald-400", className)}>
        <CheckCircle className="size-5 shrink-0" />
        <p className="text-sm font-medium">{message}</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex gap-2",
          layout === "vertical" ? "flex-col" : "flex-row flex-wrap"
        )}
      >
        <div className="relative flex-1 min-w-[200px]">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            disabled={state === "loading"}
            required
            className={cn(
              "w-full pl-9 pr-4 py-2.5 rounded-xl border border-input bg-background",
              "text-sm text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "transition-colors disabled:opacity-50"
            )}
          />
        </div>
        <button
          type="submit"
          disabled={state === "loading" || !email}
          className={cn(
            "flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl",
            "bg-primary text-primary-foreground text-sm font-semibold",
            "hover:bg-primary/90 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            layout === "vertical" && "w-full"
          )}
        >
          {state === "loading" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : ctaLabel}
        </button>
      </form>

      {state === "error" && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">{message}</p>
      )}

      {privacyNote && (
        <div className="mt-2 text-xs text-muted-foreground">{privacyNote}</div>
      )}
    </div>
  );
}
