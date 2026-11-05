"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

export type AvatarStatus = "online" | "offline" | "away" | "busy";

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: AvatarStatus;
  showStatus?: boolean;
  fallbackIcon?: React.ReactNode;
}

const sizeConfig = {
  xs: { container: "w-6 h-6", text: "text-xs", statusDot: "w-1.5 h-1.5 border" },
  sm: { container: "w-8 h-8", text: "text-sm", statusDot: "w-2 h-2 border" },
  md: { container: "w-10 h-10", text: "text-sm", statusDot: "w-2.5 h-2.5 border-2" },
  lg: { container: "w-12 h-12", text: "text-base", statusDot: "w-3 h-3 border-2" },
  xl: { container: "w-16 h-16", text: "text-xl", statusDot: "w-3.5 h-3.5 border-2" },
};

const statusColors: Record<AvatarStatus, string> = {
  online: "bg-emerald-500",
  offline: "bg-gray-400",
  away: "bg-yellow-500",
  busy: "bg-red-500",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-500",
    "bg-violet-500",
    "bg-pink-500",
    "bg-amber-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-rose-500",
    "bg-cyan-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function UserAvatar({
  src,
  alt,
  name,
  size = "md",
  status,
  showStatus = true,
  fallbackIcon,
  className,
  ...props
}: UserAvatarProps) {
  const [imgError, setImgError] = React.useState(false);
  const sizes = sizeConfig[size];
  const displayName = alt ?? name ?? "";

  const renderFallback = () => {
    if (fallbackIcon) {
      return (
        <span className="text-white">{fallbackIcon}</span>
      );
    }
    if (name) {
      return (
        <span className={cn("font-semibold text-white", sizes.text)}>
          {getInitials(name)}
        </span>
      );
    }
    return <User className="text-white size-[40%]" />;
  };

  const bgColor = name && (!src || imgError) ? getAvatarColor(name) : "bg-muted";

  return (
    <div className={cn("relative inline-flex shrink-0", className)} {...props}>
      <div
        className={cn(
          "rounded-full overflow-hidden flex items-center justify-center ring-2 ring-background",
          sizes.container,
          (!src || imgError) && bgColor
        )}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt={displayName}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          renderFallback()
        )}
      </div>
      {showStatus && status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-background",
            sizes.statusDot,
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}
