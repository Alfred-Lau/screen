"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronDown, ChevronRight, Bell } from "lucide-react";

interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: NavItem[];
  active?: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  logo?: React.ReactNode;
  navItems?: NavItem[];
  userSlot?: React.ReactNode;
  headerExtra?: React.ReactNode;
  sidebarWidth?: number;
  defaultSidebarOpen?: boolean;
  className?: string;
}

interface NavItemComponentProps {
  item: NavItem;
  depth?: number;
  onNavigate?: () => void;
}

function NavItemComponent({ item, depth = 0, onNavigate }: NavItemComponentProps) {
  const [expanded, setExpanded] = React.useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <li>
      <button
        onClick={() => {
          if (hasChildren) {
            setExpanded(!expanded);
          }
          if (!hasChildren) onNavigate?.();
        }}
        className={cn(
          "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
          depth > 0 && "ml-4 pl-3",
          item.active
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        {item.icon && (
          <span className="shrink-0 size-4 flex items-center justify-center">
            {item.icon}
          </span>
        )}
        <span className="flex-1 text-left truncate">{item.label}</span>
        {item.badge !== undefined && (
          <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground min-w-[18px] text-center">
            {item.badge}
          </span>
        )}
        {hasChildren && (
          <ChevronDown
            className={cn("size-3.5 shrink-0 transition-transform", expanded && "rotate-180")}
          />
        )}
      </button>
      {hasChildren && expanded && (
        <ul className="mt-1 space-y-0.5">
          {item.children!.map((child, i) => (
            <NavItemComponent key={i} item={child} depth={depth + 1} onNavigate={onNavigate} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function DashboardLayout({
  children,
  logo,
  navItems = [],
  userSlot,
  headerExtra,
  sidebarWidth = 256,
  defaultSidebarOpen = true,
  className,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(defaultSidebarOpen);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  return (
    <div className={cn("flex h-screen bg-background overflow-hidden", className)}>
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-card border-r border-border",
          "transition-all duration-300 ease-in-out",
          // Mobile: slide in/out
          "lg:relative lg:translate-x-0",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          // Desktop: collapse
          sidebarOpen ? "lg:w-64" : "lg:w-16"
        )}
        style={{ width: sidebarOpen ? sidebarWidth : undefined }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center h-16 px-4 border-b border-border shrink-0">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {logo}
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">{logo}</div>
          )}
          {/* Desktop collapse button */}
          <button
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ChevronRight className={cn("size-4 transition-transform", sidebarOpen && "rotate-180")} />
          </button>
          {/* Mobile close */}
          <button
            className="lg:hidden ml-auto text-muted-foreground hover:text-foreground"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-0.5">
            {navItems.map((item, i) => (
              <NavItemComponent
                key={i}
                item={item}
                onNavigate={() => setMobileSidebarOpen(false)}
              />
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer / User */}
        {userSlot && (
          <div className="p-3 border-t border-border shrink-0">
            {userSlot}
          </div>
        )}
      </aside>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center h-16 px-4 border-b border-border bg-card shrink-0">
          {/* Mobile menu button */}
          <button
            className="lg:hidden mr-3 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <div className="flex-1" />
          {headerExtra && (
            <div className="flex items-center gap-2">
              {headerExtra}
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
