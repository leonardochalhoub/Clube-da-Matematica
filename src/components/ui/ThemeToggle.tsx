'use client'

import { useLocale } from '@/components/layout/LocaleProvider'

/**
 * Toggle de tema claro/escuro.
 *
 * Lógica:
 * - Toggle adiciona/remove `dark` em <html>; o CSS reage via tokens.
 * - Persistência: localStorage.theme.
 * - O script inline em layout.tsx aplica o tema antes do primeiro paint
 *   (evita flash). Aqui só lidamos com o clique.
 *
 * Os dois ícones (sol e lua) são server-rendered; o CSS mostra só um
 * deles baseado em `.dark` em <html>. Zero hidratação reativa, zero flash.
 */
export function ThemeToggle() {
  const { t } = useLocale()

  function alternar() {
    const eEscuro = document.documentElement.classList.toggle('dark')
    try {
      localStorage.setItem('theme', eEscuro ? 'dark' : 'light')
    } catch {
      /* localStorage indisponível em alguns contextos privados */
    }
  }

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={t('theme.toggle.aria')}
      title={t('theme.toggle.title')}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-clube-ink/70 transition-colors hover:bg-clube-cream-soft hover:text-clube-teal"
    >
      <SunIcon className="dark:hidden" />
      <MoonIcon className="hidden dark:block" />
    </button>
  )
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="18"
      height="18"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="18"
      height="18"
      aria-hidden="true"
      className={className}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
