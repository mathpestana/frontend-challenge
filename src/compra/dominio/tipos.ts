import type { Eth } from './eth'

// Disponibilidade no sentido de Compra: quantas unidades desta edição a Cotação
// consegue confirmar agora. Não é o estoque de vitrine do Catálogo.
export interface Disponibilidade {
  quantidadeConfirmavel: number
}

export interface ItemCotado {
  edicaoId: string
  nome: string
  quantidade: number
  precoUnitario: Eth
  disponibilidade: Disponibilidade
}

export interface Cotacao {
  itens: ItemCotado[]
  cupom: { codigo: string } | null
  subtotal: Eth
  desconto: Eth
  taxaRede: Eth
  total: Eth
}

export type EstadoPedido = 'pendente' | 'confirmado' | 'recusado'

export interface NovoPedido {
  itens: { edicaoId: string; quantidade: number }[]
  cupom: string | null
  total: Eth
}

export interface Pedido extends NovoPedido {
  id: string
  estado: EstadoPedido
}
