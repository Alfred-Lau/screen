export interface HSLColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface RGBColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

// ---------------------------------------------------------------------------
// Format conversions
// ---------------------------------------------------------------------------

export function hexToRGB(hex: string): RGBColor {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: RGBColor): string {
  const toHex = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHSL({ r, g, b }: RGBColor): HSLColor {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  const l = (max + min) / 2;

  if (d === 0) return { h: 0, s: 0, l: Math.round(l * 100) };

  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRGB({ h, s, l }: HSLColor): RGBColor {
  const sn = s / 100;
  const ln = l / 100;

  if (sn === 0) {
    const v = Math.round(ln * 255);
    return { r: v, g: v, b: v };
  }

  const hueToRgb = (p: number, q: number, t: number) => {
    let tn = t;
    if (tn < 0) tn += 1;
    if (tn > 1) tn -= 1;
    if (tn < 1 / 6) return p + (q - p) * 6 * tn;
    if (tn < 1 / 2) return q;
    if (tn < 2 / 3) return p + (q - p) * (2 / 3 - tn) * 6;
    return p;
  };

  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  const hn = h / 360;

  return {
    r: Math.round(hueToRgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, hn) * 255),
    b: Math.round(hueToRgb(p, q, hn - 1 / 3) * 255),
  };
}

export function hexToHSL(hex: string): HSLColor {
  return rgbToHSL(hexToRGB(hex));
}

export function hslToHex(hsl: HSLColor): string {
  return rgbToHex(hslToRGB(hsl));
}

// ---------------------------------------------------------------------------
// CSS string helpers
// ---------------------------------------------------------------------------

/** Produces the space-separated HSL string used in CSS variables: "217 91% 60%" */
export function hslToCSS(hsl: HSLColor): string {
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
}

/** Parses "217 91% 60%" back to an HSLColor object */
export function cssToHSL(css: string): HSLColor {
  const parts = css.trim().replace(/%/g, "").split(/\s+/);
  return { h: Number(parts[0]), s: Number(parts[1]), l: Number(parts[2]) };
}

/** Produces space-separated RGB string: "37 99 235" (current format in globals.css) */
export function rgbToCSS({ r, g, b }: RGBColor): string {
  return `${r} ${g} ${b}`;
}

/** Parses "37 99 235" back to RGBColor */
export function cssToRGB(css: string): RGBColor {
  const parts = css.trim().split(/\s+/);
  return { r: Number(parts[0]), g: Number(parts[1]), b: Number(parts[2]) };
}

/** Convert HSL CSS string to space-separated RGB string (for current globals.css compatibility) */
export function hslCSStoRGBCSS(hslCSS: string): string {
  return rgbToCSS(hslToRGB(cssToHSL(hslCSS)));
}

/** Convert hex to space-separated RGB string */
export function hexToRGBCSS(hex: string): string {
  return rgbToCSS(hexToRGB(hex));
}

// ---------------------------------------------------------------------------
// WCAG contrast helpers
// ---------------------------------------------------------------------------

function luminance({ r, g, b }: RGBColor): number {
  const a = [r, g, b].map((v) => {
    const vn = v / 255;
    return vn <= 0.03928 ? vn / 12.92 : Math.pow((vn + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function contrastRatio(c1: RGBColor, c2: RGBColor): number {
  const l1 = luminance(c1);
  const l2 = luminance(c2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Returns white or black (as HSL CSS) depending on which has better contrast */
export function generateForeground(backgroundHSL: string): string {
  const bg = hslToRGB(cssToHSL(backgroundHSL));
  const white: RGBColor = { r: 255, g: 255, b: 255 };
  const black: RGBColor = { r: 0, g: 0, b: 0 };
  return contrastRatio(bg, white) > contrastRatio(bg, black)
    ? "0 0% 100%"
    : "0 0% 0%";
}

/** Returns a lighter or darker foreground with a specific lightness for softer contrast */
export function generateSoftForeground(
  backgroundHSL: string,
  lightFg = "210 40% 98%",
  darkFg = "222 47% 11%"
): string {
  const bg = hslToRGB(cssToHSL(backgroundHSL));
  const light = hslToRGB(cssToHSL(lightFg));
  const dark = hslToRGB(cssToHSL(darkFg));
  return contrastRatio(bg, light) > contrastRatio(bg, dark) ? lightFg : darkFg;
}

// ---------------------------------------------------------------------------
// Palette generation
// ---------------------------------------------------------------------------

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export interface GeneratedPalette {
  light: Record<string, string>;
  dark: Record<string, string>;
}

/**
 * Given a primary hex colour and a base neutral (e.g. "slate", "gray", "zinc"),
 * generates a full set of semantic colour tokens for both light and dark modes.
 */
export function generatePalette(
  primaryHex: string,
  baseNeutral: "neutral" | "slate" | "gray" | "zinc" | "stone" = "slate"
): GeneratedPalette {
  const primary = hexToHSL(primaryHex);

  const neutralHues: Record<string, number> = {
    neutral: 0,
    slate: 215,
    gray: 220,
    zinc: 240,
    stone: 25,
  };
  const nh = neutralHues[baseNeutral];

  const hsl = (h: number, s: number, l: number) =>
    hslToCSS({ h: Math.round(h), s: Math.round(s), l: Math.round(l) });

  // Light mode
  const light: Record<string, string> = {
    background: hsl(0, 0, 100),
    foreground: hsl(nh, 47, 11),
    card: hsl(0, 0, 100),
    cardForeground: hsl(nh, 47, 11),
    popover: hsl(0, 0, 100),
    popoverForeground: hsl(nh, 47, 11),
    primary: hslToCSS(primary),
    primaryForeground: hsl(0, 0, primary.l > 55 ? 5 : 98),
    secondary: hsl(nh, 20, 96),
    secondaryForeground: hsl(nh, 25, 32),
    muted: hsl(nh, 15, 97),
    mutedForeground: hsl(nh, 15, 46),
    accent: hsl(nh, 20, 96),
    accentForeground: hsl(nh, 25, 32),
    destructive: hsl(0, 84, 60),
    destructiveForeground: hsl(0, 0, 98),
    border: hsl(nh, 25, 90),
    input: hsl(nh, 25, 90),
    ring: hslToCSS(primary),
    professionalBlue: hsl(217, 91, 60),
    professionalGray: hsl(215, 16, 35),
    professionalLight: hsl(210, 40, 98),
    successGreen: hsl(142, 71, 45),
    warningOrange: hsl(25, 95, 53),
    chart1: hsl(primary.h, 80, 55),
    chart2: hsl((primary.h + 72) % 360, 65, 50),
    chart3: hsl((primary.h + 144) % 360, 60, 50),
    chart4: hsl((primary.h + 216) % 360, 70, 55),
    chart5: hsl((primary.h + 288) % 360, 65, 55),
  };

  // Dark mode – shift lightness & saturation
  const dark: Record<string, string> = {
    background: hsl(nh, 47, 4),
    foreground: hsl(210, 40, 98),
    card: hsl(nh, 47, 7),
    cardForeground: hsl(210, 40, 98),
    popover: hsl(nh, 47, 7),
    popoverForeground: hsl(210, 40, 98),
    primary: hsl(primary.h, clamp(primary.s - 5, 0, 100), clamp(primary.l + 8, 0, 90)),
    primaryForeground: hsl(nh, 47, primary.l > 55 ? 95 : 4),
    secondary: hsl(nh, 25, 15),
    secondaryForeground: hsl(nh, 15, 80),
    muted: hsl(nh, 25, 15),
    mutedForeground: hsl(nh, 10, 64),
    accent: hsl(nh, 25, 15),
    accentForeground: hsl(nh, 15, 80),
    destructive: hsl(0, 72, 50),
    destructiveForeground: hsl(0, 0, 98),
    border: hsl(nh, 25, 15),
    input: hsl(nh, 25, 15),
    ring: hsl(primary.h, clamp(primary.s - 5, 0, 100), clamp(primary.l + 8, 0, 90)),
    professionalBlue: hsl(213, 94, 68),
    professionalGray: hsl(215, 16, 64),
    professionalLight: hsl(215, 25, 15),
    successGreen: hsl(142, 69, 58),
    warningOrange: hsl(27, 96, 61),
    chart1: hsl(primary.h, 70, 60),
    chart2: hsl((primary.h + 72) % 360, 55, 58),
    chart3: hsl((primary.h + 144) % 360, 50, 58),
    chart4: hsl((primary.h + 216) % 360, 60, 60),
    chart5: hsl((primary.h + 288) % 360, 55, 60),
  };

  return { light, dark };
}

/**
 * Generates a random harmonious primary colour.
 * Avoids muddy mid-saturation / mid-lightness tones.
 */
export function randomPrimaryHex(): string {
  const h = Math.floor(Math.random() * 360);
  const s = 60 + Math.floor(Math.random() * 30); // 60-90
  const l = 45 + Math.floor(Math.random() * 20); // 45-65
  return hslToHex({ h, s, l });
}
