import type { Config } from 'tailwindcss'
import { colors, fontFamily, radii } from './app/utils/designTokens'

export default {
  content: ['./app/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors,
      fontFamily,
      borderRadius: radii,
    },
  },
} satisfies Config
