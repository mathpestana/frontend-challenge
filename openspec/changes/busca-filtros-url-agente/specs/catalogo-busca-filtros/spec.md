# Spec Delta

## Purpose

Define como o catálogo mantém busca, filtro de preço máximo e página na URL, de modo que o estado de consulta sobreviva a refresh e à navegação pelo histórico.

## ADDED Requirements

### Requirement: Busca e filtro compõem a URL e o resultado
O catálogo SHALL refletir a busca em `q` e o preço máximo (em ETH) em `precoMax` na URL, e SHALL listar somente NFTs que casam com todos os critérios informados.

#### Scenario: Busca e filtro compõem a URL
- **WHEN** o catálogo lista 48 NFTs em páginas de 12 e o colecionador busca "dragon" e filtra por preço máximo "0.50" ETH
- **THEN** a URL contém `q=dragon` e `precoMax=0.50`
- **AND** o catálogo mostra somente NFTs que casam com os dois critérios

#### Scenario: Critério único
- **WHEN** o colecionador busca "dragon" sem filtro de preço
- **THEN** a URL contém `q=dragon` e não contém `precoMax`
- **AND** o catálogo mostra somente NFTs que casam com a busca

### Requirement: Estado de consulta restaurado após refresh
O catálogo SHALL restaurar campo de busca, filtro de preço máximo e página a partir da URL ao carregar ou recarregar a página.

#### Scenario: Refresh mantém busca, filtros e página
- **WHEN** o colecionador está na página 2 com busca "dragon" e preço máximo "0.50" ETH e recarrega a página
- **THEN** o campo de busca mostra "dragon"
- **AND** o filtro de preço máximo mostra "0.50" ETH
- **AND** o catálogo continua na página 2

#### Scenario: Acesso direto por URL
- **WHEN** o colecionador abre diretamente uma URL com `q=dragon&precoMax=0.50&pagina=2`
- **THEN** o catálogo mostra o mesmo estado de um refresh nessa situação

### Requirement: Mudança de critério reinicia a paginação
O catálogo SHALL voltar à página 1, com `pagina=1` explícito na URL, sempre que `q` ou `precoMax` mudar.

#### Scenario: Mudar o filtro reinicia a paginação
- **WHEN** o colecionador está na página 3 do catálogo e altera o preço máximo para "0.20" ETH
- **THEN** o catálogo volta para a página 1
- **AND** a URL contém `pagina=1`

#### Scenario: Mudar a busca reinicia a paginação
- **WHEN** o colecionador está na página 3 e altera a busca para "wizard"
- **THEN** o catálogo volta para a página 1
- **AND** a URL contém `pagina=1`

#### Scenario: Trocar de página não reinicia critérios
- **WHEN** o colecionador com `q=dragon` e `precoMax=0.50` vai para a página 2
- **THEN** a URL contém `pagina=2`, `q=dragon` e `precoMax=0.50`

### Requirement: Parâmetros inválidos são normalizados
O catálogo MUST descartar `precoMax` não numérico ou negativo, tratar `pagina` menor que 1 como 1 e `pagina` além do total como a última página, e SHALL corrigir a URL sem exibir mensagem de erro.

#### Scenario: Preço máximo inválido
- **WHEN** o colecionador abre uma URL com `precoMax=abc`
- **THEN** o catálogo lista sem filtro de preço
- **AND** a URL é corrigida para não conter `precoMax`

#### Scenario: Página fora do intervalo
- **WHEN** o colecionador abre uma URL com `pagina=99` e o resultado tem 4 páginas
- **THEN** o catálogo mostra a página 4
- **AND** a URL é corrigida para `pagina=4`

#### Scenario: Página menor que 1
- **WHEN** o colecionador abre uma URL com `pagina=0`
- **THEN** o catálogo mostra a página 1
- **AND** a URL é corrigida para `pagina=1`

### Requirement: Histórico do navegador restaura o estado
O catálogo SHALL registrar uma nova entrada de histórico ao aplicar filtro de preço ou trocar de página, SHALL substituir a entrada atual durante a digitação da busca, e SHALL restaurar o estado anterior ao voltar.

#### Scenario: Voltar após trocar de página
- **WHEN** o colecionador vai da página 1 para a página 2 e usa o botão voltar do navegador
- **THEN** o catálogo mostra a página 1 com os mesmos critérios

#### Scenario: Digitação não polui o histórico
- **WHEN** o colecionador digita "dragon" na busca, uma letra por vez
- **THEN** a digitação não cria uma entrada de histórico por letra
