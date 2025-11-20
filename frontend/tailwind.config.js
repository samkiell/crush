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
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#0B5FFF",
          secondary: "#06B6D4",
          accent: "#38BDF8",
          neutral: "#0F172A",
          "base-100": "#F7FAFC",
          "base-200": "#FFFFFF",
          "base-300": "#E2E8F0",
          "base-content": "#0F172A",
        },
      },
      {
        dark: {
          primary: "#60A5FA",
          secondary: "#38BDF8",
          accent: "#2563EB",
          neutral: "#E6EEF8",
          "base-100": "#0B1220",
          "base-200": "#071023",
          "base-300": "#1E293B",
          "base-content": "#E6EEF8",
        },
      },
      {
        "eye-care": {
          primary: "#926A3D",
          secondary: "#A88A57",
          accent: "#C8A97E",
          neutral: "#2B2B25",
          "base-100": "#FFF8EE",
          "base-200": "#FFF2DC",
          "base-300": "#EEDBC2",
          "base-content": "#2B2B25",
        },
      },
    ],
  },
};
