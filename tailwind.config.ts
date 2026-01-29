import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        /* 메인·구분선 (globals.css :root 참조) */
        "head-main": "var(--color-main)",
        "head-badge": "var(--color-badge-bg)",
        "head-border": "var(--color-border)",
        /* 포인트/버튼 컬러 (블루 통일) */
        "head-brown": "var(--color-primary)",
        "head-brown-dark": "var(--color-primary-dark)",
        "head-accent-brown": "var(--color-accent-brown)",
        "head-white": "#ffffff",
        "head-gray": {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
        },
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
