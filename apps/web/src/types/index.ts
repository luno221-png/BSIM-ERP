export type UserRole = 'ADMIN' | 'STOCK_MANAGER' | 'CASHIER';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Expense {
  id: string;
  amount: number;
  reason: string;
  authorName: string; // Nom du caissier ou admin qui a signé
  authorRole: UserRole;
  createdAt: string;
}

export interface SaleTransaction {
  id: string;
  cashierName: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  customerPhone?: string;
}