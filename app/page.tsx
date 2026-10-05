'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { MenuCatalog } from '@/components/MenuCatalog';
import { PartyPacksSection } from '@/components/PartyPacksSection';
import { BulkCalculator } from '@/components/BulkCalculator';
import { CustomFlourStudio } from '@/components/CustomFlourStudio';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { StorageAndFAQ } from '@/components/StorageAndFAQ';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { OrderReceiptModal } from '@/components/OrderReceiptModal';
import { QuickQuoteModal } from '@/components/QuickQuoteModal';
import { PastryItem, ProductVariant, CartItem, Currency } from '@/lib/types';
import { BULK_EVENT_PACKS } from '@/lib/data';
import { Check } from 'lucide-react';

export default function HomePage() {
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [receiptModalOpen, setReceiptModalOpen] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<{
    orderRef: string;
    items: CartItem[];
    subtotal: number;
    discount: number;
    total: number;
    customerName: string;
    deliveryDate: string;
    deliveryAddress: string;
    specialNotes: string;
  } | null>(null);

  const [quickQuoteOpen, setQuickQuoteOpen] = useState<boolean>(false);
  const [quickQuoteInitial, setQuickQuoteInitial] = useState<{
    eventType?: string;
    guestCount?: number;
    date?: string;
    details?: string;
  }>({});

  // Show transient toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Add standard product item to cart
  const handleAddToCart = (item: PastryItem, variant: ProductVariant, flavor?: string) => {
    const existingIndex = cartItems.findIndex(
      (c) =>
        c.productId === item.id &&
        c.variantId === variant.id &&
        (c.selectedFlavor || '') === (flavor || '')
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        id: `${item.id}-${variant.id}-${Date.now()}`,
        productId: item.id,
        productTitle: item.title,
        variantId: variant.id,
        variantName: variant.name,
        weightOrUnit: variant.weightOrUnit,
        selectedFlavor: flavor,
        unitPriceNGN: variant.priceNGN,
        unitPriceUSD: variant.priceUSD,
        unitPriceGBP: variant.priceGBP,
        quantity: 1,
        image: item.image,
      };
      setCartItems((prev) => [...prev, newItem]);
    }

    triggerToast(`Added ${item.title} (${variant.name}) to your bag!`);
  };

  // Add bulk combo to cart
  const handleSelectCombo = (combo: (typeof BULK_EVENT_PACKS)[0]) => {
    setQuickQuoteInitial({
      eventType: combo.name,
      details: `Selected Bundle: ${combo.name}. Includes: ${combo.contents}`,
    });
    setQuickQuoteOpen(true);
  };

  // Add multiple package items to cart from bulk calculator
  const handleAddCustomPackageToCart = (items: CartItem[]) => {
    setCartItems((prev) => [...prev, ...items]);
    setIsCartOpen(true);
    triggerToast(`Loaded bulk catering package (${items.length} item types) into bag!`);
  };

  // Update item quantity in cart
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  // Remove single item
  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear cart
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Open receipt slip
  const handleOpenReceipt = (orderData: NonNullable<typeof receiptData>) => {
    setReceiptData(orderData);
    setIsCartOpen(false);
    setReceiptModalOpen(true);
  };

  // Open inquiry modal with pre-fill
  const handleOpenDirectInquiry = (initial?: {
    eventType: string;
    guestCount: number;
    date: string;
    details: string;
  }) => {
    if (initial) {
      setQuickQuoteInitial(initial);
    }
    setQuickQuoteOpen(true);
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7] text-[#1A1A1A]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D1B06] text-amber-50 px-4 py-3 rounded-xl shadow-lg border border-amber-900/40 flex items-center gap-2.5 text-xs font-medium animate-in slide-in-from-bottom-4 duration-300">
          <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        currency={currency}
        onCurrencyChange={setCurrency}
        onOpenQuickQuote={() => setQuickQuoteOpen(true)}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero
          onExploreMenu={() => {
            const el = document.getElementById('menu');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenCalculator={() => {
            const el = document.getElementById('calculator');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 3. Pastry Menu & Catalog */}
        <MenuCatalog
          currency={currency}
          onAddToCart={handleAddToCart}
          onOpenBulkCalculator={() => {
            const el = document.getElementById('calculator');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 4. Pre-Curated Party Packs & Souvenir Bundles */}
        <PartyPacksSection
          currency={currency}
          onSelectCombo={handleSelectCombo}
        />

        {/* 5. Interactive Bulk & Event Calculator */}
        <BulkCalculator
          currency={currency}
          onAddCustomPackageToCart={handleAddCustomPackageToCart}
          onOpenDirectInquiry={handleOpenDirectInquiry}
        />

        {/* 6. "Anything Flour Can Make" Custom Studio */}
        <CustomFlourStudio onSuccessToast={triggerToast} />

        {/* 7. Attributed Testimonials & Social Proof */}
        <TestimonialsSection />

        {/* 8. Storage Secrets, Reheating & FAQs */}
        <StorageAndFAQ />
      </main>

      {/* 9. Footer */}
      <Footer />

      {/* Slide-out Order Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOpenReceipt={handleOpenReceipt}
      />

      {/* Printable / Downloadable Order Slip Modal */}
      <OrderReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        orderData={receiptData}
        currency={currency}
      />

      {/* Quick Quote / Catering Inquiry Modal */}
      <QuickQuoteModal
        isOpen={quickQuoteOpen}
        onClose={() => setQuickQuoteOpen(false)}
        initialData={quickQuoteInitial}
      />
    </div>
  );
}
