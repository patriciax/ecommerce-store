/** @type {import('tailwindcss').Config} */

export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: 'class',
        theme: {
      extend: {
        colors: {},
        screens: {
            xs: '375px',
            '3xl': '1920px',
          },
      },
    },
    safelist: [
      {
        pattern: /grid-cols-./,
      }
    ],
    plugins: [],
  }