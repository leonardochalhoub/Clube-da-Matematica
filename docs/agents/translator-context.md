# Translator Context — for Gemini Free Agents

> **Audience.** A Gemini Flash agent (free tier) translating one MDX lesson from Brazilian Portuguese into a target locale. Read top-to-bottom before processing the file.

---

## 1. What you are translating

A single Markdown-with-JSX (`.mdx`) lesson file from `content/aulas/...`. The file has:

1. **YAML frontmatter** between `---` lines (titulo, descricao, tags, etc).
2. **An `<EquacaoCanonica>` JSX block** with `formula`, `legenda`, `audioTexto` props.
3. **A `<DuasPortas>` block** containing 7 `<Porta>` children at levels: `formal`, `5`, `10`, `15`, `25`, `40`, `pratica`.
4. **A `<ListaExercicios>` block** with 30–80 `<Exercicio numero="…" dificuldade="…">…</Exercicio>` items.
5. **A `## Fontes` (Sources) section** at the end.

You output the **same file** with prose translated into the target locale, structure and JSX preserved exactly.

---

## 2. Hard rules — DO NOT VIOLATE

### NEVER translate
- LaTeX math: anything inside `$...$`, `$$...$$`, or inside `<Eq>{`...`}</Eq>` template literals. Math notation is universal.
- JSX component names: `<DuasPortas>`, `<Porta>`, `<EquacaoCanonica>`, `<Equation>`, `<Eq>`, `<ListaExercicios>`, `<Exercicio>`, `<VerificarPasso>`, `<Definicao>`, `<Teorema>`, `<Exemplo>`, `<Insight>`, `<Cuidado>`, `<Leituras>`, `<PayoffChart>`, `<AudioReader>`.
- JSX prop names: `nivel`, `titulo`, `formula`, `legenda`, `audioTexto`, `numero`, `dificuldade`, `referencia`, `resposta`, `inline`, `ariaLabel`, `seed`.
- Frontmatter keys: `titulo`, `slug`, `categoria`, `subcategoria`, `descricao`, `ordem`, `publicado`, `tags`, `prerrequisitos`, `autores`, `atualizadoEm`, `usadoEm`.
- The values of: `slug`, `categoria`, `subcategoria`, `ordem`, `publicado`, `tags`, `prerrequisitos`, `atualizadoEm`. (Internal IDs — keep verbatim.)
- URLs (anything starting `http://` or `https://`).
- Code blocks: anything between triple backticks ``` ```python ``` … ``` ``` ```.
- Numbers, units of measurement, mathematical symbols.
- The `audioTexto` strings: write them in target locale, but never break LaTeX commands.

### ALWAYS translate
- Frontmatter `titulo` (e.g. `"Lição 03 — Função afim"` → `"Lesson 03 — Linear function"` for en-US).
- Frontmatter `descricao` (one-line summary).
- `legenda` prose (the readable sentences inside `<>...</>`).
- Body text inside `<Porta>`, including section headings (`### Foo` → translate `Foo`).
- Body text inside `<Exercicio>` (the question itself, but keep `numero` and `dificuldade` props verbatim).
- The "Sources" / `## Fontes` heading.
- Source list: keep author names, book titles in original (these are proper nouns), translate only descriptive notes ("**Primary source.**", "ed.", etc.).

---

## 3. Locale-specific glossary

The translator agent receives the target locale code. Use the right substitution.

