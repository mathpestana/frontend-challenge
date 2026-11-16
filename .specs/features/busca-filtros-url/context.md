# Busca e filtros do catálogo na URL Context

**Gathered:** 2026-11-15
**Spec:** `.specs/features/busca-filtros-url/spec.md`
**Status:** Ready for design

---

## Feature Boundary

Busca por nome, preço máximo e página compõem a URL do catálogo, sobrevivem a refresh e histórico, e a mudança de busca ou preço reinicia a página. Sem ordenação, sem outros filtros, sem detalhe e favoritos.

---

## Implementation Decisions

Resposta do dono a todas as recomendações: "Aceito tudo".

### Escopo

- Ordenação fica fora (pergunta 1).
- Único filtro é `precoMax` (pergunta 2).
- Sem captura do Figma; larguras 390 px e 1440 px (pergunta 11).

### Busca

- Só o nome, sem diferenciar maiúsculas e acentos, com trim; busca vazia remove `q` (pergunta 3).
- Atraso de 300 ms; cada valor confirmado gera uma entrada no histórico (pergunta 4).
- Mudar a busca reinicia a página 1 (pergunta 5).

### Preço máximo

- Só ponto decimal, até 18 casas, zero válido, limite inclusivo, string digitada na URL, sem float (pergunta 6).

### URL

- `precoMax` inválido é ignorado e limpo; `pagina` inválida vira 1; além do fim vira a última (pergunta 7).
- Sem parâmetro equivale à página 1; `pagina=N` aparece após interação; vazios não aparecem (pergunta 8).

### Resultado

- Estado vazio, falha da API e resposta fora de ordem entram (pergunta 9).
- Filtro e paginação de 12 por página rodam na API simulada MSW (pergunta 10).

### Agent's Discretion

Nenhum.

### Declined / Undiscussed Gray Areas → Assumptions

Textos do estado vazio e da falha: o dono não os definiu. O default do agente está em Assumptions & Open Questions da spec, com `Confirmed? n`.

---

## Specific References

Sem captura. README l. 52-54 e os três cenários do dono.

---

## Deferred Ideas

- Ordenação como parâmetro de URL (feature própria).
- Outros filtros: categoria, coleção, preço mínimo.
