'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutGrid,
  List,
  ChevronDown,
  SlidersHorizontal,
  Plus,
  Loader2,
  ArrowUp,
  CheckCircle2
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { QuickViewModal } from './QuickViewModal';
import { VignetteCanvas, VignetteItem } from './VignetteCanvas';
import { useFilters } from '@/context/FilterContext';
import { useProducts, DEFAULT_LOOKBOOK_CAPSULES } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import { productMatchesColor } from '@/utils/filterUtils';
import { Sparkles, ChevronUp, Layers } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { products, storeSettings } = useProducts();
  const {
    selectedCategory,
    maxPrice,
    selectedColor,
    selectedSize,
    inStockOnly,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    searchQuery,
    resetFilters,
    setIsMobileFilterOpen,
  } = useFilters();

  const { addToCart, setIsCartOpen } = useCart();
  const [batchSize, setBatchSize] = useState<number>(6);
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Capsule Lookbook Studio State
  const [activeCapsuleIndex, setActiveCapsuleIndex] = useState(0);
  const [isCapsulePaused, setIsCapsulePaused] = useState(false);
  const [addedVignetteItemId, setAddedVignetteItemId] = useState<string | null>(null);
  const [isCapsuleAllAdded, setIsCapsuleAllAdded] = useState(false);

  // Active Capsules from StoreSettings (or defaults)
  const activeCapsules = useMemo(() => {
    const raw =
      storeSettings.lookbookCapsules && storeSettings.lookbookCapsules.length > 0
        ? storeSettings.lookbookCapsules
        : DEFAULT_LOOKBOOK_CAPSULES;
    return raw.filter((c) => c.enabled !== false && c.showOnShop !== false);
  }, [storeSettings.lookbookCapsules]);

  // Auto-transition timer between capsules with dynamic configurable interval (pauses on hover)
  const shopTransitionDelay = Math.max(800, Math.round((storeSettings.lookbookTransitionInterval || 2.0) * 1000));

  useEffect(() => {
    if (isCapsulePaused || activeCapsules.length <= 1) return;
    const timer = setInterval(() => {
      setActiveCapsuleIndex((prev) => (prev + 1) % activeCapsules.length);
    }, shopTransitionDelay);
    return () => clearInterval(timer);
  }, [isCapsulePaused, activeCapsules.length, shopTransitionDelay]);

  const currentCapsule = activeCapsules[activeCapsuleIndex % Math.max(1, activeCapsules.length)] || activeCapsules[0];

  // Dynamically build 3 vignette hotspot items for the active capsule
  const currentVignetteItems: VignetteItem[] = useMemo(() => {
    if (!currentCapsule) return [];
    const slots = [
      { top: '28%', left: '18%', align: 'left' as const },
      { top: '52%', left: '50%', align: 'center' as const },
      { top: '32%', left: '82%', align: 'right' as const },
    ];
    return (currentCapsule.productIds || []).map((pid, idx) => {
      const prod = products.find((p) => p.id === pid) || products[idx] || products[0];
      const slot = slots[idx] || slots[0];
      return {
        id: `v-shop-${currentCapsule.id}-${prod?.id || idx}-${idx}`,
        productId: prod?.id,
        name: prod?.name || 'Artisan Object',
        category: prod?.category || 'HOME GOODS',
        price: prod?.price || 29.99,
        illustration: (prod?.illustration as any) || 'vase',
        color: prod?.colors?.[0]?.hex || '#25435a',
        imageUrl: prod?.imageUrl,
        top: slot.top,
        left: slot.left,
        popoverAlign: slot.align,
        description: prod?.description || 'Crafted with natural materials and timeless proportions.',
        badgeText: prod?.badge?.text,
        artisanNote: prod?.details?.[0] || 'Handcrafted slow living design',
      };
    });
  }, [currentCapsule, products]);

  const handleAddVignetteItem = (item: VignetteItem) => {
    const prod = products.find((p) => p.id === item.productId || p.name === item.name);
    if (!prod) return;
    const color = prod.colors[0] || { name: 'Natural', hex: '#25435a' };
    const size = prod.sizes[0] || 'Standard';
    addToCart(prod, color, size, 1);
    setAddedVignetteItemId(item.id);
    setIsCartOpen(true);
    setTimeout(() => setAddedVignetteItemId(null), 2500);
  };

  const handleAddEntireCapsule = () => {
    currentVignetteItems.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId || p.name === item.name);
      if (prod) {
        const color = prod.colors[0] || { name: 'Natural', hex: '#25435a' };
        const size = prod.sizes[0] || 'Standard';
        addToCart(prod, color, size, 1);
      }
    });
    setIsCapsuleAllAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setIsCapsuleAllAdded(false), 2800);
  };


  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'ALL' && product.category !== selectedCategory) {
        return false;
      }

      // Max price filter
      if (product.price > maxPrice) {
        return false;
      }

      // In stock filter
      if (inStockOnly && !product.inStock) {
        return false;
      }

      // Color filter with intelligent palette family & custom matching
      if (selectedColor && !productMatchesColor(product, selectedColor)) {
        return false;
      }

      // Size filter
      if (selectedSize && !product.sizes.includes(selectedSize)) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        const matchCat = product.category.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCat) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
        default:
          return 0;
      }
    });
  }, [selectedCategory, maxPrice, selectedColor, selectedSize, inStockOnly, sortBy, searchQuery]);

  // Reset visible count to batchSize whenever filters or search change
  useEffect(() => {
    setVisibleCount(batchSize);
  }, [selectedCategory, maxPrice, selectedColor, selectedSize, inStockOnly, sortBy, searchQuery, batchSize]);

  // Load More handler with brief loading indicator
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + batchSize);
      setIsLoadingMore(false);
    }, 280);
  };

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;
  const progressPercent = filteredProducts.length > 0
    ? Math.min(100, Math.round((displayedProducts.length / filteredProducts.length) * 100))
    : 0;


  return (
    <div className="page-enter flex-1 bg-surface py-8 px-5 sm:px-6 md:px-margin flex flex-col justify-between">
      <div>
        {/* Top Control Bar: Breadcrumb + Title + Sort Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-8 border-b border-surface-variant gap-4">
          <div>
            <nav className="flex items-center gap-1.5 font-label-sm text-xs text-on-surface-variant mb-1">
              <span>Home</span>
              <span className="opacity-40">/</span>
              <span>Shop</span>
              <span className="opacity-40">/</span>
              <span className="text-on-surface font-semibold">
                {selectedCategory === 'ALL' ? 'All Products' : selectedCategory}
              </span>
            </nav>
            <div className="flex items-baseline gap-3">
              <h1 className="font-display-lg text-2xl sm:text-3xl lg:text-4xl text-on-surface font-bold tracking-tight">
                {selectedCategory === 'ALL' ? 'Full Catalog' : `${selectedCategory}`}
              </h1>
              <span className="font-body-md text-sm text-on-surface-variant font-medium">
                ({filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'})
              </span>
            </div>
          </div>

          {/* Controls: Mobile Filter Button + View Mode + Sort Dropdown */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-end">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="btn-interactive md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant/40 bg-surface-lowest text-xs font-semibold text-on-surface active:scale-95 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Grid / List View Toggle */}
            <div className="flex items-center border border-outline-variant/40 rounded-lg p-0.5 bg-surface-lowest shadow-2xs">
              <button
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                className={`btn-interactive p-1.5 rounded active:scale-90 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-primary-container text-white shadow-xs'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                <LayoutGrid className="w-4 h-4 block" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                aria-label="List view"
                className={`btn-interactive p-1.5 rounded active:scale-90 transition-all ${
                  viewMode === 'list'
                    ? 'bg-primary-container text-white shadow-xs'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                <List className="w-4 h-4 block" />
              </button>
            </div>

            {/* Products Per Load Selector */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline font-label-caps text-xs tracking-label-caps text-on-surface-variant uppercase font-semibold">
                Per Load:
              </span>
              <div className="relative">
                <select
                  value={batchSize}
                  onChange={(e) => {
                    const newSize = Number(e.target.value);
                    setBatchSize(newSize);
                    setVisibleCount(newSize);
                  }}
                  aria-label="Select products to load per batch"
                  className="appearance-none bg-surface-lowest text-on-surface border border-outline-variant/40 rounded-lg pl-3 pr-8 py-1.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all cursor-pointer shadow-2xs"
                >
                  <option value={4}>4 items</option>
                  <option value={6}>6 items</option>
                  <option value={8}>8 items</option>
                  <option value={12}>12 items</option>
                  <option value={18}>18 items</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-outline" />
              </div>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline font-label-caps text-xs tracking-label-caps text-on-surface-variant uppercase font-semibold">
                Sort by:
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-surface-lowest text-on-surface border border-outline-variant/40 rounded-lg pl-3 pr-8 py-1.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all cursor-pointer shadow-2xs"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-outline" />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE CAPSULE LOOKBOOK STUDIO ("LIVING SPACES & TRANSIT") */}
        {/* ============================================================ */}
        {storeSettings.showLookbookOnShop !== false && activeCapsules.length > 0 && currentCapsule && (
          <div className="mb-10">
            {/* Dynamic Vignette Canvas with architectural triangular transition & in-canvas floating HUD */}
            <div className="relative rounded-3xl overflow-hidden shadow-card">
              <div key={`${currentCapsule.id}-${activeCapsuleIndex}`} className="capsule-enter-animate">
                <VignetteCanvas
                  title={currentCapsule.title}
                  eyebrow={currentCapsule.eyebrow}
                  description={currentCapsule.description}
                  studioTag={currentCapsule.studioTag}
                  theme={currentCapsule.theme}
                  items={currentVignetteItems}
                  onAddToCart={handleAddVignetteItem}
                  addedItemId={addedVignetteItemId}
                  onAddAll={handleAddEntireCapsule}
                  addAllLabel="Add 3-Piece Capsule"
                  isAllAdded={isCapsuleAllAdded}
                  heightClass="h-[340px] sm:h-[400px] md:h-[440px]"
                  activeCapsuleIndex={activeCapsuleIndex}
                  totalCapsules={activeCapsules.length}
                  onNextCapsule={() => setActiveCapsuleIndex((prev) => (prev + 1) % activeCapsules.length)}
                  onPrevCapsule={() => setActiveCapsuleIndex((prev) => (prev - 1 + activeCapsules.length) % activeCapsules.length)}
                  onSelectCapsule={(idx) => setActiveCapsuleIndex(idx)}
                  isPaused={isCapsulePaused}
                  onHoverChange={setIsCapsulePaused}
                />
              </div>
            </div>
          </div>
        )}

        {/* Products Grid or List */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center bg-surface-low rounded-xl border border-outline-variant/30 px-4 my-6">
            <p className="font-headline-md text-lg font-semibold text-on-surface mb-2">
              No matching essentials found
            </p>
            <p className="font-body-md text-sm text-on-surface-variant max-w-sm mb-6">
              Try adjusting your price range, clearing active color/size filters, or resetting your search.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-primary text-white font-label-caps text-xs tracking-label-caps rounded-lg hover:bg-primary-container transition-colors font-semibold uppercase"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode="grid"
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode="list"
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Load More & Progress Section */}
      {filteredProducts.length > 0 && (
        <div className="mt-12 mb-6 flex flex-col items-center justify-center max-w-md mx-auto w-full px-4">
          {/* Progress Indicator */}
          <div className="w-full text-center mb-5">
            <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1.5 font-medium">
              <span className="font-label-caps uppercase tracking-wider text-[11px]">
                Showing <strong className="text-on-surface font-semibold">{displayedProducts.length}</strong> of{' '}
                <strong className="text-on-surface font-semibold">{filteredProducts.length}</strong> items
              </span>
              <span className="font-mono text-xs font-bold text-primary">
                {progressPercent}%
              </span>
            </div>
            {/* Visual Progress Bar */}
            <div className="w-full h-1.5 bg-surface-low rounded-full overflow-hidden border border-outline-variant/25">
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Load More Button or Finished Indicator */}
          {hasMore ? (
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="btn-interactive w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary-container active:scale-[0.98] text-white font-label-caps text-xs tracking-label-caps uppercase font-bold rounded-xl shadow-subtle hover:shadow-card transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-80"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-secondary-container" />
                    <span>Loading Next Batch...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-secondary-container group-hover:rotate-90 transition-transform duration-200" />
                    <span>
                      Load More (+{Math.min(batchSize, filteredProducts.length - displayedProducts.length)})
                    </span>
                  </>
                )}
              </button>

              {/* Quick Batch Options */}
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <span className="text-[10px] uppercase tracking-wider font-semibold">Batch:</span>
                <div className="inline-flex rounded-lg border border-outline-variant/40 bg-surface-lowest p-0.5">
                  {[4, 6, 12].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setBatchSize(size);
                        setVisibleCount((prev) => Math.max(prev, size));
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                        batchSize === size
                          ? 'bg-primary text-white font-bold'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* All Items Displayed State */
            <div className="flex flex-col items-center gap-2 text-center pt-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-low border border-outline-variant/30 text-xs text-on-surface font-medium">
                <CheckCircle2 className="w-4 h-4 text-olive" />
                <span>You have viewed all {filteredProducts.length} items</span>
              </div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline mt-1 cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Back to top</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
