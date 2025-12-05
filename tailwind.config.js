/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B0B0F',
          800: '#12121A',
          700: '#1A1A25',
          600: '#252535',
          500: '#353545',
        },
        teal: {
          400: '#2DD4BF',
          500: '#14B8A6',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
        magenta: {
          400: '#E879F9',
          500: '#D946EF',
        },
        lime: {
          400: '#A3E635',
          500: '#84CC16',
        },
        purple: {
          400: '#C084FC',
          500: '#A855F7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
