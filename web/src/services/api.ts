import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 10000,
    });

    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth
  async login(idToken: string) {
    return this.api.post('/auth/login', { idToken });
  }

  async register(email: string, password: string, name: string) {
    return this.api.post('/auth/register', { email, password, name });
  }

  // Products
  async getProducts(params?: any) {
    return this.api.get('/products', { params });
  }

  async getProductById(id: string) {
    return this.api.get(`/products/${id}`);
  }

  async createProduct(data: any) {
    return this.api.post('/products', data);
  }

  async updateProduct(id: string, data: any) {
    return this.api.put(`/products/${id}`, data);
  }

  async deleteProduct(id: string) {
    return this.api.delete(`/products/${id}`);
  }

  // Stock
  async getStockMovements(params?: any) {
    return this.api.get('/stock/movements', { params });
  }

  async createStockMovement(data: any) {
    return this.api.post('/stock/movement', data);
  }

  async getLowStock() {
    return this.api.get('/stock/low-stock');
  }

  async getExpiringSoon() {
    return this.api.get('/stock/expiring-soon');
  }

  // Reports
  async getStockSummary() {
    return this.api.get('/reports/stock-summary');
  }

  async getMovementReport(params?: any) {
    return this.api.get('/reports/movements', { params });
  }

  // Notifications
  async getNotifications() {
    return this.api.get('/notifications');
  }

  async markNotificationAsRead(id: string) {
    return this.api.put(`/notifications/${id}/read`);
  }

  async markAllNotificationsAsRead() {
    return this.api.put('/notifications/read-all');
  }
}

export default new ApiService();
