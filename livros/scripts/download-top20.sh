#!/usr/bin/env bash
# Download dos top 20 livros prioritários do CATALOG.md.
#
# Uso:    bash livros/scripts/download-top20.sh
# Saída:  livros/raw/<id>-<slug>.pdf  (gitignored)
#
# A lista vem do CATALOG.md, seção "0. ⭐ TOP-20". URLs diretos a PDF
# quando disponíveis; HTML quando o livro só existe online.
#
# Falhas de rede / 404 são reportadas, não interrompem o script.

set -uo pipefail

DEST="$(cd "$(dirname "$0")/.." && pwd)/raw"
mkdir -p "$DEST"

declare -a BOOKS=(
  # rank | slug                          | URL
  "01|active-calculus-single|https://activecalculus.org/single/active-calculus-single.pdf"
  "01b|active-calculus-multi|https://activecalculus.org/multi/active-calculus-multi.pdf"
  "02|strang-calculus|https://ocw.mit.edu/ans7870/resources/Strang/Edited/Calculus/Calculus.pdf"
  "04|axler-linear-algebra-done-right|https://link.springer.com/content/pdf/10.1007/978-3-031-41026-0.pdf"
  "05|openintro-stats|https://www.openintro.org/book/os/4/openintro-statistics_4.pdf"
  "06|apex-calculus-1|https://www.apexcalculus.com/downloads/Calculus_I.pdf"
  "06b|apex-calculus-2|https://www.apexcalculus.com/downloads/Calculus_II.pdf"
  "06c|apex-calculus-3|https://www.apexcalculus.com/downloads/Calculus_III.pdf"
  "07|beezer-fcla|http://linear.ups.edu/download/fcla-3.50-print-online.pdf"
  "08|lebl-diffyqs|https://www.jirka.org/diffyqs/diffyqs.pdf"
  "09|lebl-basic-analysis-1|https://www.jirka.org/ra/realanal.pdf"
  "09b|lebl-basic-analysis-2|https://www.jirka.org/ra/realanal2.pdf"
  "10|reamat-calc-num-py|https://www.ufrgs.br/reamat/CalculoNumerico/livro-py/livro-py.pdf"
  "11|openstax-statistics|https://assets.openstax.org/oscms-prodcms/media/documents/Statistics-WEB.pdf"
  "12|hammack-book-of-proof|https://www.people.vcu.edu/~rhammack/BookOfProof/Main.pdf"
  "13|openstax-calculus-1|https://assets.openstax.org/oscms-prodcms/media/documents/CalculusVolume1-OP.pdf"
  "13b|openstax-calculus-2|https://assets.openstax.org/oscms-prodcms/media/documents/CalculusVolume2-OP.pdf"
  "13c|openstax-calculus-3|https://assets.openstax.org/oscms-prodcms/media/documents/CalculusVolume3-OP.pdf"
  "14|battaia-matematica-base|http://www.batmath.it/matematica/mat_base/mbase.pdf"
  "15|zakon-analysis-1|http://www.trillia.com/download/zakon1.pdf"
  "15b|zakon-analysis-2|http://www.trillia.com/download/zakon-analysisII.pdf"
  "16|openstax-univ-physics-1|https://assets.openstax.org/oscms-prodcms/media/documents/UniversityPhysicsVolume1-OP.pdf"
  "16b|openstax-univ-physics-2|https://assets.openstax.org/oscms-prodcms/media/documents/UniversityPhysicsVolume2-OP.pdf"
  "16c|openstax-univ-physics-3|https://assets.openstax.org/oscms-prodcms/media/documents/UniversityPhysicsVolume3-OP.pdf"
  "17|kyoto-calculus-jp|https://www.kurims.kyoto-u.ac.jp/~ishimoto/files/note_calculus.pdf"
  "18|cauchy-cours-analyse-1821|https://gallica.bnf.fr/ark:/12148/bpt6k90196z.pdf"
  "20|deisenroth-mml|https://mml-book.github.io/book/mml-book.pdf"
)

echo "Baixando ${#BOOKS[@]} livros prioritários para $DEST"
echo "================================================================"

OK_COUNT=0
FAIL_COUNT=0
FAIL_LIST=()

for entry in "${BOOKS[@]}"; do
  IFS='|' read -r rank slug url <<< "$entry"
  out="$DEST/${rank}-${slug}.pdf"

  if [ -f "$out" ] && [ -s "$out" ]; then
    echo "✓ #${rank} ${slug} (já existe)"
    OK_COUNT=$((OK_COUNT+1))
    continue
  fi

  if curl -fsSL --retry 2 --max-time 90 -o "$out" "$url" 2>/dev/null; then
    size=$(du -h "$out" | cut -f1)
    echo "✓ #${rank} ${slug} ($size)"
    OK_COUNT=$((OK_COUNT+1))
  else
    echo "✗ #${rank} ${slug} (FAIL: $url)"
    rm -f "$out"
    FAIL_COUNT=$((FAIL_COUNT+1))
    FAIL_LIST+=("${rank}-${slug}")
  fi
done

echo "================================================================"
echo "Sucesso: $OK_COUNT  /  Falhas: $FAIL_COUNT"
if [ $FAIL_COUNT -gt 0 ]; then
  echo "Falhas: ${FAIL_LIST[@]}"
  echo "Verifique URLs no CATALOG.md, ou baixe manualmente."
fi
echo ""
echo "Arquivos baixados em: $DEST"
ls -la "$DEST" 2>/dev/null | tail -n +2 | head -30
