import { expect, test, type Page } from '@playwright/test'

// Cada teste abre um contexto novo; ao carregar, o MSW recria o estado do cenário.
const EDICAO = 'nft-1-ed-1'

async function abrirCarrinho(page: Page) {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Carrinho' })).toBeVisible()
}

// Mudança "do mundo" feita pela camada de rede simulada, fora da UI.
async function alterarEdicao(page: Page, corpo: { preco?: string; quantidadeConfirmavel?: number }) {
  const ok = await page.evaluate(async (c) => {
    const r = await fetch('/__mock/edicao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(c),
    })
    return r.ok
  }, { edicaoId: EDICAO, ...corpo })
  expect(ok).toBe(true)
}

// Pedidos efetivamente recebidos pelos handlers do MSW.
async function pedidosRecebidos(page: Page): Promise<{ total: string; estado: string }[]> {
  return page.evaluate(async () => (await fetch('/__mock/pedidos')).json())
}

test('Cotação igual à vista pelo colecionador', async ({ page }) => {
  await abrirCarrinho(page)
  await expect(page.getByTestId('total')).toHaveText('1.50 ETH')

  await page.getByRole('button', { name: 'Confirmar pedido' }).click()

  await expect(page.getByRole('status')).toContainText('total 1.50 ETH')
  const pedidos = await pedidosRecebidos(page)
  expect(pedidos).toHaveLength(1)
  expect(pedidos[0].total).toBe('1.50')
})

test('Preço subiu durante a navegação', async ({ page }) => {
  await abrirCarrinho(page)
  await expect(page.getByTestId('total')).toHaveText('1.50 ETH')
  await alterarEdicao(page, { preco: '0.60' })

  await page.getByRole('button', { name: 'Confirmar pedido' }).click()

  // O Pedido não é enviado; o colecionador vê o total novo ao lado do anterior.
  const aviso = page.getByRole('alert', { name: 'Mudanças na cotação' })
  await expect(aviso).toContainText('Total: de 1.50 ETH para 1.80 ETH')
  await expect(page.getByTestId('total')).toHaveText('1.80 ETH')
  expect(await pedidosRecebidos(page)).toHaveLength(0)
  await expect(page.getByRole('button', { name: 'Confirmar pedido' })).toBeDisabled()

  // Só depois de nova confirmação dele o Pedido é enviado.
  await page.getByRole('button', { name: 'Aceitar novos valores' }).click()
  expect(await pedidosRecebidos(page)).toHaveLength(0)
  await page.getByRole('button', { name: 'Confirmar pedido' }).click()

  await expect(page.getByRole('status')).toContainText('total 1.80 ETH')
  const pedidos = await pedidosRecebidos(page)
  expect(pedidos).toHaveLength(1)
  expect(pedidos[0].total).toBe('1.80')
})

test('Edição sem Disponibilidade para a quantidade do Carrinho', async ({ page }) => {
  await abrirCarrinho(page)
  await expect(page.getByTestId('total')).toHaveText('1.50 ETH')
  await alterarEdicao(page, { quantidadeConfirmavel: 2 })

  await page.getByRole('button', { name: 'Confirmar pedido' }).click()

  await expect(page.getByText('A quantidade não pode ser confirmada')).toBeVisible()
  expect(await pedidosRecebidos(page)).toHaveLength(0)
  await expect(page.getByRole('button', { name: 'Confirmar pedido' })).toBeDisabled()
})
