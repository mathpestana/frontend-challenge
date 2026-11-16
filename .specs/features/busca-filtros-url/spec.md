# Busca e filtros do catálogo na URL Specification

**Approved**: 2026-11-15 - user: "Aceito tudo" (às recomendações do TLC)

Contexto: Catálogo (`src/catalogo/`). Termos: NFT, Edição, Favorito (CLAUDE.md).

## Problem Statement

O colecionador busca NFTs por nome e limita o preço máximo, mas hoje esse estado não vive na URL. Um refresh, um link compartilhado ou o botão voltar perdem a busca, o filtro e a página. O README (l. 52-53) exige que busca, filtros e paginação componham o estado da URL, sobrevivam ao refresh e à navegação pelo histórico, e que mudança de filtro reinicie a paginação.

## Goals

- [ ] Busca por nome, preço máximo e página aparecem na URL (`q`, `precoMax`, `pagina`) e a mesma URL reproduz o mesmo catálogo após refresh.
- [ ] Busca e preço máximo se combinam, e qualquer mudança nos dois volta à página 1.
- [ ] Voltar e avançar no histórico restauram o estado anterior do catálogo.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Ordenação | Decisão do dono: vira outra feature, com parâmetro próprio |
| Outros filtros (categoria, coleção, preço mínimo) | Decisão do dono: só `precoMax` nesta feature |
| Detalhe do NFT e favoritos | Outra parte do contexto Catálogo |
| Regra de compra e disponibilidade para compra | Pertence ao contexto Compra |
| Captura ou frame do Figma dos controles | Decisão do dono: sem captura; a spec descreve resultados, não layout |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Campo da busca | Só o nome do NFT; sem diferenciar maiúsculas e acentos; com trim | Decisão do dono (pergunta 3) | y |
| Disparo da busca | Atraso de 300 ms; cada valor confirmado gera uma entrada no histórico | Decisão do dono (pergunta 4) | y |
| Busca reinicia a página | Sim, igual a um filtro | Decisão do dono (pergunta 5), README l. 53 | y |
| Formato de `precoMax` | Só ponto decimal, até 18 casas, zero válido, negativo inválido, limite inclusivo, string digitada guardada na URL, comparação decimal sem float | Decisão do dono (pergunta 6); README: valores em ETH são strings decimais | y |
| URL inválida | `precoMax` inválido é ignorado e removido da URL; `pagina` inválida vira 1; `pagina` além do fim vira a última página | Decisão do dono (pergunta 7) | y |
| `pagina` na URL | Sem parâmetro equivale à página 1; `pagina=N` aparece após interação; `q` e `precoMax` vazios não aparecem | Decisão do dono (pergunta 8) | y |
| Estados de resultado | Estado vazio, falha da API e resposta fora de ordem entram nesta feature | Decisão do dono (pergunta 9), README l. 54 | y |
| Onde a regra roda | A API simulada (MSW) recebe `q`, `precoMax` e `pagina`, filtra e pagina em 12 por página | Decisão do dono (pergunta 10); regra testável nas camadas que os testes alcançam | y |
| Larguras | 390 px e 1440 px, com 12 NFTs por página nas duas | Decisão do dono (pergunta 11) | y |
| Textos do estado vazio e da falha | "Nenhum NFT encontrado"; "Não foi possível carregar o catálogo" com a ação "Tentar novamente" | Default do agente: o README não define a redação; baixo risco, o dono corrige se quiser | n |

**Open questions:** none - all resolved or logged above (required before the spec is confirmed).

---

## User Stories

### P1: Busca e preço máximo na URL ⭐ MVP

**User Story**: Como colecionador, quero buscar por nome e limitar o preço máximo para ver só os NFTs que me interessam, com esse estado na URL.

**Why P1**: É o núcleo do README l. 52-53 e cobre os cenários 1 e 2 do dono.

**Acceptance Criteria**:

