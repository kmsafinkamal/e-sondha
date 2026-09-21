import { ProductIllustrationName } from './index';

export interface Address {
  fullName?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  zipCode?: string;
  country: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  selectedColor: { name: string; hex: string };
  selectedSize: string;
  quantity: number;
  illustration: ProductIllustrationName;
  imageUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName?: string;
  customerEmail?: string;
  isGuest?: boolean;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
  carrier?: string;
}

export interface UserPreferences {
  orderUpdates?: boolean;
  newsletter?: boolean;
  sustainablePackaging?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  provider?: 'credentials' | 'google';
  avatarUrl?: string;
  preferences?: UserPreferences;
  createdAt: string;
  address?: Address;
  orders: Order[];
}


export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
