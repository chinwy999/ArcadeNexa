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
        "space-black": "#050510",
        "dark-navy": "#0a0a1a",
        "elevated": "#15152a",
        "electric-violet": "#7c3aed",
        "neon-green": "#22c55e",
        "hot-pink": "#ec4899",
        "gold": "#fbbf24",
        "text-primary": "#ffffff",
        "text-secondary": "#94a3b8",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulseSlow 3s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.8" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
