# Cotação desatualizada na hora de comprar — spec

**Bounded context (semana 5):** Compra (`src/compra/`)
**ADR relacionada:** [docs/adr/0001-cotacao-desatualizada.md](adr/0001-cotacao-desatualizada.md)
**Escala:** M — um problema, um contexto (Compra), uma decisão; mexe em dinheiro, mas cabe em ~1 página

## Contexto

O colecionador que compra NFTs põe itens no Carrinho e só finaliza minutos depois, depois de olhar outros NFTs ou preencher dados de pagamento. Nesse intervalo o preço ou a Disponibilidade de uma edição pode mudar sem ele fazer nada. Reconstrução (não citação): "Eu vi 0,50 ETH no carrinho, cliquei em comprar e só depois descobri que cobraram outro valor. Ou pior: a edição que eu queria já tinha acabado e eu não fiquei sabendo." Custo: dinheiro, compra de quantidade que não existe mais, perda de confiança e retrabalho. Não há medição; frequência e diferença média são hipótese a validar.

## Decisão

A Cotação da API é a referência para finalizar o Pedido. Antes de confirmar, a Compra revalida preço, Disponibilidade, cupom e taxas. Se algo mudou, o Pedido não é enviado e o colecionador precisa confirmar de novo, vendo o que mudou. Enquanto o Carrinho está aberto, as alterações de preço e Disponibilidade recebidas também aparecem para ele.

## Fora de escopo

- Medir com que frequência a cotação muda ou qual a diferença média (hipótese a validar com colecionadores).
- Definir como a mudança chega ao Carrinho (mecanismo, frequência de atualização, tempo de validade da Cotação): é decisão de implementação, não deste documento.
- Qualquer mudança em como o Pedido é criado além de ser barrado quando a Cotação mudou (chave de idempotência e estados pendente, confirmado e recusado ficam como estão).
- Reserva de itens ou garantia de preço durante a navegação.

## Critérios (EARS)

1. **Ubíqua:** A Compra deve mostrar no resumo do Carrinho os valores da Cotação da API (subtotal, desconto, taxa de rede e total) e informar ao colecionador toda mudança de preço ou Disponibilidade recebida enquanto o Carrinho está aberto.
2. **Orientada a evento:** Quando o colecionador pedir para confirmar o Pedido, a Compra deve revalidar preço, Disponibilidade, cupom e taxas na Cotação antes de enviar o Pedido.
3. **Orientada a estado:** Enquanto houver uma mudança na Cotação que o colecionador ainda não confirmou, a Compra deve impedir o envio do Pedido.
4. **Feature opcional:** Onde houver cupom aplicado ao Carrinho, a Compra deve incluir o cupom na revalidação e mostrar o desconto da nova Cotação.
5. **Comportamento indesejado:** Se a Disponibilidade da edição não comportar mais a quantidade do Carrinho, então a Compra não deve enviar o Pedido e deve informar ao colecionador que a quantidade não pode ser confirmada.

## Cenários (BDD)

Os valores abaixo são ilustrativos (do exemplo do RESEARCH.md), não dados medidos.

```gherkin
Cenário: Cotação igual à vista pelo colecionador
Dado um Carrinho com 3 unidades de uma edição a "0.50" ETH e total mostrado de "1.50" ETH
E a revalidação devolve a mesma Cotação
Quando o colecionador confirma o Pedido
Então o Pedido é enviado com total "1.50" ETH
```

```gherkin
Cenário: Preço subiu durante a navegação
Dado um Carrinho com 3 unidades de uma edição a "0.50" ETH e total mostrado de "1.50" ETH
E o preço da edição passou a "0.60" ETH
Quando o colecionador confirma o Pedido
Então o Pedido não é enviado
E o colecionador vê o total novo de "1.80" ETH ao lado do anterior de "1.50" ETH
E o Pedido só é enviado depois de uma nova confirmação dele
```

```gherkin
Cenário: Edição sem Disponibilidade para a quantidade do Carrinho
Dado um Carrinho com 3 unidades de uma edição a "0.50" ETH
E a Cotação revalidada mostra apenas 2 unidades disponíveis dessa edição
Quando o colecionador confirma o Pedido
Então o Pedido não é enviado
E o colecionador é informado de que a quantidade não pode ser confirmada
```

## Como eu vou saber que funcionou

Os 3 cenários acima viram testes Playwright e todos passam com `npx playwright test`. Falta também validar com um colecionador que a fala do Contexto é "isso mesmo" (item aberto no checklist do RESEARCH.md).

## Origem de cada critério (revisão contra o RESEARCH.md e o README)

| # | Frase do RESEARCH.md | Seção do README |
|---|---|---|
| 1 | "Eu vi 0,50 ETH no carrinho ... cobraram outro valor"; "a edição ... já tinha acabado e eu não fiquei sabendo" | 3, Carrinho (l. 64): "Refletir alterações de preço e disponibilidade ... enquanto o carrinho estiver aberto"; 7 (l. 168): "A interface informa a alteração e atualiza o resumo" |
| 2 | "cliquei em comprar e só depois descobri" | 3, Pagamento (l. 72): "Revalidar preço, disponibilidade, cupom e taxas antes de confirmar" |
| 3 | "Eu não fiquei sabendo" (mudança sem aviso) | 3, Pagamento (l. 72): "Mudanças devem exigir nova confirmação do usuário"; 7 (l. 169): "impede a confirmação com uma cotação desatualizada" |
| 4 | Custo: "dinheiro" (desconto muda o total) | 3, Carrinho (l. 62-63): cupom e "desconto ... coerentes com a resposta da API" |
| 5 | "a edição que eu queria já tinha acabado" | 3, Carrinho (l. 60): "respeitando a disponibilidade por NFT e edição" |

## Linguagem ubíqua usada aqui

| Termo | O que significa neste projeto |
|---|---|
| Carrinho | Lista de itens (NFT + edição + quantidade inteira) que o colecionador pretende comprar. |
| Cotação | Resposta da API com subtotal, desconto, taxa de rede e total; é a referência para finalizar o Pedido. |
| Pedido | Compra enviada com chave de idempotência; estados pendente, confirmado ou recusado. |
| Disponibilidade | No sentido de Compra: se a quantidade que o colecionador quer ainda pode ser confirmada agora, na Cotação. |
