# 🦸 HeroForce

HeroForce é uma aplicação Full Stack construída com **React**, **NestJS**, **TypeORM** e **PostgreSQL**, projetada para o **gerenciamento de heróis e seus projetos**.

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
Crie um arquivo `.env` dentro da pasta `heroforce-backend` com o seguinte conteúdo:

Certifique-se de que o seu banco, no caso do exemplo `heroforce`, exista antes de iniciar o backend.

---

## ▶️ Executando a Aplicação

### 1. Instale as dependências

```bash
cd heroforce-frontend
npm install

cd ../heroforce-backend
npm install
```

### 2. (Opcional) Inicie tudo com um único comando

Crie um `package.json` na raiz do projeto com:

```jsonc
{
  "scripts": {
    "start": "concurrently \"npm run start:frontend\" \"npm run start:backend\"",
    "start:frontend": "cd heroforce-frontend && npm start",
    "start:backend": "cd heroforce-backend && npm run start:dev"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

Depois:

```bash
npm install
npm run start
```

---

## 🧪 Rodando os Testes

### Backend

```bash
cd heroforce-backend
npm run test
```

## 👤 Usuário Inicial

Na primeira execução do backend, um **usuário administrador** é criado automaticamente:

- **Nome:** Stan Lee  
- **Email:** `stan.lee@heroforce.com`  
- **Senha:** `Excelsior#1962`

---

## 📌 Funcionalidades

- ✅ Registro e login com autenticação JWT  
- ✅ Cadastro e listagem de projetos com métricas  
- ✅ Edição e filtro de projetos  
- ✅ Controle de permissões: heróis e administradores  
- ✅ Interface com feedback visual via toasts  
- ✅ Testes automatizados com Jest (backend)  

---

## 📄 Licença

Este projeto está licenciado sob os termos do MIT.

---

