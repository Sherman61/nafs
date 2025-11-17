/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#f5f2eb',
          DEFAULT: '#cfb995',
          dark: '#5c4327'
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
