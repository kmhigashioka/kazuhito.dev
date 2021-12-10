const colors = require('./tailwindcss/colors');

module.exports = {
  mode: "jit",
  purge: ["./app/**/*.{ts,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    colors: {
      ...colors,
    },
    extend: {},
    fontFamily: {
      'sans': ['Poppins'],
    },
    fontSize: {
      'base': '1rem',
      'lg': '1.333rem',
      'xl': '1.777rem',
      '2xl': '2.369rem',
      '3xl': '3.157rem',
      '4xl': '4.209rem',
    },
    zIndex: {
      'minus-1': -1
    }
  },
  variants: {},
  plugins: []
};
