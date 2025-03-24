/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Caminho para os arquivos React
  ],
  theme: {
    extend: {}, // Personalizações, caso necessário
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
