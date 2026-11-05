"use client";

import { useCallback } from "react";
import { useThemeTokens } from "../theme-provider";
import type { ExportFormat } from "../types";

export function useThemeExport() {
  const { exportTheme, activeTheme } = useThemeTokens();

  const copyToClipboard = useCallback(
    async (format: ExportFormat) => {
      const text = exportTheme(format);
      await navigator.clipboard.writeText(text);
      return text;
    },
    [exportTheme]
  );

  const downloadFile = useCallback(
    (format: ExportFormat) => {
      const text = exportTheme(format);
      const ext = format === "json" ? "json" : "css";
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `solokit-theme-${activeTheme.name.toLowerCase().replace(/\s+/g, "-")}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [exportTheme, activeTheme.name]
  );

  return { copyToClipboard, downloadFile, getExportText: exportTheme };
}
