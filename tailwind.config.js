/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#B8E135',
        'electric-lime': '#B8E135',
        slate: {
          50: '#F8FAFB',
          100: '#F1F4F6',
          200: '#E4E9EC',
          300: '#D1D9DE',
          400: '#9CA8B3',
          500: '#6B7885',
          600: '#4A5662',
          700: '#333D47',
          800: '#1F262E',
          900: '#131820',
          950: '#0A0D11',
        },
        success: '#B8E135',
        warning: '#F5A623',
        danger: '#E8394A',
        info: '#3A8EF6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        h1: ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        h2: ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        body: ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        small: ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        label: ['11px', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase' }],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0, 0, 0, 0.07)',
        float: '0 8px 32px rgba(0, 0, 0, 0.14)',
        focus: '0 0 0 3px rgba(184, 225, 53, 0.3)',
      },
    },
  },
  plugins: [],
}
