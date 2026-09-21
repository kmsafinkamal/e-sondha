'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';
import { StoreSettings, ProductFormData, Inquiry, NewsletterSubscriber, LookbookCapsule } from '@/types/admin';
import { PRODUCTS as INITIAL_PRODUCTS } from '@/data/products';

export interface ProductContextType {
  products: Product[];
  addProduct: (data: ProductFormData) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  decrementStock: (items: { productId: string; quantity: number }[]) => void;
  updateStockQuantity: (productId: string, newQuantity: number) => void;
  storeSettings: StoreSettings;
  updateStoreSettings: (data: Partial<StoreSettings>) => void;
  updateLookbookCapsules: (capsules: LookbookCapsule[]) => void;
  resetToDefaults: () => void;
  // Inquiries
  inquiries: Inquiry[];
  submitInquiry: (data: { fullName: string; email: string; subject: string; message: string }) => Inquiry;
  updateInquiryStatus: (id: string, status: 'unread' | 'read' | 'replied') => void;
  replyToInquiry: (id: string, replyText: string) => void;
  deleteInquiry: (id: string) => void;
  unreadInquiriesCount: number;
  // Subscribers
  subscribers: NewsletterSubscriber[];
  subscribeNewsletter: (email: string, source?: string) => boolean;
  deleteSubscriber: (id: string) => void;
  totalSubscribersCount: number;
}

export const DEFAULT_LOOKBOOK_CAPSULES: LookbookCapsule[] = [
  {
    id: 'capsule-desk',
    title: 'The Wabi-Sabi Desk Sanctuary',
    eyebrow: 'Lookbook Capsule 01 · Kyoto Natural Light Studio',
    description: 'Quiet stoneware, architectural task light, and living greenery tuned to domestic sensory harmony and everyday focus.',
    studioTag: 'Kyoto Natural Light Atelier · 35°N',
    theme: 'warm-sand',
    productIds: ['prod-9', 'prod-3', 'prod-8'],
    enabled: true,
    showOnHome: true,
    showOnShop: true,
  },
  {
    id: 'capsule-transit',
    title: 'The Everyday Transit Uniform',
    eyebrow: 'Lookbook Capsule 02 · Copenhagen Transit Atelier',
    description: 'Heavyweight organic ring-spun cotton paired with weatherproof recycled cordura carry gear and natural vulcanized rubber.',
    studioTag: 'Copenhagen Urban Transit Atelier · 55°N',
    theme: 'nordic-slate',
    productIds: ['prod-1', 'prod-4', 'prod-5'],
    enabled: true,
    showOnHome: true,
    showOnShop: true,
  },
  {
    id: 'capsule-living',
    title: 'Acoustic Retreat & Living Room',
    eyebrow: 'Lookbook Capsule 03 · Berlin Acoustic Studio',
    description: 'Beryllium studio monitors, stone-washed European flax linen, and living succulent accents for mindful evenings.',
    studioTag: 'Berlin Sound & Living Studio · 52°N',
    theme: 'sage-botanical',
    productIds: ['prod-6', 'prod-7', 'prod-2'],
    enabled: true,
    showOnHome: true,
    showOnShop: true,
  },
];

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'E Sondha',
  heroHeadline: 'Quiet Form & Timeless Function',
  heroSubheadline: 'SS24 Slow Curation',
  heroDescription: 'Carefully conceived everyday garments, living ceramics, and quiet acoustic tools. Hand-crafted geometries rooted in Japanese modesty and Scandinavian simplicity.',
  freeShippingThreshold: 100.0,
  contactEmail: 'hello@esondha.com',
  contactPhone: '+1 (555) 349-2810',
  studioAddress: '1420 Franklin Street, Suite 4B, Portland, OR 97201',
  announcementText: 'Complimentary Carbon-Neutral Shipping on orders over $100',
  adminPassword: 'admin2026',
  curatorChoiceProductId: 'prod-1',
  curatorChoiceProductIds: ['prod-1', 'prod-8', 'prod-4'],
  curatorChoiceMode: 'dynamic',
  lookbookCapsules: DEFAULT_LOOKBOOK_CAPSULES,
  showLookbookOnShop: true,
  showLookbookOnHome: true,
  lookbookTransitionInterval: 2.0,
  curatorChoiceTransitionInterval: 4.5,
};

