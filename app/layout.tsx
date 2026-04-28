import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

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

export const metadata: Metadata = {
  title: {
    default: 'Clube da Matemática — Aprenda matemática de verdade',
    template: '%s · Clube da Matemática',
  },
  description:
    'Site de matemática open source e gratuito. Toda equação tem 6 portas: formal científica + explicações para 5, 10, 15, 25 e 40 anos. Aprenda matemática de verdade.',
  keywords: [
    'matemática',
    'cálculo',
    'cálculo numérico',
    'método numérico',
    'bisseção',
    'newton-raphson',
    'black-scholes',
    'opções',
    'finanças quantitativas',
    'open source',
    'pt-br',
  ],
  authors: [{ name: 'Clube da Matemática' }],
  openGraph: {
    title: 'Clube da Matemática',
    description: 'Aprenda matemática de verdade. Open source, gratuito, em português.',
    type: 'website',
    locale: 'pt_BR',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
}

/**
 * Script inline que define o tema ANTES do primeiro paint.
 * Evita flash de tema errado (FOUC):
 *  1) lê localStorage.theme
 *  2) se ausente, consulta prefers-color-scheme
 *  3) aplica `dark` na <html> antes do React hidratar
 */
const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('theme');
    if (!t) {
      t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (t === 'dark') document.documentElement.classList.add('dark');
  } catch (_) {}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-clube-cream text-clube-ink antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
