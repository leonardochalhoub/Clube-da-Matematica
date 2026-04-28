import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './src/**/*.{ts,tsx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        clube: {
          // Tokens semânticos via CSS vars em formato RGB-tuple.
          // Permite opacity modifiers do Tailwind: bg-clube-teal/40
          teal: 'rgb(var(--clube-teal) / <alpha-value>)',
          'teal-deep': 'rgb(var(--clube-teal-deep) / <alpha-value>)',
          'teal-soft': 'rgb(var(--clube-teal-soft) / <alpha-value>)',
          gold: 'rgb(var(--clube-gold) / <alpha-value>)',
          'gold-deep': 'rgb(var(--clube-gold-deep) / <alpha-value>)',
          cream: 'rgb(var(--clube-cream) / <alpha-value>)',
          'cream-soft': 'rgb(var(--clube-cream-soft) / <alpha-value>)',
          surface: 'rgb(var(--clube-surface) / <alpha-value>)',
          ink: 'rgb(var(--clube-ink) / <alpha-value>)',
          mist: 'rgb(var(--clube-mist) / <alpha-value>)',
          'mist-soft': 'rgb(var(--clube-mist-soft) / <alpha-value>)',
          leaf: 'rgb(var(--clube-leaf) / <alpha-value>)',
          clay: 'rgb(var(--clube-clay) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'hero': ['clamp(1.875rem, 3.5vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      },
      maxWidth: {
        'prose-wide': '72ch',
      },
      typography: () => ({
        clube: {
          css: {
            '--tw-prose-body': 'rgb(var(--clube-ink))',
            '--tw-prose-headings': 'rgb(var(--clube-teal-deep))',
            '--tw-prose-lead': 'rgb(var(--clube-mist))',
            '--tw-prose-links': 'rgb(var(--clube-teal))',
            '--tw-prose-bold': 'rgb(var(--clube-ink))',
            '--tw-prose-counters': 'rgb(var(--clube-mist))',
            '--tw-prose-bullets': 'rgb(var(--clube-gold-deep))',
            '--tw-prose-hr': 'rgb(var(--clube-mist-soft))',
            '--tw-prose-quotes': 'rgb(var(--clube-teal-deep))',
            '--tw-prose-quote-borders': 'rgb(var(--clube-gold))',
            '--tw-prose-captions': 'rgb(var(--clube-mist))',
            '--tw-prose-code': 'rgb(var(--clube-teal-deep))',
            '--tw-prose-pre-code': 'rgb(var(--clube-cream))',
            '--tw-prose-pre-bg': 'rgb(var(--clube-teal-deep))',
            '--tw-prose-th-borders': 'rgb(var(--clube-mist-soft))',
            '--tw-prose-td-borders': 'rgb(var(--clube-mist-soft))',
          },
        },
      }),
    },
  },
  plugins: [typography],
}

export default config
