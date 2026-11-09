"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Neutral provider marks, not vendor logos.
 *
 * Every mark in this file is either a two-letter block or a geometric glyph
 * drawn for this library. No third-party logo artwork ships here, so there is
 * nothing to license and no implied endorsement. When you want the real asset,
 * pass `src` — that file is yours, and each vendor's brand terms apply to it,
 * not to this component.
 */

export type ProviderKind = "model" | "tool" | "runtime";
export type ProviderSize = "sm" | "md" | "lg";

export interface ProviderMeta {
  /** Short block mark. Empty for runtime glyphs. */
  mark: string;
  /** Readable name, used for the label and the accessible name. */
  title: string;
  kind: ProviderKind;
}

export const PROVIDERS: Record<string, ProviderMeta> = {
  // Models
  openai: { mark: "OA", title: "OpenAI", kind: "model" },
  claude: { mark: "CL", title: "Claude", kind: "model" },
  gemini: { mark: "GM", title: "Gemini", kind: "model" },
  llama: { mark: "LL", title: "Llama", kind: "model" },
  grok: { mark: "GK", title: "Grok", kind: "model" },
  mistral: { mark: "MI", title: "Mistral", kind: "model" },
  deepseek: { mark: "DS", title: "DeepSeek", kind: "model" },
  qwen: { mark: "QW", title: "Qwen", kind: "model" },
  doubao: { mark: "DB", title: "Doubao", kind: "model" },
  kimi: { mark: "KM", title: "Kimi", kind: "model" },
  // Tools
  github: { mark: "GH", title: "GitHub", kind: "tool" },
  gitlab: { mark: "GL", title: "GitLab", kind: "tool" },
  slack: { mark: "SL", title: "Slack", kind: "tool" },
  notion: { mark: "NO", title: "Notion", kind: "tool" },
  linear: { mark: "LN", title: "Linear", kind: "tool" },
  vercel: { mark: "VC", title: "Vercel", kind: "tool" },
  supabase: { mark: "SB", title: "Supabase", kind: "tool" },
  figma: { mark: "FG", title: "Figma", kind: "tool" },
  stripe: { mark: "ST", title: "Stripe", kind: "tool" },
  mcp: { mark: "MCP", title: "MCP", kind: "tool" },
  // Runtime
  thinking: { mark: "", title: "Thinking", kind: "runtime" },
  "tool-call": { mark: "", title: "Tool call", kind: "runtime" },
  agent: { mark: "", title: "Agent", kind: "runtime" },
  human: { mark: "", title: "Human", kind: "runtime" },
  running: { mark: "", title: "Running", kind: "runtime" },
  blocked: { mark: "", title: "Blocked", kind: "runtime" },
  done: { mark: "", title: "Done", kind: "runtime" },
};

const SIZES: Record<
  ProviderSize,
  { box: string; text: string; glyph: string }
> = {
  sm: { box: "size-5", text: "text-[9px]", glyph: "size-3" },
  md: { box: "size-6", text: "text-[10px]", glyph: "size-3.5" },
  lg: { box: "size-8", text: "text-[13px]", glyph: "size-5" },
};

function fallbackMeta(name: string): ProviderMeta {
  const cleaned = name.replace(/[^a-zA-Z0-9]/g, "");
  return {
    mark: (cleaned.slice(0, 2) || "?").toUpperCase(),
    title: name,
    kind: "model",
  };
}

function RuntimeGlyph({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const shared = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: cn("shrink-0", className),
  };

  switch (name) {
    case "thinking":
      return (
        <svg {...shared}>
          <circle cx="6" cy="12" r="1.7" fill="currentColor" stroke="none" opacity="0.4" />
          <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" opacity="0.7" />
          <circle cx="18" cy="12" r="1.7" fill="currentColor" stroke="none" />
        </svg>
      );
    case "tool-call":
      return (
        <svg {...shared}>
          <path d="M12 3.2 19.6 7.6v8.8L12 20.8 4.4 16.4V7.6L12 3.2Z" />
        </svg>
      );
    case "agent":
      return (
        <svg {...shared}>
          <rect x="4" y="4" width="16" height="16" rx="3.2" />
          <rect x="9.6" y="9.6" width="4.8" height="4.8" rx="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "human":
      return (
        <svg {...shared}>
          <circle cx="12" cy="8.2" r="3.4" />
          <path d="M5.4 20a6.6 6.6 0 0 1 13.2 0" />
        </svg>
      );
    case "running":
      return (
        <svg {...shared}>
          <path d="M12 3.4a8.6 8.6 0 1 0 8.6 8.6" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "blocked":
      return (
        <svg {...shared}>
          <rect x="4" y="4" width="16" height="16" rx="3.2" />
          <path d="M8.4 15.6 15.6 8.4" />
        </svg>
      );
    case "done":
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="8.4" />
          <path d="M8.4 12.3l2.5 2.5 4.7-5" />
        </svg>
      );
    default:
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="8.4" />
        </svg>
      );
  }
}

