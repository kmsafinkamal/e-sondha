'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  RotateCcw,
  Search
} from 'lucide-react';
import { Product, ProductColor, CategoryType, BadgeVariant, ProductIllustrationName } from '@/types';
import { ProductFormData } from '@/types/admin';
import {
  ProductIllustration,
  isLightColor,
  ALL_ILLUSTRATION_ITEMS,
  IllustrationCategoryItem
} from '@/components/ProductIllustrations';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData, id?: string) => void;
  initialProduct?: Product | null;
}

const PRESET_COLORS: ProductColor[] = [
  { name: 'Bone White', hex: '#fcf9f8' },
  { name: 'Charcoal', hex: '#2a2a2a' },
  { name: 'Slate Blue', hex: '#476274' },
  { name: 'Terracotta', hex: '#ba674d' },
  { name: 'Olive', hex: '#59634d' },
  { name: 'Cream', hex: '#f4ede4' },
  { name: 'Deep Indigo', hex: '#25435a' },
  { name: 'Chalk White', hex: '#ffffff' },
];

type SymbolCategoryTab = 'all' | 'apparel' | 'carry' | 'ceramics' | 'home' | 'tech';

const SYMBOL_CATEGORIES: { id: SymbolCategoryTab; label: string; count: number }[] = [
  { id: 'all', label: 'All Symbols', count: ALL_ILLUSTRATION_ITEMS.length },
  { id: 'apparel', label: 'Apparel & Wear', count: ALL_ILLUSTRATION_ITEMS.filter(i => i.category === 'apparel').length },
  { id: 'carry', label: 'Footwear & Carry', count: ALL_ILLUSTRATION_ITEMS.filter(i => i.category === 'carry').length },
  { id: 'ceramics', label: 'Ceramics & Table', count: ALL_ILLUSTRATION_ITEMS.filter(i => i.category === 'ceramics').length },
  { id: 'home', label: 'Home & Studio', count: ALL_ILLUSTRATION_ITEMS.filter(i => i.category === 'home').length },
  { id: 'tech', label: 'Tech & Personal', count: ALL_ILLUSTRATION_ITEMS.filter(i => i.category === 'tech').length },
];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: 'CLOTHING',
    price: 29.99,
    originalPrice: undefined,
    rating: 5.0,
    reviewCount: 12,
    badgeVariant: 'none',
    badgeText: '',
    colors: [{ name: 'Bone White', hex: '#fcf9f8' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: '',
    details: ['100% GOTS Organic Cotton', 'Ethically produced'],
    inStock: true,
    stockQuantity: 20,
    illustration: 'tshirt',
    imageUrl: undefined,
  });

  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#25435a');
  const [sizesInput, setSizesInput] = useState('XS, S, M, L, XL');
  const [detailsInput, setDetailsInput] = useState('Ethically produced\nPre-shrunk organic fabric');
  const [imageUrlInput, setImageUrlInput] = useState('');

  const [symbolSearchQuery, setSymbolSearchQuery] = useState('');
  const [symbolCategory, setSymbolCategory] = useState<SymbolCategoryTab>('all');

  const activeColorHex = formData.colors[0]?.hex || '#25435a';
  const activeColorName = formData.colors[0]?.name || 'Primary Color';

  const filteredIllustrations = useMemo(() => {
    return ALL_ILLUSTRATION_ITEMS.filter((item) => {
      const matchCategory = symbolCategory === 'all' || item.category === symbolCategory;
      const q = symbolSearchQuery.trim().toLowerCase();
      const matchQuery =
        q === '' ||
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [symbolCategory, symbolSearchQuery]);

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name,
        category: initialProduct.category,
        price: initialProduct.price,
        originalPrice: initialProduct.originalPrice,
        rating: initialProduct.rating,
        reviewCount: initialProduct.reviewCount,
        badgeVariant: initialProduct.badge?.variant || 'none',
        badgeText: initialProduct.badge?.text || '',
        colors: initialProduct.colors,
        sizes: initialProduct.sizes,
        description: initialProduct.description,
        details: initialProduct.details,
        inStock: initialProduct.inStock,
        stockQuantity: initialProduct.stockQuantity !== undefined ? initialProduct.stockQuantity : 15,
        illustration: initialProduct.illustration,
        imageUrl: initialProduct.imageUrl,
      });
      setSizesInput(initialProduct.sizes.join(', '));
      setDetailsInput(initialProduct.details.join('\n'));
      setImageUrlInput(initialProduct.imageUrl || '');
    } else {
      setFormData({
        name: '',
        category: 'CLOTHING',
        price: 29.99,
        originalPrice: undefined,
        rating: 5.0,
        reviewCount: 1,
        badgeVariant: 'none',
        badgeText: '',
        colors: [{ name: 'Bone White', hex: '#fcf9f8' }],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        description: '',
        details: ['Ethically produced', 'Slow living certified'],
        inStock: true,
        stockQuantity: 25,
        illustration: 'tshirt',
        imageUrl: undefined,
      });
      setSizesInput('XS, S, M, L, XL');
      setDetailsInput('Ethically produced\nSlow living certified');
      setImageUrlInput('');
    }
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const handleAddColor = () => {
    if (newColorName.trim()) {
      setFormData({
        ...formData,
        colors: [...formData.colors, { name: newColorName.trim(), hex: newColorHex }],
      });
      setNewColorName('');
    }
  };

  const handleRemoveColor = (index: number) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((_, i) => i !== index),
    });
  };

  const handlePresetColorClick = (color: ProductColor) => {
    if (!formData.colors.some((c) => c.name.toLowerCase() === color.name.toLowerCase())) {
      setFormData({
        ...formData,
        colors: [...formData.colors, color],
      });
    }
  };

  // Image Upload Handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
        setImageUrlInput('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrlApply = () => {
    if (imageUrlInput.trim()) {
      setFormData((prev) => ({ ...prev, imageUrl: imageUrlInput.trim() }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: undefined }));
    setImageUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Stock Quantity input handler
  const handleStockChange = (newQty: number) => {
    const safeQty = Math.max(0, newQty);
    setFormData((prev) => ({
      ...prev,
      stockQuantity: safeQty,
      inStock: safeQty > 0 ? prev.inStock : false,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedSizes = sizesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedDetails = detailsInput
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    const dataToSave: ProductFormData = {
      ...formData,
      sizes: parsedSizes.length > 0 ? parsedSizes : ['Standard'],
      details: parsedDetails.length > 0 ? parsedDetails : ['Slow crafted'],
      inStock: formData.stockQuantity > 0 ? formData.inStock : false,
      imageUrl: formData.imageUrl?.trim() ? formData.imageUrl.trim() : undefined,
    };

    onSave(dataToSave, initialProduct?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 sticky top-0 bg-surface-lowest z-10">
          <div>
            <h2 className="font-display-lg text-lg sm:text-xl font-bold text-on-surface">
              {initialProduct ? 'Edit Catalog Item' : 'Upload New Catalog Item'}
            </h2>
            <p className="text-xs text-on-surface-variant">
              Configure product imagery, line-art symbol, stock quantity, pricing, and variants.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-high transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Row 1: Title, Category, and Inventory */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-5">
              <label className="block font-label-caps text-xs tracking-label-caps font-semibold uppercase text-on-surface-variant mb-1.5">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Stoneware Ceramic Teapot"
                className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-label-caps text-xs tracking-label-caps font-semibold uppercase text-on-surface-variant mb-1.5">
                Department *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="CLOTHING">CLOTHING</option>
                <option value="HOME GOODS">HOME GOODS</option>
                <option value="ACCESSORIES">ACCESSORIES</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-label-caps text-xs tracking-label-caps font-semibold uppercase text-on-surface-variant mb-1.5">
                Quantity *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={formData.stockQuantity}
                onChange={(e) => handleStockChange(parseInt(e.target.value) || 0)}
                className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg px-3 py-2 text-sm font-bold text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="sm:col-span-2 flex flex-col justify-end">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, inStock: !formData.inStock })}
                disabled={formData.stockQuantity === 0}
                className={`py-2 px-2.5 rounded-lg text-xs font-semibold uppercase transition-colors border text-center ${
                  formData.stockQuantity === 0
                    ? 'bg-red-50 text-red-700 border-red-200 cursor-not-allowed opacity-80'
                    : formData.inStock
                    ? 'bg-olive/15 text-olive border-olive/30 hover:bg-olive/25'
                    : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                }`}
              >
                {formData.stockQuantity === 0 ? 'Sold Out' : formData.inStock ? 'In Stock' : 'Out Stock'}
              </button>
            </div>
          </div>

          {/* Row 2: Price, Original Price, Rating, Review Count */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-label-caps text-xs tracking-label-caps font-semibold uppercase text-on-surface-variant mb-1.5">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-label-caps text-xs tracking-label-caps font-semibold uppercase text-on-surface-variant mb-1.5">
                Original Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.originalPrice || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    originalPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                placeholder="Optional"
                className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-label-caps text-xs tracking-label-caps font-semibold uppercase text-on-surface-variant mb-1.5">
                Rating (1-5)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 5 })}
                className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-label-caps text-xs tracking-label-caps font-semibold uppercase text-on-surface-variant mb-1.5">
                Reviews Count
              </label>
              <input
                type="number"
                min="0"
                value={formData.reviewCount}
                onChange={(e) => setFormData({ ...formData, reviewCount: parseInt(e.target.value) || 0 })}
                className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Row 3: Product Photo Upload Along with Symbol */}
          <div className="bg-surface-low border border-outline-variant/40 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-label-caps text-xs tracking-label-caps font-semibold uppercase text-primary block">
                  Product Visuals: Photo &amp; Symbol
                </span>
                <p className="text-xs text-on-surface-variant">
                  You can upload a product photograph from your device or link a URL, along with choosing the symbolic line-art archetype.
                </p>
              </div>
              {formData.imageUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Remove Photo</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              {/* Photo Upload Zone */}
              <div className="sm:col-span-7 space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-outline-variant hover:border-primary rounded-xl p-4 text-center cursor-pointer transition-colors bg-surface-lowest flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-primary block">
                      Click to upload image file from your device
                    </span>
                    <span className="text-[11px] text-outline">
                      PNG, JPG, WEBP, or GIF (auto-converts for instant offline storage)
                    </span>
                  </div>
                </div>

                {/* External URL alternative */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-3.5 h-3.5 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      placeholder="Or paste an image web URL..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg pl-8 pr-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleImageUrlApply}
                    className="px-3 py-1.5 bg-surface-high hover:bg-surface border border-outline-variant/50 text-on-surface text-xs font-semibold rounded-lg transition-colors shrink-0"
                  >
                    Apply URL
                  </button>
                </div>
              </div>

              {/* Live Visual Preview (Side-by-Side Photo + Symbol) */}
              <div className="sm:col-span-5 flex items-center justify-center gap-4 bg-surface-lowest border border-outline-variant/30 rounded-xl p-4">
                {formData.imageUrl ? (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-outline-variant/40 bg-surface-low shrink-0">
                    <img
                      src={formData.imageUrl}
                      alt="Uploaded Preview"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-bold uppercase text-center py-0.5">
                      Photo
                    </span>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-lg border border-dashed border-outline-variant/50 bg-surface-low flex flex-col items-center justify-center text-outline text-[10px] text-center p-2 shrink-0">
                    <ImageIcon className="w-6 h-6 mb-1 text-outline/50" />
                    <span>No Photo Uploaded</span>
                  </div>
                )}

                <div className="flex flex-col items-center">
                  <div className={`w-24 h-24 rounded-xl border flex items-center justify-center p-2 shrink-0 transition-all shadow-xs ${
                    isLightColor(formData.colors[0]?.hex)
                      ? 'bg-[#ede7df] border-[#c8bfb4]'
                      : 'bg-[#f5f2ee] border-[#d8d3cb]'
                  }`}>
                    <ProductIllustration
                      name={formData.illustration}
                      color={formData.colors[0]?.hex || '#25435a'}
                      className="w-16 h-16 stroke-[1.8]"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-primary mt-1 uppercase tracking-wider">
                    {formData.illustration}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Vector Line-Art Illustration Selector (115+ Symbols, Dynamic Color, Search & Categories) */}
          <div className="bg-surface-low border border-outline-variant/40 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/20 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-label-caps text-xs tracking-label-caps font-semibold uppercase text-primary">
                    Select Vector Line-Art Symbol (115+ Unique Designs) *
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                    {ALL_ILLUSTRATION_ITEMS.length} Available
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Vector line-art archetype dynamically adapts its strokes and fills to your active product color.
                </p>
              </div>

              {/* Live Color Feedback Swatch */}
              <div className="flex items-center gap-2 bg-surface-lowest border border-outline-variant/30 rounded-lg px-2.5 py-1 text-xs shrink-0 self-start sm:self-auto">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs shrink-0"
                  style={{ backgroundColor: activeColorHex }}
                />
                <span className="text-on-surface font-semibold text-[11px] truncate max-w-[120px]">
                  {activeColorName}
                </span>
                <span className="text-[10px] font-mono text-outline">
                  {activeColorHex}
                </span>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {SYMBOL_CATEGORIES.map((tab) => {
                const isActive = symbolCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSymbolCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-surface-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface border border-outline-variant/40'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-surface-high text-outline'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search 115+ symbols by name (e.g. matcha, jacket, bonsai, camera, sneakers)..."
                value={symbolSearchQuery}
                onChange={(e) => setSymbolSearchQuery(e.target.value)}
                className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg pl-8.5 pr-8 py-2 text-xs text-on-surface focus:outline-none focus:border-primary placeholder:text-outline/70"
              />
              {symbolSearchQuery && (
                <button
                  type="button"
                  onClick={() => setSymbolSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-0.5 rounded-full cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Symbols Gallery Grid (Scrollable) */}
            {filteredIllustrations.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {filteredIllustrations.map((item) => {
                  const isSelected = formData.illustration === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, illustration: item.id })}
                      className={`relative p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all group cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-primary/10 ring-2 ring-primary ring-offset-2 shadow-sm'
                          : 'border-outline-variant/30 bg-surface-lowest hover:bg-surface hover:border-outline-variant text-on-surface-variant shadow-2xs'
                      }`}
                      title={`${item.name} (${item.categoryLabel})`}
                    >
                      {isSelected && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center shadow-xs">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                      <ProductIllustration
                        name={item.id}
                        color={activeColorHex}
                        className="w-10 h-10 stroke-[1.8] mb-1.5 transition-transform group-hover:scale-110"
                      />
                      <span
                        className={`text-[10px] truncate max-w-full text-center ${
                          isSelected ? 'font-bold text-primary' : 'font-medium text-on-surface'
                        }`}
                      >
                        {item.name}
                      </span>
                      <span className="text-[9px] text-outline truncate max-w-full">
                        {item.categoryLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-surface-lowest border border-dashed border-outline-variant/50 rounded-xl space-y-2">
                <Search className="w-6 h-6 text-outline/50 mx-auto" />
                <p className="text-xs text-outline">
                  No line-art symbols found matching &ldquo;{symbolSearchQuery}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSymbolSearchQuery('');
                    setSymbolCategory('all');
                  }}
                  className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                >
                  Clear search &amp; view all 115 symbols
                </button>
              </div>
            )}

            {/* Selected Symbol Footer Ribbon */}
            <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1 border-t border-outline-variant/20">
              <span>
                Selected: <strong className="text-primary font-bold capitalize">{formData.illustration}</strong>
              </span>
              <span className="text-outline">
                Showing {filteredIllustrations.length} of {ALL_ILLUSTRATION_ITEMS.length} symbols
              </span>
            </div>
          </div>

          {/* Row 5: Badge Ribbon Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-caps text-xs tracking-label-caps font-semibold uppercase text-on-surface-variant mb-1.5">
                Badge Style
              </label>
              <select
                value={formData.badgeVariant}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    badgeVariant: e.target.value as BadgeVariant | 'none',
                    badgeText:
                      e.target.value === 'none'
                        ? ''
                        : formData.badgeText || e.target.value.toUpperCase(),
                  })
                }
                className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="none">None (No Badge)</option>
                <option value="bestseller">BESTSELLER (Deep Slate)</option>
                <option value="organic">ORGANIC (Olive Green)</option>
                <option value="popular">POPULAR (Steel Slate)</option>
                <option value="new">NEW (Primary Blue)</option>
                <option value="limited">LIMITED (Terracotta)</option>
                <option value="eco">ECO (Neutral Mist)</option>
                <option value="handmade">HANDMADE (Secondary Container)</option>
                <option value="featured">FEATURED (Primary Accent)</option>
              </select>
            </div>

            <div>
              <label className="block font-label-caps text-xs tracking-label-caps font-semibold uppercase text-on-surface-variant mb-1.5">
                Badge Text
              </label>
              <input
                type="text"
                disabled={formData.badgeVariant === 'none'}
                value={formData.badgeText}
                onChange={(e) => setFormData({ ...formData, badgeText: e.target.value.toUpperCase() })}
                placeholder="e.g. BESTSELLER"
                className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm text-on-surface focus:outline-none focus:border-primary disabled:opacity-50 disabled:bg-surface-high uppercase"
              />
            </div>
          </div>

          {/* Row 6: Workable Colors Management */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-label-caps text-xs tracking-label-caps font-semibold uppercase text-on-surface-variant">
                Color Variants ({formData.colors.length})
              </label>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-outline">Add Preset:</span>
                {PRESET_COLORS.slice(0, 5).map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handlePresetColorClick(preset)}
                    title={`Add ${preset.name}`}
                    style={{ backgroundColor: preset.hex }}
                    className="w-4 h-4 rounded-full border border-black/20 hover:scale-110 transition-transform"
                  />
                ))}
              </div>
            </div>

            {/* Current Active Colors List */}
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.colors.map((col, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-surface-lowest border border-outline-variant/40 px-2.5 py-1 rounded-full text-xs"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span className="font-medium text-on-surface">{col.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(idx)}
                    className="text-outline hover:text-red-500 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Color Input */}
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-9 h-9 p-0.5 rounded border border-outline-variant/50 bg-surface-lowest cursor-pointer shrink-0"
              />
              <input
                type="text"
                placeholder="Color Name (e.g. Mineral Gray)"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="flex-1 bg-surface-lowest border border-outline-variant/50 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-3 py-1.5 bg-secondary hover:bg-secondary-container hover:text-on-secondary-fixed text-white font-label-caps text-xs tracking-label-caps uppercase rounded-lg transition-colors font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Row 7: Sizes & Dimensions */}
          <div>
            <label className="block font-label-caps text-xs tracking-label-caps font-semibold uppercase text-on-surface-variant mb-1.5">
              Available Sizes / Dimensions (Comma Separated)
            </label>
            <input
              type="text"
              required
              value={sizesInput}
              onChange={(e) => setSizesInput(e.target.value)}
              placeholder="e.g. XS, S, M, L, XL or 320ml, 450ml"
              className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          {/* Row 8: Narrative Description */}
          <div>
            <label className="block font-label-caps text-xs tracking-label-caps font-semibold uppercase text-on-surface-variant mb-1.5">
              Editorial Product Story *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mindful design narrative, organic materials, tactile properties..."
              className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm text-on-surface focus:outline-none focus:border-primary resize-y"
            />
          </div>

          {/* Row 9: Craftsmanship & Material Details */}
          <div>
            <label className="block font-label-caps text-xs tracking-label-caps font-semibold uppercase text-on-surface-variant mb-1.5">
              Craftsmanship Bullet Points (One per line)
            </label>
            <textarea
              rows={3}
              value={detailsInput}
              onChange={(e) => setDetailsInput(e.target.value)}
              placeholder="100% GOTS Organic Cotton&#10;Hand-thrown in small batches&#10;Plastic-free recyclable packaging"
              className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm text-on-surface focus:outline-none focus:border-primary resize-y"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-end gap-3 sticky bottom-0 bg-surface py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-outline-variant/40 text-on-surface-variant hover:bg-surface-high font-label-caps text-xs tracking-label-caps uppercase transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary hover:bg-primary-container text-white font-label-caps text-xs tracking-label-caps uppercase font-semibold rounded-lg shadow-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{initialProduct ? 'Save Changes' : 'Publish Item'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
