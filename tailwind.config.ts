import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./modules/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          background: "#F7F5F2",
          surface: "#FCFAF7",
          primary: "#C8A27C",
          secondary: "#E8D8C4",
          accent: "#8B6F47",
          text: "#3A3A3A",
          line: "#DED2C3",
          espresso: "#5A4332",
        },
        surface: {
          DEFAULT: "#FCFAF7",
          soft: "#F7F5F2",
          mist: "#F2ECE4",
        },
        brand: {
          blue: "#C8A27C",
          green: "#D4C1AC",
          cream: "#E8D8C4",
          slate: "#CFC3B5",
          rose: "#DECABD",
        },
      },
      boxShadow: {
        glass: "0 18px 46px rgba(58, 58, 58, 0.08)",
        soft: "0 12px 30px rgba(139, 111, 71, 0.10)",
        float: "0 16px 36px rgba(139, 111, 71, 0.14)",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair-display)", "serif"],
      },
      backgroundImage: {
        "soft-mesh":
          "radial-gradient(circle at top left, rgba(200,162,124,0.16), transparent 28%), radial-gradient(circle at top right, rgba(232,216,196,0.55), transparent 24%), radial-gradient(circle at bottom, rgba(139,111,71,0.08), transparent 30%)",
        "coffee-glow":
          "radial-gradient(circle at 20% 20%, rgba(200,162,124,0.18), transparent 24%), radial-gradient(circle at 80% 0%, rgba(232,216,196,0.72), transparent 28%), linear-gradient(135deg, rgba(252,250,247,0.98) 0%, rgba(245,239,231,0.94) 100%)",
        grain:
          "linear-gradient(120deg, rgba(255,255,255,0.12), rgba(255,255,255,0)), radial-gradient(circle at center, rgba(255,255,255,0.08) 0, transparent 55%)",
      },
    },
  },
  plugins: [],
};

export default config;
