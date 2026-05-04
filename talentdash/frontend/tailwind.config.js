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
        display: ["'DM Serif Display'", "Georgia", "serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: {
          50: "#f5f3ef",
          100: "#e8e4db",
          200: "#d0c9b9",
          300: "#b5ab95",
          400: "#9a8e73",
          500: "#7d7056",
          600: "#635841",
          700: "#4a4131",
          800: "#322c21",
          900: "#1a1710",
          950: "#0d0c08",
        },
        gold: {
          400: "#f4c85a",
          500: "#e8a820",
          600: "#c78c12",
        },
        emerald: {
          400: "#34c97d",
          500: "#1fa85e",
          600: "#14793f",
        },
        crimson: {
          400: "#f05858",
          500: "#d93030",
          600: "#b01f1f",
        },
      },
      backgroundImage: {
        "paper": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
