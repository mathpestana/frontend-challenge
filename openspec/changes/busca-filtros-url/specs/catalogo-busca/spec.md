## ADDED Requirements

### Requirement: Estado do Catálogo na URL
O sistema SHALL refletir busca, filtro de preço máximo, ordenação e página do Catálogo nos parâmetros de busca da URL, e SHALL restaurar esse estado a partir da URL ao recarregar a página ou navegar pelo histórico.

#### Scenario: Busca e filtro compõem a URL
- **WHEN** o catálogo lista 48 NFTs em páginas de 12 e o colecionador busca "dragon" e filtra por preço máximo "0.50" ETH
- **THEN** a URL contém "q=dragon" e "precoMax=0.50"
- **AND** o catálogo mostra somente NFTs que casam com os dois critérios

#### Scenario: Refresh mantém busca, filtros e página
- **WHEN** o colecionador está na página 2 com busca "dragon" e preço máximo "0.50" ETH e recarrega a página
- **THEN** o campo de busca mostra "dragon"
- **AND** o filtro de preço máximo mostra "0.50" ETH
- **AND** o catálogo continua na página 2

### Requirement: Mudança de critério reinicia a paginação
O sistema SHALL voltar o Catálogo para a página 1 sempre que a busca ou qualquer filtro for alterado.

#### Scenario: Mudar o filtro reinicia a paginação
- **WHEN** o colecionador está na página 3 e altera o filtro de preço máximo para "0.20" ETH
- **THEN** o catálogo volta para a página 1
- **AND** a URL contém "pagina=1"
