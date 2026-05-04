'use client'

import Link from 'next/link'
import { useLocale } from '@/components/layout/LocaleProvider'

/**
 * Renderiza HTML simples (com <strong>, <em>) traduzido vindo de translations.ts.
 * Não há entrada de usuário — todo conteúdo aqui é texto curado, escrito por nós.
 * `dangerouslySetInnerHTML` é seguro neste contexto.
 */
function HtmlP({ html, className }: { html: string; className?: string }) {
  return (
    <p className={className} dangerouslySetInnerHTML={{ __html: html }} />
  )
}

export default function ManifestoContent() {
  const { t } = useLocale()

  return (
    <article className="container-clube max-w-3xl py-16 sm:py-20">
      <header className="mb-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-clube-gold-deep">
          {t('manifesto.kicker')}
        </p>
        <h1 className="text-display font-extrabold leading-tight text-clube-teal-deep">
          {t('manifesto.title.line1')}
          <br />
          <span className="text-clube-teal">{t('manifesto.title.line2')}</span>
        </h1>
      </header>

      <div className="prose prose-clube prose-lg max-w-none">
        <HtmlP html={t('manifesto.p1')} />
        <HtmlP html={t('manifesto.p2')} />

        <h2 className="!mt-12">{t('manifesto.h2.firstGoal')}</h2>

        <HtmlP html={t('manifesto.p3')} />
        <HtmlP html={t('manifesto.p4')} />

        <h3 className="!mt-8 !mb-3">{t('manifesto.h3.officialDocs')}</h3>
        <HtmlP html={t('manifesto.p5')} />
        <ul>
          <li>
            <strong>{t('manifesto.docs.jp.label')}</strong>{' '}
            <a
              href="https://www.mext.go.jp/a_menu/shotou/new-cs/youryou/eiyaku/__icsFiles/afieldfile/2019/03/28/1407196_22_1_1_2.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('manifesto.docs.jp.title')}
            </a>{' '}
            {t('manifesto.docs.jp.desc')}
          </li>
          <li>
            <strong>{t('manifesto.docs.de.label')}</strong>{' '}
            <a
              href="https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/2012/2012_10_18-Bildungsstandards-Mathe-Abi.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('manifesto.docs.de.title')}
            </a>{' '}
            {t('manifesto.docs.de.desc')}
          </li>
          <li>
            <strong>{t('manifesto.docs.sg.label')}</strong>{' '}
            <a
              href="https://www.moe.gov.sg/-/media/files/secondary/syllabuses/maths/2020-express_na-maths_syllabuses.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('manifesto.docs.sg.title1')}
            </a>{' '}
            +{' '}
            <a
              href="https://www.moe.gov.sg/-/media/files/post-secondary/2025-pre-u-h2-math.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('manifesto.docs.sg.title2')}
            </a>{' '}
            {t('manifesto.docs.sg.desc')}
          </li>
          <li>
            <strong>{t('manifesto.docs.br.label')}</strong>{' '}
            <a
              href="http://basenacionalcomum.mec.gov.br/images/historico/BNCC_EnsinoMedio_embaixa_site_110518.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('manifesto.docs.br.title')}
            </a>{' '}
            {t('manifesto.docs.br.desc')}
          </li>
        </ul>
        <HtmlP html={t('manifesto.p6')} className="!mt-3" />

        <h2 className="!mt-12">{t('manifesto.h2.howItGrows')}</h2>

        <HtmlP html={t('manifesto.p7')} />

        <ol>
          <li>
            <strong>{t('manifesto.roadmap.now.label')}</strong> ·{' '}
            <Link href="/ensino-medio" className="text-clube-teal">
              {t('manifesto.roadmap.now.linkText')}
            </Link>{' '}
            <span dangerouslySetInnerHTML={{ __html: t('manifesto.roadmap.now.desc') }} />
          </li>
          <li>
            <strong>{t('manifesto.roadmap.next.label')}</strong> ·{' '}
            <em>{t('manifesto.roadmap.next.title')}</em>{' '}
            <span dangerouslySetInnerHTML={{ __html: t('manifesto.roadmap.next.desc') }} />
          </li>
          <li>
            <strong>{t('manifesto.roadmap.future.label')}</strong> ·{' '}
            <em>{t('manifesto.roadmap.future.title')}</em>{' '}
            <span dangerouslySetInnerHTML={{ __html: t('manifesto.roadmap.future.desc') }} />
          </li>
        </ol>

        <p>
          {t('manifesto.p8.before')}{' '}
          <Link href="/financas" className="text-clube-teal">
            {t('manifesto.p8.linkText')}
          </Link>
          <span dangerouslySetInnerHTML={{ __html: t('manifesto.p8.after') }} />
        </p>

        <h2 className="!mt-12">{t('manifesto.h2.howEachLesson')}</h2>

        <HtmlP html={t('manifesto.p9')} />
        <HtmlP html={t('manifesto.p10')} />
        <HtmlP html={t('manifesto.p11')} />
        <HtmlP html={t('manifesto.p12')} />
        <HtmlP html={t('manifesto.p13')} />

        <p className="!mb-2 text-2xl font-bold text-clube-teal-deep">
          {t('manifesto.closing.line1.before')}{' '}
          <span className="text-clube-clay">{t('manifesto.closing.line1.after')}</span>
        </p>
        <p className="!mt-2 text-2xl font-bold text-clube-teal">
          {t('manifesto.closing.line2')}
        </p>

        <hr className="!my-10" />

        <HtmlP html={t('manifesto.outro')} className="text-clube-mist" />
      </div>
    </article>
  )
}
