'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { QuickViewModal } from '@/components/QuickViewModal';
import { VignetteCanvas, VignetteItem } from '@/components/VignetteCanvas';
import { useProducts, DEFAULT_LOOKBOOK_CAPSULES } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Product, CategoryType } from '@/types';
import {
  ArrowRight,
  ShoppingBag,
  Leaf,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Quote,
  Star,
  Eye,
  Plus,
  Compass,
  Check,
  Tag,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import { ProductIllustration } from '@/components/ProductIllustrations';

export default function HomePage() {
  const { products, storeSettings, subscribeNewsletter } = useProducts();
  const { addToCart, setIsCartOpen, items: cartItems, wishlist } = useCart();
  const { user } = useAuth();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Tab filtering for home merchandising
  type MerchTab = 'all' | 'bestsellers' | 'new' | 'organic';
  const [activeMerchTab, setActiveMerchTab] = useState<MerchTab>('all');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      subscribeNewsletter(newsletterEmail.trim(), 'Homepage Journal');
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  // Filtered products for tabbed showcase
  const filteredProducts = products.filter((p) => {
    if (activeMerchTab === 'bestsellers') return p.badge?.variant === 'bestseller' || p.rating >= 4.8;
    if (activeMerchTab === 'new') return p.badge?.variant === 'new' || p.category === 'ACCESSORIES';
    if (activeMerchTab === 'organic') return p.badge?.variant === 'organic' || p.category === 'CLOTHING';
    return true;
  }).slice(0, 6);

  // Recently Viewed & Curator's Choice Carousel State
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const [activeCuratorIndex, setActiveCuratorIndex] = useState(0);
  const [isCuratorHovered, setIsCuratorHovered] = useState(false);
  const [curatorKey, setCuratorKey] = useState(0);

  // Load recently viewed products from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('esondha_recently_viewed_v1');
      if (stored) {
        setRecentlyViewedIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Compute 3 Curator's Choice items (Dynamic Patron Affinity or Admin Manual Choice)
  const { curatorItems, isAffinityMatched } = useMemo(() => {
    // 1. Check if admin configured manual mode with 3 items
    if (
      storeSettings.curatorChoiceMode === 'manual' &&
      storeSettings.curatorChoiceProductIds &&
      storeSettings.curatorChoiceProductIds.length >= 3
    ) {
      const manualChosen = storeSettings.curatorChoiceProductIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p));

      if (manualChosen.length === 3) {
        return { curatorItems: manualChosen, isAffinityMatched: false };
      }
    }

    // 2. Dynamic Patron Affinity Analysis
    const categoryScores: Record<string, number> = {
      CLOTHING: 0,
      'HOME GOODS': 0,
      ACCESSORIES: 0,
    };

    let affinityDetected = false;

    // A. Recently viewed products (Weight: 4)
    recentlyViewedIds.forEach((id) => {
      const p = products.find((prod) => prod.id === id);
      if (p && p.category) {
        categoryScores[p.category] = (categoryScores[p.category] || 0) + 4;
        affinityDetected = true;
      }
    });

    // B. Wishlisted products (Weight: 3)
    wishlist.forEach((id) => {
      const p = products.find((prod) => prod.id === id);
      if (p && p.category) {
        categoryScores[p.category] = (categoryScores[p.category] || 0) + 3;
        affinityDetected = true;
      }
    });

    // C. Current Cart items (Weight: 2)
    cartItems.forEach((item) => {
      const p = products.find((prod) => prod.id === item.productId);
      if (p && p.category) {
        categoryScores[p.category] = (categoryScores[p.category] || 0) + 2;
        affinityDetected = true;
      }
    });

    // D. Patron Past Orders (Weight: 2)
    if (user?.orders) {
      user.orders.forEach((ord) => {
        ord.items.forEach((item) => {
          const p = products.find((prod) => prod.id === item.productId);
          if (p && p.category) {
            categoryScores[p.category] = (categoryScores[p.category] || 0) + 2;
            affinityDetected = true;
          }
        });
      });
    }

    // Check if explicit Curator's Choice products are configured
    if (storeSettings.curatorChoiceProductIds && storeSettings.curatorChoiceProductIds.length > 0) {
      const explicitCurators = storeSettings.curatorChoiceProductIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => !!p);
      if (explicitCurators.length > 0) {
        return {
          curatorItems: explicitCurators,
          isAffinityMatched: affinityDetected,
        };
      }
    }

    // Sort departments by patron interest score
    const allCategories: CategoryType[] = ['CLOTHING', 'HOME GOODS', 'ACCESSORIES'];
    const sortedCategories: CategoryType[] = [...allCategories].sort(
      (a: CategoryType, b: CategoryType) => (categoryScores[b] || 0) - (categoryScores[a] || 0)
    );

    const chosen: Product[] = [];

    // Pick the most relevant item for each sorted department
    sortedCategories.forEach((cat) => {
      // 1. Most recent viewed or wishlisted in department
      const userFav = products.find(
        (p) => p.category === cat && (wishlist.includes(p.id) || recentlyViewedIds.includes(p.id)) && !chosen.some((c) => c.id === p.id)
      );
      if (userFav) {
        chosen.push(userFav);
        return;
      }

      // 2. High rated or bestseller
      const starProd = products.find(
        (p) => p.category === cat && (p.badge?.variant === 'bestseller' || p.rating >= 4.8) && !chosen.some((c) => c.id === p.id)
      );
      if (starProd) {
        chosen.push(starProd);
        return;
      }

      // 3. Any fallback in department
      const fallbackInCat = products.find((p) => p.category === cat && !chosen.some((c) => c.id === p.id));
      if (fallbackInCat) {
        chosen.push(fallbackInCat);
      }
    });

    // Ensure 3 fallback studio archetypes if any slot was empty
    const studioDefaults = [
      storeSettings.curatorChoiceProductId || 'prod-1',
      'prod-8',
      'prod-4',
    ];
    for (const defId of studioDefaults) {
      if (chosen.length >= 3) break;
      const defProd = products.find((p) => p.id === defId);
      if (defProd && !chosen.some((c) => c.id === defProd.id)) {
        chosen.push(defProd);
      }
    }

    // Fallback if still under 3
    for (const p of products) {
      if (chosen.length >= 3) break;
      if (!chosen.some((c) => c.id === p.id)) {
        chosen.push(p);
      }
    }

    return {
      curatorItems: chosen.slice(0, 3),
      isAffinityMatched: affinityDetected,
    };
  }, [products, storeSettings, recentlyViewedIds, wishlist, cartItems, user]);

  // Auto-advance through Curator's Choice items with dynamic admin interval (paused on hover)
  const curatorTransitionDelay = Math.max(
    1000,
    Math.round((storeSettings.curatorChoiceTransitionInterval || 4.5) * 1000)
  );

  useEffect(() => {
    if (isCuratorHovered || curatorItems.length <= 1) return;

    const timer = setInterval(() => {
      setActiveCuratorIndex((prev) => (prev + 1) % curatorItems.length);
      setCuratorKey((prev) => prev + 1);
    }, curatorTransitionDelay);

    return () => clearInterval(timer);
  }, [isCuratorHovered, curatorItems.length, curatorTransitionDelay]);

  const handleSelectCurator = (index: number) => {
    setActiveCuratorIndex(index);
    setCuratorKey((k) => k + 1);
  };

  const handleNextCurator = () => {
    setActiveCuratorIndex((prev) => (prev + 1) % curatorItems.length);
    setCuratorKey((k) => k + 1);
  };

  const handlePrevCurator = () => {
    setActiveCuratorIndex((prev) => (prev - 1 + curatorItems.length) % curatorItems.length);
    setCuratorKey((k) => k + 1);
  };

  const currentCurator = curatorItems[activeCuratorIndex] || curatorItems[0] || products[0];
  const heroSpotlight = currentCurator;

  // Living Lookbook Capsules state & auto-transition
  const [activeHomeCapsuleIndex, setActiveHomeCapsuleIndex] = useState(0);
  const [isHomeCapsulePaused, setIsHomeCapsulePaused] = useState(false);
  const [addedHomeVignetteId, setAddedHomeVignetteId] = useState<string | null>(null);
  const [isHomeCapsuleAllAdded, setIsHomeCapsuleAllAdded] = useState(false);

  const activeHomeCapsules = useMemo(() => {
    const raw =
      storeSettings.lookbookCapsules && storeSettings.lookbookCapsules.length > 0
        ? storeSettings.lookbookCapsules
        : DEFAULT_LOOKBOOK_CAPSULES;
    return raw.filter((c) => c.enabled !== false && c.showOnHome !== false);
  }, [storeSettings.lookbookCapsules]);

  // Auto-cycle through capsules with dynamic configurable interval (pauses on hover)
  const homeTransitionDelay = Math.max(800, Math.round((storeSettings.lookbookTransitionInterval || 2.0) * 1000));

  useEffect(() => {
    if (isHomeCapsulePaused || activeHomeCapsules.length <= 1) return;
    const timer = setInterval(() => {
      setActiveHomeCapsuleIndex((prev) => (prev + 1) % activeHomeCapsules.length);
    }, homeTransitionDelay);
    return () => clearInterval(timer);
  }, [isHomeCapsulePaused, activeHomeCapsules.length, homeTransitionDelay]);

  const currentHomeCapsule =
    activeHomeCapsules[activeHomeCapsuleIndex % Math.max(1, activeHomeCapsules.length)] || activeHomeCapsules[0];

  const currentHomeVignetteItems: VignetteItem[] = useMemo(() => {
    if (!currentHomeCapsule) return [];
    const slots = [
      { top: '28%', left: '18%', align: 'left' as const },
      { top: '52%', left: '50%', align: 'center' as const },
      { top: '32%', left: '82%', align: 'right' as const },
    ];
    return (currentHomeCapsule.productIds || []).map((pid, idx) => {
      const prod = products.find((p) => p.id === pid) || products[idx] || products[0];
      const slot = slots[idx] || slots[0];
      return {
        id: `v-home-${currentHomeCapsule.id}-${prod?.id || idx}-${idx}`,
        productId: prod?.id,
        name: prod?.name || 'Artisan Archetype',
        category: prod?.category || 'OBJECT',
        price: prod?.price || 29.99,
        illustration: (prod?.illustration as any) || 'vase',
        color: prod?.colors?.[0]?.hex || '#25435a',
        imageUrl: prod?.imageUrl,
        top: slot.top,
        left: slot.left,
        popoverAlign: slot.align,
        description: prod?.description || 'Crafted with tactile authenticity and quiet geometry.',
        badgeText: prod?.badge?.text,
        artisanNote: prod?.details?.[0] || 'Handcrafted slow living design',
      };
    });
  }, [currentHomeCapsule, products]);

  const handleAddHomeVignetteItem = (item: VignetteItem) => {
    const prod = products.find((p) => p.id === item.productId || p.name === item.name);
    if (!prod) return;
    const color = prod.colors?.[0] || { name: 'Natural', hex: '#25435a' };
    const size = prod.sizes?.[0] || 'Standard';
    addToCart(prod, color, size, 1);
    setAddedHomeVignetteId(item.id);
    setIsCartOpen(true);
    setTimeout(() => setAddedHomeVignetteId(null), 2500);
  };

  const handleAddEntireHomeCapsule = () => {
    currentHomeVignetteItems.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId || p.name === item.name);
      if (prod) {
        const color = prod.colors?.[0] || { name: 'Natural', hex: '#25435a' };
        const size = prod.sizes?.[0] || 'Standard';
        addToCart(prod, color, size, 1);
      }
    });
    setIsHomeCapsuleAllAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setIsHomeCapsuleAllAdded(false), 2800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      <main className="page-enter flex-1 w-full overflow-x-hidden">
        {/* ============================================================ */}
        {/* 1. EDITORIAL FULL-WIDTH HERO SECTION                         */}
        {/* ============================================================ */}
        <section className="relative w-full bg-gradient-to-b from-surface via-surface-low to-surface pt-8 sm:pt-14 pb-16 sm:pb-20 border-b border-outline-variant/20 px-5 sm:px-8 md:px-margin">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Seasonal Curation Pill */}
              <div className="inline-flex items-center gap-2 bg-secondary-container/50 border border-secondary-container px-3.5 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary">
                  {storeSettings.heroSubheadline || 'Autumn / Winter 2026 Atelier Collection'}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-display-lg text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-on-surface leading-[1.08]">
                Everyday Objects Tuned to Quiet Clarity.
              </h1>

              {/* Description */}
              <p className="font-body-lg text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Mindfully crafted slow-living archetypes made from 100% GOTS organic cotton,
                Normandy flax linen, and wheel-thrown stoneware. Designed to bring stillness to daily rituals.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2.5 bg-primary hover:bg-primary-container text-white font-label-caps text-xs tracking-label-caps font-semibold px-6 py-3.5 rounded-xl shadow-card transition-all duration-200 uppercase hover:translate-y-[-1px]"
                >
                  <span>EXPLORE FULL CATALOG</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 bg-surface-lowest hover:bg-surface border border-on-surface/20 text-on-surface font-label-caps text-xs tracking-label-caps font-semibold px-6 py-3.5 rounded-xl transition-colors uppercase shadow-xs"
                >
                  <span>OUR ATELIER ETHOS</span>
                </Link>
              </div>

              {/* Value proposition badges */}
              <div className="pt-6 border-t border-outline-variant/30 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="flex items-center gap-2 text-on-surface-variant font-medium">
                  <span className="w-2 h-2 rounded-full bg-olive shrink-0" />
                  <span>GOTS Organic</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span>Carbon-Neutral</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant font-medium">
                  <span className="w-2 h-2 rounded-full bg-terracotta shrink-0" />
                  <span>Zero-Plastic Kraft</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant font-medium">
                  <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                  <span>30-Day Quiet Trial</span>
                </div>
              </div>
            </div>

            {/* Right Visual Spotlight Column (5 cols) - Header-Free Minimalist Curator Showcase */}
            <div
              className="lg:col-span-5 relative"
              onMouseEnter={() => setIsCuratorHovered(true)}
              onMouseLeave={() => setIsCuratorHovered(false)}
            >
              <div className="relative rounded-3xl border border-on-surface/15 bg-surface-lowest shadow-card p-5 sm:p-7 overflow-hidden">
                <div key={curatorKey} className="triangle-card-animate space-y-5">
                  {/* 1. Pure Showcase Frame with Hardware-Accelerated Artwork Display */}
                  <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-gradient-to-b from-[#f7f4f2] to-[#ede7e1] overflow-hidden border border-outline-variant/30 shadow-inner group">
                    {/* Subtle Curator Tag (Top-Left) */}
                    <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 bg-surface-lowest/90 backdrop-blur-md border border-on-surface/10 rounded-full px-3 py-1 shadow-2xs">
                      <span className="text-[8px] text-primary">▲</span>
                      <span className="font-label-caps text-[10px] tracking-widest uppercase font-bold text-primary">
                        Curator’s Choice
                      </span>
                      <span className="text-outline/40 text-[10px]">·</span>
                      <span className="text-[10px] font-medium text-on-surface-variant">
                        {currentCurator.category}
                      </span>
                    </div>

                    {/* Left & Right Subtle Floating Arrow Controls */}
                    <button
                      type="button"
                      onClick={handlePrevCurator}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-surface-lowest/85 backdrop-blur-md border border-on-surface/10 text-on-surface flex items-center justify-center hover:bg-surface-lowest hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer opacity-70 hover:opacity-100"
                      title="Previous archetype"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={handleNextCurator}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-surface-lowest/85 backdrop-blur-md border border-on-surface/10 text-on-surface flex items-center justify-center hover:bg-surface-lowest hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer opacity-70 hover:opacity-100"
                      title="Next archetype"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Floating Price Pill (Bottom-Right) */}
                    <div className="absolute bottom-3.5 right-3.5 z-20 bg-surface-lowest/95 backdrop-blur-md border border-on-surface/10 rounded-xl px-3.5 py-1.5 shadow-subtle">
                      <span className="font-headline-md text-sm font-bold text-primary">
                        ${currentCurator.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Bottom Center: Minimal Triangular Pagination Indicator */}
                    <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-surface-lowest/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-on-surface/10 shadow-2xs">
                      {curatorItems.map((_, idx) => {
                        const isActive = idx === activeCuratorIndex;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectCurator(idx)}
                            className={`transition-all duration-300 flex items-center justify-center cursor-pointer ${
                              isActive
                                ? 'text-primary scale-125'
                                : 'text-outline/35 hover:text-outline scale-90'
                            }`}
                            title={`Archetype 0${idx + 1}`}
                            aria-label={`Archetype 0${idx + 1}`}
                          >
                            <span className="text-[10px] leading-none">▲</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Centered Archetype Artwork */}
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      {currentCurator.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={currentCurator.imageUrl}
                          alt={currentCurator.name}
                          className="w-full h-full object-cover rounded-xl shadow-subtle hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-40 h-40 flex items-center justify-center text-primary hover:scale-105 transition-transform duration-300">
                          <ProductIllustration
                            name={currentCurator.illustration}
                            color={currentCurator.colors?.[0]?.hex}
                            className="w-32 h-32 stroke-[1.3]"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. Product Details & Cohesive Dual Actions */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-headline-lg text-lg sm:text-xl font-bold text-on-surface">
                          {currentCurator.name}
                        </h3>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{currentCurator.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed line-clamp-1">
                        {currentCurator.details?.[0] || currentCurator.description}
                      </p>
                    </div>

                    {/* Clean Dual Actions: Explore Piece & Add to Bag */}
                    <div className="flex items-center gap-3 pt-1">
                      <Link
                        href={`/product/${currentCurator.id}`}
                        className="btn-interactive flex-1 py-3 bg-primary hover:bg-primary-container active:scale-[0.98] text-white rounded-xl text-xs font-label-caps tracking-label-caps uppercase font-semibold text-center transition-all shadow-subtle flex items-center justify-center gap-2"
                      >
                        <span>Explore Piece</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          if (!currentCurator) return;
                          addToCart(
                            currentCurator,
                            currentCurator.colors?.[0] || { name: 'Standard', hex: '#25435a' },
                            currentCurator.sizes?.[0] || 'Standard',
                            1
                          );
                          setIsCartOpen(true);
                        }}
                        className="btn-interactive py-3 px-4 bg-surface-low hover:bg-surface-high active:scale-[0.98] border border-outline-variant/40 text-on-surface text-xs font-label-caps tracking-label-caps uppercase font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                        title="Add to Bag"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. LIVING SPATIAL LOOKBOOK CAPSULES ("COMPLETE THE SPACE")   */}
        {/* ============================================================ */}
        {storeSettings.showLookbookOnHome !== false && activeHomeCapsules.length > 0 && currentHomeCapsule && (
          <section className="py-8 sm:py-12 px-5 sm:px-8 md:px-margin max-w-7xl mx-auto border-b border-outline-variant/20">
            {/* Modular Vignette Canvas with architectural triangular transition & in-canvas floating HUD */}
            <div className="relative rounded-3xl overflow-hidden shadow-card">
              <div key={`${currentHomeCapsule.id}-${activeHomeCapsuleIndex}`} className="capsule-enter-animate">
                <VignetteCanvas
                  title={currentHomeCapsule.title}
                  eyebrow={currentHomeCapsule.eyebrow}
                  description={currentHomeCapsule.description}
                  studioTag={currentHomeCapsule.studioTag}
                  theme={currentHomeCapsule.theme}
                  items={currentHomeVignetteItems}
                  onAddToCart={handleAddHomeVignetteItem}
                  addedItemId={addedHomeVignetteId}
                  onAddAll={handleAddEntireHomeCapsule}
                  addAllLabel="Add 3-Piece Capsule"
                  isAllAdded={isHomeCapsuleAllAdded}
                  heightClass="h-[360px] sm:h-[420px] md:h-[460px]"
                  activeCapsuleIndex={activeHomeCapsuleIndex}
                  totalCapsules={activeHomeCapsules.length}
                  onNextCapsule={() => setActiveHomeCapsuleIndex((prev) => (prev + 1) % activeHomeCapsules.length)}
                  onPrevCapsule={() => setActiveHomeCapsuleIndex((prev) => (prev - 1 + activeHomeCapsules.length) % activeHomeCapsules.length)}
                  onSelectCapsule={(idx) => setActiveHomeCapsuleIndex(idx)}
                  isPaused={isHomeCapsulePaused}
                  onHoverChange={setIsHomeCapsulePaused}
                />
              </div>
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* 3. THREE PHOTOGRAPHIC CATEGORY DEPARTMENT CARDS              */}
        {/* ============================================================ */}
        <section className="py-16 sm:py-20 px-5 sm:px-8 md:px-margin max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-outline-variant/30 gap-3">
            <div>
              <span className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary block mb-1">
                Atelier Departments
              </span>
              <h2 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                Curated by Space &amp; Ritual
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5 font-label-caps uppercase tracking-wider"
            >
              <span>View All 9 Essentials</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Dept 1: Clothing */}
            <Link
              href="/shop?category=CLOTHING"
              className="group relative rounded-2xl overflow-hidden border border-outline-variant/30 bg-surface-low p-6 sm:p-8 flex flex-col justify-between hover:shadow-card hover:-translate-y-1 transition-all duration-300 min-h-[300px]"
            >
              <div>
                <span className="font-label-caps text-[10px] tracking-label-caps uppercase font-bold text-primary bg-white/80 px-2.5 py-1 rounded-full shadow-xs">
                  Clothing &amp; Knitwear
                </span>
                <h3 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface mt-4 mb-2 group-hover:text-primary transition-colors">
                  Organic Cotton &amp; Linens
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Heavyweight 260 GSM organic jerseys, selvedge weaves, and stone-washed flax crafted for perpetual rotation.
                </p>
              </div>

              <div className="pt-8 flex items-center justify-between text-xs font-semibold text-primary font-label-caps uppercase tracking-wider">
                <span>Explore Clothing (2)</span>
                <div className="w-8 h-8 rounded-full bg-white border border-outline-variant/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-xs">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>

            {/* Dept 2: Home Goods */}
            <Link
              href="/shop?category=HOME+GOODS"
              className="group relative rounded-2xl overflow-hidden border border-outline-variant/30 bg-surface-low p-6 sm:p-8 flex flex-col justify-between hover:shadow-card hover:-translate-y-1 transition-all duration-300 min-h-[300px]"
            >
              <div>
                <span className="font-label-caps text-[10px] tracking-label-caps uppercase font-bold text-olive bg-white/80 px-2.5 py-1 rounded-full shadow-xs">
                  Home &amp; Domestic Living
                </span>
                <h3 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface mt-4 mb-2 group-hover:text-primary transition-colors">
                  Ceramics &amp; Illumination
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Wheel-thrown coarse clay stoneware, sculptural planters, and focused architectural task illumination.
                </p>
              </div>

              <div className="pt-8 flex items-center justify-between text-xs font-semibold text-primary font-label-caps uppercase tracking-wider">
                <span>Explore Home Goods (4)</span>
                <div className="w-8 h-8 rounded-full bg-white border border-outline-variant/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-xs">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>

            {/* Dept 3: Accessories */}
            <Link
              href="/shop?category=ACCESSORIES"
              className="group relative rounded-2xl overflow-hidden border border-outline-variant/30 bg-surface-low p-6 sm:p-8 flex flex-col justify-between hover:shadow-card hover:-translate-y-1 transition-all duration-300 min-h-[300px]"
            >
              <div>
                <span className="font-label-caps text-[10px] tracking-label-caps uppercase font-bold text-terracotta bg-white/80 px-2.5 py-1 rounded-full shadow-xs">
                  Carry &amp; Acoustic
                </span>
                <h3 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface mt-4 mb-2 group-hover:text-primary transition-colors">
                  Travel Packs &amp; Sound
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Recycled weatherproof 600D Cordura, European linen tote carryalls, and beryllium studio monitors.
                </p>
              </div>

              <div className="pt-8 flex items-center justify-between text-xs font-semibold text-primary font-label-caps uppercase tracking-wider">
                <span>Explore Accessories (3)</span>
                <div className="w-8 h-8 rounded-full bg-white border border-outline-variant/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-xs">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. CURATED MERCHANDISING TABS & 6-PRODUCT SHOWCASE           */}
        {/* ============================================================ */}
        <section className="py-12 bg-surface-low/60 border-y border-outline-variant/20 px-5 sm:px-8 md:px-margin">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary block mb-1">
                  Selected Archetypes
                </span>
                <h2 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                  Perpetual Studio Essentials
                </h2>
              </div>

              {/* Tab Pills */}
              <div className="flex items-center gap-1.5 p-1 bg-surface-lowest border border-outline-variant/30 rounded-xl overflow-x-auto no-scrollbar">
                {[
                  { id: 'all' as MerchTab, label: 'All Essentials' },
                  { id: 'bestsellers' as MerchTab, label: 'Bestsellers' },
                  { id: 'new' as MerchTab, label: 'Seasonal Drops' },
                  { id: 'organic' as MerchTab, label: 'Organic Textures' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveMerchTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeMerchTab === tab.id
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-low'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of 6 interactive Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode="grid"
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>

            <div className="text-center pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-lowest hover:bg-surface border border-outline-variant/50 text-on-surface font-label-caps text-xs tracking-label-caps uppercase font-semibold transition-colors shadow-subtle"
              >
                <span>View Complete Collection ({products.length} Items)</span>
                <ArrowRight className="w-3.5 h-3.5 text-primary" />
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. CRAFTSMANSHIP & PROVENANCE STORYTELLING                   */}
        {/* ============================================================ */}
        <section className="py-16 sm:py-20 bg-surface-lowest border-y border-outline-variant/25 px-5 sm:px-8 md:px-margin">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Quote & Manifesto (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <span className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary block">
                Material Provenance
              </span>
              <h2 className="font-display-lg text-3xl sm:text-4xl font-bold text-on-surface tracking-tight leading-tight">
                Designed to Outlast the Ephemeral.
              </h2>
              <blockquote className="font-headline-md text-base sm:text-lg text-on-surface-variant italic font-normal leading-relaxed pl-4 border-l-2 border-primary/40">
                &ldquo;True luxury is quiet. It is found in materials that age with dignity,
                textures that calm the senses, and everyday silhouettes built without obsolescence.&rdquo;
              </blockquote>
              <div className="text-xs text-outline space-y-1">
                <span className="font-bold text-on-surface block uppercase tracking-wider font-label-caps">
                  The E Sondha Studio Manifesto
                </span>
                <p>Portland · Copenhagen · Kyoto</p>
              </div>
            </div>

            {/* Right 4 Material Cards (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-5 sm:p-6 rounded-2xl bg-surface-low border border-outline-variant/30 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-olive/15 text-olive flex items-center justify-center font-bold mb-3">
                  <Leaf className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-on-surface">
                  100% GOTS Organic Cotton
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Rain-fed organic crops grown without synthetic pesticides or defoliants, woven into dense 260 GSM jersey knit in Portugal.
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-surface-low border border-outline-variant/30 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold mb-3">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-on-surface">
                  Wheel-Thrown Coarse Clay
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  High-fired stoneware fired at 1280°C with unglazed tactile bases and lead-free natural mineral glazes for domestic longevity.
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-surface-low border border-outline-variant/30 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-terracotta/15 text-terracotta flex items-center justify-center font-bold mb-3">
                  <Tag className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-on-surface">
                  Normandy Flax Linen
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Stone-washed European flax fibers that naturally soften and drape more elegantly with every wash cycle across decades.
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-surface-low border border-outline-variant/30 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-secondary-container text-on-secondary-fixed flex items-center justify-center font-bold mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-on-surface">
                  Zero-Plastic Packaging
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Every atelier order is protected in recycled kraft, algae-ink wrapping, and compostable cellulose tape with 100% carbon-offset shipping.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6. VERIFIED PATRON TESTIMONIALS & PRESS PRAISE               */}
        {/* ============================================================ */}
        <section className="py-16 sm:py-20 px-5 sm:px-8 md:px-margin max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary">
              Patron Experiences
            </span>
            <h2 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Praised for Restraint &amp; Quality
            </h2>
            <div className="flex items-center justify-center gap-1 text-amber-500 pt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              <span className="text-xs font-bold text-on-surface ml-2">4.9 / 5.0 Global Rating</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 sm:p-7 rounded-2xl bg-surface-low border border-outline-variant/30 flex flex-col justify-between space-y-4 shadow-subtle">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-on-surface leading-relaxed italic">
                  &ldquo;The classic t-shirt has the most satisfying weight and collar structure of any garment I own. It feels architectural yet effortless.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-on-surface block">Eleanor K.</span>
                  <span className="text-[11px] text-outline">Stockholm, Sweden</span>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  Verified Buyer
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-surface-low border border-outline-variant/30 flex flex-col justify-between space-y-4 shadow-subtle">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-on-surface leading-relaxed italic">
                  &ldquo;The stoneware mug has transformed my morning espresso ritual. Substantial, tactile, and weighted with absolute balance.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-on-surface block">Marcus T.</span>
                  <span className="text-[11px] text-outline">Kyoto, Japan</span>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  Verified Buyer
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-surface-low border border-outline-variant/30 flex flex-col justify-between space-y-4 shadow-subtle">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-on-surface leading-relaxed italic">
                  &ldquo;The unboxing experience was breathtaking. Zero plastic, beautiful algae-printed paper, and clothes that smell like fresh cedar.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-on-surface block">Sarah L.</span>
                  <span className="text-[11px] text-outline">Portland, Oregon</span>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  Verified Buyer
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 7. ATELIER JOURNAL / STORIES PREVIEW                         */}
        {/* ============================================================ */}
        <section className="py-14 bg-surface-low/50 border-t border-outline-variant/20 px-5 sm:px-8 md:px-margin">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary block mb-1">
                  Atelier Dispatch
                </span>
                <h2 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                  Notes on Slow Living
                </h2>
              </div>
              <Link
                href="/about"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5 font-label-caps uppercase"
              >
                <span>Read Full Journal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-surface-lowest rounded-2xl border border-outline-variant/30 p-6 space-y-3 hover:shadow-subtle transition-shadow">
                <span className="text-[10px] uppercase tracking-wider font-bold text-outline">
                  Architecture &amp; Spaces
                </span>
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  The Quiet Architecture of Kyoto Machiya
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  How 200-year-old wooden townhouses inspire modern domestic serenity and purposeful spatial flow.
                </p>
                <Link
                  href="/about"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 pt-1"
                >
                  <span>Read Dispatch</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="bg-surface-lowest rounded-2xl border border-outline-variant/30 p-6 space-y-3 hover:shadow-subtle transition-shadow">
                <span className="text-[10px] uppercase tracking-wider font-bold text-outline">
                  Textile Care
                </span>
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  Caring for Raw Flax Linen Over Decades
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Our studio guidelines to laundering, cold-water spinning, and sun-drying heirloom plant weaves.
                </p>
                <Link
                  href="/about"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 pt-1"
                >
                  <span>Read Dispatch</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="bg-surface-lowest rounded-2xl border border-outline-variant/30 p-6 space-y-3 hover:shadow-subtle transition-shadow">
                <span className="text-[10px] uppercase tracking-wider font-bold text-outline">
                  Philosophy
                </span>
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  Wabi-Sabi and Everyday Domestic Rituals
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Embracing subtle natural imperfections, unglazed coarse textures, and intentional whitespace.
                </p>
                <Link
                  href="/about"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 pt-1"
                >
                  <span>Read Dispatch</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 8. ELEVATED STUDIO CLUB & NEWSLETTER SUBSCRIPTION            */}
        {/* ============================================================ */}
        <section className="py-16 sm:py-20 px-5 sm:px-8 md:px-margin max-w-4xl mx-auto text-center">
          <div className="bg-surface-low border border-outline-variant/30 rounded-3xl p-8 sm:p-12 space-y-5 shadow-subtle">
            <span className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary">
              The E Sondha Gazette
            </span>
            <h3 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Join the Slow Living Fellowship
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
              Receive private notifications for new seasonal studio batch releases, craft provenance notes, and invitations to intimate atelier events.
            </p>

            {newsletterSubscribed ? (
              <div className="inline-flex items-center gap-2 text-olive font-semibold text-xs sm:text-sm py-3 px-6 bg-olive/10 rounded-xl border border-olive/20">
                <CheckCircle2 className="w-4 h-4" />
                <span>Welcome to our quiet living circle. Check your inbox for our introductory journal.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-surface-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-xs text-on-surface focus:outline-none focus:border-primary shadow-xs"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary hover:bg-primary-container text-white font-label-caps text-xs tracking-label-caps font-semibold uppercase rounded-xl transition-colors shadow-subtle cursor-pointer shrink-0"
                >
                  Join Circle
                </button>
              </form>
            )}

            <p className="text-[11px] text-outline">
              No advertising or frequent emails. Unsubscribe with one click anytime.
            </p>
          </div>
        </section>
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      <Footer />
    </div>
  );
}
