"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  value?: string;
  onChange?: (value: string) => void;
  length?: number;
  type?: "text" | "number";
  disabled?: boolean;
  autoFocus?: boolean;
  error?: boolean;
  onComplete?: (value: string) => void;
  className?: string;
  id?: string;
}

export function OTPInput({
  value = "",
  onChange,
  length = 6,
  type = "number",
  disabled = false,
  autoFocus = false,
  error = false,
  onComplete,
  className,
  id,
}: OTPInputProps) {
  const [shaking, setShaking] = React.useState(false);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs array
  React.useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  React.useEffect(() => {
    if (error) {
      setShaking(true);
      const t = setTimeout(() => setShaking(false), 600);
      return () => clearTimeout(t);
    }
  }, [error]);

  React.useEffect(() => {
    if (autoFocus) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const getDigits = () => {
    const arr: string[] = Array(length).fill("");
    for (let i = 0; i < Math.min(value.length, length); i++) {
      arr[i] = value[i] ?? "";
    }
    return arr;
  };

  const digits = getDigits();

  const updateValue = (newDigits: string[]) => {
    const newVal = newDigits.join("");
    onChange?.(newVal);
    if (newVal.length === length) {
      onComplete?.(newVal);
    }
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value.replace(/\D/g, type === "number" ? "" : undefined as unknown as string).slice(-1);
    const newDigits = [...digits];
    newDigits[index] = inputVal;
    updateValue(newDigits);

    if (inputVal && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = "";
        updateValue(newDigits);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        updateValue(newDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, type === "number" ? "" : undefined as unknown as string)
      .slice(0, length);
    const newDigits = Array(length).fill("");
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    updateValue(newDigits);
    const focusIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        shaking && "animate-[shake_0.6s_ease-in-out]",
        className
      )}
      id={id}
    >
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type={type === "number" ? "tel" : "text"}
          inputMode={type === "number" ? "numeric" : "text"}
          pattern={type === "number" ? "[0-9]*" : undefined}
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onClick={(e) => (e.target as HTMLInputElement).select()}
          className={cn(
            "w-10 h-12 text-center text-lg font-bold rounded-xl border-2 transition-all",
            "focus:outline-none bg-background text-foreground",
            error
              ? "border-red-500 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400"
              : digit
              ? "border-primary bg-primary/5 text-foreground"
              : "border-border hover:border-primary/50 focus:border-primary",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
      ))}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-6px); }
          30% { transform: translateX(6px); }
          45% { transform: translateX(-4px); }
          60% { transform: translateX(4px); }
          75% { transform: translateX(-2px); }
          90% { transform: translateX(2px); }
        }
      `}</style>
    </div>
  );
}
