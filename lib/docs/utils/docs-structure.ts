import { promises as fs } from "fs";
import path from "path";
import type { DocItem, DocStructure } from "../types";
import { DIRECTORY_ICON_MAP, FILE_ICON_MAP } from "../constants";

async function readDirectoryRecursive(
  dirPath: string,
  basePath: string = "",
  meta: Record<string, string> = {}
): Promise<DocItem[]> {
  const items: DocItem[] = [];

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    const sortedEntries = entries.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

    for (const entry of sortedEntries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.join(basePath, entry.name);

      if (entry.isDirectory()) {
        if (entry.name.startsWith(".") || entry.name === "node_modules") {
          continue;
        }

        const children = await readDirectoryRecursive(
          fullPath,
          relativePath,
          meta
        );

        if (children.length > 0) {
          const title = meta[relativePath] || formatTitle(entry.name);
          items.push({
            title,
            href: relativePath,
            icon: getDirectoryIcon(entry.name),
            children,
            isDirectory: true,
          });
        }
      } else if (entry.isFile()) {
        if (entry.name.endsWith(".mdx")) {
          const fileName = entry.name.replace(".mdx", "");
          const href = relativePath.replace(".mdx", "");
          const title = meta[href] || formatTitle(fileName);
          items.push({
            title,
            href,
            icon: getFileIcon(fileName),
            isFile: true,
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }

  return items;
}

export function formatTitle(name: string): string {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim();
}

export function getDirectoryIcon(dirName: string): string {
  return DIRECTORY_ICON_MAP[dirName.toLowerCase()] || "📁";
}

export function getFileIcon(fileName: string): string {
  return FILE_ICON_MAP[fileName.toLowerCase()] || "📄";
}

async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

export async function getDocsStructure(
  locale: string = "en",
  docsDir?: string
): Promise<DocStructure> {
  const resolvedDocsDir = docsDir || path.join(process.cwd(), "docs");
  const localeDir = path.join(resolvedDocsDir, locale);
  const metaPath = path.join(localeDir, "_meta.json");

  let items: DocItem[] = [];
  let meta: Record<string, string> = {};

  try {
    try {
      if (await fileExists(metaPath)) {
        const metaContent = await fs.readFile(metaPath, "utf-8");
        meta = JSON.parse(metaContent);
      }
    } catch (error) {
      console.error(
        `Error reading or parsing _meta.json for locale ${locale}:`,
        error
      );
    }

    if (await directoryExists(localeDir)) {
      items = await readDirectoryRecursive(localeDir, "", meta);
    } else {
      if (await directoryExists(resolvedDocsDir)) {
        items = await readDirectoryRecursive(resolvedDocsDir, "", meta);
      }
    }
  } catch (error) {
    console.error("Error reading docs structure:", error);
    items = [];
  }

  const totalCount = countFiles(items);

  return {
    items,
    totalCount,
  };
}

function countFiles(items: DocItem[]): number {
  let count = 0;

  for (const item of items) {
    if (item.isFile) {
      count++;
    }
    if (item.children) {
      count += countFiles(item.children);
    }
  }

  return count;
}

export function flattenDocsStructure(items: DocItem[]): DocItem[] {
  const flattened: DocItem[] = [];

  function flatten(items: DocItem[], parentPath: string = "") {
    for (const item of items) {
      const fullPath = parentPath ? `${parentPath}/${item.href}` : item.href;

      if (item.isFile) {
        flattened.push({
          ...item,
          href: fullPath,
        });
      }

      if (item.children) {
        flatten(item.children, fullPath);
      }
    }
  }

  flatten(items);
  return flattened;
}
