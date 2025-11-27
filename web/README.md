# 💻 MyStock Web Dashboard

Dashboard web administrativo para o sistema MyStock - Gestão de Estoque Inteligente.

## ✨ Funcionalidades

- 📊 **Dashboard Interativo**: Visão geral com gráficos e métricas
- 📦 **Gestão de Produtos**: CRUD completo de produtos
- 📈 **Relatórios Avançados**: Análises e exportação de dados
- 👥 **Gestão de Usuários**: Controle de acesso e permissões
- 🔔 **Notificações**: Sistema de alertas em tempo real
- 🌓 **Tema Escuro**: Suporte a modo claro e escuro
- 📱 **Responsivo**: Funciona em desktop, tablet e mobile
- ⚡ **Real-time**: Atualizações instantâneas via WebSocket

## 🚀 Tecnologias

- React + TypeScript
- Vite
- TailwindCSS
- Recharts (Gráficos)
- React Router
- Zustand (State Management)
- Socket.io Client
- Axios

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn

## 🔧 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
Crie um arquivo `.env` com:
```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O app estará disponível em `http://localhost:3001`

## 🎨 Páginas

### Dashboard
- Cards com métricas principais
- Gráficos de movimentação
- Distribuição por categoria
- Tabela de movimentações recentes

### Produtos
- Lista com busca e filtros
- Adicionar/editar/excluir produtos
- Upload de imagens
- Visualização detalhada

### Estoque
- Registro de movimentações
- Entrada/Saída/Ajuste
- Histórico completo
- Produtos com estoque baixo
- Produtos vencendo

### Relatórios
- Resumo do estoque
- Relatório de movimentações
- Análise por período
- Exportação (CSV/Excel)
- Gráficos personalizáveis

### Usuários (Admin)
- Lista de usuários
- Gerenciar permissões
- Ativar/desativar usuários
- Histórico de ações

### Configurações
- Perfil do usuário
- Preferências do sistema
- Tema claro/escuro
- Notificações
- Segurança

## 📊 Gráficos

- **Linha**: Movimentações ao longo do tempo
- **Barra**: Comparação de entradas vs saídas
- **Pizza**: Distribuição por categoria
- **Área**: Valor total do estoque

## 🔐 Autenticação

Usa Firebase Authentication para login seguro.

Níveis de acesso:
- **Admin**: Acesso total
- **Operator**: Gestão de produtos e estoque
- **Viewer**: Apenas visualização

## 📦 Build

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`.

## 🚀 Deploy

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 🧪 Testes

```bash
npm test
```

## 📝 Licença

MIT
