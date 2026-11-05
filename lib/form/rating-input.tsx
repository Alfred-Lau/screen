"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Star, Heart, ThumbsUp } from "lucide-react";

export type RatingIcon = "star" | "heart" | "thumb";

interface RatingInputProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  icon?: RatingIcon;
  halfRatings?: boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  id?: string;
}

const iconMap = {
  star: Star,
  heart: Heart,
  thumb: ThumbsUp,
};

const sizeMap = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
};

export function RatingInput({
  value = 0,
  onChange,
  max = 5,
  icon = "star",
  halfRatings = false,
  size = "md",
  disabled = false,
  readOnly = false,
  className,
  id,
}: RatingInputProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);
  const IconComponent = iconMap[icon];
  const iconSize = sizeMap[size];
  const interactive = !disabled && !readOnly;

  const displayValue = hoverValue ?? value;

  const getIconState = (index: number): "full" | "half" | "empty" => {
    const threshold = index + 1;
    if (displayValue >= threshold) return "full";
    if (halfRatings && displayValue >= threshold - 0.5) return "half";
    return "empty";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    if (!interactive || !halfRatings) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setHoverValue(x < rect.width / 2 ? index + 0.5 : index + 1);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    if (!interactive) return;
    if (halfRatings) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newValue = x < rect.width / 2 ? index + 0.5 : index + 1;
      onChange?.(value === newValue ? 0 : newValue);
    } else {
      const newValue = index + 1;
      onChange?.(value === newValue ? 0 : newValue);
    }
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)} id={id}>
      {Array.from({ length: max }).map((_, i) => {
        const state = getIconState(i);
        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onMouseMove={(e) => handleMouseMove(e, i)}
            onMouseEnter={() => !halfRatings && interactive && setHoverValue(i + 1)}
            onMouseLeave={() => interactive && setHoverValue(null)}
            onClick={(e) => handleClick(e, i)}
            className={cn(
              "relative transition-transform",
              interactive && "hover:scale-110 cursor-pointer",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <IconComponent
              className={cn(
                iconSize,
                "transition-colors",
                state === "full"
                  ? icon === "star"
                    ? "fill-yellow-400 text-yellow-400"
                    : icon === "heart"
                    ? "fill-red-400 text-red-400"
                    : "fill-primary text-primary"
                  : state === "half"
                  ? icon === "star"
                    ? "fill-yellow-400/50 text-yellow-400"
                    : "fill-red-400/50 text-red-400"
                  : "fill-muted text-muted-foreground/30"
              )}
            />
            {state === "half" && (
              <div className="absolute inset-0 overflow-hidden w-1/2">
                <IconComponent
                  className={cn(
                    iconSize,
                    icon === "star"
                      ? "fill-yellow-400 text-yellow-400"
                      : icon === "heart"
                      ? "fill-red-400 text-red-400"
                      : "fill-primary text-primary"
                  )}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
