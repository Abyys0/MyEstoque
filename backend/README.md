# README - MyStock Backend

Servidor Node.js + Express para o MyStock.

## 🚀 Como Executar

### Pré-requisitos
- Node.js v16+
- PostgreSQL (opcional, atualmente usa mock)

### Instalação

```bash
cd backend
npm install
```

### Variáveis de Ambiente

Crie um arquivo `.env`:

```bash
cp .env.example .env
```

Edite `.env` com suas configurações:

```
PORT=3000
JWT_SECRET=sua-chave-super-secreta
DB_HOST=localhost
DB_NAME=mystock
```

### Executar em Desenvolvimento

```bash
npm run dev
```

Servidor rodará em `http://localhost:3000`

### Build para Produção

```bash
npm run build
npm start
```

## 📁 Estrutura

```
src/
├── controllers/    # Lógica de negócio
├── routes/        # Definição de rotas
├── models/        # Tipos e interfaces
├── db/            # Conexão e scripts do BD
├── middlewares/   # Middlewares (auth, etc)
└── index.ts       # Entrada principal
```

## 📚 Endpoints

### Autenticação
```
POST /api/auth/login      - Fazer login
POST /api/auth/register   - Registrar usuário
POST /api/auth/refresh    - Renovar token
```

### Produtos
```
GET    /api/products           - Listar produtos
GET    /api/products/:id       - Obter produto
POST   /api/products           - Criar produto
PUT    /api/products/:id       - Atualizar produto
DELETE /api/products/:id       - Deletar produto
```

### Estoque
```
POST   /api/stock/scan         - Registrar leitura de barcode
GET    /api/stock/history      - Histórico de transações
GET    /api/stock/report       - Relatório de estoque
```

## 🔐 Autenticação

Todos os endpoints protegidos requerem token JWT no header:

```
Authorization: Bearer {token}
```

## 🔌 WebSocket

```javascript
// Cliente
socket.emit('scan:barcode', { barcode: '123', action: 'in', quantity: 5 });

// Servidor broadcast
socket.on('stock:updated', data => { ... });
```

## 🧪 Testes

```bash
npm test
```

## 📦 Dependências

- express - Web framework
- typescript - Type-safety
- jsonwebtoken - JWT auth
- bcryptjs - Password hashing
- socket.io - WebSocket
- cors - CORS middleware
- dotenv - Environment variables
