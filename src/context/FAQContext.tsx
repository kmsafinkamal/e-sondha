'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FAQItem, FAQCategory, FAQStatus } from '@/types/faq';
import { SEED_FAQS } from '@/data/faqs';

interface FAQContextType {
  faqs: FAQItem[];
  publishedFaqs: FAQItem[];
  pendingFaqs: FAQItem[];
  pendingCount: number;
  askQuestion: (data: {
    question: string;
    category: FAQCategory;
    name?: string;
    email?: string;
  }) => FAQItem;
  answerQuestion: (
    id: string,
    answer: string,
    category?: FAQCategory,
    publish?: boolean
  ) => void;
  createFAQ: (data: {
    question: string;
    answer: string;
    category: FAQCategory;
    status?: FAQStatus;
  }) => FAQItem;
  updateFAQ: (id: string, updates: Partial<FAQItem>) => void;
  deleteFAQ: (id: string) => void;
  markHelpful: (id: string) => boolean;
  hasVotedHelpful: (id: string) => boolean;
  resetToSeedFAQs: () => void;
}

const STORAGE_FAQS_KEY = 'esondha_faqs_v1';
const STORAGE_FAQ_VOTES_KEY = 'esondha_faq_votes_v1';

const FAQContext = createContext<FAQContextType | undefined>(undefined);

export const FAQProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [faqs, setFaqs] = useState<FAQItem[]>(SEED_FAQS);
  const [helpfulVotes, setHelpfulVotes] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_FAQS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFaqs(parsed);
        } else {
          setFaqs(SEED_FAQS);
          localStorage.setItem(STORAGE_FAQS_KEY, JSON.stringify(SEED_FAQS));
        }
      } else {
        localStorage.setItem(STORAGE_FAQS_KEY, JSON.stringify(SEED_FAQS));
      }

      const storedVotes = localStorage.getItem(STORAGE_FAQ_VOTES_KEY);
      if (storedVotes) {
        setHelpfulVotes(JSON.parse(storedVotes));
      }
    } catch (e) {
      console.error('Failed to load FAQs from storage:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const saveFaqs = (updated: FAQItem[]) => {
    setFaqs(updated);
    try {
      localStorage.setItem(STORAGE_FAQS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save FAQs to localStorage:', e);
    }
  };

  const publishedFaqs = faqs.filter((f) => f.status === 'published' && !!f.answer?.trim());
  const pendingFaqs = faqs.filter((f) => f.status === 'pending');
  const pendingCount = pendingFaqs.length;

  const askQuestion = (data: {
    question: string;
    category: FAQCategory;
    name?: string;
    email?: string;
  }): FAQItem => {
    const newItem: FAQItem = {
      id: `faq-q-${Date.now()}`,
      question: data.question.trim(),
      category: data.category,
      status: 'pending',
      askedBy: {
        name: data.name?.trim() || 'Anonymous Patron',
        email: data.email?.trim() || '',
      },
      askedAt: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
    };

    const updated = [newItem, ...faqs];
    saveFaqs(updated);
    return newItem;
  };

  const answerQuestion = (
    id: string,
    answer: string,
    category?: FAQCategory,
    publish: boolean = true
  ) => {
    const updated = faqs.map((faq) => {
      if (faq.id === id) {
        return {
          ...faq,
          answer: answer.trim(),
          category: category || faq.category,
          status: publish ? ('published' as FAQStatus) : ('pending' as FAQStatus),
          answeredBy: 'Atelier Concierge',
          answeredAt: new Date().toISOString().split('T')[0],
        };
      }
      return faq;
    });

    saveFaqs(updated);
  };

  const createFAQ = (data: {
    question: string;
    answer: string;
    category: FAQCategory;
    status?: FAQStatus;
  }): FAQItem => {
    const newFaq: FAQItem = {
      id: `faq-adm-${Date.now()}`,
      question: data.question.trim(),
      answer: data.answer.trim(),
      category: data.category,
      status: data.status || 'published',
      askedAt: new Date().toISOString().split('T')[0],
      answeredBy: 'Atelier Staff',
      answeredAt: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
    };

    const updated = [newFaq, ...faqs];
    saveFaqs(updated);
    return newFaq;
  };

  const updateFAQ = (id: string, updates: Partial<FAQItem>) => {
    const updated = faqs.map((faq) => {
      if (faq.id === id) {
        return { ...faq, ...updates };
      }
      return faq;
    });
    saveFaqs(updated);
  };

  const deleteFAQ = (id: string) => {
    const updated = faqs.filter((faq) => faq.id !== id);
    saveFaqs(updated);
  };

  const hasVotedHelpful = (id: string) => helpfulVotes.includes(id);

  const markHelpful = (id: string): boolean => {
    if (helpfulVotes.includes(id)) return false;

    const newVotes = [...helpfulVotes, id];
    setHelpfulVotes(newVotes);
    try {
      localStorage.setItem(STORAGE_FAQ_VOTES_KEY, JSON.stringify(newVotes));
    } catch (e) {
      console.error(e);
    }

    const updated = faqs.map((faq) => {
      if (faq.id === id) {
        return { ...faq, helpfulCount: (faq.helpfulCount || 0) + 1 };
      }
      return faq;
    });
    saveFaqs(updated);
    return true;
  };

  const resetToSeedFAQs = () => {
    saveFaqs(SEED_FAQS);
  };

  return (
    <FAQContext.Provider
      value={{
        faqs,
        publishedFaqs,
        pendingFaqs,
        pendingCount,
        askQuestion,
        answerQuestion,
        createFAQ,
        updateFAQ,
        deleteFAQ,
        markHelpful,
        hasVotedHelpful,
        resetToSeedFAQs,
      }}
    >
      {children}
    </FAQContext.Provider>
  );
};

export const useFAQ = () => {
  const context = useContext(FAQContext);
  if (!context) {
    throw new Error('useFAQ must be used within an FAQProvider');
  }
  return context;
};
