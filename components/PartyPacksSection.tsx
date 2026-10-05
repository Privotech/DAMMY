'use client';

import React from 'react';
import { Sparkles, Users, Gift, Check, ArrowRight } from 'lucide-react';
import { BULK_EVENT_PACKS } from '@/lib/data';
import { Currency } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface PartyPacksSectionProps {
  currency: Currency;
  onSelectCombo: (combo: typeof BULK_EVENT_PACKS[0]) => void;
}

export function PartyPacksSection({ currency, onSelectCombo }: PartyPacksSectionProps) {
  return (
    <section id="bulk-deals" className="py-16 bg-[#F5F2EB] border-t border-b border-stone-200/90">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900/90 mb-2">
            <Gift className="w-3.5 h-3.5 text-amber-700" />
            <span>Party & Celebration Packages</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2B1805] tracking-tight">
            Curated Event & Souvenir Bundles
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3">
            Handpicked treat combinations balanced with crunchy chin chin jars, fluffy glazed donuts, and golden egg rolls.
            Bundled at wholesale event discounts for easy entertaining.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {BULK_EVENT_PACKS.map((pack) => {
            const price =
              currency === 'NGN'
                ? pack.estimatedPriceNGN
                : currency === 'USD'
                ? pack.estimatedPriceUSD
                : pack.estimatedPriceGBP;

            return (
              <div
                key={pack.id}
                className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative overflow-hidden"
              >
                {/* Discount Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                    <Users className="w-4 h-4 text-amber-700" />
                    <span>{pack.recommendedGuests}</span>
                  </div>
                  <span className="text-xs font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-md">
                    Save {pack.discountPercent}% Bulk
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-stone-900 tracking-tight mb-2">
                    {pack.name}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed mb-4 bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <strong className="text-stone-800 block mb-1">Package Includes:</strong>
                    {pack.contents}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-amber-900 font-medium mb-6">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{pack.highlight}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block tracking-wider">
                      Bundle Price
                    </span>
                    <span className="text-2xl font-bold text-[#2B1805] tabular-nums">
                      {formatPrice(price, currency)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectCombo(pack)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2D1B06] hover:bg-[#432A0C] text-amber-50 text-xs font-semibold transition-all shadow-xs"
                  >
                    <span>Inquire / Order</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
