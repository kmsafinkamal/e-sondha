'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductIllustration, isLightColor } from '@/components/ProductIllustrations';
import { VignetteCanvas, VignetteItem } from '@/components/VignetteCanvas';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { Address, Order, OrderItem } from '@/types/auth';
import {
  ArrowLeft,
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  ShieldCheck,
  Leaf,
  ShoppingBag,
  RotateCcw,
  User,
  MapPin,
  Edit2,
  Check,
  Package
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalItems,
    freeShippingThreshold,
    isFreeShipping,
    freeShippingProgress,
  } = useCart();

  const { decrementStock, products } = useProducts();
  const { user, isAuthenticated, createOrder, updateAddress } = useAuth();
  const [checkoutCompleted, setCheckoutCompleted] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Empty Cart Spatial Inspiration State
  const [emptyCartAddedId, setEmptyCartAddedId] = useState<string | null>(null);
  const [isEmptyCartAllAdded, setIsEmptyCartAllAdded] = useState(false);

  const emptyCartVignetteItems: VignetteItem[] = useMemo(() => [
    {
      id: 'cart-v-mug',
      productId: 'prod-3',
      name: 'Coffee Mug',
      category: 'HOME GOODS',
      price: 14.99,
      illustration: 'mug',
      color: '#25435a',
      top: '52%',
      left: '50%',
      popoverAlign: 'center',
      description: 'Thick-walled stoneware mug retaining brew warmth with an ergonomically carved handle.',
      artisanNote: 'Slow living foundation piece',
    },
    {
      id: 'cart-v-tshirt',
      productId: 'prod-1',
      name: 'Classic T-Shirt',
      category: 'CLOTHING',
      price: 29.99,
      illustration: 'tshirt',
      color: '#2a2a2a',
      top: '28%',
      left: '18%',
      popoverAlign: 'left',
      description: 'Heavyweight organic cotton jersey knit with dropped shoulders and taped collar seams.',
      artisanNote: '100% GOTS Organic Cotton',
    },
    {
      id: 'cart-v-vase',
      productId: 'prod-8',
      name: 'Ceramic Vase',
      category: 'HOME GOODS',
      price: 34.99,
      illustration: 'vase',
      color: '#fcf9f8',
      top: '34%',
      left: '82%',
      popoverAlign: 'right',
      description: 'Sculptural silhouette vase wheel-thrown from local coarse clay, finished with raw tactile texture.',
      artisanNote: 'Focal domestic pottery',
    },
  ], []);

  const handleAddFromEmptyCart = (item: VignetteItem) => {
    const prod = products.find((p) => p.id === item.productId || p.name === item.name);
    if (!prod) return;
    const color = prod.colors[0] || { name: 'Natural', hex: '#25435a' };
    const size = prod.sizes[0] || 'Standard';
    addToCart(prod, color, size, 1);
    setEmptyCartAddedId(item.id);
    setTimeout(() => setEmptyCartAddedId(null), 2500);
  };

  const handleAddStarterBundle = () => {
    emptyCartVignetteItems.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId || p.name === item.name);
      if (prod) {
        const color = prod.colors[0] || { name: 'Natural', hex: '#25435a' };
        const size = prod.sizes[0] || 'Standard';
        addToCart(prod, color, size, 1);
      }
    });
    setIsEmptyCartAllAdded(true);
    setTimeout(() => setIsEmptyCartAllAdded(false), 2800);
  };
  const [shippingAddress, setShippingAddress] = useState<Address>(() => {
    if (user?.address) return user.address;
    return {
      fullName: user?.name || '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
    };
  });

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingCost = isFreeShipping || totalItems === 0 ? 0 : 9.0;
  const estimatedTax = Number((subtotal * 0.08).toFixed(2));
  const orderTotal = (subtotal + shippingCost + estimatedTax).toFixed(2);

  const handleCheckout = () => {
    // If user has edited their address while authenticated, persist to profile
    if (isAuthenticated && isEditingAddress && shippingAddress.street) {
      updateAddress(shippingAddress);
    }

    const finalAddress: Address = {
      fullName: shippingAddress.fullName || user?.name || 'Valued Patron',
      street: shippingAddress.street || '428 Juniper Hill Way',
      city: shippingAddress.city || 'Portland',
      state: shippingAddress.state || 'OR',
      postalCode: shippingAddress.postalCode || shippingAddress.zipCode || '97201',
      country: shippingAddress.country || 'United States',
    };

    const orderItems: OrderItem[] = items.map((item) => ({
      id: item.id,
      productId: item.productId || item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
      illustration: item.illustration,
      imageUrl: item.imageUrl,
    }));

    const customerName = shippingAddress.fullName || (user ? user.name : 'Guest Patron');
    const customerEmail = user ? user.email : 'guest@esondha.atelier';

    const order = createOrder({
      items: orderItems,
      subtotal,
      shippingCost,
      tax: estimatedTax,
      total: Number(orderTotal),
      shippingAddress: finalAddress,
      customerName,
      customerEmail,
      isGuest: !isAuthenticated,
    });

    // Automatically decrement product stock in atelier catalog
    decrementStock(
      items.map((item) => ({
        productId: item.productId || item.id,
        quantity: item.quantity,
      }))
    );

    setPlacedOrder(order);
    setCheckoutCompleted(true);
    clearCart();
  };

  React.useEffect(() => {
    if (user?.address) {
      setShippingAddress(user.address);
    } else if (user) {
      setShippingAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
      }));
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      {/* Main Canvas Container */}
      <main className="page-enter flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-margin py-8 md:py-12">
        {/* Page Header & Progress */}
        <div className="mb-8 border-b border-outline-variant/30 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href="/shop"
                className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 font-label-sm text-xs uppercase font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </Link>
            </div>
            <h1 className="font-display-lg text-3xl sm:text-4xl text-on-surface font-bold tracking-tight">
              Your Cart
            </h1>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} selected for slow living
            </p>
          </div>

          {/* Free Shipping Gauge Bar */}
          <div className="bg-surface-low border border-outline-variant/40 rounded-xl p-4 max-w-md w-full shadow-subtle">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              {isFreeShipping ? (
                <span className="flex items-center gap-1 text-primary">
                  <CheckCircle2 className="w-4 h-4 text-olive" />
                  <span>Free Carbon-Neutral Shipping unlocked</span>
                </span>
              ) : (
                <span className="text-on-surface-variant">
                  Add <strong className="text-primary">${remainingForFreeShipping.toFixed(2)}</strong> for free shipping
                </span>
              )}
              <span className="font-bold text-on-surface">
                ${subtotal.toFixed(2)} / ${freeShippingThreshold.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-surface-high h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isFreeShipping ? 'bg-olive' : 'bg-primary'
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        </div>

        {checkoutCompleted ? (
          <div className="py-12 max-w-2xl mx-auto flex flex-col items-center text-center bg-surface-lowest rounded-2xl border border-outline-variant/30 p-8 sm:p-12 shadow-card my-6">
            <div className="w-16 h-16 rounded-full bg-olive/15 text-olive flex items-center justify-center mb-5">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="font-label-caps text-xs tracking-label-caps uppercase text-olive font-bold mb-1">
              Confirmed &amp; Dispatched to Atelier
            </span>
            <h2 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface mb-3">
              Thank you for choosing slow living.
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant max-w-md mb-6 leading-relaxed">
              Your parcel is being hand-packed with recyclable paperboard, algae ink, and 100% plastic-free cushioning.
            </p>

            {placedOrder ? (
              <div className="w-full bg-surface-low border border-outline-variant/40 rounded-xl p-5 mb-8 text-left text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-outline-variant/25 pb-2">
                  <span className="text-on-surface-variant">Order Number:</span>
                  <span className="font-bold text-primary font-mono text-sm tracking-wider">{placedOrder.orderNumber}</span>
                </div>
                <div className="flex items-center justify-between border-b border-outline-variant/25 pb-2">
                  <span className="text-on-surface-variant">Customer:</span>
                  <span className="font-medium text-on-surface">
                    {placedOrder.customerName} ({placedOrder.customerEmail})
                    {placedOrder.isGuest && (
                      <span className="ml-2 inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-surface-high text-on-surface-variant">
                        Guest Checkout
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-outline-variant/25 pb-2">
                  <span className="text-on-surface-variant">Shipping To:</span>
                  <span className="font-medium text-on-surface text-right max-w-[280px] truncate">
                    {placedOrder.shippingAddress.fullName} · {placedOrder.shippingAddress.street}, {placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.state} {placedOrder.shippingAddress.postalCode}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-on-surface-variant">Total Charged:</span>
                  <span className="font-bold text-base text-primary">${placedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              {placedOrder && (
                <Link
                  href={`/track-order?order=${placedOrder.orderNumber}`}
                  className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-label-caps text-xs tracking-label-caps uppercase rounded-lg hover:bg-primary-container transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  <span>Track This Order</span>
                </Link>
              )}
              {isAuthenticated && (
                <Link
                  href="/account"
                  className="btn-interactive w-full sm:w-auto px-6 py-3 border border-outline-variant text-on-surface hover:bg-surface-high font-label-caps text-xs tracking-label-caps uppercase rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>View in Account</span>
                </Link>
              )}
              <Link
                href="/shop"
                className={`btn-interactive w-full sm:w-auto px-6 py-3 font-label-caps text-xs tracking-label-caps uppercase rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 active:scale-95 ${
                  placedOrder
                    ? 'border border-outline-variant text-on-surface hover:bg-surface-high'
                    : 'bg-primary text-white hover:bg-primary-container'
                }`}
              >
                <span>Explore More Essentials</span>
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="py-8 my-6 space-y-8 animate-in fade-in duration-300">
            {/* Editorial Empty Notice Header */}
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary">
                Atelier Starter Sanctuary
              </span>
              <h2 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                Your Bag is Currently Empty
              </h2>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Begin your slow-living journey with essential everyday pieces. Click any glowing hotspot to explore or add foundation archetypes directly to your bag.
              </p>
            </div>

            {/* Interactive Studio Sanctuary Vignette */}
            <div className="bg-surface-lowest border border-outline-variant/30 rounded-3xl p-4 sm:p-8 shadow-card">
              <VignetteCanvas
                title="Foundational Morning Ritual"
                eyebrow="Sanctuary Capsule · Kyoto Natural Light"
                description="Tactile stoneware, organic GOTS cotton jersey, and sculptural pottery designed to anchor mindful mornings."
                studioTag="Kyoto Natural Light Atelier · 35°N"
                theme="warm-sand"
                items={emptyCartVignetteItems}
                onAddToCart={handleAddFromEmptyCart}
                addedItemId={emptyCartAddedId}
                onAddAll={handleAddStarterBundle}
                addAllLabel="Add 3-Piece Starter Sanctuary"
                isAllAdded={isEmptyCartAllAdded}
                heightClass="h-[350px] sm:h-[410px] md:h-[450px]"
                showCompanionDeck={true}
              />
            </div>

            {/* Direct Link to Full Shop */}
            <div className="text-center pt-2">
              <Link
                href="/shop"
                className="btn-interactive inline-flex items-center gap-2 px-6 py-3 bg-surface-low hover:bg-surface-high border border-outline-variant/40 text-on-surface font-label-caps text-xs tracking-label-caps uppercase rounded-xl font-semibold shadow-subtle active:scale-95 transition-all"
              >
                <span>Browse Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Two-Column Cart Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Cart Items (8 cols) */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
              {/* Member Status Banner */}
              {!isAuthenticated ? (
                <div className="bg-surface-low border border-outline-variant/40 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary shrink-0" />
                    <div className="text-xs text-on-surface-variant">
                      <span className="font-semibold text-on-surface block">Shopping as Guest</span>
                      Sign in to use your saved shipping address and track this order.
                    </div>
                  </div>
                  <Link
                    href="/login?redirect=/cart"
                    className="btn-interactive shrink-0 px-3.5 py-1.5 bg-primary text-white text-xs font-label-caps tracking-label-caps uppercase rounded-md font-semibold hover:bg-primary-container transition-colors active:scale-95"
                  >
                    Sign In
                  </Link>
                </div>
              ) : (
                <div className="bg-olive/10 border border-olive/30 rounded-xl px-4 py-3 flex items-center justify-between text-xs text-on-surface">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-olive animate-pulse" />
                    <span>Logged in as <strong>{user?.name}</strong> ({user?.email})</span>
                  </div>
                  <Link href="/account" className="text-primary font-semibold hover:underline">
                    My Account →
                  </Link>
                </div>
              )}

              <div className="bg-surface-lowest border border-on-surface/15 rounded-xl divide-y divide-outline-variant/25 shadow-subtle overflow-hidden">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 transition-colors duration-150 hover:bg-surface-low/30"
                  >
                    <div className={`w-24 h-24 shrink-0 rounded-lg border border-on-surface/20 flex items-center justify-center p-2 relative group overflow-hidden transition-colors ${
                      isLightColor(item.selectedColor?.hex) ? 'bg-[#eae5df]' : 'bg-surface-low'
                    }`}>
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <ProductIllustration
                          name={item.illustration}
                          color={item.selectedColor?.hex}
                          className="w-16 h-16 stroke-[1.8]"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-headline-md text-base sm:text-lg font-semibold text-on-surface truncate">
                          {item.name}
                        </h3>
                        <span className="font-headline-md text-base sm:text-lg font-bold text-primary ml-4">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-0.5">
                        Color: <span className="font-medium text-on-surface">{item.selectedColor.name}</span> · Size:{' '}
                        <span className="font-medium text-on-surface">{item.selectedSize}</span>
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Selector */}
                        <div className="inline-flex items-center border border-outline-variant/60 rounded-lg bg-surface-lowest">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="btn-interactive w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-low transition-colors active:scale-95"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center font-label-caps text-xs font-bold text-on-surface">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="btn-interactive w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-low transition-colors active:scale-95"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Remove Action */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="btn-interactive font-label-caps text-xs text-on-surface-variant hover:text-red-600 transition-colors flex items-center gap-1.5 uppercase font-semibold active:scale-95"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Address Section */}
              <div className="bg-surface-lowest border border-outline-variant/40 rounded-xl p-5 sm:p-6 shadow-subtle">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <h3 className="font-headline-md text-sm sm:text-base font-bold text-on-surface">
                      Shipping Destination
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{isEditingAddress ? 'Done Editing' : 'Edit Address'}</span>
                  </button>
                </div>

                {isEditingAddress ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-on-surface mb-1">Recipient Full Name</label>
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                        placeholder="e.g. Aria Vance"
                        className="w-full px-3 py-2 bg-surface-low border border-outline-variant/50 rounded-lg text-on-surface outline-none focus:border-primary"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-on-surface mb-1">Street Address</label>
                      <input
                        type="text"
                        value={shippingAddress.street}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                        placeholder="e.g. 428 Juniper Hill Way"
                        className="w-full px-3 py-2 bg-surface-low border border-outline-variant/50 rounded-lg text-on-surface outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-on-surface mb-1">City</label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        placeholder="Portland"
                        className="w-full px-3 py-2 bg-surface-low border border-outline-variant/50 rounded-lg text-on-surface outline-none focus:border-primary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-on-surface mb-1">State / Prov</label>
                        <input
                          type="text"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                          placeholder="OR"
                          className="w-full px-3 py-2 bg-surface-low border border-outline-variant/50 rounded-lg text-on-surface outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-on-surface mb-1">Postal Code</label>
                        <input
                          type="text"
                          value={shippingAddress.postalCode || shippingAddress.zipCode || ''}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value, zipCode: e.target.value })}
                          placeholder="97201"
                          className="w-full px-3 py-2 bg-surface-low border border-outline-variant/50 rounded-lg text-on-surface outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-on-surface-variant flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-on-surface block text-sm">
                        {shippingAddress.fullName || (user ? user.name : 'Valued Patron')}
                      </span>
                      <p className="mt-0.5">
                        {shippingAddress.street ? (
                          `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode || shippingAddress.zipCode || ''}`
                        ) : (
                          <span className="text-outline">428 Juniper Hill Way, Portland, OR 97201 (Default atelier address)</span>
                        )}
                      </p>
                    </div>
                    {isAuthenticated && user?.address && (
                      <span className="text-[11px] font-semibold text-olive bg-olive/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Saved Address
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Eco Assurance Note */}
              <div className="bg-surface-low border border-outline-variant/30 rounded-xl p-5 flex items-center gap-4 text-xs text-on-surface-variant">
                <Leaf className="w-6 h-6 text-olive shrink-0" />
                <p className="leading-relaxed">
                  Every parcel from E Sondha is shipped in 100% recycled paperboard with biodegradable algae-ink stamps. No bubble wrap or virgin plastics used.
                </p>
              </div>
            </div>

            {/* Right Column: Order Summary (4 cols) */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-[90px]">
              <div className="bg-surface-lowest border border-on-surface/15 rounded-xl p-6 sm:p-8 shadow-card flex flex-col gap-5">
                <h3 className="font-headline-lg text-lg font-bold text-on-surface pb-3 border-b border-outline-variant/20">
                  Order Summary
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-semibold text-on-surface">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Carbon-Neutral Shipping</span>
                    <span className="font-semibold text-on-surface">
                      {shippingCost === 0 ? (
                        <span className="text-olive font-bold uppercase text-xs">FREE</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-semibold text-on-surface">${estimatedTax}</span>
                  </div>

                  <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-baseline text-base font-bold text-on-surface">
                    <span>Estimated Total</span>
                    <span className="text-xl text-primary font-bold">${orderTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="btn-interactive w-full mt-2 py-3.5 bg-primary hover:bg-primary-container text-white font-label-caps text-xs tracking-label-caps font-semibold uppercase rounded-lg shadow-subtle flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.98]"
                >
                  <span>{isAuthenticated ? 'Confirm & Place Order' : 'Proceed as Guest'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {!isAuthenticated && (
                  <div className="text-center">
                    <Link
                      href="/login?redirect=/cart"
                      className="text-xs text-primary font-semibold hover:underline"
                    >
                      Sign in for member points &amp; order history
                    </Link>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-outline-variant/15 text-[11px] text-outline">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                    <span>256-Bit SSL Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-primary shrink-0" />
                    <span>30-Day Gentle Return Window</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
