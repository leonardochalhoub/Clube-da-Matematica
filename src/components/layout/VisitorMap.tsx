'use client'

import { useEffect, useState } from 'react'
import { readCounter } from '@/lib/analytics/visitor-tracker'
import { Flag } from './Flag'

/**
 * Lista os ~80 países que potencialmente tem leitores. Para cada um, lê
 * o contador `clube-pais-{ISO2}`. Renderiza em ordem decrescente.
 *
 * NOTA: Por limite do CounterAPI, não dá pra "listar todas chaves" —
 * temos que enumerar países que QUEREMOS verificar. Lista abaixo
 * cobre todos países onde o site provavelmente terá uso significativo.
 */
const PAISES_RASTREADOS: Array<{ iso2: string; nome: string; emoji: string }> = [
  { iso2: 'br', nome: 'Brasil', emoji: '🇧🇷' },
  { iso2: 'pt', nome: 'Portugal', emoji: '🇵🇹' },
  { iso2: 'us', nome: 'United States', emoji: '🇺🇸' },
  { iso2: 'gb', nome: 'United Kingdom', emoji: '🇬🇧' },
  { iso2: 'ca', nome: 'Canada', emoji: '🇨🇦' },
  { iso2: 'mx', nome: 'México', emoji: '🇲🇽' },
  { iso2: 'es', nome: 'España', emoji: '🇪🇸' },
  { iso2: 'ar', nome: 'Argentina', emoji: '🇦🇷' },
  { iso2: 'co', nome: 'Colombia', emoji: '🇨🇴' },
  { iso2: 'cl', nome: 'Chile', emoji: '🇨🇱' },
  { iso2: 'pe', nome: 'Perú', emoji: '🇵🇪' },
  { iso2: 've', nome: 'Venezuela', emoji: '🇻🇪' },
  { iso2: 'fr', nome: 'France', emoji: '🇫🇷' },
  { iso2: 'de', nome: 'Deutschland', emoji: '🇩🇪' },
  { iso2: 'it', nome: 'Italia', emoji: '🇮🇹' },
  { iso2: 'nl', nome: 'Nederland', emoji: '🇳🇱' },
  { iso2: 'be', nome: 'België', emoji: '🇧🇪' },
  { iso2: 'ch', nome: 'Schweiz', emoji: '🇨🇭' },
  { iso2: 'at', nome: 'Österreich', emoji: '🇦🇹' },
  { iso2: 'se', nome: 'Sverige', emoji: '🇸🇪' },
  { iso2: 'no', nome: 'Norge', emoji: '🇳🇴' },
  { iso2: 'dk', nome: 'Danmark', emoji: '🇩🇰' },
  { iso2: 'fi', nome: 'Suomi', emoji: '🇫🇮' },
  { iso2: 'pl', nome: 'Polska', emoji: '🇵🇱' },
  { iso2: 'cz', nome: 'Česko', emoji: '🇨🇿' },
  { iso2: 'ru', nome: 'Россия', emoji: '🇷🇺' },
  { iso2: 'ua', nome: 'Україна', emoji: '🇺🇦' },
  { iso2: 'tr', nome: 'Türkiye', emoji: '🇹🇷' },
  { iso2: 'gr', nome: 'Ελλάδα', emoji: '🇬🇷' },
  { iso2: 'ee', nome: 'Eesti', emoji: '🇪🇪' },
  { iso2: 'cn', nome: '中国', emoji: '🇨🇳' },
  { iso2: 'jp', nome: '日本', emoji: '🇯🇵' },
  { iso2: 'kr', nome: '대한민국', emoji: '🇰🇷' },
  { iso2: 'in', nome: 'भारत', emoji: '🇮🇳' },
  { iso2: 'pk', nome: 'Pakistan', emoji: '🇵🇰' },
  { iso2: 'bd', nome: 'বাংলাদেশ', emoji: '🇧🇩' },
  { iso2: 'id', nome: 'Indonesia', emoji: '🇮🇩' },
  { iso2: 'vn', nome: 'Việt Nam', emoji: '🇻🇳' },
  { iso2: 'th', nome: 'ประเทศไทย', emoji: '🇹🇭' },
  { iso2: 'ph', nome: 'Pilipinas', emoji: '🇵🇭' },
  { iso2: 'my', nome: 'Malaysia', emoji: '🇲🇾' },
  { iso2: 'sg', nome: 'Singapore', emoji: '🇸🇬' },
  { iso2: 'au', nome: 'Australia', emoji: '🇦🇺' },
  { iso2: 'nz', nome: 'New Zealand', emoji: '🇳🇿' },
  { iso2: 'lb', nome: 'لبنان', emoji: '🇱🇧' },
  { iso2: 'sa', nome: 'السعودية', emoji: '🇸🇦' },
  { iso2: 'ae', nome: 'الإمارات', emoji: '🇦🇪' },
  { iso2: 'eg', nome: 'مصر', emoji: '🇪🇬' },
  { iso2: 'jo', nome: 'الأردن', emoji: '🇯🇴' },
  { iso2: 'sy', nome: 'سوريا', emoji: '🇸🇾' },
  { iso2: 'il', nome: 'ישראל', emoji: '🇮🇱' },
  { iso2: 'ir', nome: 'ایران', emoji: '🇮🇷' },
  { iso2: 'za', nome: 'South Africa', emoji: '🇿🇦' },
  { iso2: 'ke', nome: 'Kenya', emoji: '🇰🇪' },
  { iso2: 'tz', nome: 'Tanzania', emoji: '🇹🇿' },
  { iso2: 'ug', nome: 'Uganda', emoji: '🇺🇬' },
  { iso2: 'ng', nome: 'Nigeria', emoji: '🇳🇬' },
  { iso2: 'gh', nome: 'Ghana', emoji: '🇬🇭' },
  { iso2: 'ma', nome: 'المغرب', emoji: '🇲🇦' },
  { iso2: 'ao', nome: 'Angola', emoji: '🇦🇴' },
  { iso2: 'mz', nome: 'Moçambique', emoji: '🇲🇿' },
  { iso2: 'ie', nome: 'Éire', emoji: '🇮🇪' },
  { iso2: 'is', nome: 'Ísland', emoji: '🇮🇸' },
  { iso2: 'lt', nome: 'Lietuva', emoji: '🇱🇹' },
  { iso2: 'lv', nome: 'Latvija', emoji: '🇱🇻' },
  { iso2: 'hu', nome: 'Magyarország', emoji: '🇭🇺' },
  { iso2: 'ro', nome: 'România', emoji: '🇷🇴' },
  { iso2: 'bg', nome: 'България', emoji: '🇧🇬' },
  { iso2: 'rs', nome: 'Србија', emoji: '🇷🇸' },
  { iso2: 'hr', nome: 'Hrvatska', emoji: '🇭🇷' },
]

