import type { SemanticColors } from "./types";

/**
 * Maps SemanticColors keys to the CSS custom property names used in globals.css.
 * The runtime engine uses this to inject overrides via style.setProperty().
 */
export const COLOR_VAR_MAP: Record<keyof SemanticColors, string> = {
  background: "--background",
  foreground: "--foreground",
  card: "--card",
  cardForeground: "--card-foreground",
  popover: "--popover",
  popoverForeground: "--popover-foreground",
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  secondary: "--secondary",
  secondaryForeground: "--secondary-foreground",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  accent: "--accent",
  accentForeground: "--accent-foreground",
  destructive: "--destructive",
  destructiveForeground: "--destructive-foreground",
  border: "--border",
  input: "--input",
  ring: "--ring",
  professionalBlue: "--professional-blue",
  professionalGray: "--professional-gray",
  professionalLight: "--professional-light",
  successGreen: "--success-green",
  warningOrange: "--warning-orange",
  chart1: "--chart-1",
  chart2: "--chart-2",
  chart3: "--chart-3",
  chart4: "--chart-4",
  chart5: "--chart-5",
};

/**
 * Maps SemanticColors keys to Tailwind v4 @theme variable names (hex-based).
 */
export const TAILWIND_COLOR_VAR_MAP: Record<keyof SemanticColors, string> = {
  background: "--color-background",
  foreground: "--color-foreground",
  card: "--color-card",
  cardForeground: "--color-card-foreground",
  popover: "--color-popover",
  popoverForeground: "--color-popover-foreground",
  primary: "--color-primary",
  primaryForeground: "--color-primary-foreground",
  secondary: "--color-secondary",
  secondaryForeground: "--color-secondary-foreground",
  muted: "--color-muted",
  mutedForeground: "--color-muted-foreground",
  accent: "--color-accent",
  accentForeground: "--color-accent-foreground",
  destructive: "--color-destructive",
  destructiveForeground: "--color-destructive-foreground",
  border: "--color-border",
  input: "--color-input",
  ring: "--color-ring",
  professionalBlue: "--color-professional-blue",
  professionalGray: "--color-professional-gray",
  professionalLight: "--color-professional-light",
  successGreen: "--color-success-green",
  warningOrange: "--color-warning-orange",
  chart1: "--color-chart-1",
  chart2: "--color-chart-2",
  chart3: "--color-chart-3",
  chart4: "--color-chart-4",
  chart5: "--color-chart-5",
};

export const RADIUS_VAR = "--radius";

export const RADIUS_OPTIONS = [
  { label: "0", value: "0" },
  { label: "0.25", value: "0.25rem" },
  { label: "0.5", value: "0.5rem" },
  { label: "0.75", value: "0.75rem" },
  { label: "1.0", value: "1rem" },
  { label: "1.5", value: "1.5rem" },
] as const;

export const FONT_OPTIONS = [
  { label: "Inter", value: "Inter, system-ui, sans-serif" },
  { label: "Plus Jakarta Sans", value: "'Plus Jakarta Sans', system-ui, sans-serif" },
  { label: "Geist", value: "Geist, system-ui, sans-serif" },
  { label: "DM Sans", value: "'DM Sans', system-ui, sans-serif" },
  { label: "Nunito", value: "Nunito, system-ui, sans-serif" },
  { label: "System", value: "system-ui, -apple-system, sans-serif" },
] as const;

export const DISPLAY_FONT_OPTIONS = [
  { label: "Fraunces", value: "'Fraunces', Georgia, serif" },
  { label: "Geist", value: "'Geist', system-ui, sans-serif" },
  { label: "Cal Sans", value: "'Cal Sans', system-ui, sans-serif" },
  { label: "Plus Jakarta Sans", value: "'Plus Jakarta Sans', system-ui, sans-serif" },
  { label: "Inter", value: "Inter, system-ui, sans-serif" },
] as const;

export const MONO_FONT_OPTIONS = [
  { label: "JetBrains Mono", value: "'JetBrains Mono', monospace" },
  { label: "Fira Code", value: "'Fira Code', monospace" },
  { label: "System", value: "ui-monospace, monospace" },
] as const;

export const STORAGE_KEYS = {
  activeThemeId: "solokit-active-theme-id",
  customThemes: "solokit-custom-themes",
  themeMode: "solokit-theme-mode",
} as const;
