export type FAQCategory = 'orders' | 'shipping' | 'returns' | 'materials' | 'general';
export type FAQStatus = 'published' | 'pending' | 'archived';

export interface FAQItem {
  id: string;
  category: FAQCategory;
  question: string;
  answer?: string;
  status: FAQStatus;
  askedBy?: {
    name: string;
    email: string;
  };
  askedAt: string;
  answeredBy?: string;
  answeredAt?: string;
  helpfulCount: number;
}

export interface FAQFormData {
  question: string;
  answer?: string;
  category: FAQCategory;
  status?: FAQStatus;
  askedByName?: string;
  askedByEmail?: string;
}
