// Server-only utilities (uses Node.js fs module)
// Import from "@/lib/docs/server" in server components and API routes only
export {
  getDocsStructure,
  flattenDocsStructure,
  formatTitle,
  getDirectoryIcon,
  getFileIcon,
} from "./utils/docs-structure";

export type { DocItem, DocStructure, DocsStructureConfig } from "./types";
