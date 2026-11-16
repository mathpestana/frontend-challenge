import { setupWorker } from 'msw/browser'
import { criarEstado, type NomeCenario } from './estado'
import { criarHandlers } from './handlers'

const CENARIOS: NomeCenario[] = ['padrao', 'com-cupom']

// Cenário escolhido por ?cenario=... ; a cada carga o estado é novo (reset integral).
export async function iniciarMocks() {
  const pedido = new URLSearchParams(window.location.search).get('cenario')
  const cenario = CENARIOS.find((c) => c === pedido) ?? 'padrao'
  const worker = setupWorker(...criarHandlers(criarEstado(cenario)))
  await worker.start({ onUnhandledFrame: 'bypass', quiet: true })
}
