'use client';

import React from 'react';
import { ShoppingBag, Leaf, Sparkles, X, Check, RotateCcw } from 'lucide-react';
import { useFilters } from '@/context/FilterContext';
import { useProducts } from '@/context/ProductContext';
import { CategoryType } from '@/types';
import {
  CURATED_COLOR_PALETTES,
  productMatchesColor,
  categorizeSize,
  getAvailableSizesForCategory,
  SizeGroup,
} from '@/utils/filterUtils';

export const Sidebar: React.FC = () => {
  const { products } = useProducts();
  const {
    selectedCategory,
    setSelectedCategory,
    maxPrice,
    setMaxPrice,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    inStockOnly,
    setInStockOnly,
    resetFilters,
    isMobileFilterOpen,
    setIsMobileFilterOpen,
    activeFilterCount,
  } = useFilters();

  // Compute highest price dynamically
  const maxPossiblePrice = React.useMemo(() => {
    if (!products || products.length === 0) return 150;
    const highest = Math.max(...products.map((p) => p.price));
    return Math.max(150, Math.ceil(highest / 10) * 10);
  }, [products]);

  // Check if any product has an artisan custom color not covered by the 6 curated palettes
  const customPaletteColors = React.useMemo(() => {
    const customMap = new Map<string, string>();
    products.forEach((p) => {
      p.colors?.forEach((c) => {
        if (c && c.name) {
          const matchesAny = CURATED_COLOR_PALETTES.some((palette) =>
            palette.keywords.some((kw) => c.name.toLowerCase().includes(kw))
          );
          if (!matchesAny && !customMap.has(c.name.toLowerCase())) {
            customMap.set(c.name.toLowerCase(), c.hex || '#555555');
          }
        }
      });
    });
    return Array.from(customMap.entries()).map(([name, hex]) => ({
      id: name,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      hex,
      isLight: hex === '#ffffff' || hex === '#f4ede4' || hex === '#fcf9f8',
      keywords: [name.toLowerCase()],
    }));
  }, [products]);

  const allPalettes = React.useMemo(() => {
    return [...CURATED_COLOR_PALETTES, ...customPaletteColors];
  }, [customPaletteColors]);

  // Item counts per color palette within currently selected department
  const colorCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    const relevantProducts =
      selectedCategory === 'ALL' ? products : products.filter((p) => p.category === selectedCategory);

    allPalettes.forEach((palette) => {
      counts[palette.name] = relevantProducts.filter((p) =>
        productMatchesColor(p, palette.name)
      ).length;
    });
    return counts;
  }, [products, selectedCategory, allPalettes]);

  // Category-aware sizes categorized into Apparel, Footwear, and Dimensions
  const availableSizes = React.useMemo(() => {
    return getAvailableSizesForCategory(products, selectedCategory);
  }, [products, selectedCategory]);

  const availableTabs = React.useMemo(() => {
    const tabs: { id: SizeGroup; label: string; count: number }[] = [];
    if (availableSizes.apparel.length > 0) {
      tabs.push({ id: 'apparel', label: 'Apparel', count: availableSizes.apparel.length });
    }
    if (availableSizes.shoes.length > 0) {
      tabs.push({ id: 'shoes', label: 'Footwear', count: availableSizes.shoes.length });
    }
    if (availableSizes.dimensions.length > 0) {
      tabs.push({ id: 'dimensions', label: 'Dimensions', count: availableSizes.dimensions.length });
    }
    return tabs;
  }, [availableSizes]);

  const [activeSizeTab, setActiveSizeTab] = React.useState<SizeGroup>('apparel');

  // If a size is selected, ensure the tab containing that size is active
  React.useEffect(() => {
    if (selectedSize) {
      const group = categorizeSize(selectedSize);
      setActiveSizeTab(group);
    }
  }, [selectedSize]);

  // If activeSizeTab is not available in current category, auto-switch to first available tab
  React.useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.some((t) => t.id === activeSizeTab)) {
      setActiveSizeTab(availableTabs[0].id);
    }
  }, [availableTabs, activeSizeTab]);

  // Mobile drawer animation state
  const [isMobileRendered, setIsMobileRendered] = React.useState(false);
  const [isMobileVisible, setIsMobileVisible] = React.useState(false);

  React.useEffect(() => {
    if (isMobileFilterOpen) {
      setIsMobileRendered(true);
      const timer = setTimeout(() => setIsMobileVisible(true), 16);
      return () => clearTimeout(timer);
    } else {
      setIsMobileVisible(false);
      const timer = setTimeout(() => setIsMobileRendered(false), 320);
      return () => clearTimeout(timer);
    }
  }, [isMobileFilterOpen]);

  const categories: { label: CategoryType; icon: React.ReactNode }[] = [
    { label: 'ALL', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { label: 'CLOTHING', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { label: 'HOME GOODS', icon: <Leaf className="w-3.5 h-3.5" /> },
    { label: 'ACCESSORIES', icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  const sidebarContent = (
    <div className="flex flex-col min-h-full">
      {/* Curation Category Navigation */}
      <div className="flex flex-col gap-2 py-6 px-4">
        <div className="px-2 pb-1">
          <p className="font-label-sm text-[11px] text-tertiary-fixed/60 uppercase tracking-widest font-semibold">
            Departments
          </p>
        </div>

        {categories.map((cat) => {
          const isActive = selectedCategory === cat.label;
          return (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat.label)}
              className={`btn-interactive flex items-center justify-between px-4 py-2.5 rounded-full font-label-caps text-xs tracking-label-caps active:scale-[0.98] transition-all text-left ${
                isActive
                  ? 'bg-white/20 text-white font-bold shadow-sm'
                  : 'text-tertiary-fixed border-b border-outline-variant/15 font-medium hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-tertiary-fixed group-hover:text-white">{cat.icon}</span>
            </button>
          );
        })}
      </div>

      {/* Refined Filter Controls Section */}
      <div className="px-5 py-4 flex flex-col gap-6 border-t border-outline-variant/20 flex-1">
        {/* Price Range Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-caps text-xs tracking-label-caps text-tertiary-fixed uppercase font-semibold">
              Price Range
            </span>
            <span className="font-label-sm text-xs text-white font-medium">
              $10 – ${maxPrice}
            </span>
          </div>
          <input
            type="range"
            min="10"
            max={maxPossiblePrice}
            step="5"
            value={Math.min(maxPrice, maxPossiblePrice)}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <div className="flex justify-between text-tertiary-fixed/70 font-label-sm text-[11px] mt-1.5">
            <span>$10</span>
            <span>${maxPossiblePrice}</span>
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="font-label-caps text-xs tracking-label-caps text-tertiary-fixed uppercase font-semibold">
                Color Palette
              </span>
              {selectedColor && (
                <span className="text-[10px] text-white/90 bg-white/15 px-1.5 py-0.5 rounded font-medium">
                  Active
                </span>
              )}
            </div>
            {selectedColor && (
              <button
                type="button"
                onClick={() => setSelectedColor(null)}
                className="text-[11px] text-tertiary-fixed/70 hover:text-white transition-colors cursor-pointer underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-6 gap-2">
            {allPalettes.map((col) => {
              const isSelected = selectedColor?.toLowerCase() === col.name.toLowerCase();
              const count = colorCounts[col.name] ?? 0;
              return (
                <button
                  key={col.id || col.name}
                  type="button"
                  onClick={() => setSelectedColor(isSelected ? null : col.name)}
                  aria-label={`Filter by ${col.name} (${count} available)`}
                  title={`${col.name} (${count} available)`}
                  className="group relative flex flex-col items-center justify-center cursor-pointer p-0.5"
                >
                  <div
                    style={{ backgroundColor: col.hex }}
                    className={`w-7 h-7 rounded-full transition-all duration-200 flex items-center justify-center ${
                      col.isLight ? 'border border-black/25' : ''
                    } ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-offset-primary ring-white scale-110 shadow-sm'
                        : 'ring-1 ring-white/25 group-hover:scale-110 group-hover:ring-white/60'
                    }`}
                  >
                    {isSelected && (
                      <Check
                        className={`w-3.5 h-3.5 stroke-[3] ${
                          col.isLight ? 'text-stone-900' : 'text-white'
                        }`}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Color Feedback Pill */}
          {selectedColor && (
            <div className="mt-2.5 px-2.5 py-1 rounded bg-white/10 border border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-white font-medium truncate pr-2">
                {selectedColor}
              </span>
              <span className="text-tertiary-fixed/70 font-mono text-[10px] shrink-0">
                {colorCounts[selectedColor] ?? 0} item{colorCounts[selectedColor] === 1 ? '' : 's'}
              </span>
            </div>
          )}
        </div>

        {/* Size & Fit Options */}
        {availableTabs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="font-label-caps text-xs tracking-label-caps text-tertiary-fixed uppercase font-semibold">
                  Size &amp; Fit
                </span>
                {selectedSize && (
                  <span className="text-[10px] text-white/90 bg-white/15 px-1.5 py-0.5 rounded font-medium">
                    Active
                  </span>
                )}
              </div>
              {selectedSize && (
                <button
                  type="button"
                  onClick={() => setSelectedSize(null)}
                  className="text-[11px] text-tertiary-fixed/70 hover:text-white transition-colors cursor-pointer underline"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Segmented Group Tabs (shown if more than 1 size group exists in current view) */}
            {availableTabs.length > 1 && (
              <div className="flex bg-white/10 rounded-lg p-0.5 mb-2.5">
                {availableTabs.map((tab) => {
                  const isActive = activeSizeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveSizeTab(tab.id)}
                      className={`flex-1 py-1 text-center font-label-sm text-[11px] rounded-md transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white text-primary font-bold shadow-sm'
                          : 'text-tertiary-fixed/80 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Active Tab Buttons: Apparel */}
            {activeSizeTab === 'apparel' && (
              <div className="grid grid-cols-5 gap-1.5">
                {availableSizes.apparel.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(isSelected ? null : size)}
                      className={`py-1.5 text-center font-label-sm text-xs rounded transition-all cursor-pointer font-medium ${
                        isSelected
                          ? 'bg-white text-primary font-bold shadow-sm'
                          : 'bg-white/10 text-tertiary-fixed border border-white/15 hover:border-white hover:text-white hover:bg-white/15'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Active Tab Buttons: Shoes */}
            {activeSizeTab === 'shoes' && (
              <div className="grid grid-cols-6 gap-1.5">
                {availableSizes.shoes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(isSelected ? null : size)}
                      className={`py-1.5 text-center font-label-sm text-xs rounded transition-all cursor-pointer font-mono font-medium ${
                        isSelected
                          ? 'bg-white text-primary font-bold shadow-sm'
                          : 'bg-white/10 text-tertiary-fixed border border-white/15 hover:border-white hover:text-white hover:bg-white/15'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Active Tab Buttons: Dimensions */}
            {activeSizeTab === 'dimensions' && (
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto custom-scrollbar pr-0.5">
                {availableSizes.dimensions.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(isSelected ? null : size)}
                      className={`px-2.5 py-1 text-center font-label-sm text-xs rounded-full transition-all cursor-pointer font-medium whitespace-nowrap ${
                        isSelected
                          ? 'bg-white text-primary font-bold shadow-sm'
                          : 'bg-white/10 text-tertiary-fixed border border-white/15 hover:border-white hover:text-white hover:bg-white/15'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* In Stock Only Toggle */}
        <div className="flex items-center justify-between py-1 border-t border-outline-variant/20 pt-4">
          <span className="font-label-caps text-xs tracking-label-caps text-tertiary-fixed uppercase font-semibold">
            In Stock Only
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={inStockOnly}
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`w-9 h-5 rounded-full relative transition-colors focus:outline-none ${
              inStockOnly ? 'bg-secondary-container' : 'bg-white/20'
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full absolute top-0.5 transition-transform ${
                inStockOnly
                  ? 'bg-primary-container right-1'
                  : 'bg-white left-1'
              }`}
            />
          </button>
        </div>

        {/* Active Filters Summary */}
        {activeFilterCount > 0 && (
          <div>
            <span className="font-label-caps text-xs tracking-label-caps text-tertiary-fixed uppercase font-semibold block mb-2">
              Active Filters
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedCategory !== 'ALL' && (
                <span className="inline-flex items-center gap-1 font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white border border-outline-variant/30">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('ALL')} className="hover:text-red-300">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {maxPrice < maxPossiblePrice && (
                <span className="inline-flex items-center gap-1 font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white border border-outline-variant/30">
                  Up to ${maxPrice}
                  <button onClick={() => setMaxPrice(maxPossiblePrice)} className="hover:text-red-300">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedColor && (
                <span className="inline-flex items-center gap-1 font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white border border-outline-variant/30">
                  Color: {selectedColor}
                  <button onClick={() => setSelectedColor(null)} className="hover:text-red-300">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedSize && (
                <span className="inline-flex items-center gap-1 font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white border border-outline-variant/30">
                  Size: {selectedSize}
                  <button onClick={() => setSelectedSize(null)} className="hover:text-red-300">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white border border-outline-variant/30">
                  In Stock
                  <button onClick={() => setInStockOnly(false)} className="hover:text-red-300">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Reset Filters Button */}
        <button
          onClick={resetFilters}
          className="btn-interactive mt-2 w-full py-2 font-label-caps text-xs tracking-label-caps text-tertiary-fixed hover:text-white border border-outline-variant/30 rounded text-center active:scale-95 transition-all hover:bg-white/5 flex items-center justify-center gap-1.5 uppercase font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>

        {/* Slow living curation philosophy snippet */}
        <div className="mt-auto pt-6 border-t border-outline-variant/10 px-1 hidden md:block">
          <span className="font-label-sm text-[11px] text-tertiary-fixed/70 uppercase font-semibold">
            Curation Philosophy
          </span>
          <p className="font-body-md text-tertiary-fixed/80 mt-1 text-xs leading-relaxed">
            Everyday quiet objects tuned to sensory balance, natural materiality, and architectural tranquility.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Static Sidebar (240px) */}
      <aside className="hidden md:block w-60 shrink-0 bg-primary border-r border-outline-variant/20 sticky top-0 h-screen overflow-y-auto z-30 custom-scrollbar">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileRendered && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm drawer-backdrop cursor-pointer ${
              isMobileVisible ? 'drawer-backdrop-open' : ''
            }`}
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer Body */}
          <div
            className={`relative w-80 max-w-[85vw] bg-primary h-full overflow-y-auto z-10 flex flex-col shadow-2xl drawer-panel-left ${
              isMobileVisible ? 'drawer-panel-left-open' : ''
            }`}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/20">
              <span className="font-display-lg text-lg text-white font-bold tracking-tight">
                Filters & Categories
              </span>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="btn-interactive p-1.5 text-tertiary-fixed hover:text-white active:scale-90 rounded-full"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
