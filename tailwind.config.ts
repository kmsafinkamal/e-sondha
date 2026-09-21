import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#25435a",
          container: "#3d5a73",
          fixed: "#cce5ff",
          dim: "#accae7",
        },
        secondary: {
          DEFAULT: "#476274",
          container: "#cae6fd",
          fixed: "#cae6fd",
          "fixed-dim": "#aecae0",
        },
        tertiary: {
          DEFAULT: "#3a4145",
          container: "#51585c",
          fixed: "#dce3e8",
          "fixed-dim": "#c0c7cc",
        },
        surface: {
          DEFAULT: "#fcf9f8",
          bright: "#fcf9f8",
          dim: "#dcd9d9",
          low: "#f6f3f2",
          container: "#f0eded",
          high: "#eae7e7",
          highest: "#e5e2e1",
          lowest: "#ffffff",
          variant: "#e5e2e1",
        },
        "on-surface": {
          DEFAULT: "#1c1b1b",
          variant: "#42474d",
        },
        "on-primary": {
          DEFAULT: "#ffffff",
          container: "#b3d1ee",
        },
        outline: {
          DEFAULT: "#73777d",
          variant: "#c3c7cd",
        },
        terracotta: {
          DEFAULT: "#ba674d",
          light: "#f5e8e4",
        },
        olive: {
          DEFAULT: "#59634d",
          light: "#ebedea",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      letterSpacing: {
        "label-caps": "0.08em",
        tighter: "-0.02em",
      },
      spacing: {
        gutter: "1.5rem",
        margin: "2.5rem",
      },
      boxShadow: {
        card: "0 8px 24px rgba(61, 90, 115, 0.08)",
        subtle: "0 2px 8px rgba(37, 67, 90, 0.06)",
        drawer: "-8px 0 32px rgba(37, 67, 90, 0.15)",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
