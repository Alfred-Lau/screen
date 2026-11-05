import fs from "node:fs";
import path from "node:path";
import registryJson from "@/registry.json";
import { REGISTRY_ORIGIN, installCommand } from "@/lib/registry/site";

interface RegistryFile {
  path: string;
  target?: string;
}

interface RegistryItem {
  name: string;
  title?: string;
  description?: string;
  categories?: string[];
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
}

export interface CatalogItem {
  name: string;
  title: string;
  description: string;
  category: string;
  dependencies: string[];
  registryDependencies: string[];
  install: string;
  pageUrl: string;
  files: RegistryFile[];
}

const CATEGORY_ORDER = ["agent", "chatbot", "dashboard", "marketing", "docs", "form", "animation"] as const;

const CATEGORY_LABELS: Record<string, string> = {
  agent: "Agent",
  chatbot: "Chat",
  dashboard: "Dashboard",
  marketing: "Marketing",
  docs: "Docs",
  form: "Forms",
  animation: "Motion",
};

function asItems(value: unknown): RegistryItem[] {
  if (typeof value !== "object" || value === null || !("items" in value)) return [];
  const items = value.items;
  if (!Array.isArray(items)) return [];
  return items.filter((item): item is RegistryItem => {
    return typeof item === "object" && item !== null && "name" in item && typeof item.name === "string";
  });
}

function toCatalogItem(item: RegistryItem): CatalogItem {
  const category = item.categories?.[0] ?? "other";
  return {
    name: item.name,
    title: item.title ?? item.name,
    description: item.description ?? "",
    category,
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    install: installCommand(item.name),
    pageUrl: `${REGISTRY_ORIGIN}/r/${item.name}.json`,
    files: item.files ?? [],
  };
}

export function listCatalog(): CatalogItem[] {
  return asItems(registryJson).map(toCatalogItem);
}

export function findCatalogItem(name: string): CatalogItem | undefined {
  const needle = name.trim().toLowerCase();
  const items = listCatalog();
  return (
    items.find((item) => item.name.toLowerCase() === needle) ??
    items.find((item) => item.title.toLowerCase() === needle)
  );
}

export function searchCatalog(query: string, limit: number): CatalogItem[] {
  const items = listCatalog();
  const capped = Math.min(20, Math.max(1, limit));
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return items.slice(0, capped);

  const scored = items
    .map((item) => {
      const name = item.name.toLowerCase();
      const title = item.title.toLowerCase();
      const description = item.description.toLowerCase();
      const category = item.category.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (name === term) score += 8;
        else if (name.includes(term)) score += 5;
        if (title.includes(term)) score += 3;
        if (category.includes(term)) score += 2;
        if (description.includes(term)) score += 1;
      }
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));

  return scored.slice(0, capped).map((entry) => entry.item);
}

export interface SourceFile {
  path: string;
  target: string;
  content: string;
}

export function readItemSource(item: CatalogItem): SourceFile[] {
  const root = path.resolve(process.cwd());
  return item.files.map((file) => {
    const full = path.resolve(root, file.path);
    const inside = full === root || full.startsWith(`${root}${path.sep}`);
    if (!inside) {
      return { path: file.path, target: file.target ?? file.path, content: "" };
    }
    const content = fs.existsSync(full) ? fs.readFileSync(full, "utf8") : "";
    return { path: file.path, target: file.target ?? file.path, content };
  });
}

function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

export function renderLlmsTxt(): string {
  const items = listCatalog();
  const groups = new Map<string, CatalogItem[]>();
  for (const item of items) {
    const list = groups.get(item.category) ?? [];
    list.push(item);
    groups.set(item.category, list);
  }

  const ordered = [
    ...CATEGORY_ORDER.filter((category) => groups.has(category)),
    ...[...groups.keys()].filter((category) => !CATEGORY_ORDER.includes(category as (typeof CATEGORY_ORDER)[number])).sort(),
  ];

  const lines = [
    "# SoloKit",
    "",
    `> React UI for AI products. ${items.length} components, blocks and docs for chat, checkout, auth and documentation. Each piece is one or more TSX files you install with the shadcn CLI. Styles use Tailwind. Light mode, dark mode and a theme editor are included.`,
    "",
    "The component library is free to copy. The Next.js template is a separate starter with auth, payments, chatbot and docs already wired together.",
    "",
    "## How to add an item",
    "",
    `- Install: \`${installCommand("<name>")}\`. The CLI reads \`${REGISTRY_ORIGIN}/r/<name>.json\` and writes the files into your project.`,
    `- Short names: add \`"@solokit": "${REGISTRY_ORIGIN}/r/{name}.json"\` under registries in components.json, then \`npx shadcn@latest add @solokit/<name>\`.`,
    `- MCP server: ${REGISTRY_ORIGIN}/api/mcp (Streamable HTTP). Search items and read their source from Claude Code, Cursor, VS Code or Codex. No access key.`,
    `- Plain index: ${REGISTRY_ORIGIN}/llms.txt`,
    `- Agent catalog: ${REGISTRY_ORIGIN}/r/agent-catalog.json. Every agent component with its description, props, and install command in one file.`,
    `- Docs: ${REGISTRY_ORIGIN}/en/docs`,
    "",
  ];

  for (const category of ordered) {
    const group = groups.get(category);
    if (!group || group.length === 0) continue;
    lines.push(`## ${categoryLabel(category)}`, "");
    for (const item of group) {
      lines.push(`- [${item.title}](${item.pageUrl}): ${item.description} Install with \`${item.install}\`.`);
    }
    lines.push("");
  }

  return `${lines.join("\n").trim()}\n`;
}
