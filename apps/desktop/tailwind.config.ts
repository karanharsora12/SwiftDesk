import type { Config } from 'tailwindcss'

export default {
  content: ['./renderer/index.html', './renderer/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 10px 40px rgba(56, 189, 248, 0.16)'
      }
    }
  },
  plugins: []
} satisfies Config
