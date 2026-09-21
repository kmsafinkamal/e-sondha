'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductIllustration } from './ProductIllustrations';
import { ProductIllustrationName } from '@/types';
import { Plus, Check, X, ArrowRight, Sparkles, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export interface VignetteItem {
  id: string;
  name: string;
  category?: string;
  price?: number;
  description: string;
  illustration: ProductIllustrationName;
  color?: string;
  imageUrl?: string;
  productId?: string;
  top: string; // e.g. "35%"
  left: string; // e.g. "20%"
  itemScale?: string;
  popoverAlign?: 'left' | 'center' | 'right';
  badgeText?: string;
  artisanNote?: string;
}

export interface VignetteCanvasProps {
  title?: string;
  eyebrow?: string;
  description?: string;
  studioTag?: string;
  theme?: 'warm-sand' | 'nordic-slate' | 'porto-terracotta' | 'sage-botanical';
  items: VignetteItem[];
  onAddToCart?: (item: VignetteItem) => void;
  addedItemId?: string | null;
  onAddAll?: () => void;
  addAllLabel?: string;
  isAllAdded?: boolean;
  compactHeader?: boolean;
  showCompanionDeck?: boolean;
  className?: string;
  heightClass?: string;
  // Integrated In-Canvas Controls (Header-Free Design)
  activeCapsuleIndex?: number;
  totalCapsules?: number;
  onNextCapsule?: () => void;
  onPrevCapsule?: () => void;
  onSelectCapsule?: (index: number) => void;
  isPaused?: boolean;
  onHoverChange?: (hovered: boolean) => void;
}

const THEME_STYLES = {
  'warm-sand': {
    gradient: 'from-[#f4efe8] via-[#e6dfd4] to-[#d4c8b7]',
    horizon: 'from-[#c5b8a5]/60 to-transparent',
    border: 'border-white/20',
    tagColor: 'text-[#25435a]/30',
  },
  'nordic-slate': {
    gradient: 'from-[#eef2f5] via-[#dde4eb] to-[#c7d2dd]',
    horizon: 'from-[#b3c1cf]/60 to-transparent',
    border: 'border-white/25',
    tagColor: 'text-[#25435a]/35',
  },
  'porto-terracotta': {
    gradient: 'from-[#f7efe9] via-[#ecdcd1] to-[#dbc2b2]',
    horizon: 'from-[#caa691]/60 to-transparent',
    border: 'border-white/25',
    tagColor: 'text-[#ba674d]/35',
  },
  'sage-botanical': {
    gradient: 'from-[#f0f4ee] via-[#e2e8df] to-[#cdd7c9]',
    horizon: 'from-[#9fb198]/60 to-transparent',
    border: 'border-white/25',
    tagColor: 'text-[#59634d]/35',
  },
};

export const VignetteCanvas: React.FC<VignetteCanvasProps> = ({
  title,
  eyebrow,
  description,
  studioTag = 'Atelier Curation · 35°N',
  theme = 'warm-sand',
  items,
  onAddToCart,
  addedItemId,
  onAddAll,
  addAllLabel,
  isAllAdded = false,
  compactHeader = true,
  showCompanionDeck = true,
  className = '',
  heightClass = 'h-[360px] sm:h-[420px] md:h-[460px]',
  activeCapsuleIndex = 0,
  totalCapsules = 1,
  onNextCapsule,
  onPrevCapsule,
  onSelectCapsule,
  isPaused = false,
  onHoverChange,
}) => {
  const dynamicAddAllLabel = addAllLabel || (items.length > 0 ? `Add ${items.length}-Piece Capsule` : 'Add Capsule');
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const themeStyle = THEME_STYLES[theme] || THEME_STYLES['warm-sand'];

  // Guarantee hover freeze whenever a hotspot popover is open
  useEffect(() => {
    if (activeHotspot !== null) {
      onHoverChange?.(true);
    }
  }, [activeHotspot, onHoverChange]);

  // Dismiss on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveHotspot(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className={`w-full ${className}`}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => {
        if (activeHotspot === null) {
          onHoverChange?.(false);
        }
      }}
    >
      {/* Backdrop Click Dismiss */}
      {activeHotspot !== null && (
        <div
          className="fixed inset-0 z-30 bg-black/15 backdrop-blur-[1px] transition-opacity cursor-pointer"
          onClick={() => setActiveHotspot(null)}
          aria-label="Close active hotspot inspector"
        />
      )}

      {/* Main Architectural Spatial Canvas */}
      <div
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => {
          if (!activeHotspot) onHoverChange?.(false);
        }}
        className={`relative w-full ${heightClass} rounded-3xl border border-on-surface/15 bg-gradient-to-b ${themeStyle.gradient} shadow-card p-6 sm:p-8 flex flex-col justify-between`}
      >
        {/* Subtle Lookbook Tag & Capsule Title (Top-Left) */}
        <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 bg-surface-lowest/90 backdrop-blur-md border border-on-surface/10 rounded-full px-3 py-1 shadow-2xs">
          <span className="text-[8px] text-primary">▲</span>
          <span className="font-label-caps text-[10px] tracking-widest uppercase font-bold text-primary">
            Spatial Lookbook
          </span>
          {title && (
            <>
              <span className="text-outline/40 text-[10px]">·</span>
              <span className="text-[10px] font-semibold text-on-surface truncate max-w-[140px] sm:max-w-xs">
                {title}
              </span>
            </>
          )}
        </div>

        {/* Top-Right Floating Bundle Action */}
        {onAddAll && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddAll();
            }}
            className="absolute top-3.5 right-3.5 z-20 btn-interactive px-3.5 py-1.5 rounded-full bg-surface-lowest/90 backdrop-blur-md border border-on-surface/10 text-on-surface hover:text-primary hover:bg-surface-lowest text-[10px] font-label-caps uppercase tracking-wider font-semibold flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer transition-all"
            title={isAllAdded ? `${items.length}-Piece Capsule Added` : dynamicAddAllLabel}
          >
            {isAllAdded ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Bundle Added</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-primary" />
                <span>{dynamicAddAllLabel}</span>
              </>
            )}
          </button>
        )}

        {/* Left & Right Subtle Floating Arrow Controls */}
        {totalCapsules !== undefined && totalCapsules > 1 && onPrevCapsule && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrevCapsule();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-surface-lowest/85 backdrop-blur-md border border-on-surface/10 text-on-surface flex items-center justify-center hover:bg-surface-lowest hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer opacity-75 hover:opacity-100"
            title="Previous capsule"
            aria-label="Previous capsule"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {totalCapsules !== undefined && totalCapsules > 1 && onNextCapsule && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNextCapsule();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-surface-lowest/85 backdrop-blur-md border border-on-surface/10 text-on-surface flex items-center justify-center hover:bg-surface-lowest hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer opacity-75 hover:opacity-100"
            title="Next capsule"
            aria-label="Next capsule"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Bottom Center: Minimal Triangular Pagination Indicator */}
        {totalCapsules !== undefined && totalCapsules > 1 && onSelectCapsule && (
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-surface-lowest/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-on-surface/10 shadow-2xs">
            {Array.from({ length: totalCapsules }).map((_, idx) => {
              const isActive = idx === (activeCapsuleIndex ?? 0);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCapsule(idx);
                  }}
                  className={`transition-all duration-300 flex items-center justify-center cursor-pointer ${
                    isActive
                      ? 'text-primary scale-125'
                      : 'text-outline/35 hover:text-outline scale-90'
                  }`}
                  title={`Capsule 0${idx + 1}`}
                  aria-label={`Capsule 0${idx + 1}`}
                >
                  <span className="text-[10px] leading-none">▲</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Floating Studio Tag (Bottom-Right) */}
        {studioTag && (
          <div className="absolute bottom-3.5 right-3.5 z-20 bg-surface-lowest/90 backdrop-blur-md border border-on-surface/10 rounded-xl px-2.5 py-1 shadow-2xs hidden sm:block">
            <span className="text-[10px] font-mono font-medium text-on-surface-variant">
              {studioTag}
            </span>
          </div>
        )}

        {/* Ambient Architecture & Lighting Elements (Clipped cleanly within rounded-3xl) */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          {/* Sunlight Angle Blur */}
          <div className="absolute -top-12 -right-12 w-96 h-96 bg-white/45 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-16 w-64 h-64 bg-white/30 rounded-full blur-2xl" />

          {/* Horizon Line */}
          <div
            className={`absolute bottom-0 inset-x-0 h-28 sm:h-36 bg-gradient-to-t ${themeStyle.horizon} border-t ${themeStyle.border}`}
          />
        </div>

        {/* In-Scene Object Silhouettes */}
        <div className="relative z-10 w-full h-full flex items-center justify-around pointer-events-none px-2 sm:px-8">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col items-center opacity-90 transition-transform duration-300 ${
                item.itemScale || 'scale-100'
              }`}
            >
              <div
                className={`${
                  items.length >= 4
                    ? 'w-16 sm:w-22 md:w-28 h-16 sm:h-22 md:h-28'
                    : 'w-20 sm:w-28 md:w-32 h-20 sm:h-28 md:h-32'
                } text-primary/85 drop-shadow-md`}
              >
                <ProductIllustration
                  name={item.illustration}
                  color={item.color || '#25435a'}
                  className="w-full h-full stroke-[1.4]"
                />
              </div>
              <div
                className={`${
                  items.length >= 4 ? 'w-10 sm:w-16' : 'w-14 sm:w-20'
                } h-2 bg-black/10 rounded-full blur-xs mt-1`}
              />
            </div>
          ))}
        </div>

        {/* Interactive Hotspot Pins & Glassmorphic Popovers */}
        {items.map((item) => {
          const isOpen = activeHotspot === item.id;
          const isAdded = addedItemId === item.id;

          return (
            <div
              key={`hotspot-${item.id}`}
              className="absolute z-40"
              style={{ top: item.top, left: item.left }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHotspot(isOpen ? null : item.id);
                }}
                className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer shadow-xl ${
                  isOpen
                    ? 'bg-primary text-white scale-110 ring-4 ring-white/60'
                    : 'bg-surface-lowest text-primary hover:bg-white'
                }`}
                aria-label={`Inspect ${item.name}`}
                title={`Inspect ${item.name}`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-current" />
                <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
              </button>

              {/* Popover Inspector */}
              {isOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className={`absolute w-[calc(100vw-3.5rem)] max-w-xs sm:w-80 bg-surface-lowest/98 backdrop-blur-md border border-on-surface/20 rounded-2xl shadow-2xl p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95 text-left ${
                    item.popoverAlign === 'left'
                      ? 'top-full mt-3 left-0 sm:left-0 sm:translate-x-0'
                      : item.popoverAlign === 'right'
                      ? 'top-full mt-3 right-0 sm:right-0 sm:left-auto sm:translate-x-0'
                      : 'bottom-full mb-3 left-1/2 -translate-x-1/2'
                  }`}
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-surface-low border border-outline-variant/30 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ProductIllustration
                            name={item.illustration}
                            color={item.color || '#25435a'}
                            className="w-8 h-8 stroke-[1.4]"
                          />
                        )}
                      </div>
                      <div>
                        {item.category && (
                          <span className="font-label-caps text-[9px] uppercase font-bold text-primary block">
                            {item.category}
                          </span>
                        )}
                        <h4 className="font-bold text-xs sm:text-sm text-on-surface leading-tight">
                          {item.name}
                        </h4>
                        {item.price !== undefined && (
                          <span className="font-bold text-xs text-primary font-mono mt-0.5 block">
                            ${item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveHotspot(null)}
                      className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-low transition-colors cursor-pointer"
                      aria-label="Close details"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Description & Artisan Note */}
                  <p className="text-[11px] text-on-surface-variant leading-relaxed mb-3 border-t border-outline-variant/20 pt-2.5">
                    {item.description}
                  </p>

                  {item.artisanNote && (
                    <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-surface-low border border-outline-variant/20 text-[10px] text-on-surface-variant flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-primary shrink-0" />
                      <span>{item.artisanNote}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {item.productId && (
                      <Link
                        href={`/product/${item.productId}`}
                        className="flex-1 py-2 bg-surface-low hover:bg-surface-high border border-outline-variant/30 text-on-surface rounded-xl text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Piece</span>
                      </Link>
                    )}

                    {onAddToCart && (
                      <button
                        type="button"
                        onClick={() => onAddToCart(item)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-subtle active:scale-95 ${
                          item.productId ? '' : 'w-full'
                        } ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
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
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Bag</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Companion Responsive Card Deck (Guarantees 100% Usability on Mobile & Tablet) */}
      {showCompanionDeck && (
        <div
          className={`mt-6 grid gap-4 ${
            items.length >= 4
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
          }`}
        >
          {items.map((item) => {
            const isAdded = addedItemId === item.id;

            return (
              <div
                key={`deck-${item.id}`}
                className="bg-surface-lowest border border-outline-variant/30 rounded-2xl p-4 flex items-center gap-3.5 shadow-subtle hover:border-outline hover:shadow-card transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-surface-low border border-outline-variant/30 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <ProductIllustration
                      name={item.illustration}
                      color={item.color || '#25435a'}
                      className="w-10 h-10 stroke-[1.4]"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {item.category && (
                    <span className="font-label-caps text-[9px] uppercase font-bold text-primary block truncate">
                      {item.category}
                    </span>
                  )}
                  <h4 className="font-bold text-xs sm:text-sm text-on-surface truncate">
                    {item.name}
                  </h4>
                  {item.price !== undefined && (
                    <span className="font-bold text-xs text-primary font-mono block">
                      ${item.price.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.productId && (
                    <Link
                      href={`/product/${item.productId}`}
                      className="p-2 rounded-xl bg-surface-low hover:bg-surface-high border border-outline-variant/30 text-on-surface transition-colors"
                      title="View Details"
                      aria-label={`View ${item.name}`}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  {onAddToCart && (
                    <button
                      type="button"
                      onClick={() => onAddToCart(item)}
                      className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer shadow-subtle active:scale-95 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-primary hover:bg-primary-container text-white'
                      }`}
                      title={isAdded ? 'Added to Bag' : 'Add to Bag'}
                      aria-label={`Add ${item.name} to bag`}
                    >
                      {isAdded ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
