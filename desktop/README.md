# README - MyStock Desktop

Aplicativo desktop Electron para MyStock.

## 🚀 Como Executar

### Pré-requisitos
- Node.js v16+
- npm ou yarn

### Instalação

```bash
cd desktop
npm install
```

### Executar em Desenvolvimento

```bash
npm run electron-dev
```

Isso vai iniciar tanto o React dev server quanto o Electron.

### Build para Produção

```bash
npm run electron-build
```

Será criado um instalador para sua plataforma.

## 📁 Estrutura

```
src/
├── main/              # Processo principal do Electron
│   ├── main.ts
│   └── preload.ts
├── components/        # Componentes React
├── services/          # Serviços (API, WebSocket)
├── App.tsx           # Componente principal
├── App.css           # Estilos
└── index.tsx         # Ponto de entrada
public/
└── index.html        # Template HTML
```

## 🔧 Funcionalidades

- ✅ Interface desktop moderna
- ✅ Integração com câmera (via OpenCV ou similar)
- ✅ Leitura de código de barras
- ✅ Gerenciamento de estoque
- ✅ Sincronização com backend

## 🔌 Comunicação

```javascript
// Servidor backend
// http://localhost:3000/api

// WebSocket
// http://localhost:3000
```

## 📦 Dependências

- React - UI Library
- Electron - Desktop framework
- Axios - HTTP Client
- Socket.io Client - WebSocket
