/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        accent: {
          gold: '#f59e0b',
          purple: '#8b5cf6',
        }
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1.0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      },
      animation: {
        'wave-bar-1': 'wave 1.2s ease-in-out infinite',
        'wave-bar-2': 'wave 1.2s ease-in-out 0.2s infinite',
        'wave-bar-3': 'wave 1.2s ease-in-out 0.4s infinite',
        'wave-bar-4': 'wave 1.2s ease-in-out 0.1s infinite',
        'float': 'float 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
