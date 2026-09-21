'use client';

import React from 'react';
import Link from 'next/link';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Leaf,
  Sparkles,
  Lock
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import { ProductIllustration, isLightColor } from './ProductIllustrations';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    addToCart,
    subtotal,
    totalItems,
    freeShippingThreshold,
    isFreeShipping,
    freeShippingProgress,
  } = useCart();

  const { products } = useProducts();

  // Smooth enter & exit transition state
  const [isRendered, setIsRendered] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [removingId, setRemovingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isCartOpen) {
      setIsRendered(true);
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 16);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 320);
      return () => clearTimeout(timer);
    }
  }, [isCartOpen]);

  if (!isRendered) return null;

  const handleRemoveItem = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);
    }, 180);
  };

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingCost = isFreeShipping || totalItems === 0 ? 0 : 9.0;
  const estimatedTax = Number((subtotal * 0.08).toFixed(2));
  const orderTotal = (subtotal + shippingCost + estimatedTax).toFixed(2);

  // Recommendations: complementary items not yet in bag
  const recommendations = products
    .filter((p) => !items.some((i) => i.productId === p.id || i.name === p.name) && p.inStock)
    .slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm drawer-backdrop cursor-pointer ${
          isVisible ? 'drawer-backdrop-open' : ''
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-over Drawer Panel */}
      <div
        className={`relative w-full max-w-md bg-surface h-full shadow-drawer z-10 flex flex-col justify-between overflow-hidden drawer-panel-right ${
          isVisible ? 'drawer-panel-right-open' : ''
        }`}
      >
        {/* 1. Drawer Header */}
        <div className="px-6 py-5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-low">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display-lg text-lg font-bold text-on-surface leading-tight">
                Your Atelier Bag
              </h2>
              <span className="text-xs text-on-surface-variant">
                {totalItems} {totalItems === 1 ? 'essential' : 'essentials'} selected
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-outline hover:text-on-surface rounded-full hover:bg-surface-high transition-colors cursor-pointer"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Free Shipping Gauge Bar */}
        <div className="px-6 py-3.5 bg-surface-lowest border-b border-outline-variant/20">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            {isFreeShipping ? (
              <span className="flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Free Carbon-Neutral Shipping Unlocked!</span>
              </span>
            ) : (
              <span className="text-on-surface-variant">
                Add <strong className="text-primary font-bold">${remainingForFreeShipping.toFixed(2)}</strong> more for free shipping
              </span>
            )}
            <span className="text-on-surface font-bold text-[11px]">
              ${subtotal.toFixed(2)} / ${freeShippingThreshold.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-surface-high h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFreeShipping ? 'bg-emerald-600' : 'bg-primary'
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* 3. Items List / Empty State */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-surface-low border border-outline-variant/30 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-outline/50" />
              </div>
              <h3 className="font-headline-md text-base font-bold text-on-surface mb-1">
                Your bag is empty
              </h3>
              <p className="font-body-md text-xs text-on-surface-variant max-w-xs mb-6 leading-relaxed">
                Discover our curated slow-living essentials designed for perpetual daily rotation.
              </p>
              <Link
                href="/shop"
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-3 bg-primary text-white text-xs font-label-caps tracking-label-caps font-semibold uppercase rounded-xl hover:bg-primary-container transition-colors shadow-subtle"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex gap-4 p-4 rounded-xl bg-surface-lowest border border-outline-variant/30 shadow-xs transition-all duration-200 ${
                    removingId === item.id
                      ? 'opacity-0 scale-95 -translate-x-4 pointer-events-none'
                      : 'opacity-100 scale-100'
                  }`}
                >
                  {/* Thumbnail */}
                  <div
                    className={`w-20 h-20 rounded-lg shrink-0 flex items-center justify-center p-1 border overflow-hidden ${
                      isLightColor(item.selectedColor?.hex)
                        ? 'bg-[#ede8e2] border-outline-variant/40'
                        : 'bg-surface-low border-outline-variant/20'
                    }`}
                  >
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <ProductIllustration
                        name={item.illustration}
                        color={item.selectedColor?.hex}
                        className="w-12 h-12 stroke-[1.6]"
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-body-lg text-xs sm:text-sm font-semibold text-on-surface truncate">
                          {item.name}
                        </h4>
                        <span className="font-headline-md text-xs sm:text-sm font-bold text-primary ml-2">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">
                        {item.selectedColor?.name} · {item.selectedSize}
                      </p>
                    </div>

                    {/* Quantity & Remove controls */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/15">
                      <div className="inline-flex items-center border border-outline-variant/40 rounded-lg bg-surface-low overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-high active:scale-90 transition-all cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-on-surface select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-high active:scale-90 transition-all cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-[11px] text-outline hover:text-red-600 active:scale-95 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* 4. In-Drawer Cross-Sell Suggestions */}
              {recommendations.length > 0 && (
                <div className="pt-3 border-t border-outline-variant/20 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="font-label-caps text-[10px] uppercase font-bold text-outline tracking-wider">
                      Pairs Beautifully With
                    </span>
                  </div>

                  <div className="space-y-2">
                    {recommendations.map((rec) => (
                      <div
                        key={rec.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-surface-lowest border border-outline-variant/30 hover:border-primary transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-surface-low border border-outline-variant/20 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                            {rec.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={rec.imageUrl}
                                alt=""
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <ProductIllustration
                                name={rec.illustration}
                                color={rec.colors[0]?.hex}
                                className="w-6 h-6"
                              />
                            )}
                          </div>
                          <div className="truncate">
                            <span className="font-semibold text-xs text-on-surface block truncate">
                              {rec.name}
                            </span>
                            <span className="text-[11px] text-on-surface-variant font-medium">
                              ${rec.price.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => addToCart(rec, rec.colors[0], rec.sizes[0], 1)}
                          className="btn-interactive px-3 py-1.5 bg-surface-low hover:bg-primary hover:text-white text-on-surface border border-outline-variant/40 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 5. Drawer Footer & Checkout Action */}
        {items.length > 0 && (
          <div className="p-6 bg-surface-low border-t border-outline-variant/30 flex flex-col gap-3">
            <div className="space-y-1.5 text-xs text-on-surface-variant">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-on-surface">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Carbon-Neutral Transit</span>
                <span className="font-semibold text-on-surface">
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-on-surface">${estimatedTax}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-on-surface pt-2 border-t border-outline-variant/20 mt-1">
                <span>Total</span>
                <span className="text-base text-primary font-display-lg">${orderTotal}</span>
              </div>
            </div>

            <Link
              href="/cart"
              prefetch={true}
              onClick={() => setIsCartOpen(false)}
              className="btn-interactive w-full mt-2 py-3.5 bg-primary hover:bg-primary-container text-white font-label-caps text-xs tracking-label-caps font-semibold uppercase rounded-xl shadow-card flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Review Bag &amp; Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Trust and Payment Security Badges */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-outline pt-1 text-center">
              <span className="flex items-center gap-1">
                <Leaf className="w-3 h-3 text-olive" /> Plastic-Free
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-primary" /> 256-Bit SSL
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-outline" /> Encrypted
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
