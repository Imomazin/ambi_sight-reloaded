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
          900: '#08090d',
          800: '#0f1118',
          700: '#171924',
          600: '#1f2231',
          500: '#2a2d3e',
        },
        teal: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        magenta: {
          400: '#f0abfc',
          500: '#d946ef',
        },
        lime: {
          400: '#a3e635',
          500: '#84cc16',
        },
        purple: {
          400: '#a78bfa',
          500: '#8b5cf6',
        },
        indigo: {
          400: '#818cf8',
          500: '#6366f1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        'glow-sm': '0 0 12px rgba(16, 185, 129, 0.15)',
        'glow-md': '0 0 24px rgba(16, 185, 129, 0.2)',
        'glow-lg': '0 0 40px rgba(16, 185, 129, 0.25)',
        'soft': '0 2px 16px rgba(0, 0, 0, 0.08)',
        'elevated': '0 8px 32px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
