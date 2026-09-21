'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductIllustration, isLightColor } from '@/components/ProductIllustrations';
import { ProductCard } from '@/components/ProductCard';
import { QuickViewModal } from '@/components/QuickViewModal';
import { VignetteCanvas, VignetteItem } from '@/components/VignetteCanvas';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useReviews } from '@/context/ReviewContext';
import { useAuth } from '@/context/AuthContext';
import { Product, ProductColor, ProductReview } from '@/types';
import {
  Heart,
  Star,
  ShoppingCart,
  ShoppingBag,
  Check,
  Truck,
  RotateCcw,
  ShieldCheck,
  Leaf,
  ArrowRight,
  Plus,
  Minus,
  ChevronRight,
  Sparkles,
  Info,
  X,
  Share2,
  CheckCircle2,
  MessageSquare,
  Package,
  AlertTriangle,
  ThumbsUp,
  Search,
  SlidersHorizontal,
  Filter
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const { products } = useProducts();
  const { addToCart, isInWishlist, toggleWishlist, setIsCartOpen, wishlist } = useCart();
  const { user } = useAuth();
  const {
    getProductReviews,
    getProductStats,
    addReview,
    markHelpful,
    hasVotedHelpful
  } = useReviews();

  const product = products.find((p) => p.id === productId);

  // Selected variants
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeViewMode, setActiveViewMode] = useState<'photo' | 'symbol'>('photo');

  // UI States
  const [isAdded, setIsAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'materials' | 'dimensions' | 'packaging' | 'returns'>('materials');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Real Reviews State
  const reviews = product ? getProductReviews(product.id) : [];
  const stats = product
    ? getProductStats(product.id)
    : { averageRating: 5.0, totalCount: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }, recommendPercentage: 100 };

  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  type ReviewSort = 'newest' | 'highest' | 'lowest' | 'helpful';
  const [reviewSort, setReviewSort] = useState<ReviewSort>('newest');

  // Form State
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [newName, setNewName] = useState(user?.name || '');
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [newLocation, setNewLocation] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [recommendProduct, setRecommendProduct] = useState(true);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [helpfulToast, setHelpfulToast] = useState<string | null>(null);

  // Related Products & Recommendations State
  type RelatedTab = 'curated' | 'bundle' | 'recent';
  const [activeRelatedTab, setActiveRelatedTab] = useState<RelatedTab>('curated');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const [isBundleAdded, setIsBundleAdded] = useState(false);

  // Automated Related Lookbook Engine State
  const [relatedLookbookIndex, setRelatedLookbookIndex] = useState(0);
  const [isRelatedLookbookHovered, setIsRelatedLookbookHovered] = useState(false);
  const [relatedLookbookAddedId, setRelatedLookbookAddedId] = useState<string | null>(null);
  const [isRelatedCapsuleAllAdded, setIsRelatedCapsuleAllAdded] = useState(false);
  const [relatedViewMode, setRelatedViewMode] = useState<'lookbook' | 'grid'>('lookbook');

  interface RelatedCapsule {
    id: string;
    title: string;
    eyebrow: string;
    description: string;
    studioTag: string;
    theme: 'warm-sand' | 'nordic-slate' | 'porto-terracotta' | 'sage-botanical';
    items: VignetteItem[];
    products: Product[];
  }

  // Generate dynamic 4-piece capsules based on user preference, archetype pairing, and color harmony
  const relatedCapsules: RelatedCapsule[] = useMemo(() => {
    if (!product) return [];

    const others = products.filter((p) => p.id !== product.id);

    // Coordinate slots for 4 products per capsule (balanced zigzag distribution)
    const slotCoords = [
      { top: '28%', left: '14%', popoverAlign: 'left' as const },
      { top: '54%', left: '38%', popoverAlign: 'center' as const },
      { top: '30%', left: '62%', popoverAlign: 'center' as const },
      { top: '52%', left: '86%', popoverAlign: 'right' as const },
    ];

    const toVignetteItem = (
      p: Product,
      idx: number,
      roleTag: string,
      overrideColor?: string
    ): VignetteItem => {
      const slot = slotCoords[idx] || slotCoords[0];
      return {
        id: `rel-${p.id}-${idx}`,
        productId: p.id,
        name: p.name,
        category: roleTag,
        price: p.price,
        illustration: p.illustration,
        color: overrideColor || p.colors?.[0]?.hex || '#25435a',
        imageUrl: p.imageUrl,
        top: slot.top,
        left: slot.left,
        popoverAlign: slot.popoverAlign,
        description: p.description,
        artisanNote: p.details?.[0] ? `Slow Craft · ${p.details[0]}` : 'Atelier Verified',
      };
    };

    // -------------------------------------------------------------
    // CAPSULE 1: "The Living Ensemble" (4 Archetypes)
    // Combines current piece with 3 cross-department companions
    // -------------------------------------------------------------
    let c1p1: Product | undefined;
    let c1p2: Product | undefined;
    let c1p3: Product | undefined;

    if (product.category === 'CLOTHING') {
      c1p1 = others.find((p) => p.illustration === 'backpack' || p.illustration === 'totebag') || others[0];
      c1p2 = others.find((p) => p.id !== c1p1?.id && (p.illustration === 'sneakers' || p.illustration === 'headphones')) || others[1];
      c1p3 = others.find((p) => p.id !== c1p1?.id && p.id !== c1p2?.id && (p.category === 'HOME GOODS' || p.illustration === 'vase' || p.illustration === 'lamp')) || others[2];
    } else if (product.category === 'ACCESSORIES') {
      c1p1 = others.find((p) => p.category === 'CLOTHING') || others[0];
      c1p2 = others.find((p) => p.id !== c1p1?.id && p.category === 'HOME GOODS') || others[1];
      c1p3 = others.find((p) => p.id !== c1p1?.id && p.id !== c1p2?.id && (p.illustration === 'sneakers' || p.illustration === 'backpack')) || others[2];
    } else {
      c1p1 = others.find((p) => p.category === 'CLOTHING') || others[0];
      c1p2 = others.find((p) => p.id !== c1p1?.id && p.category === 'ACCESSORIES') || others[1];
      c1p3 = others.find((p) => p.id !== c1p1?.id && p.id !== c1p2?.id && p.category === 'HOME GOODS') || others[2];
    }

    const c1Products = [product, c1p1, c1p2, c1p3].filter(Boolean) as Product[];
    const c1Items = c1Products.map((p, idx) =>
      toVignetteItem(
        p,
        idx,
        p.id === product.id ? `ACTIVE SILHOUETTE · ${p.category}` : `ENSEMBLE PAIRING · ${p.category}`,
        p.id === product.id ? (selectedColor?.hex || product.colors[0]?.hex) : undefined
      )
    );

    // -------------------------------------------------------------
    // CAPSULE 2: "Patron Affinity Suite" (4 Archetypes)
    // Dynamically tailored based on user preference, wishlist & recent views
    // -------------------------------------------------------------
    const affinityPool: Product[] = [];
    // Priority 1: User's saved wishlist pieces
    (wishlist || []).forEach((wid) => {
      if (wid !== product.id) {
        const found = products.find((p) => p.id === wid);
        if (found && !affinityPool.some((ap) => ap.id === found.id)) affinityPool.push(found);
      }
    });
    // Priority 2: User's recently viewed pieces
    recentlyViewedIds.forEach((rid) => {
      if (rid !== product.id) {
        const found = products.find((p) => p.id === rid);
        if (found && !affinityPool.some((ap) => ap.id === found.id)) affinityPool.push(found);
      }
    });
    // Priority 3: Backfill with top curated pieces from the catalog
    others.forEach((op) => {
      if (affinityPool.length < 4 && !affinityPool.some((ap) => ap.id === op.id)) {
        affinityPool.push(op);
      }
    });

    const c2Products = affinityPool.slice(0, 4);
    const c2Items = c2Products.map((p, idx) =>
      toVignetteItem(p, idx, `PATRON AFFINITY · ${p.category}`)
    );

    // -------------------------------------------------------------
    // CAPSULE 3: "Tonal Studio Palette" (4 Archetypes)
    // Chromatic harmony sharing materials, warm tones, and quiet dyes
    // -------------------------------------------------------------
    const activeHex = (selectedColor?.hex || product.colors[0]?.hex || '#25435a').toLowerCase();
    const tonalMatches = others.filter((p) =>
      p.colors.some((c) => c.hex.toLowerCase() === activeHex)
    );
    const c3Products = [
      product,
      ...tonalMatches,
      ...others.filter((p) => !tonalMatches.some((tm) => tm.id === p.id)),
    ].slice(0, 4);

    const c3Items = c3Products.map((p, idx) =>
      toVignetteItem(
        p,
        idx,
        p.id === product.id ? `ANCHOR PIECE · ${p.category}` : `TONAL HARMONY · ${p.category}`,
        p.id === product.id ? (selectedColor?.hex || product.colors[0]?.hex) : undefined
      )
    );

    return [
      {
        id: `capsule-ensemble-${product.id}`,
        title: 'The Living Ensemble',
        eyebrow: 'Architectural Harmony',
        description: `Experience ${product.name} paired with 3 complementary studio archetypes in a complete spatial setting.`,
        studioTag: `Atelier Spatial Harmony · ${product.category}`,
        theme: product.category === 'CLOTHING' ? 'nordic-slate' : product.category === 'ACCESSORIES' ? 'porto-terracotta' : 'warm-sand',
        items: c1Items,
        products: c1Products,
      },
      {
        id: `capsule-affinity-${product.id}`,
        title: 'Patron Affinity Suite',
        eyebrow: 'Personalized Curation',
        description: 'Auto-synthesized from your wishlist, browsing history, and aesthetic affinities across the atelier.',
        studioTag: 'Patron Studio Affinity · Kyoto Archive',
        theme: 'sage-botanical',
        items: c2Items,
        products: c2Products,
      },
      {
        id: `capsule-tonal-${product.id}`,
        title: 'Tonal Studio Palette',
        eyebrow: 'Chromatic Balance',
        description: `Pieces chosen to echo the quiet materiality, earthy glaze, and organic dyes of ${product.name}.`,
        studioTag: 'Natural Dye & Kaolin Harmony · 35°N',
        theme: 'warm-sand',
        items: c3Items,
        products: c3Products,
      },
    ];
  }, [product, products, selectedColor, wishlist, recentlyViewedIds]);

  // Auto-advance related lookbook capsules every 5.5s unless hovered
  useEffect(() => {
    if (isRelatedLookbookHovered || relatedCapsules.length <= 1) return;
    const timer = setInterval(() => {
      setRelatedLookbookIndex((prev) => (prev + 1) % relatedCapsules.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isRelatedLookbookHovered, relatedCapsules.length]);

  const handleAddRelatedVignetteItem = (item: VignetteItem) => {
    const targetProd = products.find((p) => p.id === item.productId || p.name === item.name);
    if (!targetProd) return;
    const color = targetProd.id === product?.id && selectedColor ? selectedColor : (targetProd.colors[0] || { name: 'Natural', hex: '#25435a' });
    const size = targetProd.id === product?.id && selectedSize ? selectedSize : (targetProd.sizes[0] || 'Standard');
    addToCart(targetProd, color, size, 1);
    setRelatedLookbookAddedId(item.id);
    setIsCartOpen(true);
    setTimeout(() => setRelatedLookbookAddedId(null), 2500);
  };

  const handleAddRelatedCapsuleAll = () => {
    const activeCapsule = relatedCapsules[relatedLookbookIndex] || relatedCapsules[0];
    if (!activeCapsule) return;
    activeCapsule.products.forEach((p) => {
      const color = p.id === product?.id && selectedColor ? selectedColor : (p.colors[0] || { name: 'Natural', hex: '#25435a' });
      const size = p.id === product?.id && selectedSize ? selectedSize : (p.sizes[0] || 'Standard');
      addToCart(p, color, size, 1);
    });
    setIsRelatedCapsuleAllAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setIsRelatedCapsuleAllAdded(false), 2800);
  };

  // Track and load recently viewed products in localStorage
  useEffect(() => {
    if (!product) return;
    try {
      const STORAGE_KEY = 'esondha_recently_viewed_v1';
      const stored = localStorage.getItem(STORAGE_KEY);
      let ids: string[] = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(ids)) ids = [];
      const updated = [product.id, ...ids.filter((id) => id !== product.id)].slice(0, 8);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setRecentlyViewedIds(updated.filter((id) => id !== product.id));
    } catch (e) {
      console.error(e);
    }
  }, [product?.id]);

  // Auto-fill reviewer if user logs in
  useEffect(() => {
    if (user && !newName) {
      setNewName(user.name || '');
      setNewEmail(user.email || '');
    }
  }, [user]);

  // Check if logged-in user is a verified buyer of this item
  const isVerifiedBuyer = !!user && user.orders.some((o) =>
    o.items.some((i) => i.id === product?.id || i.name === product?.name)
  );

  // Ref for intersection observer to trigger sticky buy bar
  const mainBuyBoxRef = useRef<HTMLDivElement>(null);

  // Sync default options when product loads
  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      setActiveViewMode(product.imageUrl ? 'photo' : 'symbol');
    }
  }, [product]);

  // Monitor scroll to display sticky Add-to-Cart bar
  useEffect(() => {
    const handleScroll = () => {
      if (!mainBuyBoxRef.current) return;
      const rect = mainBuyBoxRef.current.getBoundingClientRect();
      // Show sticky bar when main buy box scrolls past top of viewport
      setShowStickyBar(rect.bottom < 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-surface text-on-surface">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-6 py-24 text-center flex flex-col items-center justify-center">
          <h1 className="font-display-lg text-3xl font-bold text-on-surface mb-3">
            Archetype Not Found
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant max-w-md mb-8">
            The requested item may have been archived or retired from our active slow-living rotation.
          </p>
          <Link
            href="/shop"
            className="px-6 py-3 bg-primary text-white text-xs font-label-caps tracking-label-caps uppercase font-semibold rounded-lg hover:bg-primary-container transition-colors"
          >
            Explore Catalog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const activeColor = selectedColor || product.colors[0];
  const activeSize = selectedSize || product.sizes[0];

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product, activeColor, activeSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product.inStock) return;
    addToCart(product, activeColor, activeSize, quantity);
    router.push('/cart');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !newName.trim() || !newTitle.trim() || !newComment.trim()) return;

    addReview({
      productId: product.id,
      author: newName.trim(),
      userEmail: newEmail.trim() || (user ? user.email : undefined),
      location: newLocation.trim() || 'Atelier Patron',
      rating: newRating,
      title: newTitle.trim(),
      comment: newComment.trim(),
      verified: isVerifiedBuyer || !!user,
      recommendProduct,
    });

    setReviewSubmitted(true);
    setNewTitle('');
    setNewComment('');
    setTimeout(() => {
      setIsWritingReview(false);
      setReviewSubmitted(false);
    }, 2200);
  };

  const handleVoteHelpful = (reviewId: string) => {
    const success = markHelpful(reviewId);
    if (success) {
      setHelpfulToast('Thank you! Your feedback has been recorded.');
    } else {
      setHelpfulToast('You have already marked this review as helpful.');
    }
    setTimeout(() => setHelpfulToast(null), 2500);
  };

  // Related products & curated pairings computation
  const sameCategoryProducts = products.filter(
    (p) => p.id !== product.id && p.category === product.category
  );
  const otherCategoryProducts = products.filter(
    (p) => p.id !== product.id && p.category !== product.category
  );
  // Combined 4 curated items: same category first, backfilled with complementary archetypes
  const curatedRelatedProducts = [
    ...sameCategoryProducts,
    ...otherCategoryProducts,
  ].slice(0, 4);

  // Companion product for "Complete the Look" / "Frequently Paired Together"
  const bundleCompanion =
    products.find((p) => p.id !== product.id && p.category !== product.category && p.inStock) ||
    otherCategoryProducts[0] ||
    sameCategoryProducts[0];

  const bundleOriginalTotal = bundleCompanion ? product.price + bundleCompanion.price : product.price;
  const bundleDiscountPrice = bundleCompanion ? Number((bundleOriginalTotal * 0.9).toFixed(2)) : product.price;
  const bundleSavings = bundleCompanion ? Number((bundleOriginalTotal - bundleDiscountPrice).toFixed(2)) : 0;

  const handleAddBundleToCart = () => {
    if (!product.inStock || !bundleCompanion || !bundleCompanion.inStock) return;
    addToCart(product, activeColor, activeSize, 1);
    addToCart(bundleCompanion, bundleCompanion.colors[0], bundleCompanion.sizes[0], 1);
    setIsBundleAdded(true);
    setTimeout(() => setIsBundleAdded(false), 2200);
  };

  // Recently viewed products
  const recentlyViewedProducts = recentlyViewedIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined)
    .slice(0, 4);

  // Filtered & Sorted reviews
  const filteredReviews = reviews
    .filter((r) => {
      const matchesRating = selectedRatingFilter === null || r.rating === selectedRatingFilter;
      const q = reviewSearchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        r.title.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        (r.location && r.location.toLowerCase().includes(q));
      return matchesRating && matchesSearch;
    })
    .sort((a, b) => {
      if (reviewSort === 'highest') return b.rating - a.rating;
      if (reviewSort === 'lowest') return a.rating - b.rating;
      if (reviewSort === 'helpful') return (b.helpfulCount || 0) - (a.helpfulCount || 0);
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      {/* Main Canvas */}
      <main className="page-enter flex-1 w-full max-w-7xl mx-auto px-5 sm:px-6 md:px-margin py-6 sm:py-10">
        {/* Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-on-surface-variant font-medium">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-outline/50" />
          <Link href="/shop" className="hover:text-primary transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-outline/50" />
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors uppercase font-label-caps text-[11px]">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-outline/50" />
          <span className="text-on-surface truncate font-semibold">
            {product.name}
          </span>
        </nav>

        {/* Top Product Showcase Grid (2 columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Product Visuals & Multi-Angle Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Primary Visual Box */}
            <div className={`w-full rounded-2xl border p-8 sm:p-14 flex items-center justify-center relative shadow-subtle group overflow-hidden min-h-[380px] sm:min-h-[480px] transition-all duration-500 ${
              isLightColor(activeColor?.hex)
                ? 'bg-gradient-to-b from-[#eee8e2] via-[#e5dfd8] to-[#ded7cf] border-outline-variant/50'
                : 'bg-surface-lowest border-on-surface/15'
            }`}>
              {/* Subtle Color Aura matching selected variant */}
              <div
                className="absolute inset-0 transition-all duration-500 pointer-events-none"
                style={{
                  backgroundColor: isLightColor(activeColor?.hex) ? '#25435a' : (activeColor?.hex || '#476274'),
                  opacity: isLightColor(activeColor?.hex) ? 0.05 : 0.1,
                }}
              />

              {/* Ambient studio backdrop spotlight for light/white colorway */}
              {isLightColor(activeColor?.hex) && (
                <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-white/40 blur-2xl pointer-events-none transition-opacity duration-500" />
              )}

              {/* Badge Overlay */}
              {product.badge && (
                <div className="absolute top-5 left-5 z-10">
                  <span className="font-label-caps text-xs tracking-wider px-3 py-1 rounded-full font-bold uppercase bg-primary text-white shadow-subtle">
                    {product.badge.text}
                  </span>
                </div>
              )}

              {/* View Switcher Pill (if photo uploaded) */}
              {product.imageUrl && (
                <div className="absolute top-5 left-1/2 -translate-y-0 -translate-x-1/2 z-10 flex items-center bg-surface-lowest/90 backdrop-blur-md border border-outline-variant/60 p-1 rounded-full shadow-subtle">
                  <button
                    type="button"
                    onClick={() => setActiveViewMode('photo')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      activeViewMode === 'photo'
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Photograph
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveViewMode('symbol')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      activeViewMode === 'symbol'
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Vector Symbol
                  </button>
                </div>
              )}

              {/* Share & Wishlist quick buttons */}
              <div className="absolute top-5 right-5 z-10 flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-surface-low/80 hover:bg-surface-low border border-outline-variant/40 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  title="Copy link"
                  aria-label="Share product"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-olive" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2 rounded-full bg-surface-low/80 hover:bg-surface-low border border-outline-variant/40 transition-colors cursor-pointer ${
                    isFavorited ? 'text-terracotta' : 'text-on-surface-variant hover:text-terracotta'
                  }`}
                  title="Wishlist"
                  aria-label="Toggle wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Central Display: Real Photo OR Dynamic Color-Reactive Symbol */}
              <div className="relative z-0 transition-transform duration-500 group-hover:scale-105 flex items-center justify-center max-w-full">
                {activeViewMode === 'photo' && product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-h-[340px] sm:max-h-[420px] w-auto max-w-full object-contain drop-shadow-md rounded-lg"
                  />
                ) : (
                  <ProductIllustration
                    name={product.illustration}
                    color={activeColor?.hex}
                    className="w-48 h-48 sm:w-64 sm:h-64 stroke-[1.8] drop-shadow-sm transition-all duration-300"
                  />
                )}
              </div>

              {/* Eco Certification Tag */}
              <div className="absolute bottom-4 left-5 flex items-center gap-1.5 text-[11px] font-semibold text-olive bg-olive/10 px-2.5 py-1 rounded-full">
                <Leaf className="w-3.5 h-3.5" />
                <span>Certified Slow Production</span>
              </div>
            </div>

            {/* Micro Gallery Thumbnails */}
            <div className="grid grid-cols-3 gap-3">
              {product.imageUrl ? (
                <button
                  type="button"
                  onClick={() => setActiveViewMode('photo')}
                  className={`border-2 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    activeViewMode === 'photo'
                      ? 'border-primary bg-surface-lowest shadow-subtle'
                      : 'border-outline-variant/40 bg-surface-low hover:bg-surface-lowest'
                  }`}
                >
                  <img
                    src={product.imageUrl}
                    alt="Photograph thumbnail"
                    className="w-10 h-10 object-cover rounded mb-1"
                  />
                  <span className="text-[10px] font-semibold text-on-surface">Photograph</span>
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => setActiveViewMode('symbol')}
                className={`border-2 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  activeViewMode === 'symbol' || !product.imageUrl
                    ? 'border-primary shadow-subtle'
                    : 'border-outline-variant/40 hover:bg-surface-lowest'
                } ${isLightColor(activeColor?.hex) ? 'bg-[#eae5df]' : 'bg-surface-low'}`}
              >
                <ProductIllustration
                  name={product.illustration}
                  color={activeColor?.hex}
                  className="w-10 h-10 stroke-[1.8] mb-1 transition-colors duration-300"
                />
                <span className="text-[10px] font-semibold text-on-surface">
                  Symbol ({activeColor?.name})
                </span>
              </button>

              <div className="border border-outline-variant/40 bg-surface-low rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <div
                  className="w-6 h-6 rounded-full border border-outline/30 mb-1 shadow-sm transition-colors duration-300"
                  style={{ backgroundColor: activeColor?.hex }}
                />
                <span className="text-[10px] font-semibold text-on-surface-variant truncate max-w-full">
                  {activeColor?.name}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Buy Box & Product Attributes (5 cols) */}
          <div ref={mainBuyBoxRef} className="lg:col-span-5 flex flex-col gap-6">
            {/* Header Meta */}
            <div>
              <span className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary block mb-1">
                {product.category}
              </span>
              <h1 className="font-display-lg text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface tracking-tight">
                {product.name}
              </h1>

              {/* Rating & Verified Counter */}
              <div className="flex items-center gap-3 mt-2.5">
                <div className="flex items-center text-terracotta">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-outline/30'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-on-surface">
                  {stats.totalCount > 0 ? stats.averageRating.toFixed(1) : product.rating.toFixed(1)}
                </span>
                <a
                  href="#reviews-section"
                  className="text-xs text-on-surface-variant hover:text-primary hover:underline transition-colors"
                >
                  ({reviews.length} {reviews.length === 1 ? 'patron review' : 'patron reviews'})
                </a>
              </div>
            </div>

            {/* Price & Savings Pill */}
            <div className="flex items-baseline gap-3 pb-4 border-b border-outline-variant/25">
              <span className="font-headline-lg text-3xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-outline line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Editorial Description */}
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {product.description}
            </p>

            {/* Real-time Inventory Status */}
            <div className="flex items-center gap-2 text-xs">
              {product.inStock && (product.stockQuantity ?? 1) > 0 ? (
                (product.stockQuantity ?? 10) <= 5 ? (
                  <span className="flex items-center gap-1.5 text-amber-800 font-semibold bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    <span>Only {product.stockQuantity} remaining in atelier · Order soon</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-olive font-semibold bg-olive/10 border border-olive/20 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In Stock ({product.stockQuantity} units available) · Ships in 24h</span>
                  </span>
                )
              ) : (
                <span className="flex items-center gap-1.5 text-red-700 font-semibold bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                  <Info className="w-3.5 h-3.5" />
                  <span>Currently Sold Out / Awaiting Atelier Restock</span>
                </span>
              )}
            </div>

            {/* Color Swatch Picker */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-on-surface">Color Palette:</span>
                <span className="text-primary">{activeColor?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    title={color.name}
                    className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center ${
                      activeColor?.name === color.name
                        ? 'ring-2 ring-offset-2 ring-primary scale-110 border-white'
                        : 'border-outline-variant/60 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {activeColor?.name === color.name && (
                      <Check className={`w-3.5 h-3.5 ${color.hex === '#fcf9f8' || color.hex === '#ffffff' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector + Size Guide Trigger */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-on-surface">Size / Dimensions:</span>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Size &amp; Fit Guide</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase transition-all ${
                      activeSize === size
                        ? 'bg-primary text-white shadow-subtle'
                        : 'bg-surface-low text-on-surface-variant border border-outline-variant/40 hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Add to Bag CTAs */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="inline-flex items-center border border-outline-variant/60 rounded-lg bg-surface-lowest h-12">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-low transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-on-surface">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity ?? 99, quantity + 1))}
                    disabled={product.stockQuantity !== undefined && quantity >= product.stockQuantity}
                    className="w-10 h-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-low transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary Add to Bag */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || (product.stockQuantity ?? 1) <= 0}
                  className={`btn-interactive flex-1 h-12 px-6 font-label-caps text-xs tracking-label-caps font-semibold uppercase rounded-lg shadow-subtle flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 cursor-pointer ${
                    !product.inStock || (product.stockQuantity ?? 1) <= 0
                      ? 'bg-outline-variant/40 text-outline cursor-not-allowed'
                      : isAdded
                      ? 'bg-olive text-white'
                      : 'bg-primary hover:bg-primary-container text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>{product.inStock && (product.stockQuantity ?? 1) > 0 ? 'Add to Bag' : 'Sold Out'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instant Buy Now Button */}
              {product.inStock && (
                <button
                  onClick={handleBuyNow}
                  className="btn-interactive w-full h-11 bg-secondary-container hover:opacity-90 active:scale-[0.98] text-on-secondary-fixed font-label-caps text-xs tracking-label-caps font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Instant Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Atelier Perks Strip */}
            <div className="p-4 bg-surface-low rounded-xl border border-outline-variant/30 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-on-surface-variant">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-primary shrink-0" />
                <span>Free shipping over $100</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-primary shrink-0" />
                <span>30-Day gentle trial</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Leaf className="w-4 h-4 text-olive shrink-0" />
                <span>100% Plastic-free packaging</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span>2-Year atelier guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Craftsmanship & Ethics Accordions */}
        <section className="mt-16 pt-12 border-t border-outline-variant/30">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 border-b border-outline-variant/30 pb-4 mb-6">
            <button
              onClick={() => setActiveTab('materials')}
              className={`font-label-caps text-xs tracking-label-caps uppercase font-bold transition-colors pb-1 ${
                activeTab === 'materials'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              Craft &amp; Materials
            </button>
            <button
              onClick={() => setActiveTab('dimensions')}
              className={`font-label-caps text-xs tracking-label-caps uppercase font-bold transition-colors pb-1 ${
                activeTab === 'dimensions'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              Dimensions &amp; Care
            </button>
            <button
              onClick={() => setActiveTab('packaging')}
              className={`font-label-caps text-xs tracking-label-caps uppercase font-bold transition-colors pb-1 ${
                activeTab === 'packaging'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              Sustainable Packaging
            </button>
            <button
              onClick={() => setActiveTab('returns')}
              className={`font-label-caps text-xs tracking-label-caps uppercase font-bold transition-colors pb-1 ${
                activeTab === 'returns'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              Gentle Returns
            </button>
          </div>

          <div className="bg-surface-lowest border border-on-surface/10 rounded-2xl p-6 sm:p-8 shadow-subtle text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            {activeTab === 'materials' && (
              <div className="space-y-4">
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  Traceable Materials &amp; Ethical Artisanship
                </h3>
                <p>
                  Every piece in the E Sondha catalog is created in small batches with certified natural materials. We partner exclusively with family-owned mills in Portugal and master ceramicists in Shigaraki, Japan.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-olive shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'dimensions' && (
              <div className="space-y-4">
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  Sizing &amp; Longevity Care
                </h3>
                <p>
                  Designed with Japanese ease and architectural structure. For apparel, we recommend gentle machine wash at 30°C and line drying in the shade to preserve natural cotton fibers. Ceramics and stoneware are high-fired to withstand dishwasher cycles while retaining their tactile unglazed rim.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    View Measurement Dimensions Table →
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'packaging' && (
              <div className="space-y-4">
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  100% Zero-Plastic Unboxing Experience
                </h3>
                <p>
                  Our parcels arrive in post-consumer FSC-certified paperboard sealed with water-activated starch tape. All branding is applied with non-toxic algae ink. There is zero virgin plastic or petroleum bubble wrap in your order.
                </p>
              </div>
            )}

            {activeTab === 'returns' && (
              <div className="space-y-4">
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  30-Day Gentle In-Home Trial
                </h3>
                <p>
                  We believe you should experience quiet essentials in the rhythm of your home. If a piece doesn&apos;t bring quiet clarity to your everyday life, return it within 30 days in unwashed condition for a full refund or exchange.
                </p>
              </div>
            )}
          </div>
        </section>


        {/* Customer Reviews & Ratings Section */}
        <section id="reviews-section" className="mt-16 pt-12 border-t border-outline-variant/30 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary block mb-1">
                PATRON EXPERIENCES &amp; REPUTATION
              </span>
              <h2 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface">
                Customer Reviews
              </h2>
            </div>
            <button
              onClick={() => setIsWritingReview(!isWritingReview)}
              className="px-5 py-2.5 bg-primary text-white text-xs font-label-caps tracking-label-caps uppercase font-semibold rounded-lg hover:bg-primary-container transition-colors shrink-0 shadow-subtle cursor-pointer"
            >
              {isWritingReview ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {/* Interactive Review Form */}
          {isWritingReview && (
            <form
              onSubmit={handleAddReview}
              className="bg-surface-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-8 mb-8 shadow-card space-y-5 animate-in fade-in"
            >
              <div className="border-b border-outline-variant/20 pb-3">
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  Share Your Patron Experience
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Your feedback helps fellow connoisseurs discover mindful, slow-living craftsmanship.
                </p>
              </div>

              {reviewSubmitted ? (
                <div className="p-4 bg-olive/10 border border-olive/30 rounded-xl text-olive text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-olive shrink-0" />
                  <span>Thank you. Your patron review has been recorded and published to the catalog.</span>
                </div>
              ) : (
                <>
                  {/* Rating Selector with Hover & Labels */}
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-terracotta">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const activeLevel = hoverRating !== null ? hoverRating : newRating;
                          return (
                            <button
                              type="button"
                              key={star}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(null)}
                              onClick={() => setNewRating(star)}
                              className="p-1 hover:scale-110 transition-transform cursor-pointer"
                              title={`${star} Star${star > 1 ? 's' : ''}`}
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= activeLevel ? 'fill-current' : 'text-outline/30'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-xs font-semibold text-primary">
                        {(hoverRating !== null ? hoverRating : newRating) === 5 && '5 Stars · Exceptional Craftsmanship'}
                        {(hoverRating !== null ? hoverRating : newRating) === 4 && '4 Stars · Very Good Quality'}
                        {(hoverRating !== null ? hoverRating : newRating) === 3 && '3 Stars · Fair / Everyday'}
                        {(hoverRating !== null ? hoverRating : newRating) === 2 && '2 Stars · Needs Improvement'}
                        {(hoverRating !== null ? hoverRating : newRating) === 1 && '1 Star · Unsatisfactory'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-on-surface mb-1">Your Name</label>
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g. Aria Vance"
                        required
                        className="w-full px-3 py-2 bg-surface-low border border-outline-variant/50 rounded-lg outline-none focus:border-primary text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-on-surface mb-1">Location (City, Country)</label>
                      <input
                        type="text"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        placeholder="e.g. Portland, OR"
                        className="w-full px-3 py-2 bg-surface-low border border-outline-variant/50 rounded-lg outline-none focus:border-primary text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-on-surface mb-1">Email (Optional)</label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="e.g. aria@example.com"
                        className="w-full px-3 py-2 bg-surface-low border border-outline-variant/50 rounded-lg outline-none focus:border-primary text-xs"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block font-semibold text-on-surface mb-1">Headline</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Enduring quality and quiet elegance"
                      required
                      className="w-full px-3 py-2 bg-surface-low border border-outline-variant/50 rounded-lg outline-none focus:border-primary text-xs"
                    />
                  </div>

                  <div className="text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-semibold text-on-surface">Your Review</label>
                      <span className="text-[11px] text-outline">{newComment.length} characters</span>
                    </div>
                    <textarea
                      rows={4}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Describe the texture, weight, fit, drape, and how it feels in your daily rhythm..."
                      required
                      className="w-full px-3 py-2 bg-surface-low border border-outline-variant/50 rounded-lg outline-none focus:border-primary text-xs"
                    />
                  </div>

                  {/* Recommendation Checkbox */}
                  <label className="flex items-center gap-2 text-xs text-on-surface cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={recommendProduct}
                      onChange={(e) => setRecommendProduct(e.target.checked)}
                      className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                    />
                    <span className="font-medium">I recommend this archetype to fellow patrons</span>
                  </label>

                  {isVerifiedBuyer && (
                    <div className="p-3 bg-olive/10 border border-olive/30 rounded-lg text-olive text-[11px] font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Buyer clearance confirmed from your atelier account history.</span>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsWritingReview(false)}
                      className="px-4 py-2 border border-outline-variant/50 rounded-lg text-xs text-on-surface-variant hover:bg-surface-low transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary hover:bg-primary-container text-white text-xs font-label-caps tracking-label-caps uppercase font-semibold rounded-lg transition-colors shadow-subtle cursor-pointer"
                    >
                      Publish Review
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          {/* Rating Summary Card with Distribution Bars */}
          <div className="bg-surface-low border border-outline-variant/30 rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center md:border-r md:border-outline-variant/30 md:pr-8">
              <span className="font-display-lg text-5xl font-bold text-primary">
                {stats.totalCount > 0 ? stats.averageRating.toFixed(1) : product.rating.toFixed(1)}
              </span>
              <div className="flex items-center text-terracotta my-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(stats.totalCount > 0 ? stats.averageRating : product.rating)
                        ? 'fill-current'
                        : 'text-outline/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-on-surface-variant font-medium">
                Based on {reviews.length} authentic patron {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
              <span className="text-[11px] text-olive font-semibold mt-1">
                {stats.recommendPercentage}% would recommend this item
              </span>
            </div>

            <div className="md:col-span-8 flex flex-col justify-center gap-2 text-xs">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = stats.distribution[stars as 1 | 2 | 3 | 4 | 5] || 0;
                const percentage = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                const isSelected = selectedRatingFilter === stars;

                return (
                  <button
                    key={stars}
                    onClick={() => setSelectedRatingFilter(isSelected ? null : stars)}
                    className={`flex items-center gap-3 group text-left w-full p-1 rounded-lg transition-colors cursor-pointer ${
                      isSelected ? 'bg-primary/10 font-bold' : 'hover:bg-surface-high/50'
                    }`}
                    title={`Filter by ${stars} Stars`}
                  >
                    <span className="w-14 text-on-surface font-semibold shrink-0">
                      {stars} Stars
                    </span>
                    <div className="flex-1 bg-surface-high h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isSelected ? 'bg-primary' : 'bg-primary/80 group-hover:bg-primary'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-outline shrink-0 font-mono">
                      {count} ({percentage}%)
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Toast */}
          {helpfulToast && (
            <div className="mb-4 p-3 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded-xl flex items-center justify-between animate-in fade-in">
              <span>{helpfulToast}</span>
              <button
                type="button"
                onClick={() => setHelpfulToast(null)}
                className="text-primary hover:underline text-[11px]"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Reviews Action Bar: Search, Star Filter Pills, and Sorting */}
          <div className="bg-surface-lowest border border-outline-variant/30 rounded-xl p-3.5 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 md:max-w-xs">
              <Search className="w-3.5 h-3.5 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={reviewSearchQuery}
                onChange={(e) => setReviewSearchQuery(e.target.value)}
                placeholder="Search reviews (e.g. sizing, linen, drape)..."
                className="w-full bg-surface-low border border-outline-variant/40 rounded-lg pl-8 pr-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            {/* Filter Pills & Sorting */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setSelectedRatingFilter(null)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    selectedRatingFilter === null
                      ? 'bg-primary text-white'
                      : 'bg-surface-low hover:bg-surface-high text-on-surface-variant'
                  }`}
                >
                  All ({reviews.length})
                </button>
                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRatingFilter(selectedRatingFilter === star ? null : star)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                      selectedRatingFilter === star
                        ? 'bg-primary text-white'
                        : 'bg-surface-low hover:bg-surface-high text-on-surface-variant'
                    }`}
                  >
                    {star}★
                  </button>
                ))}
              </div>

              {/* Sort Selector */}
              <select
                value={reviewSort}
                onChange={(e) => setReviewSort(e.target.value as ReviewSort)}
                className="bg-surface-low border border-outline-variant/40 rounded-lg px-2.5 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="newest">Most Recent</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="bg-surface-lowest border border-outline-variant/30 rounded-xl p-10 text-center text-on-surface-variant">
                <MessageSquare className="w-8 h-8 text-outline/40 mx-auto mb-2" />
                <h4 className="font-semibold text-sm text-on-surface">No reviews found</h4>
                <p className="text-xs text-outline mt-1">
                  {selectedRatingFilter !== null || reviewSearchQuery
                    ? 'No patron reviews match the current filter or search criteria.'
                    : 'Be the first patron to share your impressions of this essential archetype.'}
                </p>
                {(selectedRatingFilter !== null || reviewSearchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRatingFilter(null);
                      setReviewSearchQuery('');
                    }}
                    className="mt-3 text-xs text-primary hover:underline font-semibold"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              filteredReviews.map((review) => {
                const voted = hasVotedHelpful(review.id);

                return (
                  <div
                    key={review.id}
                    className="bg-surface-lowest border border-outline-variant/30 rounded-xl p-6 shadow-subtle space-y-3 transition-shadow hover:shadow-card"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-terracotta">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-outline/30'}`}
                            />
                          ))}
                        </div>
                        <span className="font-headline-md text-sm font-bold text-on-surface">
                          {review.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-outline font-mono">{review.date}</span>
                    </div>

                    <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      &ldquo;{review.comment}&rdquo;
                    </p>

                    {/* Patron Meta & Recommendation */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-outline-variant/20 text-xs">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-outline">
                        <span className="font-semibold text-on-surface">{review.author}</span>
                        {review.location && <span>· {review.location}</span>}
                        {review.verified && (
                          <span className="text-olive font-semibold flex items-center gap-1 bg-olive/10 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Verified Patron
                          </span>
                        )}
                        {review.recommendProduct !== false && (
                          <span className="text-primary font-medium flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" /> Recommends this item
                          </span>
                        )}
                      </div>

                      {/* Helpful Vote Button */}
                      <button
                        type="button"
                        onClick={() => handleVoteHelpful(review.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          voted
                            ? 'bg-primary/15 text-primary border border-primary/30'
                            : 'bg-surface-low hover:bg-surface-high text-on-surface-variant border border-outline-variant/40'
                        }`}
                        title={voted ? 'You marked this as helpful' : 'Mark this review as helpful'}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${voted ? 'fill-current' : ''}`} />
                        <span>Helpful ({review.helpfulCount || 0})</span>
                      </button>
                    </div>

                    {/* Atelier Curator Response */}
                    {review.adminReply && (
                      <div className="mt-3 p-3.5 bg-surface-low border-l-2 border-primary rounded-r-xl text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-primary">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{review.adminReply.author}</span>
                          </span>
                          <span className="text-outline font-normal font-mono">{review.adminReply.date}</span>
                        </div>
                        <p className="text-on-surface-variant leading-relaxed text-[11px]">
                          &ldquo;{review.adminReply.text}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ============================================================ */}
        {/* AUTOMATED RELATED LOOKBOOK CAPSULES (ZERO ADMIN OVERHEAD)    */}
        {/* ============================================================ */}
        {relatedCapsules.length > 0 && (
          <section className="mt-16 pt-12 border-t border-outline-variant/30">
            {/* Section Header with Mode Toggle */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <span className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary block mb-1">
                  AUTONOMOUS ATELIER CURATION · SLOW-LIVING LOOKBOOK
                </span>
                <h2 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface">
                  Harmonious Pairings &amp; Capsules
                </h2>
              </div>

              {/* View Switcher & Capsule Indicator */}
              <div className="flex items-center gap-3">
                <div className="inline-flex p-1 rounded-2xl bg-surface-low border border-outline-variant/30 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setRelatedViewMode('lookbook')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-label-caps uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                      relatedViewMode === 'lookbook'
                        ? 'bg-primary text-white shadow-subtle'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Spatial Lookbook
                  </button>
                  <button
                    type="button"
                    onClick={() => setRelatedViewMode('grid')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-label-caps uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                      relatedViewMode === 'grid'
                        ? 'bg-primary text-white shadow-subtle'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Catalog Grid
                  </button>
                </div>

                <Link
                  href="/shop"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 ml-2"
                >
                  <span>Full Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {relatedViewMode === 'lookbook' ? (
              (() => {
                const currentCapsule = relatedCapsules[relatedLookbookIndex] || relatedCapsules[0];
                return (
                  <div
                    key={`${currentCapsule.id}-${relatedLookbookIndex}`}
                    className="capsule-enter-animate overflow-hidden shadow-card rounded-3xl"
                  >
                    <VignetteCanvas
                      title={currentCapsule.title}
                      eyebrow={currentCapsule.eyebrow}
                      description={currentCapsule.description}
                      studioTag={currentCapsule.studioTag}
                      theme={currentCapsule.theme}
                      items={currentCapsule.items}
                      onAddToCart={handleAddRelatedVignetteItem}
                      addedItemId={relatedLookbookAddedId}
                      onAddAll={handleAddRelatedCapsuleAll}
                      addAllLabel={`Add ${currentCapsule.items.length}-Piece Capsule to Bag`}
                      isAllAdded={isRelatedCapsuleAllAdded}
                      activeCapsuleIndex={relatedLookbookIndex}
                      totalCapsules={relatedCapsules.length}
                      onNextCapsule={() =>
                        setRelatedLookbookIndex((prev) => (prev + 1) % relatedCapsules.length)
                      }
                      onPrevCapsule={() =>
                        setRelatedLookbookIndex(
                          (prev) => (prev - 1 + relatedCapsules.length) % relatedCapsules.length
                        )
                      }
                      onSelectCapsule={(idx) => setRelatedLookbookIndex(idx)}
                      isPaused={isRelatedLookbookHovered}
                      onHoverChange={setIsRelatedLookbookHovered}
                      heightClass="h-[380px] sm:h-[440px] md:h-[480px]"
                      showCompanionDeck={true}
                    />
                  </div>
                );
              })()
            ) : (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {curatedRelatedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Sticky Bottom Add-to-Cart Bar for High Conversion */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 bg-surface-lowest/95 backdrop-blur-md border-t border-outline-variant/30 shadow-2xl py-3 px-5 z-40 sticky-bar-slide-up">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded-lg border border-outline-variant/30 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-surface-low border border-outline-variant/30 flex items-center justify-center p-1 shrink-0">
                  <ProductIllustration
                    name={product.illustration}
                    color={activeColor?.hex}
                    className="w-7 h-7 stroke-[1.6]"
                  />
                </div>
              )}
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-on-surface truncate">
                  {product.name}
                </h4>
                <p className="text-[11px] text-on-surface-variant truncate">
                  ${product.price.toFixed(2)} · {activeColor?.name} · {activeSize}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || (product.stockQuantity ?? 1) <= 0}
                className={`btn-interactive px-6 py-2.5 font-label-caps text-xs tracking-label-caps font-semibold uppercase rounded-lg shadow-subtle flex items-center gap-2 active:scale-[0.98] transition-all cursor-pointer ${
                  !product.inStock || (product.stockQuantity ?? 1) <= 0
                    ? 'bg-outline-variant/40 text-outline cursor-not-allowed'
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
                    <span>{product.inStock && (product.stockQuantity ?? 1) > 0 ? 'Add to Bag' : 'Sold Out'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Size & Fit Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm drawer-backdrop drawer-backdrop-open cursor-pointer"
            onClick={() => setSizeGuideOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-surface-lowest rounded-2xl border border-outline-variant/30 shadow-2xl p-6 sm:p-8 z-10 overflow-hidden modal-dialog-panel modal-dialog-panel-open">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20 mb-4">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="font-display-lg text-lg font-bold text-on-surface">
                  Size &amp; Fit Guidelines
                </h3>
              </div>
              <button
                onClick={() => setSizeGuideOpen(false)}
                className="p-1 text-outline hover:text-on-surface rounded-full transition-colors"
                aria-label="Close size guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
              Our silhouettes are conceived with a relaxed architectural drape. If you prefer a tailored fit, we recommend selecting one size down.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-on-surface font-semibold bg-surface-low">
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Chest / Width</th>
                    <th className="p-2.5">Length</th>
                    <th className="p-2.5">Sleeve / Reach</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 text-on-surface-variant">
                  <tr>
                    <td className="p-2.5 font-bold text-on-surface">XS</td>
                    <td className="p-2.5">50 cm / 19.7&quot;</td>
                    <td className="p-2.5">68 cm / 26.8&quot;</td>
                    <td className="p-2.5">42 cm / 16.5&quot;</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-on-surface">S</td>
                    <td className="p-2.5">53 cm / 20.9&quot;</td>
                    <td className="p-2.5">70 cm / 27.6&quot;</td>
                    <td className="p-2.5">44 cm / 17.3&quot;</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-on-surface">M</td>
                    <td className="p-2.5">56 cm / 22.0&quot;</td>
                    <td className="p-2.5">72 cm / 28.3&quot;</td>
                    <td className="p-2.5">46 cm / 18.1&quot;</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-on-surface">L</td>
                    <td className="p-2.5">59 cm / 23.2&quot;</td>
                    <td className="p-2.5">74 cm / 29.1&quot;</td>
                    <td className="p-2.5">48 cm / 18.9&quot;</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-on-surface">XL</td>
                    <td className="p-2.5">63 cm / 24.8&quot;</td>
                    <td className="p-2.5">77 cm / 30.3&quot;</td>
                    <td className="p-2.5">50 cm / 19.7&quot;</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t border-outline-variant/20 text-center">
              <button
                onClick={() => setSizeGuideOpen(false)}
                className="px-6 py-2 bg-primary text-white text-xs font-label-caps uppercase rounded-lg font-semibold"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal for Related Products */}
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
