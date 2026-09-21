'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductColor, CartItem } from '@/types';
import { useProducts } from '@/context/ProductContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, selectedColor: ProductColor, selectedSize: string, quantity?: number) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  subtotal: number;
  freeShippingThreshold: number;
  isFreeShipping: boolean;
  freeShippingProgress: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  lastAddedItem: CartItem | null;
}

const STORAGE_WISHLIST_KEY = 'esondha_wishlist_v1';
const STORAGE_CART_KEY = 'esondha_cart_items_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);


export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  // Initialize cart items and wishlist from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_CART_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
      const savedWishlist = localStorage.getItem(STORAGE_WISHLIST_KEY);
      if (savedWishlist) {
        const parsedWish = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWish)) {
          setWishlist(parsedWish);
        }
      }
    } catch (e) {
      console.error('Failed to load cart/wishlist from storage:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist cart items to localStorage on change (only after initial hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart items to storage:', e);
    }
  }, [items, isHydrated]);


  const { storeSettings } = useProducts();
  const freeShippingThreshold = storeSettings?.freeShippingThreshold ?? 100.00;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const addToCart = (
    product: Product,
    selectedColor: ProductColor,
    selectedSize: string,
    quantity: number = 1
  ) => {
    const compositeId = `${product.id}-${selectedColor.name}-${selectedSize}`;
    
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === compositeId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: CartItem = {
          id: compositeId,
          productId: product.id,
          name: product.name,
          price: product.price,
          selectedColor,
          selectedSize,
          quantity,
          category: product.category,
          illustration: product.illustration,
          imageUrl: product.imageUrl,
        };
        return [newItem, ...prevItems];
      }
    });

    const addedItem: CartItem = {
      id: compositeId,
      productId: product.id,
      name: product.name,
      price: product.price,
      selectedColor,
      selectedSize,
      quantity,
      category: product.category,
      illustration: product.illustration,
      imageUrl: product.imageUrl,
    };
    setLastAddedItem(addedItem);
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      try {
        localStorage.setItem(STORAGE_WISHLIST_KEY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
    try {
      localStorage.setItem(STORAGE_WISHLIST_KEY, JSON.stringify([]));
    } catch (e) {
      console.error(e);
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotal,
        freeShippingThreshold,
        isFreeShipping,
        freeShippingProgress,
        wishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        lastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
