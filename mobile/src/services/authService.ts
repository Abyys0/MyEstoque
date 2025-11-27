import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  expiresIn: number;
}

export const authService = {
  // Login
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    const data = response.data.data;
    
    // Salvar token localmente
    await AsyncStorage.setItem('authToken', data.token);
    
    return data;
  },

  // Registrar
  register: async (credentials: LoginRequest & { name: string }) => {
    const response = await apiClient.post('/auth/register', credentials);
    return response.data;
  },

  // Fazer logout
  logout: async () => {
    await AsyncStorage.removeItem('authToken');
  },

  // Verificar se está autenticado
  isAuthenticated: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  },

  // Obter token salvo
  getToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem('authToken');
  },

  // Refresh token
  refreshToken: async (token: string) => {
    const response = await apiClient.post('/auth/refresh', { token });
    const newToken = response.data.data.token;
    
    // Atualizar token local
    await AsyncStorage.setItem('authToken', newToken);
    
    return newToken;
  },
};
