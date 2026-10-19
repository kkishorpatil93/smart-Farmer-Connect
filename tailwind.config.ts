import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#17652B", // Forest green
          light: "#1F7D37",
          dark: "#114D20",
        },
        fresh: {
          DEFAULT: "#2E8B43", // Fresh green
          light: "#3FA657",
          dark: "#236B33",
        },
        harvest: {
          DEFAULT: "#FFBF24", // Harvest yellow
          light: "#FFCC4D",
          dark: "#E5A81A",
        },
        cream: {
          DEFAULT: "#FFF8E5", // Warm cream
          dark: "#F5EDD5",
        },
        dark: {
          DEFAULT: "#17251B", // Dark text
          muted: "#4A5B4E",
        },
        primary: {
          DEFAULT: "#17652B",
          light: "#2E8B43",
          dark: "#114D20",
          hover: "#1F7D37",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-noto-kannada)", "system-ui", "sans-serif"],
      },
      minHeight: {
        touch: "48px",
      },
      minWidth: {
        touch: "48px",
      },
    },
  },
  plugins: [],
};
export default config;
