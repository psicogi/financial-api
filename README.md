<div align="center">

# Financial API

### A RESTful API for personal financial control built with NestJS and TypeScript

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)

[English](#-about) • [Português](#-sobre)

</div>

---

## 🇺🇸 English

### About

A RESTful API for personal financial control, featuring user authentication, transaction management, and a financial summary endpoint. Built with **NestJS**, **TypeScript**, and **PostgreSQL**.

### Features

-  User registration and authentication with **JWT**
-  Create, list, update and delete **transactions** (income/expense)
-  **Financial summary** with total income, total expenses and balance
-  **Pagination and filters** on transactions (type, category, date range)
-  **Data validation** with class-validator DTOs
-  **Auto-generated docs** with Swagger UI
-  **Unit tests** with Jest (17 tests passing)
-  **Layered architecture** (Controller → Service → Repository)

### Tech Stack

| Technology | Purpose |
|------------|---------|
| NestJS | Node.js framework |
| TypeScript | Type-safe JavaScript |
| PostgreSQL | Relational database |
| TypeORM | ORM for database access |
| JWT + Passport | Authentication |
| bcryptjs | Password hashing |
| class-validator | DTO validation |
| Swagger | API documentation |
| Jest | Unit testing |

### Getting Started

#### Prerequisites

- Node.js 18+
- PostgreSQL 14+

#### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/financial-api.git
cd financial-api

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your database credentials
```

#### Environment Variables

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=financial_db

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

#### Database Setup

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE financial_db;"
```

#### Running the App

```bash
# Development (with hot reload)
npm run start:dev

# Production
npm run build
npm run start:prod
```

API available at: `http://localhost:3000/api/v1`  
Swagger docs at: `http://localhost:3000/docs`

### Running Tests

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov
```

### API Endpoints

#### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register a new user | ❌ |
| POST | `/api/v1/auth/login` | Authenticate user | ❌ |

#### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/users/me` | Get current user data | ✅ |
| PUT | `/api/v1/users/me` | Update current user | ✅ |
| DELETE | `/api/v1/users/me` | Delete account | ✅ |

#### Transactions
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/transactions` | Create a transaction | ✅ |
| GET | `/api/v1/transactions` | List transactions (paginated) | ✅ |
| GET | `/api/v1/transactions/summary` | Get financial summary | ✅ |
| GET | `/api/v1/transactions/:id` | Get transaction by ID | ✅ |
| PUT | `/api/v1/transactions/:id` | Update a transaction | ✅ |
| DELETE | `/api/v1/transactions/:id` | Delete a transaction | ✅ |

#### Query Filters (`GET /transactions`)
| Param | Type | Example |
|-------|------|---------|
| `page` | number | `1` |
| `limit` | number | `10` |
| `type` | `income` \| `expense` | `income` |
| `category` | string | `Food` |
| `startDate` | YYYY-MM-DD | `2024-01-01` |
| `endDate` | YYYY-MM-DD | `2024-12-31` |

### Project Architecture

```
src/
├── auth/                    # Authentication module
│   ├── dto/                 # Login DTO
│   ├── guards/              # JWT Auth Guard
│   └── strategies/          # JWT Strategy
├── users/                   # Users module
│   ├── dto/                 # Create/Update User DTOs
│   ├── entities/            # User entity (TypeORM)
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.repository.ts
├── transactions/            # Transactions module
│   ├── dto/                 # Create/Update/Filter DTOs
│   ├── entities/            # Transaction entity (TypeORM)
│   ├── transactions.controller.ts
│   ├── transactions.service.ts
│   └── transactions.repository.ts
├── common/
│   └── decorators/          # @CurrentUser decorator
├── app.module.ts
└── main.ts
```

---

## 🇧🇷 Português

### Sobre

API RESTful de controle financeiro pessoal com autenticação de usuários, gerenciamento de transações e resumo financeiro. Construída com **NestJS**, **TypeScript** e **PostgreSQL**.

### Funcionalidades

-  Cadastro e autenticação de usuários com **JWT**
-  Criar, listar, atualizar e remover **transações** (entrada/saída)
-  **Resumo financeiro** com total de entradas, saídas e saldo
-  **Paginação e filtros** nas transações (tipo, categoria, período)
-  **Validação de dados** com DTOs e class-validator
-  **Documentação automática** com Swagger UI
-  **Testes unitários** com Jest (17 testes passando)
-  **Arquitetura em camadas** (Controller → Service → Repository)

### Como Rodar

#### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+

#### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/financial-api.git
cd financial-api

# Instale as dependências
npm install

# Copie as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do banco
```

#### Variáveis de Ambiente

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=financial_db

JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=7d
```

#### Banco de Dados

```bash
# Crie o banco de dados
psql -U postgres -c "CREATE DATABASE financial_db;"
```

#### Rodando o Projeto

```bash
# Desenvolvimento (com hot reload)
npm run start:dev

# Produção
npm run build
npm run start:prod
```

API disponível em: `http://localhost:3000/api/v1`  
Documentação Swagger: `http://localhost:3000/docs`

### Rodando os Testes

```bash
# Testes unitários
npm run test

# Cobertura de testes
npm run test:cov
```

### Endpoints da API

#### Auth
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/v1/auth/register` | Cadastrar novo usuário | ❌ |
| POST | `/api/v1/auth/login` | Autenticar usuário | ❌ |

#### Usuários
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/v1/users/me` | Dados do usuário atual | ✅ |
| PUT | `/api/v1/users/me` | Atualizar dados | ✅ |
| DELETE | `/api/v1/users/me` | Remover conta | ✅ |

#### Transações
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/v1/transactions` | Criar transação | ✅ |
| GET | `/api/v1/transactions` | Listar (com paginação) | ✅ |
| GET | `/api/v1/transactions/summary` | Resumo financeiro | ✅ |
| GET | `/api/v1/transactions/:id` | Buscar por ID | ✅ |
| PUT | `/api/v1/transactions/:id` | Atualizar | ✅ |
| DELETE | `/api/v1/transactions/:id` | Remover | ✅ |

### Arquitetura do Projeto

```
src/
├── auth/                    # Módulo de autenticação
│   ├── dto/                 # DTO de login
│   ├── guards/              # Guard JWT
│   └── strategies/          # Estratégia JWT
├── users/                   # Módulo de usuários
│   ├── dto/                 # DTOs de criação/atualização
│   ├── entities/            # Entidade User (TypeORM)
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.repository.ts
├── transactions/            # Módulo de transações
│   ├── dto/                 # DTOs de criação/atualização/filtro
│   ├── entities/            # Entidade Transaction (TypeORM)
│   ├── transactions.controller.ts
│   ├── transactions.service.ts
│   └── transactions.repository.ts
├── common/
│   └── decorators/          # Decorator @CurrentUser
├── app.module.ts
└── main.ts
```

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/seu-usuario">Giovania Dantas</a>
</div>
