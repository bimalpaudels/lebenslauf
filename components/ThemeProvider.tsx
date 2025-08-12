"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as Theme;
    if (stored && (stored === "light" || stored === "dark" || stored === "system")) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    
    const updateTheme = (isDark: boolean) => {
      root.classList.remove("light", "dark");
      root.classList.add(isDark ? "dark" : "light");
      setResolvedTheme(isDark ? "dark" : "light");
    };

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      updateTheme(mediaQuery.matches);

      const listener = (e: MediaQueryListEvent) => updateTheme(e.matches);
      mediaQuery.addEventListener("change", listener);
      
      return () => mediaQuery.removeEventListener("change", listener);
    } else {
      updateTheme(theme === "dark");
    }
  }, [theme, mounted]);

  const value = {
    theme,
    resolvedTheme,
    setTheme: (newTheme: Theme) => {
      if (mounted) {
        localStorage.setItem("theme", newTheme);
      }
      setTheme(newTheme);
    },
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}