'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductReview } from '@/types';
import { SEED_REVIEWS } from '@/data/reviews';
import { useProducts } from '@/context/ProductContext';

export interface ProductRatingStats {
  averageRating: number;
  totalCount: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  recommendPercentage: number;
}

interface ReviewContextType {
  reviews: ProductReview[];
  addReview: (review: Omit<ProductReview, 'id' | 'date' | 'helpfulCount'>) => void;
  deleteReview: (reviewId: string) => void;
  markHelpful: (reviewId: string) => boolean;
  hasVotedHelpful: (reviewId: string) => boolean;
  addAdminReply: (reviewId: string, replyText: string, author?: string) => void;
  getProductReviews: (productId: string) => ProductReview[];
  getProductStats: (productId: string) => ProductRatingStats;
  resetReviewsToSeed: () => void;
}

const STORAGE_REVIEWS_KEY = 'esondha_reviews_v2';
const STORAGE_VOTES_KEY = 'esondha_helpful_votes_v1';

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { updateProduct } = useProducts();
  const [reviews, setReviews] = useState<ProductReview[]>(SEED_REVIEWS);
  const [helpfulVotes, setHelpfulVotes] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Load persisted reviews and votes from localStorage on mount
  useEffect(() => {
    try {
      const storedReviews = localStorage.getItem(STORAGE_REVIEWS_KEY);
      if (storedReviews) {
        const parsed = JSON.parse(storedReviews);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviews(parsed);
        } else {
          setReviews(SEED_REVIEWS);
          localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(SEED_REVIEWS));
        }
      } else {
        localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(SEED_REVIEWS));
      }

      const storedVotes = localStorage.getItem(STORAGE_VOTES_KEY);
      if (storedVotes) {
        setHelpfulVotes(JSON.parse(storedVotes));
      }
    } catch (err) {
      console.error('Failed to load reviews from localStorage:', err);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Helper to persist and sync aggregates
  const persistReviews = (updated: ProductReview[]) => {
    setReviews(updated);
    try {
      localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save reviews to localStorage:', e);
    }
  };

  // Synchronize product aggregate ratings in ProductContext
  const syncProductAggregate = (productId: string, updatedReviews: ProductReview[]) => {
    const productRevs = updatedReviews.filter((r) => r.productId === productId);
    if (productRevs.length === 0) {
      updateProduct(productId, { rating: 5.0, reviewCount: 0 });
      return;
    }
    const sum = productRevs.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / productRevs.length).toFixed(1));
    updateProduct(productId, { rating: avg, reviewCount: productRevs.length });
  };

  // Add new customer review
  const addReview = (newRevData: Omit<ProductReview, 'id' | 'date' | 'helpfulCount'>) => {
    const newReview: ProductReview = {
      ...newRevData,
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
    };

    const updated = [newReview, ...reviews];
    persistReviews(updated);
    syncProductAggregate(newReview.productId, updated);
  };

  // Delete review (Admin moderation)
  const deleteReview = (reviewId: string) => {
    const target = reviews.find((r) => r.id === reviewId);
    if (!target) return;

    const updated = reviews.filter((r) => r.id !== reviewId);
    persistReviews(updated);
    syncProductAggregate(target.productId, updated);
  };

  // Helpful Upvote (one vote per browser)
  const markHelpful = (reviewId: string): boolean => {
    if (helpfulVotes.includes(reviewId)) {
      return false; // already voted
    }

    const updatedVotes = [...helpfulVotes, reviewId];
    setHelpfulVotes(updatedVotes);
    try {
      localStorage.setItem(STORAGE_VOTES_KEY, JSON.stringify(updatedVotes));
    } catch (e) {
      console.error('Failed to save helpful votes:', e);
    }

    const updatedReviews = reviews.map((r) => {
      if (r.id === reviewId) {
        return { ...r, helpfulCount: (r.helpfulCount || 0) + 1 };
      }
      return r;
    });

    persistReviews(updatedReviews);
    return true;
  };

  const hasVotedHelpful = (reviewId: string) => {
    return helpfulVotes.includes(reviewId);
  };

  // Add studio/atelier curator response to a patron review
  const addAdminReply = (reviewId: string, replyText: string, author?: string) => {
    const updated = reviews.map((r) => {
      if (r.id === reviewId) {
        return {
          ...r,
          adminReply: {
            text: replyText.trim(),
            date: new Date().toISOString().split('T')[0],
            author: author?.trim() || 'E Sondha Studio Curator',
          },
        };
      }
      return r;
    });
    persistReviews(updated);
  };

  // Get reviews belonging to a product
  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  // Compute rating stats & distribution for a product
  const getProductStats = (productId: string): ProductRatingStats => {
    const productRevs = reviews.filter((r) => r.productId === productId);
    const totalCount = productRevs.length;

    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    if (totalCount === 0) {
      return {
        averageRating: 5.0,
        totalCount: 0,
        distribution,
        recommendPercentage: 100,
      };
    }

    let sum = 0;
    let recommendCount = 0;

    productRevs.forEach((r) => {
      sum += r.rating;
      const roundedRating = Math.max(1, Math.min(5, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      distribution[roundedRating] = (distribution[roundedRating] || 0) + 1;
      if (r.recommendProduct !== false && r.rating >= 4) {
        recommendCount++;
      }
    });

    const averageRating = Number((sum / totalCount).toFixed(1));
    const recommendPercentage = Math.round((recommendCount / totalCount) * 100);

    return {
      averageRating,
      totalCount,
      distribution,
      recommendPercentage,
    };
  };

  const resetReviewsToSeed = () => {
    persistReviews(SEED_REVIEWS);
    setHelpfulVotes([]);
    localStorage.removeItem(STORAGE_VOTES_KEY);
    // sync all seed products
    const productIds = Array.from(new Set(SEED_REVIEWS.map((r) => r.productId)));
    productIds.forEach((pid) => syncProductAggregate(pid, SEED_REVIEWS));
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        addReview,
        deleteReview,
        markHelpful,
        hasVotedHelpful,
        addAdminReply,
        getProductReviews,
        getProductStats,
        resetReviewsToSeed,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};
