'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Leaf,
  ShieldCheck,
  RotateCcw,
  Package,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe,
  Award
} from 'lucide-react';
import { useProducts } from '@/context/ProductContext';

export const Footer: React.FC = () => {
  const { subscribeNewsletter } = useProducts();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    subscribeNewsletter(newsletterEmail.trim(), 'Footer');
    setSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-surface border-t border-outline-variant/30 text-on-surface-variant pt-14 pb-10">
      {/* 1. Top Trust & Value Proposition Strip */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-margin mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-6 px-6 bg-surface-low border border-outline-variant/40 rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-olive/15 text-olive flex items-center justify-center shrink-0 mt-0.5">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-label-caps text-xs tracking-wider uppercase font-bold text-on-surface">
                Carbon Neutral
              </h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                100% offset transit for every atelier parcel
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-label-caps text-xs tracking-wider uppercase font-bold text-on-surface">
                Plastic-Free
              </h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                Algae ink &amp; recycled kraft unboxing
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center shrink-0 mt-0.5">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-label-caps text-xs tracking-wider uppercase font-bold text-on-surface">
                Gentle Returns
              </h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                30 days to live with your essentials
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-fixed flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-label-caps text-xs tracking-wider uppercase font-bold text-on-surface">
                Secure Atelier
              </h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                256-bit encrypted checkout protection
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main 4-Column Navigation Layout */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-margin grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-outline-variant/25">
        {/* Column 1: Brand Ethos (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-display-lg font-bold text-sm shadow-xs">
              ES
            </div>
            <div>
              <span className="font-display-lg text-2xl font-bold text-on-surface tracking-tight block leading-tight">
                E Sondha
              </span>
              <span className="text-[9px] font-semibold tracking-widest text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                Slow Living Goods
              </span>
            </div>
          </div>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-sm">
            Rooted in Japanese restraint and Scandinavian purposeful warmth. We create quiet everyday archetypes designed to outlast seasonal trends and bring intentional calm to your home.
          </p>

          {/* Environmental certification pill row */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-semibold text-on-surface-variant">
            <span className="bg-surface-low border border-outline-variant/30 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Award className="w-3 h-3 text-olive" /> GOTS Organic
            </span>
            <span className="bg-surface-low border border-outline-variant/30 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Globe className="w-3 h-3 text-primary" /> Climate Neutral
            </span>
            <span className="bg-surface-low border border-outline-variant/30 px-2 py-0.5 rounded-md">
              B-Corp Certified
            </span>
          </div>

          <div className="text-xs text-outline flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-olive inline-block" />
            <span>Studio Atelier · Portland, Oregon &amp; Kyoto</span>
          </div>
        </div>

        {/* Column 2: Collections (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-3 text-xs">
          <h5 className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-on-surface">
            Catalog
          </h5>
          <ul className="space-y-2 mt-1">
            <li>
              <Link href="/shop" prefetch={true} className="hover:text-primary transition-colors">
                Full Collection
              </Link>
            </li>
            <li>
              <Link href="/shop?category=CLOTHING" prefetch={true} className="hover:text-primary transition-colors">
                Organic Clothing
              </Link>
            </li>
            <li>
              <Link href="/shop?category=HOME+GOODS" prefetch={true} className="hover:text-primary transition-colors">
                Ceramics &amp; Living
              </Link>
            </li>
            <li>
              <Link href="/shop?category=ACCESSORIES" prefetch={true} className="hover:text-primary transition-colors">
                Acoustic &amp; Carry
              </Link>
            </li>
            <li>
              <Link href="/shop" prefetch={true} className="hover:text-primary transition-colors">
                Bestselling Archetypes
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Customer Care & Concierge (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-3 text-xs">
          <h5 className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-on-surface">
            Concierge &amp; Care
          </h5>
          <ul className="space-y-2 mt-1">
            <li>
              <Link href="/faq" prefetch={true} className="hover:text-primary transition-colors font-medium">
                FAQ &amp; Help Center
              </Link>
            </li>
            <li>
              <Link href="/shipping-returns" prefetch={true} className="hover:text-primary transition-colors font-medium">
                Shipping &amp; Gentle Returns
              </Link>
            </li>
            <li>
              <Link href="/track-order" prefetch={true} className="hover:text-primary transition-colors font-medium flex items-center gap-1">
                <span>Track Atelier Order</span>
                <span className="text-[9px] bg-primary text-white font-bold px-1 rounded uppercase">Live</span>
              </Link>
            </li>
            <li>
              <Link href="/contact" prefetch={true} className="hover:text-primary transition-colors">
                Contact &amp; Studio Inquiries
              </Link>
            </li>
            <li>
              <Link href="/about" prefetch={true} className="hover:text-primary transition-colors">
                Our Story &amp; Philosophy
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter & Member Studio (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <h5 className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-on-surface">
            Slow Living Gazette
          </h5>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Quiet Sunday dispatches on conscious design, atelier journal entries, and private seasonal releases.
          </p>

          {subscribed ? (
            <div className="bg-olive/10 border border-olive/30 rounded-xl p-3 text-xs text-olive flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Welcome to the gazette. You are subscribed.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="patron@example.com"
                required
                className="flex-1 min-w-0 px-3.5 py-2.5 bg-surface-lowest border border-outline-variant/60 rounded-xl text-xs text-on-surface outline-none focus:border-primary placeholder:text-outline/50 shadow-xs"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="btn-interactive px-4 py-2.5 bg-primary hover:bg-primary-container text-white text-xs rounded-xl transition-colors flex items-center justify-center shrink-0 cursor-pointer shadow-subtle active:scale-95"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Member Quick Links */}
          <div className="flex items-center gap-3 pt-3 border-t border-outline-variant/20 text-xs font-semibold">
            <Link href="/account" prefetch={true} className="text-on-surface hover:text-primary transition-colors">
              My Account
            </Link>
            <span className="text-outline/40">·</span>
            <Link href="/login" prefetch={true} className="text-on-surface hover:text-primary transition-colors">
              Sign In
            </Link>
            <span className="text-outline/40">·</span>
            <Link href="/admin" prefetch={true} className="text-primary hover:underline">
              Admin Studio
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal, Payment Provider Badges & Security */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-margin pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-outline">
        <div className="flex items-center gap-2">
          <Lock className="w-3 h-3 text-primary" />
          <span>© {new Date().getFullYear()} E Sondha Slow Goods Atelier. All rights reserved.</span>
        </div>

        {/* Payment Methods */}
        <div className="flex items-center gap-2 text-[10px] font-semibold text-on-surface-variant/80">
          <span className="bg-surface-low border border-outline-variant/30 px-2 py-0.5 rounded">Apple Pay</span>
          <span className="bg-surface-low border border-outline-variant/30 px-2 py-0.5 rounded">Google Pay</span>
          <span className="bg-surface-low border border-outline-variant/30 px-2 py-0.5 rounded">Visa</span>
          <span className="bg-surface-low border border-outline-variant/30 px-2 py-0.5 rounded">Mastercard</span>
          <span className="bg-surface-low border border-outline-variant/30 px-2 py-0.5 rounded">Amex</span>
        </div>

        <div className="flex items-center gap-5 text-[11px]">
          <Link href="/about" className="hover:text-on-surface transition-colors">
            Manifesto
          </Link>
          <Link href="/shipping-returns" className="hover:text-on-surface transition-colors">
            Return Terms
          </Link>
          <Link href="/faq" className="hover:text-on-surface transition-colors">
            Privacy &amp; Care
          </Link>
        </div>
      </div>
    </footer>
  );
};
