/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
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
        // Surface colors with opacity (adapted from nyxusd)
        surface: {
          50: '#0a2342',
          100: '#084887',
          200: '#05668d',
          300: '#023e73',
          400: '#001f3f',
          500: '#001833',
          600: '#001327',
          700: '#000e1b',
          800: '#00090f',
          900: '#000408',
        },
        // Accent colors for highlights
        accent: {
          gold: '#ffd700',
          cyan: '#00f5ff',
          blue: '#0073e6',
          emerald: '#10b981',
        },
      },
      // Custom spacing
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
        144: '36rem',
      },
      // Typography enhancements
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular'],
        display: ['Poppins', 'Inter', 'ui-sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '3xl': ['1.953rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.441rem', { lineHeight: '2.75rem' }],
        '5xl': ['3.052rem', { lineHeight: '3.25rem' }],
      },
      // Custom animations
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
        'gradient-y': 'gradient-y 3s ease infinite',
        'gradient-xy': 'gradient-xy 3s ease infinite',
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'fade-out': 'fadeOut 0.5s ease-out',
        'slide-in-up': 'slideInUp 0.5s ease-out',
        'slide-in-down': 'slideInDown 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'gradient-y': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'center top',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center bottom',
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': 'right center',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px currentColor' },
          '100%': { boxShadow: '0 0 20px currentColor' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'abyss-gradient': 'linear-gradient(to bottom, var(--tw-colors-deepSea-surface), var(--tw-colors-deepSea-abyss))',
        'abyss-radial': 'radial-gradient(circle, var(--tw-colors-deepSea-middle) 0%, var(--tw-colors-deepSea-abyss) 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-abyss': 'linear-gradient(135deg, #0a2342 0%, #001f3f 100%)',
        'gradient-bitcoin': 'linear-gradient(135deg, #ffc300 0%, #cc9c00 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #0073e6 0%, #002d5c 100%)',
      },
      // Enhanced backdrop blur
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
        '4xl': '128px',
      },
      boxShadow: {
        'bitcoin': '0 0 15px rgba(255, 195, 0, 0.5)',
        'bitcoin-lg': '0 0 25px rgba(255, 195, 0, 0.7)',
        abyss: '0 4px 6px -1px rgba(0, 31, 63, 0.3), 0 2px 4px -1px rgba(0, 31, 63, 0.2)',
        ocean: '0 4px 6px -1px rgba(0, 115, 230, 0.3), 0 2px 4px -1px rgba(0, 115, 230, 0.2)',
        'glow-sm': '0 0 5px currentColor',
        glow: '0 0 10px currentColor',
        'glow-lg': '0 0 20px currentColor',
        'glow-xl': '0 0 40px currentColor',
      },
      // Border radius variations
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      // Responsive breakpoints optimization
      screens: {
        xs: '475px',
        '3xl': '1600px',
        '4xl': '1920px',
      },
      // Z-index scale
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
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
    function ({ addUtilities, addComponents, theme }) {
      const newUtilities = {
        // Gradient text utilities
        '.text-gradient-abyss': {
          background: 'linear-gradient(135deg, #0073e6 0%, #00162e 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-bitcoin': {
          background: 'linear-gradient(135deg, #ffc300 0%, #cc9c00 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-ocean': {
          background: 'linear-gradient(135deg, #00f5ff 0%, #0073e6 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        // Glass morphism utilities
        '.glass': {
          background: 'rgba(0, 115, 230, 0.08)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(0, 115, 230, 0.15)',
        },
        '.glass-dark': {
          background: 'rgba(0, 31, 63, 0.3)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(0, 115, 230, 0.2)',
        },
        // Custom scrollbar
        '.scrollbar-abyss': {
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme('colors.deepSea.deep'),
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme('colors.bitcoin.500'),
            'border-radius': '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme('colors.bitcoin.600'),
          },
        },
      };

      const newComponents = {
        // Card components
        '.card-abyss': {
          background: 'linear-gradient(135deg, rgba(10, 35, 66, 0.8) 0%, rgba(0, 31, 63, 0.8) 100%)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(0, 115, 230, 0.2)',
          'border-radius': theme('borderRadius.xl'),
          padding: theme('spacing.6'),
        },
        '.card-ocean': {
          background: 'linear-gradient(135deg, rgba(5, 102, 141, 0.8) 0%, rgba(0, 115, 230, 0.8) 100%)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 195, 0, 0.2)',
          'border-radius': theme('borderRadius.xl'),
          padding: theme('spacing.6'),
        },
        // Button components
        '.btn-abyss': {
          background: 'linear-gradient(135deg, #023e73 0%, #001f3f 100%)',
          color: '#ffffff',
          padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
          'border-radius': theme('borderRadius.lg'),
          'font-weight': theme('fontWeight.medium'),
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            'box-shadow': '0 10px 20px rgba(0, 115, 230, 0.3)',
          },
        },
        '.btn-bitcoin': {
          background: 'linear-gradient(135deg, #ffc300 0%, #cc9c00 100%)',
          color: '#00162e',
          padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
          'border-radius': theme('borderRadius.lg'),
          'font-weight': theme('fontWeight.medium'),
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            'box-shadow': '0 10px 20px rgba(255, 195, 0, 0.3)',
          },
        },
      };

      addUtilities(newUtilities);
      addComponents(newComponents);
    },
  ],
};
