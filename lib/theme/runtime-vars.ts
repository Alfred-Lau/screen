import type {
  AnimationSpeed,
  FontScale,
  ShadowStyle,
  SpacingScale,
  ThemeTokens,
} from "./types";

/**
 * Tailwind v4 `rounded-*` utilities read `--radius-lg/md/sm`, not `--radius`.
 * These expressions keep that scale attached to the token the editor writes.
 * UI-kit radii (`--radius-card` and friends) follow the same token so the
 * marketing preview rounds with the rest of the page.
 */
export const RADIUS_UTILITY_VARS: Record<string, string> = {
  "--radius-sm": "max(0px, calc(var(--radius) - 4px))",
  "--radius-md": "max(0px, calc(var(--radius) - 2px))",
  "--radius-lg": "var(--radius)",
  "--radius-xl": "calc(var(--radius) + 4px)",
  "--radius-2xl": "calc(var(--radius) + 8px)",
  "--radius-3xl": "calc(var(--radius) + 12px)",
  "--radius-tag": "max(0px, calc(var(--radius) * 0.5))",
  "--radius-card-inner": "max(0px, calc(var(--radius) * 0.67))",
  "--radius-card": "calc(var(--radius) * 1.35)",
  "--radius-button-input": "calc(var(--radius) * 4)",
};

const TEXT_SIZE_REM: Record<string, number> = {
  "--text-xs": 0.75,
  "--text-sm": 0.875,
  "--text-base": 1,
  "--text-lg": 1.125,
  "--text-xl": 1.25,
  "--text-2xl": 1.5,
  "--text-3xl": 1.875,
  "--text-4xl": 2.25,
  "--text-5xl": 3,
  "--text-6xl": 3.75,
};

const SHADOW_KEYS = [
  "--theme-shadow-sm",
  "--theme-shadow",
  "--theme-shadow-md",
  "--theme-shadow-lg",
  "--theme-shadow-xl",
  "--theme-shadow-2xl",
] as const;

const SURFACE_COLOR_VARS = [
  "--color-surface-ground",
  "--color-surface-card",
  "--color-surface-brand",
  "--color-text-primary",
  "--color-text-primary-black",
  "--color-text-secondary",
  "--color-text-secondary-black",
  "--color-text-weak",
  "--color-text-weak-black",
  "--color-text-brand",
  "--color-text-brand-black",
  "--color-icon-primary",
  "--color-icon-secondary",
  "--color-icon-weak",
  "--color-icon-brand",
  "--color-icon-active",
  "--color-primary-blue",
  "--color-border-weak",
  "--color-border-focus",
  "--color-border-in-gray",
  "--gradient-surface-eyebrow",
  "--gradient-surface-icon-container",
  "--gradient-surface-non-clickable-card",
  "--gradient-surface-hover-card",
  "--gradient-stroke-card-default",
  "--gradient-stroke-hover-card",
  "--gradient-surface-line-in-grid",
  "--gradient-accent-heading",
  "--gradient-surface-primary-button",
  "--gradient-surface-primary-button-hover",
  "--gradient-pattern-radial",
  "--gradient-stroke-primary-button",
] as const;

export const RUNTIME_MANAGED_VARS: string[] = [
  ...Object.keys(RADIUS_UTILITY_VARS),
  "--spacing",
  ...Object.keys(TEXT_SIZE_REM),
  ...SHADOW_KEYS,
  "--default-transition-duration",
  "--motion-scale",
  ...SURFACE_COLOR_VARS,
];

function spacingValue(scale: SpacingScale): string {
  switch (scale) {
    case "tight":
      return "3px";
    case "default":
      return "4px";
    case "relaxed":
      return "6px";
    default: {
      const exhaustive: never = scale;
      return exhaustive;
    }
  }
}

function fontScaleFactor(scale: FontScale): number {
  switch (scale) {
    case "compact":
      return 0.875;
    case "default":
      return 1;
    case "comfortable":
      return 1.125;
    default: {
      const exhaustive: never = scale;
      return exhaustive;
    }
  }
}

