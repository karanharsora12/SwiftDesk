import type { Config } from 'tailwindcss'

export default {
  content: ['./renderer/index.html', './renderer/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        glow: '0 10px 40px rgba(56, 189, 248, 0.16)',
        card: '0 1px 2px rgba(0, 0, 0, 0.18), 0 6px 16px -6px rgba(0, 0, 0, 0.25)',
        elevated: '0 12px 32px -8px rgba(0, 0, 0, 0.35)',
      },
      keyframes: {
        'dropdown-in': {
          from: { opacity: '0', transform: 'translateY(-4px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        }
      },
      animation: {
        'dropdown-in': 'dropdown-in 0.15s ease-out',
      }
    }
  },
  plugins: []
} satisfies Config
