'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { X, Star, ShoppingBag, Check, Heart, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Product, ProductColor } from '@/types';
import { ProductIllustration, isLightColor } from './ProductIllustrations';
import { useCart } from '@/context/CartContext';
import { useReviews } from '@/context/ReviewContext';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const { getProductStats } = useReviews();
  const stats = getProductStats(product.id);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);
  const [viewMode, setViewMode] = useState<'photo' | 'symbol'>(
    product.imageUrl ? 'photo' : 'symbol'
  );
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsVisible(true), 16);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 240);
  };

  const isFavorited = isInWishlist(product.id);
  const isAvailable = product.inStock && (product.stockQuantity === undefined || product.stockQuantity > 0);
  const maxStock = product.stockQuantity !== undefined ? product.stockQuantity : 99;
  const isLowStock = isAvailable && product.stockQuantity !== undefined && product.stockQuantity <= 3;

  const handleAdd = () => {
    if (!isAvailable) return;
    addToCart(product, selectedColor, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      handleClose();
    }, 1200);
  };

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm drawer-backdrop cursor-pointer ${
          isVisible ? 'drawer-backdrop-open' : ''
        }`}
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative bg-surface rounded-xl border border-outline-variant/40 shadow-2xl max-w-2xl w-full z-10 overflow-hidden my-8 modal-dialog-panel ${
          isVisible ? 'modal-dialog-panel-open' : ''
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="btn-interactive absolute top-4 right-4 p-2 text-outline hover:text-on-surface active:scale-90 rounded-full hover:bg-surface-high transition-all z-10 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Illustration / Photo Showcase */}
          <div className={`border-b md:border-b-0 md:border-r border-outline-variant/30 p-8 flex flex-col items-center justify-center relative transition-colors duration-300 ${
            isLightColor(selectedColor.hex)
              ? 'bg-gradient-to-b from-[#eee8e2] to-[#ded7cf]'
              : 'bg-surface-low'
          }`}>
            {viewMode === 'photo' && product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-48 h-48 sm:w-56 sm:h-56 object-cover rounded-xl border border-outline-variant/30 shadow-subtle"
              />
            ) : (
              <ProductIllustration
                name={product.illustration}
                color={selectedColor.hex}
                className="w-40 h-40 stroke-[1.8] transition-all duration-300"
              />
            )}

            {/* View Mode Toggle Pill */}
            {product.imageUrl && (
              <div className="mt-4 flex items-center bg-surface-lowest p-1 rounded-full border border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setViewMode('photo')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    viewMode === 'photo'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('symbol')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    viewMode === 'symbol'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Symbol</span>
                </button>
              </div>
            )}

            <div className="mt-3 text-center">
              <span className="font-label-caps text-[11px] tracking-label-caps text-on-surface-variant uppercase font-semibold">
                {viewMode === 'photo' ? 'Atelier Photography' : 'Dynamic Color Archetype'}
              </span>
              <p className="text-xs text-outline mt-0.5">
                {viewMode === 'photo' ? 'Crafted artisan details' : 'Symbol tint reflects selected swatch'}
              </p>
            </div>
          </div>

          {/* Right: Workable Options & Specs */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-xs tracking-label-caps text-primary font-semibold">
                  {product.category}
                </span>
                <Link
                  href={`/product/${product.id}#reviews-section`}
                  onClick={onClose}
                  className="flex items-center gap-1 text-terracotta hover:opacity-80 transition-opacity"
                  title="View authentic patron reviews"
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-label-sm text-xs font-semibold text-on-surface">
                    {stats.totalCount > 0 ? stats.averageRating.toFixed(1) : product.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-on-surface-variant hover:text-primary hover:underline">
                    ({stats.totalCount > 0 ? stats.totalCount : product.reviewCount})
                  </span>
                </Link>
              </div>

              <h2 className="font-headline-lg text-xl sm:text-2xl text-on-surface font-bold mt-1">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-headline-md text-xl text-primary font-bold">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-outline line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Workable Color Selector */}
              <div className="mt-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface">
                    Color: <span className="font-normal text-on-surface-variant">{selectedColor.name}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      title={c.name}
                      style={{ backgroundColor: c.hex }}
                      className={`w-6 h-6 rounded-full border transition-all ${
                        selectedColor.name === c.name
                          ? 'ring-2 ring-offset-2 ring-primary scale-110 border-white'
                          : 'border-outline-variant/40 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Workable Size Selector */}
              <div className="mt-4">
                <span className="font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface block mb-2">
                  Select Size
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                        selectedSize === s
                          ? 'bg-primary text-white'
                          : 'bg-surface-low border border-outline-variant/40 text-on-surface hover:border-primary'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Status Indicator */}
              <div className="mt-3.5 flex items-center gap-2 text-xs">
                {!isAvailable ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold border border-stone-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
                    Sold Out / Currently Unavailable
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Low Stock: Only {product.stockQuantity} left in studio
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-olive/10 text-olive font-semibold border border-olive/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-olive" />
                    In Stock {product.stockQuantity !== undefined ? `(${product.stockQuantity} units)` : ''}
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mt-4 flex items-center gap-3">
                <span className="font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface">
                  Quantity:
                </span>
                <div className="inline-flex items-center border border-outline-variant/60 rounded-lg bg-surface-lowest">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={!isAvailable}
                    className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:text-on-surface text-sm disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-on-surface">
                    {isAvailable ? quantity : 0}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                    disabled={!isAvailable || quantity >= maxStock}
                    className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:text-on-surface text-sm disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-6 pt-4 border-t border-outline-variant/30 flex items-center gap-3">
              <button
                onClick={handleAdd}
                disabled={!isAvailable}
                className={`btn-interactive flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-label-caps text-xs tracking-label-caps font-semibold uppercase active:scale-[0.98] transition-all duration-200 ${
                  !isAvailable
                    ? 'bg-outline-variant/40 text-outline cursor-not-allowed'
                    : isAdded
                    ? 'bg-olive text-white'
                    : 'bg-primary hover:bg-primary-container text-white shadow-subtle'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isAvailable ? 'Add to Cart' : 'Sold Out'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`btn-interactive p-2.5 rounded-lg border active:scale-90 transition-all ${
                  isFavorited
                    ? 'text-terracotta border-terracotta/40 bg-terracotta/10'
                    : 'border-outline-variant/40 text-outline hover:text-terracotta'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
