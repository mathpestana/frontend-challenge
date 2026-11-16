# ADR-0001: Revalidar a Cotação antes de confirmar o Pedido e exigir nova confirmação se ela mudou

## Status

Aceita

## Contexto

O colecionador coloca NFTs no Carrinho e só finaliza minutos depois, depois de navegar ou preencher dados de pagamento. Nesse intervalo o preço ou a Disponibilidade de uma edição pode mudar sem ele fazer nada. Na fala reconstruída (não citação) do RESEARCH.md: "Eu vi 0,50 ETH no carrinho, cliquei em comprar e só depois descobri que cobraram outro valor." O custo é dinheiro (valor em ETH), compra de quantidade que não existe mais, perda de confiança e retrabalho. Não há medição de frequência nem de diferença média; isso é hipótese a validar. O dinheiro está envolvido e confirmar um Pedido não se desfaz facilmente, então a decisão precisa existir antes de qualquer código.

## Decisão

A Cotação da API é a única referência para finalizar o Pedido. Imediatamente antes de confirmar, a Compra revalida a Cotação (preço, Disponibilidade, cupom e taxas). Se qualquer valor ou a Disponibilidade mudou em relação ao que o colecionador viu, o Pedido não é enviado: o colecionador vê o que mudou e precisa confirmar de novo.

## Alternativas consideradas

- Enviar o Pedido com a Cotação que o colecionador viu e deixar a API ajustar o valor: descartada, é o problema descrito (paga um valor achando que paga outro).
- Atualizar o Carrinho em silêncio e prosseguir: descartada, o colecionador aceitaria um valor que não viu.

## Consequências

**Positivas:**
- O colecionador nunca confirma um total diferente do que está vendo.
- Edição sem Disponibilidade suficiente é barrada antes de virar Pedido.
- O resumo mostrado passa a ser o que será cobrado, o que recupera a confiança.

**Negativas / trade-offs:**
- Um passo extra de confirmação quando algo mudou, o que atrasa a compra.
- A confirmação depende de uma consulta à API no último momento; se ela falhar, o Pedido não pode ser confirmado.
- Quem compra várias unidades pode ter de confirmar mais de uma vez se a Cotação mudar de novo.
