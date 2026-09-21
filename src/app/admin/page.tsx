'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Settings,
  Plus,
  Edit3,
  Trash2,
  Search,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  DollarSign,
  Layers,
  Sparkles,
  Eye,
  EyeOff,
  Save,
  Lock,
  Unlock,
  KeyRound,
  Truck,
  Clock,
  LogOut,
  User as UserIcon,
  Check,
  Ban,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  FileText,
  Boxes,
  AlertCircle,
  Copy,
  Download,
  FileSpreadsheet,
  Star,
  MessageSquare,
  ThumbsUp,
  HelpCircle,
  LayoutDashboard,
  LayoutGrid,
  List,
  Bell,
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
  ExternalLink,
  Activity,
  Command,
  ShoppingBag,
  BarChart3,
  Mail,
  Users,
  Send,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import { useReviews } from '@/context/ReviewContext';
import { useFAQ } from '@/context/FAQContext';
import { Product, ProductReview } from '@/types';
import { Order } from '@/types/auth';
import { FAQItem, FAQCategory, FAQStatus } from '@/types/faq';
import { ProductFormData, StoreSettings, Inquiry, NewsletterSubscriber, LookbookCapsule } from '@/types/admin';
import { ProductIllustration } from '@/components/ProductIllustrations';
import { ProductModal } from '@/components/admin/ProductModal';
import { OrderInspectModal } from '@/components/admin/OrderInspectModal';

type AdminTab = 'dashboard' | 'catalog' | 'orders' | 'reviews' | 'faqs' | 'inquiries' | 'subscribers' | 'lookbook' | 'curator' | 'settings' | 'metrics';
type OrderStatusFilter = 'ALL' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

const ADMIN_STORAGE_KEY = 'esondha_admin_authorized_v1';