const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-101',
    fullName: 'Jane Doe',
    email: 'jane.doe@studio-living.com',
    subject: 'Architectural Homeware Trade Inquiry',
    message: 'We are currently styling a private coastal residence in Cannon Beach and would like to inquire about volume trade orders for the Natural Linen Throw and Ceramic Vase collection.',
    createdAt: '2024-05-18 14:32',
    status: 'unread',
  },
  {
    id: 'inq-102',
    fullName: 'Marcus Chen',
    email: 'marcus.chen@designcraft.org',
    subject: 'Ceramic Glaze Food-Safety Confirmation',
    message: 'Hello team, could you confirm whether the Speckled Sand stoneware cups and bowls are 100% lead-free and dishwasher-safe for everyday dining rituals?',
    createdAt: '2024-05-17 09:15',
    status: 'replied',
    adminReply: 'All E Sondha ceramics are hand-thrown with non-toxic, lead-free food-safe glazes and high-fired at 1220°C for exceptional everyday durability.',
    repliedAt: '2024-05-17 11:40',
  },
  {
    id: 'inq-103',
    fullName: 'Elena Rostova',
    email: 'elena@slowliving.se',
    subject: 'Custom Size Linen Kimono Request',
    message: 'Does your atelier offer custom arm-length adjustments on the Natural Flax Kimono Jacket for taller silhouettes? Thank you kindly.',
    createdAt: '2024-05-15 16:45',
    status: 'read',
  },
];

const INITIAL_SUBSCRIBERS: NewsletterSubscriber[] = [
  {
    id: 'sub-1',
    email: 'patron.olivia@monocle-style.com',
    subscribedAt: '2024-05-10 10:20',
    source: 'Homepage Journal',
    active: true,
  },
  {
    id: 'sub-2',
    email: 'studio@nordic-interiors.co',
    subscribedAt: '2024-05-12 15:44',
    source: 'Footer',
    active: true,
  },
  {
    id: 'sub-3',
    email: 'kenji.sato@kyoto-living.jp',
    subscribedAt: '2024-05-15 08:30',
    source: 'Homepage Journal',
    active: true,
  },
  {
    id: 'sub-4',
    email: 'elena.vance@portlandcraft.com',
    subscribedAt: '2024-05-18 11:15',
    source: 'Checkout',
    active: true,
  },
];

