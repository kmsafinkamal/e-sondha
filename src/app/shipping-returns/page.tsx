'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useProducts } from '@/context/ProductContext';
import {
  Truck,
  RotateCcw,
  Leaf,
  ShieldCheck,
  Package,
  ArrowRight,
  Clock,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export default function ShippingReturnsPage() {
  const { storeSettings } = useProducts();
  const threshold = storeSettings?.freeShippingThreshold ?? 100;

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      <main className="page-enter flex-1 w-full max-w-5xl mx-auto px-5 sm:px-6 md:px-margin py-10 sm:py-16">
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary block mb-2">
            ATELIER TRANSPARENCY
          </span>
          <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl font-bold text-on-surface tracking-tight">
            Shipping &amp; Gentle Returns
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-3 leading-relaxed">
            Mindfully packed with zero virgin plastics and certified carbon-offset transit. Live with our archetypes for 30 days to ensure they suit your everyday rituals.
          </p>
        </div>

        {/* 4 Trust Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          <div className="bg-surface-lowest border border-outline-variant/35 rounded-2xl p-5 text-center flex flex-col items-center shadow-subtle">
            <div className="w-10 h-10 rounded-full bg-olive/15 text-olive flex items-center justify-center mb-3">
              <Leaf className="w-5 h-5" />
            </div>
            <h4 className="font-headline-md text-sm font-bold text-on-surface">100% Carbon-Neutral</h4>
            <p className="text-[11px] text-on-surface-variant mt-1">Every mile certified &amp; offset</p>
          </div>

          <div className="bg-surface-lowest border border-outline-variant/35 rounded-2xl p-5 text-center flex flex-col items-center shadow-subtle">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-headline-md text-sm font-bold text-on-surface">Free Over ${threshold}</h4>
            <p className="text-[11px] text-on-surface-variant mt-1">Automatic at checkout</p>
          </div>

          <div className="bg-surface-lowest border border-outline-variant/35 rounded-2xl p-5 text-center flex flex-col items-center shadow-subtle">
            <div className="w-10 h-10 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h4 className="font-headline-md text-sm font-bold text-on-surface">30-Day Gentle Trial</h4>
            <p className="text-[11px] text-on-surface-variant mt-1">Hassle-free full refunds</p>
          </div>

          <div className="bg-surface-lowest border border-outline-variant/35 rounded-2xl p-5 text-center flex flex-col items-center shadow-subtle">
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-fixed flex items-center justify-center mb-3">
              <Package className="w-5 h-5" />
            </div>
            <h4 className="font-headline-md text-sm font-bold text-on-surface">Plastic-Free Unboxing</h4>
            <p className="text-[11px] text-on-surface-variant mt-1">Recycled kraft &amp; algae ink</p>
          </div>
        </div>

        {/* Section 1: Shipping Matrix */}
        <section className="mb-16">
          <div className="mb-6">
            <span className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary block mb-1">
              DELIVERY SCHEDULES
            </span>
            <h2 className="font-display-lg text-2xl font-bold text-on-surface">
              Transit Options &amp; Destinations
            </h2>
          </div>

          <div className="bg-surface-lowest border border-outline-variant/35 rounded-2xl overflow-hidden shadow-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-surface-low border-b border-outline-variant/30 text-on-surface font-semibold">
                    <th className="p-4">Destination</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Estimated Transit</th>
                    <th className="p-4">Atelier Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 text-on-surface-variant">
                  <tr>
                    <td className="p-4 font-bold text-on-surface">North America (Domestic)</td>
                    <td className="p-4">Carbon-Neutral Ground</td>
                    <td className="p-4">3–5 Business Days</td>
                    <td className="p-4">
                      <span className="font-bold text-olive">FREE over ${threshold}</span>
                      <span className="text-outline block text-[11px]">$9 flat under ${threshold}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-on-surface">Expedited Atelier</td>
                    <td className="p-4">Priority Air Courier</td>
                    <td className="p-4">1–2 Business Days</td>
                    <td className="p-4 font-bold text-on-surface">$18 flat rate</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-on-surface">Europe &amp; United Kingdom</td>
                    <td className="p-4">International Green Freight</td>
                    <td className="p-4">5–8 Business Days</td>
                    <td className="p-4 font-bold text-on-surface">$22 flat rate</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-on-surface">Asia-Pacific &amp; Rest of World</td>
                    <td className="p-4">Worldwide Postal Transit</td>
                    <td className="p-4">7–12 Business Days</td>
                    <td className="p-4 font-bold text-on-surface">$28 flat rate</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-surface-low/50 border-t border-outline-variant/20 text-[11px] text-outline flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <span>Orders placed before 1:00 PM PST are packaged and dispatched the same day from our Portland atelier.</span>
            </div>
          </div>
        </section>

        {/* Section 2: Zero-Plastic Packaging Protocol */}
        <section className="mb-16">
          <div className="mb-6">
            <span className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary block mb-1">
              CIRCULAR STANDARDS
            </span>
            <h2 className="font-display-lg text-2xl font-bold text-on-surface">
              Zero-Virgin-Plastic Unboxing
            </h2>
            <p className="text-xs text-on-surface-variant mt-1 max-w-xl">
              Every parcel leaving E Sondha is crafted to be returned to the earth without toxic residues.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-lowest border border-outline-variant/35 rounded-xl p-5 shadow-subtle">
              <h4 className="font-headline-md text-sm font-bold text-on-surface mb-1">
                100% Recycled Kraft Paperboard
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Post-consumer corrugated cartons made from unbleached fibers that break down completely in household compost within 90 days.
              </p>
            </div>

            <div className="bg-surface-lowest border border-outline-variant/35 rounded-xl p-5 shadow-subtle">
              <h4 className="font-headline-md text-sm font-bold text-on-surface mb-1">
                Living Algae Ink Branding
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                We avoid petroleum-based heavy metal inks. All stamps and typography use carbon-negative algae pigment.
              </p>
            </div>

            <div className="bg-surface-lowest border border-outline-variant/35 rounded-xl p-5 shadow-subtle">
              <h4 className="font-headline-md text-sm font-bold text-on-surface mb-1">
                Water-Activated Starch Tape
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Reinforced fiberglass-free kraft tape activated with natural cornstarch water adhesive—no plastic tape strips.
              </p>
            </div>

            <div className="bg-surface-lowest border border-outline-variant/35 rounded-xl p-5 shadow-subtle">
              <h4 className="font-headline-md text-sm font-bold text-on-surface mb-1">
                Pure Wood-Cellulose Cushioning
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Ceramics and delicate goods are cushioned with expanded wood honeycomb kraft, eliminating plastic bubble wrap entirely.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: 30-Day Gentle Return Process */}
        <section className="mb-16">
          <div className="mb-6">
            <span className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary block mb-1">
              PEACE OF MIND
            </span>
            <h2 className="font-display-lg text-2xl font-bold text-on-surface">
              The 30-Day Gentle Trial Portal
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-surface-lowest border border-outline-variant/30 rounded-2xl p-6 relative shadow-subtle">
              <span className="font-display-lg text-3xl font-bold text-primary/20 block mb-2">01</span>
              <h4 className="font-headline-md text-sm font-bold text-on-surface mb-1">Live With It</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Experience the piece in your space for up to 30 days in unwashed, natural condition.
              </p>
            </div>

            <div className="bg-surface-lowest border border-outline-variant/30 rounded-2xl p-6 relative shadow-subtle">
              <span className="font-display-lg text-3xl font-bold text-primary/20 block mb-2">02</span>
              <h4 className="font-headline-md text-sm font-bold text-on-surface mb-1">Request Label</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Email concierge or use your account dashboard to generate a free pre-paid return label.
              </p>
            </div>

            <div className="bg-surface-lowest border border-outline-variant/30 rounded-2xl p-6 relative shadow-subtle">
              <span className="font-display-lg text-3xl font-bold text-primary/20 block mb-2">03</span>
              <h4 className="font-headline-md text-sm font-bold text-on-surface mb-1">Gentle Repack</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Place items back in their recyclable paper carton and seal with paper tape.
              </p>
            </div>

            <div className="bg-surface-lowest border border-outline-variant/30 rounded-2xl p-6 relative shadow-subtle">
              <span className="font-display-lg text-3xl font-bold text-primary/20 block mb-2">04</span>
              <h4 className="font-headline-md text-sm font-bold text-on-surface mb-1">Full Refund</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Refunds are issued to your original payment within 48 hours of atelier arrival.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="bg-surface-low border border-outline-variant/40 rounded-2xl p-8 text-center flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h3 className="font-headline-md text-lg font-bold text-on-surface">
              Already have an atelier order in transit?
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Look up your package milestone status in real-time with your Order ID.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/track-order"
              className="btn-interactive px-6 py-3 bg-primary hover:bg-primary-container text-white font-label-caps text-xs tracking-label-caps uppercase font-semibold rounded-lg shadow-subtle transition-colors flex items-center gap-2 active:scale-95"
            >
              <span>Track Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/shop"
              className="btn-interactive px-6 py-3 bg-surface-lowest border border-outline-variant/50 text-on-surface hover:bg-surface-high font-label-caps text-xs tracking-label-caps uppercase font-semibold rounded-lg transition-colors active:scale-95"
            >
              Shop Catalog
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
