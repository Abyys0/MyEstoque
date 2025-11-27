# Documentação da API REST

## Base URL
```
http://localhost:3000/api
```

## Autenticação
Todos os endpoints requerem token JWT no header:
```
Authorization: Bearer {token}
```

## Produtos

### Listar Produtos
```
GET /products
Query: ?page=1&limit=10&search=termo

Resposta:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "barcode": "123456789",
      "name": "Produto A",
      "quantity": 50,
      "price": 29.99,
      "lastUpdate": "2025-11-27T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "total": 100 }
}
```

### Obter Produto
```
GET /products/:id

Resposta:
{
  "success": true,
  "data": {
    "id": "uuid",
    "barcode": "123456789",
    "name": "Produto A",
    "quantity": 50,
    "price": 29.99,
    "description": "Descrição...",
    "category": "Eletrônicos"
  }
}
```

### Criar Produto
```
POST /products
Body:
{
  "barcode": "123456789",
  "name": "Novo Produto",
  "quantity": 0,
  "price": 49.99,
  "category": "Eletrônicos"
}

Resposta: 201 Created
{
  "success": true,
  "data": { ... produto criado ... }
}
```

### Atualizar Produto
```
PUT /products/:id
Body:
{
  "name": "Novo Nome",
  "price": 59.99
}

Resposta: 200 OK
```

### Deletar Produto
```
DELETE /products/:id

Resposta: 204 No Content
```

## Estoque

### Registrar Leitura de Código de Barras
```
POST /stock/scan
Body:
{
  "barcode": "123456789",
  "action": "in" | "out" | "adjust",
  "quantity": 5,
  "notes": "Compra de fornecedor"
}

Resposta:
{
  "success": true,
  "data": {
    "id": "transaction-uuid",
    "productId": "uuid",
    "barcode": "123456789",
    "productName": "Produto A",
    "quantityBefore": 50,
    "quantityAfter": 55,
    "action": "in",
    "timestamp": "2025-11-27T10:30:00Z"
  }
}
```

### Obter Histórico de Transações
```
GET /stock/history?productId=uuid&limit=20

Resposta:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "productId": "uuid",
      "action": "in",
      "quantity": 5,
      "timestamp": "2025-11-27T10:30:00Z"
    }
  ]
}
```

### Gerar Relatório de Estoque
```
GET /stock/report?from=2025-01-01&to=2025-11-27

Resposta:
{
  "success": true,
  "data": {
    "totalProducts": 100,
    "totalValue": 50000.00,
    "movementsByAction": {
      "in": 500,
      "out": 300,
      "adjust": 50
    },
    "products": [
      {
        "id": "uuid",
        "name": "Produto A",
        "quantity": 50,
        "value": 1500.00
      }
    ]
  }
}
```

## Autenticação

### Login
```
POST /auth/login
Body:
{
  "email": "user@example.com",
  "password": "senha123"
}

Resposta:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "expiresIn": 86400
  }
}
```

### Registrar
```
POST /auth/register
Body:
{
  "email": "user@example.com",
  "password": "senha123",
  "name": "John Doe"
}

Resposta: 201 Created
```

### Refresh Token
```
POST /auth/refresh
Body:
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}

Resposta:
{
  "success": true,
  "data": {
    "token": "novo-token-jwt"
  }
}
```

## Códigos de Erro

```
200 OK              - Sucesso
201 Created         - Criado com sucesso
204 No Content      - Deletado com sucesso
400 Bad Request     - Dados inválidos
401 Unauthorized    - Token inválido/expirado
403 Forbidden       - Sem permissão
404 Not Found       - Recurso não encontrado
500 Internal Error  - Erro no servidor
```

## WebSocket Events

### Cliente envia
```javascript
socket.emit('scan:barcode', {
  barcode: '123456789',
  action: 'in',
  quantity: 5
});

socket.emit('stock:sync');
```

### Servidor envia
```javascript
socket.on('stock:updated', {
  productId: 'uuid',
  newQuantity: 55
});

socket.on('product:added', {
  id: 'uuid',
  name: 'Novo Produto'
});
```
