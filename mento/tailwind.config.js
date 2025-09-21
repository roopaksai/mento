// Tailwind config - references actual config in requirements/config//** @type {import('tailwindcss').Config} *//** @type {import('tailwindcss').Config} */

module.exports = require('./requirements/config/tailwind.config.js');
module.exports = {module.exports = {

  content: [  content: [

    "./index.html",    "./index.html",

    "./src/**/*.{js,ts,jsx,tsx}",    "./src/**/*.{js,ts,jsx,tsx}",

    "./public/**/*.{html,js}"    "./public/**/*.{html,js}"

  ],  ],

  theme: {  theme: {

    extend: {    extend: {

      colors: {      colors: {

        primary: {        primary: {

          50: '#f0f9ff',          50: '#f0f9ff',

          100: '#e0f2fe',          100: '#e0f2fe',

          200: '#bae6fd',          200: '#bae6fd',

          300: '#7dd3fc',          300: '#7dd3fc',

          400: '#38bdf8',          400: '#38bdf8',

          500: '#0ea5e9',          500: '#0ea5e9',

          600: '#0284c7',          600: '#0284c7',

          700: '#0369a1',          700: '#0369a1',

          800: '#075985',          800: '#075985',

          900: '#0c4a6e',          900: '#0c4a6e',

        },        },

        mood: {        mood: {

          happy: '#fbbf24',          happy: '#fbbf24',

          calm: '#06d6a0',          calm: '#06d6a0',

          stressed: '#ef4444',          stressed: '#ef4444',

          neutral: '#6b7280',          neutral: '#6b7280',

          excited: '#f59e0b'          excited: '#f59e0b'

        }        }

      },      },

      animation: {      animation: {

        'bounce-slow': 'bounce 2s infinite',        'bounce-slow': 'bounce 2s infinite',

        'pulse-slow': 'pulse 3s infinite',        'pulse-slow': 'pulse 3s infinite',

        'breathing': 'breathing 4s ease-in-out infinite',        'breathing': 'breathing 4s ease-in-out infinite',

        'float': 'float 3s ease-in-out infinite'        'float': 'float 3s ease-in-out infinite'

      },      },

      keyframes: {      keyframes: {

        breathing: {        breathing: {

          '0%, 100%': { transform: 'scale(1)' },          '0%, 100%': { transform: 'scale(1)' },

          '50%': { transform: 'scale(1.1)' }          '50%': { transform: 'scale(1.1)' }

        },        },

        float: {        float: {

          '0%, 100%': { transform: 'translateY(0px)' },          '0%, 100%': { transform: 'translateY(0px)' },

          '50%': { transform: 'translateY(-10px)' }          '50%': { transform: 'translateY(-10px)' }

        }        }

      },      },

      fontFamily: {      fontFamily: {

        'fun': ['Comic Neue', 'cursive'],        'fun': ['Comic Neue', 'cursive'],

        'clean': ['Inter', 'sans-serif']        'clean': ['Inter', 'sans-serif']

      }      }

    },    },

  },  },

  plugins: [],  plugins: [],

}}
