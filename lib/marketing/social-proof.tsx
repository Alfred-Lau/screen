"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface SocialProofAvatar {
  src?: string;
  name?: string;
}

interface SocialProofProps extends React.HTMLAttributes<HTMLDivElement> {
  avatars?: SocialProofAvatar[];
  count?: number;
  countLabel?: string;
  rating?: number;
  reviewCount?: number;
  layout?: "horizontal" | "vertical";
}

function getInitials(name = ""): string {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

const avatarColors = [
  "bg-blue-500", "bg-violet-500", "bg-pink-500",
  "bg-amber-500", "bg-teal-500", "bg-indigo-500",
];

export function SocialProof({
  avatars = [],
  count,
  countLabel = "people already joined",
  rating,
  reviewCount,
  layout = "horizontal",
  className,
  ...props
}: SocialProofProps) {
  const displayAvatars = avatars.slice(0, 5);
  const maxStars = 5;

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        layout === "vertical" && "flex-col",
        className
      )}
      {...props}
    >
      {/* Avatar stack */}
      {displayAvatars.length > 0 && (
        <div className="flex items-center -space-x-2">
          {displayAvatars.map((avatar, i) => (
            <div
              key={i}
              className={cn(
                "w-8 h-8 rounded-full ring-2 ring-background overflow-hidden flex items-center justify-center shrink-0",
                !avatar.src && avatarColors[i % avatarColors.length]
              )}
              title={avatar.name}
            >
              {avatar.src ? (
                <img src={avatar.src} alt={avatar.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-semibold text-white">{getInitials(avatar.name)}</span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className={cn("flex flex-col gap-0.5", layout === "vertical" && "items-center")}>
        {/* Count */}
        {count !== undefined && (
          <p className="text-sm font-semibold text-foreground">
            <span className="text-primary font-bold">{count.toLocaleString()}+</span>{" "}
            {countLabel}
          </p>
        )}

        {/* Rating */}
        {rating !== undefined && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {Array.from({ length: maxStars }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-3.5",
                    i < Math.floor(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : i < rating
                      ? "fill-yellow-400/50 text-yellow-400"
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {rating.toFixed(1)}
              {reviewCount !== undefined && ` (${reviewCount.toLocaleString()} reviews)`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
