/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './public/**/*.js'],
  theme: {
    extend: {
      colors: {
        primary: '#1877F2',
        secondary: '#1C1E21',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
