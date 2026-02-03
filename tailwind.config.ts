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
      spacing: {
        section: "var(--spacing-section)",
      },


      // 공용 애니메이션
      animation: {
        'tilt-spin': 'tiltSpin 5s ease-in-out infinite',
        'spin-full': 'spinFull 1s ease-in-out',
      },
      keyframes: {
        tiltSpin: {
          '0%': { transform: 'rotate(-13deg)' },
          '50%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(13deg)' },
        },
        spinFull: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(1080deg)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;