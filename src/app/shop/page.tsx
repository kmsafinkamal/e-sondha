'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { ProductGrid } from '@/components/ProductGrid';
import { Footer } from '@/components/Footer';

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      {/* Split View Container: Left Static Deep Slate Sidebar + Fluid Off-White Main Canvas */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-full">
        <Sidebar />
        <main className="page-enter flex-1 flex flex-col">
          <ProductGrid />
        </main>
      </div>

      <Footer />
    </div>
  );
}
