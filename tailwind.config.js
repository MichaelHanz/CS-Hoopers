/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{tsx,ts,js,jsx,css}'],
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a',
        accent: '#f97316',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui'],
      },
    },
  },
  plugins: [],
};

//Incase @theme doesnt work