'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Menu,
  X,
  Search,
  SlidersHorizontal,
  User,
  Package,
  HelpCircle,
  Heart,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Leaf,
  LogOut,
  ExternalLink,
  Tag,
  Settings
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useFilters } from '@/context/FilterContext';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { CategoryType } from '@/types';
import { ProductIllustration } from './ProductIllustrations';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, setIsCartOpen, wishlist } = useCart();
  const { searchQuery, setSearchQuery, setIsMobileFilterOpen, activeFilterCount, setSelectedCategory } = useFilters();
  const { user, isAuthenticated, logout } = useAuth();
  const { products, storeSettings } = useProducts();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopExpanded, setMobileShopExpanded] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isShopMegaMenuOpen, setIsShopMegaMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const shopMenuRef = useRef<HTMLDivElement>(null);

  // Cart & Wishlist Counter Micro-Bounce Bump State
  const [cartBadgeBump, setCartBadgeBump] = useState(false);
  const [wishlistBadgeBump, setWishlistBadgeBump] = useState(false);
  const prevTotalItems = useRef(totalItems);
  const prevWishlistLen = useRef(wishlist.length);

  useEffect(() => {
    if (totalItems !== prevTotalItems.current && totalItems > 0) {
      setCartBadgeBump(true);
      const timer = setTimeout(() => setCartBadgeBump(false), 280);
      prevTotalItems.current = totalItems;
      return () => clearTimeout(timer);
    }
    prevTotalItems.current = totalItems;
  }, [totalItems]);

  useEffect(() => {
    if (wishlist.length !== prevWishlistLen.current && wishlist.length > 0) {
      setWishlistBadgeBump(true);
      const timer = setTimeout(() => setWishlistBadgeBump(false), 280);
      prevWishlistLen.current = wishlist.length;
      return () => clearTimeout(timer);
    }
    prevWishlistLen.current = wishlist.length;
  }, [wishlist.length]);

  const lastScrollY = useRef(0);
  const megaMenuTimeout = useRef<NodeJS.Timeout | null>(null);

  // Rotating Announcements dynamically connected to Admin storeSettings
  const announcements = [
    {
      text: storeSettings?.announcementText || 'Complimentary Carbon-Neutral Worldwide Shipping on Orders Over $100',
      icon: Truck,
    },
    {
      text: `Complimentary Carbon-Neutral Courier Delivery over $${storeSettings?.freeShippingThreshold || 100}`,
      icon: ShieldCheck,
    },
    {
      text: 'Mindfully Crafted with 100% GOTS Organic Cotton & Raw Flax Linen',
      icon: Leaf,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  // Auto-hide navbar on scroll down, reveal on scroll up or top
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show navbar near the top
      if (currentScrollY <= 20) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Keep navbar visible if menus are open
      if (mobileMenuOpen || searchOpen || isShopMegaMenuOpen || isAccountDropdownOpen) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      const delta = currentScrollY - lastScrollY.current;
      if (Math.abs(delta) < 8) return;

      if (delta > 0 && currentScrollY > 50) {
        // Scrolling DOWN -> Hide navbar
        setIsVisible(false);
      } else if (delta < 0) {
        // Scrolling UP -> Reveal navbar
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen, searchOpen, isShopMegaMenuOpen, isAccountDropdownOpen]);

  // Reset visibility and menus when route changes
  useEffect(() => {
    setIsVisible(true);
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setIsShopMegaMenuOpen(false);
    setIsAccountDropdownOpen(false);
    lastScrollY.current = 0;
  }, [pathname]);

  const isHome = pathname === '/';
  const isShop = pathname === '/shop';
  const isAbout = pathname === '/about';
  const isContact = pathname === '/contact';
  const isCart = pathname === '/cart';
  const isAdmin = pathname === '/admin';
  const isLogin = pathname === '/login';
  const isAccount = pathname === '/account';
  const isFaq = pathname === '/faq';
  const isTrack = pathname === '/track-order';

  // Live search matches
  const searchResults = searchQuery.trim().length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const spotlightProduct = products[0] || null;

  // Handle mega-menu hover delay
  const handleMegaMenuEnter = () => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setIsShopMegaMenuOpen(true);
  };

  const handleMegaMenuLeave = () => {
    megaMenuTimeout.current = setTimeout(() => {
      setIsShopMegaMenuOpen(false);
    }, 200);
  };

  // Close desktop shop mega-menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shopMenuRef.current && !shopMenuRef.current.contains(event.target as Node)) {
        setIsShopMegaMenuOpen(false);
      }
    };

    if (isShopMegaMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShopMegaMenuOpen]);

  return (
    <header
      className={`bg-primary/95 backdrop-blur-md text-on-primary border-b border-white/10 sticky top-0 z-40 shadow-sm transition-transform duration-300 ease-in-out will-change-transform ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* 1. TOP STUDIO ANNOUNCEMENT & UTILITY MARQUEE */}
      <div className="bg-surface-high/10 text-tertiary-fixed text-[11px] border-b border-white/10 px-4 sm:px-6 md:px-margin py-1.5 flex items-center justify-between">
        {/* Left rotating announcement */}
        <div className="flex items-center gap-2 overflow-hidden">
          {(() => {
            const CurrentIcon = announcements[announcementIndex].icon;
            return (
              <div className="flex items-center gap-2 animate-in fade-in duration-500 truncate">
                <CurrentIcon className="w-3.5 h-3.5 text-secondary-container shrink-0" />
                <span className="truncate font-medium text-white/90">
                  {announcements[announcementIndex].text}
                </span>
              </div>
            );
          })()}
        </div>

        {/* Right utility navigation */}
        <div className="hidden md:flex items-center gap-4 text-[10px] uppercase tracking-wider font-semibold text-tertiary-fixed/80 shrink-0">
          <Link href="/track-order" prefetch={true} className="hover:text-white transition-colors">
            Track Order
          </Link>
          <span className="text-white/20">·</span>
          <Link href="/faq" prefetch={true} className="hover:text-white transition-colors">
            Atelier FAQ
          </Link>
          <span className="text-white/20">·</span>
          <Link href="/contact" prefetch={true} className="hover:text-white transition-colors">
            Contact
          </Link>
          <span className="text-white/20">·</span>
          <span className="text-white font-mono bg-white/10 px-2 py-0.5 rounded text-[9px]">
            USD ($)
          </span>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="flex justify-between items-center w-full px-5 py-3.5 md:px-margin max-w-full">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            prefetch={true}
            className="group flex items-center gap-2.5 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-display-lg font-bold text-white shadow-xs group-hover:bg-white/20 transition-colors">
              ES
            </div>
            <div>
              <span className="font-display-lg text-xl md:text-2xl font-bold tracking-tight text-white block leading-tight">
                E Sondha
              </span>
              <span className="hidden sm:block text-[9px] font-label-caps tracking-label-caps uppercase text-tertiary-fixed/70 leading-none">
                Slow-Living Atelier
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link
            href="/"
            prefetch={true}
            className={`font-label-caps text-xs tracking-label-caps font-semibold uppercase transition-all duration-150 ${
              isHome
                ? 'text-white border-b-2 border-white pb-0.5'
                : 'text-tertiary-fixed/80 hover:text-white hover:opacity-100'
            }`}
          >
            HOME
          </Link>

          {/* SHOP WITH MEGA-MENU DROPDOWN */}
          <div
            ref={shopMenuRef}
            className="relative flex items-center"
            onMouseEnter={handleMegaMenuEnter}
            onMouseLeave={handleMegaMenuLeave}
          >
            <Link
              href="/shop"
              prefetch={true}
              onClick={() => {
                setSelectedCategory('ALL');
                setIsShopMegaMenuOpen(false);
              }}
              className={`font-label-caps text-xs tracking-label-caps font-semibold uppercase transition-all duration-150 flex items-center ${
                isShop
                  ? 'text-white border-b-2 border-white pb-0.5'
                  : 'text-tertiary-fixed/80 hover:text-white hover:opacity-100'
              }`}
            >
              SHOP
            </Link>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsShopMegaMenuOpen((prev) => !prev);
              }}
              className="p-1 -ml-0.5 text-tertiary-fixed/70 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle Shop Category Menu"
              aria-expanded={isShopMegaMenuOpen}
            >
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isShopMegaMenuOpen ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>

            {/* Floating Mega-Menu Panel */}
            {isShopMegaMenuOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[620px] z-50 menu-dropdown menu-dropdown-open">
                <div className="bg-surface-lowest rounded-2xl shadow-2xl border border-on-surface/15 p-6 text-on-surface grid grid-cols-12 gap-6">
                  {/* Column 1: Departments (5 cols) */}
                  <div className="col-span-5 space-y-3">
                    <span className="font-label-caps text-[10px] tracking-label-caps uppercase font-bold text-outline block">
                      Browse Departments
                    </span>
                    <div className="space-y-1">
                      {[
                        { name: 'All Essentials', category: 'ALL' as CategoryType, href: '/shop', desc: 'Complete 60+ archetype catalog' },
                        { name: 'Organic Clothing', category: 'CLOTHING' as CategoryType, href: '/shop?category=CLOTHING', desc: 'GOTS cotton jerseys & knitwear' },
                        { name: 'Ceramics & Living', category: 'HOME GOODS' as CategoryType, href: '/shop?category=HOME+GOODS', desc: 'Tactile coarse clay stoneware' },
                        { name: 'Accessories & Carry', category: 'ACCESSORIES' as CategoryType, href: '/shop?category=ACCESSORIES', desc: 'Raw flax totes & cordura packs' },
                      ].map((dept) => (
                        <Link
                          key={dept.name}
                          href={dept.href}
                          onClick={() => {
                            setSelectedCategory(dept.category);
                            setIsShopMegaMenuOpen(false);
                          }}
                          className="block p-2 rounded-xl hover:bg-surface-low transition-colors group cursor-pointer"
                        >
                          <span className="font-semibold text-xs text-on-surface group-hover:text-primary transition-colors block">
                            {dept.name}
                          </span>
                          <span className="text-[11px] text-on-surface-variant block">
                            {dept.desc}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Curated Edits (3 cols) */}
                  <div className="col-span-3 space-y-3 border-l border-outline-variant/20 pl-4">
                    <span className="font-label-caps text-[10px] tracking-label-caps uppercase font-bold text-outline block">
                      Curated Edits
                    </span>
                    <div className="space-y-2 text-xs">
                      <Link
                        href="/shop"
                        onClick={() => {
                          setSelectedCategory('ALL');
                          setIsShopMegaMenuOpen(false);
                        }}
                        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-medium cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span>Bestsellers</span>
                      </Link>
                      <Link
                        href="/shop"
                        onClick={() => {
                          setSelectedCategory('ALL');
                          setIsShopMegaMenuOpen(false);
                        }}
                        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-medium cursor-pointer"
                      >
                        <Leaf className="w-3.5 h-3.5 text-olive" />
                        <span>Organic Picks</span>
                      </Link>
                      <Link
                        href="/shop"
                        onClick={() => {
                          setSelectedCategory('ALL');
                          setIsShopMegaMenuOpen(false);
                        }}
                        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-medium cursor-pointer"
                      >
                        <Tag className="w-3.5 h-3.5 text-terracotta" />
                        <span>Seasonal Sale</span>
                      </Link>
                      <Link
                        href="/about"
                        onClick={() => setIsShopMegaMenuOpen(false)}
                        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-medium pt-2 border-t border-outline-variant/20 cursor-pointer"
                      >
                        <span>Atelier Story</span>
                        <ArrowRight className="w-3 h-3 text-outline" />
                      </Link>
                    </div>
                  </div>

                  {/* Column 3: Featured Spotlight Card (4 cols) */}
                  {spotlightProduct && (
                    <div className="col-span-4 bg-surface-low rounded-xl p-3.5 border border-outline-variant/30 flex flex-col justify-between">
                      <div>
                        <span className="font-label-caps text-[9px] uppercase tracking-wider font-bold text-primary bg-secondary-container/40 px-2 py-0.5 rounded-full inline-block mb-2">
                          Spotlight Archetype
                        </span>
                        <div className="w-full h-24 rounded-lg bg-surface flex items-center justify-center overflow-hidden mb-2 border border-outline-variant/20">
                          {spotlightProduct.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={spotlightProduct.imageUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ProductIllustration
                              name={spotlightProduct.illustration}
                              color={spotlightProduct.colors[0]?.hex}
                              className="w-14 h-14"
                            />
                          )}
                        </div>
                        <h5 className="font-bold text-xs text-on-surface truncate">
                          {spotlightProduct.name}
                        </h5>
                        <p className="text-[11px] text-on-surface-variant font-semibold mt-0.5">
                          ${spotlightProduct.price.toFixed(2)}
                        </p>
                      </div>

                      <Link
                        href={`/product/${spotlightProduct.id}`}
                        onClick={() => setIsShopMegaMenuOpen(false)}
                        className="mt-2 text-center py-1.5 bg-primary hover:bg-primary-container text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                      >
                        <span>View Archetype</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/about"
            prefetch={true}
            className={`font-label-caps text-xs tracking-label-caps font-semibold uppercase transition-all duration-150 ${
              isAbout
                ? 'text-white border-b-2 border-white pb-0.5'
                : 'text-tertiary-fixed/80 hover:text-white hover:opacity-100'
            }`}
          >
            ABOUT
          </Link>

          <Link
            href="/contact"
            prefetch={true}
            className={`font-label-caps text-xs tracking-label-caps font-semibold uppercase transition-all duration-150 ${
              isContact
                ? 'text-white border-b-2 border-white pb-0.5'
                : 'text-tertiary-fixed/80 hover:text-white hover:opacity-100'
            }`}
          >
            CONTACT
          </Link>

          <Link
            href="/faq"
            prefetch={true}
            className={`font-label-caps text-xs tracking-label-caps font-semibold uppercase transition-all duration-150 ${
              isFaq
                ? 'text-white border-b-2 border-white pb-0.5'
                : 'text-tertiary-fixed/80 hover:text-white hover:opacity-100'
            }`}
          >
            FAQ
          </Link>

          {/* Admin Studio Portal Indicator */}
          <Link
            href="/admin"
            prefetch={true}
            className={`font-label-caps text-[11px] tracking-label-caps font-semibold uppercase transition-all duration-150 px-3 py-1 rounded-full border ${
              isAdmin
                ? 'bg-secondary-container text-on-secondary-fixed border-secondary-container font-bold'
                : 'border-white/20 text-tertiary-fixed hover:text-white hover:border-white/40'
            }`}
          >
            ADMIN
          </Link>
        </nav>

        {/* Right Side Actions: Search, Wishlist, Account, Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Trigger / Dropdown */}
          <div className="relative">
            {searchOpen ? (
              <>
                <div className="flex items-center bg-white/10 rounded-full px-3 py-1.5 text-xs text-white border border-white/20">
                  <Search className="w-3.5 h-3.5 mr-2 text-tertiary-fixed/80 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search archetypes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setSearchOpen(false);
                        router.push('/shop');
                      }
                    }}
                    className="bg-transparent border-none outline-none text-white text-xs placeholder:text-tertiary-fixed/50 w-28 sm:w-48"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-tertiary-fixed hover:text-white ml-1 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Instant Search Results Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-88 bg-surface-lowest border border-outline-variant/40 rounded-2xl shadow-2xl p-3.5 z-50 text-on-surface menu-dropdown menu-dropdown-open">
                  {/* Suggested Query Tags */}
                  {!searchQuery.trim() && (
                    <div className="space-y-2 pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
                        Trending Atelier Searches
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {['Linen Tote', 'Ceramic Mug', 'Travel Pack', 'Sneakers', 'T-Shirt'].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setSearchQuery(tag)}
                            className="px-2.5 py-1 rounded-full bg-surface-low border border-outline-variant/30 text-[11px] text-on-surface hover:border-primary transition-colors cursor-pointer"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchQuery.trim().length > 1 && searchResults.length > 0 && (
                    <>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-2 pb-1.5 border-b border-outline-variant/20 flex justify-between items-center">
                        <span>Matching Essentials</span>
                        <span className="text-primary font-semibold">{searchResults.length} found</span>
                      </div>
                      <div className="divide-y divide-outline-variant/15 py-1">
                        {searchResults.map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.id}`}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-low transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-surface-low flex items-center justify-center p-1 shrink-0 border border-outline-variant/20 overflow-hidden">
                              {product.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <ProductIllustration
                                  name={product.illustration}
                                  color={product.colors[0]?.hex}
                                  className="w-7 h-7 stroke-[1.6]"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                                {product.name}
                              </h4>
                              <span className="text-[10px] text-on-surface-variant block">
                                {product.category} · ${product.price.toFixed(2)}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <Link
                        href="/shop"
                        onClick={() => setSearchOpen(false)}
                        className="block text-center text-[11px] font-semibold text-primary pt-2 border-t border-outline-variant/20 hover:underline"
                      >
                        View all in catalog →
                      </Link>
                    </>
                  )}

                  {searchQuery.trim().length > 1 && searchResults.length === 0 && (
                    <div className="py-4 text-center text-xs text-on-surface-variant">
                      <p>No essentials match &ldquo;{searchQuery}&rdquo;</p>
                      <Link
                        href="/shop"
                        onClick={() => setSearchOpen(false)}
                        className="text-primary font-semibold hover:underline mt-1 inline-block text-[11px]"
                      >
                        Explore all items
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search catalog"
                className="p-2 text-tertiary-fixed/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Wishlist / Favorites Header Link */}
          <Link
            href="/account?tab=favorites"
            className="btn-interactive relative p-2 text-tertiary-fixed/80 hover:text-white rounded-full hover:bg-white/10 active:scale-90 transition-all"
            title={`Favorites (${wishlist.length})`}
            aria-label="Favorites"
          >
            <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-terracotta fill-terracotta' : ''}`} />
            {wishlist.length > 0 && (
              <span className={`absolute top-1 right-1 w-4 h-4 rounded-full bg-terracotta text-white text-[9px] font-bold flex items-center justify-center shadow-xs ${wishlistBadgeBump ? 'badge-bump-active' : ''}`}>
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Account Profile / Dropdown */}
          <div className="relative">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="btn-interactive font-label-caps text-xs tracking-label-caps font-semibold uppercase flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white transition-all cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-tertiary-fixed" />
                </button>

                {isAccountDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsAccountDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-surface-lowest border border-on-surface/15 rounded-2xl shadow-2xl p-2 z-50 text-on-surface menu-dropdown menu-dropdown-open space-y-1">
                      <div className="px-3 py-2 border-b border-outline-variant/20">
                        <span className="font-bold text-xs text-on-surface block truncate">
                          {user.name}
                        </span>
                        <span className="text-[10px] text-outline block truncate">
                          {user.email}
                        </span>
                      </div>
                      <Link
                        href="/account"
                        prefetch={true}
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-on-surface hover:bg-surface-low transition-colors font-medium"
                      >
                        <User className="w-4 h-4 text-primary" />
                        <span>Account Dashboard</span>
                      </Link>
                      <Link
                        href="/account?tab=orders"
                        prefetch={true}
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-on-surface hover:bg-surface-low transition-colors"
                      >
                        <Package className="w-4 h-4 text-outline" />
                        <span>Order History ({user.orders.length})</span>
                      </Link>
                      <Link
                        href="/account?tab=favorites"
                        prefetch={true}
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-on-surface hover:bg-surface-low transition-colors"
                      >
                        <Heart className="w-4 h-4 text-terracotta" />
                        <span>Saved Wishlist ({wishlist.length})</span>
                      </Link>
                      <Link
                        href="/account?tab=settings"
                        prefetch={true}
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-on-surface hover:bg-surface-low transition-colors"
                      >
                        <Settings className="w-4 h-4 text-outline" />
                        <span>Account Settings</span>
                      </Link>
                      <div className="border-t border-outline-variant/20 my-1" />
                      <button
                        type="button"
                        onClick={() => {
                          setIsAccountDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                prefetch={true}
                className="btn-interactive font-label-caps text-xs tracking-label-caps font-semibold uppercase flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 text-tertiary-fixed hover:text-white hover:border-white/40 active:scale-95 transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">SIGN IN</span>
              </Link>
            )}
          </div>

          {/* Cart Bag Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="btn-interactive flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all border border-white/15 group cursor-pointer shadow-xs"
            aria-label={`Cart with ${totalItems} items`}
          >
            <ShoppingBag className="w-4 h-4 text-tertiary-fixed group-hover:text-white transition-colors" />
            <span className="font-label-caps text-xs tracking-label-caps font-semibold uppercase hidden sm:inline">
              BAG
            </span>
            <span className={`inline-flex items-center justify-center bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold min-w-[20px] h-5 px-1 rounded-full ${cartBadgeBump ? 'badge-bump-active' : ''}`}>
              {totalItems}
            </span>
          </button>

          {/* Mobile Filter Trigger (Only on /shop) */}
          {isShop && (
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden p-2 text-tertiary-fixed/80 hover:text-white rounded-full hover:bg-white/10 transition-colors relative cursor-pointer"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeFilterCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-secondary-container rounded-full" />
              )}
            </button>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. MOBILE NAVIGATION ACCORDION / DRAWER */}
      <div
        className={`md:hidden bg-primary/95 backdrop-blur-md border-t border-white/10 accordion-collapse ${
          mobileMenuOpen ? 'open' : ''
        }`}
      >
        <div className="accordion-inner">
          <div className="px-6 py-5 flex flex-col gap-3">
            <Link
              href="/"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className={`font-label-caps text-xs tracking-label-caps py-2 font-semibold border-b border-white/10 ${
                isHome ? 'text-white' : 'text-tertiary-fixed hover:text-white'
              }`}
            >
              HOME
            </Link>
            {/* Mobile Shop Accordion */}
            <div className="border-b border-white/10 pb-2">
              <div className="flex items-center justify-between py-1">
                <Link
                  href="/shop"
                  prefetch={true}
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setMobileMenuOpen(false);
                  }}
                  className={`font-label-caps text-xs tracking-label-caps font-semibold ${
                    isShop ? 'text-white' : 'text-tertiary-fixed hover:text-white'
                  }`}
                >
                  SHOP CATALOG
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileShopExpanded(!mobileShopExpanded)}
                  className="p-1.5 text-tertiary-fixed/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Toggle Shop Categories"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileShopExpanded ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>
              </div>

              {mobileShopExpanded && (
                <div className="pl-2 pr-1 py-1.5 space-y-1 bg-white/5 rounded-xl border border-white/10 mt-1 mb-1">
                  {[
                    { name: 'All Essentials', category: 'ALL' as CategoryType, href: '/shop', desc: 'Complete 60+ catalog' },
                    { name: 'Organic Clothing', category: 'CLOTHING' as CategoryType, href: '/shop?category=CLOTHING', desc: 'Jerseys & knitwear' },
                    { name: 'Ceramics & Living', category: 'HOME GOODS' as CategoryType, href: '/shop?category=HOME+GOODS', desc: 'Stoneware & studio' },
                    { name: 'Accessories & Carry', category: 'ACCESSORIES' as CategoryType, href: '/shop?category=ACCESSORIES', desc: 'Totes & packs' },
                  ].map((dept) => (
                    <Link
                      key={dept.name}
                      href={dept.href}
                      onClick={() => {
                        setSelectedCategory(dept.category);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-tertiary-fixed hover:text-white hover:bg-white/10 transition-colors group cursor-pointer"
                    >
                      <div>
                        <span className="font-semibold text-white block group-hover:text-secondary-fixed transition-colors">
                          {dept.name}
                        </span>
                        <span className="text-[10px] text-tertiary-fixed/70 block">
                          {dept.desc}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/about"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className={`font-label-caps text-xs tracking-label-caps py-2 font-semibold border-b border-white/10 ${
                isAbout ? 'text-white' : 'text-tertiary-fixed hover:text-white'
              }`}
            >
              ABOUT ATELIER
            </Link>
            <Link
              href="/contact"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className={`font-label-caps text-xs tracking-label-caps py-2 font-semibold border-b border-white/10 ${
                isContact ? 'text-white' : 'text-tertiary-fixed hover:text-white'
              }`}
            >
              CONTACT STUDIO
            </Link>
            <Link
              href="/faq"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className={`font-label-caps text-xs tracking-label-caps py-2 font-semibold border-b border-white/10 ${
                isFaq ? 'text-white' : 'text-tertiary-fixed hover:text-white'
              }`}
            >
              FAQ &amp; QUESTIONS
            </Link>
            <Link
              href="/track-order"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className={`font-label-caps text-xs tracking-label-caps py-2 font-semibold border-b border-white/10 ${
                isTrack ? 'text-white' : 'text-tertiary-fixed hover:text-white'
              }`}
            >
              TRACK ORDER
            </Link>
            <Link
              href="/cart"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className={`font-label-caps text-xs tracking-label-caps py-2 font-semibold flex items-center justify-between border-b border-white/10 ${
                isCart ? 'text-white' : 'text-tertiary-fixed hover:text-white'
              }`}
            >
              <span>BAG</span>
              <span className="bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {totalItems}
              </span>
            </Link>
            <Link
              href="/account?tab=favorites"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className={`font-label-caps text-xs tracking-label-caps py-2 font-semibold flex items-center justify-between border-b border-white/10 ${
                isAccount ? 'text-white font-bold' : 'text-tertiary-fixed hover:text-white'
              }`}
            >
              <span>SAVED FAVORITES</span>
              <span className="bg-terracotta text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            </Link>
            <Link
              href="/admin"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className={`font-label-caps text-xs tracking-label-caps py-2 font-semibold border-b border-white/10 ${
                isAdmin ? 'text-white font-bold' : 'text-tertiary-fixed hover:text-white'
              }`}
            >
              ADMIN STUDIO PANEL
            </Link>

            {isAuthenticated && user ? (
              <Link
                href="/account"
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className="font-label-caps text-xs tracking-label-caps py-2 font-semibold flex items-center gap-2 text-white"
              >
                <User className="w-4 h-4" />
                <span>LOGGED IN AS {user.name.toUpperCase()}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className="font-label-caps text-xs tracking-label-caps py-2 font-semibold flex items-center gap-2 text-tertiary-fixed hover:text-white"
              >
                <User className="w-4 h-4" />
                <span>SIGN IN / CREATE ACCOUNT</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