function motionVars(speed: AnimationSpeed): Record<string, string> {
  switch (speed) {
    case "none":
      return { "--default-transition-duration": "0s", "--motion-scale": "0" };
    case "fast":
      return { "--default-transition-duration": "75ms", "--motion-scale": "0.5" };
    case "default":
      return { "--default-transition-duration": "150ms", "--motion-scale": "1" };
    case "slow":
      return { "--default-transition-duration": "400ms", "--motion-scale": "2" };
    default: {
      const exhaustive: never = speed;
      return exhaustive;
    }
  }
}

function shadowVars(style: ShadowStyle): Record<string, string> {
  switch (style) {
    case "none":
      return Object.fromEntries(SHADOW_KEYS.map((key) => [key, "0 0 #0000"]));
    case "sharp":
      return {
        "--theme-shadow-sm": "0 1px 1px 0 rgb(0 0 0 / 0.18)",
        "--theme-shadow": "0 1px 2px 0 rgb(0 0 0 / 0.2)",
        "--theme-shadow-md": "0 2px 4px 0 rgb(0 0 0 / 0.22)",
        "--theme-shadow-lg": "0 4px 8px 0 rgb(0 0 0 / 0.24)",
        "--theme-shadow-xl": "0 8px 14px 0 rgb(0 0 0 / 0.26)",
        "--theme-shadow-2xl": "0 12px 22px 0 rgb(0 0 0 / 0.3)",
      };
    case "default":
      return {
        "--theme-shadow-sm":
          "0 1px 3px 0 var(--tw-shadow-color, #0000001a), 0 1px 2px -1px var(--tw-shadow-color, #0000001a)",
        "--theme-shadow":
          "0 1px 3px 0 var(--tw-shadow-color, #0000001a), 0 1px 2px -1px var(--tw-shadow-color, #0000001a)",
        "--theme-shadow-md":
          "0 4px 6px -1px var(--tw-shadow-color, #0000001a), 0 2px 4px -2px var(--tw-shadow-color, #0000001a)",
        "--theme-shadow-lg":
          "0 10px 15px -3px var(--tw-shadow-color, #0000001a), 0 4px 6px -4px var(--tw-shadow-color, #0000001a)",
        "--theme-shadow-xl":
          "0 20px 25px -5px var(--tw-shadow-color, #0000001a), 0 8px 10px -6px var(--tw-shadow-color, #0000001a)",
        "--theme-shadow-2xl": "0 25px 50px -12px var(--tw-shadow-color, #00000040)",
      };
    case "soft":
      return {
        "--theme-shadow-sm":
          "0 10px 18px -6px rgb(0 0 0 / 0.1), 0 4px 8px -4px rgb(0 0 0 / 0.06)",
        "--theme-shadow":
          "0 12px 24px -8px rgb(0 0 0 / 0.1), 0 4px 10px -6px rgb(0 0 0 / 0.06)",
        "--theme-shadow-md":
          "0 16px 32px -10px rgb(0 0 0 / 0.12), 0 6px 14px -8px rgb(0 0 0 / 0.06)",
        "--theme-shadow-lg":
          "0 24px 48px -14px rgb(0 0 0 / 0.14), 0 8px 18px -10px rgb(0 0 0 / 0.06)",
        "--theme-shadow-xl": "0 32px 64px -16px rgb(0 0 0 / 0.16)",
        "--theme-shadow-2xl": "0 40px 80px -20px rgb(0 0 0 / 0.18)",
      };
    default: {
      const exhaustive: never = style;
      return exhaustive;
    }
  }
}

function tint(hex: string, percent: number): string {
  return `color-mix(in srgb, ${hex} ${percent}%, transparent)`;
}

function isLightHex(hex: string): boolean {
  const value = hex.replace("#", "");
  if (value.length < 6) return true;
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255 > 0.6;
}

