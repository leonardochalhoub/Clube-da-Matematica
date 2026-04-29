#!/usr/bin/env bash
# Download de TODOS os livros com PDF direto disponível e legal.
# URLs verificadas. Falhas são reportadas, não interrompem.
#
# Uso:    bash livros/scripts/download-all.sh
# Saída:  livros/raw/<slug>.pdf  (gitignored)

set -uo pipefail
DEST="$(cd "$(dirname "$0")/.." && pwd)/raw"
mkdir -p "$DEST"

declare -a BOOKS=(
  # ====== Cálculo (top prioridade) ======
  "active-calculus-single|https://activecalculus.org/single/_static/active-calculus-single.pdf"
  "active-calculus-multi|https://activecalculus.org/multi/_static/active-calculus-multi.pdf"
  "strang-calculus|https://ocw.mit.edu/ans7870/resources/Strang/Edited/Calculus/Calculus.pdf"
  "openstax-calculus-1|https://assets.openstax.org/oscms-prodcms/media/documents/CalculusVolume1-WEB_pdN1nuf.pdf"
  "openstax-calculus-2|https://assets.openstax.org/oscms-prodcms/media/documents/CalculusVolume2-WEB_R7gqr2k.pdf"
  "openstax-calculus-3|https://assets.openstax.org/oscms-prodcms/media/documents/CalculusVolume3-WEB.pdf"
  "apex-calculus|https://github.com/APEXCalculus/APEXCalculusES/releases/latest/download/APEXCalculus.pdf"
  "guichard-calculus|https://www.whitman.edu/mathematics/calculus_late_online/calculus_late.pdf"
  "corral-elementary-calculus|http://www.mecmath.net/calculus/calculus.pdf"
  "corral-vector-calculus|http://www.mecmath.net/VectorCalculus.pdf"
  "kyoto-calculus-jp|https://www.kurims.kyoto-u.ac.jp/~ishimoto/files/note_calculus.pdf"
  "lyon-fondmath1-fr|http://math.univ-lyon1.fr/~pujo/fondmath1.pdf"

  # ====== Pré-Cálculo / Álgebra / Trigonometria ======
  "openstax-college-algebra|https://assets.openstax.org/oscms-prodcms/media/documents/CollegeAlgebra2e-WEB.pdf"
  "openstax-precalculus|https://assets.openstax.org/oscms-prodcms/media/documents/Precalculus2e-WEB.pdf"
  "openstax-algebra-trig|https://assets.openstax.org/oscms-prodcms/media/documents/AlgebraandTrigonometry2e-WEB.pdf"
  "openstax-prealgebra|https://assets.openstax.org/oscms-prodcms/media/documents/Prealgebra2e-WEB.pdf"
  "openstax-elem-algebra|https://assets.openstax.org/oscms-prodcms/media/documents/ElementaryAlgebra2e-WEB.pdf"
  "openstax-interm-algebra|https://assets.openstax.org/oscms-prodcms/media/documents/IntermediateAlgebra2e-WEB.pdf"
  "stitz-zeager-precalculus|https://www.stitz-zeager.com/szprecalculus07042013.pdf"
  "battaia-matematica-base-it|http://www.batmath.it/matematica/mat_base/mbase.pdf"

  # ====== Álgebra Linear ======
  "axler-lin-alg-done-right|https://link.springer.com/content/pdf/10.1007/978-3-031-41026-0.pdf"
  "beezer-fcla|http://linear.ups.edu/download/fcla-electric-3.50.pdf"
  "hefferon-linear-algebra|https://hefferon.net/linearalgebra/jhanswers/jhanswers.pdf"
  "treil-lin-alg-done-wrong|https://www.math.brown.edu/streil/papers/LADW/LADW_2017-09-04.pdf"
  "boyd-vmls|https://web.stanford.edu/~boyd/vmls/vmls.pdf"
  "kuroda-linear-algebra-jp|https://www7b.biglobe.ne.jp/~h-kuroda/pdf/text_linear_algebra.pdf"
  "axler-lin-alg-cn|https://linear.axler.net/LADR4eChinese.pdf"
  "ecnu-linear-algebra-cn|https://math.ecnu.edu.cn/~hryuan/preprint/la.pdf"

  # ====== EDOs ======
  "lebl-diffyqs|https://www.jirka.org/diffyqs/diffyqs.pdf"
  "trench-elem-de|https://digitalcommons.trinity.edu/cgi/viewcontent.cgi?article=1008&context=mono"
  "wiggins-ode|https://courses.maths.ox.ac.uk/pluginfile.php/14528/mod_resource/content/13/odebook.pdf"

  # ====== Análise Real / Complexa ======
  "lebl-basic-analysis-1|https://www.jirka.org/ra/realanal.pdf"
  "lebl-basic-analysis-2|https://www.jirka.org/ra/realanal2.pdf"
  "trench-real-analysis|https://digitalcommons.trinity.edu/cgi/viewcontent.cgi?article=1006&context=mono"
  "thomson-elem-real-analysis|https://www.classicalrealanalysis.info/documents/TBB-AllChapters-Landscape.pdf"
  "axler-measure-integration|https://measure.axler.net/MIRA.pdf"
  "beck-complex-analysis|http://math.sfsu.edu/beck/papers/complex.pdf"

  # ====== Probabilidade / Estatística ======
  "openintro-statistics|https://www.openintro.org/book/os/4/openintro-statistics_4.pdf"
  "openintro-modern-stats|https://www.openintro.org/book/ims/ims-1st-edition.pdf"
  "openstax-statistics|https://assets.openstax.org/oscms-prodcms/media/documents/Statistics-WEB.pdf"
  "openstax-introductory-stats-2e|https://assets.openstax.org/oscms-prodcms/media/documents/IntroductoryStatistics2e-WEB.pdf"
  "grinstead-snell-probability|https://chance.dartmouth.edu/teaching_aids/books_articles/probability_book/amsbook.mac.pdf"
  "stark-sticigui|https://www.stat.berkeley.edu/~stark/SticiGui/Text/index.htm"
  "navarro-learn-stats-r|https://learningstatisticswithr-bookdown.netlify.app/learnstats.pdf"
  "lane-online-stats|http://onlinestatbook.com/Online_Statistics_Education.pdf"

  # ====== Métodos Numéricos ======
  "reamat-calc-num-py|https://www.ufrgs.br/reamat/CalculoNumerico/livro-py/livro-py.pdf"
  "reamat-calc-num-sci|http://www.mat.ufrgs.br/~guidi/grad/MAT01169/livro-sci.pdf"

  # ====== Lógica, Provas, Discreta ======
  "hammack-book-of-proof|https://www.people.vcu.edu/~rhammack/BookOfProof/BookOfProof.pdf"
  "sundstrom-mathematical-reasoning|https://scholarworks.gvsu.edu/cgi/viewcontent.cgi?article=1008&context=books"
  "fields-gentle-introduction|https://giam.southernct.edu/GIAM/GIAM-online.pdf"
  "levin-discrete-math|http://discrete.openmathbooks.org/pdfs/dmoi3.pdf"
  "judson-abstract-algebra|http://abstract.ups.edu/download/aata-20210805.pdf"

  # ====== Geometria, Topologia, Combinatória ======
  "hitchman-geometry-cosmic|https://mphitchman.com/geometry/GeometryWithAnIntroductionToCosmicTopology.pdf"
  "morris-topology-without-tears|https://www.topologywithouttears.net/topbook.pdf"
  "bogart-combinatorics|https://bogart.openmathbooks.org/pdfs/bogart-cgd.pdf"

  # ====== Física (calculus-based) ======
  "openstax-univ-physics-1|https://assets.openstax.org/oscms-prodcms/media/documents/UniversityPhysicsVolume1-WEB.pdf"
  "openstax-univ-physics-2|https://assets.openstax.org/oscms-prodcms/media/documents/UniversityPhysicsVolume2-WEB.pdf"
  "openstax-univ-physics-3|https://assets.openstax.org/oscms-prodcms/media/documents/UniversityPhysicsVolume3-WEB.pdf"
  "openstax-college-physics|https://assets.openstax.org/oscms-prodcms/media/documents/CollegePhysics2e-WEB.pdf"
  "crowell-light-and-matter|https://www.lightandmatter.com/lm.pdf"
  "crowell-conceptual-physics|https://www.lightandmatter.com/cp.pdf"

  # ====== ML / Data Science (ponte) ======
  "deisenroth-mml|https://mml-book.github.io/book/mml-book.pdf"
  "boyd-convex-optim|https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf"
  "hastie-elem-stat-learning|https://hastie.su.domains/Papers/ESLII.pdf"
  "james-intro-stat-learning|https://hastie.su.domains/ISLP/ISLP_website.pdf"

  # ====== Clássicos PD ======
  "newton-principia-en|https://www.gutenberg.org/files/28233/28233-pdf.pdf"
  "thompson-calculus-made-easy|https://www.gutenberg.org/files/33283/33283-pdf.pdf"
  "francoeur-cours-mathematiques-fr|https://gallica.bnf.fr/ark:/12148/bpt6k201333r.pdf"
)

echo "Tentativa de download de ${#BOOKS[@]} livros."
echo "================================================================"

OK=0
FAIL=0
for entry in "${BOOKS[@]}"; do
  IFS='|' read -r slug url <<< "$entry"
  out="$DEST/${slug}.pdf"
  if [ -f "$out" ] && [ -s "$out" ]; then
    echo "✓ $slug (cache)"
    OK=$((OK+1))
    continue
  fi
  if curl -fsSL --retry 1 --max-time 60 -o "$out" "$url" 2>/dev/null; then
    size=$(du -h "$out" | cut -f1)
    echo "✓ $slug ($size)"
    OK=$((OK+1))
  else
    echo "✗ $slug"
    rm -f "$out"
    FAIL=$((FAIL+1))
  fi
done

echo "================================================================"
echo "Total: $OK sucesso / $FAIL falhas / ${#BOOKS[@]} tentativas"
TOTAL_SIZE=$(du -sh "$DEST" 2>/dev/null | cut -f1)
echo "Espaço usado em $DEST: $TOTAL_SIZE"
