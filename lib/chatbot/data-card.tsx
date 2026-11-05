"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Lightbulb,
  Target,
  FileText,
  BarChart3,
  Calendar,
  Users,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

// Card Variants
export type DataCardVariant =
  | "default"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "thinking"
  | "intent"
  | "plan"
  | "report"
  | "task"
  | "team";

// Card Context
interface DataCardContextValue {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  variant: DataCardVariant;
}

const DataCardContext = React.createContext<DataCardContextValue | null>(null);

function useDataCard() {
  const context = React.useContext(DataCardContext);
  if (!context) {
    throw new Error("useDataCard must be used within a DataCard");
  }
  return context;
}

// Variant Configurations
const variantConfig: Record<
  DataCardVariant,
  {
    icon: React.ReactNode;
    borderClass: string;
    bgClass: string;
    headerBgClass: string;
    iconBgClass: string;
    iconClass: string;
  }
> = {
  default: {
    icon: <Info className="size-4" />,
    borderClass: "border-gray-200 dark:border-gray-700",
    bgClass: "bg-white dark:bg-gray-900/50",
    headerBgClass: "bg-gray-50/50 dark:bg-gray-800/50",
    iconBgClass: "bg-gray-100 dark:bg-gray-800",
    iconClass: "text-gray-600 dark:text-gray-400",
  },
  info: {
    icon: <Info className="size-4" />,
    borderClass: "border-blue-200 dark:border-blue-800",
    bgClass: "bg-white dark:bg-gray-900/50",
    headerBgClass: "bg-blue-50/50 dark:bg-blue-950/20",
    iconBgClass: "bg-blue-100 dark:bg-blue-900/50",
    iconClass: "text-blue-600 dark:text-blue-400",
  },
  success: {
    icon: <CheckCircle className="size-4" />,
    borderClass: "border-green-200 dark:border-green-800",
    bgClass: "bg-white dark:bg-gray-900/50",
    headerBgClass: "bg-green-50/50 dark:bg-green-950/20",
    iconBgClass: "bg-green-100 dark:bg-green-900/50",
    iconClass: "text-green-600 dark:text-green-400",
  },
  warning: {
    icon: <AlertTriangle className="size-4" />,
    borderClass: "border-yellow-200 dark:border-yellow-800",
    bgClass: "bg-white dark:bg-gray-900/50",
    headerBgClass: "bg-yellow-50/50 dark:bg-yellow-950/20",
    iconBgClass: "bg-yellow-100 dark:bg-yellow-900/50",
    iconClass: "text-yellow-600 dark:text-yellow-400",
  },
  error: {
    icon: <AlertCircle className="size-4" />,
    borderClass: "border-red-200 dark:border-red-800",
    bgClass: "bg-white dark:bg-gray-900/50",
    headerBgClass: "bg-red-50/50 dark:bg-red-950/20",
    iconBgClass: "bg-red-100 dark:bg-red-900/50",
    iconClass: "text-red-600 dark:text-red-400",
  },
  thinking: {
    icon: <Lightbulb className="size-4" />,
    borderClass: "border-purple-200 dark:border-purple-800",
    bgClass: "bg-white dark:bg-gray-900/50",
    headerBgClass: "bg-purple-50/50 dark:bg-purple-950/20",
    iconBgClass: "bg-purple-100 dark:bg-purple-900/50",
    iconClass: "text-purple-600 dark:text-purple-400",
  },
  intent: {
    icon: <Target className="size-4" />,
    borderClass: "border-indigo-200 dark:border-indigo-800",
    bgClass: "bg-white dark:bg-gray-900/50",
    headerBgClass: "bg-indigo-50/50 dark:bg-indigo-950/20",
    iconBgClass: "bg-indigo-100 dark:bg-indigo-900/50",
    iconClass: "text-indigo-600 dark:text-indigo-400",
  },
  plan: {
    icon: <FileText className="size-4" />,
    borderClass: "border-cyan-200 dark:border-cyan-800",
    bgClass: "bg-white dark:bg-gray-900/50",
    headerBgClass: "bg-cyan-50/50 dark:bg-cyan-950/20",
    iconBgClass: "bg-cyan-100 dark:bg-cyan-900/50",
    iconClass: "text-cyan-600 dark:text-cyan-400",
  },
  report: {
    icon: <BarChart3 className="size-4" />,
    borderClass: "border-emerald-200 dark:border-emerald-800",
    bgClass: "bg-white dark:bg-gray-900/50",
    headerBgClass: "bg-emerald-50/50 dark:bg-emerald-950/20",
    iconBgClass: "bg-emerald-100 dark:bg-emerald-900/50",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  task: {
    icon: <Calendar className="size-4" />,
    borderClass: "border-orange-200 dark:border-orange-800",
    bgClass: "bg-white dark:bg-gray-900/50",
    headerBgClass: "bg-orange-50/50 dark:bg-orange-950/20",
    iconBgClass: "bg-orange-100 dark:bg-orange-900/50",
    iconClass: "text-orange-600 dark:text-orange-400",
  },
  team: {
    icon: <Users className="size-4" />,
    borderClass: "border-pink-200 dark:border-pink-800",
    bgClass: "bg-white dark:bg-gray-900/50",
    headerBgClass: "bg-pink-50/50 dark:bg-pink-950/20",
    iconBgClass: "bg-pink-100 dark:bg-pink-900/50",
    iconClass: "text-pink-600 dark:text-pink-400",
  },
};

// DataCard Component
interface DataCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: DataCardVariant;
  defaultOpen?: boolean;
  collapsible?: boolean;
}

