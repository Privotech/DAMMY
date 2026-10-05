'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MenuCatalog } from '@/components/MenuCatalog';
import { PartyPacksSection } from '@/components/PartyPacksSection';
import { BulkCalculator } from '@/components/BulkCalculator';
import { CustomFlourStudio } from '@/components/CustomFlourStudio';
import { StorageAndFAQ } from '@/components/StorageAndFAQ';
import { QuickQuoteModal } from '@/components/QuickQuoteModal';
import { Currency } from '@/lib/types';
import { BULK_EVENT_PACKS } from '@/lib/data';

type Section = 'menu' | 'party-packs' | 'event-calculator' | 'custom-orders' | 'help';

export function SiteSectionPage({ section }: { section: Section }) {
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteInitial, setQuoteInitial] = useState<{ eventType?: string; guestCount?: number; date?: string; details?: string }>({});
  const openQuote = (initial?: { eventType: string; guestCount: number; date: string; details: string }) => {
    if (initial) setQuoteInitial(initial);
    setQuoteOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7] text-[#1A1A1A]">
      <Navbar cartCount={0} onOpenCart={() => setQuoteOpen(true)} currency={currency} onCurrencyChange={setCurrency} onOpenQuickQuote={() => openQuote()} />
      <main className="flex-1">
        {section === 'menu' && <MenuCatalog currency={currency} onAddToCart={() => setQuoteOpen(true)} onOpenBulkCalculator={() => { window.location.href = '/event-calculator'; }} />}
        {section === 'party-packs' && <PartyPacksSection currency={currency} onSelectCombo={(combo: (typeof BULK_EVENT_PACKS)[number]) => openQuote({ eventType: combo.name, guestCount: 75, date: '', details: `Selected Bundle: ${combo.name}. Includes: ${combo.contents}` })} />}
        {section === 'event-calculator' && <BulkCalculator currency={currency} onAddCustomPackageToCart={() => setQuoteOpen(true)} onOpenDirectInquiry={openQuote} />}
        {section === 'custom-orders' && <CustomFlourStudio onSuccessToast={() => undefined} />}
        {section === 'help' && <StorageAndFAQ />}
      </main>
      <Footer />
      <QuickQuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} initialData={quoteInitial} />
    </div>
  );
}
