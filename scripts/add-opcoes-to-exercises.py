#!/usr/bin/env python3
"""
Add `opcoes` to every <Exercicio> block that is missing it, across target lessons.
Strategy: use pre-built answer maps keyed by exercise numero.
"""
from __future__ import annotations
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------------------------
# Answer maps: numero -> (correct_text, [distractor1, distractor2, distractor3])
# All values are LaTeX strings for the `texto` field.
# ---------------------------------------------------------------------------

OPCOES_MAP: dict[str, tuple[str, list[str]]] = {

  # ---- L60 Consolidação Trim 6 ----
  "60.1":  ("$6$",                          ["$9$", "$3$", "$12$"]),
  "60.2":  ("$-1$",                         ["$1$", "$-\\dfrac{1}{2}$", "$0$"]),
  "60.3":  ("$\\dfrac{1}{4}$",             ["$\\dfrac{1}{2}$", "$\\dfrac{1}{5}$", "$4$"]),
  "60.5":  ("$g'(0)=0$",                   ["$g'(0)$ não existe", "$g'(0)=1$", "$g'(0)=-1$"]),
  "60.6":  ("$4x^3 - 6x$",                 ["$4x^3 - 3x$", "$4x^3 - 6x + 7$", "$3x^3 - 6x$"]),
  "60.7":  ("$e^x(\\sin x + \\cos x)$",   ["$e^x \\sin x$", "$e^x \\cos x$", "$e^x(\\sin x - \\cos x)$"]),
  "60.8":  ("$\\dfrac{-2}{(x-1)^2}$",      ["$\\dfrac{2}{(x-1)^2}$", "$\\dfrac{-2}{(x+1)^2}$", "$\\dfrac{1}{(x-1)^2}$"]),
  "60.9":  ("$\\sin x + x\\cos x$",        ["$x\\sin x + \\cos x$", "$\\cos x$", "$x\\cos x$"]),
  "60.10": ("$\\dfrac{x\\cos x - 2\\sin x}{x^3}$", ["$\\dfrac{\\cos x}{x^2}$", "$\\dfrac{x\\cos x + 2\\sin x}{x^3}$", "$\\dfrac{\\cos x - 2\\sin x}{x^3}$"]),
  "60.11": ("$x^2 e^x(3+x)$",              ["$3x^2 e^x$", "$x^3 e^x$", "$x^2 e^x(x-3)$"]),
  "60.12": ("$2$",                           ["$4$", "$0$", "$-2$"]),
  "60.14": ("$\\dfrac{-2x}{(x^2-1)^2}$",  ["$\\dfrac{2x}{(x^2-1)^2}$", "$\\dfrac{-2}{(x^2-1)^2}$", "$\\dfrac{2x}{x^2-1}$"]),
  "60.15": ("$10(2x+1)^4$",               ["$5(2x+1)^4$", "$10(2x+1)^5$", "$2(2x+1)^4$"]),
  "60.16": ("$3x^2\\cos(x^3)$",           ["$\\cos(x^3)$", "$3x^2\\sin(x^3)$", "$-3x^2\\cos(x^3)$"]),
  "60.17": ("$2xe^{x^2}$",                ["$e^{x^2}$", "$2e^{x^2}$", "$x^2 e^{x^2}$"]),
  "60.18": ("$\\dfrac{2}{2x+3}$",         ["$\\dfrac{1}{2x+3}$", "$\\dfrac{2}{2x}$", "$\\ln(2x+3)$"]),
  "60.19": ("$\\dfrac{2x}{\\sqrt{1-x^4}}$", ["$\\dfrac{1}{\\sqrt{1-x^4}}$", "$\\dfrac{2x}{\\sqrt{1+x^4}}$", "$\\dfrac{2}{\\sqrt{1-x^4}}$"]),
  "60.20": ("$-\\sin(\\sin x)\\cos x$",  ["$\\cos(\\sin x)\\cos x$", "$-\\cos(\\sin x)\\sin x$", "$\\sin(\\cos x)\\sin x$"]),
  "60.21": ("$x^x(1+\\ln x)$",           ["$x^x \\ln x$", "$x^{x-1}$", "$x^x$"]),
  "60.22": ("$\\dfrac{3\\cos(3x)}{\\sin(3x)+2}$", ["$\\dfrac{\\cos(3x)}{\\sin(3x)+2}$", "$\\dfrac{3\\cos(3x)}{\\sin(3x)}$", "$\\dfrac{-3\\cos(3x)}{\\sin(3x)+2}$"]),
  "60.23": ("$-\\dfrac{x}{y}$",           ["$\\dfrac{x}{y}$", "$-\\dfrac{y}{x}$", "$-y$"]),
  "60.24": ("$-1$",                        ["$1$", "$-\\dfrac{1}{2}$", "$0$"]),
  "60.25": ("$\\dfrac{\\pi}{2}$",         ["$0$", "$\\pi$", "$\\dfrac{\\pi}{4}$"]),
  "60.26": ("tangente vertical em $(3,0)$", ["$y' = 0$ em $(3,0)$", "$y' = -4/3$ em $(3,0)$", "tangente horizontal em $(3,0)$"]),
  "60.28": ("$y'' = -\\dfrac{r^2}{y^3}$", ["$y'' = -\\dfrac{1}{y}$", "$y'' = \\dfrac{r^2}{y^3}$", "$y'' = -\\dfrac{r^2}{y^2}$"]),
  "60.29": ("$y' = \\dfrac{-(2xy+y^2)}{x^2+2xy}$", ["$y' = \\dfrac{2xy+y^2}{x^2+2xy}$", "$y' = -\\dfrac{x}{y}$", "$y' = \\dfrac{y^2}{x^2}$"]),
  "60.30": ("$6x-4$",                     ["$6x$", "$3x^2-4x$", "$6x-2$"]),
  "60.31": ("$\\sin x$",                  ["$\\cos x$", "$-\\sin x$", "$-\\cos x$"]),
  "60.32": ("$\\dfrac{1}{1+x^2}$",       ["$\\dfrac{1}{\\sqrt{1-x^2}}$", "$\\dfrac{-1}{1+x^2}$", "$\\dfrac{1}{1-x^2}$"]),
  "60.33": ("$\\dfrac{2}{1+4x^2}$",      ["$\\dfrac{1}{1+4x^2}$", "$\\dfrac{2}{1+2x^2}$", "$\\dfrac{4}{1+4x^2}$"]),
  "60.35": ("$a^x \\ln a$",              ["$a^x$", "$x \\cdot a^{x-1}$", "$a^x / \\ln a$"]),
  "60.36": ("$-2^{50}\\sin(2x)$",        ["$2^{50}\\sin(2x)$", "$2^{50}\\cos(2x)$", "$-2^{50}\\cos(2x)$"]),
  "60.37": ("$e^{0{,}1} \\approx 1{,}1$", ["$e^{0{,}1} \\approx 1{,}2$", "$e^{0{,}1} \\approx 1{,}05$", "$e^{0{,}1} \\approx 0{,}9$"]),
  "60.38": ("$5{,}01$",                   ["$5{,}1$", "$5{,}001$", "$4{,}99$"]),
  "60.39": ("$\\ln(1{,}05)\\approx 0{,}05$", ["$\\ln(1{,}05)\\approx 0{,}10$", "$\\ln(1{,}05)\\approx 0{,}025$", "$\\ln(1{,}05)\\approx 0{,}5$"]),
  "60.41": ("$\\approx 31{,}4$ cm³; erro relativo $6\\%$", ["$\\approx 10\\pi$ cm³; erro relativo $2\\%$", "$\\approx 50$ cm³; erro relativo $10\\%$", "$\\approx 31{,}4$ cm³; erro relativo $3\\%$"]),
  "60.42": ("$3\\%$",                     ["$1\\%$", "$2\\%$", "$9\\%$"]),
  "60.43": ("$\\dfrac{1}{8\\pi}$ cm/s",  ["$\\dfrac{1}{4\\pi}$ cm/s", "$\\dfrac{1}{16\\pi}$ cm/s", "$\\dfrac{2}{\\pi}$ cm/s"]),
  "60.44": ("$\\dfrac{3}{\\pi}$ m/min",  ["$\\dfrac{1}{\\pi}$ m/min", "$\\dfrac{4}{\\pi}$ m/min", "$3\\pi$ m/min"]),
  "60.45": ("$-\\dfrac{5}{\\sqrt{39}}$ m/s", ["$-\\dfrac{5}{8}$ m/s", "$\\dfrac{5}{\\sqrt{39}}$ m/s", "$-\\dfrac{8}{\\sqrt{39}}$ m/s"]),
  "60.46": ("$50$ km/h",                  ["$70$ km/h", "$40$ km/h", "$\\sqrt{2500}$ km/h"]),
  "60.47": ("$\\dfrac{dA}{dt} = 2\\pi r c$ — proporcional a $r$", ["$\\dfrac{dA}{dt} = c$ — constante", "$\\dfrac{dA}{dt} = \\pi c^2$ — proporcional a $c^2$", "$\\dfrac{dA}{dt} = 4\\pi r c$ — proporcional a $4r$"]),
  "60.48": ("$6\\pi \\approx 18{,}85$ cm²/s", ["$\\pi \\approx 3{,}14$ cm²/s", "$9\\pi$ cm²/s", "$3$ cm²/s"]),
  "60.50": ("$a=2$, $b=-1$",             ["$a=1$, $b=0$", "$a=2$, $b=0$", "$a=1$, $b=-1$"]),

  # ---- L61 Máximos e mínimos ----
  "61.1":  ("mínimo local em $x=2$, valor $-1$", ["máximo local em $x=2$, valor $-1$", "mínimo local em $x=2$, valor $1$", "ponto de inflexão em $x=2$"]),
  "61.2":  ("máximo em $x=-2$ ($f=-16$ não), $f(-2)=16$; mínimo em $x=2$, $f(2)=-16$", ["máximo em $x=2$, $f(2)=16$; mínimo em $x=-2$", "mínimo em $x=0$, sem máximo local", "máximo em $x=-2$, valor $-16$"]),
  "61.3":  ("mín absoluto $-1$ em $t=3$; máx absoluto $3$ em $t=1$ e $t=5$", ["mín absoluto $0$ em $t=2$; máx absoluto $8$ em $t=5$", "mín absoluto $-1$ em $t=2$; máx absoluto $3$ em $t=5$", "mín absoluto $3$ em $t=1$; máx absoluto $-1$ em $t=3$"]),
  "61.4":  ("mínimos em $x=\\pm1$; máximo em $x=0$", ["máximos em $x=\\pm1$; mínimo em $x=0$", "só mínimo em $x=0$", "ponto de inflexão em $x=0$; mínimos em $x=\\pm1$"]),
  "61.5":  ("máximo absoluto $1$; mínimo absoluto $-1$", ["máximo $2\\pi$; mínimo $0$", "máximo $1$ em $x=0$; mínimo $-1$", "máximo absoluto $0$; mínimo absoluto $-1$"]),
  "61.6":  ("máximo em $x=-2$; mínimo em $x=3$", ["mínimo em $x=-2$; máximo em $x=3$", "somente mínimo em $x=3$", "máximo em $x=0$; mínimo em $x=2$"]),
  "61.7":  ("cúspide em $x=0$; sem extremo local", ["mínimo local em $x=0$", "máximo local em $x=0$", "ponto de inflexão em $x=0$"]),
  "61.8":  ("mínimo local (e global) em $x=0$, $f(0)=0$", ["máximo local em $x=0$", "ponto de inflexão em $x=0$", "sem pontos críticos"]),
  "61.9":  ("máximo absoluto $23$ em $x=3$; mínimo absoluto $3$ em $x=-2$ e $x=1$", ["máximo $7$ em $x=-1$; mínimo $3$ em $x=-2$", "máximo $23$; mínimo $7$", "máximo $23$ em $x=3$; mínimo $-1$ em $x=-1$"]),
  "61.10": ("máximo absoluto $\\sqrt{2}$; mínimo absoluto $-1$", ["máximo $1$; mínimo $-1$", "máximo $\\sqrt{2}$; mínimo $0$", "máximo $2$; mínimo $-1$"]),
  "61.11": ("máximo absoluto $1$; mínimo absoluto $-3$", ["máximo $1$; mínimo $0$", "máximo $-3$; mínimo $1$", "máximo $4$; mínimo $-3$"]),
  "61.12": ("mínimo absoluto $f(1)=2$; máximo absoluto $f(4)=4{,}25$", ["mínimo $f(1)=2$; máximo $f(4)=17/4$", "mínimo $0$; máximo $4{,}25$", "mínimo $f(4)=4{,}25$; máximo $f(1)=2$"]),
  "61.16": ("máximo absoluto $-1$ (em $x=0$ e $x=3$); mínimo absoluto $-5$", ["máximo $-1$; mínimo $0$", "máximo $0$; mínimo $-5$", "máximo $3$; mínimo $-5$"]),
  "61.17": ("mínimo local em $x=-1$, $f(-1)=-1/e$", ["máximo local em $x=-1$", "mínimo em $x=0$", "sem extremo local"]),
  "61.18": ("máximo local $g(1)=1/2$; mínimo local $g(-1)=-1/2$", ["máximo local $g(1)=1$; mínimo local $g(-1)=-1$", "sem extremos locais", "máximo em $x=0$"]),
  "61.19": ("mín absoluto $f(1)=0$; máx absoluto $f(e)=1$", ["mín $0$; máx $e$", "sem extremos", "mín absoluto $f(e)=1$; máx absoluto $f(1)=0$"]),
  "61.20": ("máximo absoluto $f(0)=1$", ["mínimo em $x=0$", "sem extremos", "máximo em $x=1$"]),
  "61.21": ("máximo absoluto $4$ em $x=2$; mínimo absoluto $0$ em $x=1$", ["máximo $2$ em $x=0$; mínimo $0$ em $x=1$", "máximo $4$; mínimo $-2$", "máximo $2$; mínimo $0$"]),
  "61.22": ("máximo absoluto $1$; mínimo absoluto $-1$", ["máximo $2$; mínimo $-2$", "máximo $1$ em $x=0$; mínimo $-1$", "máximo $0$; mínimo $-1$"]),
  "61.23": ("$p^*=25$ R\$; receita máxima R\$ $1250$", ["$p^*=50$ R\$; receita R\$ $2500$", "$p^*=25$ R\$; receita R\$ $625$", "$p^*=100$ R\$; receita máxima R\$ $1000$"]),
  "61.24": ("$x=30$ unidades; lucro máximo R\$ $600$", ["$x=40$; lucro R\$ $600$", "$x=30$; lucro R\$ $500$", "$x=20$; lucro R\$ $600$"]),
  "61.25": ("$h_{\\max}=21{,}6$ m em $t=2$ s", ["$h_{\\max}=19{,}6$ m em $t=2$ s", "$h_{\\max}=21{,}6$ m em $t=4$ s", "$h_{\\max}=24$ m em $t=2$ s"]),
  "61.26": ("mínimo $f(1)=2$", ["mínimo $f(1)=0$", "máximo $f(1)=2$", "mínimo $f(1)=1$"]),
  "61.27": ("mín absoluto $f(1)=-3$; máx absoluto $f(4)=3$", ["mín $f(1)=-3$; máx $f(4)=4$", "mín $0$; máx $3$", "mín $f(4)=3$; máx $f(1)=-3$"]),

  # ---- L62 Otimização ----
  "62.1":  ("$x=0$, $y=6$; distância mínima $6$", ["$x=1$, $y=5$; distância mínima $\\sqrt{26}$", "$x=0$, $y=6$; distância $\\sqrt{6}$", "$x=3$, $y=3$; distância mínima $3\\sqrt{2}$"]),
  "62.2":  ("$x=y=3$; área mínima $A=54$", ["$x=y=6$; área mínima $A=108$", "$x=6$, $y=3$; área mínima $A=54$", "$x=2$, $y=4$; área mínima $A=40$"]),
  "62.3":  ("$x=3$; mínimo de $f(x)=x+9/x$ é $6$", ["$x=3$; mínimo $3$", "$x=9$; mínimo $6$", "$x=1$; mínimo $10$"]),
  "62.4":  ("$x=y=5$; produto máximo $25$", ["$x=4$, $y=6$; produto $24$", "$x=2$, $y=8$; produto máximo $25$", "$x=y=5$; produto mínimo $25$"]),
  "62.5":  ("$x=y=10$; produto máximo $100$", ["$x=5$, $y=15$; produto $75$", "$x=y=10$; produto mínimo $100$", "$x=y=10$; produto $200$"]),
  "62.6":  ("$x=2$; mínimo $f(2)=4$", ["$x=4$; mínimo $5$", "$x=2$; mínimo $2$", "$x=1$; mínimo $5$"]),
  "62.7":  ("$(2,\\ 0)$", ["$(0,\\ 0)$", "$(2,\\ 2)$", "$(4,\\ 0)$"]),
  "62.8":  ("$(3,\\ 3)$; distância $\\sqrt{2}$", ["$(2,\\ 2)$; distância $\\sqrt{5}$", "$(3,\\ 3)$; distância $2$", "$(4,\\ 4)$; distância $\\sqrt{2}$"]),
  "62.9":  ("corte $x=2$ cm; volume máximo $200$ cm³", ["corte $x=3$ cm; volume $162$ cm³", "corte $x=2$ cm; volume $216$ cm³", "corte $x=4$ cm; volume $200$ cm³"]),
  "62.10": ("$x=50$ und.; preço $p=100$ R\$; receita máx. $5000$", ["$x=100$; preço $0$; receita $0$", "$x=50$; preço $50$; receita $2500$", "$x=25$; preço $150$; receita $3750$"]),
  "62.11": ("$x=50$ unidades; lucro máximo R\$ $2400$", ["$x=70$; lucro R\$ $2400$", "$x=50$; lucro R\$ $5000$", "$x=40$; lucro R\$ $2300$"]),
  "62.12": ("$x\\approx4{,}58$ cm; $h\\approx4{,}58$ cm (cubo)", ["$x=4$ cm; $h=6$ cm", "$x=6$ cm; $h=2{,}67$ cm", "$x=\\sqrt{96}$ cm; $h=1$ cm"]),
  "62.15": ("$h=2R/\\sqrt{3}$, $r=R\\sqrt{2/3}$", ["$h=R$, $r=R/\\sqrt{2}$", "$h=2R$, $r=R$", "$h=R/\\sqrt{3}$, $r=R$"]),
  "62.16": ("$(\\pm\\sqrt{5/2},\\ 5/2)$; distância $\\sqrt{11}/2$", ["$(0,\\ 0)$; distância $3$", "$(1,\\ 1)$; distância $\\sqrt{5}$", "$(\\pm1,\\ 1)$; distância $2$"]),
  "62.17": ("$x\\approx21{,}2$ m, $y\\approx14{,}1$ m; custo mín. $\\approx$R\$ $84{,}8$", ["$x=15$ m, $y=20$ m; custo R\$ $90$", "$x=30$ m, $y=10$ m; custo R\$ $90$", "$x=20$ m, $y=15$ m; custo R\$ $85$"]),
  "62.18": ("$h_{\\max}=23$ m em $t=2$ s", ["$h_{\\max}=20$ m em $t=2$ s", "$h_{\\max}=23$ m em $t=4$ s", "$h_{\\max}=3$ m em $t=0$ s"]),
  "62.19": ("$r^*\\approx2{,}67$ cm, $h\\approx8{,}93$ cm", ["$r=5$ cm, $h=2{,}55$ cm", "$r=2$ cm, $h=15{,}9$ cm", "$r=4$ cm, $h=3{,}98$ cm"]),
  "62.20": ("$r=20/\\pi\\approx6{,}37$ m; $l=0$ (semicírculo puro)", ["$r=5$ m; $l=2{,}5$ m", "$r=\\pi$ m; $l=3$ m", "$r=10/\\pi$ m; $l=5$ m"]),
  "62.21": ("$x=y=5$; soma dos quadrados mínima $50$", ["$x=2$, $y=8$; soma $68$", "$x=y=5$; soma $100$", "$x=0$, $y=10$; soma $100$"]),
  "62.22": ("$x=2/3$, $y=1/3$; $P_{\\max}=4/27$", ["$x=1/2$, $y=1/2$; $P_{\\max}=1/8$", "$x=1$, $y=0$; $P_{\\max}=0$", "$x=2/3$, $y=1/3$; $P_{\\max}=2/9$"]),
  "62.23": ("área máxima $25$", ["área máxima $50$", "área máxima $25\\pi$", "área máxima $12{,}5$"]),
  "62.25": ("$130$ passageiros; tarifa R\$ $65$; receita R\$ $8450$", ["$150$ passageiros; tarifa R\$ $55$", "$100$ passageiros; tarifa R\$ $80$", "$160$ passageiros; tarifa R\$ $50$"]),
  "62.26": ("$37$ ou $38$ árvores", ["$25$ árvores", "$50$ árvores", "$30$ árvores"]),
  "62.27": ("$r=10/(4+\\pi)\\approx1{,}40$ m", ["$r=2{,}5$ m", "$r=10/\\pi$ m", "$r=5/(4+\\pi)$ m"]),
  "62.30": ("$R_{\\max}=2AB$", ["$R_{\\max}=AB$", "$R_{\\max}=4AB$", "$R_{\\max}=\\pi AB$"]),

  # ---- L63 Esboço de gráficos ----
  "63.1":  ("crescente em $(-\\infty,-1)$ e $(3,\\infty)$; decrescente em $(-1,3)$", ["crescente em $(-1,3)$; decrescente fora", "sempre crescente", "crescente em $(0,\\infty)$; decrescente em $(-\\infty,0)$"]),
  "63.2":  ("$f$ crescente onde $f'>0$; decrescente onde $f'<0$", ["$f$ crescente onde $f'<0$", "$f$ crescente onde $f''<0$", "$f$ crescente onde $f=0$"]),
  "63.3":  ("côncava para cima em $(-\\infty,1)$; côncava para baixo em $(1,\\infty)$; PI em $x=1$", ["côncava para cima em $(1,\\infty)$; PI em $x=0$", "sem pontos de inflexão", "côncava para baixo em toda a reta"]),
  "63.4":  ("$x=0$ e $x=2$", ["$x=1$", "$x=-1$ e $x=1$", "$x=0$ apenas"]),
  "63.5":  ("assíntota horizontal $y=1$ quando $x\\to\\pm\\infty$; assíntota vertical $x=0$", ["assíntota horizontal $y=0$; assíntota vertical $x=0$", "sem assíntotas", "assíntota horizontal $y=-1$"]),
  "63.6":  ("máximo local em $x=-1$; mínimo em $x=1$; PI em $x=0$", ["máximo em $x=1$; mínimo em $x=-1$", "PI em $x=1$; sem extremos", "máximo em $x=0$"]),
  "63.7":  ("crescente em $(-\\infty,0)$ e $(2,\\infty)$; decrescente em $(0,2)$", ["crescente em $(0,2)$; decrescente fora", "sempre decrescente", "crescente em $(1,\\infty)$"]),
  "63.8":  ("assíntota horizontal $y=2$; zero em $x=\\ln 2$", ["assíntota $y=0$; zero em $x=0$", "sem assíntota horizontal; zero em $x=\\ln2$", "assíntota $y=2$; sem zeros reais"]),
  "63.9":  ("côncava para baixo em $(-\\infty,0)$; côncava para cima em $(0,\\infty)$; PI em $x=0$", ["côncava para cima em toda a reta", "côncava para baixo em toda a reta", "PI em $x=1$"]),
  "63.10": ("$\\lim_{x\\to\\infty}=1$, $\\lim_{x\\to-\\infty}=1$; máximo em $x=0$ com $f(0)=1$", ["$\\lim=0$; máximo em $x=0$", "$\\lim=1$; mínimo em $x=0$", "$\\lim=e$; máximo em $x=1$"]),
  "63.11": ("crescente em $(-\\infty,0)$; decrescente em $(0,\\infty)$; máximo $f(0)=0$", ["decrescente em $(-\\infty,0)$; crescente em $(0,\\infty)$", "sempre decrescente", "sem extremos locais"]),
  "63.12": ("côncava para cima em $(-\\infty,0)$ e $(2,\\infty)$; côncava para baixo em $(0,2)$; PIs em $x=0$ e $x=2$", ["côncava para cima em toda reta; sem PIs", "côncava para cima em $(0,2)$; PIs em $x=0$ e $x=2$", "PI somente em $x=1$"]),
  "63.13": ("crescente em $(-\\infty,1)$; decrescente em $(1,\\infty)$; máximo $e^{-1}$ em $x=1$", ["decrescente em toda a reta", "crescente em $(0,\\infty)$", "máximo em $x=0$"]),
  "63.14": ("assíntota vertical em $x=0$; $\\lim_{x\\to\\infty}=0$", ["assíntota vertical em $x=1$", "sem assíntotas", "assíntota horizontal $y=1$"]),
  "63.15": ("$f$ convexa; mínimo global $f(0)=0$; sem PI", ["$f$ côncava para baixo; máximo em $x=0$", "PI em $x=0$", "sem extremo global"]),
  "63.16": ("crescente em $(0,2)$; decrescente em $(2,\\infty)$; máximo em $x=2$", ["crescente em $(0,\\infty)$", "decrescente em $(0,\\infty)$", "máximo em $x=0$"]),
  "63.17": ("dois PIs siméticos em $x=\\pm1/\\sqrt{3}$", ["PI em $x=0$", "sem pontos de inflexão", "PI em $x=\\pm1$"]),
  "63.18": ("assíntota horizontal $y=3$; assíntota vertical $x=2$", ["assíntota $y=1$; assíntota $x=3$", "assíntota $y=3$; sem vertical", "sem assíntotas"]),
  "63.19": ("$f$ par — simétrica em relação ao eixo $y$", ["$f$ ímpar — simétrica em relação à origem", "$f$ nem par nem ímpar", "$f$ periódica com período $2\\pi$"]),
  "63.20": ("crescente em $(1,e)$; mínimo $f(1)=0$; máximo $f(e)=1/e$", ["crescente em $(0,1)$; máximo em $x=0$", "decrescente em $(1,e)$", "mínimo em $x=e$"]),
  "63.21": ("côncava para cima em $(0,\\infty)$; sem PI", ["côncava para baixo em $(0,\\infty)$", "PI em $x=1$", "côncava para cima em $(-\\infty,0)$"]),
  "63.22": ("assíntota oblíqua $y=x$ quando $x\\to\\pm\\infty$; mínimo em $x=1$", ["assíntota $y=2x$", "sem assíntota oblíqua", "assíntota $y=x+1$"]),
  "63.23": ("$x=1$: ponto de inflexão (PI), pois $f''$ muda de sinal", ["$x=1$: mínimo local", "$x=1$: máximo local", "$x=1$: nem extremo nem PI"]),
  "63.24": ("domínio $x>-1$; crescente; côncava para baixo; assíntota $x=-1$", ["domínio $x>0$; decrescente", "côncava para cima", "assíntota $y=0$"]),
  "63.25": ("assíntota horizontal $y=0$ (direita), $y=1$ (esquerda); inflexão em $x=0$", ["assíntota $y=1$ para ambos os lados", "sem assíntota", "assíntota $y=0$ para ambos"]),
  "63.26": ("crescente em $(-\\infty,-1)$ e $(0,1)$; decrescente em $(-1,0)$ e $(1,\\infty)$", ["crescente em $(-1,0)$ e $(1,\\infty)$", "sempre crescente", "decrescente em toda a reta"]),
  "63.27": ("assíntota oblíqua $y=x-2$; zero duplo em $x=0$", ["assíntota $y=x$; zero em $x=2$", "assíntota $y=x-1$", "sem assíntota oblíqua"]),
  "63.28": ("$f$ par; máximos em $x=\\pm1$; mínimo em $x=0$", ["$f$ ímpar; mínimo em $x=0$", "máximos em $x=0$; mínimos em $x=\\pm1$", "sem extremos"]),
  "63.29": ("PI em $x=0$; crescente em toda a reta; côncava para baixo em $x<0$", ["máximo em $x=0$; PI em $x=1$", "decrescente em toda a reta", "côncava para cima em toda a reta"]),
  "63.30": ("assíntota vertical $x=0$; cresce para $+\\infty$ quando $x\\to0^+$; decrescente", ["assíntota $x=1$; crescente", "sem assíntota vertical", "assíntota $x=0$; mínimo em $x=e$"]),

  # ---- L64 L'Hôpital ----
  "64.1":  ("$1$",                          ["$0$", "$\\infty$", "$\\dfrac{1}{2}$"]),
  "64.2":  ("$0$",                          ["$1$", "$\\infty$", "$-1$"]),
  "64.3":  ("$\\dfrac{1}{2}$",             ["$0$", "$1$", "$\\infty$"]),
  "64.4":  ("$1$",                          ["$0$", "$e$", "$\\dfrac{1}{2}$"]),
  "64.5":  ("$2$",                          ["$1$", "$0$", "$\\infty$"]),
  "64.6":  ("$\\dfrac{1}{6}$",             ["$0$", "$\\dfrac{1}{3}$", "$\\dfrac{1}{2}$"]),
  "64.7":  ("$-\\dfrac{1}{2}$",            ["$0$", "$-1$", "$\\dfrac{1}{2}$"]),
  "64.8":  ("$0$",                          ["$1$", "$-1$", "$\\infty$"]),
  "64.9":  ("$1$",                          ["$0$", "$e$", "$\\dfrac{\\pi}{2}$"]),
  "64.10": ("$0$",                          ["$1$", "$-\\infty$", "$\\dfrac{1}{2}$"]),
  "64.11": ("$\\dfrac{1}{2}$",             ["$1$", "$0$", "$2$"]),
  "64.12": ("$1$",                          ["$0$", "$e$", "$\\dfrac{1}{e}$"]),
  "64.13": ("$0$",                          ["$1$", "$\\infty$", "$-1$"]),
  "64.14": ("$\\dfrac{3}{2}$",             ["$1$", "$3$", "$\\dfrac{1}{2}$"]),
  "64.15": ("$0$",                          ["$1$", "$-1$", "$\\infty$"]),
  "64.16": ("$\\dfrac{1}{2}$",             ["$0$", "$1$", "$2$"]),
  "64.17": ("$+\\infty$",                  ["$0$", "$1$", "$-\\infty$"]),
  "64.18": ("$1$",                          ["$0$", "$e$", "$\\ln 2$"]),
  "64.19": ("forma $0/0$ ou $\\infty/\\infty$", ["qualquer forma indeterminada", "apenas $0/0$", "apenas $\\infty/\\infty$"]),
  "64.20": ("$e^{-1}$",                    ["$0$", "$1$", "$e$"]),
  "64.21": ("$0$",                          ["$1$", "$\\infty$", "$e$"]),
  "64.22": ("$\\dfrac{5}{3}$",             ["$\\dfrac{3}{5}$", "$0$", "$\\dfrac{5}{2}$"]),
  "64.23": ("$0$",                          ["$1$", "$-1$", "$\\infty$"]),
  "64.24": ("$\\dfrac{1}{2}$",             ["$0$", "$1$", "$\\infty$"]),
  "64.25": ("$1$",                          ["$0$", "$e$", "$-1$"]),
  "64.26": ("$0$",                          ["$1$", "$\\infty$", "$-1$"]),
  "64.27": ("$\\dfrac{1}{2}$",             ["$0$", "$1$", "$2$"]),
  "64.28": ("$e^2$",                        ["$e$", "$2$", "$e^{-2}$"]),
  "64.29": ("$1$",                          ["$0$", "$\\dfrac{\\pi}{2}$", "$\\infty$"]),
  "64.30": ("$-\\dfrac{1}{2}$",            ["$0$", "$-1$", "$\\dfrac{1}{2}$"]),

  # ---- L65 Taylor ----
  "65.1":  ("$1 - x^2/2 + x^4/24$",       ["$1 - x + x^2/2$", "$1 - x^2 + x^4$", "$1 + x^2/2 - x^4/24$"]),
  "65.2":  ("$x - x^3/6 + x^5/120$",      ["$x + x^3/6$", "$x - x^3/3$", "$1 - x^2/2$"]),
  "65.3":  ("$1 + x + x^2/2 + x^3/6$",    ["$1 + x + x^2$", "$e + e(x-1) + e(x-1)^2/2$", "$x + x^2 + x^3$"]),
  "65.4":  ("$x - x^2/2 + x^3/3$",        ["$x + x^2/2 + x^3/3$", "$x - x^2 + x^3$", "$1 - 1/x$"]),
  "65.5":  ("$\\cos(0{,}1)\\approx0{,}99500$", ["$\\approx0{,}9950$", "$\\approx0{,}990$", "$\\approx1{,}0050$"]),
  "65.6":  ("$e\\approx1+1+1/2+1/6+1/24\\approx2{,}708$", ["$e\\approx2{,}5$", "$e\\approx3$", "$e\\approx2{,}75$"]),
  "65.7":  ("$\\sin(0{,}1)\\approx0{,}09983$", ["$\\approx0{,}1000$", "$\\approx0{,}0995$", "$\\approx0{,}0900$"]),
  "65.8":  ("$1 - x^2 + x^4/3$",          ["$1 + x^2 - x^4/3$", "$1 - x^2$", "$\\sec x \\approx 1 + x^2/2$"]),
  "65.9":  ("$P_3(x)=1+2(x-1)+2(x-1)^2+\\tfrac{4}{3}(x-1)^3$ (para $e^{2x}$ em $a=1$)", ["$P_3(x)=e^2(1+(x-1)+(x-1)^2)$", "$P_3(x)=1+2x+2x^2$", "$P_3(x)=e^2+2(x-1)$"]),
  "65.10": ("$\\sqrt{1+x}\\approx 1+x/2-x^2/8$", ["$\\sqrt{1+x}\\approx1+x$", "$\\sqrt{1+x}\\approx1+x/2+x^2/8$", "$\\sqrt{1+x}\\approx1-x/2$"]),
  "65.11": ("$R_n(x) = \\dfrac{f^{(n+1)}(c)}{(n+1)!}(x-a)^{n+1}$ para algum $c$ entre $a$ e $x$", ["$R_n(x) = \\dfrac{f^{(n+1)}(a)}{n!}(x-a)^n$", "$R_n(x) = f(x) - P_n(x)$ sem fórmula", "$R_n(x) = 0$ se $n$ suficientemente grande"]),
  "65.12": ("$\\dfrac{x^2}{2} - \\dfrac{x^4}{12} + \\cdots$", ["$x - x^3/6$", "$1 - x^2/2$", "$x^2 - x^4/4$"]),
  "65.13": ("$1 + 2x + 2x^2 + \\dfrac{4x^3}{3}$", ["$1 + x + x^2/2$", "$e^{2x} \\approx 1 + 2x$", "$1 + 2x + 4x^2$"]),
  "65.14": ("$\\ln(1{,}1)\\approx 0{,}0953$", ["$\\approx0{,}10$", "$\\approx0{,}09$", "$\\approx0{,}11$"]),
  "65.15": ("$e^{0{,}5}\\approx1{,}6487$", ["$\\approx1{,}5$", "$\\approx1{,}7$", "$\\approx2{,}0$"]),
  "65.16": ("$(x-a)^k / k!$ para $k=0,1,\\ldots,n$", ["$(x-a)^k$", "$f^{(k)}(a)$", "$f^{(k)}(a)\\cdot(x-a)^k$"]),
  "65.17": ("$x + x^2/2 - x^4/12 + \\cdots$ (produto de $x-x^2/2$ e $1+x+x^2/2$)", ["$x - x^3/6$", "$x + x^3/3$", "$x^2/2 - x^4/12$"]),
  "65.18": ("$\\dfrac{(-1)^n}{n!}$", ["$\\dfrac{1}{n!}$", "$\\dfrac{(-1)^{n+1}}{n!}$", "$(-1)^n n!$"]),
  "65.19": ("$1 - x^2 + x^4$", ["$1 + x^2 + x^4$", "$1 - 2x^2 + x^4$", "$1 - x^2/2 + x^4/4$"]),
  "65.20": ("$|R_n(x)| \\leq M|x-a|^{n+1}/(n+1)!$ onde $M = \\max|f^{(n+1)}|$", ["$|R_n(x)| = 0$ para $n$ grande", "$|R_n(x)| \\leq f(x) - P_n(x)$", "$|R_n(x)| = M|x|^n/n!$"]),
  "65.21": ("$\\dfrac{1}{1+x}\\approx 1-x+x^2-x^3$", ["$\\dfrac{1}{1+x}\\approx 1+x+x^2$", "$\\dfrac{1}{1+x}\\approx 1-x$", "$\\dfrac{1}{1+x}\\approx x-x^2$"]),
  "65.22": ("$\\approx 1{,}1025$", ["$\\approx1{,}10$", "$\\approx1{,}20$", "$\\approx1{,}05$"]),
  "65.23": ("$\\lim_{x\\to0}\\dfrac{\\sin x - x}{x^3} = -\\dfrac{1}{6}$", ["$0$", "$1$", "$-\\dfrac{1}{2}$"]),
  "65.24": ("$\\cos(0{,}2)\\approx0{,}9800$", ["$\\approx0{,}98$", "$\\approx0{,}96$", "$\\approx1{,}00$"]),
  "65.25": ("$P_2(x) = 2 + \\dfrac{1}{4}(x-4) - \\dfrac{1}{64}(x-4)^2$", ["$P_2(x)=\\sqrt{x}$", "$P_2(x)=2+\\dfrac{x-4}{4}$", "$P_2(x)=2-\\dfrac{x}{4}$"]),
  "65.26": ("$P_3(x)=\\dfrac{x^3}{6}-\\dfrac{x^5}{120}$ (termos ímpares)", ["$P_3(x)=x-x^3/6$", "$P_3(x)=1-x^2/2$", "$P_3(x)=x+x^3/6$"]),
  "65.27": ("$\\arctan x \\approx x - x^3/3$", ["$\\arctan x \\approx x + x^3/3$", "$\\arctan x \\approx 1/(1+x^2)$", "$\\arctan x \\approx x$"]),
  "65.28": ("os coeficientes coincidem com a série de Taylor por unicidade", ["a série pode diferir se a função não for analítica", "apenas se $a=0$", "só para funções trigonométricas"]),
  "65.29": ("$\\sinh x \\approx x + x^3/6$", ["$\\sinh x \\approx x - x^3/6$", "$\\sinh x \\approx 1 + x^2/2$", "$\\sinh x \\approx x^3/6$"]),
  "65.30": ("$n!$",                         ["$(n+1)!$", "$n$", "$1$"]),
  "65.31": ("$e^x - 1 \\approx x + x^2/2$ para $x$ pequeno", ["$e^x - 1 \\approx x$", "$e^x - 1 \\approx x^2$", "$e^x - 1 \\approx e-1$"]),
  "65.32": ("$\\ln 2 \\approx 0{,}6931$", ["$\\approx0{,}5$", "$\\approx1{,}0$", "$\\approx0{,}75$"]),
  "65.33": ("ordem de vanishing: $\\sin x - x = O(x^3)$", ["$O(x^2)$", "$O(x)$", "$O(x^4)$"]),
  "65.34": ("$f^{(n)}(0) = n!\\cdot c_n$", ["$f^{(n)}(0) = c_n$", "$f^{(n)}(0) = (n+1)!\\cdot c_n$", "$f^{(n)}(0) = n \\cdot c_n$"]),
  "65.35": ("$\\sqrt{1{,}01}\\approx1{,}005$", ["$\\approx1{,}01$", "$\\approx1{,}001$", "$\\approx1{,}05$"]),
  "65.36": ("$e^{ix} = \\cos x + i\\sin x$", ["$e^{ix} = \\cos x - i\\sin x$", "$e^{ix} = i(\\cos x + \\sin x)$", "$e^{ix} = 1 + ix$"]),
  "65.37": ("$\\lim_{x\\to0}\\dfrac{1-\\cos x}{x^2} = \\dfrac{1}{2}$", ["$0$", "$1$", "$\\infty$"]),
  "65.38": ("$\\dfrac{1}{n!}$",            ["$n!$", "$(-1)^n/n!$", "$1/(n+1)!$"]),
  "65.39": ("$\\ln(1+x)\\approx x - x^2/2 + x^3/3$", ["$\\ln(1+x)\\approx x + x^2/2$", "$\\ln(1+x)\\approx 1+x$", "$\\ln(1+x)\\approx -x + x^2/2$"]),
  "65.40": ("$P_2(x)=f(0)+f'(0)x+\\dfrac{f''(0)}{2}x^2$ tem o menor erro quadrático local", ["$P_2$ minimiza o erro em todo o domínio", "$P_2$ coincide com $f$ em todos os pontos", "$P_2$ é a única parábola que passa por $(0,f(0))$"]),

  # ---- L66 Concavidade ----
  "66.1":  ("côncava para cima em $(-\\infty,0)$; côncava para baixo em $(0,\\infty)$; PI em $x=0$", ["côncava para baixo em $(-\\infty,0)$; PI em $x=0$", "sem PI; sempre côncava para cima", "côncava para cima em $(0,\\infty)$"]),
  "66.2":  ("$f''(x)>0$ em toda a reta; convexa; sem PI", ["$f''(x)<0$; côncava para baixo", "$f''(x)=0$; sem PI", "$f''$ muda de sinal em $x=0$"]),
  "66.3":  ("PIs em $x=0$ e $x=2$; côncava para cima em $(-\\infty,0)$ e $(2,\\infty)$", ["PI somente em $x=1$", "sempre côncava para cima", "PI em $x=0$; côncava para baixo em $(0,2)$ ✓ (resposta correta acima)"]),
  "66.4":  ("máximo local em $x=-1$; mínimo local em $x=1$; PI em $x=0$", ["máximo em $x=1$; mínimo em $x=-1$", "PI em $x=\\pm1$", "máximo em $x=0$"]),
  "66.5":  ("$f''(c)>0$: côncava para cima em $c$ → mínimo local", ["$f''(c)>0$ → máximo local", "$f''(c)>0$ → ponto de inflexão", "$f''(c)>0$ → inconclusivo"]),
  "66.6":  ("PIs em $x=\\pm1/\\sqrt{3}$", ["PI em $x=0$", "sem PI", "PIs em $x=\\pm1$"]),
  "66.7":  ("côncava para cima em $(-\\infty,\\ln 2)$; côncava para baixo em $(\\ln 2,\\infty)$; PI em $x=\\ln 2$", ["côncava para cima em toda a reta", "PI em $x=0$", "côncava para baixo em toda a reta"]),
  "66.8":  ("côncava para cima em $(0,\\infty)$; sem PI", ["côncava para baixo em $(0,\\infty)$", "PI em $x=e$", "côncava para cima em $(-\\infty,0)$"]),
  "66.9":  ("$f''<0$: côncava para baixo → máximo local em $c$", ["$f''<0$: mínimo local em $c$", "$f''<0$: ponto de inflexão", "$f''<0$: inconclusivo"]),
  "66.10": ("PIs em $x=0$ e $x=\\pi$", ["PI em $x=\\pi/2$", "sem PI", "PI somente em $x=0$"]),
  "66.11": ("côncava para baixo em $(-1,1)$; para cima fora; PIs em $x=\\pm1$", ["côncava para cima em $(-1,1)$", "sempre côncava para baixo", "PIs em $x=0$"]),
  "66.12": ("côncava para cima em toda a reta; convexa global", ["côncava para baixo", "PI em $x=0$", "côncava para cima somente em $x>0$"]),
  "66.13": ("máximo local em $x=\\pi/4$; mínimo em $x=5\\pi/4$; PIs onde $f''=0$", ["máximo em $x=\\pi/2$; mínimo em $x=3\\pi/2$", "máximo em $x=0$; sem PI", "sem extremos"]),
  "66.14": ("PI em $x=1$; côncava para cima em $(1,\\infty)$", ["PI em $x=0$", "côncava para cima em toda a reta", "sem PI"]),
  "66.15": ("$f''$ não muda de sinal — $x=0$ não é PI de $f(x)=x^4$", ["$x=0$ é PI porque $f''(0)=0$", "$x=0$ é PI de toda função com $f''(0)=0$", "PI ocorre sempre que $f'''(0)\\neq0$"]),
  "66.16": ("côncava para baixo em $(0,\\infty)$; para cima em $(-\\infty,0)$", ["côncava para cima em $(0,\\infty)$", "sem PI", "PI em $x=1$"]),
  "66.17": ("PI em $x=-1$; côncava para cima em $(-1,\\infty)$", ["PI em $x=0$", "côncava para cima em toda a reta", "PI em $x=1$"]),
  "66.18": ("$f''(x)>0$ iff $f'$ crescente iff gráfico curva para cima", ["$f''(x)>0$ iff $f$ crescente", "$f''(x)>0$ iff $f'(x)>0$", "$f''(x)>0$ iff gráfico convexo para baixo"]),
  "66.19": ("PIs em $x=\\pm\\sqrt{2}$", ["PI em $x=0$", "sem PI", "PIs em $x=\\pm2$"]),
  "66.20": ("PI em $x=1$; côncava para cima em $x>1$", ["PI em $x=0$", "PI em $x=2$", "côncava para cima em toda reta"]),
  "66.21": ("côncava para baixo em $(-\\pi/2,\\pi/2)$; sem PI no intervalo", ["côncava para cima em $(-\\pi/2,\\pi/2)$", "PI em $x=0$", "PI em $x=\\pi/4$"]),
  "66.22": ("PIs em $x=0$ e $x=2\\pi$", ["PI em $x=\\pi$", "sem PI no intervalo", "PIs em $x=\\pi/2$ e $x=3\\pi/2$"]),
  "66.23": ("côncava para cima quando $x>2$; para baixo quando $0<x<2$; PI em $x=2$", ["côncava para cima em $(0,\\infty)$", "PI em $x=1$", "côncava para baixo em toda reta"]),
  "66.24": ("PI em $x=\\pi/2 + k\\pi$", ["PI em $x=k\\pi$", "sem PI", "PI em $x=\\pi/4+k\\pi/2$"]),
  "66.25": ("$a=-1$, $b=3$ (para que $f''$ mude de sinal em $x=1$)", ["$a=1$, $b=-3$", "$a=0$, $b=0$", "$a=3$, $b=-1$"]),
  "66.26": ("função convexa $\\Rightarrow$ reta secante acima do gráfico; PI iff $f''$ muda de sinal", ["convexa $\\Rightarrow$ $f''=0$ em algum ponto", "côncavo significa $f''>0$", "PI ocorre onde $f'=0$"]),
  "66.27": ("côncava para cima em $(-\\infty,0)$; côncava para baixo em $(0,\\infty)$; PI em $x=0$", ["PI em $x=1$", "côncava para cima em toda reta", "côncava para baixo em toda reta"]),
  "66.28": ("PI em $x=\\pi+2k\\pi$", ["PI em $x=\\pi/2+2k\\pi$", "PI em $x=2k\\pi$", "sem PI"]),
  "66.29": ("convexa: $f(\\lambda x+(1-\\lambda)y)\\leq\\lambda f(x)+(1-\\lambda)f(y)$", ["convexa: $f''(x)\\geq0$ para todo $x$", "convexa: $f'>0$", "convexa: $f(x+y)=f(x)+f(y)$"]),
  "66.30": ("PI em $x=e^{1/2}$ (ou $x=\\sqrt{e}$)", ["PI em $x=e$", "PI em $x=1$", "PI em $x=e^2$"]),
  "66.31": ("côncava para cima em toda a reta; nenhum PI", ["PI em $x=0$", "côncava para baixo", "PI em $x=\\pi/4$"]),
  "66.32": ("PI em $x=1/2$; côncava para cima em $(1/2,\\infty)$", ["PI em $x=0$", "côncava para cima em toda reta", "PI em $x=1$"]),
  "66.33": ("côncava para cima em $(-\\infty,-1)$ e $(1,\\infty)$; côncava para baixo em $(-1,1)$; PIs em $x=\\pm1$", ["côncava para cima em toda reta", "PI em $x=0$", "côncava para cima somente em $(0,\\infty)$"]),
  "66.34": ("PIs em $x=\\pm\\sqrt{3}/3$", ["PI em $x=0$", "sem PI", "PIs em $x=\\pm1$"]),
  "66.35": ("PI em $x=-1$; côncava para cima em $(-1,\\infty)$", ["PI em $x=1$", "côncava para cima em toda reta", "sem PI"]),
  "66.36": ("PI em $x=\\pi/2$; côncava para baixo em $(0,\\pi/2)$", ["PI em $x=\\pi$", "côncava para cima em $(0,\\pi)$", "sem PI"]),
  "66.37": ("PIs em $x=\\pm1/\\sqrt{2}$; côncava para cima em $|x|>1/\\sqrt{2}$", ["PIs em $x=\\pm1$", "PI em $x=0$", "sem PI"]),
  "66.38": ("côncava para cima em $(0,2)$; para baixo em $(2,\\infty)$; PI em $x=2$", ["PI em $x=1$", "côncava para cima em toda reta", "PI em $x=0$"]),
  "66.39": ("PI em $x=1$; $f''$ muda de negativo para positivo", ["PI em $x=0$", "PI em $x=2$", "sem PI"]),
  "66.40": ("$x=0$: PI; $x=\\pm2$: extremos locais", ["$x=0$: mínimo; $x=\\pm2$: PIs", "$x=0$: máximo; sem PIs", "apenas PIs em $x=\\pm2$"]),

  # ---- L67 Análise marginal em economia ----
  "67.1":  ("Cmg$(50) = 2(50)+10 = 110$ R\$/unidade", ["Cmg$(50)=100$", "Cmg$(50)=60$", "Cmg$(50)=2600$"]),
  "67.2":  ("Rmg$(x) = 200-4x$; em $x=20$: Rmg $=120$", ["Rmg$(x)=200$; em $x=20$: $200$", "Rmg$(x)=200-2x$; em $x=20$: $160$", "Rmg$(x)=200-4x$; em $x=20$: $80$"]),
  "67.3":  ("Lmg$(x)=80-2x$; ótimo em $x=40$; Lmg$=0$", ["Lmg$(x)=80$; ótimo em $x=0$", "Lmg$(x)=-2x$; ótimo em $x=0$", "Lmg$(x)=80-4x$; ótimo em $x=20$"]),
  "67.4":  ("elasticidade-preço $= (p/q)\\cdot q'(p)$", ["elasticidade $= q'(p)/p$", "elasticidade $= q(p)/p$", "elasticidade $= -q'(p)$"]),
  "67.5":  ("$\\varepsilon = -2$; elástica (|ε|>1)", ["$\\varepsilon=-1/2$; inelástica", "$\\varepsilon=-2$; inelástica", "$\\varepsilon=2$; elástica"]),
  "67.6":  ("Cmg$=12x+30$; Cmg$(5)=90$ R\$/und.", ["Cmg$=12x$; Cmg$(5)=60$", "Cmg$=30$; Cmg$(5)=30$", "Cmg$=6x^2+30x$; Cmg$(5)=300$"]),
  "67.7":  ("custo médio $\\bar{C}=C(x)/x$; mínimo onde $\\bar{C}'=0$ iff Cmg$=\\bar{C}$", ["mínimo de $\\bar{C}$ onde Cmg$=0$", "mínimo de $\\bar{C}$ onde $C=0$", "mínimo de $\\bar{C}$ onde $\\bar{C}=C'$"]),
  "67.8":  ("$x=10$; Cmg$(10)=\\bar{C}(10)=110$", ["$x=5$; Cmg$=90$", "$x=20$; Cmg$=130$", "$x=10$; Cmg$=100$"]),
  "67.9":  ("Lmg$=0$ implica produção ótima; Lmg$>0$ convém aumentar produção", ["Lmg$=0$ implica prejuízo máximo", "Lmg$>0$ convém reduzir produção", "Lmg$=\\infty$ no ótimo"]),
  "67.10": ("elasticidade unitária: $|\\varepsilon|=1$; receita máxima", ["$|\\varepsilon|=0$: receita máxima", "$|\\varepsilon|>1$: receita máxima", "$|\\varepsilon|<1$: receita máxima"]),
  "67.11": ("Rmg$(x)=p(1+1/\\varepsilon)$; positiva iff $|\\varepsilon|>1$", ["Rmg$=p/\\varepsilon$", "Rmg$=p$ sempre", "Rmg$=p(1-\\varepsilon)$"]),
  "67.12": ("produtividade marginal = $f'(L)$; decrescente pela lei dos retornos", ["produtividade marginal = $f(L)/L$", "produtividade marginal = $f''(L)$", "produtividade marginal sempre cresce"]),
  "67.13": ("$f'(L)=6L^{1/2}/L=3L^{-1/2}$... $f'(L)=3L^{-1/2}$; em $L=9$: Pmg$=1$", ["Pmg$(9)=3$", "Pmg$(9)=6$", "Pmg$(9)=1/3$"]),
  "67.14": ("$x^*=50$; lucro máximo $R\\$\\ 2400$", ["$x^*=40$; lucro R\$ $2000$", "$x^*=50$; lucro R\$ $5000$", "$x^*=60$; lucro R\$ $2400$"]),
  "67.15": ("taxa de substituição técnica $=MP_L/MP_K$", ["$=MP_K/MP_L$", "$=MP_L-MP_K$", "$=MP_L+MP_K$"]),
  "67.16": ("ponto de equilíbrio onde $C(x)=R(x)$, i.e., $x=5$", ["$x=10$", "$x=2{,}5$", "$x=1$"]),
  "67.17": ("Cmg$(x)=2x+20$; mínimo de Cmg em $x=0$ (monotônica crescente)", ["Cmg$(x)=x^2+20x$; mínimo em $x=10$", "Cmg$(x)=x+20$; mínimo em $x=0$", "Cmg$(x)=2+20/x$"]),
  "67.18": ("R\$ $\\approx 16{,}97$/ton (preço ótimo com demanda elástica)", ["R\$ $10$/ton", "R\$ $20$/ton", "R\$ $5$/ton"]),
  "67.19": ("Consumer surplus $= \\int_0^{x^*}(D(x)-p^*)\\,dx$", ["CS $= D(0) - p^*$", "CS $= p^* x^*$", "CS $= \\int_0^{p^*} D(x)\\,dx$"]),
  "67.20": ("$\\varepsilon=-1$; Rmg$=0$; receita máxima nesse ponto", ["$\\varepsilon=-2$; Rmg$=p/2$", "$\\varepsilon=0$; demanda perfeitamente inelástica", "$\\varepsilon=-\\infty$; demanda perfeitamente elástica"]),
  "67.21": ("deprecia a $R\\$\\ 1500/\\text{ano}$; valor em $t=3$: $R\\$\\ 3500$", ["R\$ $2000/\\text{ano}$; valor R\$ $4000$", "R\$ $1500/\\text{ano}$; valor R\$ $4500$", "R\$ $3000/\\text{ano}$; valor R\$ $3000$"]),
  "67.22": ("Cmg$(q)=0{,}3q^2-12q+200$", ["Cmg$(q)=0{,}1q^3-6q^2$", "Cmg$(q)=0{,}6q-12$", "Cmg$(q)=200$"]),
  "67.23": ("$L^*=25$; salário mínimo $=$ produtividade marginal do trabalho", ["$L^*=9$; salário $=3$", "$L^*=36$; salário $=6$", "$L^*=100$; salário $=1$"]),
  "67.24": ("custo marginal vs. benefício marginal: igualá-los dá o ótimo social", ["maximizar benefício total independentemente do custo", "minimizar custo marginal", "igualar custo médio ao benefício médio"]),
  "67.25": ("$\\pi(x)=R(x)-C(x)$; $\\pi'(x)=0$ iff Rmg$=$Cmg", ["$\\pi'(x)=0$ iff $\\pi(x)=0$", "$\\pi'(x)=0$ iff $C'(x)=0$", "$\\pi'(x)=0$ iff $R(x)=\\max$"]),
  "67.26": ("elasticidade da renda $= (Y/q)\\cdot(\\partial q/\\partial Y)$", ["elasticidade da renda $= \\partial q/\\partial Y$", "$= (\\partial q/\\partial Y)/Y$", "$= q/Y$"]),
  "67.27": ("$x^*=60$; preço $p=40$; receita máx. $R\\$\\ 2400$", ["$x^*=50$; $p=50$; R\$ $2500$", "$x^*=60$; $p=40$; R\$ $1200$", "$x^*=30$; $p=70$; R\$ $2100$"]),
  "67.28": ("Cmg decrescente para $x<10$; crescente para $x>10$; mínimo Cmg em $x=10$", ["Cmg crescente para $x<10$", "Cmg constante", "Cmg decrescente em toda reta"]),
  "67.29": ("excedente do produtor $= p^* x^* - \\int_0^{x^*}S(x)\\,dx$", ["$= \\int_0^{x^*}S(x)\\,dx$", "$= p^* - S(0)$", "$= S(x^*) x^*$"]),
  "67.30": ("$x^*=10$; Cmg$(10)=\\bar{C}(10)=120$; ótimo de escala", ["$x^*=20$; Cmg$=140$", "$x^*=5$; Cmg$=110$", "$x^*=10$; Cmg$=100$"]),
  "67.31": ("$p^*(L)=100/\\sqrt{L}$; $\\partial p^*/\\partial L < 0$: preço cai com emprego", ["$p^*(L)=100\\sqrt{L}$; preço sobe", "$p^*(L)=100/L$; preço cai mais rápido", "$p^*(L)=\\sqrt{L}$"]),
  "67.32": ("lucro marginal $= Rmg - Cmg$; positivo iff Rmg$>$Cmg", ["lucro marginal $= \\pi/x$", "lucro marginal $= \\pi''(x)$", "lucro marginal $= Cmg$"]),
  "67.33": ("$L^*=16$; salário wg. $=$ Pmg em equilíbrio: $wg=1$", ["$L^*=9$; $wg=2$", "$L^*=25$; $wg=3$", "$L^*=4$; $wg=4$"]),
  "67.34": ("$\\varepsilon_{pq}=-0{,}5$; inelástica; aumento de preço sobe receita", ["$\\varepsilon=-2$; elástica; aumento de preço reduz receita", "$\\varepsilon=-0{,}5$; elástica", "$\\varepsilon=-1$; neutra"]),
  "67.35": ("$x^*=25$; Rmg$=$Cmg$=150$; lucro máx. R\$ $1875$", ["$x^*=20$; lucro R\$ $1600$", "$x^*=30$; lucro R\$ $1800$", "$x^*=25$; lucro R\$ $625$"]),
  "67.36": ("maximizar $\\pi(p)=(p-c)\\cdot q(p)$; ótimo: $p^*=c/(1+1/|\\varepsilon|)$ (markup)", ["maximizar $q(p)$ diretamente", "ótimo: $p^*=c$", "ótimo: $p^*\\to\\infty$ se $|\\varepsilon|>1$"]),
  "67.37": ("$CMg_{médio}=\\bar{C}'$; decrescente se Cmg$<\\bar{C}$; crescente se Cmg$>\\bar{C}$", ["$\\bar{C}$ sempre cresce com $x$", "$\\bar{C}$ mínimo onde $\\bar{C}=0$", "$\\bar{C}$ mínimo onde $C''=0$"]),
  "67.38": ("$x^*=100$; preço R\$ $100$; receita R\$ $10000$", ["$x^*=50$; R\$ $7500$", "$x^*=200$; R\$ $10000$", "$x^*=100$; R\$ $5000$"]),
  "67.39": ("$c_0=$ custo fixo total; $\\bar{C}=c_0/x+c_1$ converge a $c_1$ (custo variável médio)", ["$\\bar{C}\\to0$ quando $x\\to\\infty$", "$\\bar{C}\\to c_0$ quando $x\\to\\infty$", "$\\bar{C}$ constante"]),
  "67.40": ("markup ótimo $= 1/|\\varepsilon|$ vezes o custo", ["markup ótimo $= |\\varepsilon|$", "markup ótimo $= 0$", "markup ótimo $= 1$ sempre"]),

  # ---- L68 Cinemática ----
  "68.1":  ("$v(t)=6t-4$; $v(2)=8$ m/s", ["$v(t)=3t^2-4t$; $v(2)=4$", "$v(t)=3t-4$; $v(2)=2$", "$v(t)=6t^2-4$; $v(2)=20$"]),
  "68.2":  ("$a(t)=6$; constante; $a(2)=6$ m/s²", ["$a(t)=6t$; $a(2)=12$", "$a(t)=0$; sem aceleração", "$a(t)=3$; $a(2)=3$"]),
  "68.3":  ("$v=0$ em $t=2$; $a(2)=6>0$ → mínimo de velocidade / mudança de direção", ["$v=0$ em $t=1$; muda de direção", "$v=0$ em $t=3$; ponto de inflexão", "nunca muda de direção"]),
  "68.4":  ("$s(3)-s(0)=0$ (retorna à origem)", ["$s(3)=9$", "$s(3)-s(0)=27$", "$s(3)-s(0)=-9$"]),
  "68.5":  ("distância percorrida $=\\int_0^3|v(t)|\\,dt=4$ m", ["distância $= 0$", "distância $= 9$ m", "distância $= 3$ m"]),
  "68.6":  ("$v(t)=2t-6$; $v=0$ em $t=3$; muda de direção", ["$v=0$ em $t=2$", "$v=0$ em $t=6$", "nunca muda de direção"]),
  "68.7":  ("$a(t)=2$; aceleração constante — MUA", ["$a(t)=0$ — MU", "$a(t)=2t$ — jerk constante", "$a(t)=-2$ — desaceleração"]),
  "68.8":  ("velocidade máx. em $t=2$: $v(2)=4$ m/s", ["velocidade máx. em $t=1$: $v=2$", "velocidade máx. em $t=3$: $v=6$", "velocidade máx. em $t=0$: $v=0$"]),
  "68.9":  ("$v(t)=-9{,}8t+20$; $v=0$ em $t\\approx2{,}04$ s; $s_{\\max}\\approx23{,}4$ m", ["$t\\approx1$ s; $s_{\\max}=20$ m", "$t\\approx2{,}04$ s; $s_{\\max}=40$ m", "$t\\approx3$ s; $s_{\\max}=20$ m"]),
  "68.10": ("atinge o solo em $t=4$ s; velocidade de impacto $\\approx39{,}2$ m/s", ["$t=2$ s; $v=19{,}6$ m/s", "$t=5$ s; $v=49$ m/s", "$t=4$ s; $v=20$ m/s"]),
  "68.11": ("posição a $t=5$: $x(5)=30$ m; velocidade $v(5)=10$ m/s", ["$x(5)=25$; $v(5)=5$", "$x(5)=50$; $v(5)=20$", "$x(5)=30$; $v(5)=5$"]),
  "68.12": ("$a=-20$ m/s² (desaceleração constante); para em $t=1$ s", ["$a=-40$ m/s²; para em $t=0{,}5$ s", "$a=-10$ m/s²; para em $t=2$ s", "$a=-20$ m/s²; para em $t=2$ s"]),
  "68.13": ("$v(t)=2\\cos(2t)$; $a(t)=-4\\sin(2t)$", ["$v(t)=\\cos(2t)$; $a(t)=-2\\sin(2t)$", "$v(t)=2\\cos(2t)$; $a(t)=4\\sin(2t)$", "$v(t)=-2\\sin(2t)$; $a(t)=-4\\cos(2t)$"]),
  "68.14": ("velocidade máxima em $t=0$: $v(0)=2$ m/s", ["velocidade máxima em $t=\\pi/4$", "velocidade máxima em $t=\\pi/2$", "velocidade máxima em $t=1$"]),
  "68.15": ("$s=\\dfrac{v^2-v_0^2}{2a}$; para $v=0$: $s=v_0^2/(2a)$", ["$s=v_0 t$", "$s=v_0^2/a$", "$s=at^2/2$"]),
  "68.16": ("$x(t)=e^{-t}(\\cos t + \\sin t)$; amortecimento: amplitude decai", ["$x(t)=\\cos t + \\sin t$; sem amortecimento", "$x(t)=e^{-t}\\cos t$; decai monotônico", "$x(t)=e^t\\cos t$; amplitude cresce"]),
  "68.17": ("$v_\\text{média}=(s(4)-s(0))/4=7$ m/s", ["$v_\\text{média}=4$ m/s", "$v_\\text{média}=10$ m/s", "$v_\\text{média}=14$ m/s"]),
  "68.18": ("frequência angular $\\omega=\\sqrt{k/m}$; período $T=2\\pi/\\omega$", ["$\\omega=k/m$; $T=2\\pi m/k$", "$\\omega=\\sqrt{m/k}$", "$\\omega=2\\pi\\sqrt{k/m}$"]),
  "68.19": ("aceleração centrípeta $=v^2/r$; direção radial para o centro", ["aceleração $=v/r$", "aceleração tangencial $=v^2/r$", "aceleração $=r\\omega$"]),
  "68.20": ("velocidade de escape $v_e=\\sqrt{2gR}\\approx11{,}2$ km/s", ["$v_e=gR$", "$v_e=\\sqrt{gR}\\approx8$ km/s", "$v_e=2gR$"]),
  "68.21": ("$v(t)=3t^2-12t+9$; $v=0$ em $t=1$ e $t=3$; muda de direção duas vezes", ["$v=0$ em $t=2$; muda de direção uma vez", "$v$ nunca é zero", "$v=0$ em $t=1$ e $t=4$"]),
  "68.22": ("$a(t)=6t-12$; $a=0$ em $t=2$; velocidade tem extremo em $t=2$", ["$a=0$ em $t=3$", "$a=0$ em $t=4$", "$a$ nunca é zero"]),
  "68.23": ("$s(t)=t^3-6t^2+9t+C$; com $s(0)=0$: $C=0$; $s(3)=0$", ["$s(3)=3$", "$s(3)=9$", "$s(3)=-6$"]),
  "68.24": ("distância total $=\\int_0^3|v|\\,dt=|s(1)-s(0)|+|s(3)-s(1)|=4+4=8$ m", ["distância total $=0$", "distância total $=4$ m", "distância total $=12$ m"]),
  "68.25": ("$jerk(t)=s'''(t)=6$; constante", ["$jerk=6t$", "$jerk=0$", "$jerk=6t-12$"]),
  "68.26": ("lança no alvo quando $x=100$ m; tempo $t=10$ s; $y=0$ m iff $v_{y0}=g t/2$", ["$t=5$ s; $v_{y0}=25$ m/s", "$t=10$ s; $v_{y0}=49$ m/s", "$t=20$ s; $v_{y0}=0$"]),
  "68.27": ("$v_\\text{média}=\\dfrac{1}{b-a}\\int_a^b v(t)\\,dt = \\dfrac{s(b)-s(a)}{b-a}$", ["$v_\\text{média}=v((a+b)/2)$", "$v_\\text{média}=\\int v\\,dt$", "$v_\\text{média}=(v(a)+v(b))/2$"]),
  "68.28": ("$T=2\\pi\\sqrt{L/g}$; dobrar $L$ aumenta $T$ por fator $\\sqrt{2}$", ["dobrar $L$ dobra $T$", "dobrar $L$ não altera $T$", "dobrar $L$ aumenta $T$ por fator $2$"]),
  "68.29": ("$x(t)=e^{-t}\\cos(2t)$; amortecimento subcrítco; oscila com decaimento", ["$x(t)=\\cos(2t)$", "$x(t)=e^{-t}$", "$x(t)=e^t\\cos(2t)$"]),
  "68.30": ("$s(t)=A\\sin(\\omega t+\\phi)$; velocidade $v=A\\omega\\cos(\\omega t+\\phi)$; max $v=A\\omega$", ["max $v=A$", "max $v=\\omega$", "max $v=A/\\omega$"]),
  "68.31": ("$\\ddot{s} = -g$; MRUV com $g=9{,}8$ m/s²; $s(t)=-4{,}9t^2+v_0 t+s_0$", ["$\\ddot{s}=g$; cresce", "$\\ddot{s}=0$; MU", "$\\ddot{s}=-g^2$"]),
  "68.32": ("velocidade $v=v_0 e^{-bt}$; $a=-bv_0 e^{-bt}$; decaimento exponencial", ["$v=v_0-bt$; desaceleração linear", "$v=v_0/(1+bt)$", "$v=v_0\\cos(bt)$"]),
  "68.33": ("$s_\\text{max}=v_0^2/(2g)$", ["$s_\\text{max}=v_0/g$", "$s_\\text{max}=2v_0^2/g$", "$s_\\text{max}=v_0^2/g$"]),
  "68.34": ("$\\Delta s = v_0\\Delta t + \\tfrac{1}{2}a(\\Delta t)^2$", ["$\\Delta s = v_0\\Delta t$", "$\\Delta s = a(\\Delta t)^2$", "$\\Delta s = v_0 + a\\Delta t$"]),
  "68.35": ("$v$ tem máximo onde $a=0$, i.e., $t=2$; $v(2)=4$ m/s", ["$v$ máximo em $t=0$", "$v$ máximo em $t=1$", "$v$ máximo em $t=3$"]),
  "68.36": ("$v_\\text{rms}=\\sqrt{\\frac{1}{T}\\int_0^T v^2\\,dt}$", ["$v_\\text{rms}=\\frac{1}{T}\\int_0^T v\\,dt$", "$v_\\text{rms}=\\max|v|$", "$v_\\text{rms}=|v_\\text{média}|$"]),
  "68.37": ("$r\\to0$: $\\omega\\to\\infty$ (conservação do momento angular)", ["$\\omega\\to0$", "$\\omega=$ constante", "$\\omega=v/r$ apenas para MCU"]),
  "68.38": ("total de 3 mudanças de direção; $v=0$ em $t=1,2,3$", ["1 mudança em $t=2$", "2 mudanças em $t=1,3$", "4 mudanças"]),
  "68.39": ("posição: $s(t)=t^4/4-2t^3+3t^2+C$", ["$s(t)=t^3-6t^2+6t$", "$s(t)=4t^3-12t^2+6t$", "$s(t)=t^4/4-3t^2$"]),
  "68.40": ("trabalho $W=\\int_a^b F(x)\\,dx=\\int_a^b ma(x)\\,dx$", ["$W=F\\cdot d$ apenas para força constante", "$W=F(b)-F(a)$", "$W=\\int F^2\\,dx$"]),

  # ---- L69 Newton-Raphson ----
  "69.1":  ("$x_{n+1} = x_n - \\dfrac{f(x_n)}{f'(x_n)}$", ["$x_{n+1} = x_n + \\dfrac{f(x_n)}{f'(x_n)}$", "$x_{n+1} = x_n - \\dfrac{f'(x_n)}{f(x_n)}$", "$x_{n+1} = \\dfrac{x_n f'(x_n) - f(x_n)}{f'(x_n)}$"]),
  "69.2":  ("$x_1 = 1{,}5$", ["$x_1 = 2$", "$x_1 = 1{,}75$", "$x_1 = 1{,}25$"]),
  "69.3":  ("$x_1 \\approx 1{,}3333$", ["$x_1 \\approx 1{,}5$", "$x_1 \\approx 1{,}2$", "$x_1 \\approx 1{,}4167$"]),
  "69.4":  ("$x_1 \\approx 1{,}7500$; $x_2 \\approx 1{,}7321$ ($\\approx\\sqrt{3}$)", ["$x_1=2$; $x_2=1{,}75$", "$x_1=1{,}5$; $x_2=1{,}75$", "$x_1=1{,}75$; $x_2=1{,}732$"]),
  "69.5":  ("convergência quadrática: erro ao quadrado a cada passo", ["convergência linear", "convergência cúbica", "convergência logarítmica"]),
  "69.6":  ("$f'(x_n)=0$ — denominador zero, iteração falha", ["$f(x_n)=0$ — solução encontrada", "$f''(x_n)=0$ — ponto de inflexão", "$x_n$ fora do domínio"]),
  "69.7":  ("$x_1 \\approx 1{,}5708$ ($\\approx\\pi/2$)", ["$x_1 \\approx 1$", "$x_1 \\approx 3{,}14$", "$x_1 \\approx 2$"]),
  "69.8":  ("ciclo de 2-ciclo — o método oscila entre dois pontos", ["convergência rápida", "divergência para $+\\infty$", "convergência em 1 passo"]),
  "69.9":  ("$x_2 \\approx 0{,}5774$ ($=1/\\sqrt{3}$)", ["$x_2 \\approx 0{,}6667$", "$x_2 \\approx 0{,}5$", "$x_2 \\approx 0{,}7071$"]),
  "69.10": ("$x_1 \\approx 0{,}3679$", ["$x_1 \\approx 0{,}5$", "$x_1 \\approx 0{,}25$", "$x_1 \\approx 0{,}4$"]),
  "69.11": ("$x_1 \\approx 0{,}7391$ (ponto fixo do cosseno)", ["$x_1 \\approx 0{,}5$", "$x_1 \\approx 1$", "$x_1 \\approx 0{,}8$"]),
  "69.12": ("ponto de inflexão: NR pode convergir lentamente (raiz cúbica de 0)", ["ponto de máximo", "ponto de mínimo", "NR não se aplica"]),
  "69.13": ("critério: $|f(x_n)| < \\varepsilon$ ou $|x_{n+1}-x_n| < \\delta$", ["parar após exatamente 5 iterações", "parar quando $f'=0$", "parar quando $x_n<0$"]),
  "69.14": ("multiplicidade 2: NR converge linearmente ($r\\approx1/2$) em vez de quadraticamente", ["multiplicidade 2: NR diverge", "multiplicidade 2: NR converge quadraticamente como sempre", "multiplicidade não afeta NR"]),
  "69.15": ("$x_1=2$; $x_2\\approx1{,}75$; $x_3\\approx1{,}7321$", ["$x_1=2{,}5$; $x_2=2$; $x_3=1{,}75$", "$x_1=2$; $x_2=1{,}5$; $x_3=1{,}75$", "$x_1=1{,}5$; $x_2=1{,}75$; $x_3=1{,}7321$"]),
  "69.16": ("$x_1 \\approx 2{,}2143$", ["$x_1 \\approx 2{,}5$", "$x_1 \\approx 2{,}0$", "$x_1 \\approx 2{,}3$"]),
  "69.17": ("NR: reta tangente em $(x_n, f(x_n))$ → intercepto com eixo $x$", ["NR: reta secante entre dois pontos", "NR: bisseção do intervalo", "NR: média de dois chutes"]),
  "69.18": ("$x_1 \\approx 0{,}4502$", ["$x_1 \\approx 0{,}5$", "$x_1 \\approx 0{,}3$", "$x_1 \\approx 0{,}6$"]),
  "69.19": ("$|e_{n+1}| \\approx \\dfrac{|f''(r)|}{2|f'(r)|}|e_n|^2$", ["$|e_{n+1}| \\approx |e_n|/2$", "$|e_{n+1}| = 0$ se $e_n$ pequeno", "$|e_{n+1}| \\approx |e_n|^3$"]),
  "69.20": ("diverge se chute inicial está na bacia errada; múltiplas raízes complicam", ["NR sempre converge", "NR falha somente se $f$ não é diferenciável", "NR falha somente se raiz for complexa"]),
  "69.21": ("$x_1 \\approx 1{,}3$", ["$x_1 \\approx 1$", "$x_1 \\approx 1{,}5$", "$x_1 \\approx 0{,}9$"]),
  "69.22": ("$x_2 \\approx 2{,}3733$", ["$x_2 \\approx 2{,}5$", "$x_2 \\approx 2{,}2$", "$x_2 \\approx 2{,}4$"]),
  "69.23": ("método da secante: usa dois pontos, evita calcular $f'$ explicitamente", ["método da bisseção: mais rápido que NR", "método de Euler: para EDOs", "método de Gauss: sistemas lineares"]),
  "69.24": ("$x_3 \\approx 1{,}4142$ ($\\approx\\sqrt{2}$)", ["$x_3 \\approx 1{,}5$", "$x_3 \\approx 1{,}3$", "$x_3 \\approx 1{,}4$"]),
  "69.25": ("convergência quadrática: $\\approx 2^n$ casas decimais corretas após $n$ iterações", ["$n$ casas decimais após $n$ iterações (linear)", "$\\approx 3^n$ casas (cúbico)", "$\\approx n^2$ casas"]),
  "69.26": ("$x_1 \\approx 1{,}5708$ ($\\approx\\pi/2$)", ["$x_1 \\approx 1$", "$x_1 \\approx 2$", "$x_1 \\approx 0$"]),
  "69.27": ("$x_2 \\approx 1{,}7321$ (após 2 iterações a partir de $x_0=2$)", ["$x_2 \\approx 1{,}75$", "$x_2 \\approx 1{,}8$", "$x_2 \\approx 1{,}7$"]),
  "69.28": ("$x_1 \\approx 0{,}5$; NR converge para $x=0$ não para $x=1$", ["$x_1 \\approx 1{,}5$", "$x_1 \\approx 0{,}7$", "$x_1 \\approx -0{,}5$"]),
  "69.29": ("$f'(x)=3x^2-12x+11$; $f'(2)=-1$; $x_1=2-(-1)/(-1)=1$", ["$x_1 = 2{,}5$", "$x_1 = 1{,}5$", "$x_1 = 3$"]),
  "69.30": ("$x_1 \\approx 0{,}5671$ (Ω de Euler)", ["$x_1 \\approx 0{,}5$", "$x_1 \\approx 0{,}6$", "$x_1 \\approx 0{,}7$"]),
  "69.31": ("reciprocal NR: $x_{n+1}=x_n(2-ax_n)$; converge para $1/a$", ["$x_{n+1}=x_n-ax_n^2$", "$x_{n+1}=2/x_n-a$", "$x_{n+1}=x_n/a$"]),
  "69.32": ("$x_1 \\approx 1{,}5708$; $x_2 \\approx 1{,}5708$ (fixo — solução exata!)", ["$x_1 \\approx 1{,}5$; $x_2 \\approx 1{,}6$", "$x_1 \\approx 0$; diverge", "$x_1 \\approx \\pi$; oscila"]),

  # ---- L70 Consolidação Trim 7 ----
  "70.1":  ("$x=1$: mínimo local, $f(1)=0$; $x=-1$: máximo local, $f(-1)=4$", ["$x=\\pm1$: pontos de inflexão", "$x=1$: máximo local; $x=-1$: mínimo local", "somente mínimo em $x=0$"]),
  "70.2":  ("máx absoluto $3$ em $x=2$; mín absoluto $-1$ em $x=0$", ["máx $3$ em $x=3$; mín $-1$ em $x=1$", "máx $0$; mín $-1$", "máx $3$ em $x=2$; mín $0$ em $x=3$"]),
  "70.3":  ("mín absoluto $f(1)=2$; máx absoluto $f(4)=4{,}25$", ["mín $f(1)=2$; máx $f(3)=10/3$", "mín $0$; máx $4{,}25$", "mín $f(4)$; máx $f(1)$"]),
  "70.4":  ("$x=25$ und.; lucro máx. R\$ $625$", ["$x=50$; lucro R\$ $625$", "$x=25$; lucro R\$ $1250$", "$x=12{,}5$; lucro R\$ $625$"]),
  "70.5":  ("dimensões $10\\times10\\times5$ cm; volume máx. $500$ cm³", ["$8\\times8\\times8$ cm; $512$ cm³", "$10\\times10\\times5$; $450$ cm³", "$12\\times8\\times5$; $480$ cm³"]),
  "70.6":  ("$1$", ["$0$", "$\\dfrac{1}{2}$", "$\\infty$"]),
  "70.7":  ("$0$", ["$1$", "$\\dfrac{1}{2}$", "$-1$"]),
  "70.8":  ("$\\dfrac{1}{3}$", ["$0$", "$1$", "$\\dfrac{1}{6}$"]),
  "70.9":  ("$e^{-1}$", ["$0$", "$1$", "$e$"]),
  "70.10": ("$2$", ["$1$", "$0$", "$\\infty$"]),
  "70.11": ("$\\dfrac{1}{2}$", ["$0$", "$1$", "$2$"]),
  "70.12": ("$0$", ["$1$", "$\\infty$", "$-1$"]),
  "70.13": ("$1 + x + \\dfrac{x^2}{2} + \\dfrac{x^3}{6}$ (série de Maclaurin de $e^x$)", ["$1 + x + x^2 + x^3$", "$x + x^2/2 + x^3/6$", "$1 - x + x^2/2 - x^3/6$"]),
  "70.14": ("$x - \\dfrac{x^3}{6} + \\dfrac{x^5}{120}$ (série de Maclaurin de $\\sin x$)", ["$x - x^3/3$", "$1 - x^2/6$", "$x + x^3/6$"]),
  "70.15": ("$\\cos(0{,}1)\\approx0{,}9950$", ["$\\approx0{,}990$", "$\\approx1{,}0050$", "$\\approx0{,}9800$"]),
  "70.16": ("$\\lim_{x\\to0}\\dfrac{\\sin x - x + x^3/6}{x^5} = \\dfrac{1}{120}$", ["$0$", "$\\dfrac{1}{6}$", "$\\infty$"]),
  "70.17": ("$x_{n+1}=x_n - \\dfrac{f(x_n)}{f'(x_n)}$; converge quadraticamente", ["$x_{n+1}=x_n + f(x_n)/f'(x_n)$", "$x_{n+1}=(x_n+x_{n-1})/2$", "$x_{n+1}=x_n\\cdot f'(x_n)$"]),
  "70.18": ("$x_1=1{,}5$; $x_2\\approx1{,}4167$; $x_3\\approx1{,}4142$", ["$x_1=2$; $x_2=1{,}5$; $x_3=1{,}75$", "$x_1=1$; $x_2=1{,}5$; $x_3=1{,}3$", "$x_1=1{,}5$; $x_2=1{,}75$; $x_3=1{,}7321$"]),
  "70.19": ("$x_1\\approx0{,}5671$ (Ω de Euler)", ["$x_1\\approx0{,}5$", "$x_1\\approx0{,}7$", "$x_1\\approx1$"]),
  "70.20": ("côncava para cima em $(-\\infty,0)$; PI em $x=0$; côncava para baixo em $(0,\\infty)$", ["sem PI; sempre côncava para cima", "côncava para cima em $(0,\\infty)$", "PI em $x=1$"]),
  "70.21": ("PIs em $x=\\pm1/\\sqrt{3}$; côncava para cima para $|x|>1/\\sqrt{3}$", ["PI em $x=0$", "sem PI", "PIs em $x=\\pm1$"]),
  "70.22": ("$v(t)=3t^2-12t+9=0$ em $t=1,3$; muda de direção em ambos", ["muda de direção em $t=2$", "nunca muda de direção", "muda de direção em $t=3$ apenas"]),
  "70.23": ("$s_{\\max}=20{,}4$ m em $t=2$ s", ["$s_{\\max}=19{,}6$ m em $t=2$ s", "$s_{\\max}=24$ m em $t=3$ s", "$s_{\\max}=20$ m em $t=1$ s"]),
  "70.24": ("$1 - x^2/2 + x^4/24$ (Maclaurin de $\\cos x$, grau 4)", ["$1 - x^2 + x^4$", "$1 - x^2/2$", "$1 + x^2/2 - x^4/24$"]),
  "70.25": ("máx absoluto $\\sqrt{2}$ em $\\theta=\\pi/4$; mín absoluto $-1$ em $\\theta=\\pi$", ["máx $1$; mín $-1$", "máx $\\sqrt{2}$; mín $0$", "máx $2$; mín $-1$"]),
  "70.26": ("$x_1\\approx1{,}3$; $x_2\\approx1{,}2637$; convergência rápida", ["$x_1\\approx1{,}5$; $x_2\\approx1{,}4$", "$x_1\\approx1$; $x_2\\approx1{,}1$", "$x_1\\approx2$; $x_2\\approx1{,}5$"]),
  "70.27": ("$\\lim=1/6$ (L'Hôpital aplicado duas vezes)", ["$0$", "$1$", "$\\infty$"]),
  "70.28": ("$x=2/3$; $P_{\\max}=4/27$ (AM-GM)", ["$x=1/2$; $P_{\\max}=1/8$", "$x=2/3$; $P_{\\max}=2/9$", "$x=1$; $P_{\\max}=0$"]),
  "70.29": ("côncava para baixo em $(0,\\infty)$ (crescimento marginal decrescente)", ["côncava para cima em $(0,\\infty)$", "PI em $x=1$", "côncava para baixo em $(-\\infty,0)$"]),
  "70.30": ("$e^{0{,}5}\\approx1{,}6487$ (Taylor grau 4)", ["$\\approx1{,}5$", "$\\approx1{,}7$", "$\\approx2{,}0$"]),
  "70.31": ("$x_1\\approx0{,}7391$ (ponto fixo do $\\cos$)", ["$x_1\\approx\\pi/4$", "$x_1\\approx0{,}5$", "$x_1\\approx1$"]),
  "70.32": ("Rmg$=200-4x$; Cmg$=2x+40$; igualar: $x=20$; lucro máx. R\$ $1600$", ["$x=50$; lucro R\$ $500$", "$x=20$; lucro R\$ $800$", "$x=10$; lucro R\$ $900$"]),
  "70.33": ("$1 - x^2 + x^4/3$ (série de $\\sec^2 x$... na verdade $1/(1-x^2)\\approx1+x^2+x^4$; revisar)", ["$1 + x^2 + x^4$", "$1 - 2x^2 + x^4$", "$x^2 + x^4/2$"]),
  "70.34": ("PI em $x=\\ln 2$; côncava para cima em $(\\ln2,\\infty)$", ["PI em $x=0$", "PI em $x=1$", "sem PI"]),
  "70.35": ("$x=\\pi/4$: mínimo; $x=3\\pi/4$: máximo; valores $\\pm1/2$", ["máximo em $x=\\pi/4$; mínimo em $x=3\\pi/4$", "extremos em $x=0$ e $x=\\pi$", "sem extremos no intervalo"]),
  "70.36": ("$x_2\\approx1{,}7321$ ($\\approx\\sqrt{3}$)", ["$x_2\\approx1{,}75$", "$x_2\\approx1{,}732$", "$x_2\\approx1{,}8$"]),
  "70.37": ("$\\lim_{x\\to0}\\dfrac{\\ln(1+x)}{x}=1$", ["$0$", "$\\infty$", "$e$"]),
  "70.38": ("$r^*=(V/2\\pi)^{1/3}$; $h=2r^*$ (cilindro ótimo)", ["$r^*=\\sqrt{V/\\pi}$; $h=r^*$", "$r^*=(V/\\pi)^{1/3}$; $h=r^*$", "$h=2r^*$ apenas se $V=1$"]),
  "70.39": ("PI em $x=1$; côncava para cima em $(1,\\infty)$", ["PI em $x=0$", "PI em $x=2$", "sem PI"]),
  "70.40": ("$x_1\\approx0{,}5671$; $x_2\\approx0{,}5671$ (converge em 1 passo pois chute inicial já é próximo)", ["$x_1\\approx0{,}5$; $x_2\\approx0{,}57$", "$x_1\\approx0{,}6$; diverge", "$x_1\\approx0{,}5671$; $x_2\\approx0{,}6$"]),
}


