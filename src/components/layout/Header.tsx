'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Logo } from '@/components/brand/Logo'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LocaleSwitcher } from './LocaleSwitcher'

const NAV_LINKS = [
  { href: '/ensino-medio', label: 'Ensino Médio' },
  { href: '/financas', label: 'Finanças' },
  { href: '/livros', label: 'Livros' },
  { href: '/videos', label: 'Vídeos' },
  { href: '/provas', label: 'Provas' },
  { href: '/manifesto', label: 'Manifesto' },
] as const

export function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-clube-mist-soft/40 bg-clube-cream/85 backdrop-blur-md">
      <div className="container-clube flex h-16 items-center justify-between gap-2">
        <Link
          href="/"
          className="group flex items-center gap-2 no-underline hover:no-underline sm:gap-3"
          aria-label="Página inicial do Clube da Matemática"
        >
          <Logo size={28} className="transition-transform group-hover:rotate-6 sm:hidden" />
          <Logo size={32} className="transition-transform group-hover:rotate-6 hidden sm:block" />
          <span className="font-sans text-sm font-semibold tracking-tight text-clube-ink sm:text-lg">
            Clube <span className="text-clube-mist">da</span> Matemática
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-clube-ink/80 transition-colors hover:bg-clube-cream-soft hover:text-clube-teal hover:no-underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://github.com/leonardochalhoub/Clube-da-Matematica"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-3 py-2 text-sm font-medium text-clube-ink/80 transition-colors hover:bg-clube-cream-soft hover:text-clube-teal hover:no-underline"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-controls="mobile-menu"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-clube-ink/80 hover:bg-clube-cream-soft hover:text-clube-teal"
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 top-16 z-30 bg-clube-ink/30 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav
            id="mobile-menu"
            aria-label="Navegação mobile"
            className="fixed inset-x-0 top-16 z-40 border-b border-clube-mist-soft/40 bg-clube-cream shadow-md lg:hidden"
          >
            <ul className="container-clube flex flex-col gap-1 py-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-3 text-base font-medium text-clube-ink/85 transition-colors hover:bg-clube-cream-soft hover:text-clube-teal hover:no-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://github.com/leonardochalhoub/Clube-da-Matematica"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-3 text-base font-medium text-clube-ink/85 transition-colors hover:bg-clube-cream-soft hover:text-clube-teal hover:no-underline"
                >
                  GitHub ↗
                </a>
              </li>
            </ul>
          </nav>
        </>
      )}
    </header>
  )
}
