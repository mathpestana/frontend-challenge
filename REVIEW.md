# REVIEW — Cotação desatualizada na hora de comprar

Problema escolhido (escala M): o preço ou a Disponibilidade muda com o NFT já no Carrinho e o checkout não pode confirmar com Cotação desatualizada (README, seção 7).

## O que eu pedi na sessão de Plan

Sessão nova, com só o `RESEARCH.md`, o contexto **Compra** e 4 termos do glossário (Carrinho, Cotação, Pedido, Disponibilidade no sentido de Compra). Pedi a ADR (`docs/adr/0001-cotacao-desatualizada.md`) e a spec enxuta (`docs/cotacao-desatualizada-spec.md`) com 5 critérios EARS (um por padrão) e 3 cenários BDD, pelo menos 1 de erro ou limite, sem código.

## O que o agente devolveu

Uma ADR coerente (decisão: revalidar a Cotação antes de confirmar e exigir nova confirmação se mudou, com alternativas descartadas e trade-offs) e uma spec com os 5 padrões EARS e 3 cenários. Não inventou tecnologia e usou os termos do glossário. O cenário 3 (edição sem Disponibilidade) cobre erro/limite.

## O que eu rejeitei ou reescrevi, e por quê

| Item | Mudança | Por quê |
|---|---|---|
| Escala da spec | G → **M** | O problema tem uma decisão e um contexto; a atividade pede escala M. Escala G pede mais de uma ADR. |
| EARS 1 (ubíqua) | "usar a Cotação como única referência" → "mostrar os valores da Cotação no resumo do Carrinho e informar toda mudança recebida com o Carrinho aberto" | O original quase repetia o EARS 2 e era difícil de testar. O novo cobre o passo 3 do cenário da seção 7 (l. 168), que nenhum critério cobria. Mantive o padrão ubíquo para os 5 padrões continuarem presentes. |
| EARS 5 | "deve não enviar" → "não deve enviar" | Português incorreto num critério. |
| Cenário 3 | Acrescentei "apenas 2 unidades disponíveis" | A atividade pede números concretos; sem eles o teste não sabe o que simular. |
| Origem dos critérios | Adicionei a tabela "Origem de cada critério" | Cada EARS aponta uma frase do RESEARCH e uma seção do README. Critério sem origem não entra. |
| "Como vou saber" | Troquei "semana 8, runner indefinido" por `npx playwright test` | A stack do README já define o Playwright. |
| ADR | Status "Proposta" → "Aceita" | A decisão foi revisada. |
| Capitalização | Padronizei os títulos dos cenários | Acabamento. |

## O que ficou sem resolver

- **EARS 1 e EARS 4 não têm teste permanente.** Os 3 testes Playwright cobrem os EARS 2, 3 e 5. O aviso com o Carrinho aberto (EARS 1) e o cupom (EARS 4) foram verificados só com teste descartável.
- **"Nova confirmação" foi interpretada como dois cliques** ("Aceitar novos valores" e depois "Confirmar pedido"). A spec não diz isso literalmente.
- **Falha na revalidação:** a ADR cita, mas nenhum EARS cobre. Hoje bloqueia o envio com mensagem, sem teste.
- **Números e fala do colecionador são reconstrução**, não medição nem citação. Não houve validação com um colecionador real.

## Sessão 3 (Implement)

3 testes Playwright passando (um por cenário), `tsc --noEmit` sem erro. Detalhes e limitações em [docs/status-sessao3.md](docs/status-sessao3.md).
