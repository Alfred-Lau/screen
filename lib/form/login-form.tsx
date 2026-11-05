"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface LoginFormProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  title?: string;
  subtitle?: string;
  onSubmit?: (email: string, password: string, remember: boolean) => Promise<void> | void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  socialButtons?: React.ReactNode;
  footer?: React.ReactNode;
  showRememberMe?: boolean;
  defaultEmail?: string;
  loading?: boolean;
  error?: string;
  logo?: React.ReactNode;
}

export function LoginForm({
  title = "Welcome back",
  subtitle = "Sign in to your account",
  onSubmit,
  onForgotPassword,
  onSignUp,
  socialButtons,
  footer,
  showRememberMe = true,
  defaultEmail = "",
  loading: externalLoading,
  error: externalError,
  logo,
  className,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = React.useState(defaultEmail);
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [remember, setRemember] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const isLoading = externalLoading ?? loading;
  const displayError = externalError ?? error;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit?.(email, password, remember);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-md mx-auto rounded-2xl border border-border bg-card shadow-lg p-8",
        className
      )}
      {...props}
    >
      {/* Logo / Header */}
      <div className="text-center mb-8">
        {logo && <div className="flex justify-center mb-4">{logo}</div>}
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      {/* Social buttons */}
      {socialButtons && (
        <>
          <div className="space-y-2 mb-6">{socialButtons}</div>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-card text-xs text-muted-foreground">or continue with email</span>
            </div>
          </div>
        </>
      )}

      {/* Error */}
      {displayError && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-400">{displayError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="text-sm font-medium text-foreground">
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={isLoading}
            required
            autoComplete="email"
            className={cn(
              "w-full px-3.5 py-2.5 rounded-xl border border-input bg-background",
              "text-sm placeholder:text-muted-foreground text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "transition-colors disabled:opacity-50"
            )}
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="text-sm font-medium text-foreground">
              Password
            </label>
            {onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              required
              autoComplete="current-password"
              className={cn(
                "w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-input bg-background",
                "text-sm placeholder:text-muted-foreground text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                "transition-colors disabled:opacity-50"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Remember me */}
        {showRememberMe && (
          <label className="flex items-center gap-2.5 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="sr-only"
              />
              <div
                className={cn(
                  "w-4 h-4 rounded border-2 transition-colors flex items-center justify-center",
                  remember ? "bg-primary border-primary" : "border-border"
                )}
              >
                {remember && (
                  <svg className="size-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-foreground">Remember me</span>
          </label>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl",
            "bg-primary text-primary-foreground text-sm font-semibold",
            "hover:bg-primary/90 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Sign up link */}
      {onSignUp && (
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSignUp}
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </button>
        </p>
      )}

      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}
