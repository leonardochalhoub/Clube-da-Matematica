/**
 * Dicionário de UI strings — i18n COMPLETO sem dependências externas.
 *
 * 17 idiomas, traduções escritas pelo Claude Opus 4.7 diretamente.
 * Quando usuário troca pra alemão, todo site visível vira alemão imediatamente
 * (zero requisição de rede, zero API key).
 *
 * Para CONTEÚDO MDX (lições) usar src/content/translations/<locale>/.
 */

import type { Locale } from './locales'

type Translations = Partial<Record<Locale, string>>

export const TRANSLATIONS: Record<string, Translations> = {
  // ===== AUDIO =====
  'audio.read': {
    'pt-BR': 'Ouvir', en: 'Listen', es: 'Escuchar', zh: '听', ja: '聞く',
    de: 'Anhören', fr: 'Écouter', it: 'Ascolta', ru: 'Слушать', ko: '듣기', pl: 'Słuchaj', ar: 'استمع', hi: 'सुनें',
  },
  'audio.stop': {
    'pt-BR': 'Parar', en: 'Stop', es: 'Detener', zh: '停', ja: '停止',
    de: 'Stopp', fr: 'Arrêter', it: 'Ferma', ru: 'Стоп', ko: '정지', pl: 'Stop', ar: 'إيقاف', hi: 'रोकें',
  },
  'audio.translating': {
    'pt-BR': 'Traduzindo…', en: 'Translating…', es: 'Traduciendo…', zh: '翻译中…',
    ja: '翻訳中…', de: 'Übersetze…', fr: 'Traduction…', it: 'Traduzione…',
    ru: 'Перевожу…', ko: '번역 중…', pl: 'Tłumaczę…', ar: 'يترجم…', hi: 'अनुवाद हो रहा है…',
  },
  'audio.pendingTranslation': {
    'pt-BR': 'tradução pendente — falando em PT-BR',
    en: 'translation pending — speaking in Portuguese',
    es: 'traducción pendiente — hablando en portugués',
    zh: '翻译未完成 — 用葡萄牙语播放',
    ja: '翻訳待ち — ポルトガル語で読み上げ',
    de: 'Übersetzung ausstehend — spreche auf Portugiesisch',
    fr: 'traduction en attente — lu en portugais',
    it: 'traduzione in corso — letto in portoghese',
    ru: 'перевод в процессе — читаю на португальском',
    ko: '번역 대기 중 — 포르투갈어로 읽음',
    pl: 'oczekuje na tłumaczenie — czytam po portugalsku',
    ar: 'الترجمة قيد الانتظار — يُقرأ بالبرتغالية',
    hi: 'अनुवाद लंबित — पुर्तगाली में पढ़ा जा रहा है',
  },

  // ===== NAVIGATION =====
  'nav.middleSchool': {
    'pt-BR': 'Ensino Médio', en: 'High School', es: 'Bachillerato', zh: '高中',
    ja: '高校', de: 'Gymnasium', fr: 'Lycée', it: 'Scuola superiore',
    ru: 'Старшая школа', ko: '고등학교', pl: 'Liceum', ar: 'الثانوية', hi: 'हाई स्कूल',
  },
  'nav.finance': {
    'pt-BR': 'Finanças', en: 'Finance', es: 'Finanzas', zh: '金融', ja: '金融',
    de: 'Finanzen', fr: 'Finance', it: 'Finanza', ru: 'Финансы', ko: '금융', pl: 'Finanse', ar: 'مالية', hi: 'वित्त',
  },
  'nav.books': {
    'pt-BR': 'Livros', en: 'Books', es: 'Libros', zh: '书籍', ja: '書籍',
    de: 'Bücher', fr: 'Livres', it: 'Libri', ru: 'Книги', ko: '도서', pl: 'Książki', ar: 'كتب', hi: 'पुस्तकें',
  },
  'nav.videos': {
    'pt-BR': 'Vídeos', en: 'Videos', es: 'Videos', zh: '视频', ja: '動画',
    de: 'Videos', fr: 'Vidéos', it: 'Video', ru: 'Видео', ko: '비디오', pl: 'Filmy', ar: 'فيديوهات', hi: 'वीडियो',
  },
  'nav.exams': {
    'pt-BR': 'Provas', en: 'Exams', es: 'Exámenes', zh: '考试', ja: '試験',
    de: 'Prüfungen', fr: 'Examens', it: 'Esami', ru: 'Экзамены', ko: '시험', pl: 'Egzaminy', ar: 'امتحانات', hi: 'परीक्षा',
  },
  'nav.manifesto': {
    'pt-BR': 'Manifesto', en: 'Manifesto', es: 'Manifiesto', zh: '宣言', ja: 'マニフェスト',
    de: 'Manifest', fr: 'Manifeste', it: 'Manifesto', ru: 'Манифест', ko: '선언문', pl: 'Manifest', ar: 'بيان', hi: 'घोषणापत्र',
  },

  // ===== LOCALE =====
  'locale.label': {
    'pt-BR': 'Idioma', en: 'Language', es: 'Idioma', zh: '语言', ja: '言語',
    de: 'Sprache', fr: 'Langue', it: 'Lingua', ru: 'Язык', ko: '언어', pl: 'Język', ar: 'اللغة', hi: 'भाषा',
  },

  // ===== HOME HERO =====
  'home.tagline': {
    'pt-BR': 'Open source · gratuito · em português',
    en: 'Open source · free · multilingual',
    es: 'Código abierto · gratuito · multilingüe',
    zh: '开源 · 免费 · 多语言',
    ja: 'オープンソース · 無料 · 多言語',
    de: 'Open Source · kostenlos · mehrsprachig',
    fr: 'Open source · gratuit · multilingue',
    it: 'Open source · gratuito · multilingue',
    ru: 'Открытый код · бесплатно · многоязычный',
    ko: '오픈소스 · 무료 · 다국어',
    pl: 'Open source · darmowy · wielojęzyczny',
    ar: 'مفتوح المصدر · مجاني · متعدد اللغات',
    hi: 'ओपन सोर्स · मुफ्त · बहुभाषी',
  },
  'home.title.line1': {
    'pt-BR': 'Ensino Médio brasileiro',
    en: 'Brazilian High School',
    es: 'Bachillerato brasileño',
    zh: '巴西高中数学',
    ja: 'ブラジルの高校数学',
    de: 'Brasilianisches Gymnasium',
    fr: 'Lycée brésilien',
    it: 'Scuola superiore brasiliana',
    ru: 'Бразильская старшая школа',
    ko: '브라질 고등학교',
    pl: 'Brazylijskie liceum',
    ar: 'الثانوية البرازيلية',
    hi: 'ब्राज़ीलियन हाई स्कूल',
  },
  'home.title.line2': {
    'pt-BR': 'otimizado.',
    en: 'optimized.',
    es: 'optimizado.',
    zh: '优化版。',
    ja: '最適化。',
    de: 'optimiert.',
    fr: 'optimisé.',
    it: 'ottimizzato.',
    ru: 'оптимизирована.',
    ko: '최적화.',
    pl: 'zoptymalizowane.',
    ar: 'الأمثل.',
    hi: 'अनुकूलित।',
  },
  'home.cta.start': {
    'pt-BR': 'Começar pelo Ensino Médio',
    en: 'Start with High School',
    es: 'Comenzar con Bachillerato',
    zh: '从高中开始',
    ja: '高校から始める',
    de: 'Mit Gymnasium beginnen',
    fr: 'Commencer par le Lycée',
    it: 'Inizia dalle superiori',
    ru: 'Начать со старшей школы',
    ko: '고등학교부터 시작',
    pl: 'Zacznij od liceum',
    ar: 'ابدأ بالثانوية',
    hi: 'हाई स्कूल से शुरू करें',
  },
  'home.cta.bs': {
    'pt-BR': 'Ver Black-Scholes (Finanças)',
    en: 'See Black-Scholes (Finance)',
    es: 'Ver Black-Scholes (Finanzas)',
    zh: '查看 Black-Scholes（金融）',
    ja: 'ブラック-ショールズ（金融）',
    de: 'Black-Scholes ansehen (Finanzen)',
    fr: 'Voir Black-Scholes (Finance)',
    it: 'Vedi Black-Scholes (Finanza)',
    ru: 'Посмотреть Блэк-Шоулз (Финансы)',
    ko: 'Black-Scholes 보기 (금융)',
    pl: 'Zobacz Black-Scholes (Finanse)',
    ar: 'انظر بلاك-شولز (مالية)',
    hi: 'Black-Scholes देखें (वित्त)',
  },
  'home.cta.pdf': {
    'pt-BR': 'Ler o working paper (PDF)',
    en: 'Read the working paper (PDF)',
    es: 'Leer el working paper (PDF)',
    zh: '阅读工作论文 (PDF)',
    ja: 'ワーキングペーパーを読む (PDF)',
    de: 'Working Paper lesen (PDF)',
    fr: 'Lire le working paper (PDF)',
    it: 'Leggi il working paper (PDF)',
    ru: 'Читать рабочий документ (PDF)',
    ko: '워킹 페이퍼 읽기 (PDF)',
    pl: 'Przeczytaj working paper (PDF)',
    ar: 'اقرأ ورقة العمل (PDF)',
    hi: 'वर्किंग पेपर पढ़ें (PDF)',
  },

  // ===== COUNTERS (main page stats) =====
  'counters.eyebrow': {
    'pt-BR': '◆ Em números ◆',
    en: '◆ By the numbers ◆',
    es: '◆ En números ◆',
    zh: '◆ 数据一览 ◆',
    ja: '◆ 数字で見る ◆',
    de: '◆ In Zahlen ◆',
    fr: '◆ En chiffres ◆',
    it: '◆ In numeri ◆',
    ru: '◆ В цифрах ◆',
    ko: '◆ 숫자로 보기 ◆',
    pl: '◆ W liczbach ◆',
    ar: '◆ بالأرقام ◆',
    hi: '◆ संख्याओं में ◆',
  },
  'counters.title': {
    'pt-BR': 'O que tem aqui dentro',
    en: 'What you\'ll find inside',
    es: 'Qué hay dentro',
    zh: '里面有什么',
    ja: '中身',
    de: 'Was du hier findest',
    fr: 'Ce qu\'il y a à l\'intérieur',
    it: 'Cosa c\'è dentro',
    ru: 'Что внутри',
    ko: '내부에 무엇이 있는지',
    pl: 'Co znajdziesz w środku',
    ar: 'ما هو بالداخل',
    hi: 'अंदर क्या है',
  },
  'counters.subtitle': {
    'pt-BR': 'Métricas reais da plataforma — atualizadas em tempo real',
    en: 'Real platform metrics — updated in real time',
    es: 'Métricas reales — actualizadas en tiempo real',
    zh: '平台真实数据 — 实时更新',
    ja: '実データ — リアルタイム更新',
    de: 'Echte Plattform-Metriken — Echtzeit',
    fr: 'Métriques en temps réel',
    it: 'Metriche reali — aggiornate in tempo reale',
    ru: 'Реальные метрики — в реальном времени',
    ko: '실시간 플랫폼 지표',
    pl: 'Rzeczywiste metryki — w czasie rzeczywistym',
    ar: 'مقاييس حقيقية — محدثة في الوقت الفعلي',
    hi: 'वास्तविक मेट्रिक्स — रीयल-टाइम अपडेट',
  },
  'counters.visits': {
    'pt-BR': 'visitas', en: 'visits', es: 'visitas', zh: '访问', ja: '訪問',
    de: 'Besuche', fr: 'visites', it: 'visite', ru: 'посещений', ko: '방문', pl: 'odwiedzin', ar: 'زيارات', hi: 'विज़िट',
  },
  'counters.lessons.published': {
    'pt-BR': 'lições publicadas', en: 'lessons published', es: 'lecciones publicadas',
    zh: '已发布课程', ja: '公開済みレッスン', de: 'veröffentlichte Lektionen',
    fr: 'leçons publiées', it: 'lezioni pubblicate', ru: 'опубликованных уроков',
    ko: '게시된 수업', pl: 'opublikowane lekcje', ar: 'دروس منشورة', hi: 'प्रकाशित पाठ',
  },
  'counters.exercises': {
    'pt-BR': 'exercícios', en: 'exercises', es: 'ejercicios', zh: '练习', ja: '演習',
    de: 'Übungen', fr: 'exercices', it: 'esercizi', ru: 'упражнений', ko: '연습', pl: 'ćwiczeń', ar: 'تمارين', hi: 'अभ्यास',
  },
  'counters.exam.versions': {
    'pt-BR': 'versões de prova', en: 'exam versions', es: 'versiones de examen',
    zh: '考试版本', ja: '試験バージョン', de: 'Prüfungsversionen',
    fr: 'versions d\'examen', it: 'versioni d\'esame', ru: 'версий экзамена',
    ko: '시험 버전', pl: 'wersji egzaminu', ar: 'إصدارات الامتحان', hi: 'परीक्षा संस्करण',
  },
  'counters.study.total': {
    'pt-BR': 'estudo total', en: 'total study', es: 'estudio total',
    zh: '总学习', ja: '総学習', de: 'Gesamt-Lernzeit',
    fr: 'étude totale', it: 'studio totale', ru: 'всего обучения',
    ko: '총 학습', pl: 'łączna nauka', ar: 'إجمالي الدراسة', hi: 'कुल अध्ययन',
  },
  'counters.books.ledger': {
    'pt-BR': 'livros no ledger', en: 'books in ledger', es: 'libros en ledger',
    zh: '书籍目录', ja: '蔵書', de: 'Bücher im Verzeichnis',
    fr: 'livres au catalogue', it: 'libri nel catalogo', ru: 'книг в каталоге',
    ko: '도서 목록', pl: 'książek w katalogu', ar: 'كتب في السجل', hi: 'सूची में पुस्तकें',
  },

  // ===== SEARCH DISCOVERY =====
  'search.eyebrow': {
    'pt-BR': 'Descobrir', en: 'Discover', es: 'Descubrir', zh: '探索', ja: '探す',
    de: 'Entdecken', fr: 'Découvrir', it: 'Scopri', ru: 'Найти', ko: '찾아보기', pl: 'Odkryj', ar: 'اكتشف', hi: 'खोजें',
  },
  'search.title': {
    'pt-BR': 'O que você quer estudar hoje?',
    en: 'What do you want to study today?',
    es: '¿Qué quieres estudiar hoy?',
    zh: '今天你想学什么？',
    ja: '今日は何を勉強しますか？',
    de: 'Was möchtest du heute lernen?',
    fr: 'Que veux-tu étudier aujourd\'hui ?',
    it: 'Cosa vuoi studiare oggi?',
    ru: 'Что вы хотите изучать сегодня?',
    ko: '오늘 무엇을 공부하고 싶으세요?',
    pl: 'Czego chcesz się dziś nauczyć?',
    ar: 'ماذا تريد أن تدرس اليوم؟',
    hi: 'आज आप क्या पढ़ना चाहते हैं?',
  },
  'search.placeholder': {
    'pt-BR': 'Ex.: trigonometria, álgebra linear, integrais',
    en: 'Ex.: trigonometry, linear algebra, integrals',
    es: 'Ej.: trigonometría, álgebra lineal, integrales',
    zh: '例如：三角函数、线性代数、积分',
    ja: '例: 三角関数、線形代数、積分',
    de: 'Z.B.: Trigonometrie, lineare Algebra, Integrale',
    fr: 'Ex. : trigonométrie, algèbre linéaire, intégrales',
    it: 'Es.: trigonometria, algebra lineare, integrali',
    ru: 'Например: тригонометрия, линейная алгебра, интегралы',
    ko: '예: 삼각법, 선형 대수, 적분',
    pl: 'Np.: trygonometria, algebra liniowa, całki',
    ar: 'مثال: علم المثلثات، الجبر الخطي، التكاملات',
    hi: 'उदा.: त्रिकोणमिति, रेखीय बीजगणित, समाकलन',
  },
  'search.empty.invite': {
    'pt-BR': 'Comece pela busca. Lições e livros aparecem quando você digita.',
    en: 'Start with the search. Lessons and books appear as you type.',
    es: 'Comienza con la búsqueda. Lecciones y libros aparecen al escribir.',
    zh: '从搜索开始。输入时会出现课程和书籍。',
    ja: '検索から始めましょう。入力するとレッスンと本が表示されます。',
    de: 'Beginne mit der Suche. Lektionen und Bücher erscheinen beim Tippen.',
    fr: 'Commencez par la recherche. Leçons et livres apparaissent en tapant.',
    it: 'Inizia con la ricerca. Lezioni e libri appaiono mentre digiti.',
    ru: 'Начните с поиска. Уроки и книги появятся при вводе.',
    ko: '검색으로 시작하세요. 입력하면 수업과 도서가 나타납니다.',
    pl: 'Zacznij od wyszukiwania. Lekcje i książki pojawią się podczas pisania.',
    ar: 'ابدأ بالبحث. تظهر الدروس والكتب أثناء الكتابة.',
    hi: 'खोज से शुरू करें। टाइप करने पर पाठ और पुस्तकें दिखाई देंगी।',
  },
  'search.lessons.label': {
    'pt-BR': 'Lições', en: 'Lessons', es: 'Lecciones', zh: '课程', ja: 'レッスン',
    de: 'Lektionen', fr: 'Leçons', it: 'Lezioni', ru: 'Уроки', ko: '수업', pl: 'Lekcje', ar: 'دروس', hi: 'पाठ',
  },
  'search.books.label': {
    'pt-BR': 'Livros', en: 'Books', es: 'Libros', zh: '书籍', ja: '書籍',
    de: 'Bücher', fr: 'Livres', it: 'Libri', ru: 'Книги', ko: '도서', pl: 'Książki', ar: 'كتب', hi: 'पुस्तकें',
  },
  'search.no.results': {
    'pt-BR': 'Nenhum resultado para',
    en: 'No results for',
    es: 'Sin resultados para',
    zh: '没有结果',
    ja: '結果なし:',
    de: 'Keine Ergebnisse für',
    fr: 'Aucun résultat pour',
    it: 'Nessun risultato per',
    ru: 'Нет результатов для',
    ko: '검색 결과 없음:',
    pl: 'Brak wyników dla',
    ar: 'لا توجد نتائج لـ',
    hi: 'के लिए कोई परिणाम नहीं',
  },

  // ===== FOOTER =====
  'footer.tagline': {
    'pt-BR': 'Aprenda matemática de verdade. Open source, gratuito, em português — sempre.',
    en: 'Learn real mathematics. Open source, free, multilingual — always.',
    es: 'Aprende matemáticas de verdad. Código abierto, gratis, multilingüe — siempre.',
    zh: '学习真正的数学。开源、免费、多语言 — 永远。',
    ja: '本物の数学を学ぼう。オープンソース、無料、多言語 — 永遠に。',
    de: 'Lerne echte Mathematik. Open Source, kostenlos, mehrsprachig — immer.',
    fr: 'Apprenez les vraies maths. Open source, gratuit, multilingue — toujours.',
    it: 'Impara la vera matematica. Open source, gratuito, multilingue — sempre.',
    ru: 'Изучайте настоящую математику. Открытый код, бесплатно, многоязычный — всегда.',
    ko: '진짜 수학을 배우세요. 오픈소스, 무료, 다국어 — 항상.',
    pl: 'Naucz się prawdziwej matematyki. Open source, darmowe, wielojęzyczne — zawsze.',
    ar: 'تعلم الرياضيات الحقيقية. مفتوح المصدر، مجاني، متعدد اللغات — دائماً.',
    hi: 'असली गणित सीखें। ओपन सोर्स, मुफ्त, बहुभाषी — हमेशा।',
  },
  'footer.authorship': {
    'pt-BR': 'Autoria', en: 'Authors', es: 'Autoría', zh: '作者', ja: '著者',
    de: 'Autoren', fr: 'Auteurs', it: 'Autori', ru: 'Авторы', ko: '저자', pl: 'Autorzy', ar: 'المؤلفون', hi: 'लेखक',
  },
  'footer.navigation': {
    'pt-BR': 'Navegação', en: 'Navigation', es: 'Navegación', zh: '导航', ja: 'ナビゲーション',
    de: 'Navigation', fr: 'Navigation', it: 'Navigazione', ru: 'Навигация', ko: '탐색', pl: 'Nawigacja', ar: 'تصفح', hi: 'नेविगेशन',
  },
  'footer.allContent': {
    'pt-BR': 'Todos os conteúdos', en: 'All content', es: 'Todos los contenidos',
    zh: '全部内容', ja: 'すべてのコンテンツ', de: 'Alle Inhalte',
    fr: 'Tous les contenus', it: 'Tutti i contenuti', ru: 'Весь контент',
    ko: '모든 콘텐츠', pl: 'Cała treść', ar: 'كل المحتوى', hi: 'सभी सामग्री',
  },
  'footer.openSource': {
    'pt-BR': 'Open source', en: 'Open source', es: 'Código abierto', zh: '开源', ja: 'オープンソース',
    de: 'Open Source', fr: 'Open source', it: 'Open source', ru: 'Открытый код', ko: '오픈소스', pl: 'Open source', ar: 'مفتوح المصدر', hi: 'ओपन सोर्स',
  },
  'footer.repo': {
    'pt-BR': 'Repositório no GitHub', en: 'GitHub repository', es: 'Repositorio en GitHub',
    zh: 'GitHub 代码库', ja: 'GitHub リポジトリ', de: 'GitHub-Repository',
    fr: 'Dépôt GitHub', it: 'Repository GitHub', ru: 'Репозиторий GitHub',
    ko: 'GitHub 저장소', pl: 'Repozytorium GitHub', ar: 'مستودع GitHub', hi: 'GitHub रिपॉजिटरी',
  },
  'footer.license': {
    'pt-BR': 'Licença MIT', en: 'MIT License', es: 'Licencia MIT', zh: 'MIT 许可证',
    ja: 'MIT ライセンス', de: 'MIT-Lizenz', fr: 'Licence MIT', it: 'Licenza MIT',
    ru: 'Лицензия MIT', ko: 'MIT 라이선스', pl: 'Licencja MIT', ar: 'رخصة MIT', hi: 'MIT लाइसेंस',
  },
  'footer.sponsor.label': {
    'pt-BR': 'a Amazing School, plataforma grátis de inglês, apoia o Clube da Matemática',
    en: 'Amazing School, free English platform, supports Clube da Matemática',
    es: 'Amazing School, plataforma gratuita de inglés, apoya el Clube da Matemática',
    zh: 'Amazing School，免费英语平台，支持 Clube da Matemática',
    ja: 'Amazing School、無料英語学習プラットフォーム、Clube da Matemáticaを支援',
    de: 'Amazing School, kostenlose Englisch-Plattform, unterstützt Clube da Matemática',
    fr: 'Amazing School, plateforme gratuite d\'anglais, soutient Clube da Matemática',
    it: 'Amazing School, piattaforma gratuita di inglese, supporta Clube da Matemática',
    ru: 'Amazing School, бесплатная платформа английского, поддерживает Clube da Matemática',
    ko: 'Amazing School, 무료 영어 플랫폼, Clube da Matemática 지원',
    pl: 'Amazing School, darmowa platforma angielskiego, wspiera Clube da Matemática',
    ar: 'Amazing School، منصة إنجليزية مجانية، تدعم Clube da Matemática',
    hi: 'Amazing School, मुफ्त अंग्रेजी प्लेटफॉर्म, Clube da Matemática का समर्थन करता है',
  },
  'footer.builtWith': {
    'pt-BR': 'construído com', en: 'built with', es: 'construido con',
    zh: '构建用', ja: '構築:', de: 'gebaut mit', fr: 'construit avec',
    it: 'costruito con', ru: 'построено с', ko: '제작:',
    pl: 'zbudowane z', ar: 'تم بناؤه باستخدام', hi: 'से बनाया गया',
  },
  'footer.khan': {
    'pt-BR': 'Não competimos com Khan — Khan ensina conta. Competimos com o silêncio entre saber a fórmula e entender o que ela diz sobre o mundo.',
    en: 'We don\'t compete with Khan — Khan teaches calculation. We compete with the silence between knowing the formula and understanding what it says about the world.',
    es: 'No competimos con Khan — Khan enseña cálculo. Competimos con el silencio entre saber la fórmula y entender lo que dice del mundo.',
    zh: '我们不与 Khan 竞争 — Khan 教计算。我们对抗的是：知道公式与理解它对世界的意义之间的沉默。',
    ja: '我々はKhanとは競争しない — Khanは計算を教える。我々は公式を知ることと、それが世界について語ることを理解することの間の沈黙と戦っている。',
    de: 'Wir konkurrieren nicht mit Khan — Khan lehrt Rechnen. Wir kämpfen gegen die Stille zwischen Formelkenntnis und Weltverständnis.',
    fr: 'Nous ne concurrençons pas Khan — Khan enseigne le calcul. Nous luttons contre le silence entre connaître la formule et comprendre ce qu\'elle dit du monde.',
    it: 'Non competiamo con Khan — Khan insegna il calcolo. Combattiamo il silenzio tra conoscere la formula e capire cosa dice del mondo.',
    ru: 'Мы не конкурируем с Khan — Khan учит вычислять. Мы противостоим тишине между знанием формулы и пониманием, что она говорит о мире.',
    ko: 'Khan과 경쟁하지 않습니다 — Khan은 계산을 가르칩니다. 우리는 공식을 아는 것과 그것이 세상에 대해 말하는 것을 이해하는 것 사이의 침묵과 경쟁합니다.',
    pl: 'Nie konkurujemy z Khan — Khan uczy obliczeń. Walczymy z ciszą między znajomością wzoru a zrozumieniem, co mówi o świecie.',
    ar: 'نحن لا ننافس Khan — Khan يعلم الحساب. نحن نواجه الصمت بين معرفة المعادلة وفهم ما تقوله عن العالم.',
    hi: 'हम Khan से प्रतिस्पर्धा नहीं करते — Khan गणना सिखाता है। हम सूत्र जानने और वह दुनिया के बारे में क्या कहता है, इसके बीच के सन्नाटे से लड़ते हैं।',
  },

  // ===== COMMON =====
  'common.search': {
    'pt-BR': 'Buscar', en: 'Search', es: 'Buscar', zh: '搜索', ja: '検索',
    de: 'Suchen', fr: 'Rechercher', it: 'Cerca', ru: 'Поиск', ko: '검색', pl: 'Szukaj', ar: 'بحث', hi: 'खोजें',
  },
  'common.skipToContent': {
    'pt-BR': 'Pular para o conteúdo principal',
    en: 'Skip to main content',
    es: 'Saltar al contenido principal',
    zh: '跳到主要内容',
    ja: 'メインコンテンツへスキップ',
    de: 'Zum Hauptinhalt springen',
    fr: 'Aller au contenu principal',
    it: 'Vai al contenuto principale',
    ru: 'Перейти к основному содержимому',
    ko: '본문으로 건너뛰기',
    pl: 'Przejdź do treści głównej',
    ar: 'تخطي إلى المحتوى الرئيسي',
    hi: 'मुख्य सामग्री पर जाएं',
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
