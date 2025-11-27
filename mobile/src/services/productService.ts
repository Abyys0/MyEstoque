import apiClient from './api';

export interface Product {
  id: string;
  barcode: string;
  name: string;
  quantity: number;
  price: number;
  category?: string;
}

export interface ScanRequest {
  barcode: string;
  action: 'in' | 'out' | 'adjust';
  quantity: number;
  notes?: string;
}

export interface ScanResponse {
  id: string;
  productId: string;
  barcode: string;
  productName: string;
  quantityBefore: number;
  quantityAfter: number;
  action: string;
  timestamp: string;
}

export const productService = {
  // Listar produtos
  getProducts: async (page: number = 1, limit: number = 10) => {
    const response = await apiClient.get('/products', {
      params: { page, limit },
    });
    return response.data;
  },

  // Obter produto por ID
  getProduct: async (id: string) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Criar novo produto
  createProduct: async (product: Omit<Product, 'id'>) => {
    const response = await apiClient.post('/products', product);
    return response.data;
  },

  // Atualizar produto
  updateProduct: async (id: string, product: Partial<Product>) => {
    const response = await apiClient.put(`/products/${id}`, product);
    return response.data;
  },

  // Deletar produto
  deleteProduct: async (id: string) => {
    await apiClient.delete(`/products/${id}`);
  },
};

export const stockService = {
  // Registrar leitura de código de barras
  scanBarcode: async (scanData: ScanRequest): Promise<ScanResponse> => {
    const response = await apiClient.post('/stock/scan', scanData);
    return response.data.data;
  },

  // Obter histórico de transações
  getHistory: async (productId?: string, limit: number = 20) => {
    const response = await apiClient.get('/stock/history', {
      params: { productId, limit },
    });
    return response.data;
  },

  // Gerar relatório de estoque
  getReport: async (from?: string, to?: string) => {
    const response = await apiClient.get('/stock/report', {
      params: { from, to },
    });
    return response.data;
  },
};
