export interface SemanticColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  professionalBlue: string;
  professionalGray: string;
  professionalLight: string;
  successGreen: string;
  warningOrange: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
}

export interface RadiusTokens {
  base: string;
}

export type FontScale = "default" | "compact" | "comfortable";
export type SpacingScale = "default" | "tight" | "relaxed";
export type ShadowStyle = "default" | "sharp" | "soft" | "none";
export type AnimationSpeed = "default" | "fast" | "slow" | "none";

export interface TypographyTokens {
  fontFamily: {
    sans: string;
    display: string;
    mono: string;
  };
  scale: FontScale;
}

export interface SpacingTokens {
  scale: SpacingScale;
}

export interface ShadowTokens {
  style: ShadowStyle;
}

export interface AnimationTokens {
  speed: AnimationSpeed;
}

export interface ThemeTokens {
  colors: SemanticColors;
  radius: RadiusTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  shadows: ShadowTokens;
  animations: AnimationTokens;
}

export interface ThemeConfig {
  id: string;
  name: string;
  light: ThemeTokens;
  dark: ThemeTokens;
  createdAt: number;
  updatedAt: number;
}

export type ThemeMode = "light" | "dark" | "system";

export type ExportFormat = "css" | "json" | "tailwind";
