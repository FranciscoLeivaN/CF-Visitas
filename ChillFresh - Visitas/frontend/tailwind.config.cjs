/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightgreen: '#90EE90', // Puedes ajustar este tono de verde claro según prefieras
      },
    },
  },
  plugins: [],
}
