"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Braces, ChevronDown } from "lucide-react";

export interface A2uiComponent {
  id: string;
  type: string;
  props?: Record<string, unknown>;
  children?: string[];
}

export interface A2uiSurfaceSpec {
  root: string;
  components: A2uiComponent[];
}

export interface A2uiSurfaceProps {
  spec: A2uiSurfaceSpec;
  title?: string;
  /** Extra renderers merged over the built-in catalog. */
  catalog?: Record<string, A2uiRenderer>;
  onAction?: (action: string, componentId: string) => void;
  showSource?: boolean;
  className?: string;
}

export type A2uiRenderer = (input: {
  props: Record<string, unknown>;
  children: React.ReactNode;
  id: string;
  onAction?: (action: string, componentId: string) => void;
}) => React.ReactNode;

function text(props: Record<string, unknown>, key: string): string | undefined {
  const value = props[key];
  return typeof value === "string" ? value : undefined;
}

function count(props: Record<string, unknown>, key: string, fallback: number): number {
  const value = props[key];
  return typeof value === "number" ? value : fallback;
}

const gapClass: Record<number, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
};

function Stack({ gap, children }: { gap: number; children: React.ReactNode }) {
  return <div className={cn("flex flex-col", gapClass[gap] ?? "gap-2")}>{children}</div>;
}

function Row({ gap, children }: { gap: number; children: React.ReactNode }) {
  return <div className={cn("flex flex-wrap items-stretch", gapClass[gap] ?? "gap-2")}>{children}</div>;
}

const badgeTone: Record<string, string> = {
  neutral: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  danger: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
  info: "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
};

const BUILTIN: Record<string, A2uiRenderer> = {
  heading: ({ props }) => {
    const level = count(props, "level", 3);
    const className =
      level <= 2
        ? "text-base font-semibold text-gray-900 dark:text-white"
        : "text-[13px] font-semibold text-gray-900 dark:text-white";
    return <p className={className}>{text(props, "text")}</p>;
  },
  text: ({ props }) => (
    <p className="text-[13px] leading-relaxed text-gray-600 dark:text-gray-300">{text(props, "text")}</p>
  ),
  muted: ({ props }) => <p className="text-[11px] text-gray-400">{text(props, "text")}</p>,
  column: ({ props, children }) => <Stack gap={count(props, "gap", 2)}>{children}</Stack>,
  row: ({ props, children }) => <Row gap={count(props, "gap", 2)}>{children}</Row>,
  list: ({ children }) => (
    <div className="divide-y divide-gray-100 dark:divide-gray-800">{children}</div>
  ),
  card: ({ props, children }) => (
    <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950">
      {text(props, "title") ? (
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
          {text(props, "title")}
        </p>
      ) : null}
      {children}
    </div>
  ),
  divider: () => <div className="h-px w-full bg-gray-100 dark:bg-gray-800" />,
  badge: ({ props }) => (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
        badgeTone[text(props, "tone") ?? "neutral"] ?? badgeTone.neutral,
      )}
    >
      {text(props, "text")}
    </span>
  ),
  field: ({ props }) => (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[11px] text-gray-400">{text(props, "label")}</span>
      <span className="text-[12px] font-medium tabular-nums text-gray-800 dark:text-gray-200">
        {text(props, "value")}
      </span>
    </div>
  ),
  button: ({ props, id, onAction }) => {
    const action = text(props, "action") ?? id;
    const primary = props.variant === "primary";
    return (
      <button
        type="button"
        onClick={() => onAction?.(action, id)}
        className={cn(
          "rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors",
          primary
            ? "bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
            : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900",
        )}
      >
        {text(props, "label") ?? action}
      </button>
    );
  },
  image: ({ props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={text(props, "src") ?? ""}
      alt={text(props, "alt") ?? ""}
      className="max-h-32 rounded-lg border border-gray-100 object-cover dark:border-gray-800"
    />
  ),
};

export function A2uiSurface({
  spec,
  title = "Generated surface",
  catalog,
  onAction,
  showSource = false,
  className,
}: A2uiSurfaceProps) {
  const [open, setOpen] = React.useState(showSource);
  const byId = React.useMemo(() => {
    const map = new Map<string, A2uiComponent>();
    spec.components.forEach((component) => map.set(component.id, component));
    return map;
  }, [spec]);

  const renderers = React.useMemo(() => ({ ...BUILTIN, ...catalog }), [catalog]);

  function render(id: string, depth = 0): React.ReactNode {
    const node = byId.get(id);
    if (!node) return null;
    if (depth > 12) return null;

    const props = node.props ?? {};
    const children = (node.children ?? []).map((childId) => (
      <React.Fragment key={childId}>{render(childId, depth + 1)}</React.Fragment>
    ));
    const Renderer = renderers[node.type];

    if (!Renderer) {
      return (
        <div
          key={id}
          className="rounded-lg border border-dashed border-amber-300 bg-amber-50/60 px-2.5 py-2 text-[11px] text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
        >
          Unsupported component: <span className="font-mono">{node.type}</span>
        </div>
      );
    }

    return (
      <React.Fragment key={id}>
        {Renderer({ props, children, id: node.id, onAction })}
      </React.Fragment>
    );
  }

  return (
    <section
      className={cn(
        "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-2.5 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
          <span className="rounded-full bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-600 dark:bg-violet-950/60 dark:text-violet-300">
            A2UI
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-900"
        >
          <Braces size={11} />
          Payload
          <ChevronDown size={10} className={cn("transition-transform", open ? "" : "-rotate-90")} />
        </button>
      </header>

      {open && (
        <pre className="max-h-56 overflow-auto border-b border-gray-100 bg-gray-50 px-4 py-2.5 font-mono text-[10px] leading-relaxed text-gray-600 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-300">
          {JSON.stringify(spec, null, 2)}
        </pre>
      )}

      <div className="space-y-2.5 px-4 py-3">{render(spec.root)}</div>
    </section>
  );
}
