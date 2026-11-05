"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "./user-avatar";

interface AvatarItem {
  src?: string;
  name?: string;
  alt?: string;
}

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  avatars: AvatarItem[];
  max?: number;
  size?: "xs" | "sm" | "md" | "lg";
  showTooltip?: boolean;
  showCount?: boolean;
}

const sizeOffsets = {
  xs: "-ml-1.5",
  sm: "-ml-2",
  md: "-ml-3",
  lg: "-ml-4",
};

const countSizes = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-sm",
};

export function AvatarGroup({
  avatars,
  max = 4,
  size = "md",
  showTooltip = true,
  showCount = true,
  className,
  ...props
}: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = Math.max(0, avatars.length - max);

  return (
    <div className={cn("flex items-center", className)} {...props}>
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          className={cn(
            "relative group",
            index > 0 && sizeOffsets[size]
          )}
          title={showTooltip ? avatar.name ?? avatar.alt : undefined}
        >
          <UserAvatar
            src={avatar.src}
            name={avatar.name}
            alt={avatar.alt}
            size={size}
            showStatus={false}
          />
          {showTooltip && (avatar.name ?? avatar.alt) && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md bg-popover border border-border text-popover-foreground text-xs whitespace-nowrap shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50">
              {avatar.name ?? avatar.alt}
            </div>
          )}
        </div>
      ))}

      {remainingCount > 0 && showCount && (
        <div
          className={cn(
            "relative flex items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold ring-2 ring-background shrink-0",
            sizeOffsets[size],
            countSizes[size]
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
