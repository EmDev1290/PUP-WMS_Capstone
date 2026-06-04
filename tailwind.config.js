/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./demo.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pup-maroon': '#800000',
      },
    },
  },
  plugins: [],
}
