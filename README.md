# 📦 MyStock - Sistema de Gestão de Estoque Inteligente

Sistema completo de gerenciamento de estoque com scanner de código de barras, interface intuitiva e recursos avançados para controle empresarial.

## ✨ Funcionalidades Principais

### 📱 Mobile App
- **Scanner de Código de Barras**: Escaneamento rápido via câmera (ML Kit/ZXing)
- **Entrada/Saída de Produtos**: Registro automático com data, hora e usuário
- **Consulta de Estoque**: Busca por nome, categoria ou código
- **Interface Intuitiva**: Design moderno, responsivo com modo escuro
- **Notificações Push**: Alertas de validade e estoque crítico

### 💻 Web Dashboard
- **Painel Administrativo**: Visão geral do estoque
- **Gráficos de Movimentação**: Análise visual de entrada/saída
- **Relatórios**: Exportação em PDF/Excel
- **Alertas Inteligentes**: Baixo estoque, validade próxima
- **Gestão de Usuários**: Controle de permissões

### 🔐 Sistema Multiusuário
- **Admin**: Acesso completo ao sistema
- **Operador**: Entrada/saída de produtos
- **Visualizador**: Apenas consulta de estoque

## 🏗️ Arquitetura

```
MyStock/
├── backend/          # API Node.js + Express + Firebase
├── mobile/           # App React Native + Expo
├── web/              # Dashboard React + TypeScript
└── shared/           # Tipos e utilitários compartilhados
```

## 🚀 Tecnologias

### Backend
- Node.js + Express + TypeScript
- Firebase (Firestore + Authentication + Cloud Functions)
- Socket.io (Real-time updates)
- Firebase Cloud Messaging (Push notifications)

### Mobile
- React Native + Expo
- Expo Camera + Barcode Scanner
- React Navigation
- Zustand (State management)
- Notifee (Push notifications)

### Web
- React + TypeScript
- Recharts (Gráficos)
- TailwindCSS
- React Query
- Zustand

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI
- Conta Firebase

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/Abyys0/MyEstoque.git
cd MyEstoque
```

### 2. Configure o Firebase
- Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
- Ative Firestore, Authentication e Cloud Messaging
- Baixe os arquivos de configuração

### 3. Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure as variáveis de ambiente
npm run dev
```

### 4. Mobile
```bash
cd mobile
npm install
# Configure o Firebase no app.json
npx expo start
```

### 5. Web
```bash
cd web
npm install
npm start
```

## 📱 Features do App Mobile

- ✅ Scanner de código de barras em tempo real
- ✅ Entrada rápida de produtos
- ✅ Histórico de movimentações
- ✅ Busca inteligente
- ✅ Modo offline com sincronização
- ✅ Notificações push
- ✅ Modo escuro/claro
- ✅ Acessibilidade

## 💼 Dashboard Web

- ✅ Visão geral do estoque
- ✅ Gráficos interativos
- ✅ Relatórios personalizados
- ✅ Gestão de produtos
- ✅ Controle de usuários
- ✅ Exportação de dados
- ✅ Auditoria de ações

## 🔔 Sistema de Notificações

- Estoque baixo (< quantidade mínima)
- Validade próxima (configur��vel)
- Produtos sem movimentação
- Relatórios agendados

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

Desenvolvido por Felipe - [Abyys0](https://github.com/Abyys0)
