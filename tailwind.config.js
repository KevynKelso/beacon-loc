module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  important: true,

  darkMode: false, // or 'media' or 'class'
  theme: {
    minWidth: {
     '0': '0',
     '1/4': '25%',
     '1/3': '33%',
     '1/2': '50%',
     '2/3': '66%',
     '3/4': '75%',
     'full': '100%',
    },
    minHeight: {
     '0': '0',
     '1/4': '25%',
     '1/3': '33%',
     '1/2': '50%',
     '2/3': '66%',
     '3/4': '75%',
     'full': '100%',
    },
    maxWidth: {
     '0': '0',
     '1/4': '25%',
     '1/3': '33%',
     '1/2': '50%',
     '2/3': '66%',
     '3/4': '75%',
     'full': '100%',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
