import axios, { AxiosInstance, AxiosError } from 'axios';
import { auth } from './firebase';
import { API_URL } from '../config';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - logout user
          auth.signOut();
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async login(idToken: string) {
    return this.api.post('/auth/login', { idToken });
  }

  async register(email: string, password: string, name: string) {
    return this.api.post('/auth/register', { email, password, name });
  }

  async updateFcmToken(userId: string, fcmToken: string) {
    return this.api.post('/auth/fcm-token', { userId, fcmToken });
  }

  // Products
  async getProducts(params?: { category?: string; search?: string }) {
    return this.api.get('/products', { params });
  }

  async getProductById(id: string) {
    return this.api.get(`/products/${id}`);
  }

  async getProductByBarcode(barcode: string) {
    return this.api.get(`/products/barcode/${barcode}`);
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
