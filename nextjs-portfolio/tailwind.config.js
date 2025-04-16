/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
    textColor: {
      DEFAULT: '#F7931A',
    },
      colors: {
        'abyss-dark': '#06102a', // deep blue background
        'abyss-light': '#11204d', // lighter deep blue
        'accent': '#2563eb', // blue-600
        'accent-dark': '#1e40af', // blue-800
        'accent-light': '#60a5fa', // blue-400
        'bitcoin': '#F7931A', // bitcoin orange
      },
      boxShadow: {
        'glow': '0 0 24px 4px #7f5af0',
      },
      animation: {
        'glow': 'glow 2s infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { filter: 'drop-shadow(0 0 2px #7f5af0)' },
          '100%': { filter: 'drop-shadow(0 0 16px #7f5af0)' },
        },
      },
    },
  },
  plugins: [],
};
