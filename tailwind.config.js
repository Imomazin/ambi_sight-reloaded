/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Legacy colors (still used in some components, remapped for new theme)
        navy: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
        },
        teal: {
          400: '#2DD4BF',
          500: '#14B8A6',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
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
