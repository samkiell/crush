"use client";
import { ThemeProvider, useTheme } from "../utils/theme";
import { useEffect } from "react";

export default function ThemeWrapper({ children }) {
  return (
    <ThemeProvider>
      <ThemeWrapperInner>
        {children}
      </ThemeWrapperInner>
    </ThemeProvider>
  );
}

function ThemeWrapperInner({ children }) {
  const { theme } = useTheme();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-300">
      {children}
    </div>
  );
}
