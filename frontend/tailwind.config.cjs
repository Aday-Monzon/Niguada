/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#111827",
        mist: "#f3f6fb",
        accent: {
          50: "#eef8ff",
          100: "#d9efff",
          500: "#1c7ed6",
          600: "#1864ab",
          700: "#154c79"
        },
        coral: {
          500: "#f97316"
        }
      },
      boxShadow: {
        panel: "0 18px 45px rgba(15, 23, 42, 0.08)"
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.08) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};
