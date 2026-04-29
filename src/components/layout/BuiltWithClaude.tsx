'use client'

import { useLocale } from './LocaleProvider'

/**
 * Pequeno badge "Built with Claude Code" para o rodapé.
 * Usa logo SVG light/dark do Claude Code (originalmente do Mirante dos Dados).
 */
export function BuiltWithClaude() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
  const { t } = useLocale()
  return (
    <a
      href="https://www.anthropic.com/claude-code"
      target="_blank"
      rel="noopener noreferrer"
      title={`${t('footer.builtWith')} Claude Code (Anthropic)`}
      className="group inline-flex items-center gap-2 rounded-full border border-clube-mist-soft/40 bg-clube-surface/70 px-3 py-1.5 text-[11px] text-clube-mist transition-all hover:border-clube-gold-deep/50 hover:bg-clube-cream-soft hover:no-underline"
      aria-label={`${t('footer.builtWith')} Claude Code`}
    >
      <span className="text-[10px] uppercase tracking-wider text-clube-mist/80">
        {t('footer.builtWith')}
      </span>
      {/* Logo light (visível no tema claro) */}
      <img
        src={`${base}/claude-code-logo.svg`}
        alt="Claude Code"
        width={86}
        height={20}
        className="h-5 w-auto dark:hidden"
      />
      {/* Logo dark/reverse (visível no tema escuro) */}
      <img
        src={`${base}/claude-code-logo-rev.svg`}
        alt="Claude Code"
        width={86}
        height={20}
        className="hidden h-5 w-auto dark:block"
      />
    </a>
  )
}
