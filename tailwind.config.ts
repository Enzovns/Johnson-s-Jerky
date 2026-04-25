import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        terra: '#B85C38',
        'dark-terra': '#8B3A1F',
        sand: '#E8D5B7',
        parchment: '#F5E6D3',
        leather: '#3E2723',
        'dark-leather': '#5D4037',
        gold: '#C9A961',
        charcoal: '#1A1A1A',
      },
      fontFamily: {
        western: ['var(--font-western)', 'Georgia', 'serif'],
        body: ['var(--font-body)', '"Courier New"', 'monospace'],
      },
      backgroundImage: {
        'hero-sunset': 'linear-gradient(to bottom, #FF6B35 0%, #B85C38 25%, #8B3A1F 55%, #4A1A08 80%, #3E2723 100%)',
        'parchment-texture': "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(139,58,31,0.03) 10px, rgba(139,58,31,0.03) 20px)",
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'dust': 'dust 6s ease-in-out infinite',
        'sway': 'sway 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        dust: {
          '0%': { transform: 'translateX(0) translateY(0)', opacity: '0' },
          '20%': { opacity: '0.4' },
          '80%': { opacity: '0.2' },
          '100%': { transform: 'translateX(60px) translateY(-80px)', opacity: '0' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
      boxShadow: {
        'wanted': '0 0 0 2px #3E2723, 0 0 0 6px #F5E6D3, 0 0 0 8px #B85C38',
        'western': '4px 4px 0 #3E2723',
        'deep': '0 20px 60px rgba(62,39,35,0.4)',
      },
    },
  },
  plugins: [],
}

export default config
