"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Initialize with the theme that was applied by the blocking script if possible
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem("d2c_theme");
        return saved || "light";
      } catch (err) {
        return "light";
      }
    }
    return "light";
  });

  // Hydrate from localStorage on client only - mostly for ensuring state sync
  useEffect(() => {
    try {
      const saved = localStorage.getItem("d2c_theme");
      if (saved && saved !== theme) setTheme(saved);
    } catch (err) {
      // ignore
    }
  }, []);

  // Apply theme to <html> data-theme and persist changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
    try {
      localStorage.setItem("d2c_theme", theme);
    } catch (err) {
      // ignore
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
