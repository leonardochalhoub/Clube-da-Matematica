import { ImageResponse } from 'next/og'
import { publicadosApenas } from '@/lib/content/loader'
import { type Locale } from '@/lib/i18n/locales'
import { SITE_NAME_BY_LOCALE } from '@/lib/seo/site'

export const alt = 'Clube da Matemática'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Params {
  categoria: string
}

export function generateStaticParams(): Params[] {
  const conteudos = publicadosApenas()
  const categorias = [
    ...new Set(conteudos.map(({ caminho }) => caminho.split('/')[0]!)),
  ]
  return categorias.map((categoria) => ({ categoria }))
}

const CATEGORY_LABELS: Record<string, string> = {
  aulas: 'Aulas',
  engenharia: 'Engenharia',
  'financas-quantitativas': 'Finanças Quantitativas',
  'metodos-numericos': 'Métodos Numéricos',
  'calculo-1': 'Cálculo 1',
}

export default async function Image({ params }: { params: Promise<Params> }) {
  const { categoria } = await params
  const locale: Locale = 'pt-BR'
  const siteName = SITE_NAME_BY_LOCALE[locale]
  const label = CATEGORY_LABELS[categoria] ?? categoria

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
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              fontSize: 32,
              color: '#e6c98a',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: 1040,
            }}
          >
            {siteName}
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
          <span>Matemática open source, gratuita, em 11 idiomas</span>
        </div>
      </div>
    ),
    size,
  )
}
