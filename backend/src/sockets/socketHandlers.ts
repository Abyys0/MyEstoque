import { Server, Socket } from 'socket.io';

export const setupSocketHandlers = (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join room for specific product updates
    socket.on('join_product', (productId: string) => {
      socket.join(`product_${productId}`);
      console.log(`Socket ${socket.id} joined product_${productId}`);
    });

    // Leave product room
    socket.on('leave_product', (productId: string) => {
      socket.leave(`product_${productId}`);
      console.log(`Socket ${socket.id} left product_${productId}`);
    });

    // Join general stock updates room
    socket.on('join_stock_updates', () => {
      socket.join('stock_updates');
      console.log(`Socket ${socket.id} joined stock_updates`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

// Helper function to emit stock update
export const emitStockUpdate = (io: Server, data: any): void => {
  io.to('stock_updates').emit('stock_updated', data);
  io.to(`product_${data.productId}`).emit('product_updated', data);
};
