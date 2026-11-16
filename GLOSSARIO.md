# Glossário — Marketplace de NFTs

Fonte única: `README.md` do desafio (referências por seção e linha).

## Contexto 1 — Catálogo

Pasta: `src/catalogo/`

Responsabilidade: o colecionador descobre NFTs (busca, filtros, ordenação, paginação, detalhe, favoritos).

| Termo | Significado neste contexto | Origem no README |
|---|---|---|
| **NFT** | Item colecionável listado no catálogo, com galeria, informações e preço atual. | Seção 3 "Catálogo e detalhe" (l. 50-56) |
| **Edição** | Variação de um NFT que pode ser comprada; cada edição tem seu próprio estoque. | l. 55 "edição indisponível", l. 60 "disponibilidade por NFT e edição" |
| **Favorito** | NFT marcado pelo colecionador autenticado; persiste entre sessões. | l. 56 "Favoritos devem persistir para o usuário autenticado" |

## Contexto 2 — Compra

Pasta: `src/compra/`

Responsabilidade: transformar a intenção de compra em pedido confirmado (carrinho, cotação, pagamento, recibo).

| Termo | Significado neste contexto | Origem no README |
|---|---|---|
| **Carrinho** | Lista de itens (NFT + edição + quantidade inteira) que o colecionador pretende comprar; sobrevive a refresh e login. | l. 58-66 |
| **Cotação** | Resposta da API com subtotal, desconto, taxa de rede e total; é a referência para finalizar o pedido. | l. 63, l. 66 "A cotação da API é a referência", l. 72 |
| **Pedido** | Compra enviada com chave de idempotência; estados pendente, confirmado ou recusado (os dois últimos são terminais). | l. 68-78, l. 121, l. 171 |

## Palavra que muda de sentido: **Disponibilidade**

| Contexto | Sentido | Origem |
|---|---|---|
| Catálogo | Quantas unidades de uma edição existem para venda (informação de exibição; pode virar "edição indisponível"). | l. 55, l. 157 (`nft.updated`) |
| Compra | Se a quantidade que o colecionador quer ainda pode ser confirmada **agora**, na cotação. Se mudou, exige nova confirmação do usuário. | l. 60, l. 72, l. 169 |

Regra: o código de `src/catalogo/` não decide se uma compra é válida, e o código de `src/compra/` não exibe estoque como vitrine. Cada contexto tem seu próprio tipo `Disponibilidade`.
