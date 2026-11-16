import { igualEth } from './eth'
import type { Cotacao, ItemCotado } from './tipos'

export interface Mudanca {
  id: string
  rotulo: string
  antes: string
  depois: string
}

export const comporta = (item: ItemCotado): boolean =>
  item.disponibilidade.quantidadeConfirmavel >= item.quantidade

export const itensSemDisponibilidade = (cotacao: Cotacao): ItemCotado[] =>
  cotacao.itens.filter((item) => !comporta(item))

const eth = (valor: string) => `${valor} ETH`

// Diferenças entre a Cotação que o colecionador viu (vista) e a atual (nova).
// Só conta como mudança de Disponibilidade quando muda se a quantidade do
// Carrinho ainda pode ser confirmada.
export function compararCotacoes(vista: Cotacao, nova: Cotacao): Mudanca[] {
  const mudancas: Mudanca[] = []
  const antigos = new Map(vista.itens.map((i) => [i.edicaoId, i]))
  const novos = new Map(nova.itens.map((i) => [i.edicaoId, i]))

  for (const id of new Set([...antigos.keys(), ...novos.keys()])) {
    const a = antigos.get(id)
    const n = novos.get(id)
    const nome = (n ?? a)!.nome
    if ((a?.quantidade ?? 0) !== (n?.quantidade ?? 0)) {
      mudancas.push({
        id: `quantidade:${id}`,
        rotulo: `Quantidade de ${nome}`,
        antes: String(a?.quantidade ?? 0),
        depois: String(n?.quantidade ?? 0),
      })
    }
    if (a && n && !igualEth(a.precoUnitario, n.precoUnitario)) {
      mudancas.push({
        id: `preco:${id}`,
        rotulo: `Preço de ${nome}`,
        antes: eth(a.precoUnitario),
        depois: eth(n.precoUnitario),
      })
    }
    if (a && n && comporta(a) !== comporta(n)) {
      const texto = (i: ItemCotado) =>
        comporta(i)
          ? `disponível (${i.disponibilidade.quantidadeConfirmavel} unidades)`
          : `indisponível (${i.disponibilidade.quantidadeConfirmavel} de ${i.quantidade} unidades)`
      mudancas.push({
        id: `disponibilidade:${id}`,
        rotulo: `Disponibilidade de ${nome}`,
        antes: texto(a),
        depois: texto(n),
      })
    }
  }

  if ((vista.cupom?.codigo ?? null) !== (nova.cupom?.codigo ?? null)) {
    mudancas.push({
      id: 'cupom',
      rotulo: 'Cupom',
      antes: vista.cupom?.codigo ?? 'nenhum',
      depois: nova.cupom?.codigo ?? 'nenhum',
    })
  }
  for (const [campo, rotulo] of [
    ['subtotal', 'Subtotal'],
    ['desconto', 'Desconto'],
    ['taxaRede', 'Taxa de rede'],
    ['total', 'Total'],
  ] as const) {
    if (!igualEth(vista[campo], nova[campo])) {
      mudancas.push({ id: campo, rotulo, antes: eth(vista[campo]), depois: eth(nova[campo]) })
    }
  }
  return mudancas
}
