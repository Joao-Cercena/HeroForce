# 🦸 HeroForce

HeroForce é uma aplicação Fullstack construída com **React**, **NestJS**, **TypeORM** e **PostgreSQL**, projetada para o **gerenciamento de heróis e seus projetos**.

---

## 🔗 Deploy

- 🌐 **Frontend**: [https://heroforce.onrender.com](https://heroforce.onrender.com)
- 🛠️ **Backend**: [https://heroforce-api.onrender.com](https://heroforce-api.onrender.com)

---

## 🚀 Tecnologias Utilizadas

### Frontend

- ReactJS
- TypeScript
- React Router
- CSS Modules

### Backend

- NestJS
- TypeORM
- PostgreSQL
- JWT (JSON Web Token)
- bcryptjs
- class-validator

### Testes

- Jest (backend)

---

## 📦 Instalação

### 🔧 Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [PostgreSQL](https://www.postgresql.org/)
- NPM ou Yarn

### 📁 Clonando o repositório

```bash
git clone https://github.com/Joao-Cercena/HeroForce.git
cd heroforce
```

---

## 🛠 Configuração do Banco de Dados

No arquivo `typeorm.config.ts` dentro da pasta `heroforce-backend/src` altere as configurações do banco de dados

Certifique-se de que o seu banco, no caso do exemplo `heroforce`, exista antes de iniciar o backend.

---

## 📄 Arquivo .env

Antes de rodar a aplicação, crie um arquivo `.env` na raiz do diretório `heroforce-backend` com as seguintes variáveis:

```env
# JWT
JWT_SECRET=seu-super-poder
JWT_EXPIRATION=1d

# Banco de Dados
DATABASE_URL=postgres://postgres:postgres@localhost:5432/heroforce
```

Essas variáveis são usadas para a autenticação JWT no backend.

Crie também um arquivo `.env` na raiz do diretório `heroforce-frontend` com a seguinte variável:

```env
# API
REACT_APP_API_URL=http://localhost:3001
```

Essa variável é usada para fazer a conexão com o backend.

---

## ▶️ Executando a Aplicação

### 1. Instale as dependências

```bash
cd heroforce-frontend
npm install

cd ../heroforce-backend
npm install
```

### 2. Inicie tudo com um único comando

Na raiz do projeto execute:

```bash
npm install
npm run start
```

---

## 📚 Documentação da API

Acesse a documentação Swagger da API em:

[Acesse aqui](https://heroforce-api.onrender.com/api)

Use para testar os endpoints, visualizar schemas e adicionar seu token de autenticação (Authorize).

## 🧪 Rodando os Testes

### Backend

```bash
cd heroforce-backend
npm run test
```

### Frontend

```bash
cd heroforce-frontend
npm run test
```
---

## 👤 Usuário Inicial

Na primeira execução do backend um **usuário administrador** é criado automaticamente:

- **Nome:** Stan Lee
- **Email:** `stan.lee@heroforce.com`
- **Senha:** `Excelsior#1962`

---

## 🧠 Escolha do Personagem

Eu escolhi o **Donatello**, das Tartarugas Ninja, para representar meu perfil como desenvolvedor.

Donatello é o dev da equipe: criativo, calmo e focado em soluções técnicas. Ele combina bastante com o perfil de um desenvolvedor Fullstack, pois ele cria ferramentas e também utiliza nas batalhas. É ele quem resolve os problemas com lógica, desenvolvendo soluções sólidas e inteligentes.

**E quem não gosta de uma pizza? 🍕**

Meu usuário é criado na primeira execução do backend com os seguintes dados:

- **Nome:** João Vitor Cercená
- **Email:** `joao.cercena@heroforce.com`
- **Senha:** `123456`

---

## 📌 Funcionalidades

- ✅ Registro e login com autenticação JWT
- ✅ Cadastro e listagem de projetos com métricas
- ✅ Edição e filtro de projetos
- ✅ Controle de permissões: heróis e administradores
- ✅ Interface com feedback visual via toasts
- ✅ Testes automatizados com Jest (backend e frontend)

---

## 📄 Licença

Este projeto está licenciado sob os termos do MIT.

---