"use client";

import { useTheme } from "../utils/theme";

export default function ThemeWrapper({ children }) {
  const { theme } = useTheme();

  return (
    <div data-theme={theme} className="min-h-screen">
      {children}
    </div>
  );
}
