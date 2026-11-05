import type { ThemeConfig, ThemeTokens, SemanticColors } from "../types";
import { COLOR_VAR_MAP, TAILWIND_COLOR_VAR_MAP, RADIUS_VAR } from "../constants";
import { RADIUS_UTILITY_VARS } from "../runtime-vars";
import { cssToHSL, hslToHex, hslCSStoRGBCSS } from "./color";

// ---------------------------------------------------------------------------
// Token -> CSS variable map (space-separated RGB for current globals.css compat)
// ---------------------------------------------------------------------------

export function tokensToRGBVarMap(tokens: ThemeTokens): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const [key, cssVar] of Object.entries(COLOR_VAR_MAP)) {
    const hslValue = tokens.colors[key as keyof SemanticColors];
    if (hslValue) {
      vars[cssVar] = hslCSStoRGBCSS(hslValue);
    }
  }

  vars[RADIUS_VAR] = tokens.radius.base;
  Object.assign(vars, RADIUS_UTILITY_VARS);

  return vars;
}

// ---------------------------------------------------------------------------
// CSS export (full stylesheet)
// ---------------------------------------------------------------------------

export function generateCSSExport(config: ThemeConfig): string {
  const lines: string[] = [
    `/* Screen Theme: ${config.name} */`,
    `/* Generated at ${new Date().toISOString().split("T")[0]} */`,
    "",
    ":root {",
  ];

  for (const [key, cssVar] of Object.entries(COLOR_VAR_MAP)) {
    const val = config.light.colors[key as keyof SemanticColors];
    if (val) lines.push(`  ${cssVar}: ${hslCSStoRGBCSS(val)};`);
  }
  lines.push(`  ${RADIUS_VAR}: ${config.light.radius.base};`);
  for (const [name, value] of Object.entries(RADIUS_UTILITY_VARS)) {
    lines.push(`  ${name}: ${value};`);
  }
  lines.push("}");
  lines.push("");

  lines.push(".dark {");
  for (const [key, cssVar] of Object.entries(COLOR_VAR_MAP)) {
    const val = config.dark.colors[key as keyof SemanticColors];
    if (val) lines.push(`  ${cssVar}: ${hslCSStoRGBCSS(val)};`);
  }
  lines.push(`  ${RADIUS_VAR}: ${config.dark.radius.base};`);
  lines.push("}");

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Tailwind v4 @theme export
// ---------------------------------------------------------------------------

function hslCSSToHex(hslCSS: string): string {
  return hslToHex(cssToHSL(hslCSS));
}

export function generateTailwindExport(config: ThemeConfig): string {
  const lines: string[] = [
    `/* Screen Theme: ${config.name} – Tailwind v4 @theme */`,
    "",
    "@theme {",
  ];

  for (const [key, cssVar] of Object.entries(TAILWIND_COLOR_VAR_MAP)) {
    const val = config.light.colors[key as keyof SemanticColors];
    if (val) lines.push(`  ${cssVar}: ${hslCSSToHex(val)};`);
  }
  lines.push(`  ${RADIUS_VAR}: ${config.light.radius.base};`);
  for (const [name, value] of Object.entries(RADIUS_UTILITY_VARS)) {
    lines.push(`  ${name}: ${value};`);
  }
  lines.push("}");
  lines.push("");

  lines.push(".dark {");
  for (const [key, cssVar] of Object.entries(TAILWIND_COLOR_VAR_MAP)) {
    const val = config.dark.colors[key as keyof SemanticColors];
    if (val) lines.push(`  ${cssVar}: ${hslCSSToHex(val)};`);
  }
  lines.push("}");

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// JSON export
// ---------------------------------------------------------------------------

export function generateJSONExport(config: ThemeConfig): string {
  return JSON.stringify(
    {
      name: config.name,
      version: "1.0",
      light: config.light,
      dark: config.dark,
    },
    null,
    2
  );
}

// ---------------------------------------------------------------------------
// JSON import
// ---------------------------------------------------------------------------

export function parseJSONImport(json: string): ThemeConfig | null {
  try {
    const data = JSON.parse(json);
    if (!data.light?.colors || !data.dark?.colors) return null;
    return {
      id: `custom-${Date.now()}`,
      name: data.name || "Imported Theme",
      light: data.light,
      dark: data.dark,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// CSS import (parses :root { ... } and .dark { ... })
// ---------------------------------------------------------------------------

const REVERSE_COLOR_VAR_MAP = Object.fromEntries(
  Object.entries(COLOR_VAR_MAP).map(([k, v]) => [v, k])
);

function parseColorBlock(block: string): Partial<Record<string, string>> {
  const result: Record<string, string> = {};
  const re = /--([\w-]+)\s*:\s*([^;]+);/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(block)) !== null) {
    const varName = `--${match[1]}`;
    const value = match[2].trim();
    const tokenKey = REVERSE_COLOR_VAR_MAP[varName];
    if (tokenKey) {
      result[tokenKey] = value;
    }
  }
  return result;
}

export function parseCSSImport(css: string): ThemeConfig | null {
  try {
    const rootMatch = css.match(/:root\s*\{([^}]+)\}/);
    const darkMatch = css.match(/\.dark\s*\{([^}]+)\}/);
    if (!rootMatch) return null;

    const lightColors = parseColorBlock(rootMatch[1]);
    const darkColors = darkMatch ? parseColorBlock(darkMatch[1]) : lightColors;

    const radiusMatch = rootMatch[1].match(/--radius\s*:\s*([^;]+);/);
    const radius = radiusMatch ? radiusMatch[1].trim() : "0.75rem";

    const defaultTokens = {
      radius: { base: radius },
      typography: {
        fontFamily: { sans: "Inter, system-ui, sans-serif", display: "'Cal Sans', system-ui, sans-serif", mono: "ui-monospace, monospace" },
        scale: "default" as const,
      },
      spacing: { scale: "default" as const },
      shadows: { style: "default" as const },
      animations: { speed: "default" as const },
    };

    return {
      id: `import-${Date.now()}`,
      name: "Imported Theme",
      light: { colors: lightColors as unknown as ThemeConfig["light"]["colors"], ...defaultTokens },
      dark: { colors: (darkColors || lightColors) as unknown as ThemeConfig["dark"]["colors"], ...defaultTokens },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  } catch {
    return null;
  }
}
