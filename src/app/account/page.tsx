'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import { ProductIllustration, isLightColor } from '@/components/ProductIllustrations';
import {
  User,
  Package,
  MapPin,
  LogOut,
  ShoppingBag,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Edit2,
  Save,
  Heart,
  Settings,
  Trash2,
  ExternalLink,
  Lock,
  AlertCircle,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Truck,
  LayoutDashboard,
  ChevronRight,
  Filter,
  Leaf,
  Mail,
  Phone,
  XCircle
} from 'lucide-react';
import { Address, UserPreferences, Order } from '@/types/auth';
import { GoogleIcon } from '@/components/GoogleIcon';

type AccountTab = 'overview' | 'orders' | 'favorites' | 'address' | 'settings';
type OrderFilter = 'ALL' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, updateAddress, updateProfile, login, loginWithGoogle, allOrders, updateOrderStatus } = useAuth();
  const { wishlist, toggleWishlist, clearWishlist, addToCart, setIsCartOpen } = useCart();
  const { products } = useProducts();

  const [activeTab, setActiveTab] = useState<AccountTab>('overview');
  const [orderFilter, setOrderFilter] = useState<OrderFilter>('ALL');
  const [copiedOrderNo, setCopiedOrderNo] = useState<string | null>(null);

  // Address editing state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState<Address>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  // Settings form states
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePreferences, setProfilePreferences] = useState<UserPreferences>({
    orderUpdates: true,
    newsletter: true,
    sustainablePackaging: true,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Synchronize user into state
  useEffect(() => {
    if (user) {
      setAddressForm(
        user.address || {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'United States',
        }
      );
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
      setProfilePhone(user.phone || '');
      if (user.preferences) {
        setProfilePreferences(user.preferences);
      }
    }
  }, [user]);

  // Synchronize URL query param tab on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'overview') {
        setActiveTab('overview');
      } else if (tab === 'orders') {
        setActiveTab('orders');
      } else if (tab === 'favorites' || tab === 'wishlist') {
        setActiveTab('favorites');
      } else if (tab === 'address') {
        setActiveTab('address');
      } else if (tab === 'settings') {
        setActiveTab('settings');
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOrderNo(text);
    showToast(`${label} copied to clipboard`);
    setTimeout(() => setCopiedOrderNo(null), 2000);
  };

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  // Synchronize user orders with allOrders in real-time
  const userOrders = useMemo(() => {
    if (!user) return [];
    return user.orders.map((uo) => {
      const live = (allOrders || []).find((ao) => ao.id === uo.id || ao.orderNumber === uo.orderNumber);
      return live ? { ...uo, ...live } : uo;
    });
  }, [user, allOrders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return userOrders.filter((order) => {
      if (orderFilter === 'ALL') return true;
      return order.status === orderFilter;
    });
  }, [userOrders, orderFilter]);

  const handleCancelOrder = (orderId: string, orderNumber: string) => {
    if (window.confirm(`Are you sure you want to cancel order #${orderNumber}? This will halt packaging and process a full refund.`)) {
      updateOrderStatus(orderId, 'Cancelled');
      showToast(`Order #${orderNumber} has been cancelled`);
    }
  };

  // While checking local session hydration, show quiet skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-surface text-on-surface">
        <Navbar />
        <main className="page-enter flex-1 max-w-7xl mx-auto px-5 sm:px-6 md:px-margin py-20 w-full flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="font-label-caps text-xs tracking-wider uppercase text-outline">
            Restoring slow-living session...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  // If not logged in and viewing favorites: show offline browser wishlist
  if (!isAuthenticated || !user) {
    if (activeTab === 'favorites') {
      return (
        <div className="min-h-screen flex flex-col bg-surface text-on-surface">
          <Navbar />
          <main className="page-enter flex-1 max-w-7xl mx-auto px-5 sm:px-6 md:px-margin py-10 md:py-14 w-full space-y-6">
            <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="font-label-caps text-xs uppercase font-bold text-primary block mb-1">
                  Local Browser Session
                </span>
                <h1 className="font-display-lg text-2xl font-bold text-on-surface flex items-center gap-2">
                  <Heart className="w-5 h-5 text-terracotta fill-terracotta" />
                  <span>Curated Favorites ({favoriteProducts.length})</span>
                </h1>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
                  Saved on this device. Sign in or create an account to permanently synchronize your favorites across all devices.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  prefetch={true}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-container text-white text-xs font-label-caps uppercase font-semibold rounded-xl shadow-subtle transition-colors"
                >
                  Sign In to Sync
                </Link>
                <Link
                  href="/shop"
                  prefetch={true}
                  className="px-4 py-2.5 bg-surface-low border border-outline-variant/40 text-on-surface text-xs font-label-caps uppercase font-semibold rounded-xl hover:bg-surface-high transition-colors"
                >
                  Shop Catalog
                </Link>
              </div>
            </div>

            {favoriteProducts.length === 0 ? (
              <div className="py-16 text-center bg-surface-lowest rounded-2xl border border-outline-variant/30 p-8 shadow-subtle">
                <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4 text-terracotta">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-headline-md text-base font-bold text-on-surface mb-1">
                  Your Wishlist is Empty
                </h3>
                <p className="font-body-md text-xs text-on-surface-variant max-w-sm mx-auto mb-6">
                  Bookmark your favorite slow living pieces by tapping the heart icon on any product card across the catalog.
                </p>
                <Link
                  href="/shop"
                  prefetch={true}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-label-caps uppercase font-semibold rounded-xl hover:bg-primary-container shadow-subtle transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Discover Archetypes</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-surface-lowest border border-on-surface/15 rounded-2xl overflow-hidden shadow-subtle hover:shadow-card transition-all flex flex-col group p-5 justify-between"
                  >
                    <div className="relative aspect-square w-full bg-surface-low rounded-xl border border-outline-variant/20 flex items-center justify-center p-4 overflow-hidden mb-3">
                      <Link href={`/product/${product.id}`} prefetch={true} className="w-full h-full flex items-center justify-center">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <ProductIllustration
                            name={product.illustration}
                            color={product.colors[0]?.hex}
                            className="w-24 h-24 stroke-[1.4] transition-transform duration-300 group-hover:scale-110"
                          />
                        )}
                      </Link>
                      <button
                        onClick={() => {
                          toggleWishlist(product.id);
                          showToast(`Removed "${product.name}" from favorites`);
                        }}
                        className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 shadow-sm border border-outline-variant/30 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-center space-y-1">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-outline">
                        {product.category}
                      </span>
                      <h4 className="font-bold text-sm text-on-surface">
                        {product.name}
                      </h4>
                      <p className="font-bold text-xs text-primary">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(product, product.colors[0], product.sizes[0], 1);
                          setIsCartOpen(true);
                        }}
                        className="flex-1 py-2 bg-primary hover:bg-primary-container text-white text-xs font-label-caps uppercase font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Add to Bag
                      </button>
                      <Link
                        href={`/product/${product.id}`}
                        prefetch={true}
                        className="px-3 py-2 bg-surface-low hover:bg-surface-high text-on-surface text-xs font-semibold rounded-lg transition-colors border border-outline-variant/30"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
          <Footer />
        </div>
      );
    }

    // Professional Unauthenticated Gateway
    return (
      <div className="min-h-screen flex flex-col bg-surface text-on-surface">
        <Navbar />
        <main className="page-enter flex-1 max-w-xl mx-auto px-6 py-16 md:py-24 w-full flex flex-col items-center justify-center">
          <div className="w-full bg-surface-lowest border border-on-surface/15 rounded-3xl p-8 sm:p-10 shadow-card text-center relative overflow-hidden">
            {/* Top decorative accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary-container to-primary" />

            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto mb-5 shadow-xs">
              <User className="w-8 h-8" />
            </div>

            <span className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary block mb-1">
              Atelier Member Portal
            </span>
            <h1 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface mb-3">
              Welcome to E Sondha
            </h1>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto mb-8 leading-relaxed">
              Sign in to manage your slow-living orders, track carbon-neutral courier shipments, save custom wishlists, and store default atelier addresses.
            </p>

            {/* Member Perks Checklist */}
            <div className="grid grid-cols-2 gap-3 text-left mb-8 max-w-md mx-auto bg-surface-low p-4 rounded-xl border border-outline-variant/30 text-xs">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-olive shrink-0 stroke-[2.5]" />
                <span className="font-medium text-on-surface">Order Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-olive shrink-0 stroke-[2.5]" />
                <span className="font-medium text-on-surface">Saved Wishlists</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-olive shrink-0 stroke-[2.5]" />
                <span className="font-medium text-on-surface">Atelier Addresses</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-olive shrink-0 stroke-[2.5]" />
                <span className="font-medium text-on-surface">Faster Checkout</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 w-full max-w-md mx-auto">
              <button
                type="button"
                onClick={async () => {
                  const res = await loginWithGoogle();
                  if (res.success) {
                    showToast('Signed in with Google');
                  }
                }}
                className="btn-interactive w-full py-2.5 px-4 bg-surface-lowest hover:bg-surface-low border border-outline-variant/60 text-on-surface font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:border-primary/40 active:scale-[0.98]"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-outline-variant/30 w-full" />
                <span className="bg-surface-lowest px-3 font-label-caps text-[10px] tracking-label-caps uppercase text-outline shrink-0">
                  or atelier account
                </span>
                <div className="border-t border-outline-variant/30 w-full" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                <Link
                  href="/login"
                  prefetch={true}
                  className="btn-interactive flex-1 py-2.5 px-5 bg-primary hover:bg-primary-container text-white font-label-caps text-xs tracking-label-caps uppercase font-semibold rounded-xl shadow-subtle transition-all text-center flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/login"
                  prefetch={true}
                  className="btn-interactive flex-1 py-2.5 px-5 bg-surface-low border border-outline-variant/40 text-on-surface hover:bg-surface-high font-label-caps text-xs tracking-label-caps uppercase font-semibold rounded-xl transition-all text-center active:scale-95"
                >
                  Create Account
                </Link>
              </div>
            </div>

            {/* Demo Testing Helper */}
            <div className="mt-8 pt-6 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => {
                  login('aria@esondha.com', 'password123');
                  showToast('Signed in as Aria Lindqvist');
                }}
                className="text-xs text-primary font-semibold hover:underline cursor-pointer flex items-center justify-center gap-1.5 mx-auto py-1 px-3 rounded-lg hover:bg-primary/5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Instant Demo Login: Aria Lindqvist (Patron)</span>
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Handlers for authenticated users
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    updateAddress(addressForm);
    setIsEditingAddress(false);
    setSavedSuccess(true);
    showToast('Shipping address saved successfully');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError(null);
    setSettingsSuccess(false);

    if (!profileName.trim()) {
      setSettingsError('Please provide your full name.');
      return;
    }

    if (!profileEmail.trim() || !profileEmail.includes('@')) {
      setSettingsError('Please provide a valid email address.');
      return;
    }

    if (newPassword.trim()) {
      if (newPassword.length < 6) {
        setSettingsError('New password must be at least 6 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setSettingsError('New passwords do not match. Please verify and retry.');
        return;
      }
    }

    const res = updateProfile({
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      password: newPassword.trim() ? newPassword.trim() : undefined,
      preferences: profilePreferences,
    });

    if (!res.success) {
      setSettingsError(res.error || 'Failed to update account settings.');
      return;
    }

    setNewPassword('');
    setConfirmPassword('');
    setSettingsSuccess(true);
    showToast('Profile & preferences saved successfully');
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  const handleMoveAllToBag = () => {
    const inStockItems = favoriteProducts.filter((p) => p.inStock);
    if (inStockItems.length === 0) {
      showToast('No in-stock favorites to move to bag.');
      return;
    }

    inStockItems.forEach((p) => {
      addToCart(p, p.colors[0], p.sizes[0], 1);
    });

    showToast(`Added ${inStockItems.length} archetype${inStockItems.length > 1 ? 's' : ''} to bag`);
    setIsCartOpen(true);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const latestOrder = userOrders[0] || null;

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      <main className="page-enter flex-1 max-w-7xl mx-auto px-5 sm:px-6 md:px-margin py-8 md:py-12 w-full space-y-8">
        {/* 1. PROFESSIONAL PATRON IDENTITY BANNER */}
        <div className="bg-surface-lowest border border-on-surface/15 rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-primary text-white flex items-center justify-center font-display-lg text-2xl font-bold border border-white/20 shadow-subtle">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-xs" title="Session Active" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface">
                  {user.name}
                </h1>
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-primary/20 uppercase tracking-wider font-label-caps">
                  Studio Patron
                </span>
                {user.provider === 'google' && (
                  <span className="inline-flex items-center gap-1 bg-surface-low border border-outline-variant/40 px-2 py-0.5 rounded-full text-[10px] font-semibold text-on-surface shadow-2xs">
                    <GoogleIcon className="w-3 h-3" />
                    <span>Google Session</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-outline" />
                  <span>{user.email}</span>
                </span>
                <span className="text-outline/40">·</span>
                <span>Member since {user.createdAt}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <Link
              href="/shop"
              prefetch={true}
              className="btn-interactive flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-label-caps tracking-label-caps uppercase font-semibold shadow-subtle transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Explore Shop</span>
            </Link>
            <button
              onClick={() => setActiveTab('settings')}
              className="btn-interactive px-3.5 py-2.5 rounded-xl bg-surface-low hover:bg-surface-high text-on-surface text-xs font-semibold border border-outline-variant/30 transition-colors flex items-center gap-1.5 active:scale-95"
              title="Edit Profile Settings"
            >
              <Settings className="w-3.5 h-3.5 text-outline" />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="btn-interactive px-3.5 py-2.5 rounded-xl border border-outline-variant/30 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs font-semibold text-outline transition-colors flex items-center gap-1.5 active:scale-95"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* 2. REFINED SEGMENTED NAVIGATION TAB BAR */}
        <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-1.5 shadow-subtle flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`btn-interactive py-2.5 px-4 rounded-xl text-xs font-label-caps tracking-label-caps uppercase font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer active:scale-95 ${
              activeTab === 'overview'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-low'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`btn-interactive py-2.5 px-4 rounded-xl text-xs font-label-caps tracking-label-caps uppercase font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer active:scale-95 ${
              activeTab === 'orders'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-low'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders ({userOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`btn-interactive py-2.5 px-4 rounded-xl text-xs font-label-caps tracking-label-caps uppercase font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer active:scale-95 ${
              activeTab === 'favorites'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-low'
            }`}
          >
            <Heart className={`w-4 h-4 ${wishlist.length > 0 && activeTab !== 'favorites' ? 'text-red-500 fill-red-500' : ''}`} />
            <span>Wishlist ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('address')}
            className={`btn-interactive py-2.5 px-4 rounded-xl text-xs font-label-caps tracking-label-caps uppercase font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer active:scale-95 ${
              activeTab === 'address'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-low'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Shipping Address</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`btn-interactive py-2.5 px-4 rounded-xl text-xs font-label-caps tracking-label-caps uppercase font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer active:scale-95 ${
              activeTab === 'settings'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-low'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Profile & Security</span>
          </button>
        </div>

        {/* 3. TAB CONTENT */}

        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 4 Metric KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Card 1: Orders */}
              <div
                onClick={() => setActiveTab('orders')}
                className="bg-surface-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-subtle hover:border-primary transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-label-caps text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">
                    Orders Placed
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface">
                  {userOrders.length}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-primary font-semibold mt-2">
                  <span>View full history</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 2: Wishlist */}
              <div
                onClick={() => setActiveTab('favorites')}
                className="bg-surface-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-subtle hover:border-primary transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-label-caps text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">
                    Saved Wishlist
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart className="w-4 h-4 fill-red-500" />
                  </div>
                </div>
                <div className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface">
                  {wishlist.length}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-primary font-semibold mt-2">
                  <span>Explore wishlist</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 3: Default Shipping Destination */}
              <div
                onClick={() => setActiveTab('address')}
                className="bg-surface-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-subtle hover:border-primary transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-label-caps text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">
                    Shipping Destination
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-fixed flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-headline-md text-base sm:text-lg font-bold text-on-surface truncate">
                  {user.address?.city ? `${user.address.city}, ${user.address.state}` : 'Not configured'}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-primary font-semibold mt-2">
                  <span>Manage address</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 4: Sustainability & Carbon Offset */}
              <div className="bg-surface-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-subtle">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-label-caps text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">
                    Atelier Transit
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-olive/15 text-olive flex items-center justify-center">
                    <Leaf className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-headline-md text-base sm:text-lg font-bold text-olive">
                  100% Offset
                </div>
                <p className="text-[11px] text-on-surface-variant mt-2 leading-tight">
                  Certified carbon-neutral delivery on every parcel
                </p>
              </div>
            </div>

            {/* Latest Order Spotlight */}
            {latestOrder ? (
              <div className="bg-surface-lowest border border-on-surface/15 rounded-3xl p-6 sm:p-8 shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-outline-variant/20 gap-3">
                  <div>
                    <span className="font-label-caps text-xs uppercase font-bold text-primary block mb-0.5">
                      Most Recent Dispatch
                    </span>
                    <h2 className="font-display-lg text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
                      <span>Order #{latestOrder.orderNumber}</span>
                      <button
                        onClick={() => copyToClipboard(latestOrder.orderNumber, 'Order number')}
                        className="p-1 rounded text-outline hover:text-primary transition-colors"
                        title="Copy Order Number"
                      >
                        {copiedOrderNo === latestOrder.orderNumber ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Placed on {latestOrder.date} · {latestOrder.items.length} item{latestOrder.items.length > 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      latestOrder.status === 'Delivered'
                        ? 'bg-olive/15 text-olive border border-olive/30'
                        : latestOrder.status === 'Shipped'
                        ? 'bg-terracotta/15 text-terracotta border border-terracotta/30'
                        : latestOrder.status === 'Cancelled'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-primary/10 text-primary border border-primary/20'
                    }`}>
                      {latestOrder.status === 'Cancelled' ? (
                        <XCircle className="w-3.5 h-3.5" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>{latestOrder.status}</span>
                    </span>

                    {latestOrder.status === 'Processing' && (
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(latestOrder.id, latestOrder.orderNumber)}
                        className="btn-interactive px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 active:scale-95 cursor-pointer"
                        title="Cancel this order"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}

                    <Link
                      href={`/track-order?orderNumber=${encodeURIComponent(latestOrder.orderNumber)}`}
                      prefetch={true}
                      className="btn-interactive px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs font-label-caps uppercase font-semibold rounded-xl shadow-subtle transition-colors flex items-center gap-1.5 active:scale-95"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Package</span>
                    </Link>
                  </div>
                </div>

                {/* Items Row */}
                <div className="py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {latestOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3.5 p-3 rounded-xl bg-surface-low border border-outline-variant/30">
                      <div className="w-14 h-14 rounded-lg bg-surface-lowest border border-outline-variant/30 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded" />
                        ) : (
                          <ProductIllustration
                            name={item.illustration}
                            color={item.selectedColor?.hex}
                            className="w-10 h-10 stroke-[1.8]"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-xs text-on-surface truncate">{item.name}</h4>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">
                          {item.selectedColor?.name} · {item.selectedSize}
                        </p>
                        <span className="text-xs font-bold text-primary mt-1 block">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer summary */}
                <div className="pt-4 border-t border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-on-surface-variant gap-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-outline" />
                    <span>Shipping to: <strong className="text-on-surface font-semibold">{latestOrder.shippingAddress.street}, {latestOrder.shippingAddress.city}</strong></span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Total: <strong className="text-base text-primary font-display-lg">${latestOrder.total.toFixed(2)}</strong></span>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>All Orders</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-surface-lowest border border-on-surface/15 rounded-3xl p-8 shadow-subtle text-center">
                <ShoppingBag className="w-10 h-10 text-outline/40 mx-auto mb-3" />
                <h3 className="font-headline-md text-base font-bold text-on-surface mb-1">
                  No Atelier Orders Yet
                </h3>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto mb-5">
                  Begin your slow-living ritual with curated Japanese ceramics and GOTS organic cotton staples.
                </p>
                <Link
                  href="/shop"
                  prefetch={true}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-container text-white text-xs font-label-caps uppercase font-semibold rounded-xl shadow-subtle inline-block"
                >
                  Explore Collection
                </Link>
              </div>
            )}

            {/* Quick Two-Column Shelf: Wishlist Previews & Studio Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Wishlist Quick Shelf */}
              <div className="bg-surface-lowest border border-on-surface/15 rounded-3xl p-6 sm:p-7 shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                      <h3 className="font-headline-md text-base font-bold text-on-surface">
                        Curated Wishlist ({wishlist.length})
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('favorites')}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {favoriteProducts.length === 0 ? (
                    <div className="py-8 text-center text-xs text-on-surface-variant bg-surface-low rounded-2xl p-4">
                      <p>You have not bookmarked any pieces yet.</p>
                      <Link href="/shop" prefetch={true} className="text-primary font-semibold hover:underline mt-1.5 inline-block">
                        Discover items on the shop
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {favoriteProducts.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-surface-low border border-outline-variant/30">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-lg bg-surface-lowest border border-outline-variant/30 flex items-center justify-center p-1 shrink-0">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded" />
                              ) : (
                                <ProductIllustration
                                  name={item.illustration}
                                  color={item.colors[0]?.hex}
                                  className="w-7 h-7 stroke-[1.8]"
                                />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-xs text-on-surface truncate">{item.name}</h4>
                              <span className="text-xs font-bold text-primary">${item.price.toFixed(2)}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              addToCart(item, item.colors[0], item.sizes[0], 1);
                              showToast(`Added "${item.name}" to bag`);
                              setIsCartOpen(true);
                            }}
                            className="px-3 py-1.5 bg-primary hover:bg-primary-container text-white text-[11px] font-label-caps uppercase font-semibold rounded-lg shrink-0 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Address & Security Card */}
              <div className="bg-surface-lowest border border-on-surface/15 rounded-3xl p-6 sm:p-7 shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <h3 className="font-headline-md text-base font-bold text-on-surface">
                        Default Shipping Destination
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('address')}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  {user.address?.street ? (
                    <div className="p-4 bg-surface-low rounded-2xl border border-outline-variant/30 text-xs sm:text-sm text-on-surface space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-on-surface">{user.name}</p>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded uppercase border border-emerald-200">
                          Primary
                        </span>
                      </div>
                      <p className="text-on-surface-variant">{user.address.street}</p>
                      <p className="text-on-surface-variant">
                        {user.address.city}, {user.address.state} {user.address.postalCode}
                      </p>
                      <p className="text-outline text-xs pt-1">{user.address.country}</p>
                    </div>
                  ) : (
                    <div className="p-5 text-center bg-surface-low rounded-2xl text-xs text-on-surface-variant">
                      <p className="mb-2">No delivery address saved yet.</p>
                      <button
                        onClick={() => {
                          setActiveTab('address');
                          setIsEditingAddress(true);
                        }}
                        className="px-4 py-1.5 bg-primary text-white font-semibold rounded-lg text-xs"
                      >
                        Add Shipping Address
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs text-outline">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-olive" />
                    <span>256-Bit Encrypted Patron Profile</span>
                  </div>
                  <Link href="/contact" prefetch={true} className="text-primary font-semibold hover:underline">
                    Studio Concierge
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ORDER HISTORY */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-4 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-outline" />
                <span className="font-label-caps text-xs uppercase font-bold text-on-surface">Filter Orders:</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['ALL', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as OrderFilter[]).map((st) => {
                  const count =
                    st === 'ALL'
                      ? userOrders.length
                      : userOrders.filter((o) => o.status === st).length;
                  return (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`btn-interactive px-3 py-1.5 rounded-lg text-xs font-label-caps uppercase font-semibold transition-colors cursor-pointer active:scale-95 ${
                        orderFilter === st
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-surface-low text-on-surface-variant hover:bg-surface-high'
                      }`}
                    >
                      {st === 'ALL' ? `All (${count})` : `${st} (${count})`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="py-16 text-center bg-surface-lowest rounded-3xl border border-outline-variant/30 p-8 shadow-subtle">
                <ShoppingBag className="w-10 h-10 text-outline/40 mx-auto mb-3" />
                <h3 className="font-headline-md text-base font-bold text-on-surface mb-1">
                  No orders found
                </h3>
                <p className="font-body-md text-xs text-on-surface-variant max-w-sm mx-auto mb-6">
                  {orderFilter === 'ALL'
                    ? "You haven't placed any orders yet. Discover our quiet essentials to start your collection."
                    : `No orders currently matching "${orderFilter}".`}
                </p>
                <Link
                  href="/shop"
                  prefetch={true}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-container text-white font-label-caps text-xs tracking-label-caps uppercase font-semibold rounded-xl shadow-subtle transition-colors inline-block"
                >
                  Explore Catalog
                </Link>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-surface-lowest border border-on-surface/15 rounded-3xl shadow-card overflow-hidden transition-all hover:border-primary/40"
                >
                  {/* Order Top Meta */}
                  <div className="px-6 py-4 bg-surface-low border-b border-outline-variant/30 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
                      <div>
                        <span className="font-label-caps text-[10px] uppercase text-outline block">
                          ORDER PLACED
                        </span>
                        <span className="font-semibold text-on-surface">{order.date}</span>
                      </div>
                      <div>
                        <span className="font-label-caps text-[10px] uppercase text-outline block">
                          ORDER NUMBER
                        </span>
                        <div className="flex items-center gap-1.5 font-mono font-bold text-primary">
                          <span>{order.orderNumber}</span>
                          <button
                            onClick={() => copyToClipboard(order.orderNumber, 'Order number')}
                            className="p-0.5 text-outline hover:text-primary transition-colors"
                            title="Copy Order Number"
                          >
                            {copiedOrderNo === order.orderNumber ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="font-label-caps text-[10px] uppercase text-outline block">
                          TOTAL AMOUNT
                        </span>
                        <span className="font-bold text-on-surface">${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        order.status === 'Delivered'
                          ? 'bg-olive/15 text-olive border border-olive/30'
                          : order.status === 'Shipped'
                          ? 'bg-terracotta/15 text-terracotta border border-terracotta/30'
                          : order.status === 'Cancelled'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-primary/10 text-primary border border-primary/20'
                      }`}>
                        {order.status === 'Cancelled' ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        <span>{order.status}</span>
                      </span>

                      {order.status === 'Processing' && (
                        <button
                          type="button"
                          onClick={() => handleCancelOrder(order.id, order.orderNumber)}
                          className="btn-interactive px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 active:scale-95 cursor-pointer"
                          title="Cancel this order"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      )}

                      <Link
                        href={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}`}
                        prefetch={true}
                        className="btn-interactive px-3.5 py-1.5 bg-surface-lowest border border-outline-variant/40 hover:border-primary text-on-surface text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 active:scale-95"
                      >
                        <Truck className="w-3.5 h-3.5 text-primary" />
                        <span>Track Delivery</span>
                      </Link>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="p-6 divide-y divide-outline-variant/20">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-surface-low border border-outline-variant/30 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <ProductIllustration
                              name={item.illustration}
                              color={item.selectedColor?.hex}
                              className="w-10 h-10 stroke-[1.8]"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-body-lg text-sm font-semibold text-on-surface truncate">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-on-surface-variant">
                            <span className="flex items-center gap-1">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-black/20 inline-block"
                                style={{ backgroundColor: item.selectedColor?.hex || '#25435a' }}
                              />
                              <span>{item.selectedColor?.name}</span>
                            </span>
                            <span className="text-outline/40">·</span>
                            <span>Size: <strong>{item.selectedSize}</strong></span>
                            <span className="text-outline/40">·</span>
                            <span>Qty: <strong>{item.quantity}</strong></span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-headline-md text-sm font-bold text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer / Shipping Destination */}
                  <div className="px-6 py-3.5 bg-surface-low/50 border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between text-xs text-on-surface-variant gap-2">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-outline" />
                      <span>
                        Delivered to: <strong className="text-on-surface">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-olive font-medium">
                      <Leaf className="w-3.5 h-3.5" />
                      <span>Carbon-neutral verified offset</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: CURATED WISHLIST */}
        {/* ======================================================== */}
        {activeTab === 'favorites' && (
          <div className="space-y-6">
            {/* Wishlist Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-lowest border border-on-surface/15 rounded-2xl p-6 shadow-subtle">
              <div>
                <h2 className="font-headline-lg text-lg font-bold text-on-surface flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  <span>Curated Favorites & Wishlist ({favoriteProducts.length})</span>
                </h2>
                <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
                  Bookmarked essentials synchronized to your slow-living account. Readily accessible for immediate ordering anytime.
                </p>
              </div>

              {favoriteProducts.length > 0 && (
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleMoveAllToBag}
                    className="px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs font-label-caps uppercase font-semibold rounded-xl shadow-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move All to Bag</span>
                  </button>
                  <button
                    onClick={() => {
                      clearWishlist();
                      showToast('Favorites list cleared');
                    }}
                    className="px-3 py-2 border border-outline-variant/40 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs font-label-caps uppercase font-semibold text-outline rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>
              )}
            </div>

            {/* Empty Favorites State */}
            {favoriteProducts.length === 0 ? (
              <div className="py-16 text-center bg-surface-lowest rounded-3xl border border-outline-variant/30 p-8 shadow-subtle">
                <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4 text-red-400">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-headline-md text-base font-bold text-on-surface mb-1">
                  Your Curated Wishlist is Empty
                </h3>
                <p className="font-body-md text-xs text-on-surface-variant max-w-sm mx-auto mb-6">
                  Bookmark your favorite slow living pieces by tapping the heart icon on any product card across the catalog.
                </p>
                <Link
                  href="/shop"
                  prefetch={true}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-label-caps uppercase font-semibold rounded-xl hover:bg-primary-container shadow-subtle transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Discover Archetypes</span>
                </Link>
              </div>
            ) : (
              /* Favorites Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-surface-lowest border border-on-surface/15 rounded-2xl overflow-hidden shadow-subtle hover:shadow-card transition-all flex flex-col group p-5 justify-between"
                  >
                    {/* Thumbnail Display with Soft Neutral Canvas */}
                    <div className="relative aspect-square w-full bg-stone-100 rounded-xl border border-outline-variant/20 flex items-center justify-center p-6 overflow-hidden mb-4">
                      <Link href={`/product/${product.id}`} prefetch={true} className="w-full h-full flex items-center justify-center">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <ProductIllustration
                            name={product.illustration}
                            color={product.colors[0]?.hex}
                            className="w-24 h-24 stroke-[1.6] transition-transform duration-300 group-hover:scale-110"
                          />
                        )}
                      </Link>

                      {/* Remove Favorite Button */}
                      <button
                        onClick={() => {
                          toggleWishlist(product.id);
                          showToast(`Removed "${product.name}" from favorites`);
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-sm border border-outline-variant/30 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                        title="Remove from favorites"
                        aria-label="Remove from favorites"
                      >
                        <Heart className="w-4 h-4 fill-red-500" />
                      </button>

                      {/* Category Pill */}
                      <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full text-primary border border-outline-variant/20">
                        {product.category}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${product.id}`}
                          prefetch={true}
                          className="font-headline-md text-sm font-bold text-on-surface hover:text-primary transition-colors line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <span className="text-sm font-bold text-primary shrink-0">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>

                      <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Stock indicator */}
                      <div className="flex items-center justify-between pt-1">
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          product.inStock
                            ? 'bg-olive/15 text-olive'
                            : 'bg-stone-100 text-outline'
                        }`}>
                          {product.inStock ? 'Ready to Ship' : 'Restocking Soon'}
                        </span>
                        <span className="text-[11px] text-outline">
                          {product.colors.length} color{product.colors.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Card Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-outline-variant/15 flex items-center gap-2">
                      <button
                        disabled={!product.inStock}
                        onClick={() => {
                          addToCart(product, product.colors[0], product.sizes[0], 1);
                          showToast(`Added "${product.name}" to your bag`);
                          setIsCartOpen(true);
                        }}
                        className={`flex-1 py-2 px-3 rounded-xl font-label-caps text-xs tracking-label-caps uppercase font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          product.inStock
                            ? 'bg-primary hover:bg-primary-container text-white shadow-subtle'
                            : 'bg-surface-low text-outline cursor-not-allowed border border-outline-variant/20'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{product.inStock ? 'Move to Bag' : 'Sold Out'}</span>
                      </button>

                      <Link
                        href={`/product/${product.id}`}
                        prefetch={true}
                        className="p-2 rounded-xl border border-outline-variant/40 hover:bg-surface-high text-on-surface-variant hover:text-on-surface transition-colors"
                        title="View product details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: SHIPPING & DELIVERY ADDRESS */}
        {/* ======================================================== */}
        {activeTab === 'address' && (
          <div className="max-w-2xl bg-surface-lowest border border-on-surface/15 rounded-3xl p-6 sm:p-8 shadow-card">
            <div className="flex items-center justify-between pb-5 border-b border-outline-variant/20 mb-6">
              <div>
                <h2 className="font-headline-lg text-lg sm:text-xl font-bold text-on-surface flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Default Shipping Address</span>
                </h2>
                <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
                  Pre-filled automatically at checkout for rapid procurement.
                </p>
              </div>

              {!isEditingAddress && (
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(true)}
                  className="px-4 py-2 rounded-xl border border-outline-variant/40 hover:border-primary text-xs font-label-caps uppercase font-semibold text-primary flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Address</span>
                </button>
              )}
            </div>

            {savedSuccess && (
              <div className="mb-5 p-3.5 bg-olive/15 border border-olive/30 rounded-xl flex items-center gap-2 text-xs text-olive font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Shipping address saved successfully.</span>
              </div>
            )}

            {isEditingAddress ? (
              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div>
                  <label className="block text-xs font-label-caps uppercase font-semibold text-on-surface-variant mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    placeholder="1420 Franklin Street, Suite 4B"
                    className="w-full bg-surface-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-label-caps uppercase font-semibold text-on-surface-variant mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      placeholder="Portland"
                      className="w-full bg-surface-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-label-caps uppercase font-semibold text-on-surface-variant mb-1">
                      State / Region *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      placeholder="OR"
                      className="w-full bg-surface-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-label-caps uppercase font-semibold text-on-surface-variant mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                      placeholder="97201"
                      className="w-full bg-surface-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-label-caps uppercase font-semibold text-on-surface-variant mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      disabled
                      value="United States"
                      className="w-full bg-surface-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-outline"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(false)}
                    className="px-4 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-label-caps uppercase font-semibold text-on-surface-variant hover:bg-surface-high transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary hover:bg-primary-container text-white text-xs font-label-caps uppercase font-semibold rounded-xl shadow-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Address</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {user.address?.street ? (
                  <div className="p-5 bg-surface-low rounded-2xl border border-outline-variant/30 text-xs sm:text-sm text-on-surface space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-base text-on-surface">{user.name}</p>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded uppercase border border-emerald-200">
                        Default Destination
                      </span>
                    </div>
                    <p className="text-on-surface-variant">{user.address.street}</p>
                    <p className="text-on-surface-variant">
                      {user.address.city}, {user.address.state} {user.address.postalCode}
                    </p>
                    <p className="text-outline text-xs pt-1">{user.address.country}</p>
                  </div>
                ) : (
                  <div className="text-xs text-on-surface-variant py-6 text-center bg-surface-low rounded-2xl">
                    <MapPin className="w-8 h-8 text-outline/40 mx-auto mb-2" />
                    <p className="font-semibold text-on-surface mb-1">No default address saved yet</p>
                    <p className="text-on-surface-variant mb-4">Add your shipping details to speed up future orders.</p>
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl shadow-subtle"
                    >
                      Add Shipping Address
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: PROFILE & SECURITY SETTINGS */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Settings Column (2 Cols) */}
            <div className="lg:col-span-2 bg-surface-lowest border border-on-surface/15 rounded-3xl p-6 sm:p-8 shadow-card">
              <div className="pb-5 border-b border-outline-variant/20 mb-6">
                <h2 className="font-headline-lg text-lg sm:text-xl font-bold text-on-surface flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <span>Profile & Account Credentials</span>
                </h2>
                <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
                  Manage your personal identity, login credentials, and studio communications.
                </p>
              </div>

              {settingsError && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2.5 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{settingsError}</span>
                </div>
              )}

              {settingsSuccess && (
                <div className="mb-5 p-3.5 bg-olive/15 border border-olive/30 text-olive rounded-xl flex items-center gap-2.5 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Your profile and preferences were saved successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* 1. Identity & Contact */}
                <div>
                  <h3 className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary mb-3.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Personal Details</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-label-caps uppercase font-semibold text-on-surface-variant mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="Aria Lindqvist"
                        className="w-full bg-surface-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-label-caps uppercase font-semibold text-on-surface-variant mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        placeholder="aria@esondha.com"
                        className="w-full bg-surface-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-label-caps uppercase font-semibold text-on-surface-variant mb-1">
                        Contact Phone (Optional Courier SMS Alerts)
                      </label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="+1 (555) 234-8901"
                        className="w-full bg-surface-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Credentials & Password */}
                <div className="pt-5 border-t border-outline-variant/20">
                  <h3 className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary mb-2 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Security & Password</span>
                  </h3>
                  <p className="text-[11px] text-on-surface-variant mb-4">
                    Leave blank if you do not wish to modify your current password.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-label-caps uppercase font-semibold text-on-surface-variant mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-surface-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-label-caps uppercase font-semibold text-on-surface-variant mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-surface-lowest border border-outline-variant/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Atelier Preferences */}
                <div className="pt-5 border-t border-outline-variant/20">
                  <h3 className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Studio Communications & Packaging</span>
                  </h3>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer p-3.5 rounded-xl border border-outline-variant/25 hover:bg-surface-low transition-colors">
                      <input
                        type="checkbox"
                        checked={profilePreferences.orderUpdates !== false}
                        onChange={(e) =>
                          setProfilePreferences({
                            ...profilePreferences,
                            orderUpdates: e.target.checked,
                          })
                        }
                        className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-on-surface block">
                          Real-Time Courier & Dispatch Notifications
                        </span>
                        <span className="text-on-surface-variant text-[11px]">
                          Receive timely updates when orders are packed, in transit, and safely delivered.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer p-3.5 rounded-xl border border-outline-variant/25 hover:bg-surface-low transition-colors">
                      <input
                        type="checkbox"
                        checked={profilePreferences.newsletter !== false}
                        onChange={(e) =>
                          setProfilePreferences({
                            ...profilePreferences,
                            newsletter: e.target.checked,
                          })
                        }
                        className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-on-surface block">
                          Atelier Seasonal Gazette & Private Drops
                        </span>
                        <span className="text-on-surface-variant text-[11px]">
                          Exclusive early notifications for limited pottery, organic garments, and bespoke runs.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer p-3.5 rounded-xl border border-outline-variant/25 hover:bg-surface-low transition-colors">
                      <input
                        type="checkbox"
                        checked={profilePreferences.sustainablePackaging !== false}
                        onChange={(e) =>
                          setProfilePreferences({
                            ...profilePreferences,
                            sustainablePackaging: e.target.checked,
                          })
                        }
                        className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-on-surface block">
                          Zero-Plastic Kraft Packaging
                        </span>
                        <span className="text-on-surface-variant text-[11px]">
                          Always package parcels using unbleached kraft paper and biodegradable water-activated tape.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="pt-5 border-t border-outline-variant/20 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileName(user.name);
                      setProfileEmail(user.email);
                      setProfilePhone(user.phone || '');
                      setNewPassword('');
                      setConfirmPassword('');
                      setSettingsError(null);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-label-caps uppercase font-semibold text-on-surface-variant hover:bg-surface-high transition-colors"
                  >
                    Reset Form
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary hover:bg-primary-container text-white text-xs font-label-caps uppercase font-semibold rounded-xl shadow-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Settings</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Account Metadata / Security Badge Card */}
            <div className="space-y-6">
              <div className="bg-surface-lowest border border-on-surface/15 rounded-3xl p-6 sm:p-7 shadow-card">
                <div className="flex items-center gap-3 pb-3.5 border-b border-outline-variant/20 mb-4">
                  <ShieldCheck className="w-5 h-5 text-olive" />
                  <h3 className="font-headline-sm text-sm font-bold text-on-surface">
                    Account Security & Verification
                  </h3>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">
                      Patron Member ID
                    </span>
                    <span className="font-mono text-on-surface font-semibold">{user.id}</span>
                  </div>

                  <div>
                    <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">
                      Registration Date
                    </span>
                    <span className="text-on-surface">{user.createdAt}</span>
                  </div>

                  <div>
                    <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">
                      Session Integrity
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-olive font-semibold mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Authenticated Member Session</span>
                    </span>
                  </div>

                  <div className="pt-3 border-t border-outline-variant/15 text-[11px] text-on-surface-variant leading-relaxed">
                    Personal records are guarded with end-to-end encryption and will never be shared or monetized with advertising networks.
                  </div>
                </div>
              </div>

              {/* Quick Support Card */}
              <div className="bg-surface-low border border-outline-variant/30 rounded-3xl p-6 text-xs text-on-surface space-y-3">
                <h4 className="font-bold text-primary uppercase tracking-wider text-[11px]">
                  Need Assistance?
                </h4>
                <p className="text-on-surface-variant text-xs leading-relaxed">
                  Have questions regarding an active dispatch, return guidance, or custom pottery care rituals?
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/contact"
                    prefetch={true}
                    className="text-primary hover:underline font-semibold flex items-center justify-between p-2 rounded-lg hover:bg-surface-lowest transition-colors"
                  >
                    <span>Contact Atelier Concierge</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/faq"
                    prefetch={true}
                    className="text-primary hover:underline font-semibold flex items-center justify-between p-2 rounded-lg hover:bg-surface-lowest transition-colors"
                  >
                    <span>Browse Atelier FAQ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/shipping-returns"
                    prefetch={true}
                    className="text-primary hover:underline font-semibold flex items-center justify-between p-2 rounded-lg hover:bg-surface-lowest transition-colors"
                  >
                    <span>Shipping &amp; Return Terms</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-primary text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      <Footer />
    </div>
  );
}
