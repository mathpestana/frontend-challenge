import { cliente } from './cliente'
import type { Cotacao } from '../dominio/tipos'

export const CHAVE_COTACAO = ['compra', 'cotacao'] as const

export async function buscarCotacao(): Promise<Cotacao> {
  const { data } = await cliente.get<Cotacao>('/cotacao')
  return data
}
