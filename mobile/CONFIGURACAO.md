# 📱 Configuração do App Mobile - MyStock

## 🔧 Como conectar o app mobile ao backend

O app mobile precisa se conectar ao backend que está rodando no seu computador. Como o celular está em uma rede diferente (ou mesmo em uma rede local), você precisa usar o **endereço IP** do seu computador ao invés de `localhost`.

### Passo 1: Descobrir o IP do seu computador

**Windows:**
1. Abra o **Prompt de Comando** (cmd)
2. Digite: `ipconfig`
3. Procure por **"Adaptador de Rede sem Fio"** ou **"Ethernet adapter"**
4. Anote o valor de **IPv4 Address** (ex: `192.168.1.10`)

### Passo 2: Atualizar o arquivo de configuração

Abra o arquivo `mobile/services/api.ts` e altere a linha:

```typescript
const API_URL = 'http://localhost:3000/api';
```

Para:

```typescript
const API_URL = 'http://SEU_IP_AQUI:3000/api';
```

**Exemplo:**
```typescript
const API_URL = 'http://192.168.1.10:3000/api';
```

### Passo 3: Verificar o backend

Certifique-se de que o backend está rodando:

```bash
cd backend
npm run dev
```

O backend deve estar acessível em `http://localhost:3000`

### Passo 4: Reiniciar o app mobile

```bash
cd mobile
npx expo start --tunnel
```

Escaneie o novo QR Code com o Expo Go.

## 🔥 Firewall do Windows

Se ainda não funcionar, pode ser o firewall do Windows bloqueando a conexão. Para permitir:

1. Abra **Firewall do Windows** → **Configurações Avançadas**
2. Clique em **Regras de Entrada**
3. Clique em **Nova Regra...**
4. Selecione **Porta** → Avançar
5. TCP → Portas específicas: `3000`
6. Permitir a conexão
7. Marque todos os perfis (Domínio, Privado, Público)
8. Nome: "MyStock Backend"

## ✅ Testando a conexão

Teste se o backend está acessível do celular abrindo o navegador do celular e acessando:

```
http://SEU_IP:3000/api/health
```

Se retornar `{"status":"ok"}`, está funcionando!

## 📊 Sincronização com Dashboard

Agora quando você adicionar um produto pelo app mobile:

1. O produto é enviado para o backend via API
2. O backend salva no banco de dados
3. O dashboard web (localhost:3001) mostra o produto automaticamente
4. Via WebSocket, atualizações aparecem em tempo real!

## 🚀 Funcionalidades implementadas

- ✅ **Scanner funcionando** - Detecta códigos de barras
- ✅ **Busca produtos na API** - Verifica se produto já existe
- ✅ **Adiciona produtos** - Salva no backend
- ✅ **Lista estoque** - Carrega do backend
- ✅ **Indicador de loading** - Mostra quando está carregando
- ✅ **Modo offline** - Funciona mesmo sem conexão (com aviso)
- ✅ **Relatórios** - Estatísticas do estoque

## 🐛 Troubleshooting

### "Network Error" / "Não foi possível conectar ao servidor"

1. Verifique se o backend está rodando
2. Verifique se usou o IP correto (não localhost)
3. Verifique o firewall
4. Certifique-se de que o celular e PC estão na mesma rede Wi-Fi

### App não atualiza após mudança no código

```bash
# Limpe o cache do Expo
npx expo start --clear
```