1. WHEN o colecionador digita "dragon" na busca e o valor é confirmado THEN o sistema SHALL colocar `q=dragon` na URL.  <!-- event-driven -->
2. WHEN o colecionador informa preço máximo "0.50" THEN o sistema SHALL colocar `precoMax=0.50` na URL.  <!-- event-driven -->
3. WHILE a URL contém `q=dragon` e `precoMax=0.50` o sistema SHALL listar apenas os NFTs cujo nome contém "dragon" e cujo preço atual é menor ou igual a 0.50 ETH.  <!-- state-driven -->
4. WHEN a página é recarregada com `q`, `precoMax` e `pagina=2` na URL THEN o sistema SHALL mostrar o campo de busca, o campo de preço e a página 2 com os mesmos valores e o mesmo resultado.  <!-- event-driven -->
5. WHEN o colecionador abre a URL que contém `q=dragon&precoMax=0.50&pagina=2` em uma aba nova THEN o sistema SHALL mostrar o mesmo resultado da aba original.  <!-- event-driven -->
6. WHEN o colecionador usa voltar ou avançar no histórico THEN o sistema SHALL restaurar busca, preço máximo, página e resultado da entrada de histórico escolhida.  <!-- event-driven -->
7. WHEN o colecionador confirma a busca THEN o sistema SHALL criar uma entrada no histórico para esse valor.  <!-- event-driven -->
8. WHEN o colecionador digita na busca THEN o sistema SHALL aguardar 300 ms sem nova tecla antes de confirmar o valor.  <!-- event-driven -->
9. WHEN o colecionador esvazia a busca THEN o sistema SHALL remover `q` da URL.  <!-- event-driven -->
10. WHEN o colecionador esvazia o preço máximo THEN o sistema SHALL remover `precoMax` da URL.  <!-- event-driven -->
11. The sistema SHALL buscar o nome sem diferenciar maiúsculas de minúsculas e acentos, ignorando espaços nas pontas do texto digitado.  <!-- ubiquitous -->
12. The sistema SHALL tratar o preço máximo como limite inclusivo, de modo que um NFT de 0.50 ETH aparece com `precoMax=0.50`.  <!-- ubiquitous -->
13. The sistema SHALL comparar preços como decimais, sem converter para ponto flutuante.  <!-- ubiquitous -->

**Independent Test**: Com 48 NFTs, digitar "dragon" e preço "0.50": a URL tem `q=dragon` e `precoMax=0.50`, a lista mostra só os que casam com os dois, e o refresh mantém tudo.

---

### P1: Mudança de busca ou filtro reinicia a paginação ⭐ MVP

**User Story**: Como colecionador, quero voltar à página 1 quando mudo a busca ou o preço, para não cair numa página que não existe mais.

**Why P1**: README l. 53 e cenário 3 do dono.

**Acceptance Criteria**:

1. WHEN o colecionador altera o preço máximo para "0.20" estando na página 3 THEN o sistema SHALL mostrar a página 1 e colocar `pagina=1` na URL.  <!-- event-driven -->
2. WHEN o colecionador altera a busca estando na página 3 THEN o sistema SHALL mostrar a página 1 e colocar `pagina=1` na URL.  <!-- event-driven -->
3. WHEN o colecionador muda de página sem alterar busca nem preço THEN o sistema SHALL manter `q` e `precoMax` na URL e atualizar `pagina`.  <!-- event-driven -->
4. WHEN o colecionador abre o catálogo sem parâmetros THEN o sistema SHALL mostrar a página 1 sem `pagina` na URL.  <!-- event-driven -->
5. WHEN o colecionador interage com busca, preço ou paginação THEN o sistema SHALL colocar `pagina=N` na URL.  <!-- event-driven -->
6. The sistema SHALL listar 12 NFTs por página, com 48 NFTs sem filtro formando 4 páginas.  <!-- ubiquitous -->

**Independent Test**: Ir à página 3, mudar o preço para "0.20": a lista mostra a página 1 e a URL contém `pagina=1`.

