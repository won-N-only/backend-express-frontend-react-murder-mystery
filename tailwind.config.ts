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
        "head-text": "var(--color-text)",
        "head-border": "var(--color-border)",
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
      maxWidth: {
        content: "750px",
      },
      /* section: extend.spacing에 var() 쓰면 유틸이 빌드에 안 나오는 경우 있음 → globals.css @layer utilities에 동일 유틸 정의해 둠 */
      spacing: {
        section: "var(--spacing-section)",
      },
    },
  },
  plugins: [],
};
export default config;
