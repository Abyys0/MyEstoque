import { create } from 'zustand';

interface AuthStore {
  isAuthenticated: boolean;
  user: any | null;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  setUser: (user: any) => set({ isAuthenticated: !!user, user }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));

interface StockStore {
  products: any[];
  lastScan: any | null;
  setProducts: (products: any[]) => void;
  setLastScan: (scan: any) => void;
}

export const useStockStore = create<StockStore>((set) => ({
  products: [],
  lastScan: null,
  setProducts: (products: any[]) => set({ products }),
  setLastScan: (lastScan: any) => set({ lastScan }),
}));
