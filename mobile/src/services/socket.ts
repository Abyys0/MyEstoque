import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../config';

class SocketService {
  private socket: Socket | null = null;

  connect(userId: string) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: { userId },
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinStockUpdates() {
    this.socket?.emit('join_stock_updates');
  }

  leaveStockUpdates() {
    this.socket?.emit('leave_stock_updates');
  }

  joinProduct(productId: string) {
    this.socket?.emit('join_product', productId);
  }

  leaveProduct(productId: string) {
    this.socket?.emit('leave_product', productId);
  }

  onStockUpdated(callback: (data: any) => void) {
    this.socket?.on('stock_updated', callback);
  }

  onProductUpdated(callback: (data: any) => void) {
    this.socket?.on('product_updated', callback);
  }

  offStockUpdated() {
    this.socket?.off('stock_updated');
  }

  offProductUpdated() {
    this.socket?.off('product_updated');
  }
}

export default new SocketService();
