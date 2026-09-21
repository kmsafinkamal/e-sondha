'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductIllustration } from '@/components/ProductIllustrations';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types/auth';
import { ProductIllustrationName } from '@/types';
import {
  Package,
  Search,
  Check,
  CheckCircle2,
  Truck,
  MapPin,
  Clock,
  Leaf,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  XCircle
} from 'lucide-react';

interface MockTrackedOrder {
  id: string;
  orderNumber: string;
  status: 'Processing' | 'Packing' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  stepIndex: number; // 0 to 4 (-1 for Cancelled)
  date: string;
  estimatedDelivery: string;
  carrier: string;
  trackingNumber: string;
  carbonOffsetKg: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  items: {
    name: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
    illustration: ProductIllustrationName;
  }[];
}

const DEMO_ORDER: MockTrackedOrder = {
  id: 'ord-demo-101',
  orderNumber: 'ES-89241',
  status: 'In Transit',
  stepIndex: 2,
  date: '2024-05-18',
  estimatedDelivery: 'Thursday, May 23',
  carrier: 'EcoGround Carbon-Neutral Express',
  trackingNumber: 'ECO-89241-PDX',
  carbonOffsetKg: 1.4,
  shippingAddress: {
    fullName: 'Aria Vance',
    street: '428 Juniper Hill Way',
    city: 'Portland',
    state: 'OR',
    postalCode: '97201',
  },
  items: [
    {
      name: 'Classic T-Shirt',
      color: 'Bone White',
      size: 'M',
      quantity: 2,
      price: 29.99,
      illustration: 'tshirt',
    },
    {
      name: 'Ceramic Vase',
      color: 'Speckled Sand',
      size: '18cm',
      quantity: 1,
      price: 34.99,
      illustration: 'vase',
    },
  ],
};

