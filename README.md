# Jungle Backend

API REST desenvolvida com Node.js e TypeScript para gerenciamento de usuários, com persistência de dados em PostgreSQL.

Este projeto faz parte dos meus estudos de desenvolvimento backend, com foco em APIs REST, operações CRUD, validação de dados, consultas SQL e tratamento de erros.

## Tecnologias utilizadas

- **Node.js** — execução da aplicação.
- **TypeScript** — tipagem estática e organização do código.
- **PostgreSQL** — banco de dados relacional.
- **Neon** — hospedagem do banco de dados.
- **node:http** — criação do servidor HTTP.
- **pg** — integração com o PostgreSQL.
- **tsx** — execução de arquivos TypeScript durante o desenvolvimento.

## Funcionalidades

- Cadastrar usuários.
- Listar usuários cadastrados.
- Consultar um usuário pelo ID.
- Atualizar os dados de um usuário.
- Excluir usuários.
- Validar dados recebidos nas requisições.
- Tratar JSON inválido, rotas inexistentes e erros da aplicação.
- Persistir os dados em um banco PostgreSQL.

## Estrutura do projeto

```text
src/
├── routes/
│   └── usuarioRoutes.ts
├── services/
│   └── usuarioService.ts
├── types/
│   └── usuario.ts
├── cliente.ts
├── db.ts
├── server.ts
├── setup-db.ts
└── teste-db.ts
```

- **routes:** recebe as requisições HTTP e define as respostas.
- **services:** concentra as regras de negócio e as operações no banco.
- **types:** define os tipos utilizados pela aplicação.
- **db.ts:** configura a conexão com o PostgreSQL.
- **setup-db.ts:** cria a tabela de usuários.
- **teste-db.ts:** verifica a conexão com o banco.
- **cliente.ts:** permite realizar requisições à API pelo terminal.
- **server.ts:** inicializa o servidor HTTP.

## Configuração e execução

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure a conexão com o banco

Crie um arquivo `.env.local` na raiz do projeto e adicione sua variável de conexão:

```env
DATABASE_URL=sua_string_de_conexao
```

Substitua o valor pelo endereço de conexão do seu PostgreSQL. **Não compartilhe essa string nem a envie para o GitHub.**

### 3. Crie a tabela de usuários

```bash
npx tsx --env-file=.env.local src/setup-db.ts
```

### 4. Inicie o servidor

```bash
npx tsx watch --env-file=.env.local src/server.ts
```

Por padrão, o servidor utiliza a porta `3000`.

## Endpoints da API

A API disponibiliza os seguintes endpoints para gerenciamento de usuários:

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/usuarios` | Lista todos os usuários |
| GET | `/usuarios/:id` | Busca um usuário pelo ID |
| POST | `/usuarios` | Cadastra um novo usuário |
| PUT | `/usuarios/:id` | Atualiza nome e e-mail |
| DELETE | `/usuarios/:id` | Exclui um usuário |

### Exemplos de requisições

Os exemplos abaixo utilizam `http://localhost:3000` como endereço da API.

**Cadastrar um usuário**

```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nome":"Maria Silva","email":"maria@example.com"}'
```

**Listar usuários**

```bash
curl http://localhost:3000/usuarios
```

**Buscar um usuário pelo ID**

```bash
curl http://localhost:3000/usuarios/1
```

**Atualizar um usuário**

```bash
curl -X PUT http://localhost:3000/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{"nome":"Maria Souza","email":"maria.souza@example.com"}'
```

**Excluir um usuário**

```bash
curl -X DELETE http://localhost:3000/usuarios/1
```

### Códigos HTTP

- `200 OK` — requisição concluída com sucesso.
- `201 Created` — recurso criado com sucesso.
- `400 Bad Request` — dados inválidos ou JSON malformado.
- `404 Not Found` — rota ou usuário não encontrado.
- `500 Internal Server Error` — erro inesperado no servidor.

## Próximas melhorias

- Implementar testes automatizados.
- Melhorar a validação dos dados.
- Tratar e-mails duplicados.
- Implementar atualização parcial com PATCH.
- Aprimorar o tratamento de falhas na conexão com o banco.
- Estudar autenticação e autorização.
- Preparar a aplicação para implantação em produção.

---

Projeto desenvolvido para praticar conceitos de desenvolvimento backend com Node.js, TypeScript, APIs REST e PostgreSQL.
