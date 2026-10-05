'use client';

import React, { useState } from 'react';
import { ShoppingBag, Phone, Menu, X, Sparkles, ChefHat } from 'lucide-react';
import { Currency } from '@/lib/types';
import { BAKER_INFO } from '@/lib/data';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onOpenQuickQuote: () => void;
}

export function Navbar({
  cartCount,
  onOpenCart,
  currency,
  onCurrencyChange,
  onOpenQuickQuote,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top Banner: Quick Contact & Lead Time */}
      <div className="bg-[#2D1B06] text-[#F3E5D0] px-4 py-1.5 text-xs">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-medium truncate">
              Fresh Daily Batches · Bulk Event Bookings Open for 2026/2027
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-stone-300 shrink-0">
            <span>Direct Baker: {BAKER_INFO.name}</span>
            <span aria-hidden="true">·</span>
            <a
              href={`mailto:${BAKER_INFO.email}`}
              className="hover:text-amber-300 transition-colors underline-offset-2 hover:underline"
            >
              {BAKER_INFO.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav Bar (Strict 3-zone Top Bar Contract) */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark brand element */}
        <a href="/" className="flex items-center gap-2.5 text-slate-900 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E5A823] to-[#B87D0E] flex items-center justify-center text-white shadow-sm shadow-amber-900/10 group-hover:scale-105 transition-transform">
            <ChefHat className="w-5 h-5 text-amber-50" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl sm:text-2xl text-[#2B1805] tracking-tight leading-none">
              {BAKER_INFO.shortName}
            </span>
            <span className="text-[11px] font-medium text-amber-900/70 tracking-wider uppercase mt-0.5">
              Homemade Pastries & Bulk Catering
            </span>
          </div>
        </a>

        {/* Zone 2: 4-5 Clean Navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-700">
          <a
            href="/menu"
            className="hover:text-[#9A5B0B] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#E5A823] hover:after:w-full after:transition-all"
          >
            Menu & Treats
          </a>
          <a
            href="/party-packs"
            className="hover:text-[#9A5B0B] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#E5A823] hover:after:w-full after:transition-all"
          >
            Party Packs
          </a>
          <a
            href="/event-calculator"
            className="hover:text-[#9A5B0B] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#E5A823] hover:after:w-full after:transition-all"
          >
            Event Calculator
          </a>
          <a
            href="/custom-orders"
            className="hover:text-[#9A5B0B] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#E5A823] hover:after:w-full after:transition-all"
          >
            Flour Craft Studio
          </a>
          <a
            href="/help"
            className="hover:text-[#9A5B0B] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#E5A823] hover:after:w-full after:transition-all"
          >
            Storage & FAQs
          </a>
        </nav>

        {/* Zone 3: Currency Switcher + Bag Action + Primary CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Currency Toggle */}
          <div className="flex items-center bg-stone-200/70 p-0.5 rounded-lg text-xs font-semibold text-stone-700">
            {(['NGN', 'USD', 'GBP'] as Currency[]).map((cur) => (
              <button
                key={cur}
                type="button"
                onClick={() => onCurrencyChange(cur)}
                className={`px-2 py-1 rounded-md transition-all ${
                  currency === cur
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
                title={`Switch currency to ${cur}`}
              >
                {cur === 'NGN' ? '₦' : cur === 'USD' ? '$' : '£'}
              </button>
            ))}
          </div>

          {/* Cart Bag Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-800 transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="View order bag"
          >
            <ShoppingBag className="w-5 h-5 text-stone-800" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#B87D0E] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-50">
                {cartCount}
              </span>
            )}
          </button>

          {/* Quote / Inquire CTA */}
          <button
            type="button"
            onClick={onOpenQuickQuote}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2D1B06] hover:bg-[#432A0C] text-amber-50 text-xs sm:text-sm font-semibold shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-amber-600 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Order / Get Quote</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-[#FAFAF7] px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-stone-800">
            <a
              href="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-100"
            >
              Menu & Treats
            </a>
            <a
              href="/party-packs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-100"
            >
              Party & Event Packs
            </a>
            <a
              href="/event-calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-100"
            >
              Bulk & Event Calculator
            </a>
            <a
              href="/custom-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-100"
            >
              Flour Craft Studio (Custom Treats)
            </a>
            <a
              href="/help"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-100"
            >
              Storage & FAQs
            </a>
          </nav>
          <div className="pt-2 border-t border-stone-200 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuickQuote();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2D1B06] text-amber-50 font-semibold text-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Request Event Quote</span>
            </button>
            <div className="flex items-center justify-between text-xs text-stone-500 px-2 pt-1">
              <span>Direct WhatsApp & Call:</span>
              <a href={`tel:${BAKER_INFO.whatsappNumber}`} className="font-semibold text-amber-800">
                {BAKER_INFO.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