| PT-BR phrase | en-US | es-ES | zh-CN | ja-JP | de-DE | fr-FR | it-IT | ru-RU | ko-KR | pl-PL |
|---|---|---|---|---|---|---|---|---|---|---|
| "Lição NN" | Lesson NN | Lección NN | 第NN课 | 第NN講 | Lektion NN | Leçon NN | Lezione NN | Урок NN | NN강 | Lekcja NN |
| "Trim N" | Term N | Trimestre N | 第N学期 | 第N学期 | Quartal N | Trimestre N | Trimestre N | Семестр N | N분기 | Kwartał N |
| "Ensino Médio" | High School | Bachillerato | 高中 | 高校 | Gymnasium | Lycée | Scuola superiore | Старшая школа | 고등학교 | Liceum |
| "Pra criança de 5 anos" | For a 5-year-old | Para un niño de 5 años | 给5岁的孩子 | 5歳の子供向け | Für ein 5-jähriges Kind | Pour un enfant de 5 ans | Per un bambino di 5 anni | Для 5-летнего ребёнка | 5세 어린이용 | Dla 5-latka |
| "Pra criança de 10 anos" | For a 10-year-old | Para un niño de 10 años | 给10岁的孩子 | 10歳の子供向け | Für ein 10-jähriges Kind | Pour un enfant de 10 ans | Per un bambino di 10 anni | Для 10-летнего | 10세 어린이용 | Dla 10-latka |
| "Pra adolescente de 15 anos" | For a 15-year-old teen | Para un adolescente de 15 años | 给15岁的青少年 | 15歳の中高生向け | Für einen 15-jährigen Teen | Pour un ado de 15 ans | Per un adolescente di 15 anni | Для 15-летнего | 15세 청소년용 | Dla 15-latka |
| "Pra estudante de engenharia" | For an engineering student | Para un estudiante de ingeniería | 给工程系学生 | 工学部の学生向け | Für einen Ingenieurstudenten | Pour un étudiant en ingénierie | Per uno studente di ingegneria | Для студента-инженера | 공학도용 | Dla studenta inżynierii |
| "Pra profissional sênior" | For a senior professional | Para un profesional sénior | 给资深专业人士 | シニアプロフェッショナル向け | Für einen erfahrenen Profi | Pour un professionnel senior | Per un professionista senior | Для опытного специалиста | 시니어 전문가용 | Dla zaawansowanego profesjonalisty |
| "Aplicação prática" | Practical application | Aplicación práctica | 实际应用 | 実践的応用 | Praktische Anwendung | Application pratique | Applicazione pratica | Практическое применение | 실제 응용 | Zastosowanie praktyczne |
| "ENEM" | National college-entrance exam | Selectividad | 高考 | 大学入試共通テスト | Abitur | Baccalauréat | Esame di Maturità | ЕГЭ | 수능 | Matura |
| "Aviso" | Caution | Aviso | 注意 | 注意 | Achtung | Attention | Attenzione | Внимание | 주의 | Uwaga |

If the target locale isn't in the table above, use the most natural equivalent.

### Math terminology
Use the natural mathematical vocabulary of the target language. Examples:

| EN | ES | DE | FR | IT | JA |
|---|---|---|---|---|---|
| derivative | derivada | Ableitung | dérivée | derivata | 導関数 |
| integral | integral | Integral | intégrale | integrale | 積分 |
| eigenvalue | autovalor | Eigenwert | valeur propre | autovalore | 固有値 |
| function | función | Funktion | fonction | funzione | 関数 |
| set | conjunto | Menge | ensemble | insieme | 集合 |
| interval | intervalo | Intervall | intervalle | intervallo | 区間 |
| limit | límite | Grenzwert | limite | limite | 極限 |

If the target language uses a comma as decimal separator (most non-English), keep `1{,}5` LaTeX inside `$...$` and write `1,5` in plain prose. Otherwise (English), prose says `1.5`.

---

## 4. Output format

You output the **complete file**, ready to be saved at `content/i18n/<speechLang>/<same-relative-path-as-source>`.

`<speechLang>` mapping:
- en → en-US
- es → es-ES
- zh → zh-CN
- ja → ja-JP
- de → de-DE
- fr → fr-FR
- it → it-IT
- ru → ru-RU
- ko → ko-KR
- pl → pl-PL

Do NOT add commentary. Do NOT add a Markdown code fence around the output. Just emit the file content directly.

---

## 5. Quality bar

- A native speaker reading the translated lesson should not feel "this was translated"; it should feel native.
- Math notation rendering must be **identical** to the source (don't re-format LaTeX).
- All `<Exercicio>` tags must remain with the same `numero` and `dificuldade` attributes.
- Frontmatter `slug` MUST match the source slug exactly (the page route depends on it).
- "Para una niño" (wrong, accent error) and "Pour une étudiant en ingénierie" (gender error) are bugs — proofread.

If you encounter a sentence you cannot translate confidently, leave the original PT-BR in place rather than guessing. The build pipeline has a fallback to PT-BR for missing or broken translations.

---

## 6. Edge-case checklist before emitting

- [ ] Did I keep `slug:`, `categoria:`, `subcategoria:`, `tags:`, `prerrequisitos:` exactly as in source?
- [ ] Did I leave every `$...$` and `$$...$$` math expression untouched?
- [ ] Did I leave `<Eq>{`...`}</Eq>` template literals untouched (including double-escaped backslashes)?
- [ ] Did I keep `<Exercicio numero="X.Y" dificuldade="…">` props verbatim?
- [ ] Did I translate `audioTexto` into the target locale? (It is read aloud — must be natural prose.)
- [ ] Did I avoid emojis? (No emojis in lesson MDX.)
- [ ] Did I keep URLs and code blocks verbatim?
- [ ] Did I keep "## Fontes" with author names and book titles in original?
- [ ] Did I update `atualizadoEm` to today's date in the frontmatter? **Yes**, do this — set to today's ISO date.
- [ ] If the source has stray `</content>` at end → remove it.

If any check fails, re-emit. The build will reject malformed MDX.

---

> **Provenance.** This document is the canonical context bundle for translation agents. Edit only when the editorial pattern (`CLAUDE.md` §3) changes. Last update: 2026-05-04.
