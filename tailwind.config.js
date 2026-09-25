/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'Quicksand', 'Fredoka', 'system-ui', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
        fredoka: ['Fredoka', 'sans-serif'],
        handwriting: ['Patrick Hand', 'cursive']
      }
    },
  },
  plugins: [],
}
