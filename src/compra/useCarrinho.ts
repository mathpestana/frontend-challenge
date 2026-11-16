import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { buscarCotacao, CHAVE_COTACAO } from './api/cotacao'
import { criarPedido } from './api/pedidos'
import { compararCotacoes, itensSemDisponibilidade } from './dominio/cotacao'
import type { Cotacao, NovoPedido } from './dominio/tipos'

// Frequência com que o Carrinho aberto consulta a Cotação (EARS 1).
// Decisão de implementação, não da spec; configurável por ambiente.
const INTERVALO_MS = Number(import.meta.env.VITE_COTACAO_POLLING_MS ?? 5000)

function montarPedido(cotacao: Cotacao): NovoPedido {
  return {
    itens: cotacao.itens.map(({ edicaoId, quantidade }) => ({ edicaoId, quantidade })),
    cupom: cotacao.cupom?.codigo ?? null,
    total: cotacao.total,
  }
}

export function useCarrinho() {
  const queryClient = useQueryClient()
  const consulta = useQuery({
    queryKey: CHAVE_COTACAO,
    queryFn: buscarCotacao,
    refetchInterval: INTERVALO_MS,
  })
  const atual = consulta.data ?? null

  // Cotação que o colecionador já viu e aceitou. Fica fixa: a primeira carregada
  // é a inicial, e só muda quando ele aceita novos valores.
  const [vista, setVista] = useState<Cotacao | null>(null)
  if (vista === null && atual !== null) setVista(atual)

  const [revalidando, setRevalidando] = useState(false)
  const [falhaRevalidacao, setFalhaRevalidacao] = useState(false)

  // Uma chave de idempotência por conteúdo de pedido: reenviar o mesmo pedido
  // reutiliza a chave; um conteúdo diferente ganha chave nova.
  const chave = useRef<{ assinatura: string; valor: string } | null>(null)
  const pedido = useMutation({
    mutationFn: (corpo: NovoPedido) => {
      const assinatura = JSON.stringify(corpo)
      if (chave.current?.assinatura !== assinatura) {
        chave.current = { assinatura, valor: crypto.randomUUID() }
      }
      return criarPedido(corpo, chave.current.valor)
    },
  })

  const mudancas = vista && atual ? compararCotacoes(vista, atual) : []
  const semDisponibilidade = atual ? itensSemDisponibilidade(atual) : []

  // EARS 3: com mudança não confirmada (ou quantidade que não cabe) não há envio.
  const podeConfirmar =
    atual !== null &&
    mudancas.length === 0 &&
    semDisponibilidade.length === 0 &&
    !revalidando &&
    !pedido.isPending &&
    !pedido.isSuccess

  // EARS 2: revalida na Cotação antes de enviar. Se algo mudou, não envia;
  // a mudança aparece (derivada de `vista` x `atual`) e exige nova confirmação.
  async function confirmarPedido() {
    if (!podeConfirmar || !vista) return
    setFalhaRevalidacao(false)
    setRevalidando(true)
    let nova: Cotacao
    try {
      nova = await queryClient.fetchQuery({
        queryKey: CHAVE_COTACAO,
        queryFn: buscarCotacao,
        staleTime: 0,
      })
    } catch {
      setFalhaRevalidacao(true) // ADR: sem consulta, o Pedido não pode ser confirmado
      return
    } finally {
      setRevalidando(false)
    }
    if (compararCotacoes(vista, nova).length > 0 || itensSemDisponibilidade(nova).length > 0) return
    await pedido.mutateAsync(montarPedido(nova)).catch(() => undefined)
  }

  return {
    carregando: consulta.isPending,
    erroCarga: consulta.isError && !atual,
    cotacao: atual,
    mudancas,
    semDisponibilidade,
    aceitarMudancas: () => setVista(atual),
    podeAceitar: mudancas.length > 0 && semDisponibilidade.length === 0,
    podeConfirmar,
    revalidando,
    falhaRevalidacao,
    confirmarPedido,
    pedido,
  }
}
