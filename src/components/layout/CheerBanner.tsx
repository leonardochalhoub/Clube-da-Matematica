'use client'

import { useEffect, useState } from 'react'
import { CHEERS, type Cheer } from '@/content/cheer-phrases'

/**
 * Faixa fina no topo do site com uma frase aleatória de incentivo ao
 * estudo de matemática. Tom: avô carinhoso torcendo pelos netos.
 *
 * Hidratação:
 *  - SSR e primeira renderização do cliente usam SEMPRE a primeira frase
 *    do array (canônica). Sem isso, o servidor escolheria uma e o cliente
 *    outra → mismatch de hidratação.
 *  - Após `useEffect`, o cliente sorteia uma frase aleatória entre todas
 *    e re-renderiza. Visitante vê uma frase nova a cada visita.
 *
 * Tipografia: serifa, italic, peso normal — quieto, mas presente. Tamanho
 * pequeno (text-sm sm:text-base) pra não competir com o hero abaixo.
 */
export function CheerBanner() {
  const [cheer, setCheer] = useState<Cheer>(CHEERS[0]!)

  useEffect(() => {
    const idx = Math.floor(Math.random() * CHEERS.length)
    setCheer(CHEERS[idx]!)
  }, [])

  const texto = typeof cheer === 'string' ? cheer : cheer.t
  const autor = typeof cheer === 'string' ? null : cheer.a
  const ano = typeof cheer === 'string' ? null : cheer.y

  return (
    <section
      aria-label="Frase do dia"
      className="border-b border-clube-mist-soft/30 bg-clube-cream/60"
    >
      <div className="container-clube py-4 sm:py-5">
        <div className="mx-auto max-w-3xl text-center">
          <p
            // Serifa pra dar peso clássico, italic pra marcar como citação,
            // tabular-nums porque algumas frases citam números.
            className="font-serif text-sm italic leading-relaxed text-clube-ink/85 sm:text-base"
          >
            <span aria-hidden="true" className="mr-1 text-clube-gold-deep">
              ◆
            </span>
            {texto}
            <span aria-hidden="true" className="ml-1 text-clube-gold-deep">
              ◆
            </span>
          </p>
          {autor && (
            <p className="mt-1 text-[11px] uppercase tracking-wider text-clube-mist sm:text-xs">
              — {autor}
              {ano && <span className="text-clube-mist/70">, {ano}</span>}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
