import { useCarrinho } from '../useCarrinho'

export function Carrinho() {
  const c = useCarrinho()

  if (c.carregando) return <p className="p-6">Carregando Cotação…</p>
  if (c.erroCarga || !c.cotacao) {
    return <p role="alert" className="p-6">Não foi possível consultar a Cotação.</p>
  }
  const { cotacao } = c

  return (
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Carrinho</h1>

      <ul className="space-y-2">
        {cotacao.itens.map((item) => (
          <li key={item.edicaoId} className="flex justify-between">
            <span>
              {item.nome} × {item.quantidade}
            </span>
            <span>{item.precoUnitario} ETH cada</span>
          </li>
        ))}
      </ul>

      {c.mudancas.length > 0 && (
        <section
          role="alert"
          aria-label="Mudanças na cotação"
          className="space-y-2 rounded border-2 border-amber-600 bg-amber-50 p-4"
        >
          <h2 className="font-semibold">A Cotação mudou desde a última vez que você viu</h2>
          <ul className="list-disc pl-5">
            {c.mudancas.map((m) => (
              <li key={m.id}>
                {m.rotulo}: de {m.antes} para {m.depois}
              </li>
            ))}
          </ul>
          {c.podeAceitar && (
            <button
              type="button"
              onClick={c.aceitarMudancas}
              className="rounded bg-amber-700 px-3 py-1 text-white"
            >
              Aceitar novos valores
            </button>
          )}
        </section>
      )}

      {c.semDisponibilidade.length > 0 && (
        <p role="alert" className="rounded border-2 border-red-700 bg-red-50 p-4">
          A quantidade não pode ser confirmada:{' '}
          {c.semDisponibilidade
            .map(
              (i) =>
                `${i.nome} (${i.quantidade} no Carrinho, ${i.disponibilidade.quantidadeConfirmavel} disponíveis)`,
            )
            .join('; ')}
          .
        </p>
      )}

      <section aria-label="Resumo do Carrinho">
        <dl className="grid grid-cols-2 gap-y-1">
          <dt>Subtotal</dt>
          <dd data-testid="subtotal">{cotacao.subtotal} ETH</dd>
          <dt>Desconto{cotacao.cupom ? ` (${cotacao.cupom.codigo})` : ''}</dt>
          <dd data-testid="desconto">{cotacao.desconto} ETH</dd>
          <dt>Taxa de rede</dt>
          <dd data-testid="taxa-rede">{cotacao.taxaRede} ETH</dd>
          <dt className="font-bold">Total</dt>
          <dd className="font-bold" data-testid="total">
            {cotacao.total} ETH
          </dd>
        </dl>
      </section>

      {c.falhaRevalidacao && (
        <p role="alert" className="rounded border-2 border-red-700 bg-red-50 p-4">
          Não foi possível revalidar a Cotação. O Pedido não foi enviado.
        </p>
      )}
      {c.pedido.isError && (
        <p role="alert" className="rounded border-2 border-red-700 bg-red-50 p-4">
          O Pedido não pôde ser enviado.
        </p>
      )}

      {c.pedido.isSuccess ? (
        <p role="status" className="rounded border-2 border-green-700 bg-green-50 p-4">
          Pedido {c.pedido.data.id} {c.pedido.data.estado} — total {c.pedido.data.total} ETH
        </p>
      ) : (
        <button
          type="button"
          onClick={c.confirmarPedido}
          disabled={!c.podeConfirmar}
          className="rounded bg-indigo-700 px-4 py-2 text-white disabled:opacity-50"
        >
          Confirmar pedido
        </button>
      )}
    </main>
  )
}
