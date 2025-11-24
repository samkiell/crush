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
  // Default to "light" for SSR-friendly initial render
  const [theme, setTheme] = useState("light");

  // Hydrate from localStorage on client only
  useEffect(() => {
    try {
      const saved = localStorage.getItem("d2c_theme");
      if (saved) setTheme(saved);
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
