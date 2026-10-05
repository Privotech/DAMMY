'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Clock, Award } from 'lucide-react';
import { BAKER_INFO } from '@/lib/data';

interface HeroProps {
  onExploreMenu: () => void;
  onOpenCalculator: () => void;
}

export function Hero({ onExploreMenu, onOpenCalculator }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-stone-200/80">
      {/* Background warm subtle ambient gradient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(229,168,35,0.12),rgba(255,255,255,0))]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Editorial kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900/90 mb-3">
              <span>Fresh Handcrafted Kitchen</span>
              <span aria-hidden="true">·</span>
              <span>Bulk & Retail Available</span>
              <span aria-hidden="true">·</span>
              <span>Made in Small Batches</span>
            </div>

            {/* Main Headline with balanced wrapping */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2B1805] leading-[1.12] mb-5 [text-wrap:balance]">
              Golden Chin Chin, Fluffy Donuts, Crisp Egg Rolls & Custom Flour Pastries.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed mb-8 max-w-2xl">
              Freshly fried and baked with pure creamery butter and aromatic spices.
              Whether you need personal movie-night snack pouches, family tubs, or 10-litre
              celebration buckets for weddings, church feasts, and parties — we craft anything
              flour can make with homemade love.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
              <button
                type="button"
                onClick={onExploreMenu}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2D1B06] hover:bg-[#432A0C] text-amber-50 font-semibold text-sm sm:text-base shadow-sm hover:shadow-md transition-all focus-visible:ring-2 focus-visible:ring-amber-500 group"
              >
                <span>Explore Menu & Bulk Tiers</span>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onOpenCalculator}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-semibold text-sm sm:text-base shadow-xs transition-all focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Event Catering Calculator</span>
              </button>
            </div>

            {/* Claim-to-Proof Adjacency Row */}
            <div className="pt-6 border-t border-stone-200/90 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div>
                <div className="font-bold text-lg text-stone-900 tabular-nums">100%</div>
                <div className="text-xs text-stone-500 mt-0.5">Fresh Butter & Spices</div>
              </div>
              <div>
                <div className="font-bold text-lg text-stone-900 tabular-nums">6 Months</div>
                <div className="text-xs text-stone-500 mt-0.5">Sealed Chin Chin Crunch</div>
              </div>
              <div>
                <div className="font-bold text-lg text-stone-900 tabular-nums">20 – 1000+</div>
                <div className="text-xs text-stone-500 mt-0.5">Guest Event Capacity</div>
              </div>
              <div>
                <div className="font-bold text-lg text-stone-900 tabular-nums">Same Day</div>
                <div className="text-xs text-stone-500 mt-0.5">Morning-of Frying</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Zero-Broken-Image Policy Fallback */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-amber-950/10 border border-stone-200 bg-[#EFECE6] aspect-[4/3] sm:aspect-[16/11]">
              <Image
                src="/images/hero.jpg"
                alt="Luxurious artisanal bakery spread of golden Nigerian chin chin in glass jars, fluffy sugar-glazed donuts, golden egg rolls, and savory meat pies on a baker table"
                fill
                priority
                className="object-cover hover:scale-102 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                referrerPolicy="no-referrer"
              />

              {/* Scrim overlay for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* In-photo anchor caption */}
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white">Freshly Handcrafted by Privilege Oyegbile</div>
                  <div className="text-amber-300 font-medium">Lagos & Nationwide Delivery</div>
                </div>
                <div className="text-stone-300 text-[11px] mt-0.5">
                  Small retail pouches · 5L & 10L Party buckets · Event trays
                </div>
              </div>
            </div>

            {/* Quick trust badge card */}
            <div className="mt-3 bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-xs flex items-center justify-between gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero preservatives · Fried in clean, fresh vegetable oil</span>
              </div>
              <a
                href="#custom-studio"
                className="font-medium text-amber-800 hover:text-amber-900 underline underline-offset-2 shrink-0"
              >
                Custom requests
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
