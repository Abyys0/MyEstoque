# 🚀 Quick Start - MyStock

## Antes de Começar

Você tem uma estrutura completa de **3 aplicações** em **TypeScript**:

```
MyStock/
├── mobile/      → React Native (Android/iOS)
├── desktop/     → Electron (Windows/Mac/Linux)
├── backend/     → Node.js + Express (API)
└── docs/        → Documentação completa
```

## 1️⃣ Setup Rápido

### Backend (API)
```bash
cd backend
npm install
npm run dev
```
✅ Rodará em `http://localhost:3000`

### Mobile
```bash
cd mobile
npm install
npm run android        # Android
# ou
npm run ios           # iOS (Mac apenas)
```

### Desktop
```bash
cd desktop
npm install
npm run electron-dev
```

## 2️⃣ Como as Aplicações se Comunicam

```
┌─────────────────┐
│   React Native  │
│     (Mobile)    │
└────────┬────────┘
         │
         │ REST API + WebSocket
         ▼
┌─────────────────┐
│  Node.js API    │ ◄─────────────┐
│   (Backend)     │               │
└────────┬────────┘         REST API + WebSocket
         │                       │
         ▼                       │
   PostgreSQL        ┌───────────┴──────────┐
  (Mock por padrão)  │   Electron          │
                     │   (Desktop)         │
                     └─────────────────────┘
```

## 3️⃣ Estrutura de Pastas Explicada

### 📱 Mobile (`react-native/`)
```
src/
├── screens/       → Telas (Home, Scan, Inventory...)
├── components/    → Componentes reutilizáveis
├── services/      → API client, WebSocket, Auth
└── utils/         → Store global (Zustand)
```

### 💻 Desktop (`electron/`)
```
src/
├── main/          → Processo principal do Electron
├── components/    → Componentes React
├── services/      → API client, WebSocket
└── App.tsx        → Componente raiz
```

### 🔌 Backend (`node.js/`)
```
src/
├── routes/        → Definição de rotas
├── controllers/   → Lógica de negócio
├── models/        → Tipos TypeScript
├── middlewares/   → Autenticação, etc
└── index.ts       → Servidor Express
```

## 4️⃣ Endpoints Disponíveis

### Autenticação
```
POST /api/auth/login         → Fazer login
POST /api/auth/register      → Registrar usuário
POST /api/auth/refresh       → Renovar token
```

### Produtos
```
GET    /api/products         → Listar todos
POST   /api/products         → Criar novo
GET    /api/products/:id     → Obter um
PUT    /api/products/:id     → Atualizar
DELETE /api/products/:id     → Deletar
```

### Estoque
```
POST   /api/stock/scan       → Escanear código de barras
GET    /api/stock/history    → Histórico de movimentações
GET    /api/stock/report     → Relatório completo
```

## 5️⃣ Features Implementadas ✅

- ✅ Autenticação JWT (Login/Register)
- ✅ CRUD de Produtos
- ✅ Leitura de Código de Barras (estrutura)
- ✅ Histórico de Transações
- ✅ Relatórios de Estoque
- ✅ Sincronização em Tempo Real (WebSocket)
- ✅ TypeScript em toda stack
- ✅ Estrutura pronta para produção

## 6️⃣ Próximas Etapas

### Fase 1: Integração
- [ ] Testar conexão Mobile ↔ Backend
- [ ] Testar conexão Desktop ↔ Backend
- [ ] Verificar autenticação JWT

### Fase 2: Banco de Dados
- [ ] Instalar PostgreSQL
- [ ] Conectar ao backend
- [ ] Migrar de mock data para DB real

### Fase 3: Câmera
- [ ] Implementar câmera no Mobile
- [ ] Implementar câmera no Desktop
- [ ] Testar leitura de código de barras

### Fase 4: Produção
- [ ] Build para App Store / Google Play
- [ ] Build para Windows / Mac
- [ ] Deploy backend (Heroku/Railway)

## 7️⃣ Variáveis de Ambiente

### Backend (`.env`)
```
PORT=3000
JWT_SECRET=sua-chave-secreta-super-protegida
NODE_ENV=development
```

### Mobile (`.env`)
```
REACT_APP_API_URL=http://192.168.1.100:3000/api
REACT_APP_SOCKET_URL=http://192.168.1.100:3000
```

### Desktop (`.env`)
```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_SOCKET_URL=http://localhost:3000
```

## 8️⃣ Dúvidas Frequentes

**P: Onde fica o banco de dados?**
R: Por padrão é mock (memória). Veja `docs/setup.md` para PostgreSQL.

**P: Como adicionar novas rotas?**
R: Crie em `backend/src/routes/` e importe em `index.ts`.

**P: Como testar a câmera?**
R: Use a estrutura em `mobile/src/screens/ScanScreen.tsx`.

**P: Posso usar sem câmera?**
R: Sim! Acesse tudo via UI - câmera é opcional.

**P: Qual banco de dados usar?**
R: PostgreSQL (recomendado) ou MongoDB. Setup em `docs/setup.md`.

## 9️⃣ Estrutura Completa de Pastas

```
MyStock/
├── mobile/
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── desktop/
│   ├── src/
│   │   ├── main/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── db/
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── shared/
│   ├── types/
│   └── api-client/
│
├── docs/
│   ├── arquitetura.md
│   ├── api-endpoints.md
│   └── setup.md
│
├── .gitignore
└── README.md
```

## 🔟 Links Úteis

- 📖 [Setup Completo](docs/setup.md)
- 📋 [Arquitetura](docs/arquitetura.md)
- 📡 [API Endpoints](docs/api-endpoints.md)
- 🔗 [React Native Docs](https://reactnative.dev)
- ⚛️ [Electron Docs](https://www.electronjs.org)
- 🟢 [Node.js Docs](https://nodejs.org)

---

**Pronto para começar? Execute `npm run dev` em cada pasta! 🚀**
