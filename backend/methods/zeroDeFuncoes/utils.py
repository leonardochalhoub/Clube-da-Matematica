# backend/metodos/zero_de_funcoes/utils.py

import sympy as sp

x = sp.Symbol('x')

def F(funcao, y):
    return funcao.evalf(subs={x: y})