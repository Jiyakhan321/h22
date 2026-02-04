/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        primary: {
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
        },
        'red-accent': '#FF3B3F',
        'dark-bg': '#1E1E1E',
      },
      backgroundImage: {
        'red-gradient': 'linear-gradient(135deg, #FF3B3F 0%, #FF6B6B 100%)',
        'red-pink-gradient': 'linear-gradient(135deg, #FF3B3F 0%, #FF6B6B 50%, #FF9AA2 100%)',
      }
    },
  },
  plugins: [],
}