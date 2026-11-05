import type { ThemeTokens, ThemeConfig, ExportFormat } from "./types";
import { COLOR_VAR_MAP, TAILWIND_COLOR_VAR_MAP, RADIUS_VAR } from "./constants";
import type { SemanticColors } from "./types";
import { hslCSStoRGBCSS, cssToHSL, hslToHex } from "./utils/color";
import {
  generateCSSExport,
  generateTailwindExport,
  generateJSONExport,
} from "./utils/css-generator";
import { RUNTIME_MANAGED_VARS, runtimeVars } from "./runtime-vars";

const MANAGED_VARS = [
  ...Object.values(COLOR_VAR_MAP),
  ...Object.values(TAILWIND_COLOR_VAR_MAP),
  RADIUS_VAR,
  "--font-sans",
  "--font-display",
  "--font-mono",
  ...RUNTIME_MANAGED_VARS,
];

/**
 * Core engine for applying ThemeTokens to the DOM via CSS custom properties
 * and exporting theme configurations in various formats.
 */
export const ThemeEngine = {
  /**
   * Convert a ThemeTokens object to a flat CSS variable map.
   * Sets BOTH the shadcn variables (--primary etc, space-separated RGB)
   * AND the Tailwind v4 @theme variables (--color-primary etc, hex)
   * to ensure both variable namespaces are in sync.
   */
  tokensToCSSVars(tokens: ThemeTokens): Record<string, string> {
    const vars: Record<string, string> = {};

    for (const [key, cssVar] of Object.entries(COLOR_VAR_MAP)) {
      const hslValue = tokens.colors[key as keyof SemanticColors];
      if (hslValue) {
        vars[cssVar] = hslCSStoRGBCSS(hslValue);
      }
    }

    for (const [key, cssVar] of Object.entries(TAILWIND_COLOR_VAR_MAP)) {
      const hslValue = tokens.colors[key as keyof SemanticColors];
      if (hslValue) {
        vars[cssVar] = hslToHex(cssToHSL(hslValue));
      }
    }

    vars[RADIUS_VAR] = tokens.radius.base;

    if (tokens.typography?.fontFamily) {
      vars["--font-sans"] = tokens.typography.fontFamily.sans;
      vars["--font-display"] = tokens.typography.fontFamily.display;
      vars["--font-mono"] = tokens.typography.fontFamily.mono;
    }

    Object.assign(vars, runtimeVars(tokens, vars));

    return vars;
  },

  /**
   * Apply tokens to the DOM by setting inline style properties on <html>.
   * Inline styles naturally override :root declarations in the stylesheet.
   */
  applyTokens(tokens: ThemeTokens): void {
    if (typeof document === "undefined") return;
    const el = document.documentElement;
    const vars = ThemeEngine.tokensToCSSVars(tokens);
    for (const [prop, value] of Object.entries(vars)) {
      el.style.setProperty(prop, value);
    }
  },

  /**
   * Remove all managed CSS variable overrides from <html>,
   * allowing the stylesheet defaults to take effect again.
   */
  resetTokens(): void {
    if (typeof document === "undefined") return;
    const el = document.documentElement;
    for (const prop of MANAGED_VARS) {
      el.style.removeProperty(prop);
    }
  },

  /**
   * Export a ThemeConfig in the requested format.
   */
  exportTheme(config: ThemeConfig, format: ExportFormat): string {
    switch (format) {
      case "css":
        return generateCSSExport(config);
      case "tailwind":
        return generateTailwindExport(config);
      case "json":
        return generateJSONExport(config);
    }
  },
};