const STORAGE_PRODUCTS_KEY = 'esondha_products_v2';
const STORAGE_SETTINGS_KEY = 'esondha_settings_v2';
const STORAGE_INQUIRIES_KEY = 'esondha_inquiries_v1';
const STORAGE_SUBSCRIBERS_KEY = 'esondha_subscribers_v1';

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(INITIAL_SUBSCRIBERS);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem(STORAGE_PRODUCTS_KEY);
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      }

      const storedSettings = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        setStoreSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } else {
        localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      }

      const storedInquiries = localStorage.getItem(STORAGE_INQUIRIES_KEY);
      if (storedInquiries) {
        setInquiries(JSON.parse(storedInquiries));
      } else {
        localStorage.setItem(STORAGE_INQUIRIES_KEY, JSON.stringify(INITIAL_INQUIRIES));
      }

      const storedSubscribers = localStorage.getItem(STORAGE_SUBSCRIBERS_KEY);
      if (storedSubscribers) {
        setSubscribers(JSON.parse(storedSubscribers));
      } else {
        localStorage.setItem(STORAGE_SUBSCRIBERS_KEY, JSON.stringify(INITIAL_SUBSCRIBERS));
      }
    } catch (e) {
      console.error('Failed to load local storage data:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync products to localStorage
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    try {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(newProducts));
    } catch (e) {
      console.error('Failed to save products:', e);
    }
  };

  // Sync settings to localStorage
  const saveSettings = (newSettings: StoreSettings) => {
    setStoreSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  };

  const addProduct = (data: ProductFormData) => {
    const newId = `prod-${Date.now()}`;
    const stockQty = data.stockQuantity !== undefined ? Math.max(0, Number(data.stockQuantity)) : 10;

    const newProduct: Product = {
      id: newId,
      name: data.name,
      category: data.category === 'ALL' ? 'CLOTHING' : (data.category as any),
      price: Number(data.price),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
      rating: Number(data.rating) || 5.0,
      reviewCount: Number(data.reviewCount) || 1,
      badge:
        data.badgeVariant && data.badgeVariant !== 'none' && data.badgeText
          ? { text: data.badgeText, variant: data.badgeVariant }
          : undefined,
      colors: data.colors.length > 0 ? data.colors : [{ name: 'Default', hex: '#25435a' }],
      sizes: data.sizes.length > 0 ? data.sizes : ['Standard'],
      description: data.description,
      details: data.details.length > 0 ? data.details : ['Ethically crafted'],
      inStock: stockQty > 0 ? data.inStock : false,
      stockQuantity: stockQty,
      illustration: data.illustration || 'tshirt',
      imageUrl: data.imageUrl ? data.imageUrl.trim() : undefined,
    };

    saveProducts([newProduct, ...products]);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    const updated = products.map((item) => {
      if (item.id === id) {
        const merged = { ...item, ...updatedFields };
        if (updatedFields.stockQuantity !== undefined) {
          merged.stockQuantity = Math.max(0, Math.floor(updatedFields.stockQuantity));
          if (merged.stockQuantity === 0) {
            merged.inStock = false;
          }
        }
        return merged;
      }
      return item;
    });
    saveProducts(updated);
  };

  const updateStockQuantity = (productId: string, newQuantity: number) => {
    const safeQty = Math.max(0, Math.floor(newQuantity));
    updateProduct(productId, {
      stockQuantity: safeQty,
      inStock: safeQty > 0,
    });
  };

  const decrementStock = (purchasedItems: { productId: string; quantity: number }[]) => {
    setProducts((prevProducts) => {
      const updated = prevProducts.map((prod) => {
        const matched = purchasedItems.find((pi) => pi.productId === prod.id);
        if (matched) {
          const currentStock = prod.stockQuantity !== undefined ? prod.stockQuantity : 10;
          const newStock = Math.max(0, currentStock - matched.quantity);
          return {
            ...prod,
            stockQuantity: newStock,
            inStock: newStock > 0,
          };
        }
        return prod;
      });

      try {
        localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save decremented stock:', e);
      }
      return updated;
    });
  };

  const deleteProduct = (id: string) => {
    const filtered = products.filter((item) => item.id !== id);
    saveProducts(filtered);
  };

  const updateStoreSettings = (newFields: Partial<StoreSettings>) => {
    const updated = { ...storeSettings, ...newFields };
    saveSettings(updated);
  };

  const updateLookbookCapsules = (newCapsules: LookbookCapsule[]) => {
    updateStoreSettings({ lookbookCapsules: newCapsules });
  };

  // Sync inquiries to localStorage
  const saveInquiries = (newInquiries: Inquiry[]) => {
    setInquiries(newInquiries);
    try {
      localStorage.setItem(STORAGE_INQUIRIES_KEY, JSON.stringify(newInquiries));
    } catch (e) {
      console.error('Failed to save inquiries:', e);
    }
  };

  // Sync subscribers to localStorage
  const saveSubscribers = (newSubscribers: NewsletterSubscriber[]) => {
    setSubscribers(newSubscribers);
    try {
      localStorage.setItem(STORAGE_SUBSCRIBERS_KEY, JSON.stringify(newSubscribers));
    } catch (e) {
      console.error('Failed to save subscribers:', e);
    }
  };

  const submitInquiry = (data: { fullName: string; email: string; subject: string; message: string }) => {
    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      subject: data.subject.trim() || 'General Atelier Inquiry',
      message: data.message.trim(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'unread',
    };
    const updated = [newInquiry, ...inquiries];
    saveInquiries(updated);
    return newInquiry;
  };

  const updateInquiryStatus = (id: string, status: 'unread' | 'read' | 'replied') => {
    const updated = inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq));
    saveInquiries(updated);
  };

  const replyToInquiry = (id: string, replyText: string) => {
    const updated = inquiries.map((inq) =>
      inq.id === id
        ? {
            ...inq,
            status: 'replied' as const,
            adminReply: replyText.trim(),
            repliedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          }
        : inq
    );
    saveInquiries(updated);
  };

  const deleteInquiry = (id: string) => {
    const updated = inquiries.filter((inq) => inq.id !== id);
    saveInquiries(updated);
  };

  const subscribeNewsletter = (email: string, source: string = 'Storefront') => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) return false;

    const exists = subscribers.some((sub) => sub.email.toLowerCase() === trimmed);
    if (exists) {
      return true;
    }

    const newSubscriber: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: trimmed,
      subscribedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      source,
      active: true,
    };
    const updated = [newSubscriber, ...subscribers];
    saveSubscribers(updated);
    return true;
  };

  const deleteSubscriber = (id: string) => {
    const updated = subscribers.filter((sub) => sub.id !== id);
    saveSubscribers(updated);
  };

  const unreadInquiriesCount = inquiries.filter((i) => i.status === 'unread').length;
  const totalSubscribersCount = subscribers.length;

  const resetToDefaults = () => {
    saveProducts(INITIAL_PRODUCTS);
    saveSettings(DEFAULT_SETTINGS);
    saveInquiries(INITIAL_INQUIRIES);
    saveSubscribers(INITIAL_SUBSCRIBERS);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        decrementStock,
        updateStockQuantity,
        storeSettings,
        updateStoreSettings,
        updateLookbookCapsules,
        resetToDefaults,
        inquiries,
        submitInquiry,
        updateInquiryStatus,
        replyToInquiry,
        deleteInquiry,
        unreadInquiriesCount,
        subscribers,
        subscribeNewsletter,
        deleteSubscriber,
        totalSubscribersCount,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
