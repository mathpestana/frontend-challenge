# Cenários originais — busca e filtros na URL (contexto Catálogo)

Texto escrito ANTES de rodar o agente. Serve de base para o DIFERENCAS.md.
Origem: README l. 52-53.

```gherkin
Funcionalidade: Busca e filtros que sobrevivem ao refresh

  Cenário: Busca e filtro compõem a URL
    Dado que o catálogo lista 48 NFTs em páginas de 12
    Quando o colecionador busca "dragon" e filtra por preço máximo "0.50" ETH
    Então a URL contém "q=dragon" e "precoMax=0.50"
    E o catálogo mostra somente NFTs que casam com os dois critérios

  Cenário: Refresh mantém busca, filtros e página
    Dado que o colecionador está na página 2 com busca "dragon" e preço máximo "0.50" ETH
    Quando ele recarrega a página
    Então o campo de busca mostra "dragon"
    E o filtro de preço máximo mostra "0.50" ETH
    E o catálogo continua na página 2

  Cenário: Mudar o filtro reinicia a paginação
    Dado que o colecionador está na página 3 do catálogo
    Quando ele altera o filtro de preço máximo para "0.20" ETH
    Então o catálogo volta para a página 1
    E a URL contém "pagina=1"
```
