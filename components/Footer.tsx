'use client';

import React from 'react';
import { ChefHat, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { BAKER_INFO } from '@/lib/data';

export function Footer() {
  return (
    <footer className="bg-[#1C1205] text-[#D8CFBF] border-t border-amber-950/40 pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-amber-950/60">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E5A823] flex items-center justify-center text-stone-950 font-bold">
                <ChefHat className="w-5 h-5 text-stone-950" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Privy FlourCraft
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Homemade treats crafted with pure butter, fresh spices, and love.
              Selling in small packs and bulk wholesale buckets for parties, weddings, and corporate events.
            </p>
            <div className="text-[11px] text-amber-400/90 font-medium">
              Owned & Operated by {BAKER_INFO.name}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <span className="font-bold uppercase tracking-wider text-amber-300 text-[11px] block">
              Bakery Menu
            </span>
            <ul className="space-y-2 text-stone-400">
              <li>
                <a href="#menu" className="hover:text-amber-200 transition-colors">
                  Crunchy Golden Chin Chin
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-200 transition-colors">
                  Fluffy Glazed Donuts
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-200 transition-colors">
                  Traditional Golden Egg Rolls
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-200 transition-colors">
                  Flaky Meat & Chicken Pies
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-200 transition-colors">
                  Sweet Puff Puff Drums
                </a>
              </li>
            </ul>
          </div>

          {/* Catering & Services */}
          <div className="space-y-3">
            <span className="font-bold uppercase tracking-wider text-amber-300 text-[11px] block">
              Event Catering
            </span>
            <ul className="space-y-2 text-stone-400">
              <li>
                <a href="#bulk-deals" className="hover:text-amber-200 transition-colors">
                  Wedding Souvenir Jars
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-amber-200 transition-colors">
                  Bulk Calculator & Tiers
                </a>
              </li>
              <li>
                <a href="#custom-studio" className="hover:text-amber-200 transition-colors">
                  Flour Craft Studio (Custom)
                </a>
              </li>
              <li>
                <a href="#storage-faq" className="hover:text-amber-200 transition-colors">
                  6-Month Storage & Reheating
                </a>
              </li>
              <li>
                <a href="#storage-faq" className="hover:text-amber-200 transition-colors">
                  Lead Times & FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div className="space-y-3">
            <span className="font-bold uppercase tracking-wider text-amber-300 text-[11px] block">
              Direct Orders & Inquiries
            </span>
            <div className="space-y-2 text-stone-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a
                  href={`mailto:${BAKER_INFO.email}`}
                  className="hover:text-amber-200 transition-colors underline underline-offset-2"
                >
                  {BAKER_INFO.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{BAKER_INFO.phoneDisplay}</span>
              </div>
              <div className="flex items-start gap-2 pt-1 text-stone-400 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Fresh kitchen batches delivered to your door or event venue</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} {BAKER_INFO.businessName}. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Freshly baked with love & premium ingredients</span>
            <Heart className="w-3 h-3 text-amber-400 fill-amber-400 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
