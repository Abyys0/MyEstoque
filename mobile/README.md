# README - MyStock Mobile

Aplicativo React Native para controle de estoque com leitura de código de barras.

## 🚀 Como Executar

### Pré-requisitos
- Node.js v16+
- Android Studio (para Android)
- Xcode (para iOS)

### Instalação

```bash
cd mobile
npm install
```

### Executar no Android

```bash
npm run android
```

### Executar no iOS

```bash
npm run ios
```

## 📁 Estrutura

```
src/
├── screens/       # Telas (Home, Scan, Inventory, etc)
├── components/    # Componentes reutilizáveis
├── services/      # Serviços (API, WebSocket, Auth)
├── utils/         # Stores (Zustand), helpers
└── assets/        # Imagens, ícones
```

## 🔧 Configuração

Crie um arquivo `.env` na raiz do projeto:

```
REACT_APP_API_URL=http://192.168.1.100:3000/api
REACT_APP_SOCKET_URL=http://192.168.1.100:3000
```

## 📚 Funcionalidades

- ✅ Leitura de código de barras
- ✅ Gerenciamento de estoque
- ✅ Sincronização em tempo real (WebSocket)
- ✅ Autenticação JWT
- ✅ Armazenamento local (AsyncStorage)

## 🔌 Dependências Principais

- React Native
- React Navigation
- React Native Vision Camera
- Zustand (State Management)
- Axios (HTTP Client)
- Socket.io Client
