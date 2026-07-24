import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-deep': 'var(--bg-deep)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        gold: 'var(--gold)',
        'gold-soft': 'var(--gold-soft)',
        rose: 'var(--rose-color)',
        sky: 'var(--sky-color)',
        sage: 'var(--sage)',
        violet: 'var(--violet-color)',
        line: 'var(--line)',
      },
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'Georgia', 'serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        fraunces: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      maxWidth: {
        layout: '1280px',
      },
      animation: {
        breathe: 'breathe 6s ease-in-out infinite',
        ambient: 'ambient 40s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) forwards',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.08)', opacity: '0.9' },
        },
        ambient: {
          '0%, 100%': { background: 'var(--bg)' },
          '50%': { background: '#EDE8DF' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}

export default config
