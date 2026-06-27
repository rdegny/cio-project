import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#202124",
        paper: "#fbfaf7",
        line: "#dedbd2",
        moss: "#4d6b4b",
        harbor: "#2f6680",
        signal: "#a16207"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Arial", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Consolas", "monospace"]
      },
      boxShadow: {
        panel: "0 16px 40px rgba(32, 33, 36, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
