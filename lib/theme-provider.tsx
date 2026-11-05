"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  systemTheme: "light" | "dark";
  effectiveTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Detect the system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateSystemTheme = () => {
      setSystemTheme(mediaQuery.matches ? "dark" : "light");
    };

    updateSystemTheme();
    mediaQuery.addEventListener("change", updateSystemTheme);

    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, []);

  // Load the saved theme from local storage
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("seo-sentinel-theme") as Theme;
      if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
        setThemeState(storedTheme);
      }
    } catch (error) {
      console.warn("Failed to load theme from localStorage:", error);
    }
    setMounted(true);
  }, []);

  const effectiveTheme = theme === "system" ? systemTheme : theme;

  // Apply the theme to the document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    if (effectiveTheme === "dark") {
      root.classList.add("dark");
      console.log("Applied dark theme, classes:", root.className);
    } else {
      root.classList.remove("dark");
      console.log("Applied light theme, classes:", root.className);
    }
  }, [effectiveTheme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("seo-sentinel-theme", newTheme);
    } catch (error) {
      console.warn("Failed to save theme to localStorage:", error);
    }
  };

  const toggleTheme = () => {
    const themeOrder: Theme[] = ["light", "dark", "system"];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  // Avoid hydration mismatch: return null until mounted on the client
  if (!mounted) {
    return (
      <ThemeContext.Provider
        value={{
          theme: "system",
          systemTheme: "light",
          effectiveTheme: "light",
          setTheme: () => {},
          toggleTheme: () => {},
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        systemTheme,
        effectiveTheme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Warn in development, but fall back to defaults so the app keeps running
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      console.warn(
        "useTheme must be used within a ThemeProvider. Using default values.",
      );
    }

    // Return the default theme state
    return {
      theme: "system" as const,
      systemTheme: "light" as const,
      effectiveTheme: "light" as const,
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}
