def bissec(a,b,criterio,funcao):
  if F(funcao, a)*F(funcao, b)>0:
    print('Não é possível afirmar que há raizes entre a e b!')
  else:
    media = (a+b)/2
    i = 0
    while abs(F(funcao, media))>criterio:
      media = (a+b)/2
      print(f'A média da iteração {i} é: {media}')
      print("O valor dessa função na raiz é: " + str(F(funcao, media)))
      if F(funcao, a)*F(funcao, media)>0:
        a = media
      else:
        b = media
      i+=1
  print("A raiz da função é: " + str(media))