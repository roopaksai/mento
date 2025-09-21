/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        wellness: {
          calm: '#a7f3d0',
          peace: '#bfdbfe',
          hope: '#fde68a',
          strength: '#d8b4fe'
        }
      },
      backgroundImage: {
        'gradient-wellness': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-calm': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      }
    },
  },
  plugins: [],
}