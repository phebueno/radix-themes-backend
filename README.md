# RadixThemes API
O RadixThemes é um serviço para pesquisa de assuntos e de palavras que possam ser de seu interesse. Este é a parte relativa ao servidor, e a parte de front-end do serviço está disponível em: https://github.com/phebueno/radix-themes-frontend.

## Sobre
Este é um serviço API que dispõe de diversas rotas para receber requisições, realizar consultas na internet, guardar informações e enviá-las para o usuário. Para as pesquisas, é utilizada a API da GDELT 2.0 API, cuja documentação está disponível em https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/. A partir de um certo Assunto definido, e com palavras-chave, a API associa ambos a Links encontrados pelo GDELT, disponibilizando-os para o usuário. O sistema também faz uso de paginações tanto para as requisições de Assuntos, quantos a de seus Links que foram criados. Assim, ele permite:

- Criação, Consulta, Atualização e Deleção de Assuntos
- Pesquisa e Retorno de Links

## Tecnologias
 ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
 ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
 ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
 ![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
 ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
 ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
 - TypeORM, Supertest

## Instalação e como usar
1. Clone este repositório.
2. Para instalar:
```bash
$ npm install
```
3. O projeto dispõe de um arquivo docker-compose.yml, basta simplesmente, com Docker e Docker-Compose instalados, usar o comando para criar a base de dados:
```bash
$ docker-compose-up
```
4. Crie um arquivo .env com as variáveis presentes no .env.example (os valores precisam ser os mesmos utilizados pelo docker-compose.myl
5. Para rodar o aplicativo, use:
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Testes
- O projeto possui testes unitários para sua camada de serviço com mais de +80% de cobertura. Ele possui alguns testes também para a camada de controladores, e ambos usam dados mockados. Para rodá-los:
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Documentação API
O serviço conta com integração com Swagger para documentação de API, disponível ao rodar a aplicação em desenvolvimento e acessar ao rota http://localhost:3000/api, ou de porta semelhante. Lá estão disponíveis os objetos de entrada e saída, queries, DTOs e todas as rotas.
Segue um resumo dos endpoints:
- POST /themes/ - Posta um Assunto, enviando no seu corpo título e palavras-chave
- GET /themes - Retorna todos os temas com paginação
- PUT /themes/:id - Atualiza um Assunto pelo seu ID, enviando no seu corpo título e palavras-chave
- DELETE /themes/:id - Delete um Assunto pelo seu ID
- GET /themes/:id/search-news - Busca e associa notícias ao Assunto pelo seu ID, utilizando a API GDELT
- GET /themes/:id - Retorna um único Tema com seus Links se estiver disponível.
