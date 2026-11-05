"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type {
  ThemeConfig,
  ThemeMode,
  ThemeTokens,
  ExportFormat,
  SemanticColors,
} from "./types";
import { ThemeEngine } from "./engine";
import { presetThemes, presetThemeMap, defaultTheme } from "./presets";
import { STORAGE_KEYS } from "./constants";
import { generatePalette, randomPrimaryHex } from "./utils/color";
import { parseJSONImport, parseCSSImport } from "./utils/css-generator";

// ---------------------------------------------------------------------------
// Context type
// ---------------------------------------------------------------------------

export interface ThemeTokenContextType {
  // Mode (light / dark / system)
  mode: ThemeMode;
  effectiveMode: "light" | "dark";
  systemMode: "light" | "dark";
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;

  // Active theme
  activeTheme: ThemeConfig;
  setActiveTheme: (id: string) => void;
  activeTokens: ThemeTokens;

  // Token editing
  updateColor: (key: keyof SemanticColors, value: string) => void;
  updateRadius: (value: string) => void;
  updateFont: (target: "sans" | "display" | "mono", value: string) => void;
  updateFontScale: (scale: ThemeTokens["typography"]["scale"]) => void;
  updateSpacing: (scale: ThemeTokens["spacing"]["scale"]) => void;
  updateShadow: (style: ThemeTokens["shadows"]["style"]) => void;
  updateAnimation: (speed: ThemeTokens["animations"]["speed"]) => void;
  applyPalette: (primaryHex: string, baseNeutral?: "neutral" | "slate" | "gray" | "zinc" | "stone") => void;
  randomize: () => void;
  resetToDefault: () => void;

  // Theme management
  presets: ThemeConfig[];
  customThemes: ThemeConfig[];
  saveCustomTheme: (name: string) => ThemeConfig;
  deleteCustomTheme: (id: string) => void;

  // Export / Import
  exportTheme: (format: ExportFormat) => string;
  importTheme: (data: string, format: "css" | "json") => ThemeConfig | null;
}

