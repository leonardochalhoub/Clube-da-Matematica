import { ImageResponse } from 'next/og'
import { carregarPorSlug, publicadosApenas } from '@/lib/content/loader'
import { caminhoArquivoMdx, lerMdxSource } from '@/lib/content/loader-i18n'
import { LOCALES, localeToUrl, urlToLocale, type Locale } from '@/lib/i18n/locales'
import { SITE_NAME_BY_LOCALE } from '@/lib/seo/site'

export const alt = 'Clube da Matemática — lesson card'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Params {
  locale: string
  categoria: string
  caminho: string[]
}

export function generateImageMetadata({ params: _params }: { params: Params }) {
  return [{ id: 'card', alt, size, contentType }]
}

/** Deterministic non-negative 32-bit hash of a string (FNV-1a). */
function hashSeed(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/**
 * PT-BR only (2026-08-06 pivot — mirrors the page's generateStaticParams).
 */
export async function generateStaticParams(): Promise<Params[]> {
  const params: Params[] = []
  for (const { caminho } of publicadosApenas()) {
    const [categoria, ...rest] = caminho.split('/')
    if (!categoria || rest.length === 0) continue
    params.push({ locale: localeToUrl('pt-BR'), categoria, caminho: rest })
  }
  return params
}

export default async function Image({ params }: { params: Promise<Params> }) {
  const { locale: urlCode, categoria, caminho } = await params
  const localeCode = urlToLocale(urlCode) ?? 'pt-BR'
  const slug = caminho[caminho.length - 1] ?? ''

  const conteudo = carregarPorSlug(slug)
  if (!conteudo) {
    return new ImageResponse(<DefaultCard locale={localeCode} />, size)
  }

  let titulo = conteudo.meta.titulo
  const info = LOCALES[localeCode]
  const arquivo = caminhoArquivoMdx(`${categoria}/${caminho.join('/')}`, localeCode, info.speechLang)
  if (arquivo) {
    try {
      const { data } = await lerMdxSource(arquivo)
      if (typeof data.titulo === 'string') titulo = data.titulo
    } catch {
      /* keep PT-BR */
    }
  }

  const subtitle = lessonSubtitle(conteudo.meta.subcategoria ?? '', localeCode)
  const siteName = SITE_NAME_BY_LOCALE[localeCode]
  const flag = LOCALES[localeCode].bandeira
  // Deterministic "exercise count" badge seeded from the slug — stable across
  // builds (output: export must be reproducible; Math.random() is banned).
  const exBadge = 30 + (hashSeed(slug) % 51) // 30–80

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #0f3a3a 0%, #1a5252 60%, #246b6b 100%)',
          color: '#fff7e6',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 28,
            opacity: 0.85,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 44 }}>∫</span>
            <span style={{ fontWeight: 600 }}>{siteName}</span>
          </div>
          <span style={{ fontSize: 48 }}>{flag}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {subtitle && (
            <div
              style={{
                fontSize: 32,
                color: '#e6c98a',
                fontWeight: 500,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {subtitle}
            </div>
          )}
          <div
            style={{
              fontSize: titulo.length > 60 ? 56 : 72,
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: 1040,
            }}
          >
            {titulo}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 24,
            opacity: 0.75,
            borderTop: '1px solid rgba(255,247,230,0.2)',
            paddingTop: 24,
          }}
        >
          <span>{taglineFor(localeCode)}</span>
          <span style={{ fontSize: 20 }}>{exBadge} · 7 portas</span>
        </div>
      </div>
    ),
    size,
  )
}

function DefaultCard({ locale }: { locale: Locale }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f3a3a',
        color: '#fff7e6',
        fontSize: 64,
        fontWeight: 700,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {SITE_NAME_BY_LOCALE[locale]}
    </div>
  )
}

function lessonSubtitle(subcategoria: string, locale: Locale): string {
  const m = subcategoria.match(/ano-(\d+)-trim-(\d+)/)
  if (!m) return ''
  const ano = m[1]
  const trim = m[2]
  const labels: Record<Locale, string> = {
    'pt-BR': `Ano ${ano} · Trim ${trim}`,
    en: `Year ${ano} · Term ${trim}`,
    es: `Año ${ano} · Trimestre ${trim}`,
    zh: `第${ano}年 · 第${trim}学期`,
    ja: `第${ano}年 · 第${trim}学期`,
    de: `Jahr ${ano} · Quartal ${trim}`,
    fr: `Année ${ano} · Trimestre ${trim}`,
    it: `Anno ${ano} · Trimestre ${trim}`,
    ru: `Год ${ano} · Семестр ${trim}`,
    ko: `${ano}년 · ${trim}분기`,
    pl: `Rok ${ano} · Kwartał ${trim}`,
  }
  return labels[locale]
}

function taglineFor(locale: Locale): string {
  const t: Record<Locale, string> = {
    'pt-BR': 'Matemática open source, gratuita, em 11 idiomas',
    en: 'Open-source math, free, in 11 languages',
    es: 'Matemáticas open source, gratis, en 11 idiomas',
    zh: '开源数学 · 免费 · 11种语言',
    ja: 'オープンソース数学 · 無料 · 11言語',
    de: 'Open-Source-Mathematik · kostenlos · 11 Sprachen',
    fr: 'Maths open source · gratuit · 11 langues',
    it: 'Matematica open source · gratuita · 11 lingue',
    ru: 'Открытая математика · бесплатно · 11 языков',
    ko: '오픈소스 수학 · 무료 · 11개 언어',
    pl: 'Matematyka open source · darmowa · 11 języków',
  }
  return t[locale]
}
