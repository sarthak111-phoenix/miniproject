/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        palette: {
          roastedCashew: '#948170',
          frozenDew: '#D5C3A5',
          darkNight: '#1A1715',
          templeGrey: '#B5AEA8',
          snowfall: '#F5F2EC',
        },
        bg: {
          base: 'var(--bg-base)',
          surface: 'var(--bg-surface)',
          elevated: 'var(--bg-surface-elevated)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          highlight: 'var(--border-highlight)',
        },
        sage: {
          50: '#F4F7F2',
          100: '#E7EDE4',
          200: '#D5DFD1',
          300: '#BACAB5',
          400: '#9FB599',
          500: '#849E7C',
          600: '#678160',
          700: '#4D6247',
          800: '#354331',
          900: '#1E281C',
        },
        forest: {
          base: '#1E2C22',
          deep: '#16231A',
          card: '#1F2E23',
          border: '#2E4233',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        pulseGlow: 'pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        spinSlow: 'spinSlow 20s linear infinite',
      }
    },
  },
  plugins: [],
};
