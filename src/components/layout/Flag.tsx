/**
 * Renderiza bandeira via Twemoji (Twitter Open Source Emoji — CC-BY 4.0).
 * Em sistemas onde emoji 🇧🇷, 🇺🇸 etc. são renderizados só como letras (Windows
 * default, alguns Linux), Twemoji garante a imagem real.
 *
 * Pode usar como `<Flag emoji="🇧🇷" />` (recebe o emoji do LOCALES).
 */
export function Flag({
  emoji,
  size = 16,
  className = '',
}: {
  emoji: string
  size?: number
  className?: string
}) {
  const codepoint = [...emoji]
    .map((c) => c.codePointAt(0)!.toString(16))
    .filter((cp) => cp !== 'fe0f') // remove variation selector se houver
    .join('-')
  const url = `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/${codepoint}.svg`
  return (
    <img
      src={url}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
      className={`flex-shrink-0 ${className}`}
      loading="lazy"
    />
  )
}
