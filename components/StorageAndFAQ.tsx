'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  Flame,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Wind,
  Layers,
  ThermometerSun,
  Mail,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { FAQS, BAKER_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';

export function StorageAndFAQ() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleQuickWhatsApp = () => {
    const url = generateWhatsAppLink(
      BAKER_INFO.whatsappNumber,
      `Hello Chef Privilege! I have an inquiry regarding bulk orders and catering for an upcoming event.`
    );
    window.open(url, '_blank');
  };

  return (
    <section id="storage-faq" className="py-16 lg:py-24 bg-[#FAF7F2] border-t border-stone-200">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section 1: Freshness, Storage & Reheating Guides */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900/90 mb-2">
              <ThermometerSun className="w-3.5 h-3.5 text-amber-700" />
              <span>Baker&apos;s Freshness Secrets</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-[#2B1805] tracking-tight">
              How to Store & Reheat Your Treats
            </h2>
            <p className="text-stone-600 text-sm mt-2">
              Our pastries are handcrafted without chemical preservatives. Follow these simple tips to enjoy
              that bakery-fresh crunch and warmth anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Chin Chin Storage */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900 mb-4">
                  <Wind className="w-5 h-5 text-amber-800" />
                </div>
                <h3 className="font-bold text-stone-900 text-base mb-1">
                  Chin Chin: 6-Month Crunch
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  Keep in an airtight plastic or glass jar with a tight seal. Store in a cool, dry pantry away from direct sunlight.
                  Never leave the container open, as ambient humidity reduces crispiness.
                </p>
              </div>
              <div className="p-3 bg-amber-50/70 rounded-xl text-[11px] text-amber-950 font-medium">
                Tip: If exposed to moisture, crisp in a dry non-stick pan on very low heat for 2 minutes!
              </div>
            </div>

            {/* Card 2: Egg Rolls & Meat Pies */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900 mb-4">
                  <Flame className="w-5 h-5 text-amber-800" />
                </div>
                <h3 className="font-bold text-stone-900 text-base mb-1">
                  Egg Rolls & Meat Pies: Crisping
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  For the crispiest crust, reheat in an air fryer at 170°C (340°F) for 4–5 minutes, or in an oven at 180°C for 7 minutes.
                  Avoid microwaving if you want to maintain the flaky outer crunch.
                </p>
              </div>
              <div className="p-3 bg-amber-50/70 rounded-xl text-[11px] text-amber-950 font-medium">
                Tip: Can be refrigerated for up to 3 days and reheated oven-fresh before serving!
              </div>
            </div>

            {/* Card 3: Donuts Freshness */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900 mb-4">
                  <Layers className="w-5 h-5 text-amber-800" />
                </div>
                <h3 className="font-bold text-stone-900 text-base mb-1">
                  Artisan Donuts: Melt-in-Mouth
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  Yeast-risen artisan donuts are best savored fresh on the day of delivery. If saving for the next day,
                  keep in a sealed bakery box at room temperature.
                </p>
              </div>
              <div className="p-3 bg-amber-50/70 rounded-xl text-[11px] text-amber-950 font-medium">
                Tip: Pop a glazed donut in the microwave for 6–8 seconds for an instant warm bakery melt.
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: FAQs & Direct Contact Anchor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* FAQ Accordion (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900/90 mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>Ordering & Catering Questions</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#2B1805] tracking-tight mb-6">
              Frequently Asked Questions
            </h3>

            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-stone-900 hover:text-amber-900"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-amber-800' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact & Inquiry Hub Card (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block mb-1">
                Direct Baker Contact
              </span>
              <h4 className="font-display text-2xl font-bold text-stone-900">
                Let&apos;s Make Your Next Event Delicious!
              </h4>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Connect directly with Chef Privilege Oyegbile to discuss custom orders, bulk quotes,
                sampling, and event logistics.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                <Mail className="w-4 h-4 text-amber-800 shrink-0" />
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                    Email Inquiries:
                  </span>
                  <a
                    href={`mailto:${BAKER_INFO.email}`}
                    className="font-medium text-stone-900 hover:text-amber-900 underline"
                  >
                    {BAKER_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                <Phone className="w-4 h-4 text-amber-800 shrink-0" />
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                    Direct Phone / WhatsApp:
                  </span>
                  <span className="font-medium text-stone-900">{BAKER_INFO.phoneDisplay}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                <Sparkles className="w-4 h-4 text-amber-800 shrink-0" />
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                    Order Lead Times:
                  </span>
                  <span className="text-stone-700">{BAKER_INFO.orderLeadTime}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleQuickWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-200" />
                <span>Chat with Privilege on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
