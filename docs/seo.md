# SEO — Clube da Matemática

What's wired, what's pending, what to monitor. Single source of truth for SEO operations.

> **Multi-language signals below are FROZEN as of 2026-08-06.** The site now serves
> PT-BR only — hreflang/OG `alternateLocale`/sitemap all collapse to a single PT-BR
> entry, and `app/[categoria]/[...caminho]/page.tsx` mentioned below never existed as a
> real route (stale even before the freeze) — all lessons, PT-BR included, are served by
> `app/[locale]/[categoria]/[...caminho]/page.tsx` at `/pt-br/...`. See `CLAUDE.md` §4
> for exactly what changed. The rest of this doc (structured data, Search Console
> checklist, image OG pipeline) is still accurate for the single-locale site.

## What's wired (as of 2026-05-11)

### Crawler infrastructure
- `app/sitemap.ts` → emits sitemap.xml at build with one entry per (lesson × locale) pair where the translation file exists on disk. PT-BR is always emitted; other locales only if `content/i18n/<speech>/<path>.mdx` exists.
- `app/robots.ts` → fully open, references sitemap. No disallows.

### Per-page metadata
- `app/layout.tsx` → root `metadata` with site-wide title/description/OG/Twitter/robots; `metadataBase` set to absolute origin.
- `app/page.tsx` (home) → calls `buildHomeMetadata('pt-BR')` + injects `EducationalOrganization` + `WebSite` JSON-LD.
- `app/[categoria]/[...caminho]/page.tsx` (lessons) → `generateMetadata` calls `buildLessonMetadata` which produces full canonical + hreflang + OG + Twitter + indexable robots. Reads translated frontmatter from disk when present to get the localized `titulo`/`descricao`.
- All section pages (`manifesto`, `livros`, `mapa`, `provas`, `videos`, `ensino-medio`, `financas`) → `buildSectionMetadata`.

### Structured data (JSON-LD)
- Per lesson: `Course` schema (with `inLanguage`, `availableLanguage`, `teaches`, `educationalLevel`, `coursePrerequisites`, free `Offer`, `CourseInstance`) + `BreadcrumbList` (Home → Ensino Médio → Ano N → Trim M → Lição NN).
- Home: `EducationalOrganization` + `WebSite` (eligible for sitelinks search-box rich result).
- All emitted via `<JsonLd>` server component in `src/components/seo/JsonLd.tsx`.

### Multi-language signals
- `metadata.alternates.languages` (hreflang) → emitted only for locales where the translation file actually exists. `x-default` always points to PT-BR canonical.
- `<html lang>` corrected at first paint via inline script in root layout (root SSG ships `lang="pt-BR"` for all routes; the script reads URL prefix and updates `document.documentElement.lang` before React hydration).
- Open Graph: per-locale `og:locale`, full list of `alternateLocale`.

### Social previews (Open Graph)
- Per-lesson PNG cards generated at build time via `app/[categoria]/[...caminho]/opengraph-image.tsx`.
- One PNG per (lesson × locale) combination — e.g. ~1,200 PNGs total.
- Layout: dark teal background, lesson title (responsive font size), Year + Term subtitle, site name with ∫ glyph, locale flag.
- Twitter Card auto-uses the same image (Next.js convention).

## What's NOT yet wired (decisions pending)

### Custom domain
Recommended switch: `clubedamatematica.org` (or similar, ~$12/yr `.org`).

**Why:** root-domain trust signal beats `user.github.io/sub-path` by ~15–20%; cleaner canonical URLs without `/Clube-da-Matematica/` prefix.

**Migration cost:** GH Pages doesn't support 301 redirects (no server). Strategy:
1. Buy domain.
2. Add `CNAME` file to `public/`.
3. Configure DNS (A records to GH Pages IPs, or `CNAME` to `leonardochalhoub.github.io`).
4. Update `NEXT_PUBLIC_SITE_ORIGIN` env var in CI workflow.
5. Submit "Change of Address" in Google Search Console.
6. Expect 4–8 weeks of split indexing.

**When:** ~30 days after Phase 1 launch — after we see initial indexing traction in GSC, before backlinks accumulate.

### Analytics
Project ethos rules out Google Analytics (cookie banner overhead, privacy stance).

**Two viable choices, both privacy-respecting (no cookie banner required under GDPR/LGPD):**

1. **Plausible self-host** via Cloudflare Workers free tier — fully owned, ~30 min setup.
2. **Umami Cloud free tier** (10k events/mo) — easier setup, dependency on a vendor.

Decision pending owner choice. When ready, add:
```html
<script defer data-domain="<domain>" src="<plausible-or-umami-script>"></script>
```
to `app/layout.tsx`.

