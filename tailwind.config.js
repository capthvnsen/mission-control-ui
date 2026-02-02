/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mc-bg': '#1a1a1a',
        'mc-card': '#242424',
        'mc-border': '#333',
        'mc-accent': '#4ade80',
        'mc-text': '#e5e5e5',
        'mc-muted': '#888',
      }
    },
  },
  plugins: [],
}
