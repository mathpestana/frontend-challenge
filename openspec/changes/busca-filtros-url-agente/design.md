# Design

## Context

Ainda não há código em `src/`; a implementação nasce em `src/catalogo/`. A stack é fixa pelo README (l. 17-18, 90): TanStack Router para parâmetros de busca e TanStack Query para consultas, com Axios e MSW. Requisitos em `specs/catalogo-busca-filtros/spec.md`; motivação em proposal.md.

## Goals / Non-Goals

**Goals:**
- A URL é a única fonte de verdade do estado de consulta; nenhum estado duplicado de página ou filtro.
- Estado de consulta tipado e validado em um único ponto.

**Non-Goals:**
- Ordenação, resultado vazio, falha e respostas fora de ordem (outras changes).
- Detalhe e favoritos.

## Decisions

1. **Parâmetros de busca da rota validados no Router.** `validateSearch` na rota do catálogo normaliza `q`, `precoMax` e `pagina` (regras de parâmetro inválido da spec). Alternativa: ler `window.location` em componentes; rejeitada por duplicar validação e não integrar ao histórico.
2. **Query key derivada dos parâmetros normalizados.** `['nfts', { q, precoMax, pagina }]` e a mesma tripla vai à API. Refresh e voltar reaproveitam o cache.
3. **Reinício de paginação na ação, não em efeito.** O handler de mudança de `q` ou `precoMax` navega com `pagina: 1` na mesma atualização da URL. Alternativa: `useEffect` que zera a página; rejeitada por gerar um render e uma entrada de histórico intermediários com página antiga.
4. **Histórico:** `navigate({ replace: true })` na digitação da busca; sem `replace` ao aplicar preço ou paginar. A busca é aplicada com debounce curto; o campo é controlado por estado local de digitação, sincronizado com `q` ao navegar, voltar ou recarregar.
5. **Formato de `precoMax`:** mantido como string decimal (ex.: `0.50`) na URL; comparado como número na API para evitar erro de ponto flutuante na exibição.
6. **Casamento da busca:** substring, sem diferenciar maiúsculas, no nome do NFT. Assumido pelo exemplo "dragon"; registrar no contrato REST.
7. **Mock MSW** implementa filtro e paginação de verdade sobre fixtures (≥ 48 NFTs, tamanho de página 12), sem lógica de negócio em componentes ou hooks (README, seção 6).

## Risks / Trade-offs

- [Debounce atrasa a URL em relação ao campo] → atraso curto; testes E2E esperam a URL, não o tempo.
- [`precoMax` com muitas casas decimais] → normalizar para no máximo 2 casas na URL ou documentar o formato aceito.
- [Casamento por nome pode divergir da expectativa de busca em outros campos] → fora de escopo; ampliar em change futura.