export interface ProviderIconProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children" | "title"> {
  /** Key from PROVIDERS, or any string you want a fallback mark for. */
  name: string;
  /** Overrides the kind stored in PROVIDERS. */
  kind?: ProviderKind;
  size?: ProviderSize;
  /** Overrides the block mark, such as "GPT". */
  mark?: string;
  /** Accessible name and tooltip. */
  title?: string;
  /** Your own official asset. Rendered as-is, unstyled. */
  src?: string;
  /** Any CSS colour. Leave it out to follow the theme. */
  tone?: string;
}

export function ProviderIcon({
  name,
  kind,
  size = "md",
  mark,
  title,
  src,
  tone,
  className,
  ...props
}: ProviderIconProps) {
  const key = name.toLowerCase();
  const meta = PROVIDERS[key] ?? fallbackMeta(name);
  const resolvedKind = kind ?? meta.kind;
  const resolvedMark = mark ?? meta.mark;
  const resolvedTitle = title ?? meta.title;
  const s = SIZES[size];

  const shape =
    resolvedKind === "model"
      ? "rounded-[6px] bg-muted"
      : resolvedKind === "tool"
        ? "rounded-full border border-border"
        : "rounded-[6px] border border-border";

  return (
    <span
      role="img"
      aria-label={resolvedTitle}
      title={resolvedTitle}
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden align-middle",
        s.box,
        shape,
        resolvedKind === "tool" ? "text-muted-foreground" : "text-foreground",
        className
      )}
      style={tone ? { color: tone } : undefined}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={resolvedTitle} className="size-full object-cover" />
      ) : resolvedKind === "runtime" ? (
        <RuntimeGlyph name={key} className={s.glyph} />
      ) : (
        <span
          className={cn(
            "font-semibold leading-none tracking-tight",
            s.text,
            resolvedMark.length > 2 && "tracking-[-0.05em]"
          )}
        >
          {resolvedMark}
        </span>
      )}
    </span>
  );
}

export interface ProviderBadgeProps extends ProviderIconProps {
  /** Text next to the mark. Defaults to the readable name. */
  label?: string;
  /** Show the kind after the label. */
  showKind?: boolean;
}

export function ProviderBadge({
  label,
  showKind = false,
  size = "sm",
  className,
  ...props
}: ProviderBadgeProps) {
  const meta = PROVIDERS[props.name.toLowerCase()] ?? fallbackMeta(props.name);
  const text = label ?? meta.title;
  const resolvedKind = props.kind ?? meta.kind;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-background py-0.5 pl-0.5 pr-2 align-middle",
        className
      )}
    >
      <ProviderIcon {...props} size={size} title={text} />
      <span className="text-xs font-medium text-foreground">{text}</span>
      {showKind && (
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {resolvedKind}
        </span>
      )}
    </span>
  );
}

export interface ProviderStackProps {
  names: string[];
  size?: ProviderSize;
  /** How many marks to show before collapsing into +N. */
  max?: number;
  className?: string;
}

export function ProviderStack({
  names,
  size = "sm",
  max = 4,
  className,
}: ProviderStackProps) {
  const shown = names.slice(0, max);
  const rest = names.length - shown.length;
  const overlap = size === "lg" ? "-ml-2" : size === "md" ? "-ml-1.5" : "-ml-1";
  const restBox =
    size === "lg" ? "size-8" : size === "md" ? "size-6" : "size-5";

  return (
    <span className={cn("inline-flex items-center", className)}>
      {shown.map((name, i) => (
        <ProviderIcon
          key={`${name}-${i}`}
          name={name}
          size={size}
          className={cn("ring-2 ring-background", i > 0 && overlap)}
        />
      ))}
      {rest > 0 && (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-muted font-semibold text-muted-foreground ring-2 ring-background",
            restBox,
            overlap,
            size === "lg" ? "text-xs" : "text-[10px]"
          )}
        >
          +{rest}
        </span>
      )}
    </span>
  );
}
