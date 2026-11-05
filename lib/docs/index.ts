// Components (client-safe)
export {
  DocLayout,
  DocSidebarNavigation,
  DocSearch,
  DocBreadcrumb,
  DocTableOfContents,
  DocContent,
  DocReadingProgress,
  DocNavigation,
  DocCodeHighlight,
  Card,
  CardGrid,
} from "./components";

// Hooks (client-safe)
export { useDocsStructure, useTOC } from "./hooks";

// Constants (client-safe)
export {
  DEFAULT_DOCS_API_ENDPOINT,
  DEFAULT_DOCS_BASE_PATH,
  DEFAULT_NAV_ITEMS,
  DIRECTORY_ICON_MAP,
  FILE_ICON_MAP,
} from "./constants";

// Types (client-safe)
export type {
  DocItem,
  DocStructure,
  TOCItem,
  DocLayoutProps,
  DocSidebarNavigationProps,
  DocSearchProps,
  DocBreadcrumbProps,
  DocTableOfContentsProps,
  DocContentProps,
  DocReadingProgressProps,
  DocNavigationProps,
  DocCodeHighlightProps,
  DocsStructureConfig,
  MDXCardProps,
} from "./types";
