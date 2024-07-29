# API Rest de Pesquisa de Satisfação do Cliente

- Desafio de construir uma api para pesquisa de satisfação do Cliente.

### Tecnologias utilizadas para realizar o desafio.

- NestJs - Framework
- Mongoose - ORM
- TypeScript - Linguagem utilizada
- Eslint - Para Formatação de código
- Prettier - Para Formatação de código
- Jest - Testes

## 1. Rodando a aplicação no Docker

```bash
docker compose up --build
```

### 1.1 Rodando a aplicação em modo de desenvolvimento

- Trocar o target dentro do docker compose para o stage de `dev`

##### Exemplo:

``` yml
build:
      context: .
      target: dev
```

- Rodando o comando para realizar o build da imagem e utilizar em ambiente de desenvolvimento

```bash
docker compose up --build
```

##### Romando os comandos dentro do container

- Para conseguirmos entrar dentro do container é somente executar o seguinte comando:

``` yml
docker compose exec api-survey /bin/sh
```

## 2. Rodando a aplicação localmente

#### Requisitos

- Possuir o node instalado na máquina

- Possuir NPM instalado na maquina

- Possuir MongoDb instalado na maquina

### 2.1. Instalando as depedencias

``` sh
npm i
```

### 2.1.1 Verificando as variaveis de ambiente

- Dentro do arquivo `.env.example` tem o exemplo de como a aplicação está esperando as variaveis de ambiente.

### 2.1.2 Rodando a aplicação

- Comando para rodar a aplicação.

``` sh
npm run start
```

## Teste

```bash
# Para somente rodar os testes
$ npm run test

# Para rodar o teste e gerar um arquivo mostrando as coberturas e detalhes
$ npm run test:cov
```

## Colection Postman

- Link da collection no postman que foi utilizado para testar, com intuito de auxiliar.

Link: https://drive.google.com/file/d/1G21ZAKNum41XXzZ6d-JDZajWn03QpCLx/view?usp=sharing

## Swagger 

- Foi também utilizado dentro da aplicação o `Swagger` com intutito de documentar os endpoints.

#### Para acessar o swagger

- Após a aplicação estar rodando. Somente acessar o "/api". Exemplo: **http://localhost:3000/api**
