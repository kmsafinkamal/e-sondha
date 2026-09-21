'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  Compass,
  Lightbulb,
  HeartHandshake,
  Wrench,
  Check,
  ArrowRight,
  Quote,
  Sparkles,
  Leaf,
  Shield,
  Layers,
  MapPin,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Scale
} from 'lucide-react';

export default function AboutPage() {
  const [comparatorMode, setComparatorMode] = useState<'slow' | 'fast'>('slow');

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      {/* Main Editorial Canvas */}
      <main className="page-enter flex-grow w-full max-w-5xl mx-auto px-5 sm:px-8 md:px-margin py-12 md:py-16">
        {/* Hero Editorial Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="font-label-caps text-xs tracking-label-caps text-primary uppercase font-bold block mb-3">
            EDITORIAL ATELIER PHILOSOPHY
          </span>
          <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl text-on-surface font-bold tracking-tight mb-4">
            The Quiet Pursuit of Purpose
          </h1>
          <p className="font-body-lg text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Mindfully crafted everyday archetypes shaped by Japanese restraint and Scandinavian warmth. Designed to bring serenity, enduring utility, and domestic calm to your daily spaces.
          </p>
        </div>

        {/* Editorial Hero Visual / Craft Banner */}
        <div className="relative w-full rounded-3xl overflow-hidden border border-on-surface/15 mb-16 bg-surface-low flex flex-col md:flex-row items-stretch shadow-subtle">
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="font-headline-lg text-xl sm:text-2xl text-on-surface font-bold mb-3">
              Quiet Form &amp; Timeless Function
            </h2>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Rooted in a harmony of Japanese restraint and Scandinavian purposeful warmth, every silhouette at E Sondha is refined to its purest utility. We strip away noise to reveal calm, intentional design for modern living spaces.
            </p>
          </div>

          <div className="w-full md:w-1/2 min-h-[260px] md:min-h-full border-t md:border-t-0 md:border-l border-on-surface/15 relative overflow-hidden bg-gradient-to-br from-[#f2eee9] via-[#e5ded4] to-[#d6ccc0] flex items-center justify-center p-8">
            <div className="text-center p-6 border border-outline-variant/30 rounded-2xl bg-surface-lowest/90 backdrop-blur-md max-w-xs shadow-card">
              <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
              <span className="font-label-caps text-xs font-bold text-on-surface uppercase block mb-1">
                The Atelier Standard
              </span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Hand-thrown high-fired stoneware, ring-spun organic jerseys, and zero superfluous adornments.
              </p>
            </div>
          </div>
        </div>



        {/* Central Philosophy Quote Box */}
        <div className="my-16 p-8 md:p-12 rounded-3xl bg-surface-lowest border border-on-surface/20 text-center shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
          <Quote className="w-8 h-8 text-primary/40 mx-auto mb-3" />
          <blockquote className="font-headline-md text-base sm:text-xl text-on-surface italic max-w-2xl mx-auto font-normal leading-relaxed">
            &ldquo;We believe that the objects surrounding you should bring quiet clarity to your everyday life.&rdquo;
          </blockquote>
          <div className="mt-4 font-label-caps text-xs tracking-wider text-primary font-semibold uppercase">
            E SONDHA DESIGN PHILOSOPHY · EST. 2020
          </div>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE COMPARATOR: SLOW CRAFT VS FAST PRODUCTION        */}
        {/* ============================================================ */}
        <section className="my-16">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="font-label-caps text-xs tracking-label-caps uppercase font-bold text-primary">
              Ethical Blueprint
            </span>
            <h2 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Slow Living vs Conventional Fast Trend
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              We reject planned obsolescence. Compare our atelier manufacturing ethics directly against conventional mass production.
            </p>

            {/* Interactive Toggle Pill */}
            <div className="pt-4 flex justify-center">
              <div className="inline-flex p-1 rounded-2xl bg-surface-low border border-outline-variant/40 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setComparatorMode('slow')}
                  className={`px-5 py-2 rounded-xl text-xs font-semibold font-label-caps uppercase tracking-label-caps transition-all cursor-pointer ${
                    comparatorMode === 'slow'
                      ? 'bg-primary text-white shadow-subtle'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Atelier Slow Craft
                </button>
                <button
                  type="button"
                  onClick={() => setComparatorMode('fast')}
                  className={`px-5 py-2 rounded-xl text-xs font-semibold font-label-caps uppercase tracking-label-caps transition-all cursor-pointer ${
                    comparatorMode === 'fast'
                      ? 'bg-red-700 text-white shadow-subtle'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Conventional Fast Trend
                </button>
              </div>
            </div>
          </div>

          {/* Comparator Content Card */}
          <div className="bg-surface-lowest border border-outline-variant/30 rounded-3xl p-6 sm:p-10 shadow-card transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Pillar 1: Material Purity */}
              <div className="p-5 rounded-2xl bg-surface-low border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-surface-lowest border border-outline-variant/30 flex items-center justify-center mb-4 text-primary">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <span className="font-label-caps text-[10px] uppercase font-bold text-primary block mb-1">
                    Pillar 01
                  </span>
                  <h4 className="font-bold text-sm text-on-surface mb-2">
                    Material Purity
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {comparatorMode === 'slow'
                      ? '100% GOTS certified organic Aegean cotton, lead-free high-fire kaolin clay, and raw architectural brass.'
                      : 'Petroleum-based synthetic polyesters, microplastic leaching fibers, and toxic chemical dyes.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center gap-1.5 text-xs font-semibold">
                  {comparatorMode === 'slow' ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> 100% Traceable
                    </span>
                  ) : (
                    <span className="text-red-700 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Synthetic Blends
                    </span>
                  )}
                </div>
              </div>

              {/* Pillar 2: Lifespan & Longevity */}
              <div className="p-5 rounded-2xl bg-surface-low border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-surface-lowest border border-outline-variant/30 flex items-center justify-center mb-4 text-primary">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="font-label-caps text-[10px] uppercase font-bold text-primary block mb-1">
                    Pillar 02
                  </span>
                  <h4 className="font-bold text-sm text-on-surface mb-2">
                    Designed Lifespan
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {comparatorMode === 'slow'
                      ? 'Constructed with double-needle flat-felled seams and reinforced corners to endure decades of gentle use.'
                      : 'Engineered for planned obsolescence; loses structural shape and tears within 5 to 10 wash cycles.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center gap-1.5 text-xs font-semibold">
                  {comparatorMode === 'slow' ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> 10+ Year Longevity
                    </span>
                  ) : (
                    <span className="text-red-700 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Landfill in 6 Mos
                    </span>
                  )}
                </div>
              </div>

              {/* Pillar 3: Patina & Aging */}
              <div className="p-5 rounded-2xl bg-surface-low border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-surface-lowest border border-outline-variant/30 flex items-center justify-center mb-4 text-primary">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="font-label-caps text-[10px] uppercase font-bold text-primary block mb-1">
                    Pillar 03
                  </span>
                  <h4 className="font-bold text-sm text-on-surface mb-2">
                    Living Patina
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {comparatorMode === 'slow'
                      ? 'Materials develop a rich, authentic tactile patina with sunlight and handling, growing more beautiful over time.'
                      : 'Plastic topcoats crack, peel, and discolor into unsightly synthetic residue.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center gap-1.5 text-xs font-semibold">
                  {comparatorMode === 'slow' ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Beautiful Patina
                    </span>
                  ) : (
                    <span className="text-red-700 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Peeling Finish
                    </span>
                  )}
                </div>
              </div>

              {/* Pillar 4: Packaging & Planet */}
              <div className="p-5 rounded-2xl bg-surface-low border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-surface-lowest border border-outline-variant/30 flex items-center justify-center mb-4 text-primary">
                    <Scale className="w-5 h-5" />
                  </div>
                  <span className="font-label-caps text-[10px] uppercase font-bold text-primary block mb-1">
                    Pillar 04
                  </span>
                  <h4 className="font-bold text-sm text-on-surface mb-2">
                    Unboxing Footprint
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {comparatorMode === 'slow'
                      ? 'Zero virgin plastics. 100% post-consumer FSC paperboard, non-toxic algae inks, and starch tape.'
                      : 'Individual single-use polyethylene bags, styrofoam inserts, and non-recyclable metallic coatings.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center gap-1.5 text-xs font-semibold">
                  {comparatorMode === 'slow' ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> 100% Plastic Free
                    </span>
                  ) : (
                    <span className="text-red-700 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Single-Use Plastic
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subtle Divider */}
        <div className="w-full border-t border-outline-variant/20 my-16" />

        {/* Structured Narrative Grid (Mission, Values, Workshop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Section 1: Our Mission */}
          <article className="p-6 rounded-2xl border border-on-surface/15 bg-surface-lowest flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-card">
            <div className="w-12 h-12 rounded-xl border border-on-surface/20 flex items-center justify-center mb-6 bg-surface-low text-primary">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="font-headline-md text-base sm:text-lg text-on-surface font-semibold mb-3">
              Our Mission
            </h3>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              To curate and manufacture enduring archetypes. By resisting fast-trend consumption, we empower homes with quiet objects that age gracefully with everyday life.
            </p>
          </article>

          {/* Section 2: Our Values */}
          <article className="p-6 rounded-2xl border border-on-surface/15 bg-surface-lowest flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-card">
            <div className="w-12 h-12 rounded-xl border border-on-surface/20 flex items-center justify-center mb-6 bg-surface-low text-primary">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-headline-md text-base sm:text-lg text-on-surface font-semibold mb-3">
              Our Values
            </h3>
            <ul className="space-y-2.5 font-body-md text-xs sm:text-sm text-on-surface-variant">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong className="text-on-surface">Radical Simplicity:</strong> Uncluttered utility.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong className="text-on-surface">Conscious Materials:</strong> Certified natural fibers.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong className="text-on-surface">Artisanal Respect:</strong> Honoring small ateliers.
                </span>
              </li>
            </ul>
          </article>

          {/* Section 3: The Workshop */}
          <article className="p-6 rounded-2xl border border-on-surface/15 bg-surface-lowest flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-card">
            <div className="w-12 h-12 rounded-xl border border-on-surface/20 flex items-center justify-center mb-6 bg-surface-low text-primary">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="font-headline-md text-base sm:text-lg text-on-surface font-semibold mb-3">
              The Workshop
            </h3>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Founded in 2020 as a micro-studio, E Sondha collaborates with master ceramicists in Kyoto and ethical garment weavers in Guimarães to build tomorrow&apos;s heirlooms.
            </p>
          </article>
        </div>

        {/* Editorial Call to Action Banner */}
        <div className="rounded-3xl p-8 sm:p-10 bg-surface-low border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-subtle">
          <div>
            <span className="font-label-caps text-xs uppercase font-bold text-primary block mb-1">
              DISCOVER OUR CATALOG
            </span>
            <h4 className="font-headline-lg text-xl sm:text-2xl text-on-surface font-bold mb-1">
              Explore Our Essentials
            </h4>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
              Experience quiet homeware, enduring apparel, and purposeful carry gear.
            </p>
          </div>
          <Link
            href="/shop"
            className="btn-interactive px-6 py-3.5 rounded-xl bg-primary text-white font-label-caps text-xs tracking-label-caps font-semibold hover:bg-primary-container transition-all shrink-0 inline-flex items-center gap-2 uppercase shadow-subtle active:scale-95"
          >
            <span>EXPLORE THE SHOP</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
