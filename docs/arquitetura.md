# Arquitetura do MyStock

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────┐
│                    Cliente (Frontend)               │
├──────────────────────┬──────────────────────────────┤
│   React Native       │      Electron               │
│   (Mobile)           │      (Desktop)              │
└──────────────────────┴───────────────┬──────────────┘
                                       │
                    ┌──────────────────▼──────────────┐
                    │     API Client (Shared)        │
                    │   - HTTP/REST                  │
                    │   - WebSocket (real-time)      │
                    └──────────────────┬──────────────┘
                                       │
          ┌────────────────────────────▼────────────────────────┐
          │              Node.js + Express Backend              │
          ├────────────────────────────────────────────────────┤
          │  Routes  │  Controllers  │  Services  │  Middlewares│
          └────────────────────────────────────────────────────┘
                                       │
                    ┌──────────────────▼──────────────┐
                    │      PostgreSQL / MongoDB      │
                    │     (Banco de Dados)           │
                    └───────────────────────────────┘
```

## Fluxo de Dados

### 1. Leitura de Código de Barras
```
Câmera (Mobile/Desktop) 
  → Processamento de Imagem 
  → Decodificação de Barcode 
  → API Client 
  → Backend 
  → Banco de Dados
```

### 2. Sincronização em Tempo Real
```
Cliente 1 atualiza estoque
  → Backend recebe via REST/WebSocket
  → Banco de Dados atualiza
  → Broadcast via WebSocket
  → Clientes 2, 3, 4 recebem atualização
```

## Tecnologias

### Frontend
- **React Native:** UI compartilhada (Mobile)
- **Electron:** Wrapper para desktop
- **TypeScript:** Type-safety
- **Redux/Context API:** Gerenciamento de estado
- **Axios/Fetch:** HTTP client

### Backend
- **Node.js:** Runtime
- **Express:** Web framework
- **TypeScript:** Type-safety
- **Socket.io:** WebSocket para real-time
- **JWT:** Autenticação

### Banco de Dados
- **PostgreSQL:** Banco relacional (recomendado)
- **MongoDB:** Alternativa NoSQL

## Padrões de Comunicação

### REST API
```
GET    /api/products          - Listar produtos
GET    /api/products/:id      - Obter produto
POST   /api/products          - Criar produto
PUT    /api/products/:id      - Atualizar produto
DELETE /api/products/:id      - Deletar produto

POST   /api/stock/scan        - Registrar leitura de barcode
GET    /api/stock/report      - Relatório de estoque
```

### WebSocket Events
```
client → server:
  - 'scan:barcode' - Nova leitura de código
  - 'stock:update' - Atualização de estoque

server → client (broadcast):
  - 'stock:updated' - Estoque foi atualizado
  - 'product:added' - Novo produto
  - 'inventory:sync' - Sincronização geral
```

## Fluxo de Autenticação

```
1. Login (email + senha)
   ↓
2. Backend valida credenciais
   ↓
3. Gera JWT token
   ↓
4. Cliente armazena token (localStorage/AsyncStorage)
   ↓
5. Requisições posteriores enviam token no header Authorization
   ↓
6. Middleware verifica token
```

## Estratégia de Cache Local

- **Mobile:** AsyncStorage para dados críticos
- **Desktop:** localStorage para dados críticos
- **Estratégia:** Cache-first, com sync periódico

## Escalabilidade Futura

- Fila de mensagens (RabbitMQ/Redis)
- CDN para assets
- Load balancing
- Database replication
- Microserviços
