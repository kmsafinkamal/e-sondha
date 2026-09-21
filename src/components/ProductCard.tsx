'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Star, ShoppingCart, Check, Eye, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Product, ProductColor } from '@/types';
import { ProductIllustration, isLightColor } from './ProductIllustrations';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  viewMode = 'grid',
}) => {
  const { addToCart, isInWishlist, toggleWishlist } = useCart();

  // Workable card options: default to first color and middle size
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes[Math.floor(product.sizes.length / 2)] || product.sizes[0]
  );
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [cardView, setCardView] = useState<'photo' | 'symbol'>(
    product.imageUrl ? 'photo' : 'symbol'
  );
  const isFavorited = isInWishlist(product.id);

  const isAvailable = product.inStock && (product.stockQuantity === undefined || product.stockQuantity > 0);
  const isLowStock = isAvailable && product.stockQuantity !== undefined && product.stockQuantity <= 3;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) return;

    addToCart(product, selectedColor, selectedSize, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1600);
  };

  const getBadgeStyle = (variant: string) => {
    switch (variant) {
      case 'bestseller':
        return 'bg-primary-container text-white';
      case 'organic':
        return 'bg-olive text-white';
      case 'popular':
        return 'bg-secondary text-white';
      case 'new':
        return 'bg-primary text-white';
      case 'limited':
        return 'bg-terracotta text-white';
      case 'eco':
        return 'bg-surface-container text-on-surface-variant';
      case 'handmade':
        return 'bg-secondary-container text-on-secondary-fixed';
      case 'featured':
        return 'bg-primary text-white';
      default:
        return 'bg-primary-container text-white';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="group bg-surface-lowest rounded-lg border border-outline-variant/30 hover:border-primary-container p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
        {/* Visual Box */}
        <div className={`w-full sm:w-36 h-36 shrink-0 rounded-lg border flex items-center justify-center p-2 relative overflow-hidden transition-colors duration-300 ${
          isLightColor(selectedColor.hex)
            ? 'bg-[#ece7e1] border-outline-variant/50 shadow-xs'
            : 'bg-surface-low border-outline-variant/20'
        }`}>
          <Link
            href={`/product/${product.id}`}
            className="w-full h-full flex items-center justify-center cursor-pointer"
          >
            {cardView === 'photo' && product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-img-zoom w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <ProductIllustration
                name={product.illustration}
                color={selectedColor.hex}
                className="product-img-zoom w-20 h-20 stroke-[1.6] transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </Link>

          {/* Photo/Symbol view toggle if photo exists */}
          {product.imageUrl && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCardView((v) => (v === 'photo' ? 'symbol' : 'photo'));
              }}
              title={cardView === 'photo' ? 'View Symbol' : 'View Photo'}
              className="absolute bottom-2 right-2 p-1 bg-surface-lowest/90 hover:bg-white text-on-surface-variant rounded-md shadow-xs border border-outline-variant/30 transition-colors"
            >
              {cardView === 'photo' ? <Sparkles className="w-3 h-3 text-primary" /> : <ImageIcon className="w-3 h-3 text-primary" />}
            </button>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {!isAvailable ? (
              <span className="font-label-caps text-[9px] tracking-wider px-1.5 py-0.5 rounded font-bold uppercase bg-stone-700 text-white">
                Sold Out
              </span>
            ) : isLowStock ? (
              <span className="font-label-caps text-[9px] tracking-wider px-1.5 py-0.5 rounded font-bold uppercase bg-amber-600 text-white">
                Only {product.stockQuantity} Left
              </span>
            ) : product.badge ? (
              <span
                className={`font-label-caps text-[10px] tracking-wider px-1.5 py-0.5 rounded font-semibold uppercase ${getBadgeStyle(
                  product.badge.variant
                )}`}
              >
                {product.badge.text}
              </span>
            ) : null}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 w-full min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-caps text-[11px] tracking-label-caps text-on-surface-variant block mb-0.5">
                {product.category}
              </span>
              <Link href={`/product/${product.id}`} className="hover:text-primary transition-colors">
                <h3 className="font-headline-md text-base sm:text-lg text-on-surface font-semibold">
                  {product.name}
                </h3>
              </Link>
            </div>
            <div className="text-right">
              <span className="font-headline-md text-lg text-primary font-bold">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="block text-xs text-outline line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant line-clamp-2 mt-1">
            {product.description}
          </p>

          {/* Workable Card Options Bar */}
          <div className="mt-3 pt-3 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-3">
            {/* Swatches & Sizes */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Color selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-on-surface-variant">Color:</span>
                <div className="flex items-center gap-1">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      title={c.name}
                      style={{ backgroundColor: c.hex }}
                      className={`w-4 h-4 rounded-full border transition-all ${
                        selectedColor.name === c.name
                          ? 'ring-2 ring-offset-1 ring-primary scale-110 border-white'
                          : 'border-outline-variant/40 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Size selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-on-surface-variant">Size:</span>
                <div className="flex items-center gap-1">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                        selectedSize === s
                          ? 'bg-primary text-white font-bold'
                          : 'bg-surface-low text-on-surface-variant border border-outline-variant/30 hover:border-primary'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`btn-interactive p-1.5 rounded-full border active:scale-90 transition-all ${
                  isFavorited
                    ? 'text-terracotta border-terracotta/40 bg-terracotta/5'
                    : 'text-outline border-outline-variant/30 hover:text-terracotta'
                }`}
                aria-label="Toggle Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
              {onQuickView && (
                <button
                  onClick={() => onQuickView(product)}
                  className="btn-interactive p-1.5 rounded-full border border-outline-variant/30 text-outline hover:text-primary hover:border-primary active:scale-90 transition-all"
                  aria-label="Quick View"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className={`btn-interactive flex items-center gap-1.5 px-3.5 py-1.5 rounded font-label-caps text-xs tracking-label-caps font-semibold uppercase active:scale-[0.97] transition-all duration-200 ${
                  !isAvailable
                    ? 'bg-outline-variant/40 text-outline cursor-not-allowed'
                    : isAdded
                    ? 'bg-olive text-white'
                    : 'bg-primary hover:bg-primary-container text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{isAvailable ? 'Add' : 'Sold Out'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Card (Primary design from Stitch)
  return (
    <div className="product-card group bg-surface-lowest rounded-lg border border-outline-variant/30 hover:border-primary-container p-5 sm:p-6 flex flex-col justify-between cursor-pointer relative transition-all duration-200 hover:-translate-y-1 hover:shadow-card">
      {/* Top Card Row: Badge + Wishlist Action */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {!isAvailable ? (
            <span className="font-label-caps text-[9px] tracking-wider px-2 py-0.5 rounded font-bold uppercase bg-stone-700 text-white">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="font-label-caps text-[9px] tracking-wider px-2 py-0.5 rounded font-bold uppercase bg-amber-600 text-white">
              Only {product.stockQuantity} Left
            </span>
          ) : product.badge ? (
            <span
              className={`font-label-caps text-[10px] tracking-wider px-2 py-0.5 rounded font-semibold uppercase ${getBadgeStyle(
                product.badge.variant
              )}`}
            >
              {product.badge.text}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-1">
          {onQuickView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="btn-interactive p-1.5 text-outline/60 hover:text-primary active:scale-90 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
              title="Quick view"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`btn-interactive p-1.5 rounded-full active:scale-90 transition-all ${
              isFavorited
                ? 'text-terracotta'
                : 'text-outline/60 hover:text-terracotta'
            }`}
            title="Add to Wishlist"
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Central Framing: Minimal Line-Art Vector OR Uploaded Photo */}
      <div className={`relative w-full h-40 sm:h-44 flex items-center justify-center mb-3 mt-1 overflow-hidden rounded-lg transition-colors duration-300 ${
        isLightColor(selectedColor.hex)
          ? 'bg-[#ece7e1] border border-outline-variant/50 shadow-xs'
          : 'bg-surface-low/50'
      }`}>
        <Link
          href={`/product/${product.id}`}
          className="w-full h-full flex items-center justify-center cursor-pointer group-hover:opacity-95 p-2"
        >
          {cardView === 'photo' && product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-img-zoom w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <ProductIllustration
              name={product.illustration}
              color={selectedColor.hex}
              className="product-img-zoom w-24 h-24 sm:w-28 sm:h-28 stroke-[1.6] transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </Link>

        {/* Photo / Symbol Switcher Pill if product has image */}
        {product.imageUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCardView((v) => (v === 'photo' ? 'symbol' : 'photo'));
            }}
            title={cardView === 'photo' ? 'View Line Art Symbol' : 'View Atelier Photo'}
            className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-surface-lowest/90 hover:bg-white text-[10px] font-semibold text-on-surface-variant rounded-md shadow-xs border border-outline-variant/30 transition-all z-10"
          >
            {cardView === 'photo' ? (
              <>
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="hidden group-hover:inline">Symbol</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-3 h-3 text-primary" />
                <span className="hidden group-hover:inline">Photo</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Card Body: Information */}
      <div className="w-full flex flex-col items-center text-center">
        <span className="font-label-caps text-[11px] tracking-label-caps text-on-surface-variant block mb-1">
          {product.category}
        </span>
        <Link href={`/product/${product.id}`} className="hover:text-primary transition-colors">
          <h2 className="font-body-lg text-sm sm:text-base text-on-surface font-semibold tracking-tight">
            {product.name}
          </h2>
        </Link>

        {/* Star Rating & Review Count */}
        <div className="flex items-center gap-1.5 my-1.5">
          <div className="flex items-center text-terracotta">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-label-sm text-xs font-semibold text-on-surface">
            {product.rating.toFixed(1)}
          </span>
          <span className="font-label-sm text-xs text-on-surface-variant">
            ({product.reviewCount})
          </span>
        </div>

        {/* WORKABLE CARD OPTIONS (Color swatches + Size chips) */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full mt-2 pt-2 border-t border-outline-variant/15 flex flex-col gap-2"
        >
          {/* Workable Color Swatches */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] uppercase font-semibold text-on-surface-variant tracking-wider">
              {selectedColor.name}
            </span>
            <div className="flex items-center gap-1.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  title={c.name}
                  style={{ backgroundColor: c.hex }}
                  className={`btn-interactive w-3.5 h-3.5 rounded-full transition-all active:scale-90 ${
                    selectedColor.name === c.name
                      ? 'ring-2 ring-offset-1 ring-primary scale-110 border-white'
                      : 'border border-outline-variant/40 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Workable Size Pills */}
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSize(s)}
                className={`btn-interactive px-1.5 py-0.5 rounded text-[10px] active:scale-95 transition-all ${
                  selectedSize === s
                    ? 'bg-primary text-white font-bold'
                    : 'bg-surface-low text-on-surface-variant border border-outline-variant/30 hover:border-primary'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Card Footer: Price & Add to Cart Action */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-between w-full mt-3 pt-2.5 border-t border-outline-variant/15"
        >
          <div className="text-left">
            <span className="font-headline-md text-base sm:text-lg text-primary font-bold">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="block text-[11px] text-outline line-through leading-tight">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`btn-interactive flex items-center gap-1 px-3 py-1.5 rounded font-label-caps text-xs tracking-label-caps uppercase font-semibold active:scale-[0.97] transition-all duration-200 ${
              !isAvailable
                ? 'bg-outline-variant/40 text-outline cursor-not-allowed'
                : isAdded
                ? 'bg-olive text-white shadow-sm'
                : 'bg-primary hover:bg-primary-container text-white shadow-subtle'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{isAvailable ? 'Add' : 'Sold'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
