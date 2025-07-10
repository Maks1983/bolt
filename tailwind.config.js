/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary': '#028ee5',
        'secondary': '#00314f',
        'neutral': '#272727',
        'background': '#010d14',
      },
    },
  },
  plugins: [],
};
