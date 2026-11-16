import {
  multiplicarEth,
  percentualEth,
  somarEth,
  subtrairEth,
  type Eth,
} from '../dominio/eth'
import type { Cotacao, Pedido } from '../dominio/tipos'

export type NomeCenario = 'padrao' | 'com-cupom'

interface EdicaoMock {
  nome: string
  preco: Eth
  quantidadeConfirmavel: number
}

export interface EstadoMock {
  edicoes: Record<string, EdicaoMock>
  carrinho: { edicaoId: string; quantidade: number }[]
  cupom: { codigo: string; pontosBase: number } | null
  taxaRede: Eth
  pedidos: Pedido[]
  porChaveIdempotencia: Map<string, Pedido>
}

// Cenários conhecidos. Cada chamada devolve um estado novo (reset integral).
export function criarEstado(cenario: NomeCenario = 'padrao'): EstadoMock {
  return {
    edicoes: {
      'nft-1-ed-1': { nome: 'Aurora #1 — Edição 1', preco: '0.50', quantidadeConfirmavel: 10 },
    },
    carrinho: [{ edicaoId: 'nft-1-ed-1', quantidade: 3 }],
    cupom: cenario === 'com-cupom' ? { codigo: 'PDA10', pontosBase: 1000 } : null,
    taxaRede: '0.00',
    pedidos: [],
    porChaveIdempotencia: new Map(),
  }
}

// A Cotação é calculada aqui, na camada de rede simulada, e nunca no cliente.
export function calcularCotacao(estado: EstadoMock): Cotacao {
  const itens = estado.carrinho.map(({ edicaoId, quantidade }) => {
    const edicao = estado.edicoes[edicaoId]
    return {
      edicaoId,
      nome: edicao.nome,
      quantidade,
      precoUnitario: edicao.preco,
      disponibilidade: { quantidadeConfirmavel: edicao.quantidadeConfirmavel },
    }
  })
  const subtotal = itens.reduce<Eth>(
    (soma, i) => somarEth(soma, multiplicarEth(i.precoUnitario, i.quantidade)),
    '0.00',
  )
  const desconto = estado.cupom ? percentualEth(subtotal, estado.cupom.pontosBase) : '0.00'
  const total = somarEth(subtrairEth(subtotal, desconto), estado.taxaRede)
  return {
    itens,
    cupom: estado.cupom ? { codigo: estado.cupom.codigo } : null,
    subtotal,
    desconto,
    taxaRede: estado.taxaRede,
    total,
  }
}