const ThemeTokenContext = createContext<ThemeTokenContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded – silently ignore */
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ThemeTokenProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [systemMode, setSystemMode] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [darkClassPresent, setDarkClassPresent] = useState(false);

  const [activeTheme, setActiveThemeState] = useState<ThemeConfig>(
    deepClone(defaultTheme)
  );
  const [customThemes, setCustomThemes] = useState<ThemeConfig[]>([]);

  const themeRef = useRef(activeTheme);
  themeRef.current = activeTheme;

  // ---- System theme detection ----
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemMode(mq.matches ? "dark" : "light");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // ---- Observe dark class on <html> (managed by legacy ThemeProvider in layout) ----
  useEffect(() => {
    const root = document.documentElement;
    setDarkClassPresent(root.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setDarkClassPresent(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // ---- Hydrate from localStorage ----
  useEffect(() => {
    const savedMode = localStorage.getItem(STORAGE_KEYS.themeMode) as ThemeMode | null;
    if (savedMode && ["light", "dark", "system"].includes(savedMode)) {
      setModeState(savedMode);
    }

    const savedCustom = loadJSON<ThemeConfig[]>(STORAGE_KEYS.customThemes, []);
    setCustomThemes(savedCustom);

    const savedId = localStorage.getItem(STORAGE_KEYS.activeThemeId);
    if (savedId) {
      const found =
        presetThemeMap[savedId] ||
        savedCustom.find((t) => t.id === savedId);
      if (found) setActiveThemeState(deepClone(found));
    }

    setMounted(true);
  }, []);

  // Derive effectiveMode from observed dark class when mounted, falling back to mode logic
  const effectiveMode = mounted
    ? darkClassPresent ? "dark" : "light"
    : (mode === "system" ? systemMode : mode);

  // ---- Apply tokens to DOM whenever theme or mode changes ----
  const activeTokens = effectiveMode === "dark" ? activeTheme.dark : activeTheme.light;

  useEffect(() => {
    if (!mounted) return;
    ThemeEngine.applyTokens(activeTokens);
  }, [activeTokens, mounted]);

  useEffect(() => {
    return () => {
      ThemeEngine.resetTokens();
    };
  }, []);

  // ---- Mode ----
  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    try { localStorage.setItem(STORAGE_KEYS.themeMode, m); } catch { /* */ }
    // Also sync the legacy ThemeProvider's localStorage key so both agree
    try { localStorage.setItem("seo-sentinel-theme", m); } catch { /* */ }
    // Directly toggle the dark class for immediate effect
    if (typeof document !== "undefined") {
      const isDark = m === "dark" || (m === "system" && systemMode === "dark");
      document.documentElement.classList.toggle("dark", isDark);
    }
  }, [systemMode]);

  const toggleMode = useCallback(() => {
    const order: ThemeMode[] = ["light", "dark", "system"];
    setMode(order[(order.indexOf(mode) + 1) % order.length]);
  }, [mode, setMode]);

  // ---- Theme selection ----
  const setActiveTheme = useCallback((id: string) => {
    const found =
      presetThemeMap[id] ||
      customThemes.find((t) => t.id === id);
    if (found) {
      const clone = deepClone(found);
      setActiveThemeState(clone);
      try { localStorage.setItem(STORAGE_KEYS.activeThemeId, id); } catch { /* */ }
    }
  }, [customThemes]);

  // ---- Token updates (mutate the active theme in place, then re-set) ----
  const mutateTheme = useCallback(
    (fn: (theme: ThemeConfig) => void) => {
      const next = deepClone(themeRef.current);
      next.id = next.id.startsWith("custom-") ? next.id : `custom-${Date.now()}`;
      next.updatedAt = Date.now();
      fn(next);
      setActiveThemeState(next);
    },
    []
  );

  const updateColor = useCallback(
    (key: keyof SemanticColors, value: string) =>
      mutateTheme((t) => {
        t.light.colors[key] = value;
        t.dark.colors[key] = value;
      }),
    [mutateTheme]
  );

  const updateRadius = useCallback(
    (value: string) =>
      mutateTheme((t) => {
        t.light.radius.base = value;
        t.dark.radius.base = value;
      }),
    [mutateTheme]
  );

  const updateFont = useCallback(
    (target: "sans" | "display" | "mono", value: string) =>
      mutateTheme((t) => {
        t.light.typography.fontFamily[target] = value;
        t.dark.typography.fontFamily[target] = value;
      }),
    [mutateTheme]
  );

  const updateFontScale = useCallback(
    (scale: ThemeTokens["typography"]["scale"]) =>
      mutateTheme((t) => {
        t.light.typography.scale = scale;
        t.dark.typography.scale = scale;
      }),
    [mutateTheme]
  );

  const updateSpacing = useCallback(
    (scale: ThemeTokens["spacing"]["scale"]) =>
      mutateTheme((t) => {
        t.light.spacing.scale = scale;
        t.dark.spacing.scale = scale;
      }),
    [mutateTheme]
  );

  const updateShadow = useCallback(
    (style: ThemeTokens["shadows"]["style"]) =>
      mutateTheme((t) => {
        t.light.shadows.style = style;
        t.dark.shadows.style = style;
      }),
    [mutateTheme]
  );

  const updateAnimation = useCallback(
    (speed: ThemeTokens["animations"]["speed"]) =>
      mutateTheme((t) => {
        t.light.animations.speed = speed;
        t.dark.animations.speed = speed;
      }),
    [mutateTheme]
  );

  const applyPalette = useCallback(
    (primaryHex: string, baseNeutral: "neutral" | "slate" | "gray" | "zinc" | "stone" = "slate") => {
      mutateTheme((t) => {
        const palette = generatePalette(primaryHex, baseNeutral);
        t.light.colors = palette.light as unknown as ThemeConfig["light"]["colors"];
        t.dark.colors = palette.dark as unknown as ThemeConfig["dark"]["colors"];
      });
    },
    [mutateTheme]
  );

  const randomize = useCallback(() => {
    const hex = randomPrimaryHex();
    const bases = ["neutral", "slate", "gray", "zinc", "stone"] as const;
    const base = bases[Math.floor(Math.random() * bases.length)];
    applyPalette(hex, base);
  }, [applyPalette]);

  const resetToDefault = useCallback(() => {
    const clone = deepClone(defaultTheme);
    setActiveThemeState(clone);
    ThemeEngine.resetTokens();
    ThemeEngine.applyTokens(effectiveMode === "dark" ? clone.dark : clone.light);
    try { localStorage.removeItem(STORAGE_KEYS.activeThemeId); } catch { /* */ }
  }, [effectiveMode]);

  // ---- Custom theme persistence ----
  const saveCustomTheme = useCallback(
    (name: string): ThemeConfig => {
      const theme: ThemeConfig = {
        ...deepClone(themeRef.current),
        id: `custom-${Date.now()}`,
        name,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const next = [...customThemes.filter((t) => t.name !== name), theme];
      setCustomThemes(next);
      saveJSON(STORAGE_KEYS.customThemes, next);
      try { localStorage.setItem(STORAGE_KEYS.activeThemeId, theme.id); } catch { /* */ }
      setActiveThemeState(theme);
      return theme;
    },
    [customThemes]
  );

  const deleteCustomTheme = useCallback(
    (id: string) => {
      const next = customThemes.filter((t) => t.id !== id);
      setCustomThemes(next);
      saveJSON(STORAGE_KEYS.customThemes, next);
      if (themeRef.current.id === id) resetToDefault();
    },
    [customThemes, resetToDefault]
  );

  // ---- Export / Import ----
  const exportTheme = useCallback(
    (format: ExportFormat) => ThemeEngine.exportTheme(themeRef.current, format),
    []
  );

  const importTheme = useCallback(
    (data: string, format: "css" | "json"): ThemeConfig | null => {
      const parsed = format === "json" ? parseJSONImport(data) : parseCSSImport(data);
      if (!parsed) return null;
      const saved = saveCustomTheme(parsed.name);
      setActiveThemeState(deepClone(saved));
      return saved;
    },
    [saveCustomTheme]
  );

  // ---- Render ----
  const value: ThemeTokenContextType = {
    mode,
    effectiveMode,
    systemMode,
    setMode,
    toggleMode,
    activeTheme,
    setActiveTheme,
    activeTokens,
    updateColor,
    updateRadius,
    updateFont,
    updateFontScale,
    updateSpacing,
    updateShadow,
    updateAnimation,
    applyPalette,
    randomize,
    resetToDefault,
    presets: presetThemes,
    customThemes,
    saveCustomTheme,
    deleteCustomTheme,
    exportTheme,
    importTheme,
  };

  if (!mounted) {
    return (
      <ThemeTokenContext.Provider value={value}>
        {children}
      </ThemeTokenContext.Provider>
    );
  }

  return (
    <ThemeTokenContext.Provider value={value}>
      {children}
    </ThemeTokenContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useThemeTokens(): ThemeTokenContextType {
  const ctx = useContext(ThemeTokenContext);
  if (!ctx) {
    throw new Error("useThemeTokens must be used within <ThemeTokenProvider>");
  }
  return ctx;
}
