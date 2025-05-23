/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary1: '#1e40af',
        primary2: '#1e3a8a',
        primary3: '#1e3a8a',
        primary4: '#1e3a8a',
        primary5: '#1e3a8a',
      },
      keyframes: {
        loading: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        'loading': 'loading 1.5s ease-in-out infinite'
      }
    },
  },
  plugins: [],
} 