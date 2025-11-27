# Documentação de Setup Completo

## Estrutura Geral do Projeto

```
MyStock/
├── mobile/              # React Native (iOS/Android)
├── desktop/             # Electron (Windows/Mac/Linux)
├── backend/             # Node.js + Express
├── shared/              # Código compartilhado (tipos, utilitários)
├── docs/                # Documentação
└── README.md           # Este arquivo
```

## ⚙️ Setup Inicial

### 1. Clonar o Repositório

```bash
cd MyStock
```

### 2. Backend (Node.js)

```bash
cd backend
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Editar .env conforme necessário
# Por padrão usa mock data (sem banco de dados)

# Executar
npm run dev
# Servidor rodará em http://localhost:3000
```

### 3. Mobile (React Native)

```bash
cd mobile
npm install

# Android
npm run android

# iOS (apenas em Mac)
npm run ios
```

### 4. Desktop (Electron + React)

```bash
cd desktop
npm install

# Desenvolvimento
npm run electron-dev

# Build
npm run electron-build
```

## 🗄️ Banco de Dados

### Opção 1: Mock (Padrão)
- Sem dependências externas
- Dados em memória (perdem ao reiniciar)
- Perfeito para testes

### Opção 2: PostgreSQL (Recomendado para Produção)

```bash
# Instalar PostgreSQL
# Windows: https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql

# Criar banco de dados
createdb mystock

# Executar schema SQL (criar tabelas)
psql mystock < backend/db/schema.sql

# Configurar .env
DB_HOST=localhost
DB_NAME=mystock
DB_USER=postgres
DB_PASSWORD=sua_senha
```

### Schema SQL (Exemplo)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barcode VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  quantity INT DEFAULT 0,
  price DECIMAL(10, 2),
  category VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stock_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  action VARCHAR(50) NOT NULL,
  quantity INT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 Autenticação

### Fluxo de Login

1. **Cliente envia credenciais**
   ```
   POST /api/auth/login
   {
     "email": "user@example.com",
     "password": "senha123"
   }
   ```

2. **Backend valida e retorna token JWT**
   ```json
   {
     "success": true,
     "data": {
       "token": "eyJhbGciOiJIUzI1NiIs...",
       "user": {
         "id": "uuid",
         "email": "user@example.com",
         "name": "João"
       },
       "expiresIn": 86400
     }
   }
   ```

3. **Cliente armazena token localmente**
   - Mobile: AsyncStorage
   - Desktop: localStorage

4. **Cliente envia token em requisições subsequentes**
   ```
   Authorization: Bearer {token}
   ```

## 🔌 WebSocket - Sincronização em Tempo Real

### Conexão

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: { token: authToken }
});

socket.on('connect', () => {
  console.log('Conectado ao servidor');
});
```

### Events

**Cliente → Servidor:**
```javascript
// Escanear código de barras
socket.emit('scan:barcode', {
  barcode: '123456789',
  action: 'in',
  quantity: 5
});

// Solicitar sincronização
socket.emit('stock:sync');
```

**Servidor → Clientes (broadcast):**
```javascript
// Novo produto adicionado
socket.on('product:added', (product) => {
  console.log('Novo produto:', product);
});

// Estoque atualizado
socket.on('stock:updated', (data) => {
  console.log('Estoque atualizado:', data);
});

// Sincronização geral
socket.on('inventory:sync', (inventory) => {
  console.log('Sincronizando:', inventory);
});
```

## 📲 Funcionalidade de Câmera

### Android
- Usar `react-native-vision-camera` ou `react-native-camera`
- Requer permissão `android.permission.CAMERA` no AndroidManifest.xml

### iOS
- Usar `react-native-vision-camera`
- Requer `NSCameraUsageDescription` no Info.plist

### Desktop (Electron)
- Usar bibliotecas como `electron-camera` ou `@tensorflow/tfjs` com WebGL
- Alternativamente integrar OpenCV via Python (subprocess)

## 🛠️ Desenvolvimento Local

### Estrutura de Pastas Recomendada

```
Arquivos abertos no VS Code:
- backend/src/index.ts (Terminal 1)
- mobile/src/App.tsx (Terminal 2)
- desktop/src/App.tsx (Terminal 3)
```

### Fluxo de Desenvolvimento

1. **Terminal 1: Backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Terminal 2: Mobile (Android)**
   ```bash
   cd mobile
   npm run android
   ```

3. **Terminal 3: Desktop**
   ```bash
   cd desktop
   npm run electron-dev
   ```

## 🚀 Deployment

### Backend (Heroku/Railway/Vercel)

```bash
# Build
npm run build

# Deploy
git push heroku main
```

### Mobile

**Android:**
```bash
# Build APK
cd android && ./gradlew assembleRelease
```

**iOS:**
```bash
# Build IPA
cd ios && xcodebuild -scheme MyStock -configuration Release
```

### Desktop

```bash
# Build distributable
npm run electron-build
```

## 🐛 Troubleshooting

### Backend não conecta

```bash
# Verificar se porta 3000 está em uso
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### Câmera não funciona

- Verificar permissões do app
- Testar com app de câmera nativa
- Verificar drivers de câmera

### WebSocket falha

- Verificar CORS no backend
- Verificar firewall
- Verificar se backend está rodando

## 📚 Referências Úteis

- React Native: https://reactnative.dev
- Electron: https://www.electronjs.org
- Express: https://expressjs.com
- Socket.io: https://socket.io
- JWT: https://jwt.io
- PostgreSQL: https://www.postgresql.org

## 📝 Próximas Etapas

1. ✅ Setup inicial concluído
2. ⏳ Implementar autenticação completa
3. ⏳ Conectar banco de dados real (PostgreSQL)
4. ⏳ Implementar câmera e leitura de código
5. ⏳ Criar dashboard de relatórios
6. ⏳ Deploy em produção
