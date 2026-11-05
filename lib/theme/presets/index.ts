import type { ThemeConfig } from "../types";
import { defaultTheme } from "./default";
import { neutralTheme } from "./neutral";
import { emeraldTheme } from "./emerald";
import { roseTheme } from "./rose";
import { violetTheme } from "./violet";
import { orangeTheme } from "./orange";
import { slateTheme } from "./slate";

export const presetThemes: ThemeConfig[] = [
  defaultTheme,
  neutralTheme,
  emeraldTheme,
  roseTheme,
  violetTheme,
  orangeTheme,
  slateTheme,
];

export const presetThemeMap: Record<string, ThemeConfig> = Object.fromEntries(
  presetThemes.map((t) => [t.id, t])
);

export {
  defaultTheme,
  neutralTheme,
  emeraldTheme,
  roseTheme,
  violetTheme,
  orangeTheme,
  slateTheme,
};