interface CountryData {
  iso2: string
  nome: string
  emoji: string
  count: number
}

export function VisitorMap() {
  const [data, setData] = useState<CountryData[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function carregar() {
      const promises = PAISES_RASTREADOS.map(async (p) => {
        const c = await readCounter(`pais-${p.iso2}`)
        return { ...p, count: c ?? 0 }
      })
      const results = await Promise.all(promises)
      if (cancelled) return
      const filtered = results.filter((r) => r.count > 0)
      filtered.sort((a, b) => b.count - a.count)
      setData(filtered)
      setLoading(false)
    }
    carregar()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="rounded-xl border border-clube-mist-soft/40 bg-clube-cream-soft/30 p-8 text-center text-sm text-clube-mist">
        Carregando dados de visitantes…
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-clube-mist-soft/40 bg-clube-cream-soft/30 p-12 text-center">
        <p className="text-base text-clube-mist">
          Ainda sem visitas registradas — seja o primeiro!
        </p>
        <p className="mt-2 text-xs italic text-clube-mist/70">
          (As contagens aparecem após o primeiro acesso de cada país.)
        </p>
      </div>
    )
  }

  const total = data.reduce((acc, c) => acc + c.count, 0)
  const max = data[0]!.count

  return (
    <div>
      <div className="mb-6 rounded-xl border border-clube-teal/30 bg-clube-teal/5 p-4 text-center">
        <p className="text-sm text-clube-mist">
          Visitantes vindos de <strong className="text-clube-teal-deep">{data.length} países</strong> ·
          total <strong className="text-clube-teal-deep">{total.toLocaleString('pt-BR')}</strong>
        </p>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((c) => {
          const pct = (c.count / max) * 100
          return (
            <li
              key={c.iso2}
              className="relative overflow-hidden rounded-lg border border-clube-mist-soft/40 bg-clube-surface px-3 py-2.5"
            >
              <div
                className="pointer-events-none absolute inset-y-0 left-0 bg-clube-teal/10"
                style={{ width: `${pct}%` }}
                aria-hidden
              />
              <div className="relative flex items-center gap-2.5">
                <Flag emoji={c.emoji} size={22} />
                <span className="flex-1 truncate text-sm font-medium text-clube-ink/90">
                  {c.nome}
                </span>
                <span className="font-mono text-sm font-semibold text-clube-teal-deep">
                  {c.count.toLocaleString('pt-BR')}
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="mt-6 text-center text-xs italic text-clube-mist/70">
        Dados anônimos · Geolocalização aproximada via IP · Atualizado a cada acesso
      </p>
    </div>
  )
}
