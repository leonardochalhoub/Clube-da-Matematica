'use client'

/**
 * VerificarPasso — verificação algébrica interativa via SymPy (Pyodide).
 *
 * Carrega Pyodide + SymPy do CDN sob demanda (lazy) e expõe um campo
 * onde o aluno digita uma expressão; o componente compara simbolicamente
 * com a resposta esperada via `sympy.simplify(student - answer) == 0`.
 *
 * Custo: ~10 MB de download na primeira carga (cacheado pelo browser).
 * Latência: ~2-4s pra inicializar SymPy. Subsequentes verificações: <100ms.
 *
 * Uso típico em MDX:
 *   <VerificarPasso esperado="2*x + 3" prompt="Derive x^2 + 3x" />
 */

import { useEffect, useRef, useState } from 'react'
import katex from 'katex'

const KATEX_MACROS: Record<string, string> = {
  '\\R': '\\mathbb{R}',
  '\\e': '\\mathrm{e}',
}

/** Renderiza string com $...$ → KaTeX inline. */
function renderInline(text: string): string {
  return text.replace(/\$([^$]+)\$/g, (_, expr) => {
    try {
      return katex.renderToString(expr, {
        throwOnError: false,
        strict: false,
        macros: KATEX_MACROS,
      })
    } catch {
      return `<code>${expr}</code>`
    }
  })
}

type Status = 'idle' | 'loading' | 'ready' | 'error'

interface PyodideAPI {
  runPythonAsync: (code: string) => Promise<unknown>
  loadPackage: (pkg: string | string[]) => Promise<void>
  globals: { get: (k: string) => unknown }
}

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideAPI>
    __clubePyodide?: PyodideAPI | null
    __clubePyodidePromise?: Promise<PyodideAPI> | null
  }
}

const PYODIDE_VERSION = '0.27.5'
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

/** Singleton: carrega Pyodide UMA vez por sessão e compartilha. */
async function getPyodide(): Promise<PyodideAPI> {
  if (typeof window === 'undefined') {
    throw new Error('Pyodide só roda no navegador.')
  }
  if (window.__clubePyodide) return window.__clubePyodide
  if (window.__clubePyodidePromise) return window.__clubePyodidePromise

  window.__clubePyodidePromise = (async () => {
    if (!window.loadPyodide) {
      // Carrega script principal do Pyodide
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement('script')
        s.src = `${PYODIDE_CDN}pyodide.js`
        s.onload = () => resolve()
        s.onerror = () => reject(new Error('Falha ao carregar Pyodide.'))
        document.head.appendChild(s)
      })
    }
    const pyodide = await window.loadPyodide!({ indexURL: PYODIDE_CDN })
    await pyodide.loadPackage('sympy')
    await pyodide.runPythonAsync(`
import sympy as sp
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application

_TRANSFORMS = standard_transformations + (implicit_multiplication_application,)

def clube_check(student_str, answer_str):
    """Retorna (ok: bool, simplified_diff: str)."""
    try:
        a = parse_expr(student_str, transformations=_TRANSFORMS, evaluate=True)
        b = parse_expr(answer_str, transformations=_TRANSFORMS, evaluate=True)
        diff = sp.simplify(a - b)
        return (bool(diff == 0), str(diff), sp.latex(a))
    except Exception as e:
        return (False, f"erro: {e}", "")
`)
    window.__clubePyodide = pyodide
    return pyodide
  })()
  return window.__clubePyodidePromise
}

interface VerificarPassoProps {
  /** Expressão esperada em sintaxe SymPy/Python (ex.: "2*x + 3"). */
  esperado: string
  /** Pergunta exibida ao aluno. */
  prompt: string
  /** Variáveis livres permitidas (default: x, y, z). */
  variaveis?: string
}

