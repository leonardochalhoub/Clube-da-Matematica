import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-clube-mist-soft/30 bg-clube-cream-soft">
      <div className="container-clube py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <Logo size={28} />
              <span className="font-semibold text-clube-ink">Clube da Matemática</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-clube-mist">
              Aprenda matemática de verdade. Open source, gratuito, em português — sempre.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-clube-mist">
              Navegação
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/conteudos" className="text-clube-ink/80 hover:text-clube-teal">
                  Todos os conteúdos
                </Link>
              </li>
              <li>
                <Link href="/manifesto" className="text-clube-ink/80 hover:text-clube-teal">
                  Manifesto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-clube-mist">
              Open source
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/leonardochalhoub/Clube-da-Matematica"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-clube-ink/80 hover:text-clube-teal"
                >
                  Repositório no GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/leonardochalhoub/Clube-da-Matematica/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-clube-ink/80 hover:text-clube-teal"
                >
                  Licença MIT
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-clube-mist-soft/30 pt-6 text-center text-xs text-clube-mist">
          <p>
            Não competimos com Khan — Khan ensina conta. Competimos com o silêncio entre saber a
            fórmula e entender o que ela diz sobre o mundo.
          </p>
        </div>
      </div>
    </footer>
  )
}
