'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  Mail,
  FileCheck,
  ShoppingBag,
  Sparkles,
  Calendar,
  MapPin,
  Check,
} from 'lucide-react';
import { CartItem, Currency } from '@/lib/types';
import { BAKER_INFO } from '@/lib/data';
import { formatPrice, generateWhatsAppLink, generateOrderReference } from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: Currency;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOpenReceipt: (orderData: {
    orderRef: string;
    items: CartItem[];
    subtotal: number;
    discount: number;
    total: number;
    customerName: string;
    deliveryDate: string;
    deliveryAddress: string;
    specialNotes: string;
  }) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenReceipt,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [specialNotes, setSpecialNotes] = useState<string>('');

  if (!isOpen) return null;

  // Calculate Subtotal & Bulk Discount
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce((acc, item) => {
    const unitPrice =
      currency === 'NGN'
        ? item.unitPriceNGN
        : currency === 'USD'
        ? item.unitPriceUSD
        : item.unitPriceGBP;
    return acc + unitPrice * item.quantity;
  }, 0);

  // Bulk discount if multiple bulk units or large subtotal
  let discountPct = 0;
  if (totalItemCount >= 10) {
    discountPct = 15;
  } else if (totalItemCount >= 5) {
    discountPct = 10;
  } else if (totalItemCount >= 3) {
    discountPct = 5;
  }

  const discountAmount = Number(((subtotal * discountPct) / 100).toFixed(2));
  const finalTotal = subtotal - discountAmount;

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    const ref = generateOrderReference();
    const itemLines = cartItems.map(
      (item) =>
        `  • ${item.quantity}x ${item.productTitle} (${item.variantName}${
          item.selectedFlavor ? ` - ${item.selectedFlavor}` : ''
        })`
    );

    const message = [
      `*NEW ORDER INQUIRY [${ref}] — ${BAKER_INFO.businessName}*`,
      `=========================================`,
      customerName ? `• *Customer:* ${customerName}` : '',
      customerPhone ? `• *Phone / WhatsApp:* ${customerPhone}` : '',
      deliveryDate ? `• *Needed By Date:* ${deliveryDate}` : '',
      deliveryAddress ? `• *Delivery Address / Venue:* ${deliveryAddress}` : '',
      specialNotes ? `• *Notes:* ${specialNotes}` : '',
      ``,
      `*ORDERED ITEMS:*`,
      ...itemLines,
      ``,
      `• *Subtotal:* ${formatPrice(subtotal, currency)}`,
      discountPct > 0 ? `• *Bulk Discount (${discountPct}%):* -${formatPrice(discountAmount, currency)}` : '',
      `• *ESTIMATED TOTAL:* ${formatPrice(finalTotal, currency)}`,
      ``,
      `Hello Chef Privilege! I'd like to confirm this order and get your payment/account details. Thank you!`,
    ]
      .filter(Boolean)
      .join('\n');

    const url = generateWhatsAppLink(BAKER_INFO.whatsappNumber, message);
    window.open(url, '_blank');
  };

  const handleEmailCheckout = () => {
    if (cartItems.length === 0) return;

    const ref = generateOrderReference();
    const subject = encodeURIComponent(`Order Inquiry [${ref}]: ${customerName || 'Customer'}`);
    const itemLines = cartItems
      .map(
        (item) =>
          `- ${item.quantity}x ${item.productTitle} (${item.variantName} | ${
            item.selectedFlavor || 'Standard'
          })`
      )
      .join('\n');

    const body = encodeURIComponent(
      `Hello Chef Privilege Oyegbile,\n\n` +
      `I would like to place the following pastry order:\n\n` +
      `Items:\n${itemLines}\n\n` +
      `Total Estimated: ${formatPrice(finalTotal, currency)}\n` +
      `Needed By Date: ${deliveryDate || 'Flexible'}\n` +
      `Delivery Address: ${deliveryAddress || 'To be specified'}\n` +
      `Customer Name: ${customerName}\n` +
      `Phone: ${customerPhone}\n` +
      `Special Instructions: ${specialNotes}\n\n` +
      `Please let me know how to finalize payment.\n\nThank you!`
    );

    window.location.href = `mailto:${BAKER_INFO.email}?subject=${subject}&body=${body}`;
  };

  const handleGenerateReceipt = () => {
    const ref = generateOrderReference();
    onOpenReceipt({
      orderRef: ref,
      items: cartItems,
      subtotal,
      discount: discountAmount,
      total: finalTotal,
      customerName: customerName || 'Valued Customer',
      deliveryDate: deliveryDate || 'As agreed with Baker',
      deliveryAddress: deliveryAddress || 'Store Pickup / Direct Delivery',
      specialNotes: specialNotes || 'None',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-[#FAFAF7]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-800" />
              <h2 className="font-display text-lg font-bold text-stone-900">
                Your Pastry Bag ({totalItemCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body: Items list or Empty state */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-semibold text-stone-700">Your bag is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Add our crispy chin chin pouches, fluffy glazed donuts, or party catering trays from the menu.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 px-4 py-2 rounded-xl bg-[#2D1B06] text-amber-50 text-xs font-semibold"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                {/* Item List */}
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const unitPrice =
                      currency === 'NGN'
                        ? item.unitPriceNGN
                        : currency === 'USD'
                        ? item.unitPriceUSD
                        : item.unitPriceGBP;

                    return (
                      <div
                        key={item.id}
                        className="flex gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80 items-start"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                          <Image
                            src={item.image}
                            alt={item.productTitle}
                            fill
                            className="object-cover"
                            sizes="64px"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-semibold text-xs sm:text-sm text-stone-900 truncate">
                              {item.productTitle}
                            </h4>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.id)}
                              className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-[11px] text-amber-900/90 font-medium">
                            {item.variantName}
                          </div>
                          {item.selectedFlavor && (
                            <div className="text-[10px] text-stone-500">
                              Flavor: {item.selectedFlavor}
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-200/60">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="w-6 h-6 rounded-md bg-white border border-stone-300 flex items-center justify-center text-xs font-bold text-stone-700 hover:bg-stone-100"
                              >
                                -
                              </button>
                              <span className="w-6 text-center text-xs font-bold tabular-nums text-stone-900">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="w-6 h-6 rounded-md bg-white border border-stone-300 flex items-center justify-center text-xs font-bold text-stone-700 hover:bg-stone-100"
                              >
                                +
                              </button>
                            </div>

                            <span className="font-bold text-xs sm:text-sm text-stone-900 tabular-nums">
                              {formatPrice(unitPrice * item.quantity, currency)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Optional Delivery & Customer details */}
                <div className="pt-4 border-t border-stone-200 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block">
                    Event & Delivery Details:
                  </span>

                  <div>
                    <input
                      type="text"
                      placeholder="Your Name (e.g. Sandra Okon)"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="tel"
                      placeholder="Phone / WhatsApp"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      title="Needed by date"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Delivery Address / Event Venue"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />

                  <textarea
                    rows={2}
                    placeholder="Special requests or instructions for Chef Privilege..."
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                  />
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer with Pricing & Order Actions */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-[#FAFAF7] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal:</span>
                  <span className="tabular-nums font-medium">
                    {formatPrice(subtotal, currency)}
                  </span>
                </div>

                {discountPct > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Bulk Tier Savings ({discountPct}%):</span>
                    <span className="tabular-nums">- {formatPrice(discountAmount, currency)}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-2 border-t border-stone-200 text-stone-900">
                  <span className="font-bold text-sm">Estimated Total:</span>
                  <span className="text-xl font-bold text-[#2B1805] tabular-nums">
                    {formatPrice(finalTotal, currency)}
                  </span>
                </div>
              </div>

              {/* Order Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-200" />
                  <span>Send Order via WhatsApp</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleEmailCheckout}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-xs transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-stone-600" />
                    <span>Email Order</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateReceipt}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-100/70 border border-amber-300 hover:bg-amber-100 text-amber-950 font-semibold text-xs transition-colors"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-amber-800" />
                    <span>View Quote Slip</span>
                  </button>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-[11px] text-stone-400 hover:text-stone-600 underline"
                >
                  Clear Bag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