export function VerificarPasso({
  esperado,
  prompt,
  variaveis = 'x, y, z',
}: VerificarPassoProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<{
    ok: boolean
    msg: string
  } | null>(null)
  const [latex, setLatex] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      // Não cancela carregamento do singleton; outros componentes podem usá-lo.
    }
  }, [])

  async function ensureReady() {
    if (status === 'ready') return
    setStatus('loading')
    try {
      await getPyodide()
      setStatus('ready')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  async function verificar() {
    if (!input.trim()) return
    if (status !== 'ready') {
      await ensureReady()
    }
    const py = window.__clubePyodide
    if (!py) {
      setFeedback({
        ok: false,
        msg: 'Motor de verificação não disponível.',
      })
      return
    }
    const code = `clube_check(${JSON.stringify(input)}, ${JSON.stringify(
      esperado,
    )})`
    try {
      const tuple = (await py.runPythonAsync(code)) as unknown as {
        get: (i: number) => unknown
        destroy?: () => void
      }
      const ok = Boolean(tuple.get(0))
      const diff = String(tuple.get(1))
      const tex = String(tuple.get(2))
      tuple.destroy?.()
      setLatex(tex)
      if (ok) {
        setFeedback({
          ok: true,
          msg: 'Equivalente à resposta esperada (simbolicamente).',
        })
      } else {
        setFeedback({
          ok: false,
          msg: `Diferente da resposta. Diferença simplificada: ${diff}`,
        })
      }
    } catch (err) {
      setFeedback({
        ok: false,
        msg: `Erro ao analisar: ${
          err instanceof Error ? err.message : 'desconhecido'
        }`,
      })
    }
  }

  return (
    <div className="not-prose my-6 rounded-xl border-2 border-dashed border-clube-gold/40 bg-clube-cream-soft p-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-clube-gold-deep">
        ✍️ Verificar passo (SymPy)
      </p>
      <p
        className="mb-3 text-sm text-clube-ink"
        dangerouslySetInnerHTML={{ __html: renderInline(prompt) }}
      />
      <p className="mb-3 text-xs text-clube-mist">
        Variáveis aceitas: <code>{variaveis}</code>. Use sintaxe Python:{' '}
        <code>**</code> pra potência, <code>*</code> pra multiplicação,{' '}
        <code>sin(x)</code>, <code>cos(x)</code>, <code>exp(x)</code>,{' '}
        <code>log(x)</code>, <code>sqrt(x)</code>, <code>pi</code>, <code>E</code>.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ex.: 2*x + 3"
          onKeyDown={(e) => {
            if (e.key === 'Enter') verificar()
          }}
          className="flex-1 min-w-[200px] rounded-lg border border-clube-mist-soft/60 bg-clube-surface px-3 py-2 font-mono text-sm text-clube-ink focus:border-clube-teal focus:outline-none"
        />
        <button
          type="button"
          onClick={verificar}
          disabled={!input.trim() || status === 'loading'}
          className="rounded-full bg-clube-teal px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-clube-teal-deep disabled:opacity-50"
        >
          {status === 'loading' ? 'Carregando SymPy…' : 'Verificar'}
        </button>
      </div>
      {status === 'idle' && (
        <p className="mt-2 text-[11px] italic text-clube-mist">
          Primeira verificação carrega o motor (~10 MB, ~3s). Depois fica
          rápido.
        </p>
      )}
      {status === 'error' && (
        <p className="mt-2 text-xs text-clube-clay">
          Falha ao carregar o motor de verificação. Verifique sua conexão.
        </p>
      )}
      {feedback && (
        <div
          className={
            'mt-4 rounded-lg p-3 text-sm ' +
            (feedback.ok
              ? 'bg-clube-leaf/15 text-clube-leaf'
              : 'bg-clube-clay/15 text-clube-clay')
          }
        >
          {feedback.ok ? '✓ ' : '✗ '}
          {feedback.msg}
          {latex && feedback.ok && (
            <div className="mt-2 font-mono text-xs opacity-80">
              Sua resposta em LaTeX: <code>${latex}$</code>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
