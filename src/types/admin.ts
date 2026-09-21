import { Product, ProductColor, CategoryType, BadgeVariant } from './index';

export interface LookbookCapsule {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  studioTag: string;
  theme: 'warm-sand' | 'nordic-slate' | 'porto-terracotta' | 'sage-botanical';
  productIds: [string, string, string];
  enabled: boolean;
  showOnHome?: boolean;
  showOnShop?: boolean;
}

export interface StoreSettings {
  storeName: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroDescription: string;
  freeShippingThreshold: number;
  contactEmail: string;
  contactPhone: string;
  studioAddress: string;
  announcementText: string;
  adminPassword?: string;
  curatorChoiceProductId?: string;
  curatorChoiceProductIds?: string[];
  curatorChoiceMode?: 'dynamic' | 'manual';
  lookbookCapsules?: LookbookCapsule[];
  showLookbookOnShop?: boolean;
  showLookbookOnHome?: boolean;
  lookbookTransitionInterval?: number; // In seconds (e.g. 1.5, 2.0, 2.5)
  curatorChoiceTransitionInterval?: number; // In seconds (e.g. 3.5, 4.5, 5.0)
}

export interface ProductFormData {
  name: string;
  category: CategoryType;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badgeVariant?: BadgeVariant | 'none';
  badgeText?: string;
  colors: ProductColor[];
  sizes: string[];
  description: string;
  details: string[];
  inStock: boolean;
  stockQuantity: number;
  illustration: Product['illustration'];
  imageUrl?: string;
}

export interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
  adminReply?: string;
  repliedAt?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  source: string;
  active: boolean;
}
