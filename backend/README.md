# MyStock Backend

Backend API para o sistema MyStock - Sistema de Gestão de Estoque Inteligente.

## 🚀 Tecnologias

- Node.js + Express + TypeScript
- Firebase (Firestore + Authentication + Cloud Messaging)
- Socket.io (Real-time updates)
- Node-cron (Scheduled jobs)

## 📋 Pré-requisitos

- Node.js 18+
- Conta Firebase
- npm ou yarn

## 🔧 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Firebase.

3. Inicie o servidor:

**Desenvolvimento:**
```bash
npm run dev
```

**Produção:**
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/fcm-token` - Atualizar token FCM

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Buscar produto por ID
- `GET /api/products/barcode/:barcode` - Buscar por código de barras
- `POST /api/products` - Criar produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto

### Estoque
- `GET /api/stock/movements` - Listar movimentações
- `POST /api/stock/movement` - Registrar movimentação
- `GET /api/stock/low-stock` - Produtos com estoque baixo
- `GET /api/stock/expiring-soon` - Produtos com validade próxima

### Usuários
- `GET /api/users` - Listar usuários (Admin)
- `GET /api/users/:id` - Buscar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Desativar usuário

### Relatórios
- `GET /api/reports/stock-summary` - Resumo do estoque
- `GET /api/reports/movements` - Relatório de movimentações
- `GET /api/reports/export` - Exportar relatório

### Notificações
- `GET /api/notifications` - Listar notificações
- `PUT /api/notifications/:id/read` - Marcar como lida
- `PUT /api/notifications/read-all` - Marcar todas como lidas

## 🔐 Autenticação

Todas as rotas (exceto `/auth/register` e `/auth/login`) requerem autenticação via Firebase JWT token:

```
Authorization: Bearer <firebase_id_token>
```

## 👥 Permissões

- **Admin**: Acesso completo ao sistema
- **Operator**: Criar, editar produtos e movimentações
- **Viewer**: Apenas visualização

## 🔔 Jobs Agendados

- **09:00** - Verificação de estoque baixo
- **10:00** - Verificação de produtos vencendo
- **Segunda 11:00** - Produtos sem movimentação (30 dias)

## ⚡ WebSocket Events

- `stock_updated` - Atualização de estoque em tempo real
- `product_updated` - Atualização de produto

## 📦 Build

```bash
npm run build
```

Os arquivos compilados estarão em `dist/`.

## 🧪 Testes

```bash
npm test
```

## 📝 Licença

MIT
