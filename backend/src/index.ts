import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import productRoutes from './routes/productRoutes';
import stockRoutes from './routes/stockRoutes';
import authRoutes from './routes/authRoutes';
import { initializeDatabase } from './db/database';
import { authMiddleware } from './middlewares/authMiddleware';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas públicas
app.use('/api/auth', authRoutes);

// Middlewares de autenticação
app.use('/api', authMiddleware);

// Rotas protegidas
app.use('/api/products', productRoutes);
app.use('/api/stock', stockRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// WebSocket
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('scan:barcode', (data) => {
    console.log('Barcode scaneado:', data);
    // Processar e broadcast para outros clientes
    io.emit('stock:updated', data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Inicializar banco de dados e servidor
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await initializeDatabase();
    server.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

start();

export { io };
