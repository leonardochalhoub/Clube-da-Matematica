/**
 * Parser de expressões matemáticas seguro — recursivo descendente.
 *
 * Substitui o uso de `eval()` / `new Function()` do código legado.
 * Gramática suportada:
 *
 *   expr   := term (('+' | '-') term)*
 *   term   := factor (('*' | '/') factor)*
 *   factor := unary ('^' factor)?            (potência: associativa à direita)
 *   unary  := '-' unary | atom
 *   atom   := NUMBER | IDENT | IDENT '(' expr ')' | '(' expr ')'
 *
 * Funções aceitas:  sin, cos, tan, asin, acos, atan, exp, log (base 10),
 *                   ln (natural), sqrt, abs, sinh, cosh, tanh.
 * Constantes:       pi, e.
 * Variáveis:        qualquer identificador definido no contexto da avaliação.
 */

export type Ast =
  | { kind: 'num'; value: number }
  | { kind: 'var'; name: string }
  | { kind: 'binop'; op: '+' | '-' | '*' | '/' | '^'; left: Ast; right: Ast }
  | { kind: 'unop'; op: '-'; operand: Ast }
  | { kind: 'call'; name: string; arg: Ast }

const FUNCOES: Record<string, (x: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  exp: Math.exp,
  log: Math.log10,
  ln: Math.log,
  sqrt: Math.sqrt,
  abs: Math.abs,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
}

const CONSTANTES: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
}

type Token =
  | { type: 'num'; value: number; pos: number }
  | { type: 'ident'; name: string; pos: number }
  | { type: 'op'; op: '+' | '-' | '*' | '/' | '^'; pos: number }
  | { type: 'lparen'; pos: number }
  | { type: 'rparen'; pos: number }

function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  const src = input.trim()

  while (i < src.length) {
    const ch = src[i]!

    if (/\s/.test(ch)) {
      i++
      continue
    }

    if (/[0-9.]/.test(ch)) {
      const start = i
      while (i < src.length && /[0-9.]/.test(src[i]!)) i++
      const value = Number(src.slice(start, i))
      if (!Number.isFinite(value)) throw new ParseError(`número inválido: '${src.slice(start, i)}'`, start)
      tokens.push({ type: 'num', value, pos: start })
      continue
    }

    if (/[a-zA-Z_]/.test(ch)) {
      const start = i
      while (i < src.length && /[a-zA-Z0-9_]/.test(src[i]!)) i++
      const name = src.slice(start, i).toLowerCase()
      tokens.push({ type: 'ident', name, pos: start })
      continue
    }

    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '^') {
      tokens.push({ type: 'op', op: ch, pos: i })
      i++
      continue
    }

    if (ch === '(') {
      tokens.push({ type: 'lparen', pos: i })
      i++
      continue
    }

    if (ch === ')') {
      tokens.push({ type: 'rparen', pos: i })
      i++
      continue
    }

    // **  → ^   (conveniência didática, aceita Python-like)
    if (ch === '*' && src[i + 1] === '*') {
      tokens.push({ type: 'op', op: '^', pos: i })
      i += 2
      continue
    }

    throw new ParseError(`caractere inesperado '${ch}'`, i)
  }

  return tokens
}

export class ParseError extends Error {
  constructor(message: string, public readonly pos: number) {
    super(`Erro de sintaxe (pos ${pos}): ${message}`)
    this.name = 'ParseError'
  }
}

class Parser {
  private pos = 0
  constructor(private readonly tokens: Token[]) {}

