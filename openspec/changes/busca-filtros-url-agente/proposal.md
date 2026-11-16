# Proposal

## Why

O README (l. 52-53) exige que busca, filtros e paginação do catálogo componham o estado da URL e sobrevivam a refresh e à navegação pelo histórico, e que mudar um filtro reinicie a paginação. Sem isso, o colecionador perde o contexto ao recarregar e não consegue compartilhar ou voltar a uma listagem filtrada.

## What Changes

- A URL do catálogo passa a ser a fonte do estado de consulta, com três parâmetros: `q` (busca), `precoMax` (preço máximo em ETH) e `pagina`.
- Busca e filtro de preço combinam (critério AND): o catálogo mostra só NFTs que casam com ambos.
- Ao recarregar, campo de busca, filtro de preço e página são restaurados a partir da URL.
- Mudar `q` ou `precoMax` reinicia a paginação: `pagina=1` explícito na URL.
- Parâmetros inválidos na URL (`precoMax` não numérico ou negativo, `pagina` < 1 ou além do total) são normalizados e a URL é corrigida, sem mensagem de erro.
- Histórico: digitar na busca usa replace; aplicar filtro ou trocar de página cria entrada nova, de modo que "voltar" restaura o estado anterior.

**Fora de escopo** (outras changes): ordenação (`ordem`); estados de resultado vazio, falha da API e respostas fora de ordem (README l. 54); detalhe do NFT; favoritos.

## Capabilities

### New Capabilities

- `catalogo-busca-filtros`: estado de consulta do catálogo (busca, filtro de preço máximo e página) refletido na URL, restaurado após refresh e com reinício de paginação ao mudar critérios.

### Modified Capabilities

<!-- Nenhuma: openspec/specs/ está vazio. -->

## Impact

- Código: `src/catalogo/` (rota do catálogo, parâmetros de busca da URL, listagem). Ainda não existe código em `src/`; a change define o contrato para a implementação.
- API: a listagem de NFTs recebe `q`, `precoMax`, `pagina` e tamanho de página (12), conforme os parâmetros da URL (README l. 54, l. 111).
- Mocks MSW: fixtures com ao menos 48 NFTs, variadas em nome e preço, para exercitar filtro e paginação (README l. 133).
- Dependências: TanStack Router (parâmetros de busca) e TanStack Query (consulta), já previstos na stack.
- Termos: NFT e Edição conforme `GLOSSARIO.md` (contexto Catálogo); "disponibilidade" aqui não entra.
