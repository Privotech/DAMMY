'use client';

import React from 'react';
import { Star, Quote, Award } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/data';

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900/90 mb-2">
            <Award className="w-3.5 h-3.5 text-amber-700" />
            <span>Client Praise & Event Experiences</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-[#2B1805] tracking-tight">
            Loved by Event Planners & Treat Enthusiasts
          </h2>
          <p className="text-stone-600 text-sm mt-2">
            Read how our fresh chin chin jars, hot egg rolls, and fluffy donuts made their celebrations unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#FAFAF7] p-6 rounded-2xl border border-stone-200/90 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center gap-1 mb-3 text-amber-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200/70">
                <div className="font-bold text-xs sm:text-sm text-stone-900">{t.name}</div>
                <div className="text-[11px] text-stone-500 font-medium">
                  {t.role} · <span className="text-amber-900 font-semibold">{t.event}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
