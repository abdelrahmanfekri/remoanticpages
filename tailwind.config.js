/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Playfair Display'", "serif"],
        display: ["'Great Vibes'", "cursive"]
      },
      backgroundImage: {
        "romantic-gradient":
          "radial-gradient(circle at top, rgba(244,114,182,0.18), transparent 55%), radial-gradient(circle at bottom, rgba(248,113,113,0.18), transparent 55%)"
      }
    }
  },
  plugins: []
};


