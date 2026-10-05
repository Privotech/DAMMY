'use client';

import React from 'react';
import { X, Printer, ChefHat, CheckCircle, MessageCircle, Mail } from 'lucide-react';
import { CartItem, Currency } from '@/lib/types';
import { BAKER_INFO } from '@/lib/data';
import { formatPrice, generateWhatsAppLink } from '@/lib/utils';

interface OrderReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    orderRef: string;
    items: CartItem[];
    subtotal: number;
    discount: number;
    total: number;
    customerName: string;
    deliveryDate: string;
    deliveryAddress: string;
    specialNotes: string;
  } | null;
  currency: Currency;
}

export function OrderReceiptModal({
  isOpen,
  onClose,
  orderData,
  currency,
}: OrderReceiptModalProps) {
  if (!isOpen || !orderData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppFromReceipt = () => {
    const lines = [
      `*ORDER CONFIRMATION SLIP [${orderData.orderRef}]*`,
      `*Baker:* ${BAKER_INFO.businessName}`,
      `*Customer:* ${orderData.customerName}`,
      `*Needed By Date:* ${orderData.deliveryDate}`,
      `*Delivery Address:* ${orderData.deliveryAddress}`,
      orderData.specialNotes ? `*Notes:* ${orderData.specialNotes}` : '',
      ``,
      `*ITEMS:*`,
      ...orderData.items.map(
        (i) => ` - ${i.quantity}x ${i.productTitle} (${i.variantName})`
      ),
      ``,
      `*TOTAL:* ${formatPrice(orderData.total, currency)}`,
    ]
      .filter(Boolean)
      .join('\n');

    const url = generateWhatsAppLink(BAKER_INFO.whatsappNumber, lines);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header toolbar */}
        <div className="p-4 bg-stone-100/80 border-b border-stone-200 flex items-center justify-between print:hidden">
          <span className="text-xs font-bold text-stone-700">Official Order Quote Slip</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Body */}
        <div className="p-6 sm:p-8 space-y-6 text-stone-800 font-sans" id="printable-slip">
          {/* Header Lockup */}
          <div className="flex items-start justify-between border-b border-stone-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E5A823] flex items-center justify-center text-white">
                  <ChefHat className="w-4 h-4" />
                </div>
                <span className="font-display font-bold text-lg text-stone-900">
                  Privy FlourCraft
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Homemade Treats & Bulk Event Catering
              </p>
              <p className="text-[11px] text-stone-500">
                Direct: {BAKER_INFO.email} · {BAKER_INFO.phoneDisplay}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
                Quote Reference
              </span>
              <span className="font-mono text-sm font-bold text-stone-900">
                {orderData.orderRef}
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Client & Delivery Info */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                Customer:
              </span>
              <span className="font-semibold text-stone-900">{orderData.customerName}</span>
              <span className="block text-stone-500 text-[11px] mt-0.5">
                Target Date: {orderData.deliveryDate}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                Delivery Venue:
              </span>
              <span className="text-stone-700">{orderData.deliveryAddress}</span>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
              Itemized Treats
            </div>
            <div className="divide-y divide-stone-100 text-xs">
              {orderData.items.map((item, idx) => {
                const unitPrice =
                  currency === 'NGN'
                    ? item.unitPriceNGN
                    : currency === 'USD'
                    ? item.unitPriceUSD
                    : item.unitPriceGBP;

                return (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-stone-900">
                        {item.quantity}x {item.productTitle}
                      </span>
                      <span className="text-stone-500 text-[11px] block">
                        {item.variantName} {item.selectedFlavor ? `· ${item.selectedFlavor}` : ''}
                      </span>
                    </div>
                    <span className="font-bold tabular-nums text-stone-900">
                      {formatPrice(unitPrice * item.quantity, currency)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Totals */}
          <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-500">
              <span>Subtotal:</span>
              <span className="tabular-nums">{formatPrice(orderData.subtotal, currency)}</span>
            </div>
            {orderData.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Bulk Event Tier Discount:</span>
                <span className="tabular-nums">- {formatPrice(orderData.discount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
              <span>Estimated Total:</span>
              <span className="text-base text-[#2B1805] tabular-nums">
                {formatPrice(orderData.total, currency)}
              </span>
            </div>
          </div>

          {/* Payment Terms note */}
          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/60 text-[11px] text-amber-950 leading-relaxed">
            <p className="font-semibold mb-0.5">Order Confirmation Notice:</p>
            <p>
              Freshly fried and baked to order. A 50% commitment deposit confirms date scheduling for bulk event orders.
              Balance is payable prior to dispatch or on scheduled pickup.
            </p>
          </div>

          {/* Action buttons (hidden on print) */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2 print:hidden">
            <button
              type="button"
              onClick={handleWhatsAppFromReceipt}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-200" />
              <span>Confirm via WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
