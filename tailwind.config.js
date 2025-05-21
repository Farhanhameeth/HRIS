/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customGrey: "#3B3B3D",
        customLightGray: "#F1F2F4",
        customOrange: {
          100: '#FF944D', // Lighter Shade 2
          200: '#FF8040', // Lighter Shade 1
          300: '#FE5E00', // Base Color
          400: '#E65500', // Darker Shade 1
          500: '#CC4B00', // Darker Shade 2
        },
        customLightBlue: "#F8FCFF"
      },
      boxShadow: {
        customShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
        orangeCustomShadow: "0 4px 6px rgba(255, 58, 26, 0.5), 0 1px 3px rgba(255, 58, 26, 0.3)",
      },
    },
  },
  plugins: [],
};
