/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Poppins", "system-ui", "sans-serif"],
        display: ["Poppins", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Responsive typography scale
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      boxShadow: {
        // Custom shadow system
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'subtle-lg': '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'medium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medium-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'strong': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'glow-primary': '0 0 20px rgba(37, 99, 235, 0.3)',
        'glow-secondary': '0 0 20px rgba(245, 158, 11, 0.3)',
        'inner-subtle': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          // Primary colors
          primary: "#2563eb",
          "primary-focus": "#1d4ed8",
          "primary-content": "#ffffff",
          
          // Secondary colors
          secondary: "#f59e0b",
          "secondary-focus": "#d97706",
          "secondary-content": "#ffffff",
          
          // Accent colors
          accent: "#10b981",
          "accent-focus": "#059669",
          "accent-content": "#ffffff",
          
          // Neutral colors
          neutral: "#64748b",
          "neutral-focus": "#475569",
          "neutral-content": "#ffffff",
          
          // Base colors
          "base-100": "#f8fafc",
          "base-200": "#f1f5f9",
          "base-300": "#e2e8f0",
          "base-content": "#111827",
          
          // State colors
          info: "#3b82f6",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
      {
        dark: {
          // Primary colors
          primary: "#3b82f6",
          "primary-focus": "#2563eb",
          "primary-content": "#ffffff",
          
          // Secondary colors
          secondary: "#d97706",
          "secondary-focus": "#b45309",
          "secondary-content": "#ffffff",
          
          // Accent colors
          accent: "#14b8a6",
          "accent-focus": "#0d9488",
          "accent-content": "#ffffff",
          
          // Neutral colors
          neutral: "#374151",
          "neutral-focus": "#1f2937",
          "neutral-content": "#f9fafb",
          
          // Base colors
          "base-100": "#0f172a",
          "base-200": "#1e293b",
          "base-300": "#334155",
          "base-content": "#f9fafb",
          
          // State colors
          info: "#60a5fa",
          success: "#34d399",
          warning: "#fbbf24",
          error: "#f87171",
        },
      },
      {
        "eye-care": {
          // Primary colors
          primary: "#4a7664",
          "primary-focus": "#3d6253",
          "primary-content": "#f5f1e6",
          
          // Secondary colors
          secondary: "#8b7355",
          "secondary-focus": "#6d5a43",
          "secondary-content": "#f5f1e6",
          
          // Accent colors
          accent: "#a67c52",
          "accent-focus": "#8b6642",
          "accent-content": "#f5f1e6",
          
          // Neutral colors
          neutral: "#5d533a",
          "neutral-focus": "#4a4230",
          "neutral-content": "#f5f1e6",
          
          // Base colors
          "base-100": "#1a1f1c",
          "base-200": "#242a26",
          "base-300": "#2e3530",
          "base-content": "#f5f1e6",
          
          // State colors
          info: "#5a8c7a",
          success: "#6b9b7f",
          warning: "#c9a66b",
          error: "#b85c5c",
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    logs: false,
  },
};
