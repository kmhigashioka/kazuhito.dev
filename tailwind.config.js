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
  },
  variants: {},
  plugins: []
};
