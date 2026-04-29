/**
 * Dicionário de UI strings.
 *
 * Estratégia: chaves em estilo `categoria.chave`. Valores como objetos
 * `{ locale: tradução }`. Fallback automático para inglês se não há tradução
 * pra um idioma. Para idiomas sem tradução, mostra a chave em inglês.
 *
 * Adicionar novos idiomas: adicione a chave do locale + tradução nos
 * dicionários abaixo. Não obrigatório — ausência cai em inglês.
 */

import type { Locale } from './locales'

type Translations = Partial<Record<Locale, string>>

/** Dicionário principal — adicione strings aqui à medida que i18nizamos a UI. */
export const TRANSLATIONS: Record<string, Translations> = {
  // Audio
  'audio.read': {
    'pt-BR': 'Ouvir',
    en: 'Listen',
    es: 'Escuchar',
    zh: '听',
    ja: '聞く',
    de: 'Anhören',
    fr: 'Écouter',
    it: 'Ascolta',
    ru: 'Слушать',
    ko: '듣기',
    vi: 'Nghe',
    pl: 'Słuchaj',
    sw: 'Sikia',
    ar: 'استمع',
    hi: 'सुनें',
    et: 'Kuula',
  },
  'audio.stop': {
    'pt-BR': 'Parar',
    en: 'Stop',
    es: 'Detener',
    zh: '停',
    ja: '停止',
    de: 'Stopp',
    fr: 'Arrêter',
    it: 'Ferma',
    ru: 'Стоп',
    ko: '정지',
    vi: 'Dừng',
    pl: 'Stop',
    sw: 'Simama',
    ar: 'إيقاف',
    hi: 'रोकें',
    et: 'Peata',
  },

  // Header / nav
  'nav.middleSchool': {
    'pt-BR': 'Ensino Médio',
    en: 'High School',
    es: 'Bachillerato',
    zh: '高中',
    ja: '高校',
    de: 'Gymnasium',
    fr: 'Lycée',
    it: 'Scuola superiore',
    ru: 'Старшая школа',
    ko: '고등학교',
    vi: 'Trung học',
    pl: 'Liceum',
    sw: 'Sekondari',
    ar: 'الثانوية',
    hi: 'हाई स्कूल',
    et: 'Keskkool',
  },
  'nav.finance': {
    'pt-BR': 'Finanças',
    en: 'Finance',
    es: 'Finanzas',
    zh: '金融',
    ja: '金融',
    de: 'Finanzen',
    fr: 'Finance',
    it: 'Finanza',
    ru: 'Финансы',
    ko: '금융',
    vi: 'Tài chính',
    pl: 'Finanse',
    sw: 'Fedha',
    ar: 'مالية',
    hi: 'वित्त',
    et: 'Rahandus',
  },
  'nav.books': {
    'pt-BR': 'Livros',
    en: 'Books',
    es: 'Libros',
    zh: '书籍',
    ja: '書籍',
    de: 'Bücher',
    fr: 'Livres',
    it: 'Libri',
    ru: 'Книги',
    ko: '도서',
    vi: 'Sách',
    pl: 'Książki',
    sw: 'Vitabu',
    ar: 'كتب',
    hi: 'पुस्तकें',
    et: 'Raamatud',
  },
  'nav.videos': {
    'pt-BR': 'Vídeos',
    en: 'Videos',
    es: 'Videos',
    zh: '视频',
    ja: '動画',
    de: 'Videos',
    fr: 'Vidéos',
    it: 'Video',
    ru: 'Видео',
    ko: '비디오',
    vi: 'Video',
    pl: 'Filmy',
    sw: 'Video',
    ar: 'فيديوهات',
    hi: 'वीडियो',
    et: 'Videod',
  },
  'nav.exams': {
    'pt-BR': 'Provas',
    en: 'Exams',
    es: 'Exámenes',
    zh: '考试',
    ja: '試験',
    de: 'Prüfungen',
    fr: 'Examens',
    it: 'Esami',
    ru: 'Экзамены',
    ko: '시험',
    vi: 'Kỳ thi',
    pl: 'Egzaminy',
    sw: 'Mitihani',
    ar: 'امتحانات',
    hi: 'परीक्षा',
    et: 'Eksamid',
  },
  'nav.manifesto': {
    'pt-BR': 'Manifesto',
    en: 'Manifesto',
    es: 'Manifiesto',
    zh: '宣言',
    ja: 'マニフェスト',
    de: 'Manifest',
    fr: 'Manifeste',
    it: 'Manifesto',
    ru: 'Манифест',
    ko: '선언문',
    vi: 'Tuyên ngôn',
    pl: 'Manifest',
    sw: 'Tamko',
    ar: 'بيان',
    hi: 'घोषणापत्र',
    et: 'Manifest',
  },

  // Locale switcher
  'locale.label': {
    'pt-BR': 'Idioma',
    en: 'Language',
    es: 'Idioma',
    zh: '语言',
    ja: '言語',
    de: 'Sprache',
    fr: 'Langue',
    it: 'Lingua',
    ru: 'Язык',
    ko: '언어',
    vi: 'Ngôn ngữ',
    pl: 'Język',
    sw: 'Lugha',
    ar: 'اللغة',
    hi: 'भाषा',
    et: 'Keel',
  },

  // Common buttons / actions
  'common.search': {
    'pt-BR': 'Buscar',
    en: 'Search',
    es: 'Buscar',
    zh: '搜索',
    ja: '検索',
    de: 'Suchen',
    fr: 'Rechercher',
    it: 'Cerca',
    ru: 'Поиск',
    ko: '검색',
    vi: 'Tìm kiếm',
    pl: 'Szukaj',
    sw: 'Tafuta',
    ar: 'بحث',
    hi: 'खोजें',
    et: 'Otsi',
  },
}

/**
 * Helper: traduz uma chave para o locale dado, com fallback inteligente:
 *  1. Tenta o locale exato
 *  2. Cai pro inglês
 *  3. Cai pra `defaultText` (passada pelo chamador) ou a própria chave
 */
export function translate(
  key: string,
  locale: Locale,
  defaultText?: string,
): string {
  const entry = TRANSLATIONS[key]
  if (!entry) return defaultText ?? key
  return entry[locale] ?? entry.en ?? defaultText ?? key
}
