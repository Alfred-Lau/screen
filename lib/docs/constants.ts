export const DEFAULT_DOCS_API_ENDPOINT = "/api/docs/structure";
export const DEFAULT_DOCS_BASE_PATH = "/docs";

export const DEFAULT_NAV_ITEMS = [
  { title: "Getting Started", href: "getting-started", icon: "🚀", isFile: true },
  { title: "AI Crawler", href: "ai-crawler", icon: "🤖", isFile: true },
  { title: "SEO", href: "seo", icon: "🔍", isFile: true },
  { title: "Geo", href: "geo", icon: "🌍", isFile: true },
  { title: "Agent Usage", href: "agent-usage", icon: "🛠️", isFile: true },
  { title: "FAQ", href: "faq", icon: "❓", isFile: true },
];

export const DIRECTORY_ICON_MAP: Record<string, string> = {
  zh: "🇨🇳",
  en: "🇺🇸",
  components: "🧩",
  utils: "🔧",
  examples: "📝",
  guides: "📚",
  api: "🔌",
  tutorials: "🎓",
  reference: "📖",
};

export const FILE_ICON_MAP: Record<string, string> = {
  "getting-started": "🚀",
  "ai-crawler": "🤖",
  seo: "🔍",
  geo: "🌍",
  "agent-usage": "🛠️",
  faq: "❓",
  readme: "📖",
  index: "🏠",
};
