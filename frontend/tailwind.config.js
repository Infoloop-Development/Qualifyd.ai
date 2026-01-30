/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f9',
          100: '#b3e8ed',
          200: '#80d9e1',
          300: '#4dcad5',
          400: '#1ab5c3',
          500: '#17a6b5', // Main primary color
          600: '#138a97',
          700: '#0f6e79',
          800: '#0b525b',
          900: '#07363d',
        },
        secondary: {
          50: '#e8f5f1',
          100: '#b8e0d0',
          200: '#88cbaf',
          300: '#58b68e',
          400: '#3c967c', // Main secondary color
          500: '#2d7a65',
          600: '#1e5e4e',
          700: '#0f4237',
          800: '#002620',
          900: '#000a09',
        },
      },
      fontFamily: {
        sans: [
          'Source Sans 3',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'Apple Color Emoji',
          'Segoe UI Emoji'
        ]
      }
    },
  },
  plugins: [],
}

