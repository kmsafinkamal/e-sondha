import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ProductProvider } from '@/context/ProductContext';
import { ReviewProvider } from '@/context/ReviewContext';
import { FAQProvider } from '@/context/FAQContext';
import { CartProvider } from '@/context/CartContext';
import { FilterProvider } from '@/context/FilterContext';
import { CartDrawer } from '@/components/CartDrawer';
import { NavigationProgressBar } from '@/components/NavigationProgressBar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'E Sondha | Slow Living Essentials & Minimal Design',
  description: 'Curated lifestyle commerce inspired by Scandinavian functionalism and Japanese understated elegance. Everyday quiet essentials crafted with architectural tranquility.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-surface text-on-surface antialiased min-h-screen flex flex-col font-sans selection:bg-secondary-container selection:text-on-secondary-fixed">
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        <AuthProvider>
          <ProductProvider>
            <ReviewProvider>
              <FAQProvider>
                <CartProvider>
                  <FilterProvider>
                    <CartDrawer />
                    {children}
                  </FilterProvider>
                </CartProvider>
              </FAQProvider>
            </ReviewProvider>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
