import { http, HttpResponse } from 'msw'
import { calcularCotacao, type EstadoMock } from './estado'
import type { NovoPedido, Pedido } from '../dominio/tipos'

export function criarHandlers(estado: EstadoMock) {
  return [
    http.get('/api/compra/cotacao', () => HttpResponse.json(calcularCotacao(estado))),

    // Criação idempotente: a mesma chave recupera o mesmo Pedido.
    http.post('/api/compra/pedidos', async ({ request }) => {
      const chave = request.headers.get('Idempotency-Key')
      if (!chave) {
        return HttpResponse.json({ erro: 'Idempotency-Key obrigatória' }, { status: 400 })
      }
      const corpo = (await request.json()) as NovoPedido
      const existente = estado.porChaveIdempotencia.get(chave)
      if (existente) {
        const { id: _id, estado: _estado, ...original } = existente
        if (JSON.stringify(original) !== JSON.stringify(corpo)) {
          return HttpResponse.json({ erro: 'Chave reutilizada com conteúdo diferente' }, { status: 409 })
        }
        return HttpResponse.json(existente)
      }
      const pedido: Pedido = {
        ...corpo,
        id: `pedido-${estado.pedidos.length + 1}`,
        estado: 'confirmado',
      }
      estado.pedidos.push(pedido)
      estado.porChaveIdempotencia.set(chave, pedido)
      return HttpResponse.json(pedido, { status: 201 })
    }),

    // --- Controle de teste/demonstração (mudanças "do mundo", fora da UI) ---
    http.post('/__mock/edicao', async ({ request }) => {
      const { edicaoId, preco, quantidadeConfirmavel } = (await request.json()) as {
        edicaoId: string
        preco?: string
        quantidadeConfirmavel?: number
      }
      const edicao = estado.edicoes[edicaoId]
      if (!edicao) return HttpResponse.json({ erro: 'Edição inexistente' }, { status: 404 })
      if (preco !== undefined) edicao.preco = preco
      if (quantidadeConfirmavel !== undefined) edicao.quantidadeConfirmavel = quantidadeConfirmavel
      return HttpResponse.json({ ok: true })
    }),
    http.get('/__mock/pedidos', () => HttpResponse.json(estado.pedidos)),
  ]
}
