'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';

export default function ContactPage() {
  const { storeSettings, submitInquiry } = useProducts();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [inquiryRefId, setInquiryRefId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName && formData.email && formData.message) {
      const created = submitInquiry(formData);
      setInquiryRefId(created.id);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      {/* Main Content Layout Area */}
      <main className="page-enter flex-grow w-full max-w-7xl mx-auto px-6 py-10 md:py-16 md:px-margin">
        {/* Header Title Banner */}
        <div className="mb-10 text-left border-b border-on-surface/10 pb-6">
          <h1 className="font-display-lg text-3xl sm:text-4xl text-on-surface font-bold tracking-tight">
            Contact E Sondha
          </h1>
          <p className="font-body-md text-sm sm:text-base text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
            We welcome architectural inquiries, everyday product questions, and collaborative dialogues. Reach our studio through the message portal or via our direct lines below.
          </p>
        </div>

        {/* Asymmetrical 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Contact Form (7 cols) */}
          <section className="lg:col-span-7 bg-surface-lowest border border-on-surface/15 rounded-xl p-6 sm:p-8 shadow-subtle">
            <div className="mb-6">
              <h2 className="font-headline-lg text-xl sm:text-2xl text-on-surface font-bold">
                Send Us a Message
              </h2>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1.5">
                We would love to hear from you. Fill out the form and our studio team will get back to you within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div className="py-12 px-6 text-center bg-surface-low rounded-lg border border-outline-variant/30 flex flex-col items-center animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-olive/15 text-olive flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-headline-md text-lg font-bold text-on-surface mb-1">
                  Message Dispatched to Atelier
                </h3>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-md mb-3">
                  Thank you, {formData.fullName}. Your note has been registered in our studio inquiries portal under reference <strong className="font-mono text-primary font-semibold">{inquiryRefId}</strong>. Our Portland curators will respond within one business day.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-olive/10 text-olive rounded-full text-xs font-semibold mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Status: Queued in Atelier Inbox</span>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ fullName: '', email: '', subject: '', message: '' });
                      setInquiryRefId('');
                    }}
                    className="px-5 py-2 bg-primary text-white font-label-caps text-xs tracking-label-caps uppercase rounded-lg hover:bg-primary-container transition-colors cursor-pointer"
                  >
                    Send Another Note
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label
                    className="block font-label-caps text-xs tracking-label-caps text-on-surface-variant font-semibold uppercase mb-2"
                    htmlFor="fullName"
                  >
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg px-4 py-3 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label
                    className="block font-label-caps text-xs tracking-label-caps text-on-surface-variant font-semibold uppercase mb-2"
                    htmlFor="email"
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg px-4 py-3 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label
                    className="block font-label-caps text-xs tracking-label-caps text-on-surface-variant font-semibold uppercase mb-2"
                    htmlFor="subject"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Order inquiry, craftsmanship, or trade collaboration"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg px-4 py-3 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    className="block font-label-caps text-xs tracking-label-caps text-on-surface-variant font-semibold uppercase mb-2"
                    htmlFor="message"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="How can we assist your slow-living journey?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg px-4 py-3 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors resize-y"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-white font-label-caps text-xs tracking-label-caps px-8 py-3.5 rounded-lg transition-all duration-200 uppercase font-semibold shadow-subtle cursor-pointer"
                  >
                    <span>SEND MESSAGE</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Right Column: Direct Info & Storefront Hours (5 cols) */}
          <section className="lg:col-span-5 space-y-6">
            {/* Direct Contact Card with Line-Art Iconography */}
            <div className="bg-surface-lowest border border-on-surface/15 rounded-xl p-6 sm:p-8 space-y-6 shadow-subtle">
              <h3 className="font-headline-lg text-lg sm:text-xl text-on-surface font-semibold pb-4 border-b border-outline-variant/20">
                Direct Inquiries
              </h3>

              {/* Email Item */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 rounded-lg border border-on-surface/15 flex items-center justify-center bg-surface-low text-primary">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="block font-label-caps text-xs font-semibold text-on-surface-variant uppercase">
                    EMAIL
                  </span>
                  <a
                    href={`mailto:${storeSettings?.contactEmail || 'hello@esondha.com'}`}
                    className="block font-body-md text-xs sm:text-sm text-on-surface hover:text-primary transition-colors font-medium"
                  >
                    {storeSettings?.contactEmail || 'hello@esondha.com'}
                  </a>
                  <span className="block font-body-md text-xs text-on-surface-variant">
                    Concierge &amp; Trade Inquiries
                  </span>
                </div>
              </div>

              {/* Phone Item */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 rounded-lg border border-on-surface/15 flex items-center justify-center bg-surface-low text-primary">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="block font-label-caps text-xs font-semibold text-on-surface-variant uppercase">
                    PHONE
                  </span>
                  <a
                    href={`tel:${(storeSettings?.contactPhone || '+15553492810').replace(/[^0-9+]/g, '')}`}
                    className="block font-body-md text-xs sm:text-sm text-on-surface font-medium hover:text-primary transition-colors"
                  >
                    {storeSettings?.contactPhone || '+1 (555) 349-2810'}
                  </a>
                  <span className="block font-label-sm text-[11px] text-outline">
                    Mon-Fri, 9am – 5pm EST
                  </span>
                </div>
              </div>

              {/* Studio Location */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 rounded-lg border border-on-surface/15 flex items-center justify-center bg-surface-low text-primary">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="block font-label-caps text-xs font-semibold text-on-surface-variant uppercase">
                    STUDIO ATELIER
                  </span>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface whitespace-pre-line">
                    {storeSettings?.studioAddress || '1420 Franklin Street, Suite 4B\nPortland, OR 97201'}
                  </p>
                </div>
              </div>

              {/* Quiet Consultations */}
              <div className="flex items-start gap-4 pt-2 border-t border-outline-variant/15">
                <div className="w-10 h-10 shrink-0 rounded-lg border border-on-surface/15 flex items-center justify-center bg-surface-low text-primary">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="block font-label-caps text-xs font-semibold text-on-surface-variant uppercase">
                    SPATIAL CONSULTATIONS
                  </span>
                  <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                    By private appointment for custom homeware curation, living ceramics, and quiet spatial styling.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
