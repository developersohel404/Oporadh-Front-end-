/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Hind Siliguri', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
