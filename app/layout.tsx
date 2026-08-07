import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LocaleProvider } from '@/components/layout/LocaleProvider'
import { VisitorTracker } from '@/components/layout/VisitorTracker'
import { PageAudioReader } from '@/components/math/PageAudioReader'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

import { SITE_ORIGIN, BASE_PATH } from '@/lib/seo/site'

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_ORIGIN}${BASE_PATH || ''}`),
  title: {
    default: 'Clube da Matemática — Aprenda matemática de verdade',
    template: '%s · Clube da Matemática',
  },
  description:
    'Curso completo de matemática para o Ensino Médio brasileiro — 120 lições, 3 anos, 4.770 exercícios sourceados. Open source e gratuito. Do conjunto de números a Black-Scholes.',
  keywords: [
    'matemática', 'matemáticas', 'mathematics', 'maths',
    'cálculo', 'cálculo numérico', 'calculus',
    'derivadas', 'derivatives', 'integrals', 'integrais',
    'limites', 'limits', 'limites',
    'álgebra linear', 'linear algebra',
    'estatística', 'statistics', 'estadística',
    'black-scholes', 'opções', 'options',
    'ensino médio', 'high school', 'bachillerato',
    'open source', 'gratuito', 'free', 'oer',
    'método numérico', 'newton-raphson', 'bisseção',
  ],
  authors: [{ name: 'Clube da Matemática' }],
  creator: 'Clube da Matemática',
  publisher: 'Clube da Matemática',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Clube da Matemática',
    description:
      'Curso aberto e gratuito de matemática para o Ensino Médio — 120 lições, 4.770 exercícios sourceados.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Clube da Matemática',
    url: `${SITE_ORIGIN}${BASE_PATH || ''}/`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clube da Matemática',
    description: 'Curso aberto de matemática para o Ensino Médio — 120 lições.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/favicon.svg`,
        type: 'image/svg+xml',
      },
    ],
  },
}

/**
 * Script inline que define o tema ANTES do primeiro paint.
 * Evita flash de tema errado (FOUC):
 *  1) lê localStorage.theme — preferência manual do usuário (se existe).
 *  2) se ausente, default = 'dark'. Tema escuro é o estado padrão da
 *     plataforma; usuário pode alternar para claro via ThemeToggle e a
 *     escolha é persistida em localStorage.
 *  3) aplica `dark` na <html> antes do React hidratar.
 */
const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('theme') || 'dark';
    if (t === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch (_) {
    document.documentElement.classList.add('dark');
  }
})();
`

/**
 * Inline script that runs BEFORE first paint to set <html lang>
 * from the URL path. SSG ships every page with lang="pt-BR" because the
 * root layout's <html> is shared across all routes — this script reads
 * the path prefix (/en/, /es/, etc.) and corrects the lang attribute
 * for accessibility tools and Google's secondary language signal.
 */
const langScript = `
(function() {
  try {
    var p = window.location.pathname;
    var base = ${JSON.stringify(process.env.NEXT_PUBLIC_BASE_PATH ?? '')};
    if (base && p.indexOf(base) === 0) p = p.slice(base.length);
    var m = p.match(/^\\/(pt-br|en|es|zh|ja|de|fr|it|ru|ko|pl)(?:\\/|$)/);
    var map = {
      'pt-br': 'pt-BR', en: 'en-US', es: 'es-ES', zh: 'zh-CN', ja: 'ja-JP',
      de: 'de-DE', fr: 'fr-FR', it: 'it-IT', ru: 'ru-RU', ko: 'ko-KR', pl: 'pl-PL'
    };
    if (m && map[m[1]]) {
      document.documentElement.lang = map[m[1]];
    }
  } catch (_) {}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/favicon.svg`}
        />
        <link
          rel="shortcut icon"
          type="image/svg+xml"
          href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/favicon.svg`}
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: langScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-clube-cream text-clube-ink antialiased">
        <LocaleProvider>
          <a href="#conteudo" className="skip-link">
            Pular para o conteúdo principal
          </a>
          <Header />
          <VisitorTracker />
          <main id="conteudo" tabIndex={-1} className="flex-1">
            <div className="container-clube max-w-prose-wide flex justify-center pt-4">
              <PageAudioReader compact />
            </div>
            {children}
          </main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  )
}
