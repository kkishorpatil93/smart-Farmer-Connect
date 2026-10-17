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
        primary: {
          DEFAULT: "#1B5E20", // Deep green
          light: "#2E7D32",
          dark: "#0E3911",
          hover: "#154c19",
        },
        fresh: {
          DEFAULT: "#4CAF50", // Fresh agricultural green
          light: "#81C784",
          dark: "#388E3C",
        },
        amber: {
          DEFAULT: "#FFB300", // Warm amber accent
          light: "#FFC107",
          dark: "#FFA000",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          cream: "#FFF8E1", // Light warm yellow background for high readability in sunlight
          muted: "#F5F5F0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-noto-kannada)", "system-ui", "sans-serif"],
      },
      minHeight: {
        touch: "48px", // Ensures minimum 48px mobile touch targets
      },
      minWidth: {
        touch: "48px",
      },
    },
  },
  plugins: [],
};
export default config;
