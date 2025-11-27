import axios from 'axios';

// Use o IP da sua máquina na rede local
// Seu IP atual: 192.168.100.173
const API_URL = 'http://192.168.100.173:3000/api';

let authToken: string | null = null;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adicionar token em todas as requisições
api.interceptors.request.use(
  async (config) => {
    if (!authToken) {
      await ensureAuthenticated();
    }
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Login automático se não tiver token
const ensureAuthenticated = async () => {
  if (authToken) return;
  
  try {
    console.log('🔐 Fazendo login automático...');
    console.log('📍 API_URL:', `${API_URL}/auth/login`);
    
    // Fazer login com credenciais padrão
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@mystock.com',
      password: 'admin123'
    });
    
    console.log('✅ Login bem-sucedido!', response.data);
    
    if (response.data.success && response.data.data?.token) {
      authToken = response.data.data.token;
      console.log('🎫 Token salvo:', authToken);
    }
  } catch (error: any) {
    console.error('❌ Erro ao fazer login automático:', error.message);
    console.error('📊 Detalhes:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    throw new Error('Não foi possível autenticar');
  }
};

export interface Product {
  id?: string;
  barcode: string;
  name: string;
  description?: string;
  category?: string;
  quantity: number;
  minQuantity?: number;
  price?: number;
  unit?: string;
}

export const productService = {
  // Listar todos os produtos
  async getAll(): Promise<Product[]> {
    try {
      const response = await api.get('/products');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },

  // Buscar produto por código de barras
  async getByBarcode(barcode: string): Promise<Product | null> {
    try {
      const response = await api.get(`/products/barcode/${barcode}`);
      return response.data.data || response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Erro ao buscar produto:', error);
      throw error;
    }
  },

  // Criar novo produto
  async create(product: any): Promise<any> {
    try {
      const response = await api.post('/products', product);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  },

  // Atualizar produto
  async update(id: string, product: Partial<Product>): Promise<Product> {
    try {
      const response = await api.put(`/products/${id}`, product);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  },

  // Deletar produto
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  },
};

export default api;