### Search Console submission
After first deploy with this commit:
1. **Google Search Console** → Add Property → Verify via meta tag (or DNS TXT if/when on custom domain) → Submit `sitemap.xml`.
2. **Bing Webmaster Tools** → import from GSC (one click) → confirm sitemap.

Initial expectation: ≥80% of submitted URLs indexed within 7 days.

## Monitoring (post-launch)

### Day 30 metrics (from GSC)
- Indexed URLs / Submitted URLs (target: ≥95%)
- Total impressions per locale (per Performance tab → filter by `country`)
- Top 10 queries per locale (PT, EN, ES) — confirm semantic field is on-topic

### Day 90 metrics
- Avg search position for tracked queries (target: page 1–3 for long-tail topical queries)
- Click-through-rate (target: ≥3% on page 1 results)
- Locale split (which countries are finding the site)

### Tracked target queries (manual sampling)
Long-tail academic, NOT competitive head terms. Examples:
- 🇧🇷 "matemática derivada exemplos", "limites trigonométricos fundamentais", "Black-Scholes derivação"
- 🇺🇸/🇬🇧 "limit definition derivative high school", "integration by parts examples", "chain rule explained"
- 🇪🇸/🇨🇴 "derivada definición ejemplos", "integrales por partes", "Black-Scholes opciones"

The site won't outrank Khan Academy on "math". It can rank for specific lesson topics — and that's what gets a student in Bogotá to land here for "límites trigonométricos fundamentales".

## Key decisions (ADRs)

| Decision | Rationale |
|---|---|
| **Hreflang only for fully-translated locales** | Emitting hreflang for fallback PT-BR pages on `/de/...` would create duplicate-content noise. Cleaner to under-promise. |
| **Keep Portuguese URL slugs in all locales** | Translating slugs would (a) double routing complexity, (b) break filesystem-fallback model, (c) require ~1,200 redirects on every rename, (d) maintenance burden. Title + h1 + description carry English/Spanish keywords. Slug is a minor signal. |
| **`Course` over `Article` schema** | Signals educational content, eligible for Google "Courses" rich result carousel. |
| **No paid SEO tools** | GSC + Bing Webmaster + Google Trends + PageSpeed Insights cover everything we need. Aligned with project's free-and-open ethos. |
| **Custom domain at Phase 4 (not Phase 1)** | Switching early wastes indexing equity; switching late means migration pain. 30 days post-launch is sweet spot. |
| **OG image with `next/og`, not pre-rendered files** | Programmatic = one template, automatically scales to all locales × lessons. Build emits static PNGs alongside route HTML. ~30 MB total. |

## Code map

```
src/lib/seo/
├── site.ts              # SITE_ORIGIN, BASE_PATH, site-name/description per locale
├── urls.ts              # canonicalUrlFor, hreflangAlternatesFor, localesAvailableFor
├── metadata.ts          # buildLessonMetadata, buildSectionMetadata, buildHomeMetadata
└── structured-data.ts   # buildCourseSchema, buildBreadcrumbSchema, buildOrganizationSchema, buildWebSiteSchema

src/components/seo/
└── JsonLd.tsx           # <JsonLd data={...}> server component

app/
├── sitemap.ts           # MetadataRoute.Sitemap — all (lesson × locale) + statics
├── robots.ts            # MetadataRoute.Robots — open + sitemap link
├── [categoria]/[...caminho]/
│   ├── page.tsx         # generateMetadata + JSON-LD wiring
│   └── opengraph-image.tsx  # next/og — per-lesson PNG card
└── layout.tsx           # root metadata + inline script for <html lang> per locale
```

## Verification checklist (after first build + deploy)

- [ ] `curl https://leonardochalhoub.github.io/Clube-da-Matematica/sitemap.xml` returns valid XML with N entries (N ≈ 1,200).
- [ ] `curl https://leonardochalhoub.github.io/Clube-da-Matematica/robots.txt` shows `Sitemap:` line.
- [ ] View-source on a lesson page shows `<link rel="canonical">`, `<link rel="alternate" hreflang="...">`, OG meta, Twitter meta, and at least 2 `<script type="application/ld+json">` blocks (Course + BreadcrumbList).
- [ ] `https://leonardochalhoub.github.io/Clube-da-Matematica/aulas/.../opengraph-image` returns a PNG (1200×630).
- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results) on a lesson URL: 0 errors, "Course" + "BreadcrumbList" detected.
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator) shows full card with image.
- [ ] WhatsApp preview test (paste link in chat): card with image appears.
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) on a lesson: ≥90 mobile.
- [ ] Submit sitemap in Google Search Console.
- [ ] Submit sitemap in Bing Webmaster Tools.

---

**Last update:** 2026-05-11. This doc owns the SEO contract — update it in the same commit when SEO conventions change.
