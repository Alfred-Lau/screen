import { ReactNode } from "react";

export interface DocItem {
  title: string;
  href: string;
  icon?: string;
  children?: DocItem[];
  isDirectory?: boolean;
  isFile?: boolean;
}

export interface DocStructure {
  items: DocItem[];
  totalCount: number;
}

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export interface DocLayoutProps {
  children: ReactNode;
  navItems?: DocItem[];
  className?: string;
  /** Custom header component to replace the default */
  header?: ReactNode;
  /** Custom footer component to replace the default */
  footer?: ReactNode;
  /** Custom search component to replace the default */
  searchComponent?: ReactNode;
  /** API endpoint to fetch docs structure. Defaults to "/api/docs/structure" */
  structureApiEndpoint?: string;
  /** Labels for mobile sidebar */
  mobileLabels?: {
    title?: string;
    toggle?: string;
  };
}

export interface DocSidebarNavigationProps {
  items: DocItem[];
  className?: string;
  /** Base path prefix for doc links. Defaults to "/{locale}/docs" */
  basePath?: string;
}

export interface DocSearchProps {
  className?: string;
  /** API endpoint to fetch docs structure for search. Defaults to "/api/docs/structure" */
  structureApiEndpoint?: string;
  /** Base path prefix for doc links. Defaults to "/{locale}/docs" */
  basePath?: string;
  /** i18n labels for the search dialog */
  labels?: {
    buttonText?: string;
    placeholder?: string;
    dialogTitle?: string;
    noResults?: string;
    groupHeading?: string;
  };
}

export interface DocBreadcrumbProps {
  slug: string;
  title: string;
  className?: string;
  /** Base path prefix for doc links. Defaults to "/{locale}/docs" */
  basePath?: string;
  /** Custom slug-to-name mapper */
  getSegmentName?: (slug: string) => string;
  /** i18n labels */
  labels?: {
    home?: string;
    docs?: string;
  };
}

export interface DocTableOfContentsProps {
  content: string;
  className?: string;
  /** Label for the TOC heading. Defaults to "On this page" */
  title?: string;
}

export interface DocContentProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export interface DocReadingProgressProps {
  className?: string;
}

export interface DocNavigationProps {
  currentSlug: string;
  className?: string;
  /** Flat ordered list of all doc items for prev/next navigation */
  items?: DocItem[];
  /** Base path prefix for doc links. Defaults to "/{locale}/docs" */
  basePath?: string;
  /** i18n labels */
  labels?: {
    prev?: string;
    next?: string;
  };
}

export interface DocCodeHighlightProps {
  children: ReactNode;
  className?: string;
}

export interface DocsStructureConfig {
  docsDir: string;
  locale?: string;
}

export interface MDXCardProps {
  title: string;
  description?: string;
  href: string;
  icon?: ReactNode;
  image?: string;
}
