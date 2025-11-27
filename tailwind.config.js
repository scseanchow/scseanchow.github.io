/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "bg-beige": "#FFF9F2",
        "text-primary": "#1D1D1D",
        "text-secondary": "#585858",
        "border-heavy": "#000000",
        "accent-orange": "#E86C3F",
        "accent-blue": "#35405D",
        "accent-yellow": "#FFDC98"
      },
      boxShadow: {
        posthog: "4px 4px 0px 0px rgba(0,0,0,1)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"]
      }
    }
  },
  plugins: []
};
