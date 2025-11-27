export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  quantity: number;
  price: number;
  category?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface StockTransaction {
  id: string;
  productId: string;
  action: 'in' | 'out' | 'adjust';
  quantity: number;
  notes?: string;
  createdAt: Date;
}