export default function AdminPage() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStockQuantity,
    storeSettings,
    updateStoreSettings,
    updateLookbookCapsules,
    resetToDefaults,
    inquiries,
    updateInquiryStatus,
    replyToInquiry,
    deleteInquiry,
    unreadInquiriesCount,
    subscribers,
    deleteSubscriber,
    totalSubscribersCount,
  } = useProducts();

  const { allOrders, updateOrderStatus } = useAuth();
  const { reviews, addAdminReply, deleteReview } = useReviews();
  const {
    faqs,
    publishedFaqs,
    pendingFaqs,
    pendingCount,
    answerQuestion,
    createFAQ,
    updateFAQ,
    deleteFAQ,
  } = useFAQ();

  const activePasscode = storeSettings.adminPassword || 'admin2026';

  // Authentication & Security State
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showLockPasscode, setShowLockPasscode] = useState(false);

  // Tab & Filter States
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  type StockFilter = 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'SOLD_OUT';
  const [selectedStockFilter, setSelectedStockFilter] = useState<StockFilter>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Enterprise Layout & View States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [catalogViewMode, setCatalogViewMode] = useState<'grid' | 'table'>('table');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [isNotificationFlyoutOpen, setIsNotificationFlyoutOpen] = useState(false);
  const [isQuickActionMenuOpen, setIsQuickActionMenuOpen] = useState(false);

  // Orders Tab States
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatusFilter>('ALL');
  type OrderSortOption = 'newest' | 'oldest' | 'highest-total' | 'lowest-total';
  const [orderSort, setOrderSort] = useState<OrderSortOption>('newest');
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);

  // Reviews Tab States
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [reviewStarFilter, setReviewStarFilter] = useState<number | 'ALL'>('ALL');
  const [reviewProductFilter, setReviewProductFilter] = useState<string>('ALL');
  const [replyModalReview, setReplyModalReview] = useState<ProductReview | null>(null);
  const [replyDraftText, setReplyDraftText] = useState('');
  const [replyAuthorName, setReplyAuthorName] = useState('E Sondha Studio Curator');

  // Atelier FAQs Tab States
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [faqCategoryFilter, setFaqCategoryFilter] = useState<string>('ALL');
  const [faqStatusFilter, setFaqStatusFilter] = useState<'ALL' | 'pending' | 'published'>('ALL');
  type FAQSortOption = 'unanswered-first' | 'newest' | 'oldest' | 'most-helpful';
  const [faqSort, setFaqSort] = useState<FAQSortOption>('unanswered-first');

  // FAQ Modal States
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [answerDraft, setAnswerDraft] = useState('');
  const [questionDraft, setQuestionDraft] = useState('');
  const [categoryDraft, setCategoryDraft] = useState<FAQCategory>('general');
  const [publishImmediate, setPublishImmediate] = useState(true);

  const [isCreateFaqModalOpen, setIsCreateFaqModalOpen] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newAnswerText, setNewAnswerText] = useState('');
  const [newCategory, setNewCategory] = useState<FAQCategory>('general');
  const [newPublishStatus, setNewPublishStatus] = useState<FAQStatus>('published');

  // Patron Inquiries Tab States
  const [inquirySearchQuery, setInquirySearchQuery] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<'ALL' | 'unread' | 'read' | 'replied'>('ALL');
  const [replyModalInquiry, setReplyModalInquiry] = useState<Inquiry | null>(null);
  const [inquiryReplyDraft, setInquiryReplyDraft] = useState('');

  // Subscribers Tab States
  const [subscriberSearchQuery, setSubscriberSearchQuery] = useState('');
  const [subscriberCopied, setSubscriberCopied] = useState(false);

  // Lookbook Capsule Management States
  const [isCapsuleModalOpen, setIsCapsuleModalOpen] = useState(false);
  const [editingCapsule, setEditingCapsule] = useState<LookbookCapsule | null>(null);
  const [capsuleTitle, setCapsuleTitle] = useState('');
  const [capsuleEyebrow, setCapsuleEyebrow] = useState('');
  const [capsuleDescription, setCapsuleDescription] = useState('');
  const [capsuleStudioTag, setCapsuleStudioTag] = useState('');
  const [capsuleTheme, setCapsuleTheme] = useState<LookbookCapsule['theme']>('warm-sand');
  const [capsuleProductIds, setCapsuleProductIds] = useState<[string, string, string]>(['prod-1', 'prod-3', 'prod-8']);
  const [capsuleEnabled, setCapsuleEnabled] = useState(true);
  const [capsuleShowOnHome, setCapsuleShowOnHome] = useState(true);
  const [capsuleShowOnShop, setCapsuleShowOnShop] = useState(true);

  // Settings form state
  const [tempSettings, setTempSettings] = useState<StoreSettings>(storeSettings);
  const [selectedCuratorToAdd, setSelectedCuratorToAdd] = useState<string>('');

  useEffect(() => {
    setTempSettings(storeSettings);
  }, [storeSettings]);

  // Password update form state
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showNewPasscode, setShowNewPasscode] = useState(false);
  const [showConfirmPasscode, setShowConfirmPasscode] = useState(false);
  const [passcodeMsg, setPasscodeMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Check existing session authorization
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored === 'true') {
        setIsAuthorized(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  // Global Shortcut for Command Palette & Esc Dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsNotificationFlyoutOpen(false);
        setIsQuickActionMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update tempSettings when storeSettings loads/changes
  useEffect(() => {
    setTempSettings(storeSettings);
  }, [storeSettings]);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 2800);
  };

  const handleAuthorize = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    if (passcodeInput.trim() === activePasscode) {
      setIsAuthorized(true);
      try {
        sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      } catch (err) {
        console.error(err);
      }
      showToast('Staff clearance verified. Welcome to Atelier Admin.');
    } else {
      setAuthError('Incorrect studio keycode. Please verify and try again.');
    }
  };

  const handleFillDemoPasscode = () => {
    setPasscodeInput(activePasscode);
    setAuthError(null);
  };

  const handleLockStudio = () => {
    try {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch (err) {
      console.error(err);
    }
    setIsAuthorized(false);
    setPasscodeInput('');
    showToast('Admin session locked.');
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (data: ProductFormData, id?: string) => {
    if (id) {
      updateProduct(id, {
        name: data.name,
        category: data.category === 'ALL' ? 'CLOTHING' : (data.category as any),
        price: data.price,
        originalPrice: data.originalPrice,
        rating: data.rating,
        reviewCount: data.reviewCount,
        badge:
          data.badgeVariant && data.badgeVariant !== 'none' && data.badgeText
            ? { text: data.badgeText, variant: data.badgeVariant }
            : undefined,
        colors: data.colors,
        sizes: data.sizes,
        description: data.description,
        details: data.details,
        inStock: data.inStock,
        stockQuantity: data.stockQuantity,
        illustration: data.illustration,
        imageUrl: data.imageUrl,
      });
      showToast(`"${data.name}" updated successfully.`);
    } else {
      addProduct(data);
      showToast(`"${data.name}" published to catalog.`);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the catalog?`)) {
      deleteProduct(id);
      showToast(`"${name}" removed from catalog.`);
    }
  };

  const handleToggleStock = (product: Product) => {
    const nextInStock = !product.inStock;
    updateProduct(product.id, {
      inStock: nextInStock,
      stockQuantity: nextInStock ? (product.stockQuantity && product.stockQuantity > 0 ? product.stockQuantity : 10) : 0,
    });
    showToast(`"${product.name}" marked as ${nextInStock ? 'In Stock' : 'Out of Stock'}.`);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(tempSettings);
    showToast('Store settings saved successfully.');
  };

  const handleUpdatePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeMsg(null);

    if (!newPasscode.trim()) {
      setPasscodeMsg({ type: 'error', text: 'Passcode cannot be empty.' });
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setPasscodeMsg({ type: 'error', text: 'New passcode and confirmation do not match.' });
      return;
    }

    updateStoreSettings({ adminPassword: newPasscode.trim() });
    setPasscodeMsg({ type: 'success', text: `Passcode successfully updated to "${newPasscode.trim()}".` });
    setNewPasscode('');
    setConfirmPasscode('');
    showToast(`Studio passcode updated to "${newPasscode.trim()}".`);
  };

  const handleResetCatalog = () => {
    if (confirm('Reset entire catalog and settings to initial Stitch defaults? Custom changes will be overwritten.')) {
      resetToDefaults();
      setTempSettings(storeSettings);
      showToast('Catalog reset to initial Stitch defaults.');
    }
  };

  // Product Duplication (1-Click Clone)
  const handleDuplicateProduct = (product: Product) => {
    const duplicated: ProductFormData = {
      name: `${product.name} (Copy)`,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      rating: product.rating,
      reviewCount: product.reviewCount,
      description: product.description,
      details: product.details || [],
      inStock: product.inStock,
      stockQuantity: product.stockQuantity ?? 10,
      illustration: product.illustration,
      imageUrl: product.imageUrl,
      colors: product.colors,
      sizes: product.sizes,
      badgeVariant: product.badge?.variant || 'none',
      badgeText: product.badge?.text || '',
    };
    addProduct(duplicated);
    showToast(`Duplicated "${product.name}" as "${product.name} (Copy)".`);
  };

  // Bulk Restock Low Inventory Archetypes
  const handleBulkRestockLow = () => {
    let restockedCount = 0;
    products.forEach((p) => {
      const qty = p.stockQuantity ?? 0;
      if (qty <= 5) {
        updateStockQuantity(p.id, qty + 10);
        restockedCount++;
      }
    });
    showToast(`Restocked +10 units to ${restockedCount} low-inventory archetypes.`);
  };

  // Lookbook & Capsule Handlers
  const handleOpenNewCapsule = () => {
    setEditingCapsule(null);
    const count = (storeSettings.lookbookCapsules || []).length + 1;
    setCapsuleTitle('');
    setCapsuleEyebrow(`Lookbook Capsule 0${count} · New Atelier Space`);
    setCapsuleDescription('');
    setCapsuleStudioTag('Atelier Living Studio · 35°N');
    setCapsuleTheme('warm-sand');
    setCapsuleProductIds([
      products[0]?.id || 'prod-1',
      products[1]?.id || 'prod-3',
      products[2]?.id || 'prod-8',
    ]);
    setCapsuleEnabled(true);
    setCapsuleShowOnHome(true);
    setCapsuleShowOnShop(true);
    setIsCapsuleModalOpen(true);
  };

  const handleOpenEditCapsule = (capsule: LookbookCapsule) => {
    setEditingCapsule(capsule);
    setCapsuleTitle(capsule.title);
    setCapsuleEyebrow(capsule.eyebrow);
    setCapsuleDescription(capsule.description);
    setCapsuleStudioTag(capsule.studioTag);
    setCapsuleTheme(capsule.theme);
    setCapsuleProductIds([...capsule.productIds] as [string, string, string]);
    setCapsuleEnabled(capsule.enabled !== false);
    setCapsuleShowOnHome(capsule.showOnHome !== false);
    setCapsuleShowOnShop(capsule.showOnShop !== false);
    setIsCapsuleModalOpen(true);
  };

  const handleSaveCapsule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capsuleTitle.trim()) {
      showToast('Please enter a capsule title.');
      return;
    }

    const currentCapsules = storeSettings.lookbookCapsules || [];
    let updatedCapsules: LookbookCapsule[];

    if (editingCapsule) {
      updatedCapsules = currentCapsules.map((c) =>
        c.id === editingCapsule.id
          ? {
              ...c,
              title: capsuleTitle.trim(),
              eyebrow: capsuleEyebrow.trim(),
              description: capsuleDescription.trim(),
              studioTag: capsuleStudioTag.trim(),
              theme: capsuleTheme,
              productIds: capsuleProductIds,
              enabled: capsuleEnabled,
              showOnHome: capsuleShowOnHome,
              showOnShop: capsuleShowOnShop,
            }
          : c
      );
      showToast(`Capsule "${capsuleTitle}" updated.`);
    } else {
      const newCapsule: LookbookCapsule = {
        id: `capsule-${Date.now()}`,
        title: capsuleTitle.trim(),
        eyebrow: capsuleEyebrow.trim(),
        description: capsuleDescription.trim(),
        studioTag: capsuleStudioTag.trim(),
        theme: capsuleTheme,
        productIds: capsuleProductIds,
        enabled: capsuleEnabled,
        showOnHome: capsuleShowOnHome,
        showOnShop: capsuleShowOnShop,
      };
      updatedCapsules = [...currentCapsules, newCapsule];
      showToast(`New capsule "${capsuleTitle}" created.`);
    }

    updateLookbookCapsules(updatedCapsules);
    setIsCapsuleModalOpen(false);
  };

  const handleDeleteCapsule = (id: string, title: string) => {
    if (confirm(`Are you sure you want to remove capsule "${title}" from the Lookbook?`)) {
      const currentCapsules = storeSettings.lookbookCapsules || [];
      const updated = currentCapsules.filter((c) => c.id !== id);
      updateLookbookCapsules(updated);
      showToast(`Capsule "${title}" deleted.`);
    }
  };

  const handleToggleCapsuleEnabled = (id: string) => {
    const currentCapsules = storeSettings.lookbookCapsules || [];
    const updated = currentCapsules.map((c) =>
      c.id === id ? { ...c, enabled: !c.enabled } : c
    );
    updateLookbookCapsules(updated);
    showToast('Capsule visibility toggled.');
  };

  const handleToggleCapsuleHome = (id: string) => {
    const currentCapsules = storeSettings.lookbookCapsules || [];
    const updated = currentCapsules.map((c) =>
      c.id === id ? { ...c, showOnHome: c.showOnHome === false ? true : false } : c
    );
    updateLookbookCapsules(updated);
    showToast('Capsule Home placement toggled.');
  };

  const handleToggleCapsuleShop = (id: string) => {
    const currentCapsules = storeSettings.lookbookCapsules || [];
    const updated = currentCapsules.map((c) =>
      c.id === id ? { ...c, showOnShop: c.showOnShop === false ? true : false } : c
    );
    updateLookbookCapsules(updated);
    showToast('Capsule Shop placement toggled.');
  };

  const handleToggleShowOnShop = () => {
    const nextVal = storeSettings.showLookbookOnShop === false ? true : false;
    updateStoreSettings({ showLookbookOnShop: nextVal });
    showToast(`Lookbook on Shop page ${nextVal ? 'enabled' : 'disabled'}.`);
  };

  const handleToggleShowOnHome = () => {
    const nextVal = storeSettings.showLookbookOnHome === false ? true : false;
    updateStoreSettings({ showLookbookOnHome: nextVal });
    showToast(`Lookbook on Home page ${nextVal ? 'enabled' : 'disabled'}.`);
  };

  // Export Catalog CSV
  const handleExportCatalogCSV = () => {
    const headers = [
      'ID',
      'Name',
      'Category',
      'Price',
      'Original Price',
      'Stock Quantity',
      'In Stock',
      'Rating',
      'Review Count',
      'Colors',
      'Sizes',
      'Badge',
      'Description',
    ];
    const rows = products.map((p) => [
      `"${p.id}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.price.toFixed(2),
      p.originalPrice ? p.originalPrice.toFixed(2) : '',
      p.stockQuantity ?? 0,
      p.inStock ? 'Yes' : 'No',
      p.rating,
      p.reviewCount,
      `"${p.colors.map((c) => c.name).join(', ')}"`,
      `"${p.sizes.join(', ')}"`,
      `"${p.badge?.text || ''}"`,
      `"${p.description.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `esondha-catalog-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Catalog CSV exported successfully.');
  };

  // Export Orders CSV
  const handleExportOrdersCSV = () => {
    const headers = [
      'Order ID',
      'Order Number',
      'Date',
      'Customer Name',
      'Customer Email',
      'Account Type',
      'Fulfillment Status',
      'Subtotal',
      'Shipping Cost',
      'Tax',
      'Total Paid',
      'Carrier',
      'Tracking Number',
      'Shipping Full Name',
      'Street',
      'City',
      'State',
      'Postal Code',
      'Country',
      'Total Items Count',
      'Items Detail',
    ];
    const rows = (allOrders || []).map((o) => {
      const itemsSummary = o.items
        .map((i) => `${i.name} (Qty: ${i.quantity}, Color: ${i.selectedColor?.name || 'Std'}, Size: ${i.selectedSize || 'Std'}, $${i.price})`)
        .join('; ');
      return [
        `"${o.id}"`,
        `"${o.orderNumber}"`,
        `"${o.date}"`,
        `"${(o.customerName || 'Valued Patron').replace(/"/g, '""')}"`,
        `"${(o.customerEmail || '').replace(/"/g, '""')}"`,
        `"${o.isGuest ? 'Guest' : 'Member'}"`,
        `"${o.status}"`,
        o.subtotal.toFixed(2),
        o.shippingCost.toFixed(2),
        o.tax.toFixed(2),
        o.total.toFixed(2),
        `"${o.carrier || 'DHL Carbon-Neutral'}"`,
        `"${o.trackingNumber || `ES-TRK-${o.orderNumber.replace('ES-', '')}`}"`,
        `"${(o.shippingAddress.fullName || o.customerName || '').replace(/"/g, '""')}"`,
        `"${(o.shippingAddress.street || '').replace(/"/g, '""')}"`,
        `"${(o.shippingAddress.city || '').replace(/"/g, '""')}"`,
        `"${(o.shippingAddress.state || '').replace(/"/g, '""')}"`,
        `"${(o.shippingAddress.postalCode || o.shippingAddress.zipCode || '').replace(/"/g, '""')}"`,
        `"${(o.shippingAddress.country || '').replace(/"/g, '""')}"`,
        o.items.reduce((acc, i) => acc + i.quantity, 0),
        `"${itemsSummary.replace(/"/g, '""')}"`,
      ];
    });
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `esondha-orders-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders CSV exported successfully.');
  };

  // Export Reviews CSV
  const handleExportReviewsCSV = () => {
    const headers = [
      'Review ID',
      'Product ID',
      'Product Name',
      'Rating',
      'Title',
      'Comment',
      'Patron Name',
      'Patron Email',
      'Verified Buyer',
      'Recommends Product',
      'Date',
      'Helpful Votes',
      'Curator Reply Text',
      'Curator Reply Date',
      'Curator Reply Author',
    ];
    const rows = reviews.map((r) => {
      const prod = products.find((p) => p.id === r.productId);
      return [
        `"${r.id}"`,
        `"${r.productId}"`,
        `"${(prod?.name || 'Studio Archetype').replace(/"/g, '""')}"`,
        r.rating,
        `"${r.title.replace(/"/g, '""')}"`,
        `"${r.comment.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        `"${(r.author || r.userName || 'Patron').replace(/"/g, '""')}"`,
        `"${(r.userEmail || '').replace(/"/g, '""')}"`,
        (r.verified || r.verifiedBuyer) ? 'Yes' : 'No',
        r.recommendProduct !== false ? 'Yes' : 'No',
        `"${r.date}"`,
        r.helpfulCount ?? 0,
        `"${(r.adminReply?.text || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        `"${r.adminReply?.date || ''}"`,
        `"${(r.adminReply?.author || '').replace(/"/g, '""')}"`,
      ];
    });
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `esondha-reviews-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Patron reviews exported to CSV.');
  };

  // Review management handlers
  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this patron review? Product aggregate rating and review count will automatically recalculate.')) {
      deleteReview(reviewId);
      showToast('Review deleted. Aggregate rating recalculated.');
    }
  };

  const handleOpenReplyModal = (review: ProductReview) => {
    setReplyModalReview(review);
    setReplyDraftText(review.adminReply?.text || '');
    setReplyAuthorName(review.adminReply?.author || 'E Sondha Studio Curator');
  };

  const handleSaveAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModalReview || !replyDraftText.trim()) return;
    addAdminReply(
      replyModalReview.id,
      replyDraftText.trim(),
      replyAuthorName.trim() || 'E Sondha Studio Curator'
    );
    showToast(`Curator response published for ${replyModalReview.author || replyModalReview.userName || 'patron'}'s review.`);
    setReplyModalReview(null);
    setReplyDraftText('');
  };

  // FAQ Management Handlers
  const handleExportFAQsCSV = () => {
    const headers = [
      'FAQ ID',
      'Category',
      'Status',
      'Question',
      'Answer',
      'Asker Name',
      'Asker Email',
      'Asked Date',
      'Answered By',
      'Answered Date',
      'Helpful Votes',
    ];
    const rows = faqs.map((f) => [
      `"${f.id}"`,
      `"${f.category}"`,
      `"${f.status}"`,
      `"${f.question.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${(f.answer || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${(f.askedBy?.name || '').replace(/"/g, '""')}"`,
      `"${(f.askedBy?.email || '').replace(/"/g, '""')}"`,
      `"${f.askedAt}"`,
      `"${(f.answeredBy || '').replace(/"/g, '""')}"`,
      `"${f.answeredAt || ''}"`,
      f.helpfulCount ?? 0,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `esondha-faqs-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Atelier FAQs exported to CSV.');
  };

  const handleOpenAnswerModal = (faq: FAQItem) => {
    setEditingFaq(faq);
    setQuestionDraft(faq.question);
    setAnswerDraft(faq.answer || '');
    setCategoryDraft(faq.category);
    setPublishImmediate(faq.status === 'published' || !faq.answer);
    setIsAnswerModalOpen(true);
  };

  const handleSaveAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq || !answerDraft.trim()) return;

    answerQuestion(editingFaq.id, answerDraft.trim(), categoryDraft, publishImmediate);
    if (questionDraft.trim() && questionDraft.trim() !== editingFaq.question) {
      updateFAQ(editingFaq.id, { question: questionDraft.trim() });
    }

    showToast(
      publishImmediate
        ? 'Curator response saved and published live to /faq.'
        : 'Response saved as pending draft.'
    );
    setIsAnswerModalOpen(false);
    setEditingFaq(null);
  };

  const handleTogglePublishStatus = (faq: FAQItem) => {
    if (!faq.answer?.trim()) {
      handleOpenAnswerModal(faq);
      showToast('Please provide an answer before publishing this question.');
      return;
    }
    const newStatus: FAQStatus = faq.status === 'published' ? 'pending' : 'published';
    updateFAQ(faq.id, { status: newStatus });
    showToast(
      newStatus === 'published'
        ? 'FAQ published live to the storefront.'
        : 'FAQ unpublished and moved to drafts.'
    );
  };

  const handleDeleteFAQ = (faqId: string) => {
    if (window.confirm('Are you sure you want to delete this FAQ entry? It will be removed from both the storefront and admin knowledge base.')) {
      deleteFAQ(faqId);
      showToast('FAQ entry deleted.');
    }
  };

  const handleCreateFAQSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !newAnswerText.trim()) return;

    createFAQ({
      question: newQuestionText.trim(),
      answer: newAnswerText.trim(),
      category: newCategory,
      status: newPublishStatus,
    });

    showToast(
      newPublishStatus === 'published'
        ? 'New FAQ created and published live on storefront.'
        : 'New FAQ saved as pending draft.'
    );

    setNewQuestionText('');
    setNewAnswerText('');
    setNewCategory('general');
    setNewPublishStatus('published');
    setIsCreateFaqModalOpen(false);
  };

  // Order status updater with toast
  const handleOrderStatusChange = (
    orderId: string,
    orderNumber: string,
    newStatus: Order['status'],
    extra?: { trackingNumber?: string; carrier?: string }
  ) => {
    updateOrderStatus(orderId, newStatus, extra);
    if (inspectingOrder && (inspectingOrder.id === orderId || inspectingOrder.orderNumber === orderId)) {
      setInspectingOrder((prev) => (prev ? {
        ...prev,
        status: newStatus,
        ...(extra?.trackingNumber ? { trackingNumber: extra.trackingNumber } : {}),
        ...(extra?.carrier ? { carrier: extra.carrier } : {}),
      } : null));
    }
    showToast(`Order ${orderNumber} updated to "${newStatus}".`);
  };

  // Patron Inquiries Handlers
  const handleExportInquiriesCSV = () => {
    const headers = ['Inquiry ID', 'Full Name', 'Email', 'Subject', 'Message', 'Created At', 'Status', 'Admin Reply', 'Replied At'];
    const rows = inquiries.map((inq) => [
      `"${inq.id}"`,
      `"${inq.fullName.replace(/"/g, '""')}"`,
      `"${inq.email.replace(/"/g, '""')}"`,
      `"${inq.subject.replace(/"/g, '""')}"`,
      `"${inq.message.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${inq.createdAt}"`,
      `"${inq.status}"`,
      `"${(inq.adminReply || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${inq.repliedAt || ''}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `esondha-inquiries-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Patron inquiries exported to CSV.');
  };

  const handleOpenInquiryReply = (inq: Inquiry) => {
    setReplyModalInquiry(inq);
    setInquiryReplyDraft(inq.adminReply || '');
    if (inq.status === 'unread') {
      updateInquiryStatus(inq.id, 'read');
    }
  };

  const handleSendInquiryReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModalInquiry || !inquiryReplyDraft.trim()) return;
    replyToInquiry(replyModalInquiry.id, inquiryReplyDraft.trim());
    showToast(`Curator response dispatched for ${replyModalInquiry.fullName}'s inquiry.`);
    setReplyModalInquiry(null);
    setInquiryReplyDraft('');
  };

  const handleDeleteInquiry = (id: string) => {
    if (window.confirm('Delete this patron inquiry? This cannot be undone.')) {
      deleteInquiry(id);
      showToast('Inquiry removed from inbox.');
    }
  };

  // Subscribers Handlers
  const handleExportSubscribersCSV = () => {
    const headers = ['Subscriber ID', 'Email', 'Joined Date', 'Source', 'Status'];
    const rows = subscribers.map((sub) => [
      `"${sub.id}"`,
      `"${sub.email.replace(/"/g, '""')}"`,
      `"${sub.subscribedAt}"`,
      `"${sub.source}"`,
      sub.active ? 'Active' : 'Unsubscribed',
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `esondha-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Newsletter subscribers exported to CSV.');
  };

  const handleCopyAllEmails = () => {
    if (subscribers.length === 0) {
      showToast('No subscribers to copy.');
      return;
    }
    const emailList = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emailList);
    setSubscriberCopied(true);
    showToast(`${subscribers.length} subscriber emails copied to clipboard.`);
    setTimeout(() => setSubscriberCopied(false), 2500);
  };

  const handleDeleteSubscriber = (id: string) => {
    if (window.confirm('Remove this subscriber from the mailing registry?')) {
      deleteSubscriber(id);
      showToast('Subscriber removed.');
    }
  };

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus = inquiryStatusFilter === 'ALL' || inq.status === inquiryStatusFilter;
    const q = inquirySearchQuery.toLowerCase().trim();
    const matchesQuery =
      q === '' ||
      inq.fullName.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      inq.subject.toLowerCase().includes(q) ||
      inq.message.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  // Filter subscribers
  const filteredSubscribers = subscribers.filter((sub) => {
    const q = subscriberSearchQuery.toLowerCase().trim();
    return q === '' || sub.email.toLowerCase().includes(q) || sub.source.toLowerCase().includes(q);
  });

  // Filter products by search, category and stock level
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const qty = p.stockQuantity ?? 0;
    const matchesStock =
      selectedStockFilter === 'ALL' ||
      (selectedStockFilter === 'IN_STOCK' && p.inStock && qty > 5) ||
      (selectedStockFilter === 'LOW_STOCK' && qty > 0 && qty <= 5) ||
      (selectedStockFilter === 'SOLD_OUT' && (qty === 0 || !p.inStock));
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      q === '' ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return matchesCategory && matchesStock && matchesQuery;
  });

  // Filter orders by search and status
  const filteredOrders = (allOrders || []).filter((order) => {
    const matchesStatus = orderStatusFilter === 'ALL' || order.status === orderStatusFilter;
    const q = orderSearchQuery.toLowerCase().trim();
    const matchesQuery =
      q === '' ||
      order.orderNumber.toLowerCase().includes(q) ||
      order.id.toLowerCase().includes(q) ||
      (order.customerName && order.customerName.toLowerCase().includes(q)) ||
      (order.customerEmail && order.customerEmail.toLowerCase().includes(q)) ||
      order.shippingAddress.city.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  // Sorted orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (orderSort === 'highest-total') return b.total - a.total;
    if (orderSort === 'lowest-total') return a.total - b.total;
    if (orderSort === 'oldest') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Order metrics
  const processingCount = (allOrders || []).filter((o) => o.status === 'Processing').length;
  const shippedCount = (allOrders || []).filter((o) => o.status === 'Shipped').length;
  const deliveredCount = (allOrders || []).filter((o) => o.status === 'Delivered').length;
  const totalRevenue = (allOrders || []).reduce((acc, o) => acc + o.total, 0);

  // Reviews metrics & filtered reviews
  const totalReviews = reviews.length;
  const avgStudioRating = totalReviews > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) : '5.0';
  const verifiedPatronReviews = reviews.filter((r) => r.verified || r.verifiedBuyer).length;
  const recommendPercent = totalReviews > 0 ? Math.round((reviews.filter((r) => r.recommendProduct !== false).length / totalReviews) * 100) : 100;

  const filteredReviews = reviews.filter((r) => {
    const matchesStar = reviewStarFilter === 'ALL' || r.rating === reviewStarFilter;
    const matchesProduct = reviewProductFilter === 'ALL' || r.productId === reviewProductFilter;
    const q = reviewSearchQuery.toLowerCase().trim();
    const prod = products.find((p) => p.id === r.productId);
    const prodName = prod?.name?.toLowerCase() || '';
    const authorName = (r.author || r.userName || '').toLowerCase();
    const matchesQuery =
      q === '' ||
      authorName.includes(q) ||
      (r.userEmail && r.userEmail.toLowerCase().includes(q)) ||
      r.title.toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q) ||
      prodName.includes(q);

    return matchesStar && matchesProduct && matchesQuery;
  });

  // FAQs Filter and Sort
  const filteredFaqs = faqs.filter((f) => {
    const matchesCategory = faqCategoryFilter === 'ALL' || f.category === faqCategoryFilter;
    const matchesStatus =
      faqStatusFilter === 'ALL' ||
      (faqStatusFilter === 'pending' && (f.status === 'pending' || !f.answer?.trim())) ||
      (faqStatusFilter === 'published' && f.status === 'published' && !!f.answer?.trim());
    const q = faqSearchQuery.toLowerCase().trim();
    const matchesQuery =
      q === '' ||
      f.question.toLowerCase().includes(q) ||
      (f.answer && f.answer.toLowerCase().includes(q)) ||
      (f.askedBy?.name && f.askedBy.name.toLowerCase().includes(q)) ||
      (f.askedBy?.email && f.askedBy.email.toLowerCase().includes(q));

    return matchesCategory && matchesStatus && matchesQuery;
  });

  const sortedFaqs = [...filteredFaqs].sort((a, b) => {
    if (faqSort === 'unanswered-first') {
      const aUnanswered = a.status === 'pending' || !a.answer?.trim() ? 1 : 0;
      const bUnanswered = b.status === 'pending' || !b.answer?.trim() ? 1 : 0;
      if (aUnanswered !== bUnanswered) return bUnanswered - aUnanswered;
      return new Date(b.askedAt).getTime() - new Date(a.askedAt).getTime();
    }
    if (faqSort === 'most-helpful') {
      return (b.helpfulCount || 0) - (a.helpfulCount || 0);
    }
    if (faqSort === 'oldest') {
      return new Date(a.askedAt).getTime() - new Date(b.askedAt).getTime();
    }
    return new Date(b.askedAt).getTime() - new Date(a.askedAt).getTime();
  });

  // Inventory & Product Analytics
  const inStockCount = products.filter((p) => p.inStock && (p.stockQuantity ?? 0) > 0).length;
  const totalStockUnits = products.reduce((acc, p) => acc + (p.stockQuantity ?? 0), 0);
  const lowStockCount = products.filter((p) => (p.stockQuantity ?? 0) > 0 && (p.stockQuantity ?? 0) <= 5).length;
  const soldOutCount = products.filter((p) => (p.stockQuantity ?? 0) === 0 || !p.inStock).length;
  const avgPrice = products.length > 0 ? (products.reduce((acc, p) => acc + p.price, 0) / products.length).toFixed(2) : '0';

  // 1. Loading State
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-label-caps text-xs tracking-label-caps uppercase text-on-surface-variant font-semibold">
            Verifying Atelier Security Clearance...
          </p>
        </div>
      </div>
    );
  }

  // 2. Lock Screen (When Unauthorized)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-surface flex flex-col justify-between p-4 sm:p-6 text-on-surface">
        {/* Minimal Top Brand Bar */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-label-caps tracking-label-caps uppercase font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Link>
          <span className="font-display-lg text-sm font-bold tracking-tight text-on-surface">
            E Sondha Atelier
          </span>
        </div>

        {/* Lock Screen Card */}
        <div className="w-full max-w-md mx-auto my-12 bg-surface-lowest border border-on-surface/15 rounded-2xl p-8 shadow-card flex flex-col items-center text-center animate-in fade-in zoom-in-95">
          <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center mb-5 shadow-subtle">
            <Lock className="w-7 h-7" />
          </div>

          <span className="font-label-caps text-[11px] tracking-label-caps uppercase font-bold text-primary mb-1">
            Restricted Staff Access
          </span>
          <h1 className="font-display-lg text-2xl font-bold text-on-surface tracking-tight mb-2">
            Studio Atelier Gate
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant max-w-sm mb-6 leading-relaxed">
            Administrative access is restricted to verified E Sondha studio curators. Enter your studio keycode to manage catalog inventory, product imagery, and track incoming customer orders.
          </p>

          <form onSubmit={handleAuthorize} className="w-full space-y-4 text-left">
            <div>
              <label className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface mb-1.5">
                Staff Keycode
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showLockPasscode ? 'text' : 'password'}
                  value={passcodeInput}
                  onChange={(e) => {
                    setPasscodeInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="Enter staff passcode..."
                  className="w-full bg-surface border border-outline-variant/60 rounded-xl pl-10 pr-10 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowLockPasscode(!showLockPasscode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-0.5 rounded transition-colors cursor-pointer"
                  title={showLockPasscode ? 'Hide passcode' : 'Show passcode'}
                  aria-label={showLockPasscode ? 'Hide passcode' : 'Show passcode'}
                >
                  {showLockPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary-container text-white font-label-caps text-xs tracking-label-caps uppercase font-semibold rounded-xl shadow-subtle flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Authorize &amp; Enter Studio</span>
            </button>
          </form>

          {/* Security & Keycode Status */}
          {activePasscode === 'admin2026' ? (
            <div className="mt-6 pt-5 border-t border-outline-variant/30 w-full flex flex-col items-center gap-2">
              <span className="text-[11px] text-on-surface-variant">
                Default Studio Keycode: <strong className="text-primary font-mono font-bold">admin2026</strong>
              </span>
              <button
                type="button"
                onClick={handleFillDemoPasscode}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Auto-Fill Default Keycode</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="mt-6 pt-5 border-t border-outline-variant/30 w-full text-center">
              <span className="text-[11px] text-on-surface-variant flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Custom atelier security keycode active.</span>
              </span>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="max-w-7xl mx-auto w-full text-center py-2 text-[11px] text-outline">
          E Sondha Slow-Living Atelier · Administrative Control Terminal
        </div>
      </div>
    );
  }

  // Breadcrumb mapping
  const tabNames: Record<AdminTab, { section: string; title: string }> = {
    dashboard: { section: 'Overview', title: 'Executive Dashboard' },
    catalog: { section: 'Store Operations', title: 'Catalog & Inventory' },
    orders: { section: 'Store Operations', title: 'Orders & Fulfillment' },
    reviews: { section: 'Store Operations', title: 'Patron Reviews' },
    faqs: { section: 'Store Operations', title: 'Atelier FAQs' },
    inquiries: { section: 'Store Operations', title: 'Patron Inquiries' },
    subscribers: { section: 'Store Operations', title: 'Subscribers & VIPs' },
    lookbook: { section: 'Store Operations', title: 'Lookbook & Living Capsules' },
    curator: { section: 'Store Operations', title: "Curator's Choice Spotlight" },
    metrics: { section: 'Intelligence', title: 'Analytics & Stock' },
    settings: { section: 'System', title: 'Settings & Security' },
  };

  const navGroups = [
    {
      group: 'Overview',
      items: [
        {
          id: 'dashboard' as AdminTab,
          label: 'Executive Dashboard',
          icon: LayoutDashboard,
          badge: null,
          badgeColor: '',
        },
      ],
    },
    {
      group: 'Store Operations',
      items: [
        {
          id: 'catalog' as AdminTab,
          label: 'Catalog & Stock',
          icon: Package,
          badge: `${products.length}`,
          badgeColor: 'bg-white/10 text-white',
        },
        {
          id: 'orders' as AdminTab,
          label: 'Orders & Dispatch',
          icon: Truck,
          badge: processingCount > 0 ? `${processingCount} new` : `${(allOrders || []).length}`,
          badgeColor: processingCount > 0 ? 'bg-amber-400 text-amber-950 font-bold animate-pulse' : 'bg-white/10 text-white',
        },
        {
          id: 'reviews' as AdminTab,
          label: 'Patron Reviews',
          icon: MessageSquare,
          badge: `★ ${avgStudioRating}`,
          badgeColor: 'bg-amber-500/20 text-amber-300 font-semibold',
        },
        {
          id: 'faqs' as AdminTab,
          label: 'Atelier FAQs',
          icon: HelpCircle,
          badge: pendingCount > 0 ? `${pendingCount} new` : `${faqs.length}`,
          badgeColor: pendingCount > 0 ? 'bg-amber-400 text-amber-950 font-bold animate-pulse' : 'bg-white/10 text-white',
        },
        {
          id: 'inquiries' as AdminTab,
          label: 'Patron Inquiries',
          icon: Mail,
          badge: unreadInquiriesCount > 0 ? `${unreadInquiriesCount} new` : `${inquiries.length}`,
          badgeColor: unreadInquiriesCount > 0 ? 'bg-rose-500 text-white font-bold animate-pulse' : 'bg-white/10 text-white',
        },
        {
          id: 'subscribers' as AdminTab,
          label: 'Subscribers & VIPs',
          icon: Users,
          badge: `${totalSubscribersCount}`,
          badgeColor: 'bg-white/10 text-white',
        },
        {
          id: 'lookbook' as AdminTab,
          label: 'Lookbook & Capsules',
          icon: Sparkles,
          badge: `${(storeSettings.lookbookCapsules || []).length}`,
          badgeColor: 'bg-white/10 text-white',
        },
        {
          id: 'curator' as AdminTab,
          label: "Curator's Choice",
          icon: Star,
          badge: `${(storeSettings.curatorChoiceProductIds || ['prod-1', 'prod-8', 'prod-4']).length}`,
          badgeColor: 'bg-primary/20 text-primary-light font-bold',
        },
      ],
    },
    {
      group: 'Intelligence',
      items: [
        {
          id: 'metrics' as AdminTab,
          label: 'Analytics & Stats',
          icon: TrendingUp,
          badge: null,
          badgeColor: '',
        },
      ],
    },
    {
      group: 'System & Security',
      items: [
        {
          id: 'settings' as AdminTab,
          label: 'Settings & Passcode',
          icon: Settings,
          badge: null,
          badgeColor: '',
        },
      ],
    },
  ];

  const totalActionItems = processingCount + pendingCount + lowStockCount + unreadInquiriesCount;

  // 3. Authorized Admin Portal
  return (
    <div className="min-h-screen flex bg-surface text-on-surface">
      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside
        className={`hidden lg:flex flex-col bg-primary text-white border-r border-white/10 transition-all duration-300 sticky top-0 h-screen z-40 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Masthead */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-display-lg font-bold text-white shrink-0 shadow-subtle group-hover:bg-white/15 transition-colors">
              ES
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display-lg text-base font-bold text-white tracking-tight truncate">
                    E Sondha
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Atelier System Online" />
                </div>
                <span className="font-label-caps text-[10px] tracking-label-caps uppercase text-tertiary-fixed/70 block truncate">
                  Slow-Living Atelier
                </span>
              </div>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-tertiary-fixed hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer hidden lg:block"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Grouped Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              {!isSidebarCollapsed && (
                <span className="font-label-caps text-[10px] tracking-label-caps uppercase font-bold text-tertiary-fixed/60 px-3 block mb-1.5">
                  {group.group}
                </span>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white/15 text-white font-semibold shadow-sm border border-white/10'
                        : 'text-tertiary-fixed hover:text-white hover:bg-white/8'
                    } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
                    title={isSidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!isSidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left truncate">{item.label}</span>
                        {item.badge && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <Link
            href="/shop"
            target="_blank"
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-tertiary-fixed hover:text-white hover:bg-white/10 border border-white/10 transition-colors ${
              isSidebarCollapsed ? 'justify-center px-2' : ''
            }`}
            title="Open Live Shop in new tab"
          >
            <Eye className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && (
              <>
                <span className="flex-1 text-left truncate">Storefront</span>
                <ExternalLink className="w-3 h-3 text-tertiary-fixed/60" />
              </>
            )}
          </Link>

          <button
            type="button"
            onClick={handleLockStudio}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-200 hover:text-white hover:bg-red-500/20 border border-red-400/20 transition-colors cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-2' : ''
            }`}
            title="Lock administrative session"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span className="flex-1 text-left truncate">Lock Session</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <aside className="relative w-72 bg-primary text-white flex flex-col h-full shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-display-lg font-bold text-white shadow-subtle">
                  ES
                </div>
                <div>
                  <span className="font-display-lg text-sm font-bold text-white block">E Sondha Atelier</span>
                  <span className="text-[10px] text-tertiary-fixed/70">Admin Command</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1 rounded-lg text-tertiary-fixed hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-6">
              {navGroups.map((group) => (
                <div key={group.group} className="space-y-1">
                  <span className="font-label-caps text-[10px] tracking-label-caps uppercase font-bold text-tertiary-fixed/60 px-3 block mb-1">
                    {group.group}
                  </span>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-white/15 text-white font-semibold shadow-sm border border-white/10'
                            : 'text-tertiary-fixed hover:text-white hover:bg-white/8'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-white/10 space-y-2">
              <button
                type="button"
                onClick={() => {
                  handleLockStudio();
                  setIsMobileSidebarOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-200 hover:text-white hover:bg-red-500/20 border border-red-400/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Lock Session</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP COMMAND & APP BAR */}
        <header className="h-16 bg-surface-lowest/95 backdrop-blur border-b border-outline-variant/20 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-low transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Trail */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-on-surface-variant">
              <span>Atelier</span>
              <ChevronRight className="w-3.5 h-3.5 text-outline" />
              <span className="text-outline">{tabNames[activeTab].section}</span>
              <ChevronRight className="w-3.5 h-3.5 text-outline" />
              <span className="font-semibold text-on-surface">{tabNames[activeTab].title}</span>
            </div>
          </div>

          {/* Center Search / Command Trigger */}
          <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-2">
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="w-full flex items-center justify-between bg-surface-low hover:bg-surface-high border border-outline-variant/30 text-on-surface-variant hover:text-on-surface px-3.5 py-2 rounded-xl text-xs transition-colors shadow-subtle group cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-outline group-hover:text-primary transition-colors" />
                <span className="truncate">Search products, orders, FAQs...</span>
              </div>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono font-bold bg-surface border border-outline-variant/40 text-outline px-1.5 py-0.5 rounded shadow-xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Controls: Sync status, Quick Add, Alerts Bell, Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Live Storefront Indicator */}
            <span className="hidden xl:inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Storefront Live</span>
            </span>

            {/* Quick Action Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsQuickActionMenuOpen(!isQuickActionMenuOpen)}
                className="px-3 py-1.5 bg-primary hover:bg-primary-container text-white text-xs font-semibold rounded-lg shadow-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quick Action</span>
                <ChevronDown className="w-3 h-3 text-white/70" />
              </button>

              {isQuickActionMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsQuickActionMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-surface-lowest border border-on-surface/15 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsQuickActionMenuOpen(false);
                        handleOpenAddModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-on-surface hover:bg-surface-low rounded-lg transition-colors text-left"
                    >
                      <Package className="w-4 h-4 text-primary" />
                      <span>Upload New Product</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsQuickActionMenuOpen(false);
                        setIsCreateFaqModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-on-surface hover:bg-surface-low rounded-lg transition-colors text-left"
                    >
                      <HelpCircle className="w-4 h-4 text-primary" />
                      <span>Create Atelier FAQ</span>
                    </button>

                    <div className="border-t border-outline-variant/20 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setIsQuickActionMenuOpen(false);
                        handleExportOrdersCSV();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-low rounded-lg transition-colors text-left"
                    >
                      <Download className="w-4 h-4 text-outline" />
                      <span>Export Orders CSV</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsQuickActionMenuOpen(false);
                        handleExportCatalogCSV();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-low rounded-lg transition-colors text-left"
                    >
                      <Download className="w-4 h-4 text-outline" />
                      <span>Export Catalog CSV</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Notification Center Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationFlyoutOpen(!isNotificationFlyoutOpen)}
                className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-low transition-colors relative cursor-pointer"
                title="Operational Activity & Notifications"
              >
                <Bell className="w-4 h-4" />
                {totalActionItems > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>

              {isNotificationFlyoutOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsNotificationFlyoutOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-lowest border border-on-surface/15 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 space-y-3">
                    <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-primary" />
                        <h4 className="font-bold text-xs text-on-surface uppercase tracking-wider">
                          Atelier Alerts ({totalActionItems})
                        </h4>
                      </div>
                      <span className="text-[10px] text-outline">Real-time sync</span>
                    </div>

                    <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                      {totalActionItems === 0 ? (
                        <div className="py-6 text-center text-xs text-on-surface-variant">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                          <p className="font-semibold text-on-surface">All caught up!</p>
                          <p className="text-[11px] text-outline mt-0.5">
                            No pending orders, unanswered questions, or low stock warnings.
                          </p>
                        </div>
                      ) : (
                        <>
                          {pendingCount > 0 && (
                            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-2.5">
                              <div>
                                <span className="font-bold text-xs text-amber-900 block">
                                  {pendingCount} Patron Question{pendingCount > 1 ? 's' : ''} Pending
                                </span>
                                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                                  Shoppers submitted questions waiting for studio curator answers.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsNotificationFlyoutOpen(false);
                                  setActiveTab('faqs');
                                  setFaqStatusFilter('pending');
                                }}
                                className="px-2.5 py-1 rounded bg-amber-500 text-white text-[10px] font-bold uppercase shrink-0 hover:bg-amber-600 transition-colors"
                              >
                                Answer
                              </button>
                            </div>
                          )}

                          {processingCount > 0 && (
                            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-start justify-between gap-2.5">
                              <div>
                                <span className="font-bold text-xs text-primary block">
                                  {processingCount} Order{processingCount > 1 ? 's' : ''} Ready to Dispatch
                                </span>
                                <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                                  Orders awaiting packaging slips and courier tracking assignment.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsNotificationFlyoutOpen(false);
                                  setActiveTab('orders');
                                  setOrderStatusFilter('Processing');
                                }}
                                className="px-2.5 py-1 rounded bg-primary text-white text-[10px] font-bold uppercase shrink-0 hover:bg-primary-container transition-colors"
                              >
                                Dispatch
                              </button>
                            </div>
                          )}

                          {lowStockCount > 0 && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start justify-between gap-2.5">
                              <div>
                                <span className="font-bold text-xs text-red-900 block">
                                  {lowStockCount} Item{lowStockCount > 1 ? 's' : ''} Low on Stock
                                </span>
                                <p className="text-[11px] text-red-800 mt-0.5 leading-relaxed">
                                  Inventory remaining is at or below the 5-unit studio safety threshold.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsNotificationFlyoutOpen(false);
                                  setActiveTab('catalog');
                                  setSelectedStockFilter('LOW_STOCK');
                                }}
                                className="px-2.5 py-1 rounded bg-red-600 text-white text-[10px] font-bold uppercase shrink-0 hover:bg-red-700 transition-colors"
                              >
                                Restock
                              </button>
                            </div>
                          )}

                          {unreadInquiriesCount > 0 && (
                            <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-start justify-between gap-2.5">
                              <div>
                                <span className="font-bold text-xs text-violet-900 block">
                                  {unreadInquiriesCount} Patron Inquir{unreadInquiriesCount > 1 ? 'ies' : 'y'} Unread
                                </span>
                                <p className="text-[11px] text-violet-800 mt-0.5 leading-relaxed">
                                  Direct patron messages from the contact page awaiting atelier response.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsNotificationFlyoutOpen(false);
                                  setActiveTab('inquiries');
                                  setInquiryStatusFilter('unread');
                                }}
                                className="px-2.5 py-1 rounded bg-violet-600 text-white text-[10px] font-bold uppercase shrink-0 hover:bg-violet-700 transition-colors"
                              >
                                Review
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Staff Profile Avatar Chip */}
            <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-xs">
                SC
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-semibold text-on-surface block leading-tight">Curator</span>
                <span className="text-[10px] text-outline block leading-tight">Verified Staff</span>
              </div>
            </div>
          </div>
        </header>

        {/* Toast Notification */}
        {notification && (
          <div className="fixed top-20 right-6 z-50 bg-primary text-white border border-secondary-container/40 px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-olive" />
            <span className="text-xs font-medium">{notification}</span>
          </div>
        )}

        {/* MAIN BODY CONTAINER */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full max-w-7xl mx-auto space-y-6">
          {/* TAB 0: EXECUTIVE DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Executive Welcome Banner */}
              <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-6 sm:p-8 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-label-caps tracking-label-caps uppercase font-bold text-primary mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Executive Atelier Command Center</span>
                  </div>
                  <h1 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                    Welcome back, Studio Curator
                  </h1>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-1 leading-relaxed">
                    Live overview of incoming patron purchases, inventory velocity, reviews, and client inquiries for E Sondha.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <Link
                    href="/shop"
                    target="_blank"
                    className="px-3.5 py-2 rounded-xl bg-surface-low hover:bg-surface-high border border-outline-variant/40 text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-primary" />
                    <span>View Storefront</span>
                    <ExternalLink className="w-3 h-3 text-outline" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-semibold shadow-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload New Item</span>
                  </button>
                </div>
              </div>

              {/* 4 Executive KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Gross Sales */}
                <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-[11px] tracking-label-caps uppercase font-bold text-on-surface-variant">
                      Gross Atelier Revenue
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="my-3">
                    <div className="text-3xl font-bold font-display-lg text-on-surface">
                      ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <span className="text-[11px] text-outline block mt-0.5">
                      Across {(allOrders || []).length} lifetime purchases
                    </span>
                  </div>
                  <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>+14.2% velocity</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="text-primary hover:underline font-semibold cursor-pointer"
                    >
                      Orders →
                    </button>
                  </div>
                </div>

                {/* Orders Pipeline */}
                <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-[11px] tracking-label-caps uppercase font-bold text-on-surface-variant">
                      Fulfillment Pipeline
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="my-3">
                    <div className="text-3xl font-bold font-display-lg text-primary flex items-baseline gap-2">
                      <span>{processingCount}</span>
                      <span className="text-xs font-normal text-on-surface-variant">to dispatch</span>
                    </div>
                    <span className="text-[11px] text-outline block mt-0.5">
                      {shippedCount} in transit · {deliveredCount} delivered
                    </span>
                  </div>
                  <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between text-[11px]">
                    <span className="text-on-surface-variant">
                      {(allOrders || []).length} total shipments
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="text-primary hover:underline font-semibold cursor-pointer"
                    >
                      Fulfill →
                    </button>
                  </div>
                </div>

                {/* Inventory Health */}
                <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-[11px] tracking-label-caps uppercase font-bold text-on-surface-variant">
                      Inventory Velocity
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-secondary-container/50 text-on-secondary-fixed flex items-center justify-center">
                      <Boxes className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="my-3">
                    <div className="text-3xl font-bold font-display-lg text-on-surface flex items-baseline gap-2">
                      <span>{totalStockUnits}</span>
                      <span className="text-xs font-normal text-on-surface-variant">units total</span>
                    </div>
                    <span className="text-[11px] text-outline block mt-0.5">
                      {products.length} designs · {lowStockCount} low threshold
                    </span>
                  </div>
                  <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between text-[11px]">
                    <span className={lowStockCount > 0 ? 'text-amber-800 font-semibold' : 'text-emerald-700 font-semibold'}>
                      {lowStockCount > 0 ? `${lowStockCount} need restock` : 'Stock levels healthy'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('catalog')}
                      className="text-primary hover:underline font-semibold cursor-pointer"
                    >
                      Catalog →
                    </button>
                  </div>
                </div>

                {/* Patron Trust & Sentiment */}
                <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-[11px] tracking-label-caps uppercase font-bold text-on-surface-variant">
                      Patron Trust Score
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <Star className="w-4 h-4 fill-amber-500" />
                    </div>
                  </div>
                  <div className="my-3">
                    <div className="text-3xl font-bold font-display-lg text-amber-900 flex items-baseline gap-2">
                      <span>{avgStudioRating}</span>
                      <span className="text-xs font-normal text-on-surface-variant">/ 5.0 score</span>
                    </div>
                    <span className="text-[11px] text-outline block mt-0.5">
                      {totalReviews} verified patron reviews · {recommendPercent}% recommend
                    </span>
                  </div>
                  <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between text-[11px]">
                    <span className="text-on-surface-variant">
                      {pendingCount} FAQ inquiry waiting
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('reviews')}
                      className="text-primary hover:underline font-semibold cursor-pointer"
                    >
                      Reviews →
                    </button>
                  </div>
                </div>
              </div>

              {/* Operational "Needs Attention" Hub */}
              {totalActionItems > 0 && (
                <div className="bg-surface-lowest border border-amber-500/30 rounded-2xl p-6 shadow-subtle space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <h3 className="font-headline-sm text-sm font-bold text-on-surface uppercase tracking-wider">
                        Operational Attention Queue ({totalActionItems} action items)
                      </h3>
                    </div>
                    <span className="text-[11px] text-outline">Priority fulfillment &amp; responses</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Attention Item 1: Processing Orders */}
                    {processingCount > 0 ? (
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-primary font-bold text-xs mb-1">
                            <Truck className="w-3.5 h-3.5" />
                            <span>{processingCount} Order{processingCount > 1 ? 's' : ''} Ready to Ship</span>
                          </div>
                          <p className="text-xs text-on-surface-variant leading-relaxed">
                            Patrons are awaiting dispatch confirmation and tracking IDs.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('orders');
                            setOrderStatusFilter('Processing');
                          }}
                          className="mt-3 w-full py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-container transition-colors cursor-pointer"
                        >
                          Fulfill Orders Now
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-surface-low border border-outline-variant/20 flex items-center gap-2 text-xs text-outline">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>All orders fulfilled &amp; dispatched</span>
                      </div>
                    )}

                    {/* Attention Item 2: Unanswered FAQs */}
                    {pendingCount > 0 ? (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-1">
                            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                            <span>{pendingCount} Customer Question{pendingCount > 1 ? 's' : ''}</span>
                          </div>
                          <p className="text-xs text-amber-800 leading-relaxed">
                            Questions submitted from the live storefront awaiting atelier curation.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('faqs');
                            setFaqStatusFilter('pending');
                          }}
                          className="mt-3 w-full py-1.5 rounded-lg bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition-colors cursor-pointer shadow-subtle"
                        >
                          Answer Questions Now
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-surface-low border border-outline-variant/20 flex items-center gap-2 text-xs text-outline">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>All patron FAQs answered</span>
                      </div>
                    )}

                    {/* Attention Item 3: Low Inventory Alerts */}
                    {lowStockCount > 0 ? (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-red-900 font-bold text-xs mb-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-700" />
                            <span>{lowStockCount} Design{lowStockCount > 1 ? 's' : ''} Under Threshold</span>
                          </div>
                          <p className="text-xs text-red-800 leading-relaxed">
                            Units are at or below 5 pieces remaining in atelier inventory.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('catalog');
                            setSelectedStockFilter('LOW_STOCK');
                          }}
                          className="mt-3 w-full py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors cursor-pointer"
                        >
                          Restock Archetypes
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-surface-low border border-outline-variant/20 flex items-center gap-2 text-xs text-outline">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Studio stock levels optimal</span>
                      </div>
                    )}

                    {/* Attention Item 4: Unread Patron Inquiries */}
                    {unreadInquiriesCount > 0 ? (
                      <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-violet-900 font-bold text-xs mb-1">
                            <Mail className="w-3.5 h-3.5 text-violet-700" />
                            <span>{unreadInquiriesCount} Unread Inquir{unreadInquiriesCount > 1 ? 'ies' : 'y'}</span>
                          </div>
                          <p className="text-xs text-violet-800 leading-relaxed">
                            Patrons seeking bespoke sizing, trade collaborations, or studio details.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('inquiries');
                            setInquiryStatusFilter('unread');
                          }}
                          className="mt-3 w-full py-1.5 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors cursor-pointer shadow-subtle"
                        >
                          Reply to Inquiries
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-surface-low border border-outline-variant/20 flex items-center gap-2 text-xs text-outline">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>All patron inquiries handled</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Visual Pipeline Funnel */}
              <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-6 shadow-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-headline-sm text-xs font-bold text-on-surface uppercase tracking-wider">
                    Order Dispatch &amp; Delivery Funnel
                  </h4>
                  <span className="text-xs text-outline font-mono font-semibold">
                    {(allOrders || []).length} Total Orders
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 bg-surface-low rounded-full overflow-hidden flex">
                  {(allOrders || []).length > 0 ? (
                    <>
                      <div
                        style={{ width: `${(processingCount / (allOrders || []).length) * 100}%` }}
                        className="bg-amber-400 h-full transition-all"
                        title={`Processing: ${processingCount}`}
                      />
                      <div
                        style={{ width: `${(shippedCount / (allOrders || []).length) * 100}%` }}
                        className="bg-primary h-full transition-all"
                        title={`Shipped: ${shippedCount}`}
                      />
                      <div
                        style={{ width: `${(deliveredCount / (allOrders || []).length) * 100}%` }}
                        className="bg-emerald-500 h-full transition-all"
                        title={`Delivered: ${deliveredCount}`}
                      />
                    </>
                  ) : (
                    <div className="w-full bg-outline-variant/30 h-full" />
                  )}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs pt-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="font-medium text-on-surface">
                      Processing: <strong>{processingCount}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <span className="font-medium text-on-surface">
                      Shipped (In Transit): <strong>{shippedCount}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-medium text-on-surface">
                      Delivered: <strong>{deliveredCount}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* 2-Column Activity Feeds: Recent Orders & Recent Reviews */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Column 1: Recent Customer Orders */}
                <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-6 shadow-subtle space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-primary" />
                      <h4 className="font-bold text-xs text-on-surface uppercase tracking-wider">
                        Recent Patron Orders
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      View all {(allOrders || []).length} →
                    </button>
                  </div>

                  {(allOrders || []).length === 0 ? (
                    <p className="text-xs text-outline py-6 text-center">No orders recorded yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {(allOrders || []).slice(0, 4).map((order) => (
                        <div
                          key={order.id}
                          className="bg-surface-low border border-outline-variant/30 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-on-surface">
                                {order.orderNumber}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                  order.status === 'Processing'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300/50'
                                    : order.status === 'Shipped'
                                    ? 'bg-blue-100 text-blue-900 border border-blue-300/50'
                                    : order.status === 'Delivered'
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300/50'
                                    : 'bg-red-100 text-red-900'
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <span className="text-[11px] text-on-surface-variant block mt-0.5 truncate">
                              {order.customerName || 'Valued Patron'} · {order.items.length} piece{order.items.length > 1 ? 's' : ''} · {order.date}
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-mono font-bold text-sm text-primary block">
                              ${order.total.toFixed(2)}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setInspectingOrder(order);
                                setIsInspectModalOpen(true);
                              }}
                              className="text-[11px] text-primary hover:underline font-semibold mt-0.5 cursor-pointer"
                            >
                              Inspect →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Column 2: Recent Patron Reviews & Inquiries */}
                <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-6 shadow-subtle space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <h4 className="font-bold text-xs text-on-surface uppercase tracking-wider">
                        Recent Patron Voices
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('reviews')}
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      View all {reviews.length} →
                    </button>
                  </div>

                  {reviews.length === 0 ? (
                    <p className="text-xs text-outline py-6 text-center">No reviews submitted yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {reviews.slice(0, 3).map((review) => {
                        const prod = products.find((p) => p.id === review.productId);
                        return (
                          <div
                            key={review.id}
                            className="bg-surface-low border border-outline-variant/30 rounded-xl p-3.5 space-y-2 hover:border-primary/40 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                      key={s}
                                      className={`w-3 h-3 ${
                                        s <= review.rating ? 'fill-amber-500 text-amber-500' : 'text-outline-variant'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="font-bold text-xs text-on-surface truncate max-w-[150px]">
                                  "{review.title}"
                                </span>
                              </div>
                              <span className="text-[10px] text-outline shrink-0">{review.date}</span>
                            </div>

                            <p className="text-xs text-on-surface-variant line-clamp-1 italic">
                              "{review.comment}"
                            </p>

                            <div className="flex items-center justify-between text-[11px] pt-1 text-outline">
                              <span>
                                By <strong>{review.author || review.userName || 'Patron'}</strong> on {prod?.name || 'Archetype'}
                              </span>
                              {review.adminReply ? (
                                <span className="text-emerald-700 font-semibold">✓ Responded</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleOpenReplyModal(review)}
                                  className="text-primary hover:underline font-semibold cursor-pointer"
                                >
                                  Respond →
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: CATALOG MANAGEMENT */}
          {activeTab === 'catalog' && (
            <div className="space-y-6">
              {/* Action Bar: Search, Category Filter, Stock Filter, Export, and Upload Button */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                  {/* Search */}
                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search items by name, category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-surface-lowest border border-outline-variant/40 rounded-lg pl-9 pr-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Category selector */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-surface-lowest border border-outline-variant/40 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="ALL">All Departments</option>
                    <option value="CLOTHING">Clothing</option>
                    <option value="HOME GOODS">Home Goods</option>
                    <option value="ACCESSORIES">Accessories</option>
                  </select>

                  {/* Stock Level Selector */}
                  <select
                    value={selectedStockFilter}
                    onChange={(e) => setSelectedStockFilter(e.target.value as StockFilter)}
                    className="bg-surface-lowest border border-outline-variant/40 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="ALL">All Stock Levels</option>
                    <option value="IN_STOCK">In Stock (&gt;5)</option>
                    <option value="LOW_STOCK">Low Stock (≤5)</option>
                    <option value="SOLD_OUT">Sold Out (0)</option>
                  </select>
                </div>

                {/* View Switcher & Action Buttons */}
                <div className="flex items-center gap-2.5 shrink-0">
                  {/* View Mode Toggle */}
                  <div className="flex items-center p-1 bg-surface-lowest border border-outline-variant/40 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setCatalogViewMode('table')}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        catalogViewMode === 'table'
                          ? 'bg-primary text-white shadow-subtle'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      title="Table view"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Table</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCatalogViewMode('grid')}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        catalogViewMode === 'grid'
                          ? 'bg-primary text-white shadow-subtle'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      title="Visual card grid view"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Cards</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportCatalogCSV}
                    className="px-3.5 py-2.5 bg-surface-lowest hover:bg-surface-high border border-outline-variant/40 text-on-surface font-label-caps text-xs tracking-label-caps uppercase font-semibold rounded-lg shadow-subtle flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Export catalog as CSV spreadsheet"
                  >
                    <Download className="w-4 h-4 text-primary" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={handleOpenAddModal}
                    className="px-4 py-2.5 bg-primary hover:bg-primary-container text-white font-label-caps text-xs tracking-label-caps uppercase font-semibold rounded-lg shadow-subtle flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload New Item</span>
                  </button>
                </div>
              </div>

            {/* Low Inventory Alert Banner */}
            {lowStockCount > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-800 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-amber-900 uppercase tracking-wider">
                      Low Inventory Threshold Notice
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      <strong>{lowStockCount}</strong> archetypes have 5 or fewer units remaining in studio inventory.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedStockFilter('LOW_STOCK')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300/60 transition-colors cursor-pointer"
                  >
                    View Low Items
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkRestockLow}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary hover:bg-primary-container text-white shadow-subtle transition-colors cursor-pointer"
                  >
                    Bulk Restock +10
                  </button>
                </div>
              </div>
            )}

            {/* Products Display (Table or Grid View) */}
            {catalogViewMode === 'table' ? (
              <div className="bg-surface-lowest border border-on-surface/15 rounded-xl shadow-subtle overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant/30 bg-surface-low text-on-surface-variant font-label-caps text-[11px] tracking-label-caps uppercase">
                        <th className="py-3.5 px-4 font-semibold">Visual (Photo &amp; Symbol)</th>
                        <th className="py-3.5 px-4 font-semibold">Title &amp; Category</th>
                        <th className="py-3.5 px-4 font-semibold">Price</th>
                        <th className="py-3.5 px-4 font-semibold">Colors &amp; Sizes</th>
                        <th className="py-3.5 px-4 font-semibold">Tracked Stock (Direct &amp; +/-)</th>
                        <th className="py-3.5 px-4 font-semibold">Status</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20 text-xs">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                            <Package className="w-8 h-8 mx-auto text-outline/40 mb-2" />
                            <p className="font-semibold text-sm">No items found</p>
                            <p className="text-xs text-outline mt-0.5">
                              Try adjusting your search query or department/stock filter.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => {
                          const stockQty = product.stockQuantity ?? 0;
                          const isLowStock = stockQty > 0 && stockQty <= 5;
                          const isSoldOut = stockQty === 0 || !product.inStock;

                          return (
                            <tr key={product.id} className="hover:bg-surface-low/50 transition-colors">
                              {/* Visual (Photo + Symbol Overlay) */}
                              <td className="py-3 px-4 w-16">
                                <div className="w-12 h-12 rounded-lg border border-outline-variant/30 bg-surface-low flex items-center justify-center p-1 relative overflow-hidden">
                                  {product.imageUrl ? (
                                    <>
                                      <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover rounded"
                                      />
                                      <div
                                        className="absolute bottom-0 right-0 bg-primary/90 text-white p-0.5 rounded-tl shadow-sm"
                                        title={`Symbol: ${product.illustration}`}
                                      >
                                        <ProductIllustration
                                          name={product.illustration}
                                          color={product.colors[0]?.hex}
                                          className="w-3 h-3"
                                        />
                                      </div>
                                    </>
                                  ) : (
                                    <ProductIllustration
                                      name={product.illustration}
                                      color={product.colors[0]?.hex}
                                      className="w-7 h-7 text-primary"
                                    />
                                  )}
                                </div>
                              </td>

                              {/* Title & Category */}
                              <td className="py-3 px-4">
                                <div className="font-semibold text-on-surface hover:text-primary transition-colors">
                                  {product.name}
                                </div>
                                <div className="text-[11px] text-outline font-label-caps uppercase tracking-wider mt-0.5">
                                  {product.category}
                                </div>
                              </td>

                              {/* Price */}
                              <td className="py-3 px-4 font-mono font-bold text-on-surface">
                                ${product.price.toFixed(2)}
                              </td>

                              {/* Colors & Sizes */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1 mb-1">
                                  {product.colors.map((c) => (
                                    <span
                                      key={c.name}
                                      title={c.name}
                                      style={{ backgroundColor: c.hex }}
                                      className="w-3.5 h-3.5 rounded-full border border-black/20 inline-block"
                                    />
                                  ))}
                                </div>
                                <span className="text-[11px] text-on-surface-variant truncate block max-w-xs">
                                  {product.sizes.join(', ')}
                                </span>
                              </td>

                              {/* Stock Quantity Column (Direct Edit + Stepper +/-) */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <button
                                    type="button"
                                    onClick={() => updateStockQuantity(product.id, Math.max(0, stockQty - 1))}
                                    disabled={stockQty <= 0}
                                    className="w-6 h-6 rounded border border-outline-variant/60 flex items-center justify-center text-xs font-bold hover:bg-surface-high disabled:opacity-30 cursor-pointer transition-colors"
                                    title="Decrease stock by 1"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    min="0"
                                    value={stockQty}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value, 10);
                                      updateStockQuantity(product.id, isNaN(val) ? 0 : Math.max(0, val));
                                    }}
                                    className="w-14 bg-surface border border-outline-variant/60 rounded px-1.5 py-0.5 text-center font-mono font-bold text-xs text-on-surface focus:outline-none focus:border-primary"
                                    title="Directly edit stock quantity"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => updateStockQuantity(product.id, stockQty + 1)}
                                    className="w-6 h-6 rounded border border-outline-variant/60 flex items-center justify-center text-xs font-bold hover:bg-surface-high cursor-pointer transition-colors"
                                    title="Increase stock by 1"
                                  >
                                    +
                                  </button>
                                </div>
                                <span
                                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    isSoldOut
                                      ? 'bg-red-50 text-red-700'
                                      : isLowStock
                                      ? 'bg-amber-50 text-amber-800'
                                      : 'bg-olive/15 text-olive'
                                  }`}
                                >
                                  {isSoldOut ? 'Sold Out' : isLowStock ? `Low: ${stockQty}` : `In Stock (${stockQty})`}
                                </span>
                              </td>

                              {/* Stock Status Toggle */}
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => handleToggleStock(product)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                                    product.inStock && stockQty > 0
                                      ? 'bg-olive/15 text-olive hover:bg-olive/25'
                                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                                  }`}
                                >
                                  {product.inStock && stockQty > 0 ? 'Active Stock' : 'Archived / 0'}
                                </button>
                              </td>

                              {/* Actions */}
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleDuplicateProduct(product)}
                                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-high transition-colors"
                                    title="Duplicate item (Clone)"
                                    aria-label="Duplicate item"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenEditModal(product)}
                                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-high transition-colors"
                                    title="Edit item"
                                    aria-label="Edit item"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(product.id, product.name)}
                                    className="p-1.5 rounded-lg text-outline hover:text-red-600 hover:bg-red-50 transition-colors"
                                    title="Delete item"
                                    aria-label="Delete item"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Visual Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.length === 0 ? (
                  <div className="col-span-full bg-surface-lowest border border-outline-variant/30 rounded-2xl p-12 text-center text-on-surface-variant">
                    <Package className="w-8 h-8 mx-auto text-outline/40 mb-2" />
                    <p className="font-semibold text-sm">No items found</p>
                    <p className="text-xs text-outline mt-0.5">
                      Try adjusting your search query or department/stock filter.
                    </p>
                  </div>
                ) : (
                  filteredProducts.map((product) => {
                    const stockQty = product.stockQuantity ?? 0;
                    const isLowStock = stockQty > 0 && stockQty <= 5;
                    const isSoldOut = stockQty === 0 || !product.inStock;

                    return (
                      <div
                        key={product.id}
                        className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-4 shadow-subtle flex flex-col justify-between space-y-3 hover:border-primary/40 hover:shadow-card transition-all group"
                      >
                        <div>
                          {/* Image Container with Symbol Badge */}
                          <div className="w-full aspect-square rounded-xl bg-surface-low border border-outline-variant/30 flex items-center justify-center p-3 relative overflow-hidden mb-3">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-24 h-24 text-primary opacity-80">
                                <ProductIllustration name={product.illustration} color={product.colors[0]?.hex} />
                              </div>
                            )}

                            {/* Department Badge */}
                            <span className="absolute top-2.5 left-2.5 font-label-caps text-[9px] tracking-label-caps uppercase font-bold px-2 py-0.5 rounded bg-surface/90 backdrop-blur border border-outline-variant/30 text-on-surface shadow-xs">
                              {product.category}
                            </span>

                            {/* Stock Badge */}
                            <span
                              className={`absolute top-2.5 right-2.5 font-label-caps text-[9px] tracking-label-caps uppercase font-bold px-2 py-0.5 rounded shadow-xs ${
                                isSoldOut
                                  ? 'bg-red-500 text-white'
                                  : isLowStock
                                  ? 'bg-amber-500 text-white animate-pulse'
                                  : 'bg-emerald-600 text-white'
                              }`}
                            >
                              {isSoldOut ? 'Sold Out' : isLowStock ? `Low (${stockQty})` : `In Stock (${stockQty})`}
                            </span>
                          </div>

                          {/* Product Info */}
                          <div className="space-y-1">
                            <h4 className="font-display-lg text-sm font-bold text-on-surface truncate" title={product.name}>
                              {product.name}
                            </h4>
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-sm text-primary">
                                ${product.price.toFixed(2)}
                              </span>
                              <span className="text-[10px] text-outline font-mono">
                                #{product.id.slice(-6)}
                              </span>
                            </div>
                          </div>

                          {/* Color swatches */}
                          <div className="flex items-center gap-1 mt-2">
                            {product.colors.map((c) => (
                              <span
                                key={c.name}
                                title={c.name}
                                style={{ backgroundColor: c.hex }}
                                className="w-3.5 h-3.5 rounded-full border border-black/20"
                              />
                            ))}
                          </div>
                        </div>

                        {/* Bottom Stock Adjuster & Card Actions */}
                        <div className="pt-3 border-t border-outline-variant/15 space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-semibold text-on-surface-variant">Stock:</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => updateStockQuantity(product.id, Math.max(0, stockQty - 1))}
                                disabled={stockQty <= 0}
                                className="w-6 h-6 rounded border border-outline-variant/60 flex items-center justify-center text-xs font-bold hover:bg-surface-high disabled:opacity-30 cursor-pointer transition-colors"
                                title="Decrease stock"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={stockQty}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  updateStockQuantity(product.id, isNaN(val) ? 0 : Math.max(0, val));
                                }}
                                className="w-12 bg-surface border border-outline-variant/60 rounded px-1 py-0.5 text-center font-mono font-bold text-xs text-on-surface focus:outline-none focus:border-primary"
                              />
                              <button
                                type="button"
                                onClick={() => updateStockQuantity(product.id, stockQty + 1)}
                                className="w-6 h-6 rounded border border-outline-variant/60 flex items-center justify-center text-xs font-bold hover:bg-surface-high cursor-pointer transition-colors"
                                title="Increase stock"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => handleToggleStock(product)}
                              className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase transition-colors cursor-pointer ${
                                product.inStock && stockQty > 0
                                  ? 'bg-olive/15 text-olive hover:bg-olive/25'
                                  : 'bg-red-50 text-red-700 hover:bg-red-100'
                              }`}
                            >
                              {product.inStock && stockQty > 0 ? 'Active' : 'Archived'}
                            </button>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDuplicateProduct(product)}
                                className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-high transition-colors cursor-pointer"
                                title="Duplicate"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(product)}
                                className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-high transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(product.id, product.name)}
                                className="p-1 rounded text-outline hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LIVE ORDERS & FULFILLMENT TRACKING */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Top Order KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-surface-lowest border border-on-surface/15 rounded-xl p-5 shadow-subtle">
                <span className="font-label-caps text-xs uppercase font-semibold text-on-surface-variant">
                  Total Orders
                </span>
                <div className="text-3xl font-bold font-display-lg text-primary mt-1">
                  {(allOrders || []).length}
                </div>
                <span className="text-[11px] text-outline mt-1 block">Studio-wide purchases</span>
              </div>

              <div className="bg-surface-lowest border border-on-surface/15 rounded-xl p-5 shadow-subtle">
                <span className="font-label-caps text-xs uppercase font-semibold text-on-surface-variant">
                  Needs Packaging
                </span>
                <div className="text-3xl font-bold font-display-lg text-amber-600 mt-1 flex items-center gap-2">
                  <span>{processingCount}</span>
                  {processingCount > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold uppercase">
                      Action Needed
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-outline mt-1 block">Awaiting fulfillment dispatch</span>
              </div>

              <div className="bg-surface-lowest border border-on-surface/15 rounded-xl p-5 shadow-subtle">
                <span className="font-label-caps text-xs uppercase font-semibold text-on-surface-variant">
                  In Transit
                </span>
                <div className="text-3xl font-bold font-display-lg text-primary mt-1">
                  {shippedCount}
                </div>
                <span className="text-[11px] text-outline mt-1 block">Handed to carbon-neutral courier</span>
              </div>

              <div className="bg-surface-lowest border border-on-surface/15 rounded-xl p-5 shadow-subtle">
                <span className="font-label-caps text-xs uppercase font-semibold text-on-surface-variant">
                  Gross Sales
                </span>
                <div className="text-3xl font-bold font-display-lg text-olive mt-1">
                  ${totalRevenue.toFixed(2)}
                </div>
                <span className="text-[11px] text-outline mt-1 block">Cumulative order volume</span>
              </div>
            </div>

            {/* Filter, Sort and Search Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div className="relative flex-1 sm:max-w-md">
                <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders (ES-..., patron name, email, city)..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full bg-surface-lowest border border-outline-variant/40 rounded-lg pl-9 pr-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              {/* Status Filters, Sorting & Export */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Status Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {(['ALL', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatusFilter[]).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setOrderStatusFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-label-caps tracking-label-caps uppercase font-semibold transition-colors shrink-0 cursor-pointer ${
                        orderStatusFilter === filter
                          ? 'bg-primary text-white shadow-subtle'
                          : 'bg-surface-lowest border border-outline-variant/40 text-on-surface-variant hover:bg-surface-high'
                      }`}
                    >
                      {filter === 'ALL' ? 'All' : filter}
                    </button>
                  ))}
                </div>

                {/* Sort Order Selector */}
                <select
                  value={orderSort}
                  onChange={(e) => setOrderSort(e.target.value as OrderSortOption)}
                  className="bg-surface-lowest border border-outline-variant/40 rounded-lg px-2.5 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest-total">Highest Total</option>
                  <option value="lowest-total">Lowest Total</option>
                </select>

                {/* Export Orders CSV Button */}
                <button
                  type="button"
                  onClick={handleExportOrdersCSV}
                  className="px-3 py-1.5 bg-surface-lowest hover:bg-surface-high border border-outline-variant/40 text-on-surface font-label-caps text-xs tracking-label-caps uppercase font-semibold rounded-lg shadow-subtle flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  title="Export orders as CSV spreadsheet"
                >
                  <Download className="w-3.5 h-3.5 text-primary" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-surface-lowest border border-on-surface/15 rounded-xl shadow-subtle overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant/30 bg-surface-low text-on-surface-variant font-label-caps text-[11px] tracking-label-caps uppercase">
                      <th className="py-3.5 px-4 font-semibold">Order Details</th>
                      <th className="py-3.5 px-4 font-semibold">Patron / Customer</th>
                      <th className="py-3.5 px-4 font-semibold">Items</th>
                      <th className="py-3.5 px-4 font-semibold">Destination</th>
                      <th className="py-3.5 px-4 font-semibold">Total</th>
                      <th className="py-3.5 px-4 font-semibold">Fulfillment Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 text-xs">
                    {sortedOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                          <Truck className="w-8 h-8 mx-auto text-outline/40 mb-2" />
                          <p className="font-semibold text-sm">No orders matching criteria</p>
                          <p className="text-xs text-outline mt-0.5">
                            Orders placed by visitors or members will automatically appear here.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      sortedOrders.map((order) => {
                        const totalUnits = order.items.reduce((acc, i) => acc + i.quantity, 0);

                        return (
                          <tr key={order.id} className="hover:bg-surface-low/50 transition-colors">
                            {/* Order # and Date */}
                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => {
                                  setInspectingOrder(order);
                                  setIsInspectModalOpen(true);
                                }}
                                className="font-bold text-sm text-primary hover:underline font-mono block text-left"
                              >
                                {order.orderNumber}
                              </button>
                              <span className="text-[11px] text-on-surface-variant">
                                {order.date}
                              </span>
                            </td>

                            {/* Customer Profile */}
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-on-surface">
                                {order.customerName || 'Valued Patron'}
                              </div>
                              <div className="text-[11px] text-on-surface-variant truncate max-w-[160px]">
                                {order.customerEmail || 'guest@esondha.atelier'}
                              </div>
                              <span
                                className={`inline-block mt-0.5 px-1.5 py-0.2 text-[9px] uppercase font-bold rounded ${
                                  order.isGuest
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-primary/10 text-primary'
                                }`}
                              >
                                {order.isGuest ? 'Guest' : 'Member'}
                              </span>
                            </td>

                            {/* Items Preview */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5 mb-1">
                                {order.items.slice(0, 3).map((item, i) => (
                                  <div
                                    key={`${item.id}-${i}`}
                                    className="w-7 h-7 rounded border border-outline-variant/40 bg-surface-low flex items-center justify-center p-0.5"
                                    title={`${item.name} (${item.quantity})`}
                                  >
                                    <ProductIllustration
                                      name={item.illustration}
                                      color={item.selectedColor?.hex}
                                      className="w-4 h-4 stroke-[1.8]"
                                    />
                                  </div>
                                ))}
                                {order.items.length > 3 && (
                                  <span className="text-[10px] text-outline font-semibold">
                                    +{order.items.length - 3}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-on-surface-variant">
                                {totalUnits} {totalUnits === 1 ? 'unit' : 'units'}
                              </span>
                            </td>

                            {/* Destination */}
                            <td className="py-3.5 px-4 text-[11px] text-on-surface-variant">
                              <div className="font-medium text-on-surface">
                                {order.shippingAddress.city}, {order.shippingAddress.state}
                              </div>
                              <div className="text-[10px] text-outline">
                                {order.shippingAddress.country}
                              </div>
                            </td>

                            {/* Total Charged */}
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-sm text-primary">
                                ${order.total.toFixed(2)}
                              </span>
                            </td>

                            {/* Live Status Selector */}
                            <td className="py-3.5 px-4">
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  handleOrderStatusChange(
                                    order.id,
                                    order.orderNumber,
                                    e.target.value as Order['status']
                                  )
                                }
                                className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border cursor-pointer focus:outline-none transition-colors ${
                                  order.status === 'Processing'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200 focus:border-amber-400'
                                    : order.status === 'Shipped'
                                    ? 'bg-primary/10 text-primary border-primary/30 focus:border-primary'
                                    : order.status === 'Delivered'
                                    ? 'bg-olive/15 text-olive border-olive/30 focus:border-olive'
                                    : 'bg-red-50 text-red-700 border-red-200 focus:border-red-400'
                                }`}
                              >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>

                            {/* Action: Inspect Details */}
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => {
                                  setInspectingOrder(order);
                                  setIsInspectModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-lg border border-outline-variant/40 hover:border-primary hover:bg-surface-high text-on-surface text-xs font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-primary" />
                                <span>Inspect</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PATRON REVIEWS & FEEDBACK MODERATION */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Reviews KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-surface-lowest border border-on-surface/15 rounded-xl p-5 shadow-subtle">
                <span className="font-label-caps text-xs uppercase font-semibold text-on-surface-variant">
                  Total Reviews
                </span>
                <div className="text-3xl font-bold font-display-lg text-primary mt-1">
                  {totalReviews}
                </div>
                <span className="text-[11px] text-outline mt-1 block">
                  Across all atelier archetypes
                </span>
              </div>

              <div className="bg-surface-lowest border border-on-surface/15 rounded-xl p-5 shadow-subtle">
                <span className="font-label-caps text-xs uppercase font-semibold text-on-surface-variant">
                  Average Studio Rating
                </span>
                <div className="text-3xl font-bold font-display-lg text-amber-500 mt-1 flex items-center gap-1">
                  <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                  <span>{avgStudioRating}</span>
                  <span className="text-sm text-outline font-normal">/ 5.0</span>
                </div>
                <span className="text-[11px] text-outline mt-1 block">
                  Calculated from live patron submissions
                </span>
              </div>

              <div className="bg-surface-lowest border border-on-surface/15 rounded-xl p-5 shadow-subtle">
                <span className="font-label-caps text-xs uppercase font-semibold text-on-surface-variant">
                  Verified Buyer Rate
                </span>
                <div className="text-3xl font-bold font-display-lg text-olive mt-1">
                  {totalReviews > 0 ? Math.round((verifiedPatronReviews / totalReviews) * 100) : 0}%
                </div>
                <span className="text-[11px] text-outline mt-1 block">
                  {verifiedPatronReviews} verified customer reviews
                </span>
              </div>

              <div className="bg-surface-lowest border border-on-surface/15 rounded-xl p-5 shadow-subtle">
                <span className="font-label-caps text-xs uppercase font-semibold text-on-surface-variant">
                  Patron Recommend Rate
                </span>
                <div className="text-3xl font-bold font-display-lg text-primary mt-1">
                  {recommendPercent}%
                </div>
                <span className="text-[11px] text-outline mt-1 block">
                  Recommend these creations to others
                </span>
              </div>
            </div>

            {/* Action Bar: Search, Star Filter, Product Filter, and CSV Export */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-surface-lowest border border-outline-variant/30 rounded-xl p-4 shadow-subtle">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                {/* Search */}
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by patron, product, keyword..."
                    value={reviewSearchQuery}
                    onChange={(e) => setReviewSearchQuery(e.target.value)}
                    className="w-full bg-surface border border-outline-variant/40 rounded-lg pl-9 pr-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                  {reviewSearchQuery && (
                    <button
                      onClick={() => setReviewSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface text-xs"
                    >
                      &times;
                    </button>
                  )}
                </div>

                {/* Star Filter */}
                <div className="flex items-center gap-1 overflow-x-auto py-1">
                  <button
                    onClick={() => setReviewStarFilter('ALL')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      reviewStarFilter === 'ALL'
                        ? 'bg-primary text-white'
                        : 'bg-surface border border-outline-variant/40 text-on-surface-variant hover:bg-surface-high'
                    }`}
                  >
                    All ({totalReviews})
                  </button>
                  {[5, 4, 3, 2, 1].map((s) => {
                    const count = reviews.filter((r) => r.rating === s).length;
                    return (
                      <button
                        key={s}
                        onClick={() => setReviewStarFilter(s)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                          reviewStarFilter === s
                            ? 'bg-primary text-white'
                            : 'bg-surface border border-outline-variant/40 text-on-surface-variant hover:bg-surface-high'
                        }`}
                      >
                        <Star className={`w-3 h-3 ${reviewStarFilter === s ? 'fill-white' : 'fill-amber-500 text-amber-500'}`} />
                        <span>{s}★ ({count})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Product Filter */}
                <select
                  value={reviewProductFilter}
                  onChange={(e) => setReviewProductFilter(e.target.value)}
                  className="bg-surface border border-outline-variant/40 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="ALL">All Products ({totalReviews})</option>
                  {products.map((p) => {
                    const pReviewsCount = reviews.filter((r) => r.productId === p.id).length;
                    return (
                      <option key={p.id} value={p.id}>
                        {p.name} ({pReviewsCount})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Export Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportReviewsCSV}
                  className="px-3.5 py-2 bg-surface hover:bg-surface-high border border-outline-variant/40 text-on-surface font-label-caps text-xs tracking-label-caps uppercase font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Export all patron reviews to CSV spreadsheet"
                >
                  <FileSpreadsheet className="w-4 h-4 text-primary" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Reviews List */}
            {filteredReviews.length === 0 ? (
              <div className="bg-surface-lowest border border-outline-variant/20 rounded-xl p-12 text-center">
                <MessageSquare className="w-10 h-10 text-outline mx-auto mb-3 opacity-60" />
                <h3 className="font-display-lg text-base font-bold text-on-surface mb-1">
                  No Reviews Found
                </h3>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto mb-4">
                  No patron reviews match your current search query or filter selection.
                </p>
                {(reviewSearchQuery || reviewStarFilter !== 'ALL' || reviewProductFilter !== 'ALL') && (
                  <button
                    onClick={() => {
                      setReviewSearchQuery('');
                      setReviewStarFilter('ALL');
                      setReviewProductFilter('ALL');
                    }}
                    className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-container"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((review) => {
                  const product = products.find((p) => p.id === review.productId);

                  return (
                    <div
                      key={review.id}
                      className="bg-surface-lowest border border-outline-variant/30 rounded-xl p-5 sm:p-6 shadow-subtle transition-all hover:border-primary/30"
                    >
                      {/* Card Header: Product Reference & Star Rating */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-outline-variant/20">
                        {/* Product info */}
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-surface-low border border-outline-variant/30 overflow-hidden flex items-center justify-center shrink-0">
                            {product?.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : product ? (
                              <ProductIllustration
                                name={product.illustration}
                                className="w-8 h-8 stroke-[1.5]"
                              />
                            ) : (
                              <Package className="w-6 h-6 text-outline" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              {product ? (
                                <Link
                                  href={`/product/${product.id}`}
                                  target="_blank"
                                  className="font-display-lg text-sm font-bold text-on-surface hover:text-primary transition-colors flex items-center gap-1"
                                >
                                  <span>{product.name}</span>
                                  <Eye className="w-3 h-3 text-outline" />
                                </Link>
                              ) : (
                                <span className="font-display-lg text-sm font-bold text-on-surface">
                                  Product ID: {review.productId}
                                </span>
                              )}
                              {product && (
                                <span className="font-label-caps text-[10px] tracking-label-caps uppercase font-semibold bg-surface-high text-on-surface-variant px-2 py-0.5 rounded">
                                  {product.category}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-outline">
                              Ref ID: {review.productId} · Review ID: {review.id}
                            </span>
                          </div>
                        </div>

                        {/* Stars & Date */}
                        <div className="flex items-center gap-3 self-start sm:self-auto">
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center text-amber-500">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating ? 'fill-amber-500 text-amber-500' : 'text-outline-variant'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-mono text-xs font-bold text-on-surface">
                              {review.rating.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-xs text-outline">{review.date}</span>
                        </div>
                      </div>

                      {/* Card Body: Title, Comment, Badges */}
                      <div className="py-4 space-y-2">
                        <h4 className="font-headline-md text-sm sm:text-base font-bold text-on-surface">
                          {review.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                          {review.comment}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {(review.verified || review.verifiedBuyer) && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-olive bg-olive/10 border border-olive/20 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified Patron</span>
                            </span>
                          )}
                          {review.recommendProduct !== false && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                              <span>✓ Recommends piece</span>
                            </span>
                          )}
                          <span className="text-xs text-on-surface-variant">
                            By <strong className="text-on-surface">{review.author || review.userName || 'Patron'}</strong>
                            {review.userEmail ? ` (${review.userEmail})` : ''}
                          </span>
                          {(review.helpfulCount ?? 0) > 0 && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-outline ml-auto">
                              <ThumbsUp className="w-3 h-3" />
                              <span>{review.helpfulCount} helpful votes</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Curator Reply (if present) */}
                      {review.adminReply && (
                        <div className="bg-surface-low border border-primary/20 rounded-xl p-4 my-2">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                                <Sparkles className="w-3 h-3" />
                              </div>
                              <span className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary">
                                {review.adminReply.author}
                              </span>
                              <span className="text-[11px] text-outline">
                                · {review.adminReply.date}
                              </span>
                            </div>
                            <button
                              onClick={() => handleOpenReplyModal(review)}
                              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit Response</span>
                            </button>
                          </div>
                          <p className="text-xs text-on-surface-variant leading-relaxed italic pl-7">
                            "{review.adminReply.text}"
                          </p>
                        </div>
                      )}

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between gap-3 pt-3 border-t border-outline-variant/15 mt-2">
                        <div>
                          {!review.adminReply && (
                            <button
                              onClick={() => handleOpenReplyModal(review)}
                              className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Respond as Curator</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {review.adminReply && (
                            <button
                              onClick={() => handleOpenReplyModal(review)}
                              className="px-3 py-1.5 rounded-lg border border-outline-variant/40 hover:border-primary hover:bg-surface-high text-on-surface text-xs font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-primary" />
                              <span>Edit Response</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="px-3 py-1.5 rounded-lg border border-outline-variant/40 hover:border-red-300 hover:bg-red-50 text-outline hover:text-red-700 text-xs font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                            title="Delete this review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ATELIER FAQS & CUSTOMER INQUIRIES */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            {/* KPI / Metric Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-surface-lowest border border-on-surface/15 rounded-xl p-4 shadow-subtle flex items-center justify-between">
                <div>
                  <span className="font-label-caps text-[10px] tracking-label-caps uppercase font-bold text-on-surface-variant block">
                    Total FAQs
                  </span>
                  <span className="text-2xl font-bold font-display-lg text-on-surface">
                    {faqs.length}
                  </span>
                  <span className="text-[11px] text-outline block mt-0.5">
                    Studio knowledge base
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-surface-lowest border border-on-surface/15 rounded-xl p-4 shadow-subtle flex items-center justify-between">
                <div>
                  <span className="font-label-caps text-[10px] tracking-label-caps uppercase font-bold text-amber-700 block">
                    Needs Answer
                  </span>
                  <span className="text-2xl font-bold font-display-lg text-amber-900">
                    {pendingCount}
                  </span>
                  <span className="text-[11px] text-amber-700 block mt-0.5">
                    {pendingCount > 0 ? 'Action required' : 'All questions answered'}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-surface-lowest border border-on-surface/15 rounded-xl p-4 shadow-subtle flex items-center justify-between">
                <div>
                  <span className="font-label-caps text-[10px] tracking-label-caps uppercase font-bold text-emerald-700 block">
                    Live on Storefront
                  </span>
                  <span className="text-2xl font-bold font-display-lg text-emerald-900">
                    {publishedFaqs.length}
                  </span>
                  <span className="text-[11px] text-emerald-700 block mt-0.5">
                    Visible to shoppers
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-surface-lowest border border-on-surface/15 rounded-xl p-4 shadow-subtle flex items-center justify-between">
                <div>
                  <span className="font-label-caps text-[10px] tracking-label-caps uppercase font-bold text-on-surface-variant block">
                    Helpful Votes
                  </span>
                  <span className="text-2xl font-bold font-display-lg text-primary">
                    {faqs.reduce((acc, f) => acc + (f.helpfulCount || 0), 0)}
                  </span>
                  <span className="text-[11px] text-outline block mt-0.5">
                    Shopper confirmations
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-secondary-container/40 text-on-secondary-fixed flex items-center justify-center">
                  <ThumbsUp className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Pending Inquiries Attention Banner */}
            {pendingCount > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-800 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-amber-900 uppercase tracking-wider">
                      {pendingCount} Patron Question{pendingCount > 1 ? 's' : ''} Awaiting Curator Answer
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Shoppers submitted questions from the live FAQ page. Provide an authoritative answer and publish to help future patrons.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFaqStatusFilter('pending');
                    setFaqSort('unanswered-first');
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-subtle transition-colors shrink-0 cursor-pointer"
                >
                  View Unanswered Questions
                </button>
              </div>
            )}

            {/* Search, Filter & Action Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                {/* Search */}
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search questions, answers, patrons..."
                    value={faqSearchQuery}
                    onChange={(e) => setFaqSearchQuery(e.target.value)}
                    className="w-full bg-surface-lowest border border-outline-variant/40 rounded-lg pl-9 pr-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={faqCategoryFilter}
                  onChange={(e) => setFaqCategoryFilter(e.target.value)}
                  className="bg-surface-lowest border border-outline-variant/40 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="ALL">All Categories</option>
                  <option value="orders">Orders &amp; Payment</option>
                  <option value="shipping">Shipping &amp; Transit</option>
                  <option value="returns">Returns &amp; Exchanges</option>
                  <option value="materials">Materials &amp; Care</option>
                  <option value="general">General Atelier</option>
                </select>

                {/* Status Filter */}
                <select
                  value={faqStatusFilter}
                  onChange={(e) => setFaqStatusFilter(e.target.value as 'ALL' | 'pending' | 'published')}
                  className="bg-surface-lowest border border-outline-variant/40 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="ALL">All Statuses ({faqs.length})</option>
                  <option value="pending">Needs Answer ({pendingCount})</option>
                  <option value="published">Published ({publishedFaqs.length})</option>
                </select>

                {/* Sort Option */}
                <select
                  value={faqSort}
                  onChange={(e) => setFaqSort(e.target.value as FAQSortOption)}
                  className="bg-surface-lowest border border-outline-variant/40 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="unanswered-first">Unanswered First</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="most-helpful">Most Helpful Votes</option>
                </select>
              </div>

              {/* Action Buttons: Export CSV & Create New FAQ */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleExportFAQsCSV}
                  className="px-3.5 py-2.5 bg-surface-lowest hover:bg-surface-high border border-outline-variant/40 text-on-surface font-label-caps text-xs tracking-label-caps uppercase font-semibold rounded-lg shadow-subtle flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Export all FAQs to CSV spreadsheet"
                >
                  <Download className="w-4 h-4 text-primary" />
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCreateFaqModalOpen(true)}
                  className="px-4 py-2.5 bg-primary hover:bg-primary-container text-white font-label-caps text-xs tracking-label-caps uppercase font-semibold rounded-lg shadow-subtle flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New FAQ</span>
                </button>
              </div>
            </div>

            {/* FAQs List */}
            {sortedFaqs.length === 0 ? (
              <div className="bg-surface-lowest border border-outline-variant/30 rounded-2xl p-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-surface-low border border-outline-variant/30 flex items-center justify-center mx-auto mb-3 text-outline">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h3 className="font-display-lg text-base font-bold text-on-surface mb-1">
                  No Questions Found
                </h3>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto mb-4">
                  No FAQs match the current filter or search criteria. Try adjusting your query or write a new FAQ.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFaqSearchQuery('');
                    setFaqCategoryFilter('ALL');
                    setFaqStatusFilter('ALL');
                  }}
                  className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedFaqs.map((faq) => {
                  const isPending = faq.status === 'pending' || !faq.answer?.trim();
                  return (
                    <div
                      key={faq.id}
                      className={`bg-surface-lowest border rounded-2xl p-5 sm:p-6 shadow-subtle transition-all space-y-4 ${
                        isPending ? 'border-amber-500/40 bg-amber-500/[0.02]' : 'border-on-surface/15'
                      }`}
                    >
                      {/* Card Header Info */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-outline-variant/15">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Category Badge */}
                          <span className="font-label-caps text-[10px] tracking-label-caps uppercase font-bold px-2.5 py-1 rounded-md bg-surface-low border border-outline-variant/30 text-on-surface">
                            {faq.category}
                          </span>

                          {/* Status Badge */}
                          {isPending ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              <span>Needs Answer</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Live on Storefront</span>
                            </span>
                          )}

                          {faq.helpfulCount > 0 && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-outline ml-1">
                              <ThumbsUp className="w-3 h-3 text-primary" />
                              <span>{faq.helpfulCount} helpful</span>
                            </span>
                          )}
                        </div>

                        {/* Asker info & Asked Date */}
                        <div className="text-xs text-on-surface-variant flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-outline" />
                          <span>Asked on {faq.askedAt}</span>
                          {faq.askedBy?.name && (
                            <span>
                              by <strong className="text-on-surface">{faq.askedBy.name}</strong>
                              {faq.askedBy.email ? ` (${faq.askedBy.email})` : ''}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Question */}
                      <div>
                        <h3 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                            Q
                          </span>
                          <span>{faq.question}</span>
                        </h3>
                      </div>

                      {/* Answer Area */}
                      {faq.answer?.trim() ? (
                        <div className="bg-surface-low border border-outline-variant/30 rounded-xl p-4 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                                <Sparkles className="w-3 h-3" />
                              </div>
                              <span className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary">
                                {faq.answeredBy || 'Atelier Concierge'}
                              </span>
                              {faq.answeredAt && (
                                <span className="text-[11px] text-outline">
                                  · Answered {faq.answeredAt}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-on-surface-variant leading-relaxed pl-7 whitespace-pre-line">
                            {faq.answer}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 text-xs text-amber-900">
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>This question has not been answered yet. It will not appear on the storefront until answered and published.</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenAnswerModal(faq)}
                            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-label-caps text-xs tracking-label-caps uppercase font-semibold transition-colors shrink-0 cursor-pointer shadow-subtle flex items-center gap-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Answer Now</span>
                          </button>
                        </div>
                      )}

                      {/* Card Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant/15">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenAnswerModal(faq)}
                            className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{faq.answer ? 'Edit Answer & Category' : 'Write Answer'}</span>
                          </button>

                          {faq.answer?.trim() && (
                            <button
                              type="button"
                              onClick={() => handleTogglePublishStatus(faq)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                                faq.status === 'published'
                                  ? 'border-outline-variant/40 hover:bg-surface-high text-on-surface-variant'
                                  : 'border-emerald-500/40 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                              }`}
                              title={faq.status === 'published' ? 'Unpublish from live FAQ page' : 'Publish to live FAQ page'}
                            >
                              {faq.status === 'published' ? (
                                <>
                                  <EyeOff className="w-3.5 h-3.5 text-outline" />
                                  <span>Unpublish (Draft)</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Publish Live</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDeleteFAQ(faq.id)}
                            className="px-3 py-1.5 rounded-lg border border-outline-variant/40 hover:border-red-300 hover:bg-red-50 text-outline hover:text-red-700 text-xs font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                            title="Delete this FAQ entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: PATRON INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Header Banner */}
            <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-6 sm:p-8 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-label-caps tracking-label-caps uppercase font-bold text-primary mb-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Store Operations · Client Communications</span>
                </div>
                <h2 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                  Patron Inquiries &amp; Consultations
                </h2>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-1 leading-relaxed">
                  Review and dispatch official curator responses to trade requests, sizing questions, and client dialogue submitted via /contact.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleExportInquiriesCSV}
                  className="px-4 py-2 rounded-xl bg-surface-low hover:bg-surface-high border border-outline-variant/40 text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-primary" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* 4 Inquiries KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-5 shadow-subtle">
                <span className="font-label-caps text-[11px] tracking-label-caps uppercase font-bold text-on-surface-variant">
                  Total Received
                </span>
                <div className="text-3xl font-bold font-display-lg text-on-surface mt-2">
                  {inquiries.length}
                </div>
                <span className="text-[11px] text-outline mt-1 block">Patron notes registered</span>
              </div>

              <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-5 shadow-subtle">
                <span className="font-label-caps text-[11px] tracking-label-caps uppercase font-bold text-on-surface-variant">
                  Unread Queue
                </span>
                <div className={`text-3xl font-bold font-display-lg mt-2 ${unreadInquiriesCount > 0 ? 'text-rose-600' : 'text-on-surface'}`}>
                  {unreadInquiriesCount}
                </div>
                <span className="text-[11px] text-outline mt-1 block">
                  {unreadInquiriesCount > 0 ? 'Awaiting initial curator review' : 'Inbox caught up'}
                </span>
              </div>

              <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-5 shadow-subtle">
                <span className="font-label-caps text-[11px] tracking-label-caps uppercase font-bold text-on-surface-variant">
                  Replied &amp; Resolved
                </span>
                <div className="text-3xl font-bold font-display-lg text-emerald-700 mt-2">
                  {inquiries.filter((i) => i.status === 'replied').length}
                </div>
                <span className="text-[11px] text-outline mt-1 block">Official answers dispatched</span>
              </div>

              <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-5 shadow-subtle">
                <span className="font-label-caps text-[11px] tracking-label-caps uppercase font-bold text-on-surface-variant">
                  Atelier Response SLA
                </span>
                <div className="text-3xl font-bold font-display-lg text-primary mt-2">
                  &lt; 24h
                </div>
                <span className="text-[11px] text-outline mt-1 block">Target consultation turnaround</span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-4 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search inquiries by patron name, email, or keywords..."
                  value={inquirySearchQuery}
                  onChange={(e) => setInquirySearchQuery(e.target.value)}
                  className="w-full bg-surface-low border border-outline-variant/40 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {(['ALL', 'unread', 'replied', 'read'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setInquiryStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors whitespace-nowrap cursor-pointer ${
                      inquiryStatusFilter === st
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-surface-low hover:bg-surface-high text-on-surface-variant'
                    }`}
                  >
                    {st === 'ALL' ? 'All Inquiries' : st}
                    <span className="ml-1.5 text-[10px] opacity-75">
                      ({st === 'ALL' ? inquiries.length : inquiries.filter((i) => i.status === st).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries List */}
            {filteredInquiries.length === 0 ? (
              <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-12 text-center">
                <Mail className="w-10 h-10 text-outline mx-auto mb-3" />
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  No Inquiries Match Your Criteria
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
                  Try adjusting your search keywords or status filter to locate client messages.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInquiries.map((inq) => {
                  const isUnread = inq.status === 'unread';
                  const isReplied = inq.status === 'replied';

                  return (
                    <div
                      key={inq.id}
                      className={`bg-surface-lowest border rounded-2xl p-5 sm:p-6 shadow-subtle transition-all space-y-4 ${
                        isUnread
                          ? 'border-rose-300 ring-1 ring-rose-200'
                          : 'border-on-surface/15 hover:border-outline-variant'
                      }`}
                    >
                      {/* Top Meta Line */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/20 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isUnread
                                ? 'bg-rose-100 text-rose-800'
                                : isReplied
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-surface-low text-on-surface-variant border border-outline-variant/40'
                            }`}
                          >
                            {inq.status}
                          </span>
                          <span className="font-mono text-xs text-outline font-semibold">
                            Ref: #{inq.id}
                          </span>
                          <span className="text-xs text-outline">
                            · {inq.createdAt}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenInquiryReply(inq)}
                            className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>{inq.adminReply ? 'Edit Response' : 'Reply to Patron'}</span>
                          </button>

                          {isUnread ? (
                            <button
                              type="button"
                              onClick={() => updateInquiryStatus(inq.id, 'read')}
                              className="px-2.5 py-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-low text-xs font-semibold text-on-surface-variant transition-colors cursor-pointer"
                              title="Mark as Read"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => updateInquiryStatus(inq.id, 'unread')}
                              className="px-2.5 py-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-low text-xs font-semibold text-on-surface-variant transition-colors cursor-pointer"
                              title="Mark as Unread"
                            >
                              Mark Unread
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="p-1.5 rounded-lg border border-outline-variant/40 hover:border-red-300 hover:bg-red-50 text-outline hover:text-red-700 transition-colors cursor-pointer"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Patron Identity & Subject */}
                      <div>
                        <div className="flex flex-wrap items-baseline gap-2">
                          <h4 className="font-headline-md text-base font-bold text-on-surface">
                            {inq.fullName}
                          </h4>
                          <a
                            href={`mailto:${inq.email}`}
                            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />
                            <span>{inq.email}</span>
                          </a>
                        </div>
                        <p className="text-xs font-semibold text-on-surface mt-1">
                          Subject: {inq.subject}
                        </p>
                      </div>

                      {/* Message Content */}
                      <div className="bg-surface-low border border-outline-variant/30 rounded-xl p-4 text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-line">
                        {inq.message}
                      </div>

                      {/* Admin Response Snippet if replied */}
                      {inq.adminReply && (
                        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 space-y-1">
                          <div className="flex items-center justify-between font-bold text-[11px] uppercase tracking-wider text-emerald-800">
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Official Atelier Curator Response</span>
                            </span>
                            {inq.repliedAt && <span className="font-normal font-mono">{inq.repliedAt}</span>}
                          </div>
                          <p className="leading-relaxed whitespace-pre-line text-emerald-900 pt-1">
                            {inq.adminReply}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: SUBSCRIBERS & VIPS */}
        {activeTab === 'subscribers' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Header Banner */}
            <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-6 sm:p-8 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-label-caps tracking-label-caps uppercase font-bold text-primary mb-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>Audience &amp; VIP Journal</span>
                </div>
                <h2 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                  Newsletter Subscribers &amp; Patron Registry
                </h2>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-1 leading-relaxed">
                  Direct list of patrons who signed up to receive quiet studio editions, new seasonal drops, and slow living dispatches.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyAllEmails}
                  className="px-4 py-2 rounded-xl bg-surface-low hover:bg-surface-high border border-outline-variant/40 text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-primary" />
                  <span>{subscriberCopied ? 'Copied Emails!' : 'Copy All Emails'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportSubscribersCSV}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-semibold flex items-center gap-1.5 shadow-subtle transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-5 shadow-subtle">
                <span className="font-label-caps text-[11px] tracking-label-caps uppercase font-bold text-on-surface-variant">
                  Total Subscribers
                </span>
                <div className="text-3xl font-bold font-display-lg text-primary mt-2">
                  {subscribers.length}
                </div>
                <span className="text-[11px] text-outline mt-1 block">Active community members</span>
              </div>

              <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-5 shadow-subtle">
                <span className="font-label-caps text-[11px] tracking-label-caps uppercase font-bold text-on-surface-variant">
                  Verified Active VIPs
                </span>
                <div className="text-3xl font-bold font-display-lg text-emerald-700 mt-2">
                  {subscribers.filter((s) => s.active).length}
                </div>
                <span className="text-[11px] text-outline mt-1 block">100% deliverable opt-in rate</span>
              </div>

              <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-5 shadow-subtle">
                <span className="font-label-caps text-[11px] tracking-label-caps uppercase font-bold text-on-surface-variant">
                  Last 30 Days Growth
                </span>
                <div className="text-3xl font-bold font-display-lg text-primary mt-2">
                  +{subscribers.length}
                </div>
                <span className="text-[11px] text-outline mt-1 block">Organic patron acquisition</span>
              </div>
            </div>

            {/* Subscriber Search Bar & Table */}
            <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl shadow-subtle overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-outline-variant/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                  <input
                    type="text"
                    placeholder="Search by patron email or source..."
                    value={subscriberSearchQuery}
                    onChange={(e) => setSubscriberSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-surface-low border border-outline-variant/40 rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-all"
                  />
                  {subscriberSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setSubscriberSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <span className="text-xs text-on-surface-variant font-medium self-end sm:self-center">
                  Showing {subscribers.filter((s) => s.email.toLowerCase().includes(subscriberSearchQuery.toLowerCase())).length} of {subscribers.length} patrons
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-outline-variant/30 bg-surface-low/50 font-label-caps text-[11px] tracking-label-caps uppercase text-on-surface-variant">
                      <th className="py-3.5 px-4 font-bold">Patron Email</th>
                      <th className="py-3.5 px-4 font-bold">Origin / Source</th>
                      <th className="py-3.5 px-4 font-bold">Subscription Date</th>
                      <th className="py-3.5 px-4 font-bold">Status</th>
                      <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {subscribers.filter((s) => s.email.toLowerCase().includes(subscriberSearchQuery.toLowerCase())).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-on-surface-variant text-xs italic">
                          No subscribers match your search query.
                        </td>
                      </tr>
                    ) : (
                      subscribers
                        .filter((s) => s.email.toLowerCase().includes(subscriberSearchQuery.toLowerCase()))
                        .map((sub) => (
                          <tr key={sub.id} className="hover:bg-surface-low/60 transition-colors">
                            <td className="py-3.5 px-4 font-medium text-on-surface">
                              <span className="font-mono text-xs">{sub.email}</span>
                            </td>
                            <td className="py-3.5 px-4 text-on-surface-variant">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface border border-outline-variant/40 text-[10px] font-semibold text-primary">
                                {sub.source || 'Studio Storefront'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-on-surface-variant text-[11px] font-mono">
                              {sub.subscribedAt}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                Active VIP
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(sub.email);
                                    showToast(`Copied "${sub.email}" to clipboard.`);
                                  }}
                                  className="p-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-high text-outline hover:text-on-surface transition-colors cursor-pointer"
                                  title="Copy Email"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSubscriber(sub.id)}
                                  className="p-1.5 rounded-lg border border-outline-variant/40 hover:border-red-300 hover:bg-red-50 text-outline hover:text-red-700 transition-colors cursor-pointer"
                                  title="Remove Subscriber"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: LOOKBOOK & LIVING CAPSULES */}
        {activeTab === 'lookbook' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Header Banner */}
            <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-6 sm:p-8 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-label-caps tracking-label-caps uppercase font-bold text-primary mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Visual Merchandising &amp; Spatial Vignettes</span>
                </div>
                <h2 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                  Lookbook &amp; Living Capsules
                </h2>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-1 leading-relaxed">
                  Manage interactive 3D spatial vignettes featured across the storefront. Curate 3 harmonious archetypes per capsule, choose ambient tonal lighting themes, and configure page display.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleOpenNewCapsule}
                  className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-semibold flex items-center gap-2 shadow-subtle transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Capsule</span>
                </button>
              </div>
            </div>

            {/* Storefront Display Master Switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Home Page Switch */}
              <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-5 shadow-subtle flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-label-caps text-xs font-bold uppercase tracking-wider text-on-surface">
                      Home Page Living Vignette
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        storeSettings.showLookbookOnHome !== false
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-stone-100 text-stone-600 border border-stone-300'
                      }`}
                    >
                      {storeSettings.showLookbookOnHome !== false ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Positions the living lookbook directly under the Hero section for immediate lifestyle immersion.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleShowOnHome}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    storeSettings.showLookbookOnHome !== false ? 'bg-primary' : 'bg-outline-variant/50'
                  }`}
                  role="switch"
                  aria-checked={storeSettings.showLookbookOnHome !== false}
                  aria-label="Toggle Lookbook on Home Page"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      storeSettings.showLookbookOnHome !== false ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Shop Page Switch */}
              <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-5 shadow-subtle flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-label-caps text-xs font-bold uppercase tracking-wider text-on-surface">
                      Shop Page Lookbook Studio
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        storeSettings.showLookbookOnShop !== false
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-stone-100 text-stone-600 border border-stone-300'
                      }`}
                    >
                      {storeSettings.showLookbookOnShop !== false ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Renders interactive spatial capsules above the catalog product grid with auto-cycling.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleShowOnShop}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    storeSettings.showLookbookOnShop !== false ? 'bg-primary' : 'bg-outline-variant/50'
                  }`}
                  role="switch"
                  aria-checked={storeSettings.showLookbookOnShop !== false}
                  aria-label="Toggle Lookbook on Shop Page"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      storeSettings.showLookbookOnShop !== false ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Auto-Advance Speed / Transition Time Setting */}
            <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-label-caps text-xs font-bold uppercase tracking-wider text-on-surface">
                    Auto-Advance Transition Speed
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                    {(storeSettings.lookbookTransitionInterval || 2.0).toFixed(1)}s per capsule
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Controls how fast the lookbook automatically advances to the next capsule on both Home and Shop pages. Pauses automatically when a patron hovers to inspect.
                </p>
              </div>

              {/* Speed Presets & Custom Input */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {[
                  { label: '1.2s Rapid', val: 1.2 },
                  { label: '1.8s Fast', val: 1.8 },
                  { label: '2.5s Brisk', val: 2.5 },
                  { label: '3.5s Balanced', val: 3.5 },
                  { label: '5.0s Calm', val: 5.0 },
                ].map((preset) => {
                  const currentVal = storeSettings.lookbookTransitionInterval || 2.0;
                  const isSelected = Math.abs(currentVal - preset.val) < 0.15;
                  return (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => {
                        updateStoreSettings({ lookbookTransitionInterval: preset.val });
                        showToast(`Lookbook transition speed set to ${preset.val}s.`);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-surface-low hover:bg-surface-high text-on-surface border border-outline-variant/30'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}

                {/* Custom Number Input */}
                <div className="flex items-center gap-1.5 pl-2 border-l border-outline-variant/30">
                  <input
                    type="number"
                    min={0.8}
                    max={15}
                    step={0.2}
                    value={storeSettings.lookbookTransitionInterval || 2.0}
                    onChange={(e) => {
                      const num = parseFloat(e.target.value);
                      if (!isNaN(num) && num >= 0.5) {
                        updateStoreSettings({ lookbookTransitionInterval: num });
                      }
                    }}
                    className="w-16 bg-surface-low border border-outline-variant/40 rounded-lg px-2 py-1 text-xs font-mono font-bold text-on-surface focus:outline-none focus:border-primary text-center"
                  />
                  <span className="text-xs font-mono text-outline">sec</span>
                </div>
              </div>
            </div>

            {/* Capsules Listing */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  Configured Capsules ({(storeSettings.lookbookCapsules || []).length})
                </h3>
                <span className="text-xs text-on-surface-variant">
                  Capsules cycle sequentially with graceful auto-transitions.
                </span>
              </div>

              {(storeSettings.lookbookCapsules || []).length === 0 ? (
                <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-surface-low border border-outline-variant/30 text-primary flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">No Lookbook Capsules Created</h4>
                    <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
                      Create your first capsule to showcase a 3-piece living spatial vignette on the store.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenNewCapsule}
                    className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Capsule</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {(storeSettings.lookbookCapsules || []).map((capsule, index) => {
                    const matchedProducts = (capsule.productIds || []).map((pid) =>
                      products.find((p) => p.id === pid)
                    );

                    const themeStyles: Record<string, { label: string; bg: string; border: string }> = {
                      'warm-sand': { label: 'Kyoto Warm Sand', bg: 'bg-[#f4efe8]', border: 'border-[#c5b8a5]' },
                      'nordic-slate': { label: 'Nordic Slate Mist', bg: 'bg-[#eef2f5]', border: 'border-[#b3c1cf]' },
                      'porto-terracotta': { label: 'Porto Terracotta', bg: 'bg-[#f7efe9]', border: 'border-[#caa691]' },
                      'sage-botanical': { label: 'Kyoto Sage Botanical', bg: 'bg-[#f0f4ee]', border: 'border-[#9fb198]' },
                    };
                    const currentTheme = themeStyles[capsule.theme] || themeStyles['warm-sand'];

                    return (
                      <div
                        key={capsule.id}
                        className={`bg-surface-lowest border rounded-2xl p-5 sm:p-6 shadow-subtle transition-all ${
                          capsule.enabled !== false ? 'border-on-surface/15' : 'border-outline-variant/20 opacity-70'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-bold text-primary">
                                #{index + 1 < 10 ? `0${index + 1}` : index + 1}
                              </span>
                              <span className="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                                {capsule.eyebrow || 'Lookbook Capsule'}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${currentTheme.bg} ${currentTheme.border} text-on-surface`}
                              >
                                <span className="w-2 h-2 rounded-full bg-primary" />
                                {currentTheme.label}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  capsule.enabled !== false
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-stone-100 text-stone-600 border border-stone-300'
                                }`}
                              >
                                {capsule.enabled !== false ? 'Live' : 'Disabled'}
                              </span>

                              {/* Separate Home / Shop Placement Badges (1-Click Toggle) */}
                              <button
                                type="button"
                                onClick={() => handleToggleCapsuleHome(capsule.id)}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                                  capsule.showOnHome !== false
                                    ? 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 shadow-2xs'
                                    : 'bg-stone-100 text-stone-400 border-stone-200 hover:bg-stone-200'
                                }`}
                                title="Click to toggle Home Page placement"
                              >
                                <span>Home:</span>
                                <span>{capsule.showOnHome !== false ? 'Active ✓' : 'Off ✗'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleCapsuleShop(capsule.id)}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                                  capsule.showOnShop !== false
                                    ? 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100 shadow-2xs'
                                    : 'bg-stone-100 text-stone-400 border-stone-200 hover:bg-stone-200'
                                }`}
                                title="Click to toggle Shop Page placement"
                              >
                                <span>Shop:</span>
                                <span>{capsule.showOnShop !== false ? 'Active ✓' : 'Off ✗'}</span>
                              </button>
                            </div>
                            <h4 className="font-display-lg text-lg sm:text-xl font-bold text-on-surface">
                              {capsule.title}
                            </h4>
                            <p className="text-xs text-on-surface-variant max-w-2xl leading-relaxed">
                              {capsule.description || 'No description entered.'}
                            </p>
                            <span className="text-[11px] font-mono text-outline block pt-0.5">
                              Studio: {capsule.studioTag || 'Atelier Living Studio'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
                            <button
                              type="button"
                              onClick={() => handleToggleCapsuleEnabled(capsule.id)}
                              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                                capsule.enabled !== false
                                  ? 'border-outline-variant/40 bg-surface-low hover:bg-surface-high text-on-surface'
                                  : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                              }`}
                            >
                              {capsule.enabled !== false ? (
                                <>
                                  <EyeOff className="w-3.5 h-3.5 text-outline" />
                                  <span>Disable</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>Enable</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEditCapsule(capsule)}
                              className="px-3 py-1.5 rounded-xl border border-outline-variant/40 bg-surface-low hover:bg-surface-high text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-primary" />
                              <span>Edit Capsule</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteCapsule(capsule.id, capsule.title)}
                              className="p-2 rounded-xl border border-outline-variant/40 hover:border-red-300 hover:bg-red-50 text-outline hover:text-red-700 transition-colors cursor-pointer"
                              title="Delete Capsule"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* 3 Curated Products Cards */}
                        <div className="pt-4">
                          <span className="font-label-caps text-[10px] uppercase font-bold text-outline tracking-wider block mb-2.5">
                            Curated 3-Piece Composition:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {matchedProducts.map((prod, pIdx) => {
                              const slotPositions = ['Left (01)', 'Center (02)', 'Right (03)'];
                              if (!prod) {
                                return (
                                  <div
                                    key={`slot-${pIdx}`}
                                    className="p-3 rounded-xl border border-dashed border-outline-variant/40 bg-surface-low/30 text-xs text-outline italic"
                                  >
                                    Slot {slotPositions[pIdx]}: Product not found (ID: {capsule.productIds[pIdx]})
                                  </div>
                                );
                              }
                              return (
                                <div
                                  key={`slot-${pIdx}-${prod.id}`}
                                  className="p-2.5 rounded-xl border border-outline-variant/30 bg-surface-low/50 flex items-center gap-3"
                                >
                                  <div className="w-10 h-10 rounded-lg bg-surface-lowest border border-outline-variant/20 flex items-center justify-center shrink-0 overflow-hidden">
                                    {prod.imageUrl ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img
                                        src={prod.imageUrl}
                                        alt={prod.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <ProductIllustration
                                        name={prod.illustration}
                                        color={prod.colors?.[0]?.hex || '#25435a'}
                                        className="w-6 h-6 stroke-[1.4]"
                                      />
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <span className="text-[10px] font-mono text-outline block">
                                      {slotPositions[pIdx]} · {prod.category}
                                    </span>
                                    <h5 className="text-xs font-bold text-on-surface truncate">
                                      {prod.name}
                                    </h5>
                                    <span className="text-xs font-bold text-primary font-mono block">
                                      ${prod.price.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* DEDICATED TAB: CURATOR'S CHOICE SPOTLIGHT */}
        {activeTab === 'curator' && (
          <div className="space-y-6">
            {/* Header / Intro */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-outline-variant/30 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-primary/20 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display-lg text-xl sm:text-2xl font-bold text-on-surface">
                      Curator&rsquo;s Choice Spotlight
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                      Homepage Hero
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Manage featured archetypes, auto-advance speed, and rotation sequence with ambient diagonal triangular reveal on the homepage.
                  </p>
                </div>
              </div>

              <Link
                href="/"
                target="_blank"
                className="btn-interactive px-4 py-2 rounded-xl bg-surface-low hover:bg-surface-high border border-outline-variant/40 text-xs font-semibold text-on-surface flex items-center gap-2 transition-all cursor-pointer shrink-0"
              >
                <span>View Live on Store</span>
                <ExternalLink className="w-3.5 h-3.5 text-primary" />
              </Link>
            </div>

            {(() => {
              const currentCuratorIds =
                storeSettings.curatorChoiceProductIds && storeSettings.curatorChoiceProductIds.length > 0
                  ? storeSettings.curatorChoiceProductIds
                  : [
                      storeSettings.curatorChoiceProductId || products[0]?.id || 'prod-1',
                      products[7]?.id || 'prod-8',
                      products[3]?.id || 'prod-4',
                    ];

              const currentSpeed = storeSettings.curatorChoiceTransitionInterval || 4.5;
              const isManual = storeSettings.curatorChoiceMode === 'manual';

              const handleSetSpeed = (sec: number) => {
                updateStoreSettings({ curatorChoiceTransitionInterval: sec });
                setTempSettings((prev) => ({ ...prev, curatorChoiceTransitionInterval: sec }));
                showToast(`Curator's Choice auto-advance speed set to ${sec}s.`);
              };

              const handleSetMode = (mode: 'dynamic' | 'manual') => {
                updateStoreSettings({ curatorChoiceMode: mode });
                setTempSettings((prev) => ({ ...prev, curatorChoiceMode: mode }));
                showToast(`Curator's Choice mode switched to ${mode === 'dynamic' ? 'Dynamic Affinity' : 'Manual Studio Curation'}.`);
              };

              const handleMove = (idx: number, dir: 'up' | 'down') => {
                const newIds = [...currentCuratorIds];
                const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
                if (targetIdx < 0 || targetIdx >= newIds.length) return;
                const temp = newIds[idx];
                newIds[idx] = newIds[targetIdx];
                newIds[targetIdx] = temp;
                updateStoreSettings({
                  curatorChoiceProductIds: newIds,
                  curatorChoiceProductId: newIds[0],
                });
                setTempSettings((prev) => ({
                  ...prev,
                  curatorChoiceProductIds: newIds,
                  curatorChoiceProductId: newIds[0],
                }));
                showToast('Curator rotation sequence updated.');
              };

              const handleRemove = (idx: number, name: string) => {
                if (currentCuratorIds.length <= 1) {
                  showToast('At least one piece must remain in Curator\'s Choice.');
                  return;
                }
                const newIds = currentCuratorIds.filter((_, i) => i !== idx);
                updateStoreSettings({
                  curatorChoiceProductIds: newIds,
                  curatorChoiceProductId: newIds[0],
                });
                setTempSettings((prev) => ({
                  ...prev,
                  curatorChoiceProductIds: newIds,
                  curatorChoiceProductId: newIds[0],
                }));
                showToast(`Removed "${name}" from Curator's Choice.`);
              };

              const handleAdd = () => {
                if (!selectedCuratorToAdd) {
                  showToast('Please select a product from the catalog dropdown first.');
                  return;
                }
                if (currentCuratorIds.includes(selectedCuratorToAdd)) {
                  showToast('This product is already in Curator\'s Choice spotlight.');
                  return;
                }
                const newIds = [...currentCuratorIds, selectedCuratorToAdd];
                updateStoreSettings({
                  curatorChoiceProductIds: newIds,
                  curatorChoiceProductId: newIds[0],
                });
                setTempSettings((prev) => ({
                  ...prev,
                  curatorChoiceProductIds: newIds,
                  curatorChoiceProductId: newIds[0],
                }));
                const prod = products.find((p) => p.id === selectedCuratorToAdd);
                showToast(`Added "${prod?.name || selectedCuratorToAdd}" to Curator's Choice.`);
                setSelectedCuratorToAdd('');
              };

              const handleReset = () => {
                const defaults = ['prod-1', 'prod-8', 'prod-4'];
                updateStoreSettings({
                  curatorChoiceProductIds: defaults,
                  curatorChoiceProductId: defaults[0],
                });
                setTempSettings((prev) => ({
                  ...prev,
                  curatorChoiceProductIds: defaults,
                  curatorChoiceProductId: defaults[0],
                }));
                showToast('Reset Curator\'s Choice to standard 3 studio archetypes.');
              };

              return (
                <div className="space-y-6">
                  {/* Summary Metric Pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-4 shadow-subtle flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {currentCuratorIds.length}
                      </div>
                      <div>
                        <span className="text-[10px] font-label-caps uppercase font-bold text-outline">
                          Curated Archetypes
                        </span>
                        <div className="text-sm font-bold text-on-surface">
                          {currentCuratorIds.length} Pieces in Rotation
                        </div>
                      </div>
                    </div>

                    <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-4 shadow-subtle flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-label-caps uppercase font-bold text-outline">
                          Auto-Advance Speed
                        </span>
                        <div className="text-sm font-bold text-on-surface">
                          {currentSpeed.toFixed(1)}s per Piece
                        </div>
                      </div>
                    </div>

                    <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-4 shadow-subtle flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-label-caps uppercase font-bold text-outline">
                          Active Curation Mode
                        </span>
                        <div className="text-sm font-bold text-on-surface truncate">
                          {isManual ? 'Manual Studio Sequence' : 'Dynamic Patron Affinity'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mode Selector Card */}
                  <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-5 shadow-subtle space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/20">
                      <div>
                        <span className="font-label-caps text-xs font-bold uppercase tracking-wider text-on-surface block">
                          Spotlight Selection Algorithm
                        </span>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          Choose whether the hero card automatically personalizes pieces to each patron or follows the exact manual studio sequence below.
                        </p>
                      </div>

                      <div className="flex items-center gap-1 bg-surface-low p-1 rounded-xl border border-outline-variant/40 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleSetMode('dynamic')}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            !isManual
                              ? 'bg-primary text-white shadow-xs'
                              : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          Dynamic Affinity
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetMode('manual')}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            isManual
                              ? 'bg-primary text-white shadow-xs'
                              : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          Manual Sequence
                        </button>
                      </div>
                    </div>

                    {!isManual ? (
                      <div className="p-3.5 bg-secondary-container/25 border border-secondary-container rounded-xl text-xs text-on-surface flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-bold text-primary">Dynamic Patron Personalization Active</p>
                          <p className="text-on-surface-variant leading-relaxed">
                            The homepage automatically balances departments (Clothing, Home Goods, Accessories) and showcases pieces matched to each patron&rsquo;s recent views, cart items, and wishlist. If a visitor is brand new with no history, the spotlight defaults to the pieces configured below.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 bg-surface-low border border-outline-variant/30 rounded-xl text-xs text-on-surface flex items-start gap-2.5">
                        <Star className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-bold text-on-surface">Manual Studio Sequence Active</p>
                          <p className="text-on-surface-variant leading-relaxed">
                            All visitors will see the exact archetypes configured below in rotation, cycling in numerical sequence `#01 &rarr; #02 &rarr; #03 ...` with triangular transitions.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Auto-Advance Speed / Transition Time Control Card */}
                  <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-label-caps text-xs font-bold uppercase tracking-wider text-on-surface">
                          Auto-Advance Transition Speed
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                          {currentSpeed.toFixed(1)}s per piece
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Controls the duration each piece is spotlighted before automatically cycling to the next archetype. Automatically freezes when a visitor hovers to inspect.
                      </p>
                    </div>

                    {/* Speed Presets & Custom Input */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {[
                        { label: '2.0s Rapid', val: 2.0 },
                        { label: '3.0s Brisk', val: 3.0 },
                        { label: '4.5s Balanced', val: 4.5 },
                        { label: '6.0s Relaxed', val: 6.0 },
                        { label: '8.0s Slow', val: 8.0 },
                      ].map((preset) => {
                        const isSelected = Math.abs(currentSpeed - preset.val) < 0.15;
                        return (
                          <button
                            key={preset.val}
                            type="button"
                            onClick={() => handleSetSpeed(preset.val)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-primary text-white shadow-xs'
                                : 'bg-surface-low hover:bg-surface-high text-on-surface border border-outline-variant/30'
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}

                      {/* Custom Number Input */}
                      <div className="flex items-center gap-1.5 pl-2 border-l border-outline-variant/30">
                        <input
                          type="number"
                          min={1.0}
                          max={25}
                          step={0.5}
                          value={currentSpeed}
                          onChange={(e) => {
                            const num = parseFloat(e.target.value);
                            if (!isNaN(num) && num >= 0.5) {
                              handleSetSpeed(num);
                            }
                          }}
                          className="w-16 bg-surface-low border border-outline-variant/40 rounded-lg px-2 py-1 text-xs font-mono font-bold text-on-surface focus:outline-none focus:border-primary text-center"
                        />
                        <span className="text-xs font-mono text-outline">sec</span>
                      </div>
                    </div>
                  </div>

                  {/* Curated Spotlight Archetypes List */}
                  <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-outline-variant/20 gap-2">
                      <div>
                        <h3 className="font-headline-md text-base font-bold text-on-surface">
                          Curated Spotlight Archetypes ({currentCuratorIds.length})
                        </h3>
                        <p className="text-xs text-on-surface-variant">
                          Arrange the sequence or remove pieces to customize the rotation.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-3 py-1.5 rounded-xl bg-surface-low hover:bg-surface-high border border-outline-variant/40 text-xs font-semibold text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                        title="Restore 3 standard slow-living archetypes"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Defaults</span>
                      </button>
                    </div>

                    {/* Pieces Stack */}
                    <div className="space-y-2.5">
                      {currentCuratorIds.map((pid, idx) => {
                        const prod = products.find((p) => p.id === pid);
                        return (
                          <div
                            key={`${pid}-${idx}`}
                            className="flex items-center justify-between p-3 sm:p-3.5 bg-surface-low/50 hover:bg-surface-low border border-outline-variant/30 hover:border-outline-variant/50 rounded-2xl gap-3 transition-all"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <span className="w-7 h-7 rounded-xl bg-surface-lowest border border-outline-variant/40 flex items-center justify-center font-mono text-xs font-bold text-primary shrink-0 shadow-2xs">
                                0{idx + 1}
                              </span>

                              <div className="w-12 h-12 rounded-xl bg-surface-lowest overflow-hidden shrink-0 border border-outline-variant/20 flex items-center justify-center">
                                {prod?.imageUrl ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                                ) : (
                                  <ProductIllustration
                                    name={(prod?.illustration as any) || 'vase'}
                                    color={prod?.colors?.[0]?.hex}
                                    className="w-7 h-7"
                                  />
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-xs sm:text-sm font-bold text-on-surface truncate">
                                    {prod?.name || pid}
                                  </h4>
                                  {idx === 0 && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 shrink-0">
                                      Lead Slot (Hero Initial)
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-on-surface-variant mt-0.5">
                                  <span className="font-bold text-primary font-mono">${(prod?.price || 0).toFixed(2)}</span>
                                  <span>·</span>
                                  <span>{prod?.category || 'OBJECT'}</span>
                                  <span>·</span>
                                  <span className={prod?.inStock ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>
                                    {prod?.inStock ? 'In Stock' : 'Out of Stock'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Move Up, Down, Delete actions */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMove(idx, 'up')}
                                className="p-2 rounded-xl border border-outline-variant/40 bg-surface-lowest hover:bg-surface text-on-surface disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
                                title="Move Earlier in Sequence"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                disabled={idx === currentCuratorIds.length - 1}
                                onClick={() => handleMove(idx, 'down')}
                                className="p-2 rounded-xl border border-outline-variant/40 bg-surface-lowest hover:bg-surface text-on-surface disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
                                title="Move Later in Sequence"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                disabled={currentCuratorIds.length <= 1}
                                onClick={() => handleRemove(idx, prod?.name || pid)}
                                className="p-2 rounded-xl border border-outline-variant/40 hover:border-red-300 bg-surface-lowest hover:bg-red-50 text-outline hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
                                title="Remove from Spotlight"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add Product Dropdown Bar */}
                    <div className="pt-3 border-t border-outline-variant/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      <select
                        value={selectedCuratorToAdd}
                        onChange={(e) => setSelectedCuratorToAdd(e.target.value)}
                        className="flex-1 bg-surface-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary font-medium"
                      >
                        <option value="">Select an archetype from catalog to add...</option>
                        {products.map((p) => {
                          const isAlready = currentCuratorIds.includes(p.id);
                          return (
                            <option key={p.id} value={p.id}>
                              {p.name} — ${p.price.toFixed(2)} ({p.category}) {isAlready ? '✓ Currently in Spotlight' : ''}
                            </option>
                          );
                        })}
                      </select>

                      <button
                        type="button"
                        onClick={handleAdd}
                        className="px-5 py-2.5 bg-primary hover:bg-primary-container text-white text-xs font-semibold rounded-xl shadow-subtle inline-flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Archetype</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 3: STOREFRONT SETTINGS & PASSWORD MANAGEMENT */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-8">
            {/* Section A: Admin Password Configuration */}
            <div className="bg-surface-lowest border border-on-surface/15 rounded-xl p-6 sm:p-8 shadow-subtle space-y-5">
              <div className="flex items-center gap-3 border-b border-outline-variant/25 pb-4">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-headline-lg text-lg sm:text-xl font-bold text-on-surface">
                    Studio Access Passcode
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Change the staff passcode used to unlock this administrative dashboard.
                  </p>
                </div>
              </div>

              <div className="bg-surface-low border border-outline-variant/30 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-on-surface-variant block">Active Studio Passcode:</span>
                  <span className="font-mono font-bold text-base text-primary tracking-wider">
                    {activePasscode}
                  </span>
                </div>
                <span className="text-[11px] text-outline italic">
                  Default: admin2026
                </span>
              </div>

              <form onSubmit={handleUpdatePasscode} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5">
                      New Staff Passcode
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPasscode ? 'text' : 'password'}
                        required
                        value={newPasscode}
                        onChange={(e) => setNewPasscode(e.target.value)}
                        placeholder="Enter new passcode..."
                        className="w-full bg-surface border border-outline-variant/50 rounded-lg pl-3.5 pr-10 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPasscode(!showNewPasscode)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-0.5 rounded transition-colors cursor-pointer"
                        title={showNewPasscode ? 'Hide passcode' : 'Show passcode'}
                      >
                        {showNewPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5">
                      Confirm New Passcode
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPasscode ? 'text' : 'password'}
                        required
                        value={confirmPasscode}
                        onChange={(e) => setConfirmPasscode(e.target.value)}
                        placeholder="Repeat new passcode..."
                        className="w-full bg-surface border border-outline-variant/50 rounded-lg pl-3.5 pr-10 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPasscode(!showConfirmPasscode)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-0.5 rounded transition-colors cursor-pointer"
                        title={showConfirmPasscode ? 'Hide passcode' : 'Show passcode'}
                      >
                        {showConfirmPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {passcodeMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      passcodeMsg.type === 'error'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-olive/10 text-olive border border-olive/30'
                    }`}
                  >
                    {passcodeMsg.type === 'error' ? (
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-olive" />
                    )}
                    <span>{passcodeMsg.text}</span>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary hover:bg-primary-container text-white font-label-caps text-xs tracking-label-caps uppercase font-semibold rounded-lg shadow-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Update Passcode</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Section B: General Storefront Settings */}
            <div className="bg-surface-lowest border border-on-surface/15 rounded-xl p-6 sm:p-8 shadow-subtle space-y-6">
              <div>
                <h2 className="font-headline-lg text-lg sm:text-xl font-bold text-on-surface">
                  Storefront Content &amp; Shipping Thresholds
                </h2>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
                  Customize headlines, free shipping thresholds, studio contact details, and site banners.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={tempSettings.storeName}
                      onChange={(e) => setTempSettings({ ...tempSettings, storeName: e.target.value })}
                      className="w-full bg-surface border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5">
                      Free Shipping Threshold ($)
                    </label>
                    <input
                      type="number"
                      step="5"
                      min="0"
                      value={tempSettings.freeShippingThreshold}
                      onChange={(e) =>
                        setTempSettings({
                          ...tempSettings,
                          freeShippingThreshold: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-surface border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5">
                    Hero Subheadline Badge
                  </label>
                  <input
                    type="text"
                    value={tempSettings.heroSubheadline}
                    onChange={(e) => setTempSettings({ ...tempSettings, heroSubheadline: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5">
                    Hero Main Headline
                  </label>
                  <input
                    type="text"
                    value={tempSettings.heroHeadline}
                    onChange={(e) => setTempSettings({ ...tempSettings, heroHeadline: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5">
                    Hero Editorial Description
                  </label>
                  <textarea
                    rows={3}
                    value={tempSettings.heroDescription}
                    onChange={(e) => setTempSettings({ ...tempSettings, heroDescription: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm text-on-surface focus:outline-none focus:border-primary resize-y"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={tempSettings.contactEmail}
                      onChange={(e) => setTempSettings({ ...tempSettings, contactEmail: e.target.value })}
                      className="w-full bg-surface border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      value={tempSettings.contactPhone}
                      onChange={(e) => setTempSettings({ ...tempSettings, contactPhone: e.target.value })}
                      className="w-full bg-surface border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5">
                    Studio Atelier Address
                  </label>
                  <input
                    type="text"
                    value={tempSettings.studioAddress}
                    onChange={(e) => setTempSettings({ ...tempSettings, studioAddress: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5">
                    Storefront Top Rotating Announcement Bar
                  </label>
                  <input
                    type="text"
                    value={tempSettings.announcementText || ''}
                    onChange={(e) => setTempSettings({ ...tempSettings, announcementText: e.target.value })}
                    placeholder="Complimentary Carbon-Neutral Shipping on orders over $100"
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg px-3.5 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                  <span className="text-[11px] text-outline mt-1 block">
                    Broadcasted in real-time on the top marquee strip across all storefront pages.
                  </span>
                </div>

                {/* Homepage Curator's Choice Section (Speed Control & Dynamic Items Management) */}
                <div className="p-4 sm:p-5 bg-surface-low rounded-xl border border-outline-variant/30 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-outline-variant/20">
                    <div>
                      <label className="block font-label-caps text-xs tracking-label-caps uppercase font-bold text-on-surface">
                        Homepage Hero Curator&rsquo;s Choice Spotlight
                      </label>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Feature archetypes displayed with ambient spotlight in the homepage hero card, cycling with a quiet atelier transition animation.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setActiveTab('curator')}
                        className="btn-interactive px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>Open Curator&rsquo;s Choice Menu</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      {/* Mode Toggle Pill */}
                      <div className="flex items-center gap-1 bg-surface-lowest p-1 rounded-lg border border-outline-variant/40 shrink-0">
                      <button
                        type="button"
                        onClick={() => setTempSettings({ ...tempSettings, curatorChoiceMode: 'dynamic' })}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                          (tempSettings.curatorChoiceMode || 'dynamic') === 'dynamic'
                            ? 'bg-primary text-white shadow-2xs'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        Dynamic Affinity
                      </button>
                      <button
                        type="button"
                        onClick={() => setTempSettings({ ...tempSettings, curatorChoiceMode: 'manual' })}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                          tempSettings.curatorChoiceMode === 'manual'
                            ? 'bg-primary text-white shadow-2xs'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        Manual Curation
                      </button>
                    </div>
                  </div>
                </div>

                  {(tempSettings.curatorChoiceMode || 'dynamic') === 'dynamic' ? (
                    <div className="p-3 bg-secondary-container/30 border border-secondary-container rounded-lg text-xs text-on-surface flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-semibold text-primary">Dynamic Patron Personalization Enabled</p>
                        <p className="text-on-surface-variant leading-relaxed">
                          Items will automatically adapt to each visitor based on their browsing history, wishlist bookmarks, and cart activity while maintaining balanced department diversity (Clothing, Home Goods, Accessories). If a visitor has no history, the fallback pieces configured below will display.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-surface-lowest border border-outline-variant/30 rounded-lg text-xs text-on-surface-variant">
                      <p className="font-semibold text-on-surface mb-0.5">Manual Studio Curation Enabled</p>
                      <p>The curated archetypes below will rotate sequentially in the exact specified order for all visitors.</p>
                    </div>
                  )}

                  {/* Curator's Choice Auto-Advance Transition Speed Control */}
                  <div className="bg-surface-lowest/70 border border-outline-variant/30 rounded-xl p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <label className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-on-surface">
                            Curator&rsquo;s Choice Auto-Advance Transition Speed
                          </label>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                            {(tempSettings.curatorChoiceTransitionInterval || 4.5).toFixed(1)}s per piece
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          Controls the duration before the hero card automatically advances to the next piece. Pauses automatically whenever a visitor hovers or interacts.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                        {[
                          { label: '2.0s Rapid', val: 2.0 },
                          { label: '3.0s Brisk', val: 3.0 },
                          { label: '4.5s Balanced', val: 4.5 },
                          { label: '6.0s Relaxed', val: 6.0 },
                          { label: '8.0s Slow', val: 8.0 },
                        ].map((preset) => {
                          const currentVal = tempSettings.curatorChoiceTransitionInterval || 4.5;
                          const isSelected = Math.abs(currentVal - preset.val) < 0.15;
                          return (
                            <button
                              key={preset.val}
                              type="button"
                              onClick={() => {
                                setTempSettings({
                                  ...tempSettings,
                                  curatorChoiceTransitionInterval: preset.val,
                                });
                                showToast(`Curator's Choice transition speed set to ${preset.val}s.`);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-primary text-white shadow-xs'
                                  : 'bg-surface hover:bg-surface-high text-on-surface-variant border border-outline-variant/30'
                              }`}
                            >
                              {preset.label}
                            </button>
                          );
                        })}

                        {/* Custom Number Input */}
                        <div className="flex items-center gap-1.5 pl-2 border-l border-outline-variant/30">
                          <input
                            type="number"
                            min="1.0"
                            max="20"
                            step="0.5"
                            value={tempSettings.curatorChoiceTransitionInterval || 4.5}
                            onChange={(e) => {
                              const num = parseFloat(e.target.value);
                              if (!isNaN(num) && num >= 0.5) {
                                setTempSettings({
                                  ...tempSettings,
                                  curatorChoiceTransitionInterval: num,
                                });
                              }
                            }}
                            className="w-16 bg-surface border border-outline-variant/40 rounded-lg px-2 py-1 text-xs font-mono font-bold text-on-surface focus:outline-none focus:border-primary text-center"
                          />
                          <span className="text-xs font-mono text-outline">sec</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Curator's Choice Items List & Modifier */}
                  {(() => {
                    const currentCuratorIds =
                      tempSettings.curatorChoiceProductIds && tempSettings.curatorChoiceProductIds.length > 0
                        ? tempSettings.curatorChoiceProductIds
                        : [
                            tempSettings.curatorChoiceProductId || products[0]?.id || 'prod-1',
                            products[7]?.id || 'prod-8',
                            products[3]?.id || 'prod-4',
                          ];

                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-xs uppercase font-bold text-on-surface-variant">
                            Curated Archetype Spotlight Items ({currentCuratorIds.length})
                          </span>
                          <span className="text-[11px] text-outline">
                            Reorder sequence or remove pieces to customize rotation
                          </span>
                        </div>

                        {/* List of active items */}
                        <div className="space-y-2">
                          {currentCuratorIds.map((pid, idx) => {
                            const prod = products.find((p) => p.id === pid);
                            return (
                              <div
                                key={`${pid}-${idx}`}
                                className="flex items-center justify-between p-2.5 sm:p-3 bg-surface-lowest border border-outline-variant/30 rounded-xl gap-3 transition-all hover:border-outline-variant/50"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="w-6 h-6 rounded-md bg-surface-low border border-outline-variant/40 flex items-center justify-center font-mono text-[10px] font-bold text-primary shrink-0">
                                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                  </span>
                                  <div className="w-10 h-10 rounded-lg bg-surface-low overflow-hidden shrink-0 border border-outline-variant/20 flex items-center justify-center">
                                    {prod?.imageUrl ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <ProductIllustration
                                        name={(prod?.illustration as any) || 'vase'}
                                        color={prod?.colors?.[0]?.hex}
                                        className="w-6 h-6"
                                      />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-on-surface truncate">
                                        {prod?.name || pid}
                                      </span>
                                      {idx === 0 && (
                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-primary/10 text-primary border border-primary/20">
                                          Lead Slot
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                                      <span className="font-semibold text-on-surface">${(prod?.price || 0).toFixed(2)}</span>
                                      <span>·</span>
                                      <span>{prod?.category || 'OBJECT'}</span>
                                      <span>·</span>
                                      <span className={prod?.inStock ? 'text-emerald-600 font-medium' : 'text-rose-500 font-medium'}>
                                        {prod?.inStock ? 'In Stock' : 'Out of Stock'}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Controls: Move Up, Move Down, Remove */}
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => {
                                      const newIds = [...currentCuratorIds];
                                      const temp = newIds[idx - 1];
                                      newIds[idx - 1] = newIds[idx];
                                      newIds[idx] = temp;
                                      setTempSettings({
                                        ...tempSettings,
                                        curatorChoiceProductIds: newIds,
                                        curatorChoiceProductId: newIds[0],
                                      });
                                    }}
                                    className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-low disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                    title="Move Up"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === currentCuratorIds.length - 1}
                                    onClick={() => {
                                      const newIds = [...currentCuratorIds];
                                      const temp = newIds[idx + 1];
                                      newIds[idx + 1] = newIds[idx];
                                      newIds[idx] = temp;
                                      setTempSettings({
                                        ...tempSettings,
                                        curatorChoiceProductIds: newIds,
                                        curatorChoiceProductId: newIds[0],
                                      });
                                    }}
                                    className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-low disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                    title="Move Down"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={currentCuratorIds.length <= 1}
                                    onClick={() => {
                                      if (currentCuratorIds.length <= 1) {
                                        showToast('At least one piece must remain in Curator\'s Choice.');
                                        return;
                                      }
                                      const newIds = currentCuratorIds.filter((_, i) => i !== idx);
                                      setTempSettings({
                                        ...tempSettings,
                                        curatorChoiceProductIds: newIds,
                                        curatorChoiceProductId: newIds[0],
                                      });
                                      showToast(`Removed "${prod?.name || pid}" from Curator's Choice.`);
                                    }}
                                    className="p-1.5 rounded-lg text-outline hover:text-rose-500 hover:bg-rose-500/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                    title="Remove from Curator's Choice"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Add Product to Curator's Choice */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                          <select
                            value={selectedCuratorToAdd}
                            onChange={(e) => setSelectedCuratorToAdd(e.target.value)}
                            className="flex-1 bg-surface-lowest border border-outline-variant/50 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                          >
                            <option value="">Select a product from catalog to add...</option>
                            {products.map((p) => {
                              const isAlready = currentCuratorIds.includes(p.id);
                              return (
                                <option key={p.id} value={p.id}>
                                  {p.name} — ${p.price.toFixed(2)} ({p.category}) {isAlready ? '✓ Already curated' : ''}
                                </option>
                              );
                            })}
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              if (!selectedCuratorToAdd) {
                                showToast('Please select a product from the list first.');
                                return;
                              }
                              if (currentCuratorIds.includes(selectedCuratorToAdd)) {
                                showToast('This product is already in Curator\'s Choice.');
                                return;
                              }
                              const newIds = [...currentCuratorIds, selectedCuratorToAdd];
                              setTempSettings({
                                ...tempSettings,
                                curatorChoiceProductIds: newIds,
                                curatorChoiceProductId: newIds[0],
                              });
                              const addedProduct = products.find((p) => p.id === selectedCuratorToAdd);
                              showToast(`Added "${addedProduct?.name || selectedCuratorToAdd}" to Curator's Choice.`);
                              setSelectedCuratorToAdd('');
                            }}
                            className="px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs font-semibold rounded-lg shadow-subtle inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Archetype</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const defaults = ['prod-1', 'prod-8', 'prod-4'];
                              setTempSettings({
                                ...tempSettings,
                                curatorChoiceProductIds: defaults,
                                curatorChoiceProductId: defaults[0],
                              });
                              showToast('Curator\'s Choice reset to default studio archetypes.');
                            }}
                            className="px-3 py-2 bg-surface-lowest border border-outline-variant/40 hover:bg-surface text-on-surface-variant hover:text-on-surface text-xs font-semibold rounded-lg inline-flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                            title="Reset to 3 default pieces"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset Defaults</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Lookbook Transition Speed in Settings */}
                <div className="p-4 sm:p-5 bg-surface-low rounded-xl border border-outline-variant/30 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="block font-label-caps text-xs tracking-label-caps uppercase font-bold text-on-surface">
                        Lookbook Auto-Advance Transition Interval
                      </label>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Duration in seconds before automatically transitioning to the next living vignette capsule.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0.8"
                        max="15"
                        step="0.2"
                        value={tempSettings.lookbookTransitionInterval || 2.0}
                        onChange={(e) =>
                          setTempSettings({
                            ...tempSettings,
                            lookbookTransitionInterval: parseFloat(e.target.value) || 2.0,
                          })
                        }
                        className="w-20 bg-surface border border-outline-variant/50 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-on-surface focus:outline-none focus:border-primary text-center"
                      />
                      <span className="text-xs text-outline font-mono">seconds</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/20 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary hover:bg-primary-container text-white font-label-caps text-xs tracking-label-caps font-semibold uppercase rounded-lg shadow-subtle flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Store Settings</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: METRICS & INVENTORY STATS */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-surface-lowest border border-on-surface/15 rounded-xl p-5 shadow-subtle">
                <span className="font-label-caps text-xs uppercase font-semibold text-on-surface-variant">
                  Catalog Archetypes
                </span>
                <div className="text-3xl font-bold font-display-lg text-primary mt-1">
                  {products.length}
                </div>
                <span className="text-[11px] text-outline mt-1 block">Active distinct designs</span>
              </div>

              <div className="bg-surface-lowest border border-on-surface/15 rounded-xl p-5 shadow-subtle">
                <span className="font-label-caps text-xs uppercase font-semibold text-on-surface-variant">
                  Total Inventory Units
                </span>
                <div className="text-3xl font-bold font-display-lg text-olive mt-1">
                  {totalStockUnits}
                </div>
                <span className="text-[11px] text-outline mt-1 block">
                  {inStockCount} archetypes available to order
                </span>
              </div>

              <div className="bg-surface-lowest border border-on-surface/15 rounded-xl p-5 shadow-subtle">
                <span className="font-label-caps text-xs uppercase font-semibold text-on-surface-variant">
                  Low Stock Warnings (&le;5)
                </span>
                <div className={`text-3xl font-bold font-display-lg mt-1 ${lowStockCount > 0 ? 'text-amber-600' : 'text-on-surface'}`}>
                  {lowStockCount}
                </div>
                <span className="text-[11px] text-outline mt-1 block">Approaching replenishment threshold</span>
              </div>

              <div className="bg-surface-lowest border border-on-surface/15 rounded-xl p-5 shadow-subtle">
                <span className="font-label-caps text-xs uppercase font-semibold text-on-surface-variant">
                  Sold Out / Depleted
                </span>
                <div className={`text-3xl font-bold font-display-lg mt-1 ${soldOutCount > 0 ? 'text-red-600' : 'text-on-surface'}`}>
                  {soldOutCount}
                </div>
                <span className="text-[11px] text-outline mt-1 block">Zero inventory available</span>
              </div>
            </div>

            {/* Department Breakdown */}
            <div className="bg-surface-lowest border border-on-surface/15 rounded-xl p-6 shadow-subtle">
              <h3 className="font-headline-md text-base font-semibold text-on-surface mb-4">
                Department Breakdown &amp; Stock Levels
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['CLOTHING', 'HOME GOODS', 'ACCESSORIES'].map((dept) => {
                  const deptProducts = products.filter((p) => p.category === dept);
                  const deptUnits = deptProducts.reduce((acc, p) => acc + (p.stockQuantity ?? 0), 0);

                  return (
                    <div key={dept} className="bg-surface-low border border-outline-variant/30 rounded-lg p-4">
                      <span className="font-label-caps text-xs uppercase font-bold text-primary block">
                        {dept}
                      </span>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-2xl font-bold font-display-lg text-on-surface">
                          {deptProducts.length} Items
                        </span>
                        <span className="text-xs font-semibold text-on-surface-variant">
                          {deptUnits} units
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
      </div>

      {/* Product Upload / Edit Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />

      {/* Order Inspection Modal */}
      <OrderInspectModal
        isOpen={isInspectModalOpen}
        onClose={() => setIsInspectModalOpen(false)}
        order={inspectingOrder}
        onUpdateStatus={(id, status, extra) => {
          if (inspectingOrder) {
            handleOrderStatusChange(id, inspectingOrder.orderNumber, status, extra);
          }
        }}
      />

      {/* Lookbook Capsule Create / Edit Modal */}
      {isCapsuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-surface border border-on-surface/15 rounded-2xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
                    {editingCapsule ? 'Edit Lookbook Capsule' : 'Create Living Capsule'}
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Compose 3 complementary archetypes with spatial ambient lighting
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCapsuleModalOpen(false)}
                className="p-1.5 rounded-full text-outline hover:text-on-surface hover:bg-surface-low transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCapsule} className="space-y-4">
              {/* Capsule Title */}
              <div>
                <label className="font-label-caps text-xs uppercase font-bold text-on-surface-variant block mb-1">
                  Capsule Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Wabi-Sabi Desk Sanctuary"
                  value={capsuleTitle}
                  onChange={(e) => setCapsuleTitle(e.target.value)}
                  className="w-full bg-surface-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary transition-all"
                />
              </div>

              {/* Eyebrow & Studio Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-label-caps text-xs uppercase font-bold text-on-surface-variant block mb-1">
                    Eyebrow Curation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lookbook Capsule 04"
                    value={capsuleEyebrow}
                    onChange={(e) => setCapsuleEyebrow(e.target.value)}
                    className="w-full bg-surface-low border border-outline-variant/40 rounded-xl px-4 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-xs uppercase font-bold text-on-surface-variant block mb-1">
                    Studio Tag / Coordinates
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kyoto Natural Light · 35°N"
                    value={capsuleStudioTag}
                    onChange={(e) => setCapsuleStudioTag(e.target.value)}
                    className="w-full bg-surface-low border border-outline-variant/40 rounded-xl px-4 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-label-caps text-xs uppercase font-bold text-on-surface-variant block mb-1">
                  Poetic Living Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the mood, texture, and domestic intent of this spatial ensemble..."
                  value={capsuleDescription}
                  onChange={(e) => setCapsuleDescription(e.target.value)}
                  className="w-full bg-surface-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary transition-all resize-none"
                />
              </div>

              {/* Spatial Atmosphere Theme */}
              <div>
                <label className="font-label-caps text-xs uppercase font-bold text-on-surface-variant block mb-1.5">
                  Atmospheric Palette &amp; Lighting
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'warm-sand', name: 'Warm Sand', color: '#f4efe8', border: '#c5b8a5' },
                    { id: 'nordic-slate', name: 'Nordic Slate', color: '#eef2f5', border: '#b3c1cf' },
                    { id: 'porto-terracotta', name: 'Terracotta', color: '#f7efe9', border: '#caa691' },
                    { id: 'sage-botanical', name: 'Kyoto Sage', color: '#f0f4ee', border: '#9fb198' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setCapsuleTheme(t.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                        capsuleTheme === t.id
                          ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                          : 'border-outline-variant/40 bg-surface-low hover:bg-surface-high'
                      }`}
                    >
                      <span
                        className="w-full h-5 rounded-lg border shadow-xs"
                        style={{ backgroundColor: t.color, borderColor: t.border }}
                      />
                      <span className="text-[11px] font-semibold text-on-surface block text-center">
                        {t.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 Curated Products Dropdown Selectors */}
              <div className="space-y-3 pt-2 border-t border-outline-variant/20">
                <label className="font-label-caps text-xs uppercase font-bold text-on-surface-variant block">
                  Curated 3 Archetypes (Hotspot Spatial Placements)
                </label>

                {/* Slot 1: Left */}
                <div>
                  <span className="text-[11px] font-semibold text-primary block mb-1">
                    Slot 1 (Left Hotspot · Top 28%, Left 18%)
                  </span>
                  <select
                    value={capsuleProductIds[0]}
                    onChange={(e) =>
                      setCapsuleProductIds([e.target.value, capsuleProductIds[1], capsuleProductIds[2]])
                    }
                    className="w-full bg-surface-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.price.toFixed(2)}) — {p.category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Slot 2: Center */}
                <div>
                  <span className="text-[11px] font-semibold text-primary block mb-1">
                    Slot 2 (Center Hotspot · Top 52%, Left 50%)
                  </span>
                  <select
                    value={capsuleProductIds[1]}
                    onChange={(e) =>
                      setCapsuleProductIds([capsuleProductIds[0], e.target.value, capsuleProductIds[2]])
                    }
                    className="w-full bg-surface-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.price.toFixed(2)}) — {p.category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Slot 3: Right */}
                <div>
                  <span className="text-[11px] font-semibold text-primary block mb-1">
                    Slot 3 (Right Hotspot · Top 32%, Left 82%)
                  </span>
                  <select
                    value={capsuleProductIds[2]}
                    onChange={(e) =>
                      setCapsuleProductIds([capsuleProductIds[0], capsuleProductIds[1], e.target.value])
                    }
                    className="w-full bg-surface-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.price.toFixed(2)}) — {p.category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Page Placement Controls */}
              <div className="pt-2 border-t border-outline-variant/20 space-y-2">
                <label className="font-label-caps text-xs uppercase font-bold text-on-surface-variant block">
                  Storefront Page Placement
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-outline-variant/40 bg-surface-low hover:bg-surface-high cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={capsuleShowOnHome}
                      onChange={(e) => setCapsuleShowOnHome(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-semibold text-on-surface block">Home Page</span>
                      <span className="text-[10px] text-on-surface-variant block">Show in Living Spatial Curation</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-outline-variant/40 bg-surface-low hover:bg-surface-high cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={capsuleShowOnShop}
                      onChange={(e) => setCapsuleShowOnShop(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-semibold text-on-surface block">Shop Page</span>
                      <span className="text-[10px] text-on-surface-variant block">Show in Lookbook Studio</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Capsule Active Switch */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="capsuleEnabledCheck"
                  checked={capsuleEnabled}
                  onChange={(e) => setCapsuleEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="capsuleEnabledCheck" className="text-xs text-on-surface font-medium cursor-pointer">
                  Activate this capsule in storefront rotation immediately
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setIsCapsuleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-outline-variant/40 bg-surface-low hover:bg-surface-high text-xs font-semibold text-on-surface transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-semibold shadow-subtle transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingCapsule ? 'Save Changes' : 'Create Capsule'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Atelier Curator Response Modal */}
      {replyModalReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-on-surface/15 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-headline-md text-base font-bold text-on-surface">
                    Atelier Curator Response
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Replying to {replyModalReview.author || replyModalReview.userName || 'Patron'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReplyModalReview(null)}
                className="text-outline hover:text-on-surface p-1 rounded-lg text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Patron review quote snippet */}
            <div className="bg-surface-low border border-outline-variant/30 rounded-xl p-3.5 text-xs text-on-surface-variant">
              <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-on-surface">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${s <= replyModalReview.rating ? 'fill-amber-500 text-amber-500' : 'text-outline-variant'}`}
                    />
                  ))}
                </div>
                <span>"{replyModalReview.title}"</span>
              </div>
              <p className="line-clamp-2 italic text-outline">"{replyModalReview.comment}"</p>
            </div>

            <form onSubmit={handleSaveAdminReply} className="space-y-4">
              <div>
                <label className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5">
                  Curator Signature / Title
                </label>
                <input
                  type="text"
                  value={replyAuthorName}
                  onChange={(e) => setReplyAuthorName(e.target.value)}
                  placeholder="E Sondha Studio Curator"
                  className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5">
                  Official Public Response
                </label>
                <textarea
                  rows={4}
                  required
                  value={replyDraftText}
                  onChange={(e) => setReplyDraftText(e.target.value)}
                  placeholder="Thank the patron, address material nuances, fit notes, or atelier care guidance..."
                  className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg p-3 text-xs text-on-surface focus:outline-none focus:border-primary leading-relaxed"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyModalReview(null)}
                  className="px-4 py-2 rounded-lg border border-outline-variant/50 text-xs font-semibold text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-label-caps tracking-label-caps uppercase font-semibold shadow-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Publish Response</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inquiry Curator Response Modal */}
      {replyModalInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-on-surface/15 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-headline-md text-base font-bold text-on-surface">
                    Curator Response to Inquiry
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Replying to {replyModalInquiry.fullName} ({replyModalInquiry.email})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReplyModalInquiry(null)}
                className="text-outline hover:text-on-surface p-1 rounded-lg text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Inquiry Snippet */}
            <div className="bg-surface-low border border-outline-variant/30 rounded-xl p-3.5 text-xs text-on-surface-variant space-y-1">
              <div className="font-bold text-on-surface text-[11px]">
                Subject: {replyModalInquiry.subject}
              </div>
              <p className="line-clamp-3 italic text-outline leading-relaxed">
                "{replyModalInquiry.message}"
              </p>
            </div>

            <form onSubmit={handleSendInquiryReply} className="space-y-4">
              <div>
                <label className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5">
                  Official Atelier Curator Response
                </label>
                <textarea
                  rows={5}
                  required
                  value={inquiryReplyDraft}
                  onChange={(e) => setInquiryReplyDraft(e.target.value)}
                  placeholder="Draft your gentle, authoritative studio response..."
                  className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg p-3 text-xs text-on-surface focus:outline-none focus:border-primary leading-relaxed"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyModalInquiry(null)}
                  className="px-4 py-2 rounded-lg border border-outline-variant/50 text-xs font-semibold text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-label-caps tracking-label-caps uppercase font-semibold shadow-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Response</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Answer & Edit FAQ Modal */}
      {isAnswerModalOpen && editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-on-surface/15 rounded-2xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-headline-md text-base font-bold text-on-surface">
                    {editingFaq.answer ? 'Edit Atelier FAQ Answer' : 'Answer Patron Question'}
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    {editingFaq.askedBy?.name ? `Submitted by ${editingFaq.askedBy.name}` : 'Atelier Knowledge Base'} · Asked {editingFaq.askedAt}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAnswerModalOpen(false);
                  setEditingFaq(null);
                }}
                className="text-outline hover:text-on-surface p-1 rounded-lg text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveAnswer} className="space-y-4">
              {/* Question Text */}
              <div>
                <label className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5">
                  Question
                </label>
                <textarea
                  rows={2}
                  required
                  value={questionDraft}
                  onChange={(e) => setQuestionDraft(e.target.value)}
                  className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg p-3 text-xs text-on-surface focus:outline-none focus:border-primary leading-relaxed font-semibold"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5">
                  Category Department
                </label>
                <select
                  value={categoryDraft}
                  onChange={(e) => setCategoryDraft(e.target.value as FAQCategory)}
                  className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="orders">Orders &amp; Payment</option>
                  <option value="shipping">Shipping &amp; Transit</option>
                  <option value="returns">Returns &amp; Exchanges</option>
                  <option value="materials">Materials &amp; Care</option>
                  <option value="general">General Atelier</option>
                </select>
              </div>

              {/* Official Answer */}
              <div>
                <label className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5">
                  Official Atelier Answer
                </label>
                <textarea
                  rows={5}
                  required
                  value={answerDraft}
                  onChange={(e) => setAnswerDraft(e.target.value)}
                  placeholder="Provide an authoritative and gentle studio response for patrons..."
                  className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg p-3 text-xs text-on-surface focus:outline-none focus:border-primary leading-relaxed"
                  autoFocus
                />
              </div>

              {/* Publish Toggle */}
              <div className="bg-surface-low border border-outline-variant/30 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs text-on-surface block">
                    Publish to Storefront FAQ
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    When enabled, this answered question is instantly live on /faq for all patrons.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={publishImmediate}
                    onChange={(e) => setPublishImmediate(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAnswerModalOpen(false);
                    setEditingFaq(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-outline-variant/50 text-xs font-semibold text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-label-caps tracking-label-caps uppercase font-semibold shadow-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{publishImmediate ? 'Save & Publish Live' : 'Save as Draft'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New FAQ Modal */}
      {isCreateFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-on-surface/15 rounded-2xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-headline-md text-base font-bold text-on-surface">
                    Create New Atelier FAQ
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Add a new verified question and answer to the studio knowledge base
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateFaqModalOpen(false)}
                className="text-outline hover:text-on-surface p-1 rounded-lg text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateFAQSubmit} className="space-y-4">
              {/* Question */}
              <div>
                <label className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5">
                  Question
                </label>
                <input
                  type="text"
                  required
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="e.g. How do I clean and maintain natural linen textiles?"
                  className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                  autoFocus
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5">
                  Category Department
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as FAQCategory)}
                  className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="orders">Orders &amp; Payment</option>
                  <option value="shipping">Shipping &amp; Transit</option>
                  <option value="returns">Returns &amp; Exchanges</option>
                  <option value="materials">Materials &amp; Care</option>
                  <option value="general">General Atelier</option>
                </select>
              </div>

              {/* Answer */}
              <div>
                <label className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5">
                  Official Atelier Answer
                </label>
                <textarea
                  rows={5}
                  required
                  value={newAnswerText}
                  onChange={(e) => setNewAnswerText(e.target.value)}
                  placeholder="Provide an authoritative and gentle studio response for patrons..."
                  className="w-full bg-surface-lowest border border-outline-variant/50 rounded-lg p-3 text-xs text-on-surface focus:outline-none focus:border-primary leading-relaxed"
                />
              </div>

              {/* Status */}
              <div className="bg-surface-low border border-outline-variant/30 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs text-on-surface block">
                    Publish Immediately
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    If checked, this FAQ will be visible on /faq right away. Otherwise saved as pending draft.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={newPublishStatus === 'published'}
                    onChange={(e) => setNewPublishStatus(e.target.checked ? 'published' : 'pending')}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateFaqModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-outline-variant/50 text-xs font-semibold text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-label-caps tracking-label-caps uppercase font-semibold shadow-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create FAQ Entry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universal Command Palette (Ctrl+K / ⌘K) */}
      {isCommandPaletteOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => {
            setIsCommandPaletteOpen(false);
            setCommandQuery('');
          }}
        >
          <div 
            className="bg-surface-lowest border border-on-surface/20 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-outline-variant/30 flex items-center gap-3">
              <Search className="w-5 h-5 text-primary shrink-0" />
              <input
                type="text"
                autoFocus
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                placeholder="Type a command, product, order, or FAQ..."
                className="w-full bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none"
              />
              {commandQuery ? (
                <button
                  type="button"
                  onClick={() => setCommandQuery('')}
                  className="p-1 text-outline hover:text-on-surface rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono font-bold bg-surface border border-outline-variant/40 text-outline px-1.5 py-0.5 rounded">
                  ESC
                </kbd>
              )}
            </div>

            {/* Results Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4 text-xs">
              {/* Navigation Shortcuts */}
              {(!commandQuery.trim() || 'dashboard catalog orders reviews faqs metrics settings lookbook curator'.includes(commandQuery.toLowerCase())) && (
                <div>
                  <span className="font-label-caps text-[10px] uppercase font-bold text-outline tracking-wider px-2 block mb-1.5">
                    Navigation
                  </span>
                  <div className="space-y-1">
                    {[
                      { id: 'dashboard' as AdminTab, label: 'Executive Dashboard', icon: LayoutDashboard, desc: 'Telemetry, order funnel, action hub' },
                      { id: 'catalog' as AdminTab, label: 'Catalog & Inventory', icon: Package, desc: 'Manage products, stock levels, variants' },
                      { id: 'orders' as AdminTab, label: 'Orders & Fulfillment', icon: ShoppingBag, desc: 'Inspect orders, packing slips, dispatch' },
                      { id: 'reviews' as AdminTab, label: 'Patron Reviews', icon: Star, desc: 'Moderate reviews and post curator replies' },
                      { id: 'faqs' as AdminTab, label: 'Atelier FAQs', icon: HelpCircle, desc: 'Answer shopper questions & knowledge base' },
                      { id: 'lookbook' as AdminTab, label: 'Lookbook & Capsules', icon: Sparkles, desc: 'Manage 3-piece living capsules & page routing' },
                      { id: 'curator' as AdminTab, label: "Curator's Choice Spotlight", icon: Star, desc: 'Hero card pieces, auto-advance speed, sequence' },
                      { id: 'metrics' as AdminTab, label: 'Analytics & Stock', icon: BarChart3, desc: 'Inventory health and revenue intelligence' },
                      { id: 'settings' as AdminTab, label: 'Settings & Security', icon: Settings, desc: 'Shipping thresholds, tax, studio keycode' },
                    ]
                      .filter((nav) => !commandQuery.trim() || nav.label.toLowerCase().includes(commandQuery.toLowerCase()) || nav.desc.toLowerCase().includes(commandQuery.toLowerCase()))
                      .map((nav) => {
                        const NavIcon = nav.icon;
                        return (
                          <button
                            key={nav.id}
                            type="button"
                            onClick={() => {
                              setActiveTab(nav.id);
                              setIsCommandPaletteOpen(false);
                              setCommandQuery('');
                            }}
                            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-surface-low transition-colors text-left group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <NavIcon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <span className="font-semibold text-on-surface block">{nav.label}</span>
                                <span className="text-[11px] text-on-surface-variant block">{nav.desc}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              {!commandQuery.trim() && (
                <div>
                  <span className="font-label-caps text-[10px] uppercase font-bold text-outline tracking-wider px-2 block mb-1.5">
                    Quick Studio Actions
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCommandPaletteOpen(false);
                        setCommandQuery('');
                        handleOpenAddModal();
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-xl border border-outline-variant/30 hover:border-primary hover:bg-surface-low transition-all text-left cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-semibold text-on-surface">Upload New Product</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCommandPaletteOpen(false);
                        setCommandQuery('');
                        setIsCreateFaqModalOpen(true);
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-xl border border-outline-variant/30 hover:border-primary hover:bg-surface-low transition-all text-left cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-semibold text-on-surface">Create FAQ Entry</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCommandPaletteOpen(false);
                        setCommandQuery('');
                        handleExportOrdersCSV();
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-xl border border-outline-variant/30 hover:border-primary hover:bg-surface-low transition-all text-left cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-outline shrink-0" />
                      <span className="font-semibold text-on-surface">Export Orders CSV</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCommandPaletteOpen(false);
                        setCommandQuery('');
                        handleExportCatalogCSV();
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-xl border border-outline-variant/30 hover:border-primary hover:bg-surface-low transition-all text-left cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-outline shrink-0" />
                      <span className="font-semibold text-on-surface">Export Catalog CSV</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Matched Products */}
              {commandQuery.trim() && (
                <div>
                  <span className="font-label-caps text-[10px] uppercase font-bold text-outline tracking-wider px-2 block mb-1.5">
                    Matching Products
                  </span>
                  {(() => {
                    const q = commandQuery.toLowerCase();
                    const matched = products.filter(
                      (p) =>
                        p.name.toLowerCase().includes(q) ||
                        p.category.toLowerCase().includes(q) ||
                        p.id.toLowerCase().includes(q)
                    ).slice(0, 5);

                    if (matched.length === 0) {
                      return <p className="px-2 text-on-surface-variant text-[11px] italic">No catalog items found.</p>;
                    }

                    return (
                      <div className="space-y-1">
                        {matched.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setIsCommandPaletteOpen(false);
                              setCommandQuery('');
                              handleOpenEditModal(p);
                            }}
                            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-surface-low transition-colors text-left group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-surface overflow-hidden shrink-0 border border-outline-variant/40">
                                <img
                                  src={p.imageUrl || 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&q=80&w=200'}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="truncate">
                                <span className="font-semibold text-on-surface block truncate">{p.name}</span>
                                <span className="text-[11px] text-on-surface-variant block">
                                  {p.category} · ${p.price.toFixed(2)} · {p.stockQuantity ?? 0} in stock
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              Edit Item →
                            </span>
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Matched Orders */}
              {commandQuery.trim() && (
                <div>
                  <span className="font-label-caps text-[10px] uppercase font-bold text-outline tracking-wider px-2 block mb-1.5">
                    Matching Orders
                  </span>
                  {(() => {
                    const q = commandQuery.toLowerCase();
                    const matched = (allOrders || []).filter(
                      (o) =>
                        o.orderNumber.toLowerCase().includes(q) ||
                        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
                        (o.customerEmail && o.customerEmail.toLowerCase().includes(q)) ||
                        o.id.toLowerCase().includes(q)
                    ).slice(0, 5);

                    if (matched.length === 0) {
                      return <p className="px-2 text-on-surface-variant text-[11px] italic">No orders found.</p>;
                    }

                    return (
                      <div className="space-y-1">
                        {matched.map((o) => (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() => {
                              setIsCommandPaletteOpen(false);
                              setCommandQuery('');
                              setInspectingOrder(o);
                              setIsInspectModalOpen(true);
                            }}
                            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-surface-low transition-colors text-left group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-primary shrink-0 border border-outline-variant/40">
                                <ShoppingBag className="w-4 h-4" />
                              </div>
                              <div className="truncate">
                                <span className="font-semibold text-on-surface block truncate">
                                  Order #{o.orderNumber} — {o.customerName || 'Guest Patron'}
                                </span>
                                <span className="text-[11px] text-on-surface-variant block">
                                  {o.status} · ${o.total.toFixed(2)} · {o.items.length} items
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              Inspect Order →
                            </span>
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Matched FAQs */}
              {commandQuery.trim() && (
                <div>
                  <span className="font-label-caps text-[10px] uppercase font-bold text-outline tracking-wider px-2 block mb-1.5">
                    Matching FAQs
                  </span>
                  {(() => {
                    const q = commandQuery.toLowerCase();
                    const matched = (faqs || []).filter(
                      (f) =>
                        f.question.toLowerCase().includes(q) ||
                        (f.answer && f.answer.toLowerCase().includes(q)) ||
                        f.category.toLowerCase().includes(q)
                    ).slice(0, 5);

                    if (matched.length === 0) {
                      return <p className="px-2 text-on-surface-variant text-[11px] italic">No FAQs found.</p>;
                    }

                    return (
                      <div className="space-y-1">
                        {matched.map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => {
                              setIsCommandPaletteOpen(false);
                              setCommandQuery('');
                              setActiveTab('faqs');
                              setFaqSearchQuery(f.question);
                            }}
                            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-surface-low transition-colors text-left group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-primary shrink-0 border border-outline-variant/40">
                                <HelpCircle className="w-4 h-4" />
                              </div>
                              <div className="truncate">
                                <span className="font-semibold text-on-surface block truncate">{f.question}</span>
                                <span className="text-[11px] text-on-surface-variant block">
                                  {f.category} · {f.status} {f.answer ? '· Answered' : '· Awaiting Answer'}
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              View in FAQs →
                            </span>
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-surface-low border-t border-outline-variant/30 flex items-center justify-between text-[11px] text-on-surface-variant">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="font-mono bg-surface border border-outline-variant/40 px-1 rounded text-[10px]">↵</kbd> select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="font-mono bg-surface border border-outline-variant/40 px-1 rounded text-[10px]">esc</kbd> close
                </span>
              </div>
              <span className="font-semibold text-primary">Atelier Omni-Search</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
