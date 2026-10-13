# catalogo-filmes
# Catálogo de Filmes Studio Ghibli Problema 11

Aplicação web para consultar e explorar os filmes do Studio Ghibli,
desenvolvida como 1ª Avaliação da disciplina de Programação Web
(UESPI, Tecnologia em Sistemas de Computação, Prof. Eyder Rios).

## Integrantes

- Matheus Soares Diniz Couto

## Descrição

O usuário visualiza o catálogo de filmes, pesquisa pelo título,
ordena a listagem e consulta os detalhes de cada filme em uma janela
modal. Todos os dados são obtidos em tempo de execução pela API.

## Funcionalidades

- Listagem de filmes com título, ano, diretor e pôster
- Pesquisa por título (sem diferenciar maiúsculas, minúsculas e acentos)
- Botão para limpar a pesquisa e voltar à listagem completa
- Ordenação por título, ano de lançamento e avaliação
- Detalhes do filme: título, título original, imagem, descrição,
  diretor, produtor, ano, duração e avaliação
- Mensagens de carregamento, erro e ausência de resultados
- Tratamento de imagens e dados ausentes
- Layout responsivo e acessível (HTML semântico, navegação por teclado)

## API utilizada

[Studio Ghibli API](https://ghibliapi.dev/), endpoint `GET /films`.
As descrições dos filmes são exibidas no idioma fornecido pela API (inglês).

Documentação:(https://ghibliapi.dev/)
Endpoint utilizado: `GET https://ghibliapi.vercel.app/films`

## Tecnologias

- HTML5
- CSS3
- JavaScript (sem frameworks), com `fetch` e `async/await`

## Como executar

1. Clone o repositório:
   `git clone https://github.com/[usuario]/catalogo-filmes.git`
2. Abra a pasta no VS Code.
3. Abra o `index.html` com a extensão Live Server
   (ou diretamente no navegador).
4. É necessário ter conexão com a internet para acessar a API.