import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          base: '#0B0514',
          surface: '#120A22',
          elevated: '#1A0B2E',
          border: '#2A1650',
          'border-bright': '#3D2070',
          accent: '#C6F135',
          'accent-bright': '#D4FF4A',
          text: '#F5F0FF',
          muted: '#B8A5D4',
          tertiary: '#6B5490',
          success: '#00D084',
          warning: '#FFB547',
          error: '#FF5B5B',
          rose: '#FF4D8D',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Plus Jakarta Sans', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1.05', fontWeight: '800' }],
        'display-sm': ['3rem', { lineHeight: '1.08', fontWeight: '800' }],
      },
      animation: {
        'gradient': 'gradient 8s ease infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
