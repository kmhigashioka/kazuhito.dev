const colors = require('./tailwindcss/colors');

module.exports = {
  mode: "jit",
  purge: ["./app/**/*.{ts,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    boxShadow: {
      'button-light': 'inset 0px -4px 0px rgba(87, 75, 144, 0.5)',
      'card': '0px 4px 20px rgba(0, 0, 0, 0.25)',
    },
    colors: {
      ...colors,
    },
    extend: {},
    fontFamily: {
      'sans': ['Poppins'],
    },
    fontSize: {
      'xs': '0.75rem',
      'base': '1rem',
      'lg': '1.333rem',
      'xl': '1.777rem',
      '2xl': '2.369rem',
      '3xl': '3.157rem',
      '4xl': '4.209rem',
    },
    minWidth: {
      '96': '24rem',
    },
    zIndex: {
      'minus-1': -1
    }
  },
  variants: {},
  plugins: []
};