function surfaceVars(hex: Record<string, string>): Record<string, string> {
  const primary = hex["--color-primary"];
  const background = hex["--color-background"];
  const foreground = hex["--color-foreground"];
  const card = hex["--color-card"];
  const muted = hex["--color-muted-foreground"];
  const border = hex["--color-border"];
  const ring = hex["--color-ring"];
  if (!primary || !background || !foreground || !card || !muted || !border || !ring) {
    return {};
  }

  return {
    "--color-surface-ground": background,
    "--color-surface-card": card,
    "--color-surface-brand": primary,
    "--color-text-primary": foreground,
    "--color-text-primary-black": foreground,
    "--color-text-secondary": muted,
    "--color-text-secondary-black": muted,
    "--color-text-weak": muted,
    "--color-text-weak-black": muted,
    "--color-text-brand": primary,
    "--color-text-brand-black": primary,
    "--color-icon-primary": foreground,
    "--color-icon-secondary": muted,
    "--color-icon-weak": muted,
    "--color-icon-brand": primary,
    "--color-icon-active": primary,
    "--color-primary-blue": primary,
    "--color-border-weak": border,
    "--color-border-focus": ring,
    "--color-border-in-gray": border,
    "--gradient-surface-eyebrow": `linear-gradient(180deg, ${tint(primary, 8)} 0%, ${tint(primary, 18)} 100%)`,
    "--gradient-surface-icon-container": `linear-gradient(0deg, ${tint(primary, 16)} 0%, ${tint(primary, 6)} 100%)`,
    "--gradient-surface-non-clickable-card": `linear-gradient(103deg, ${tint(primary, 0)} 64%, ${tint(primary, 16)} 100%), linear-gradient(0deg, ${tint(foreground, 5)}, ${tint(foreground, 5)})`,
    "--gradient-surface-hover-card": `linear-gradient(301deg, ${tint(primary, 0)} 41%, ${tint(primary, 18)} 94%), linear-gradient(0deg, ${tint(foreground, 5)}, ${tint(foreground, 5)})`,
    "--gradient-stroke-card-default": `linear-gradient(289deg, ${tint(foreground, 0)} 71%, ${tint(foreground, 14)} 96%), linear-gradient(98deg, ${tint(foreground, 0)} 76%, ${tint(foreground, 14)} 98%)`,
    "--gradient-stroke-hover-card": `linear-gradient(98deg, ${tint(primary, 6)} 76%, ${tint(primary, 62)} 98%), linear-gradient(293deg, ${tint(primary, 6)} 66%, ${tint(primary, 42)} 96%)`,
    "--gradient-surface-line-in-grid": `repeating-linear-gradient(45deg, transparent 0, transparent 3px, ${tint(primary, 5)} 1px, ${tint(primary, 8)} 4px)`,
    "--gradient-accent-heading": isLightHex(background)
      ? `linear-gradient(90deg, ${foreground} 0%, ${primary} 100%)`
      : `linear-gradient(90deg, ${primary} 0%, color-mix(in srgb, ${primary} 55%, white) 100%)`,
    "--gradient-surface-primary-button": primary,
    "--gradient-surface-primary-button-hover": `color-mix(in srgb, ${primary} 88%, black)`,
    "--gradient-pattern-radial": `radial-gradient(43.82% 53.73% at 50% 47.67%, ${tint(primary, 82)} 0%, ${tint(primary, 29)} 25%, transparent 100%)`,
    "--gradient-stroke-primary-button": `linear-gradient(42deg, ${tint(primary, 20)} 4%, ${tint(primary, 20)} 92%), radial-gradient(48.75% 48.75% at 73.5% 100%, transparent 0%, ${primary} 50%, transparent 100%)`,
  };
}

export function runtimeVars(tokens: ThemeTokens, colorHex: Record<string, string>): Record<string, string> {
  const vars: Record<string, string> = {
    ...RADIUS_UTILITY_VARS,
    "--spacing": spacingValue(tokens.spacing.scale),
    ...motionVars(tokens.animations.speed),
    ...shadowVars(tokens.shadows.style),
    ...surfaceVars(colorHex),
  };

  const factor = fontScaleFactor(tokens.typography.scale);
  for (const [name, rem] of Object.entries(TEXT_SIZE_REM)) {
    const value = Math.round(rem * factor * 1000) / 1000;
    vars[name] = `${value}rem`;
  }

  return vars;
}
