module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        'timeline': 'calc(100% + 0.75rem)',
      },
    },
  },
  variants: {
    extend: {
      flexDirection: ['even'],
    },
  },
  plugins: [],
}
