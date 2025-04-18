/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'parchment': '#f5f0e1',
        'parchment-light': '#fcf9f2',
        'parchment-dark': '#e7dcc8',
        'ink': '#2a2a2a',
        'ink-light': '#3a3a3a',
        'ink-dark': '#1a1a1a',
        'candlelight': '#ffdb58',
        'candlelight-glow': '#ffe896',
        'scroll': '#d1ba9c',
        'scroll-dark': '#b39b7c',
        'quill-blue': '#4b7cb0',
        'quill-light': '#6b9cd0',
        'oak': '#8b5a2b',
        'oak-light': '#ab7a4b',
        'magic-purple': '#9370db',
        'magic-pink': '#ee82ee',
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(0, 0, 0, 0.2)',
        'pixel-light': '3px 3px 0px 0px rgba(0, 0, 0, 0.1)',
        'pixel-inset': 'inset 4px 4px 0px 0px rgba(0, 0, 0, 0.2)',
        'pixel-glow': '0 0 10px 2px rgba(255, 219, 88, 0.4)',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-glow': {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.3)' },
        },
        'pixel-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(3deg)' },
          '50%': { transform: 'rotate(0deg)' },
          '75%': { transform: 'rotate(-3deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'pixel-spin': 'pixel-spin 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
} 