---

### P1: URL inválida e estados do resultado ⭐ MVP

**User Story**: Como colecionador, quero que uma URL errada ou uma falha não quebre o catálogo.

**Why P1**: A URL é digitável e compartilhável; README l. 54 pede vazio, falha e resposta fora de ordem.

**Acceptance Criteria**:

1. IF `precoMax` não é um decimal válido (texto, negativo, vírgula ou mais de 18 casas) THEN o sistema SHALL ignorar o filtro e remover `precoMax` da URL.  <!-- unwanted-behavior -->
2. IF `pagina` é 0, negativa ou não é um inteiro THEN o sistema SHALL mostrar a página 1.  <!-- unwanted-behavior -->
3. IF `pagina` é maior que a última página do resultado THEN o sistema SHALL mostrar a última página e escrever esse número em `pagina` na URL.  <!-- unwanted-behavior -->
4. IF nenhum NFT casa com a busca e o preço THEN o sistema SHALL mostrar "Nenhum NFT encontrado" no lugar da lista.  <!-- unwanted-behavior -->
5. IF a API falha ao carregar o catálogo THEN o sistema SHALL mostrar "Não foi possível carregar o catálogo" com a ação "Tentar novamente", mantendo busca, preço e página na URL.  <!-- unwanted-behavior -->
6. WHEN o colecionador usa "Tentar novamente" THEN o sistema SHALL repetir a consulta com os parâmetros da URL.  <!-- event-driven -->
7. IF a resposta de uma consulta antiga chega depois da resposta de uma consulta mais nova THEN o sistema SHALL mostrar o resultado da consulta mais nova.  <!-- unwanted-behavior -->
8. WHILE a consulta carrega o sistema SHALL indicar o carregamento sem apagar busca, preço e página da URL.  <!-- state-driven -->
9. The sistema SHALL enviar à API `q`, `precoMax` e `pagina` com os mesmos valores da URL.  <!-- ubiquitous -->
10. The sistema SHALL funcionar nas larguras de 390 px e 1440 px com os mesmos comportamentos.  <!-- ubiquitous -->

**Independent Test**: Abrir `?pagina=99&precoMax=abc` com 4 páginas: `precoMax` some da URL e a página 4 aparece.

---

## Edge Cases

- IF o preço máximo é "0" THEN o sistema SHALL aceitar o valor e listar só NFTs de preço 0.
- IF a busca tem só espaços THEN o sistema SHALL tratá-la como vazia e remover `q` da URL.
- WHEN o filtro reduz o resultado para menos páginas que a atual THEN o sistema SHALL ir para a página 1, pois a mudança reinicia a paginação.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| BUSCA-01 | P1: Busca e preço máximo na URL (critérios 1-3, 9-13) | Design | Pending |
| BUSCA-02 | P1: Busca e preço máximo na URL (critérios 4-8) | Design | Pending |
| BUSCA-03 | P1: Mudança de busca ou filtro reinicia a paginação | Design | Pending |
| BUSCA-04 | P1: URL inválida e estados do resultado (critérios 1-3) | Design | Pending |
| BUSCA-05 | P1: URL inválida e estados do resultado (critérios 4-10) | Design | Pending |

**Coverage:** 5 total, 0 mapped to tasks, 5 unmapped

---

## Sources

- README.md l. 52-53 - busca, filtros e paginação na URL, filtros combináveis, mudança de filtro reinicia a paginação
- README.md l. 54 - estados vazio, falha e resposta fora de ordem (incluídos por decisão do dono)
- Cenários do dono 1, 2 e 3 - base dos critérios das duas primeiras histórias

---

## Success Criteria

- [ ] Os três cenários do dono passam em teste E2E.
- [ ] Recarregar qualquer URL do catálogo reproduz o mesmo resultado.
- [ ] Nenhuma comparação de preço usa ponto flutuante.
