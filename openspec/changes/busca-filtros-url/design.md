## Context

O Catálogo hoje não guarda estado de consulta. O README (l. 52-53) exige URL como fonte da verdade. Stack obrigatória: TanStack Router e TanStack Query.

## Goals / Non-Goals

**Goals:**
- URL como única fonte do estado de busca, filtros, ordenação e página.
- Reinício da página 1 ao mudar busca ou filtro.

**Non-Goals:**
- Carrinho, cupom, Favoritos e qualquer código de `src/compra/`.

## Decisions

- Parâmetros de busca validados e tipados no TanStack Router (`q`, `precoMax`, `ordem`, `pagina`).
- A chave da consulta do TanStack Query inclui todos os parâmetros, para que respostas antigas não sobrescrevam as novas.
- Alterações de busca e filtro chamam navegação que define `pagina=1`.

## Risks / Trade-offs

- Digitação rápida gera muitas entradas no histórico → usar substituição de entrada (replace) durante a digitação.
