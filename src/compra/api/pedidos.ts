import { cliente } from './cliente'
import type { NovoPedido, Pedido } from '../dominio/tipos'

export async function criarPedido(pedido: NovoPedido, chaveIdempotencia: string): Promise<Pedido> {
  const { data } = await cliente.post<Pedido>('/pedidos', pedido, {
    headers: { 'Idempotency-Key': chaveIdempotencia },
  })
  return data
}
