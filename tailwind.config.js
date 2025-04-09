/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep blue abyss sea colors
        abyss: {
          50: '#e6f1ff',
          100: '#cce3ff',
          200: '#99c7ff',
          300: '#66abff',
          400: '#338fff',
          500: '#0073e6',
          600: '#005bb8',
          700: '#00448a',
          800: '#002d5c',
          900: '#00162e',
          950: '#000b17',
        },
        // Golden Bitcoin colors
        bitcoin: {
          50: '#fff9e6',
          100: '#fff3cc',
          200: '#ffe799',
          300: '#ffdb66',
          400: '#ffcf33',
          500: '#ffc300',
          600: '#cc9c00',
          700: '#997500',
          800: '#664e00',
          900: '#332700',
          950: '#1a1300',
        },
        // Deep sea gradients
        deepSea: {
          surface: '#0a2342',
          shallow: '#084887',
          middle: '#05668d',
          deep: '#023e73',
          abyss: '#001f3f',
        },
      },
      backgroundImage: {
        'abyss-gradient': 'linear-gradient(to bottom, var(--tw-colors-deepSea-surface), var(--tw-colors-deepSea-abyss))',
        'abyss-radial': 'radial-gradient(circle, var(--tw-colors-deepSea-middle) 0%, var(--tw-colors-deepSea-abyss) 100%)',
      },
      boxShadow: {
        'bitcoin': '0 0 15px rgba(255, 195, 0, 0.5)',
        'bitcoin-lg': '0 0 25px rgba(255, 195, 0, 0.7)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.bitcoin.500'),
              '&:hover': {
                color: theme('colors.bitcoin.600'),
              },
            },
            h1: {
              color: theme('colors.abyss.800'),
            },
            h2: {
              color: theme('colors.abyss.700'),
            },
            h3: {
              color: theme('colors.abyss.600'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
