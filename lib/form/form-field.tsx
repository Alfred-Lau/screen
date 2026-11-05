"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  helperText?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
  hint?: string;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  optional = false,
  helperText,
  error,
  children,
  className,
  labelClassName,
  hint,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={htmlFor}
            className={cn(
              "text-sm font-medium text-foreground",
              labelClassName
            )}
          >
            {label}
            {required && (
              <span className="ml-1 text-red-500 dark:text-red-400" aria-hidden="true">*</span>
            )}
          </label>
          {optional && (
            <span className="text-xs text-muted-foreground">Optional</span>
          )}
          {hint && (
            <span className="text-xs text-muted-foreground">{hint}</span>
          )}
        </div>
      )}

      {children}

      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
          <svg className="size-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}
