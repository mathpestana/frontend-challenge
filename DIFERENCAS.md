# DIFERENCAS — feature "busca e filtros na URL" (Catálogo)

Seus 3 cenários originais estão em `cenarios-semana5.md`. A feature foi especificada nas duas ferramentas:

- OpenSpec: `openspec/changes/busca-filtros-url-agente/` (válida com `openspec validate`)
- TLC: `.specs/features/busca-filtros-url/` (`validate_spec.py` com 0 erros e 0 avisos)

## OpenSpec (sessão nova, `/openspec-propose`)

1. **Acrescentou:** 9 cenários que não estavam nos meus 3 (acesso direto por URL, busca sozinha, mudar a busca reinicia a página, parâmetros inválidos, histórico e digitação), 12 no total.
2. **Mudou:** manteve meus 3 cenários quase literais; tornou `pagina=1` explícito na URL e deixou a ordenação de fora. Inventou regras que o README não traz, como "página além do fim vira a última página".
3. **Pergunta:** _preencher: se o agente perguntou algo na sessão, escreva qual; se não, "não fez pergunta nenhuma"._

## TLC (sessão nova, skill `tlc-spec-driven`)

1. **Acrescentou:** busca por nome sem diferenciar maiúsculas e acentos, atraso de 300 ms, preço só com ponto e até 18 casas, URL inválida corrigida, estado vazio, falha da API e resposta fora de ordem, larguras 390 e 1440 px.
2. **Mudou:** o cenário 1 virou três critérios, o 2 passou a exigir `q`, `precoMax` e `pagina=2` na URL, e o 3 ganhou a busca (busca também reinicia a página 1).
3. **Pergunta:** fez **11 perguntas** antes de escrever (ordenação, outros filtros, campos da busca, quando dispara, formato do preço, URL inválida, estados do resultado, onde filtrar, Figma). Todas foram respondidas aceitando as recomendações dele. Os textos de tela "Nenhum NFT encontrado" e "Tentar novamente" ficaram como suposição não confirmada (`Confirmed? n`).

## Comparação

**Qual perguntou mais:** o TLC, com 11 perguntas formais antes de gravar qualquer coisa; ele para e exige aprovação nas palavras do dono. O OpenSpec escreveu direto (a sessão dele pode ter perguntado algo, ver item acima).

**Qual inventou mais:** o OpenSpec, em proporção. Ele decidiu sozinho regras de produto (como tratar `pagina=99`) e as escreveu como requisito. O TLC levantou os mesmos pontos, mas como pergunta, e o que não foi decidido ficou marcado como suposição.

**Qual eu usaria neste projeto:** o **TLC** para features que mexem em dinheiro ou estado, como a cotação e o pedido, onde uma regra inventada custa caro, e o **OpenSpec** para features pequenas e de baixo risco. Neste desafio, a maior parte do trabalho (cotação, pedido, sessão) é de risco, então eu usaria o TLC, aceitando que ele é mais lento e a spec dele fica bem mais longa.

**Limite desta comparação:** a spec do TLC saiu com 152 linhas contra 79 do OpenSpec, mas as decisões do TLC foram aceitas em bloco ("Aceito tudo"), então parte do tamanho vem das recomendações dele, não de decisões minhas.
