# MyStock - Sistema de Controle de Estoque

Aplicativo multiplataforma para controle de estoque com leitura de código de barras.

## 🏗️ Arquitetura

- **Mobile:** React Native (iOS/Android)
- **Desktop:** Electron (Windows/Mac/Linux)
- **Backend:** Node.js + Express
- **Banco de Dados:** PostgreSQL
- **Linguagem:** TypeScript

## 📁 Estrutura do Projeto

```
MyStock/
├── mobile/          # App React Native
├── desktop/         # App Electron
├── backend/         # Servidor Node.js
├── shared/          # Código compartilhado (tipos, cliente API)
└── docs/            # Documentação
```

## 🚀 Como Começar

### Pré-requisitos
- Node.js v16+
- npm ou yarn
- PostgreSQL (para o backend)

### Instalação

```bash
# Backend
cd backend
npm install
npm run dev

# Mobile (emulador Android)
cd mobile
npm install
npm start

# Desktop
cd desktop
npm install
npm start
```

## 📚 Documentação

- [Arquitetura](./docs/arquitetura.md)
- [API Endpoints](./docs/api-endpoints.md)
- [Setup Completo](./docs/setup.md)

## 📝 Funcionalidades

- ✅ Leitura de código de barras (câmera)
- ✅ Controle de estoque em tempo real
- ✅ Sincronização entre dispositivos
- ✅ Relatórios e análises
- ✅ Offline-first (sincroniza quando conectado)

## 👥 Contribuindo

Abra uma issue ou pull request para sugerir melhorias.

## 📄 Licença

MIT