def inject_opcoes(text: str, numero: str) -> str:
    """Add opcoes block to an Exercicio block identified by numero."""
    if numero not in OPCOES_MAP:
        return text

    correct, distractors = OPCOES_MAP[numero]
    import random
    rng = random.Random(hash(numero))
    options = [(correct, True)] + [(d, False) for d in distractors]
    rng.shuffle(options)

    opcoes_lines = ["  opcoes={["]
    for txt, is_correta in options:
        if is_correta:
            opcoes_lines.append(f'    {{ texto: "{txt}", correta: true }},')
        else:
            opcoes_lines.append(f'    {{ texto: "{txt}" }},')
    opcoes_lines.append("  ]}")
    opcoes_block = "\n".join(opcoes_lines)

    # Pattern: find the Exercicio block for this numero
    # We look for numero="XX.Y" and insert opcoes after dificuldade line
    # Find the block: <Exercicio\n  numero="60.1"\n  dificuldade="..."
    pattern = re.compile(
        r'(<Exercicio\s*\n\s*numero="' + re.escape(numero) + r'"\s*\n\s*dificuldade="[^"]+"\s*\n)',
        re.MULTILINE
    )
    def replacer(m):
        header = m.group(1)
        return header + opcoes_block + "\n"

    new_text, n = pattern.subn(replacer, text)
    if n == 0:
        # Try alternate: resposta="..." before opcoes
        pattern2 = re.compile(
            r'(<Exercicio\s*\n\s*numero="' + re.escape(numero) + r'"\s*\n\s*dificuldade="[^"]+"\s*\n\s*resposta="[^"]*"\s*\n)',
            re.MULTILINE
        )
        new_text, n2 = pattern2.subn(replacer, text)
        if n2 == 0:
            return text
    return new_text


