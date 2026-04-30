'use client'

import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { AmazingSchoolSponsor } from './AmazingSchoolSponsor'
import { BuiltWithClaude } from './BuiltWithClaude'
import { useLocale } from './LocaleProvider'

export function Footer() {
  const { t } = useLocale()
  return (
    <footer className="mt-24 border-t border-clube-mist-soft/30 bg-clube-cream-soft">
      <div className="container-clube py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Logo size={28} />
              <span className="font-semibold text-clube-ink">Clube da Matemática</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-clube-mist">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-clube-mist">
              {t('footer.authorship')}
            </h4>
            <ul className="mt-3 space-y-3 text-sm">
              <li>
                <div className="font-semibold text-clube-ink">
                  Leonardo Chalhoub
                </div>
                <a
                  href="https://www.linkedin.com/in/leonardochalhoub/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-clube-mist hover:text-clube-teal"
                >
                  LinkedIn ↗
                </a>
              </li>
              <li>
                <div className="font-semibold text-clube-ink">
                  Jefferson Korte Junior
                </div>
                <div className="text-[11px] italic text-clube-mist/80">
                  UTFPR · jeffersonkorte@gmail.com
                </div>
                <a
                  href="https://www.linkedin.com/in/jefferson-korte-dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-clube-mist hover:text-clube-teal"
                >
                  LinkedIn ↗
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-clube-mist">
              {t('footer.navigation')}
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/conteudos" className="text-clube-ink/80 hover:text-clube-teal">
                  {t('footer.allContent')}
                </Link>
              </li>
              <li>
                <Link href="/manifesto" className="text-clube-ink/80 hover:text-clube-teal">
                  {t('nav.manifesto')}
                </Link>
              </li>
              <li>
                <a
                  href="https://leonardochalhoub.github.io/mirante-dos-dados-br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-clube-ink/80 hover:text-clube-teal"
                >
                  Mirante dos Dados ↗
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-clube-mist">
              {t('footer.openSource')}
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/leonardochalhoub/Clube-da-Matematica"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-clube-ink/80 hover:text-clube-teal"
                >
                  {t('footer.repo')}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/leonardochalhoub/Clube-da-Matematica/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-clube-ink/80 hover:text-clube-teal"
                >
                  {t('footer.license')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-clube-mist-soft/30 pt-6 text-center text-xs text-clube-mist">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-wider text-clube-mist/80">
              {t('footer.sponsor.label')}
            </p>
            <AmazingSchoolSponsor />
          </div>
          <BuiltWithClaude />
          <p className="max-w-2xl text-clube-mist">
            {t('footer.khan')}
          </p>
        </div>
      </div>
    </footer>
  )
}
