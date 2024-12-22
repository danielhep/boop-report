import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["var(--font-nunito-sans)"],
        open: ["var(--font-open-sans)"],
      },
      colors: {
        background: "var(--background)",
        "background-secondary": "var(--background-secondary)",
        "body-background": "var(--body-background)",
        "body-background-secondary": "var(--body-background-secondary)",
        "text-main": "var(--text-main)",
        "text-muted": "var(--text-muted)",
        "decoration-yellow": "var(--decoration-yellow)",
        "decoration-teal": "var(--decoration-teal)",
        primary: "var(--primary)",
        emphasis: "var(--emphasis)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