export function DataCard({
  children,
  variant = "default",
  defaultOpen = true,
  collapsible = true,
  className,
  ...props
}: DataCardProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const config = variantConfig[variant];

  return (
    <DataCardContext.Provider value={{ isOpen, setIsOpen, variant }}>
      <div
        className={cn(
          "rounded-xl border transition-all duration-200",
          config.borderClass,
          config.bgClass,
          "hover:shadow-md",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </DataCardContext.Provider>
  );
}

// DataCardHeader
interface DataCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  onClick?: () => void;
}

export function DataCardHeader({
  title,
  subtitle,
  icon,
  badge,
  actions,
  onClick,
  className,
  ...props
}: DataCardHeaderProps) {
  const { isOpen, setIsOpen, variant } = useDataCard();
  const config = variantConfig[variant];

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-t-xl cursor-pointer",
        "transition-colors duration-200",
        config.headerBgClass,
        "hover:bg-opacity-80",
        className
      )}
      {...props}
    >
      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-lg",
        config.iconBgClass
      )}>
        <div className={config.iconClass}>
          {icon || config.icon}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
            {title}
          </span>
          {badge}
        </div>
        {subtitle && (
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate block">
            {subtitle}
          </span>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {actions}
        </div>
      )}

      <ChevronDown
        className={cn(
          "size-4 text-gray-500 transition-transform duration-200 shrink-0",
          isOpen && "rotate-180"
        )}
      />
    </div>
  );
}

// DataCardContent
interface DataCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DataCardContent({
  children,
  className,
  ...props
}: DataCardContentProps) {
  const { isOpen } = useDataCard();

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "px-4 py-3 border-t border-gray-100 dark:border-gray-800",
        "animate-in slide-in-from-top-2 duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// DataCardFooter
interface DataCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DataCardFooter({
  children,
  className,
  ...props
}: DataCardFooterProps) {
  return (
    <div
      className={cn(
        "px-4 py-3 border-t border-gray-100 dark:border-gray-800",
        "bg-gray-50/50 dark:bg-gray-900/50 rounded-b-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// DataCardBadge
interface DataCardBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  children: React.ReactNode;
}

export function DataCardBadge({
  variant = "default",
  children,
  className,
  ...props
}: DataCardBadgeProps) {
  const badgeStyles = {
    default: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
    success: "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400",
    warning: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400",
    error: "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400",
    info: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
  };

  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-xs font-medium",
        badgeStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// DataCardAction
interface DataCardActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "primary";
}

export function DataCardAction({
  children,
  variant = "default",
  className,
  ...props
}: DataCardActionProps) {
  return (
    <button
      className={cn(
        "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
        variant === "default" && "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
        variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