export default function TrackOrderPage() {
  const { allOrders, user } = useAuth();

  const [orderInput, setOrderInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<MockTrackedOrder | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const performLookup = (searchCode: string) => {
    const query = searchCode.trim().toUpperCase();
    if (!query) return;
    setSearchError(null);

    // 1. Check allOrders first, then user.orders
    const match =
      (allOrders || []).find(
        (o) =>
          o.orderNumber.toUpperCase() === query ||
          o.id.toUpperCase() === query ||
          o.orderNumber.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, '')
      ) ||
      (user?.orders || []).find(
        (o) =>
          o.orderNumber.toUpperCase() === query ||
          o.id.toUpperCase() === query ||
          o.orderNumber.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, '')
      );

    if (match) {
      const stepIndex =
        match.status === 'Processing'
          ? 0
          : match.status === 'Shipped'
          ? 2
          : match.status === 'Delivered'
          ? 4
          : match.status === 'Cancelled'
          ? -1
          : 0;

      const statusLabel =
        match.status === 'Processing'
          ? 'Processing'
          : match.status === 'Shipped'
          ? 'In Transit'
          : match.status === 'Delivered'
          ? 'Delivered'
          : match.status === 'Cancelled'
          ? 'Cancelled'
          : 'Processing';

      setTrackedOrder({
        id: match.id,
        orderNumber: match.orderNumber,
        status: statusLabel,
        stepIndex,
        date: match.date,
        estimatedDelivery:
          match.status === 'Cancelled'
            ? 'Cancelled'
            : match.status === 'Delivered'
            ? 'Delivered'
            : '3–5 Business Days',
        carrier: match.carrier || 'EcoGround Carbon-Neutral Express',
        trackingNumber: match.trackingNumber || `ECO-${match.orderNumber.replace(/[^0-9]/g, '')}-PDX`,
        carbonOffsetKg: 1.4,
        shippingAddress: {
          fullName: match.shippingAddress.fullName || match.customerName || 'Valued Patron',
          street: match.shippingAddress.street,
          city: match.shippingAddress.city,
          state: match.shippingAddress.state,
          postalCode: match.shippingAddress.postalCode || '97201',
        },
        items: match.items.map((i) => ({
          name: i.name,
          color: i.selectedColor?.name || 'Natural',
          size: i.selectedSize || 'Standard',
          quantity: i.quantity,
          price: i.price,
          illustration: i.illustration,
        })),
      });
      return;
    }

    // 2. Check if matches demo order
    if (query === 'ES-89241' || query === 'ORD-DEMO-101' || query.includes('89241')) {
      setTrackedOrder(DEMO_ORDER);
      return;
    }

    // 3. Fallback: Generate dynamic simulation for any valid-looking order code
    if (query.length >= 4) {
      setTrackedOrder({
        id: `ord-${query}`,
        orderNumber: query.startsWith('ES-') ? query : `ES-${query}`,
        status: 'In Transit',
        stepIndex: 2,
        date: new Date().toISOString().split('T')[0],
        estimatedDelivery: 'Estimated in 2-3 days',
        carrier: 'Carbon-Neutral Ground Courier',
        trackingNumber: `ECO-${query}-OR`,
        carbonOffsetKg: 1.5,
        shippingAddress: {
          fullName: 'Valued Patron',
          street: '1420 Franklin Street',
          city: 'Portland',
          state: 'OR',
          postalCode: '97201',
        },
        items: [
          {
            name: 'Slow Living Essential',
            color: 'Natural Canvas',
            size: 'Standard',
            quantity: 1,
            price: 48.0,
            illustration: 'totebag',
          },
        ],
      });
      return;
    }

    setSearchError('Could not find order. Please verify your order number (e.g. ES-89241).');
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const initialCode =
        params.get('orderNumber') ||
        params.get('order') ||
        params.get('number') ||
        params.get('id');
      const email = params.get('email') || (user ? user.email : '');
      if (email) {
        setEmailInput(email);
      }
      if (initialCode) {
        setOrderInput(initialCode);
        performLookup(initialCode);
      }
    }
  }, [allOrders, user]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(orderInput);
  };

  const handleFillDemo = () => {
    setOrderInput('ES-89241');
    setEmailInput('aria@esondha.com');
    setTrackedOrder(DEMO_ORDER);
    setSearchError(null);
  };

  const STEPS = [
    { label: 'Order Placed', desc: 'Received at atelier' },
    { label: 'Artisan Packaging', desc: 'Hand-packed plastic-free' },
    { label: 'Carbon-Neutral Transit', desc: 'In carrier network' },
    { label: 'Out for Delivery', desc: 'Arriving today' },
    { label: 'Delivered', desc: 'In your sanctuary' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      <main className="page-enter flex-1 w-full max-w-4xl mx-auto px-5 sm:px-6 md:px-margin py-10 sm:py-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary block mb-2">
            ATELIER LOGISTICS
          </span>
          <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl font-bold text-on-surface tracking-tight">
            Track Your Order
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-3 leading-relaxed">
            Follow the journey of your mindful essentials from our Portland workshop to your doorstep in real-time.
          </p>
        </div>

        {/* Tracking Lookup Box */}
        <div className="bg-surface-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-8 shadow-card mb-12">
          <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Order Identifier (e.g. ES-89241)
              </label>
              <input
                type="text"
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                placeholder="ES-89241"
                required
                className="w-full px-4 py-2.5 bg-surface-low border border-outline-variant/60 rounded-xl text-xs sm:text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Patron Email Address
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="patron@example.com"
                className="w-full px-4 py-2.5 bg-surface-low border border-outline-variant/60 rounded-xl text-xs sm:text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>

            <div className="sm:col-span-12 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleFillDemo}
                className="btn-interactive text-xs text-primary font-semibold hover:underline flex items-center gap-1 active:scale-95"
              >
                <span>Sample Demo Order (ES-89241)</span>
              </button>

              <button
                type="submit"
                className="btn-interactive w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary-container text-white text-xs font-label-caps tracking-label-caps uppercase font-semibold rounded-xl shadow-subtle flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Track Parcel</span>
              </button>
            </div>
          </form>

          {searchError && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {/* Quick links for logged-in users with orders */}
          {user && user.orders && user.orders.length > 0 && (
            <div className="mt-6 pt-4 border-t border-outline-variant/20 text-xs">
              <span className="text-outline block mb-2">Recent purchases on your account:</span>
              <div className="flex flex-wrap gap-2">
                {user.orders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => {
                      setOrderInput(ord.orderNumber);
                      setEmailInput(user.email);
                      handleTrack({ preventDefault: () => {} } as any);
                    }}
                    className="btn-interactive px-3 py-1.5 bg-surface-low hover:bg-surface-high border border-outline-variant/40 rounded-lg text-[11px] font-semibold text-primary transition-colors active:scale-95"
                  >
                    {ord.orderNumber} ({ord.date})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Milestone Tracking Results */}
        {trackedOrder && (
          <div className="page-enter bg-surface-lowest border border-on-surface/15 rounded-2xl p-6 sm:p-10 shadow-card space-y-8">
            {/* Top Status Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-outline-variant/30 gap-4">
              <div>
                <span className="font-label-caps text-[11px] tracking-wider uppercase text-outline block">
                  ORDER IDENTIFIER
                </span>
                <h3 className="font-display-lg text-2xl font-bold text-primary font-mono mt-0.5">
                  {trackedOrder.orderNumber}
                </h3>
                <span className="text-xs text-on-surface-variant block mt-1">
                  Placed on {trackedOrder.date} · Expected Delivery: <strong>{trackedOrder.estimatedDelivery}</strong>
                </span>
              </div>

              <div className="flex flex-col items-start sm:items-end">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    trackedOrder.status === 'Cancelled'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-olive/15 text-olive'
                  }`}
                >
                  {trackedOrder.status === 'Cancelled' ? (
                    <XCircle className="w-3.5 h-3.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>{trackedOrder.status}</span>
                </span>
                <span className="text-[11px] text-outline mt-1.5 font-mono">
                  Carrier: {trackedOrder.carrier}
                </span>
              </div>
            </div>

            {/* Timeline or Cancelled State */}
            {trackedOrder.status === 'Cancelled' ? (
              <div className="p-5 bg-red-50/70 border border-red-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-headline-md text-sm font-bold text-red-900">
                      Order Has Been Cancelled
                    </h4>
                    <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                      This atelier order was cancelled and will not be prepared or dispatched. Any processed payment has been automatically queued for full refund.
                    </p>
                  </div>
                </div>
                <Link
                  href="/shop"
                  className="btn-interactive shrink-0 px-4 py-2 bg-primary text-white text-xs font-label-caps uppercase font-semibold rounded-xl hover:bg-primary-container transition-all shadow-subtle active:scale-95"
                >
                  Explore Catalog
                </Link>
              </div>
            ) : (
              /* 5-Step Visual Progress Stepper */
              <div>
                <h4 className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-on-surface mb-6">
                  Transit Journey Timeline
                </h4>

                <div className="relative">
                  {/* Connecting Line */}
                  <div className="hidden sm:block absolute top-5 left-6 right-6 h-0.5 bg-surface-high z-0">
                    <div
                      className="h-full bg-primary transition-all duration-700"
                      style={{
                        width: `${(Math.max(0, trackedOrder.stepIndex) / (STEPS.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Steps Nodes */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                    {STEPS.map((step, idx) => {
                      const isCompleted = idx <= trackedOrder.stepIndex;
                      const isCurrent = idx === trackedOrder.stepIndex;
                      return (
                        <div
                          key={step.label}
                          className="flex sm:flex-col items-center sm:items-center text-left sm:text-center gap-3 sm:gap-2"
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-xs transition-all ${
                              isCompleted
                                ? 'bg-primary text-white shadow-subtle'
                                : 'bg-surface-low border border-outline-variant/60 text-outline'
                            } ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}`}
                          >
                            {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                          </div>
                          <div>
                            <span
                              className={`font-label-caps text-xs tracking-wider uppercase block ${
                                isCompleted ? 'font-bold text-on-surface' : 'text-outline'
                              }`}
                            >
                              {step.label}
                            </span>
                            <span className="text-[11px] text-on-surface-variant block mt-0.5">
                              {step.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Environmental & Carbon Offset Guarantee */}
            <div className="p-4 bg-olive/10 border border-olive/30 rounded-xl flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <Leaf className="w-5 h-5 text-olive shrink-0" />
                <div>
                  <span className="font-bold text-on-surface block">
                    Certified 100% Carbon-Neutral Transit
                  </span>
                  <span className="text-on-surface-variant">
                    {trackedOrder.carbonOffsetKg} kg CO2e neutralized through verified Pacific Northwest reforestation.
                  </span>
                </div>
              </div>
              <span className="font-mono text-[11px] font-bold text-olive uppercase shrink-0 hidden sm:inline-block">
                VERIFIED
              </span>
            </div>

            {/* Order Items & Shipping Address Details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-outline-variant/20">
              {/* Items in parcel (7 cols) */}
              <div className="md:col-span-7 space-y-3">
                <h4 className="font-headline-md text-sm font-bold text-on-surface mb-2">
                  Atelier Package Contents ({trackedOrder.items.length})
                </h4>
                <div className="divide-y divide-outline-variant/20">
                  {trackedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-surface-low border border-outline-variant/30 flex items-center justify-center p-1 shrink-0">
                        <ProductIllustration
                          name={item.illustration}
                          className="w-8 h-8 stroke-[#1a1a1a] stroke-[1.6] fill-none"
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-xs">
                        <h5 className="font-semibold text-on-surface truncate">{item.name}</h5>
                        <p className="text-on-surface-variant text-[11px]">
                          {item.color} · {item.size} · Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destination Address (5 cols) */}
              <div className="md:col-span-5 bg-surface-low rounded-xl p-5 border border-outline-variant/30 space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h4 className="font-headline-md text-sm font-bold text-on-surface">
                    Delivery Destination
                  </h4>
                </div>
                <div className="text-on-surface-variant space-y-1">
                  <span className="font-semibold text-on-surface block text-sm">
                    {trackedOrder.shippingAddress.fullName}
                  </span>
                  <p>{trackedOrder.shippingAddress.street}</p>
                  <p>
                    {trackedOrder.shippingAddress.city}, {trackedOrder.shippingAddress.state} {trackedOrder.shippingAddress.postalCode}
                  </p>
                </div>
                <div className="pt-2 border-t border-outline-variant/20 text-[11px] text-outline flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  <span>Plastic-free signature unboxing</span>
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
