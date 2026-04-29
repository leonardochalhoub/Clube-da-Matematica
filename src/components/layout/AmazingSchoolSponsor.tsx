/**
 * Banner de patrocínio da Amazing School.
 * Pequeno, elegante; não compete com o conteúdo.
 * Smile icon + nome + link.
 */
export function AmazingSchoolSponsor() {
  return (
    <a
      href="https://amazingschool.com.br"
      target="_blank"
      rel="noopener noreferrer"
      className="group not-prose inline-flex items-center gap-2.5 rounded-full border border-clube-gold-deep/30 bg-clube-gold/10 px-4 py-2 text-xs text-clube-ink/85 no-underline transition-all hover:-translate-y-0.5 hover:border-clube-gold-deep/60 hover:bg-clube-gold/15 hover:no-underline hover:shadow-sm"
      aria-label="Amazing School — plataforma grátis de inglês — apoiadora do Clube da Matemática"
    >
      <SmileIcon />
      <span>
        <span className="text-clube-mist">apoio:</span>{' '}
        <strong className="text-clube-gold-deep">Amazing School</strong>{' '}
        <span className="text-clube-mist">· inglês grátis</span>
      </span>
      <span
        aria-hidden
        className="text-clube-gold-deep/60 transition-transform group-hover:translate-x-0.5"
      >
        →
      </span>
    </a>
  )
}

function SmileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="16"
      height="16"
      aria-hidden="true"
      className="text-clube-gold-deep"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  )
}
