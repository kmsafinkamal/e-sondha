'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CategoryType } from '@/types';

interface FilterContextType {
  selectedCategory: CategoryType;
  setSelectedCategory: (cat: CategoryType) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  selectedSize: string | null;
  setSelectedSize: (size: string | null) => void;
  inStockOnly: boolean;
  setInStockOnly: (inStock: boolean) => void;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'rating';
  setSortBy: (sort: 'newest' | 'price-asc' | 'price-desc' | 'rating') => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: (open: boolean) => void;
  activeFilterCount: number;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(150);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'rating'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Sync category with URL search param (?category=CLOTHING etc.) on load and popstate
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncCategoryFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat) {
        const upper = cat.toUpperCase().replace(/\+/g, ' ');
        if (upper === 'CLOTHING' || upper === 'HOME GOODS' || upper === 'ACCESSORIES') {
          setSelectedCategory(upper as CategoryType);
        } else if (upper === 'ALL') {
          setSelectedCategory('ALL');
        }
      }
    };

    syncCategoryFromUrl();
    window.addEventListener('popstate', syncCategoryFromUrl);
    return () => window.removeEventListener('popstate', syncCategoryFromUrl);
  }, []);

  const activeFilterCount =
    (selectedCategory !== 'ALL' ? 1 : 0) +
    (maxPrice < 150 ? 1 : 0) +
    (selectedColor !== null ? 1 : 0) +
    (selectedSize !== null ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const resetFilters = () => {
    setSelectedCategory('ALL');
    setMaxPrice(150);
    setSelectedColor(null);
    setSelectedSize(null);
    setInStockOnly(false);
    setSearchQuery('');
  };

  return (
    <FilterContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        maxPrice,
        setMaxPrice,
        selectedColor,
        setSelectedColor,
        selectedSize,
        setSelectedSize,
        inStockOnly,
        setInStockOnly,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        searchQuery,
        setSearchQuery,
        resetFilters,
        isMobileFilterOpen,
        setIsMobileFilterOpen,
        activeFilterCount,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
