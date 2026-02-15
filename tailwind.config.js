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
          900: '#060609',
          800: '#111118',
          700: '#1A1A25',
          600: '#252535',
          500: '#353545',
        },
        teal: {
          400: '#C084FC',
          500: '#A855F7',
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
