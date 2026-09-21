'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  Search,
  ChevronDown,
  HelpCircle,
  Package,
  RotateCcw,
  Truck,
  Leaf,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Plus,
  ThumbsUp,
  CheckCircle2,
  X,
  Send,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useFAQ } from '@/context/FAQContext';
import { useAuth } from '@/context/AuthContext';
import { FAQCategory } from '@/types/faq';


export default function FAQPage() {
  const { publishedFaqs, askQuestion, markHelpful, hasVotedHelpful } = useFAQ();
  const { user, isAuthenticated } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'orders' | 'shipping' | 'returns' | 'materials' | 'general'>('all');
  const [openFAQIds, setOpenFAQIds] = useState<string[]>(['faq-ord-1', 'faq-ship-1', 'faq-ret-1']);

  // Modal State
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [askForm, setAskForm] = useState({
    question: '',
    category: 'general' as FAQCategory,
    name: user?.name || '',
    email: user?.email || '',
  });
  const [askSuccess, setAskSuccess] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleFAQ = (id: string) => {
    setOpenFAQIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenAskModal = () => {
    setAskForm({
      question: '',
      category: 'general',
      name: user?.name || '',
      email: user?.email || '',
    });
    setAskError(null);
    setAskSuccess(false);
    setIsAskModalOpen(true);
  };

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAskError(null);

    if (!askForm.question.trim()) {
      setAskError('Please state your question clearly.');
      return;
    }

    askQuestion({
      question: askForm.question,
      category: askForm.category,
      name: askForm.name.trim() || (user ? user.name : 'Valued Patron'),
      email: askForm.email.trim() || (user ? user.email : ''),
    });

    setAskSuccess(true);
    setTimeout(() => {
      setIsAskModalOpen(false);
      setAskSuccess(false);
      showToast('Your question was sent to the atelier. Answers will appear here once published!');
    }, 1800);
  };

  const filteredFAQs = publishedFaqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      faq.question.toLowerCase().includes(q) ||
      (faq.answer && faq.answer.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (cat: FAQCategory) => {
    return publishedFaqs.filter((f) => f.category === cat).length;
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      <main className="page-enter flex-1 w-full max-w-5xl mx-auto px-5 sm:px-6 md:px-margin py-10 sm:py-16">
        {/* Header & Search */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary block mb-2">
            ATELIER CONCIERGE &amp; ARCHIVE
          </span>
          <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl font-bold text-on-surface tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-3 leading-relaxed">
            Everything you need to know about our slow-living craft, carbon-neutral shipping, and 30-day gentle trial.
          </p>

          {/* Search Box & Ask CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-outline absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search answers, e.g. shipping, returns, sizing..."
                className="w-full pl-11 pr-4 py-3 bg-surface-lowest border border-outline-variant/60 rounded-xl text-xs sm:text-sm text-on-surface outline-none focus:border-primary shadow-subtle placeholder:text-outline/50"
              />
            </div>
            <button
              onClick={handleOpenAskModal}
              className="w-full sm:w-auto px-5 py-3 bg-primary hover:bg-primary-container text-white text-xs font-label-caps tracking-label-caps uppercase font-semibold rounded-xl shadow-subtle flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-secondary-container" />
              <span>Ask a Question</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-10">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-label-caps tracking-wider uppercase font-semibold transition-all ${
              activeCategory === 'all'
                ? 'bg-primary text-white shadow-subtle'
                : 'bg-surface-low border border-outline-variant/40 text-on-surface-variant hover:border-primary'
            }`}
          >
            All ({publishedFaqs.length})
          </button>
          <button
            onClick={() => setActiveCategory('orders')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-label-caps tracking-wider uppercase font-semibold transition-all flex items-center gap-1.5 ${
              activeCategory === 'orders'
                ? 'bg-primary text-white shadow-subtle'
                : 'bg-surface-low border border-outline-variant/40 text-on-surface-variant hover:border-primary'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Orders ({getCategoryCount('orders')})</span>
          </button>
          <button
            onClick={() => setActiveCategory('shipping')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-label-caps tracking-wider uppercase font-semibold transition-all flex items-center gap-1.5 ${
              activeCategory === 'shipping'
                ? 'bg-primary text-white shadow-subtle'
                : 'bg-surface-low border border-outline-variant/40 text-on-surface-variant hover:border-primary'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Shipping ({getCategoryCount('shipping')})</span>
          </button>
          <button
            onClick={() => setActiveCategory('returns')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-label-caps tracking-wider uppercase font-semibold transition-all flex items-center gap-1.5 ${
              activeCategory === 'returns'
                ? 'bg-primary text-white shadow-subtle'
                : 'bg-surface-low border border-outline-variant/40 text-on-surface-variant hover:border-primary'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Returns ({getCategoryCount('returns')})</span>
          </button>
          <button
            onClick={() => setActiveCategory('materials')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-label-caps tracking-wider uppercase font-semibold transition-all flex items-center gap-1.5 ${
              activeCategory === 'materials'
                ? 'bg-primary text-white shadow-subtle'
                : 'bg-surface-low border border-outline-variant/40 text-on-surface-variant hover:border-primary'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Craft &amp; Care ({getCategoryCount('materials')})</span>
          </button>
          {getCategoryCount('general') > 0 && (
            <button
              onClick={() => setActiveCategory('general')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-label-caps tracking-wider uppercase font-semibold transition-all flex items-center gap-1.5 ${
                activeCategory === 'general'
                  ? 'bg-primary text-white shadow-subtle'
                  : 'bg-surface-low border border-outline-variant/40 text-on-surface-variant hover:border-primary'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>General ({getCategoryCount('general')})</span>
            </button>
          )}
        </div>

        {/* Accordions List */}
        <div className="space-y-3.5">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-16 bg-surface-lowest rounded-2xl border border-outline-variant/30 p-8">
              <HelpCircle className="w-10 h-10 text-outline mx-auto mb-3" />
              <h3 className="font-headline-md text-base font-bold text-on-surface">
                No matching answers found
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 mb-6">
                Have a unique inquiry? Submit your question directly to our studio concierge.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-4 py-2 border border-outline-variant/40 text-on-surface text-xs font-label-caps uppercase rounded-lg font-semibold hover:bg-surface-low"
                >
                  Reset Filters
                </button>
                <button
                  onClick={handleOpenAskModal}
                  className="px-5 py-2 bg-primary text-white text-xs font-label-caps uppercase rounded-lg font-semibold hover:bg-primary-container"
                >
                  Ask This Question
                </button>
              </div>
            </div>
          ) : (
            filteredFAQs.map((faq) => {
              const isOpen = openFAQIds.includes(faq.id);
              const hasVoted = hasVotedHelpful(faq.id);

              return (
                <div
                  key={faq.id}
                  className="bg-surface-lowest border border-outline-variant/35 rounded-xl overflow-hidden shadow-subtle transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 hover:bg-surface-low/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className={`w-2 h-2 rounded-full transition-colors duration-200 ${isOpen ? 'bg-primary' : 'bg-primary/40'} shrink-0`} />
                      <span className="font-headline-md text-sm sm:text-base font-semibold text-on-surface">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-primary shrink-0 transition-transform duration-250 ease-out ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div className={`accordion-collapse ${isOpen ? 'open' : ''}`}>
                    <div className="accordion-inner">
                      <div className="px-6 pb-5 pt-2 border-t border-outline-variant/15 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                        <p className="whitespace-pre-line mb-4">{faq.answer}</p>

                        {/* Footer Info: Answered By & Helpful Vote */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant/15 text-xs text-outline">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-primary">
                              Answered by {faq.answeredBy || 'Atelier Concierge'}
                            </span>
                            {faq.answeredAt && <span>· {faq.answeredAt}</span>}
                          </div>

                          <button
                            onClick={() => {
                              const voted = markHelpful(faq.id);
                              if (voted) {
                                showToast('Thank you for your feedback!');
                              }
                            }}
                            disabled={hasVoted}
                            className={`btn-interactive inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold active:scale-95 transition-all ${
                              hasVoted
                                ? 'bg-olive/20 text-olive cursor-default'
                                : 'bg-surface-low hover:bg-surface-high text-on-surface-variant hover:text-primary cursor-pointer'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{hasVoted ? 'Helpful' : 'Was this helpful?'}</span>
                            <span className="font-bold">({faq.helpfulCount || 0})</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Concierge Assistance Card */}
        <div className="mt-16 bg-primary/5 border border-primary/20 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
                Still have an unanswered question?
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Our atelier concierge answers questions promptly and publishes helpful inquiries for all patrons.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleOpenAskModal}
              className="px-5 py-3 bg-primary hover:bg-primary-container text-white text-xs font-label-caps tracking-label-caps uppercase font-semibold rounded-lg shadow-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-secondary-container" />
              <span>Ask Our Team</span>
            </button>
            <Link
              href="/contact"
              className="px-5 py-3 bg-surface-lowest border border-outline-variant/40 hover:bg-surface-high text-on-surface text-xs font-label-caps tracking-label-caps uppercase font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Contact Concierge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Ask a Question Modal */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-lowest border border-on-surface/20 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
              <div>
                <h3 className="font-headline-md text-lg font-bold text-on-surface">
                  Ask the Atelier Concierge
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Inquiries are reviewed by our studio team and published with answers.
                </p>
              </div>
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="p-1.5 text-outline hover:text-on-surface rounded-lg hover:bg-surface-low"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            {askSuccess ? (
              <div className="p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-olive/15 text-olive flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-headline-md text-base font-bold text-on-surface mb-1">
                  Question Received!
                </h4>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                  Thank you. Our atelier administrators will answer your question shortly. Once approved, the answer will be published to the studio archive.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAskSubmit} className="p-6 space-y-4">
                {askError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{askError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-label-caps uppercase font-semibold text-on-surface-variant mb-1">
                    Your Question *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={askForm.question}
                    onChange={(e) => setAskForm({ ...askForm, question: e.target.value })}
                    placeholder="e.g. Can the brass lamp be used with European 220V power?"
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg p-3 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-label-caps uppercase font-semibold text-on-surface-variant mb-1">
                    Department / Topic *
                  </label>
                  <select
                    value={askForm.category}
                    onChange={(e) => setAskForm({ ...askForm, category: e.target.value as FAQCategory })}
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg px-3 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="general">General Inquiries</option>
                    <option value="orders">Orders &amp; Payment</option>
                    <option value="shipping">Shipping &amp; Transit</option>
                    <option value="returns">Returns &amp; Gentle Trial</option>
                    <option value="materials">Materials &amp; Craft Care</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-label-caps uppercase font-semibold text-on-surface-variant mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={askForm.name}
                      onChange={(e) => setAskForm({ ...askForm, name: e.target.value })}
                      placeholder="e.g. Julian Vance"
                      className="w-full bg-surface border border-outline-variant/50 rounded-lg px-3 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-label-caps uppercase font-semibold text-on-surface-variant mb-1">
                      Email Address (for notification)
                    </label>
                    <input
                      type="email"
                      value={askForm.email}
                      onChange={(e) => setAskForm({ ...askForm, email: e.target.value })}
                      placeholder="e.g. julian@example.com"
                      className="w-full bg-surface border border-outline-variant/50 rounded-lg px-3 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAskModalOpen(false)}
                    className="px-4 py-2 border border-outline-variant/40 rounded-lg text-xs font-label-caps uppercase font-semibold text-on-surface-variant hover:bg-surface-low"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary hover:bg-primary-container text-white text-xs font-label-caps uppercase font-semibold rounded-lg shadow-subtle flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Question</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-primary text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-white/20 z-50 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-secondary-container" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      <Footer />
    </div>
  );
}
