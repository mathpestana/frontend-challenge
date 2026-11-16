# RESEARCH — Cotação desatualizada na hora de comprar

## Quem sente a dor

O **colecionador** que está comprando NFTs e já colocou um ou mais no carrinho. Tipicamente alguém que navega, separa itens no carrinho e só finaliza a compra minutos depois, depois de olhar outros NFTs ou preencher dados de pagamento.

Origem no README: "Quem sente a dor é o colecionador que está comprando" (enunciado da atividade); seção 3, tela Carrinho de NFTs.

## Em que momento ela aparece

Entre **colocar o NFT no carrinho** e **confirmar o pedido**. Durante esse intervalo, o preço ou a quantidade disponível de uma edição pode mudar sem que o colecionador faça nada. O ponto mais crítico é o instante de confirmar a compra: é ali que ele aceita pagar um valor.

Origem no README: "Refletir alterações de preço e disponibilidade recebidas enquanto o carrinho estiver aberto" (seção 3, Carrinho); "Revalidar preço, disponibilidade, cupom e taxas antes de confirmar a compra. Mudanças devem exigir nova confirmação do usuário" (seção 3, Pagamento); cenário "Um NFT está no carrinho. Seu preço ou disponibilidade muda durante a navegação" (seção 7).

## O que essa pessoa diria, com as próprias palavras

**Reconstrução, não citação** (não há fala real de colecionador no README):

> "Eu vi 0,50 ETH no carrinho, cliquei em comprar e só depois descobri que cobraram outro valor. Ou pior: a edição que eu queria já tinha acabado e eu não fiquei sabendo."

## O que isso custa hoje

O README não traz números, então **não há medição**. O custo, por tipo:

- **Dinheiro:** o colecionador pode confirmar achando que paga um valor e pagar outro. O valor é em ETH, e uma diferença pequena de preço ainda é dinheiro real para quem compra várias unidades.
- **Compra errada:** pode confirmar uma quantidade que já não existe.
- **Confiança:** se o resumo mostrado não é o que será cobrado, o colecionador deixa de acreditar no que vê.
- **Retrabalho:** voltar ao carrinho, conferir o que mudou e refazer a conta.

**Exemplo ilustrativo** (números inventados só para explicar): 3 unidades de uma edição a "0.50" ETH somam "1.50" ETH. Se o preço sobe para "0.60" ETH durante a navegação e o colecionador confirma sem ser avisado, paga "1.80" ETH em vez dos "1.50" ETH que viu.

**A validar:** com que frequência isso acontece e qual a diferença média. Hoje é hipótese.

Origem no README: "O checkout impede a confirmação com uma cotação desatualizada" (seção 7); "A cotação da API é a referência para finalizar o pedido" (seção 3, após Carrinho).

## O que já foi tentado (se algo foi)

Nada documentado no README. A única proteção hoje descrita é só o desejo do enunciado: avisar e pedir nova confirmação. Não há histórico de gambiarra ou processo manual para registrar.

## Ligação com a semana 5

Bounded context **Compra** (`src/compra/`). Termos do glossário envolvidos: **Carrinho**, **Cotação**, **Pedido**, e a palavra ambígua **Disponibilidade**, no sentido de Compra (a quantidade desejada ainda pode ser confirmada agora).

---

## Checklist de saída da sessão de Research

- [x] Nenhuma palavra de solução técnica neste arquivo.
- [x] Uma pessoa que não conhece o projeto consegue entender o problema.
- [ ] **Você** consegue mostrar isto a um colecionador e ele diria "é isso mesmo". (Só você pode marcar. A fala acima é reconstrução.)