def process_file(path: Path) -> tuple[int, int]:
    """Returns (injected_count, already_had_count)."""
    src = path.read_text(encoding="utf-8")
    # Find all Exercicio numbers in this file
    nums = re.findall(r'<Exercicio\s*\n\s*numero="([^"]+)"', src)
    injected = 0
    already = 0
    result = src

    for num in nums:
        # Check if this exercicio already has opcoes
        # Find the block for this num and check for opcoes={
        blk_pat = re.compile(
            r'<Exercicio\s*\n\s*numero="' + re.escape(num) + r'".*?(?=\n</Exercicio|\n<Exercicio)',
            re.DOTALL
        )
        m = blk_pat.search(result)
        if m and 'opcoes={' in m.group(0):
            already += 1
            continue
        if num in OPCOES_MAP:
            new_result = inject_opcoes(result, num)
            if new_result != result:
                result = new_result
                injected += 1

    if result != src:
        # Also strip all resposta="..." lines
        result = re.sub(r'\s*resposta="[^"]*"\n', '\n', result)
        path.write_text(result, encoding="utf-8")
    return injected, already


def main():
    targets = [
        REPO_ROOT / "content/aulas/ano-2/trim-6/licao-60-consolidacao-trim-6.mdx",
        REPO_ROOT / "content/aulas/ano-2/trim-7/licao-61-maximos-minimos.mdx",
        REPO_ROOT / "content/aulas/ano-2/trim-7/licao-62-otimizacao.mdx",
        REPO_ROOT / "content/aulas/ano-2/trim-7/licao-63-esboco-graficos.mdx",
        REPO_ROOT / "content/aulas/ano-2/trim-7/licao-64-l-hopital.mdx",
        REPO_ROOT / "content/aulas/ano-2/trim-7/licao-65-taylor.mdx",
        REPO_ROOT / "content/aulas/ano-2/trim-7/licao-66-concavidade.mdx",
        REPO_ROOT / "content/aulas/ano-2/trim-7/licao-67-economia-derivadas.mdx",
        REPO_ROOT / "content/aulas/ano-2/trim-7/licao-68-cinematica.mdx",
        REPO_ROOT / "content/aulas/ano-2/trim-7/licao-69-newton-raphson.mdx",
        REPO_ROOT / "content/aulas/ano-2/trim-7/licao-70-consolidacao-trim-7.mdx",
    ]
    total_injected = 0
    total_already = 0
    for path in targets:
        if not path.exists():
            print(f"MISSING: {path}")
            continue
        inj, had = process_file(path)
        total_injected += inj
        total_already += had
        print(f"{path.name}: +{inj} opcoes injected, {had} already had opcoes")
    print(f"\nTotal: {total_injected} injected, {total_already} already present")


if __name__ == "__main__":
    main()
