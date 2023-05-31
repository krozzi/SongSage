// const { space } = require('postcss/lib/list');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {

      fontFamily: {
        poppins: ['var(--font-poppins)'],
        space: ['var(--font-space)'],
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },

  daisyui: {
    themes: [
      {
        spotipal: {
          "primary": "#000000",
          "secondary": "#f3f4f6",
          "accent": "#1DB954",
          "neutral": "#FFFFFF",
          "base-100": "#000000",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
    ],
  },
  
  plugins: [require("daisyui")],
}
