/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    screens: {
      'xs': '475px',   // Extra small devices (must be first)
      'sm': '640px',   // Small devices
      'md': '768px',   // Medium devices
      'lg': '1024px',  // Large devices
      'xl': '1280px',  // Extra large devices
      '2xl': '1536px', // 2x Extra large devices
    },
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


