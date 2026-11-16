// Valores em ETH trafegam como string decimal. A aritmética usa inteiros
// (BigInt) na menor unidade (18 casas), nunca float.
export type Eth = string

const CASAS = 18
const ESCALA = 10n ** BigInt(CASAS)

export function paraUnidades(valor: Eth): bigint {
  const m = /^(-?)(\d+)(?:\.(\d+))?$/.exec(valor.trim())
  if (!m) throw new Error(`Valor ETH inválido: "${valor}"`)
  const [, sinal, inteira, fracao = ''] = m
  if (fracao.length > CASAS) throw new Error(`Valor ETH com mais de ${CASAS} casas: "${valor}"`)
  const unidades = BigInt(inteira) * ESCALA + BigInt(fracao.padEnd(CASAS, '0'))
  return sinal === '-' ? -unidades : unidades
}

// Normaliza para ao menos 2 casas ("1.5" -> "1.50"), sem zeros à direita além disso.
export function deUnidades(unidades: bigint): Eth {
  const negativo = unidades < 0n
  const abs = negativo ? -unidades : unidades
  const inteira = abs / ESCALA
  let fracao = (abs % ESCALA).toString().padStart(CASAS, '0').replace(/0+$/, '')
  fracao = fracao.padEnd(2, '0')
  return `${negativo ? '-' : ''}${inteira}.${fracao}`
}

export const igualEth = (a: Eth, b: Eth): boolean => paraUnidades(a) === paraUnidades(b)

export const somarEth = (a: Eth, b: Eth): Eth => deUnidades(paraUnidades(a) + paraUnidades(b))

export const subtrairEth = (a: Eth, b: Eth): Eth => deUnidades(paraUnidades(a) - paraUnidades(b))

export function multiplicarEth(valor: Eth, quantidade: number): Eth {
  if (!Number.isInteger(quantidade) || quantidade < 0) {
    throw new Error(`Quantidade deve ser inteira e não negativa: ${quantidade}`)
  }
  return deUnidades(paraUnidades(valor) * BigInt(quantidade))
}

// Percentual em pontos-base inteiros (1000 = 10%), truncando na menor unidade.
export function percentualEth(valor: Eth, pontosBase: number): Eth {
  if (!Number.isInteger(pontosBase)) throw new Error('Percentual deve ser inteiro em pontos-base')
  return deUnidades((paraUnidades(valor) * BigInt(pontosBase)) / 10000n)
}
