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
          primary: "#FFC107",
          secondary: "#E9ECEF",
          accent: "#FFA000",
          neutral: "#6C757D",
          "base-100": "#FFFFFF",
          "base-200": "#F8F9FA",
          "base-300": "#E9ECEF",
          "base-content": "#212529",
        },
      },
      {
        dark: {
          primary: "#FFD54F",
          secondary: "#424242",
          accent: "#FFB300",
          neutral: "#1E1E1E",
          "base-100": "#121212",
          "base-200": "#1A1A1A",
          "base-300": "#222222",
          "base-content": "#E0E0E0",
        },
      },
      {
        "eye-care": {
          primary: "#A67C3D",
          secondary: "#C8C2A8",
          accent: "#D4B483",
          neutral: "#5D533A",
          "base-100": "#F5F2E8",
          "base-200": "#E8E3D6",
          "base-300": "#DCD6C7",
          "base-content": "#3A362C",
        },
      },
    ],
  },
};
