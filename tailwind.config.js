/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        white: '#ffffff',
        black: '#000000',
        gray: {
          '50': '#f9fafb',
          '100': '#f4f5f7',
          '200': '#e5e7eb',
          '300': '#d5d6d7',
          '400': '#9e9e9e',
          '500': '#707275',
          '600': '#4c4f52',
          '700': '#24262d',
          '800': '#1a1c23',
          '900': '#121317',
        },
        blue: {
          '50': '#ebf5ff',
          '100': '#e1effe',
          '200': '#c3ddfd',
          '300': '#a4cafe',
          '400': '#76a9fa',
          '500': '#3f83f8',
          '600': '#1c64f2',
          '700': '#1a56db',
          '800': '#1e429f',
          '900': '#233876',
        },
        green: {
          '50': '#f3faf7',
          '100': '#def7ec',
          '200': '#bcf0da',
          '300': '#84e1bc',
          '400': '#31c48d',
          '500': '#0e9f6e',
          '600': '#057a55',
          '700': '#046c4e',
          '800': '#03543f',
          '900': '#014737',
        },
        red: {
          '50': '#fdf2f2',
          '100': '#fde8e8',
          '200': '#fbd5d5',
          '300': '#f8b4b4',
          '400': '#f98080',
          '500': '#f05252',
          '600': '#e02424',
          '700': '#c81e1e',
          '800': '#9b1c1c',
          '900': '#771d1d',
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
};
