// User roles and permissions
export enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  VIEWER = 'viewer',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  fcmToken?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Product types
export interface Product {
  id: string;
  barcode: string;
  name: string;
  description?: string;
  category: string;
  brand?: string;
  unit: string; // kg, un, l, etc
  minStock: number;
  currentStock: number;
  location?: string;
  image?: string;
  price?: number;
  expiryDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Stock movement types
export enum MovementType {
  IN = 'in',
  OUT = 'out',
  ADJUSTMENT = 'adjustment',
}

export interface StockMovement {
  id: string;
  productId: string;
  type: MovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  notes?: string;
  userId: string;
  userName: string;
  timestamp: Date;
}

// Notification types
export enum NotificationType {
  LOW_STOCK = 'low_stock',
  EXPIRY_WARNING = 'expiry_warning',
  NO_MOVEMENT = 'no_movement',
  SYSTEM = 'system',
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  productId?: string;
  userId?: string;
  read: boolean;
  createdAt: Date;
}

// Report types
export interface StockReport {
  totalProducts: number;
  totalValue: number;
  lowStockProducts: number;
  expiringProducts: number;
  lastUpdate: Date;
}

export interface MovementReport {
  period: {
    start: Date;
    end: Date;
  };
  totalIn: number;
  totalOut: number;
  movements: StockMovement[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Request with user
export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email: string;
    role: UserRole;
  };
}
