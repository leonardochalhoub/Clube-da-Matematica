import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-clube-mist-soft/40 bg-clube-cream/85 backdrop-blur-md">
      <div className="container-clube flex h-16 items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-3 no-underline hover:no-underline"
          aria-label="Página inicial do Clube da Matemática"
        >
          <Logo size={32} className="transition-transform group-hover:rotate-6" />
          <span className="font-sans text-lg font-semibold tracking-tight text-clube-ink">
            Clube <span className="text-clube-mist">da</span> Matemática
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav aria-label="Navegação principal">
            <ul className="flex items-center gap-1 sm:gap-2">
              <li>
                <Link
                  href="/ensino-medio"
                  className="rounded-md px-3 py-2 text-sm font-medium text-clube-ink/80 transition-colors hover:bg-clube-cream-soft hover:text-clube-teal hover:no-underline"
                >
                  Ensino Médio
                </Link>
              </li>
              <li>
                <Link
                  href="/financas"
                  className="rounded-md px-3 py-2 text-sm font-medium text-clube-ink/80 transition-colors hover:bg-clube-cream-soft hover:text-clube-teal hover:no-underline"
                >
                  Finanças
                </Link>
              </li>
              <li>
                <Link
                  href="/manifesto"
                  className="rounded-md px-3 py-2 text-sm font-medium text-clube-ink/80 transition-colors hover:bg-clube-cream-soft hover:text-clube-teal hover:no-underline"
                >
                  Manifesto
                </Link>
              </li>
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
          <div className="ml-1 border-l border-clube-mist-soft/40 pl-1 sm:pl-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
