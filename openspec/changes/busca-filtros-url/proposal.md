## Why

No Catálogo, o colecionador perde busca, filtros e página ao recarregar a página ou voltar no histórico. O README exige que esses parâmetros componham a URL e sobrevivam a refresh e navegação pelo histórico (README l. 52).

## What Changes

- Busca, filtro de preço máximo, ordenação e página passam a viver nos parâmetros de busca da URL.
- Alterar qualquer filtro ou a busca reinicia a paginação na página 1 (README l. 53).
- Escopo restrito ao contexto Catálogo (`src/catalogo/`).

## Capabilities

### New Capabilities
- `catalogo-busca`: estado de busca, filtros, ordenação e paginação do Catálogo refletido na URL.

### Modified Capabilities
<!-- nenhuma -->

## Impact

- Código novo apenas em `src/catalogo/`. Nada em `src/compra/`.
- Usa TanStack Router (parâmetros de busca) conforme a stack do README.
- Fora de escopo: carrinho, cupom, Favoritos, Disponibilidade na compra.
