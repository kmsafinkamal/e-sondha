'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Address, Order, OrderItem, UserPreferences } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  allOrders: Order[];
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string, address?: Address) => { success: boolean; error?: string };
  loginWithGoogle: (customUser?: { name?: string; email?: string; avatarUrl?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateAddress: (address: Address) => void;
  updateProfile: (data: {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    preferences?: UserPreferences;
  }) => { success: boolean; error?: string };
  createOrder: (orderData: {

    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
    shippingAddress: Address;
    customerName?: string;
    customerEmail?: string;
    isGuest?: boolean;
  }) => Order;
  updateOrderStatus: (
    orderId: string,
    newStatus: Order['status'],
    extra?: { trackingNumber?: string; carrier?: string }
  ) => void;
}

const STORAGE_USERS_KEY = 'esondha_registered_users_v2';
const STORAGE_SESSION_KEY = 'esondha_active_session_v2';
const STORAGE_ALL_ORDERS_KEY = 'esondha_all_orders_v1';

const DEMO_USER: User = {
  id: 'usr-demo-1',
  name: 'Aria Lindqvist',
  email: 'aria@esondha.com',
  password: 'password123',
  phone: '+1 (555) 234-8901',
  provider: 'credentials',
  preferences: {
    orderUpdates: true,
    newsletter: true,
    sustainablePackaging: true,
  },
  createdAt: '2024-03-12',
  address: {
    street: '1420 Franklin Street, Apt 4B',
    city: 'Portland',
    state: 'OR',
    postalCode: '97201',
    country: 'United States',
  },
  orders: [
    {
      id: 'ord-demo-101',
      orderNumber: 'ES-89241',
      date: '2024-04-18',
      status: 'Delivered',
      items: [
        {
          id: 'item-1',
          productId: 'prod-1',
          name: 'Classic T-Shirt',
          price: 29.99,
          selectedColor: { name: 'Bone White', hex: '#fcf9f8' },
          selectedSize: 'M',
          quantity: 2,
          illustration: 'tshirt',
        },
        {
          id: 'item-2',
          productId: 'prod-8',
          name: 'Ceramic Vase',
          price: 34.99,
          selectedColor: { name: 'Speckled Sand', hex: '#fcf9f8' },
          selectedSize: '18cm',
          quantity: 1,
          illustration: 'vase',
        },
      ],
      subtotal: 94.97,
      shippingCost: 0,
      tax: 7.60,
      total: 102.57,
      shippingAddress: {
        street: '1420 Franklin Street, Apt 4B',
        city: 'Portland',
        state: 'OR',
        postalCode: '97201',
        country: 'United States',
      },
    },
  ],
};

const INITIAL_ALL_ORDERS: Order[] = [
  {
    id: 'ord-demo-101',
    orderNumber: 'ES-89241',
    date: '2024-05-18',
    customerName: 'Aria Lindqvist',
    customerEmail: 'aria@esondha.com',
    isGuest: false,
    status: 'Shipped',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        name: 'Classic T-Shirt',
        price: 29.99,
        selectedColor: { name: 'Bone White', hex: '#fcf9f8' },
        selectedSize: 'M',
        quantity: 2,
        illustration: 'tshirt',
      },
      {
        id: 'item-2',
        productId: 'prod-8',
        name: 'Ceramic Vase',
        price: 34.99,
        selectedColor: { name: 'Speckled Sand', hex: '#fcf9f8' },
        selectedSize: '18cm',
        quantity: 1,
        illustration: 'vase',
      },
    ],
    subtotal: 94.97,
    shippingCost: 0,
    tax: 7.60,
    total: 102.57,
    shippingAddress: {
      fullName: 'Aria Lindqvist',
      street: '1420 Franklin Street, Apt 4B',
      city: 'Portland',
      state: 'OR',
      postalCode: '97201',
      country: 'United States',
    },
  },
  {
    id: 'ord-demo-102',
    orderNumber: 'ES-77194',
    date: '2024-05-19',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.v@atelier.net',
    isGuest: true,
    status: 'Processing',
    items: [
      {
        id: 'item-3',
        productId: 'prod-4',
        name: 'Everyday Backpack',
        price: 89.99,
        selectedColor: { name: 'Raw Canvas', hex: '#f4ede4' },
        selectedSize: '20L',
        quantity: 1,
        illustration: 'backpack',
      },
    ],
    subtotal: 89.99,
    shippingCost: 0,
    tax: 7.20,
    total: 97.19,
    shippingAddress: {
      fullName: 'Marcus Vance',
      street: '882 Evergreen Terrace',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'United States',
    },
  },
  {
    id: 'ord-demo-103',
    orderNumber: 'ES-63012',
    date: '2024-05-15',
    customerName: 'Elena Mori',
    customerEmail: 'elena@mori.kyoto',
    isGuest: false,
    status: 'Delivered',
    items: [
      {
        id: 'item-4',
        productId: 'prod-3',
        name: 'Coffee Mug',
        price: 14.99,
        selectedColor: { name: 'Deep Indigo', hex: '#25435a' },
        selectedSize: '320ml',
        quantity: 2,
        illustration: 'mug',
      },
      {
        id: 'item-5',
        productId: 'prod-2',
        name: 'Desk Plant',
        price: 19.99,
        selectedColor: { name: 'Terracotta Pot', hex: '#ba674d' },
        selectedSize: 'Standard',
        quantity: 1,
        illustration: 'plant',
      },
    ],
    subtotal: 49.97,
    shippingCost: 9.0,
    tax: 4.0,
    total: 62.97,
    shippingAddress: {
      fullName: 'Elena Mori',
      street: '512 Sakuragaoka',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94110',
      country: 'United States',
    },
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>([DEMO_USER]);
  const [allOrders, setAllOrders] = useState<Order[]>(INITIAL_ALL_ORDERS);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_USERS_KEY);
      let activeUsers = [DEMO_USER];
      if (storedUsers) {
        activeUsers = JSON.parse(storedUsers);
        setUsersList(activeUsers);
      } else {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify([DEMO_USER]));
      }

      const activeSessionEmail = localStorage.getItem(STORAGE_SESSION_KEY);
      if (activeSessionEmail) {
        const matchingUser = activeUsers.find(
          (u) => u.email.toLowerCase() === activeSessionEmail.toLowerCase()
        );
        if (matchingUser) {
          setUser(matchingUser);
        }
      }

      const storedOrders = localStorage.getItem(STORAGE_ALL_ORDERS_KEY);
      if (storedOrders) {
        setAllOrders(JSON.parse(storedOrders));
      } else {
        localStorage.setItem(STORAGE_ALL_ORDERS_KEY, JSON.stringify(INITIAL_ALL_ORDERS));
      }
    } catch (e) {
      console.error('Failed to initialize auth state:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUsers = (updatedUsers: User[]) => {
    setUsersList(updatedUsers);
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
    } catch (e) {
      console.error('Failed to save users:', e);
    }
  };

  const register = (
    name: string,
    email: string,
    password: string,
    address?: Address
  ): { success: boolean; error?: string } => {
    const normalizedEmail = email.trim().toLowerCase();

    const existing = usersList.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password: password.trim(),
      provider: 'credentials',
      createdAt: new Date().toISOString().split('T')[0],
      address: address || {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'United States',
      },
      orders: [],
    };

    const newUsers = [newUser, ...usersList];
    saveUsers(newUsers);

    // Auto-login registered user
    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, normalizedEmail);
    } catch (e) {
      console.error(e);
    }

    return { success: true };
  };

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const normalizedEmail = email.trim().toLowerCase();
    const foundUser = usersList.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password.trim()
    );

    if (!foundUser) {
      return { success: false, error: 'Invalid email address or password.' };
    }

    setUser(foundUser);
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, normalizedEmail);
    } catch (e) {
      console.error(e);
    }

    return { success: true };
  };

  const loginWithGoogle = async (
    customUser?: { name?: string; email?: string; avatarUrl?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const email = (customUser?.email || 'aria.lindqvist@gmail.com').trim().toLowerCase();
      const name = customUser?.name || 'Aria Lindqvist';
      const avatarUrl =
        customUser?.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

      // Check if user already exists in registered directory
      const existingUser = usersList.find((u) => u.email.toLowerCase() === email);

      if (existingUser) {
        const updatedUser: User = {
          ...existingUser,
          provider: 'google',
          avatarUrl: existingUser.avatarUrl || avatarUrl,
        };
        setUser(updatedUser);
        const updatedList = usersList.map((u) => (u.id === existingUser.id ? updatedUser : u));
        saveUsers(updatedList);
        try {
          localStorage.setItem(STORAGE_SESSION_KEY, email);
        } catch (e) {
          console.error(e);
        }
        return { success: true };
      }

      // If brand new Google patron, create new account with default Oregon address
      const newGoogleUser: User = {
        id: `usr-google-${Date.now()}`,
        name,
        email,
        provider: 'google',
        avatarUrl,
        createdAt: new Date().toISOString().split('T')[0],
        address: {
          street: '1420 Franklin Street, Apt 4B',
          city: 'Portland',
          state: 'OR',
          postalCode: '97201',
          country: 'United States',
        },
        orders: [],
        preferences: {
          orderUpdates: true,
          newsletter: true,
          sustainablePackaging: true,
        },
      };

      const newUsers = [newGoogleUser, ...usersList];
      saveUsers(newUsers);
      setUser(newGoogleUser);
      try {
        localStorage.setItem(STORAGE_SESSION_KEY, email);
      } catch (e) {
        console.error(e);
      }

      return { success: true };
    } catch (e) {
      console.error('Google Sign-In failed:', e);
      return { success: false, error: 'Google sign-in could not be completed.' };
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const updateAddress = (newAddress: Address) => {
    if (!user) return;

    const updatedUser = { ...user, address: newAddress };
    setUser(updatedUser);

    const updatedUsers = usersList.map((u) => (u.id === user.id ? updatedUser : u));
    saveUsers(updatedUsers);
  };

  const updateProfile = (data: {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    preferences?: UserPreferences;
  }): { success: boolean; error?: string } => {
    if (!user) return { success: false, error: 'You must be signed in to update your profile.' };

    const newEmail = data.email ? data.email.trim().toLowerCase() : user.email;

    // Verify if email is already taken by another user
    if (newEmail !== user.email.toLowerCase()) {
      const isTaken = usersList.some(
        (u) => u.id !== user.id && u.email.toLowerCase() === newEmail
      );
      if (isTaken) {
        return { success: false, error: 'This email address is already associated with another account.' };
      }
    }

    const updatedUser: User = {
      ...user,
      name: data.name !== undefined && data.name.trim() !== '' ? data.name.trim() : user.name,
      email: newEmail,
      password: data.password !== undefined && data.password.trim() !== '' ? data.password.trim() : user.password,
      phone: data.phone !== undefined ? data.phone.trim() : user.phone,
      preferences: data.preferences !== undefined ? data.preferences : user.preferences,
    };

    setUser(updatedUser);

    try {
      localStorage.setItem(STORAGE_SESSION_KEY, newEmail);
    } catch (e) {
      console.error('Failed to update session email:', e);
    }

    const updatedUsers = usersList.map((u) => (u.id === user.id ? updatedUser : u));
    saveUsers(updatedUsers);

    return { success: true };
  };


  const updateOrderStatus = (
    orderId: string,
    newStatus: Order['status'],
    extra?: { trackingNumber?: string; carrier?: string }
  ) => {
    setAllOrders((prevOrders) => {
      const updated = prevOrders.map((ord) =>
        ord.id === orderId || ord.orderNumber === orderId
          ? { ...ord, status: newStatus, ...(extra || {}) }
          : ord
      );
      try {
        localStorage.setItem(STORAGE_ALL_ORDERS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update allOrders storage:', e);
      }
      return updated;
    });

    // 1. Update matching orders across all users in usersList
    setUsersList((prevUsers) => {
      const updated = prevUsers.map((u) => {
        const hasOrder = u.orders.some((o) => o.id === orderId || o.orderNumber === orderId);
        if (!hasOrder) return u;
        const updatedOrders = u.orders.map((o) =>
          o.id === orderId || o.orderNumber === orderId
            ? { ...o, status: newStatus, ...(extra || {}) }
            : o
        );
        return { ...u, orders: updatedOrders };
      });
      try {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update users storage:', e);
      }
      return updated;
    });

    // 2. Also update current active user state if it contains this order
    setUser((prevUser) => {
      if (!prevUser) return null;
      if (!prevUser.orders.some((ord) => ord.id === orderId || ord.orderNumber === orderId)) {
        return prevUser;
      }
      return {
        ...prevUser,
        orders: prevUser.orders.map((ord) =>
          ord.id === orderId || ord.orderNumber === orderId
            ? { ...ord, status: newStatus, ...(extra || {}) }
            : ord
        ),
      };
    });
  };

  const createOrder = (orderData: {
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
    shippingAddress: Address;
    customerName?: string;
    customerEmail?: string;
    isGuest?: boolean;
  }): Order => {
    const randomOrderNumber = `ES-${Math.floor(10000 + Math.random() * 90000)}`;
    const resolvedName = orderData.customerName || (user ? user.name : 'Valued Patron');
    const resolvedEmail = orderData.customerEmail || (user ? user.email : 'guest@atelier.local');
    const resolvedIsGuest = orderData.isGuest !== undefined ? orderData.isGuest : !user;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: randomOrderNumber,
      date: new Date().toISOString().split('T')[0],
      customerName: resolvedName,
      customerEmail: resolvedEmail,
      isGuest: resolvedIsGuest,
      status: 'Processing',
      items: orderData.items,
      subtotal: orderData.subtotal,
      shippingCost: orderData.shippingCost,
      tax: orderData.tax,
      total: orderData.total,
      shippingAddress: orderData.shippingAddress,
    };

    // 1. Always record in studio-wide allOrders registry (for Admin tracking)
    setAllOrders((prev) => {
      const updated = [newOrder, ...prev];
      try {
        localStorage.setItem(STORAGE_ALL_ORDERS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save allOrders to storage:', e);
      }
      return updated;
    });

    // 2. If user is logged in, attach to their personal account history
    if (user) {
      const updatedUser: User = {
        ...user,
        orders: [newOrder, ...user.orders],
        address: orderData.shippingAddress, // save as last shipping address
      };
      setUser(updatedUser);

      const updatedUsers = usersList.map((u) => (u.id === user.id ? updatedUser : u));
      saveUsers(updatedUsers);
    }

    return newOrder;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        allOrders,
        login,
        register,
        loginWithGoogle,
        logout,
        updateAddress,
        updateProfile,
        createOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