  parse(): Ast {
    const ast = this.expr()
    if (this.pos < this.tokens.length) {
      throw new ParseError(`token inesperado após expressão`, this.tokens[this.pos]!.pos)
    }
    return ast
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos]
  }

  private consume(): Token {
    const t = this.tokens[this.pos]
    if (!t) throw new ParseError('fim inesperado da expressão', -1)
    this.pos++
    return t
  }

  private expr(): Ast {
    let left = this.term()
    while (true) {
      const t = this.peek()
      if (!t || t.type !== 'op' || (t.op !== '+' && t.op !== '-')) break
      this.consume()
      const right = this.term()
      left = { kind: 'binop', op: t.op, left, right }
    }
    return left
  }

  private term(): Ast {
    let left = this.factor()
    while (true) {
      const t = this.peek()
      if (!t || t.type !== 'op' || (t.op !== '*' && t.op !== '/')) break
      this.consume()
      const right = this.factor()
      left = { kind: 'binop', op: t.op, left, right }
    }
    return left
  }

  private factor(): Ast {
    const left = this.unary()
    const t = this.peek()
    if (t && t.type === 'op' && t.op === '^') {
      this.consume()
      const right = this.factor() // associativa à direita
      return { kind: 'binop', op: '^', left, right }
    }
    return left
  }

  private unary(): Ast {
    const t = this.peek()
    if (t && t.type === 'op' && t.op === '-') {
      this.consume()
      return { kind: 'unop', op: '-', operand: this.unary() }
    }
    if (t && t.type === 'op' && t.op === '+') {
      this.consume()
      return this.unary()
    }
    return this.atom()
  }

  private atom(): Ast {
    const t = this.consume()

    if (t.type === 'num') return { kind: 'num', value: t.value }

    if (t.type === 'ident') {
      const next = this.peek()
      if (next && next.type === 'lparen') {
        this.consume() // (
        const arg = this.expr()
        const close = this.consume()
        if (close.type !== 'rparen') {
          throw new ParseError("esperado ')'", close.pos)
        }
        return { kind: 'call', name: t.name, arg }
      }
      return { kind: 'var', name: t.name }
    }

    if (t.type === 'lparen') {
      const e = this.expr()
      const close = this.consume()
      if (close.type !== 'rparen') {
        throw new ParseError("esperado ')'", close.pos)
      }
      return e
    }

    throw new ParseError(`token inesperado`, t.pos)
  }
}

export function avaliar(ast: Ast, vars: Record<string, number>): number {
  switch (ast.kind) {
    case 'num':
      return ast.value
    case 'var':
      if (ast.name in vars) return vars[ast.name]!
      if (ast.name in CONSTANTES) return CONSTANTES[ast.name]!
      throw new Error(`variável desconhecida: '${ast.name}'`)
    case 'unop':
      return -avaliar(ast.operand, vars)
    case 'binop': {
      const l = avaliar(ast.left, vars)
      const r = avaliar(ast.right, vars)
      switch (ast.op) {
        case '+':
          return l + r
        case '-':
          return l - r
        case '*':
          return l * r
        case '/':
          return l / r
        case '^':
          return Math.pow(l, r)
      }
      // exhaustive — TS não detecta o switch acima, então:
      throw new Error('operador desconhecido')
    }
    case 'call': {
      const fn = FUNCOES[ast.name]
      if (!fn) throw new Error(`função desconhecida: '${ast.name}'`)
      return fn(avaliar(ast.arg, vars))
    }
  }
}

/**
 * Compila uma expressão matemática em uma função de uma variável.
 *
 * @example
 *   const f = compile('x^2 - 4')
 *   f(2) // => 0
 *   f(3) // => 5
 */
export function compile(input: string, variavel = 'x'): (x: number) => number {
  const ast = new Parser(tokenize(input)).parse()
  return (x: number) => avaliar(ast, { [variavel]: x })
}

/**
 * Avalia uma expressão num único ponto. Útil para testes.
 */
export function avaliarExpressao(
  input: string,
  vars: Record<string, number> = {},
): number {
  const ast = new Parser(tokenize(input)).parse()
  return avaliar(ast, vars)
}

export function parseExpression(input: string): Ast {
  return new Parser(tokenize(input)).parse()
}
