# Tasks

## 1. Contrato e mocks da listagem

- [ ] 1.1 Documentar o contrato `GET` de NFTs (`q`, `precoMax`, `pagina`, tamanho 12; resposta com itens e total) e verificar que o documento descreve os três parâmetros
- [ ] 1.2 Criar fixtures com ao menos 48 NFTs variados em nome e preço, incluindo casos que casam e não casam com "dragon" e 0.50, e verificar com teste do handler MSW que 48 itens paginam em 4 páginas de 12
- [ ] 1.3 Implementar no handler MSW busca por substring sem diferenciar maiúsculas, filtro `precoMax` e paginação, e verificar com testes que a combinação retorna só itens que casam com ambos

## 2. Estado de consulta na URL

- [ ] 2.1 Definir o tipo do estado de consulta e a validação dos parâmetros da rota do catálogo (descartar `precoMax` inválido, limitar `pagina` a ≥ 1) e verificar com testes unitários dos cenários de parâmetro inválido
- [ ] 2.2 Ajustar `pagina` além do total para a última página ao receber o total da API, corrigindo a URL com replace, e verificar com teste do cenário `pagina=99`
- [ ] 2.3 Ligar a consulta (Query + Axios) aos parâmetros normalizados e verificar que a requisição enviada contém `q`, `precoMax` e `pagina` iguais aos da URL

## 3. Interface de busca, filtro e paginação

- [ ] 3.1 Implementar campo de busca e filtro de preço máximo que preenchem a URL (replace na digitação, entrada nova ao aplicar preço) e verificar que a URL contém `q=dragon` e `precoMax=0.50` no cenário 1
- [ ] 3.2 Reiniciar para `pagina=1` na mesma navegação ao mudar `q` ou `precoMax` e verificar com teste o cenário da página 3 para `precoMax=0.20`
- [ ] 3.3 Implementar controles de página que preservam `q` e `precoMax` e verificar que `pagina=2` mantém os critérios
- [ ] 3.4 Inicializar campo de busca, filtro e página a partir da URL e verificar o cenário de refresh na página 2 com "dragon" e 0.50

## 4. Testes E2E e verificação integrada

- [ ] 4.1 Escrever teste Playwright com os três cenários do usuário, mais acesso direto por URL, e verificar que passa com os mocks
- [ ] 4.2 Escrever teste Playwright de voltar/avançar do histórico (página e digitação sem uma entrada por letra) e verificar que passa
- [ ] 4.3 Registrar o formato de `precoMax`, o critério de busca e as decisões de histórico em `ARCHITECTURE.md` e verificar que o texto bate com a spec
