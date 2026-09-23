/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        handwriting: ['Patrick Hand', 'cursive']
      }
    },
  },
  plugins: [],
}
