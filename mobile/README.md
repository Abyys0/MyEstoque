# 📱 MyStock Mobile

App mobile para o sistema MyStock - Gestão de Estoque com Scanner de Código de Barras.

## ✨ Funcionalidades

- 📷 **Scanner de Código de Barras**: Escaneamento rápido via câmera
- 📦 **Gestão de Produtos**: Adicionar, editar e visualizar produtos
- 📊 **Movimentação de Estoque**: Entrada e saída com registro automático
- 🔍 **Busca Inteligente**: Por nome, categoria ou código
- 🔔 **Notificações Push**: Alertas de estoque baixo e validade
- 🌓 **Modo Escuro**: Suporte a tema claro e escuro
- 📱 **Offline First**: Funciona sem conexão e sincroniza depois
- ⚡ **Real-time**: Atualizações em tempo real via WebSocket

## 🚀 Tecnologias

- React Native + Expo
- TypeScript
- Expo Camera + Barcode Scanner
- Firebase Authentication
- Zustand (State Management)
- Socket.io Client
- Axios

## 📋 Pré-requisitos

- Node.js 18+
- Expo CLI
- iOS Simulator ou Android Emulator (ou dispositivo físico)

## 🔧 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure o Firebase:
Edite `src/config/index.ts` com suas credenciais do Firebase.

3. Configure a URL da API:
```typescript
export const API_URL = 'http://SEU_IP:3000/api';
export const SOCKET_URL = 'http://SEU_IP:3000';
```

4. Inicie o app:
```bash
# iOS
npm run ios

# Android
npm run android

# Expo Go
npm start
```

## 📱 Telas

### Home
- Lista de produtos
- Filtros (Todos, Baixo Estoque, Vencendo)
- Busca rápida
- Botão flutuante para scanner e novo produto

### Scanner
- Escaneamento de código de barras
- Suporte a múltiplos formatos (EAN13, EAN8, UPC, Code128, QR)
- Flash controlável
- Entrada manual alternativa

### Detalhes do Produto
- Informações completas
- Histórico de movimentações
- Edição rápida
- Localização e validade

### Movimentação de Estoque
- Entrada/Saída/Ajuste
- Quantidade e motivo
- Feedback visual e háptico
- Registro automático de data e usuário

### Notificações
- Lista de alertas
- Estoque baixo
- Validade próxima
- Produtos sem movimentação

### Perfil
- Informações do usuário
- Configurações do app
- Modo escuro
- Logout

## 🔔 Notificações Push

O app suporta notificações push para:
- Estoque baixo (< quantidade mínima)
- Produtos vencendo em breve
- Produtos sem movimentação
- Alertas do sistema

## 🎨 Temas

- **Claro**: Design minimalista e limpo
- **Escuro**: Reduz cansaço visual
- **Auto**: Segue o sistema

## 📦 Build

### Android
```bash
eas build --platform android
```

### iOS
```bash
eas build --platform ios
```

## 🧪 Testes

```bash
npm test
```

## 📝 Licença

MIT
