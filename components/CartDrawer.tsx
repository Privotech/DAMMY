'use client';

import React, { useState, useEffect } from 'react';
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
  History,
  Clock,
  RotateCcw,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { CartItem, Currency, SavedOrder } from '@/lib/types';
import { BAKER_INFO } from '@/lib/data';
import {
  formatPrice,
  generateWhatsAppLink,
  generateOrderReference,
  getSavedOrders,
  saveOrderToHistory,
  deleteSavedOrder,
} from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: Currency;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onReorderItems?: (items: CartItem[]) => void;
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
  onReorderItems,
  onOpenReceipt,
}: CartDrawerProps) {
  const [activeTab, setActiveTab] = useState<'bag' | 'orders'>('bag');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [savedOrders, setSavedOrders] = useState<SavedOrder[]>(() => getSavedOrders());
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  // Synchronize past orders if local storage updates
  useEffect(() => {
    const handleStorageChange = () => {
      setSavedOrders(getSavedOrders());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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

  const persistOrder = (ref: string, channel: 'WhatsApp' | 'Email' | 'Quote Slip') => {
    const orderToSave: SavedOrder = {
      orderRef: ref,
      createdAt: new Date().toISOString(),
      items: cartItems.map((item) => ({ ...item })),
      subtotal,
      discount: discountAmount,
      total: finalTotal,
      currency,
      customerName: customerName || 'Valued Customer',
      deliveryDate: deliveryDate || 'As requested',
      deliveryAddress: deliveryAddress || 'Store Pickup / Direct Delivery',
      specialNotes: specialNotes || '',
      channel,
    };
    const updated = saveOrderToHistory(orderToSave);
    setSavedOrders(updated);
  };

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    const ref = generateOrderReference();
    persistOrder(ref, 'WhatsApp');

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
    persistOrder(ref, 'Email');

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
      `Reference: ${ref}\n` +
      `Items:\n${itemLines}\n\n` +
      `Total Estimated: ${formatPrice(finalTotal, currency)}\n` +
      `Needed By Date: ${deliveryDate || 'Flexible'}\n` +
      `Delivery Address: ${deliveryAddress || 'To be specified'}\n` +
      `Customer Name: ${customerName}\n` +
      `Phone: ${customerPhone}\n` +
      `Special Instructions: ${specialNotes}\n\n` +
      `Please let me know how to finalize payment.\n\nThank you!`
    );

    const mailtoUrl = `mailto:${BAKER_INFO.email}?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, '_self');
  };

  const handleGenerateReceipt = () => {
    const ref = generateOrderReference();
    persistOrder(ref, 'Quote Slip');

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

  // Handler for Re-ordering a past order
  const handleReorder = (order: SavedOrder) => {
    if (onReorderItems) {
      // Re-generate fresh item IDs to avoid collisions
      const reloadedItems: CartItem[] = order.items.map((item, idx) => ({
        ...item,
        id: `${item.productId}-${item.variantId}-${Date.now()}-${idx}`,
      }));
      onReorderItems(reloadedItems);
      setActiveTab('bag');
    }
  };

  // Handler for viewing a past order slip
  const handleViewPastReceipt = (order: SavedOrder) => {
    onOpenReceipt({
      orderRef: order.orderRef,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      total: order.total,
      customerName: order.customerName,
      deliveryDate: order.deliveryDate,
      deliveryAddress: order.deliveryAddress,
      specialNotes: order.specialNotes,
    });
  };

  // Handler for WhatsApp tracking inquiry on past order
  const handleTrackWhatsApp = (order: SavedOrder) => {
    const message = [
      `*ORDER STATUS INQUIRY [${order.orderRef}]*`,
      `=========================================`,
      `Hello Chef Privilege! I placed an order with reference *${order.orderRef}* on ${new Date(
        order.createdAt
      ).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.`,
      `• *Total:* ${formatPrice(order.total, order.currency)}`,
      `• *Target Delivery:* ${order.deliveryDate}`,
      ``,
      `Could you kindly share an update on the baking & dispatch schedule? Thank you!`,
    ].join('\n');

    const url = generateWhatsAppLink(BAKER_INFO.whatsappNumber, message);
    window.open(url, '_blank');
  };

  const handleDeleteHistory = (ref: string) => {
    const updated = deleteSavedOrder(ref);
    setSavedOrders(updated);
  };

  const handleCopyRef = (ref: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(ref);
      setCopiedRef(ref);
      setTimeout(() => setCopiedRef(null), 2000);
    }
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
          {/* Drawer Top Navigation & Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 bg-[#FAFAF7]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-bold text-stone-900">
                {activeTab === 'bag' ? 'Your Treat Bag' : 'Order History & Tracking'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Segmented Switcher: Bag vs My Orders */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-stone-200/70 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('bag')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'bag'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-700" />
                <span>Current Bag</span>
                {totalItemCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-800 text-white text-[10px] flex items-center justify-center font-bold">
                    {totalItemCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'orders'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>My Orders</span>
                {savedOrders.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-stone-700 text-white text-[10px] flex items-center justify-center font-bold">
                    {savedOrders.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* TAB 1: Current Bag View */}
          {activeTab === 'bag' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
                    <h3 className="font-semibold text-stone-700">Your bag is empty</h3>
                    <p className="text-xs text-stone-500 max-w-xs mx-auto">
                      Add our crispy chin chin pouches, fluffy glazed donuts, or party catering trays from the menu.
                    </p>
                    {savedOrders.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>View past orders ({savedOrders.length}) to re-order</span>
                      </button>
                    )}
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

                    {/* Delivery & Customer details */}
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

                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                    <span>Selections automatically saved to history</span>
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="hover:text-stone-600 underline"
                    >
                      Clear Bag
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB 2: 'My Orders' History & Re-ordering View */}
          {activeTab === 'orders' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs font-semibold text-stone-700">
                  Past Orders & Quote Inquiries
                </span>
                <span className="text-[11px] text-stone-400">
                  Saved in local device storage
                </span>
              </div>

              {savedOrders.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
                    <History className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-stone-800 text-sm">
                    No Previous Orders Saved Yet
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                    Whenever you submit an order via WhatsApp, Email, or generate a Quote Slip, your order reference and
                    itemized selections are securely stored here.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('bag')}
                    className="mt-2 px-4 py-2 rounded-xl bg-[#2D1B06] text-amber-50 text-xs font-semibold"
                  >
                    Start an Order
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedOrders.map((order) => {
                    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    const totalCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

                    return (
                      <div
                        key={order.orderRef}
                        className="bg-stone-50 rounded-2xl border border-stone-200/90 p-4 space-y-3 shadow-xs"
                      >
                        {/* Order Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-stone-900">
                                {order.orderRef}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyRef(order.orderRef)}
                                className="text-stone-400 hover:text-stone-700 transition-colors p-0.5"
                                title="Copy Reference Code"
                              >
                                {copiedRef === order.orderRef ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <span className="text-[10px] font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                                {order.channel}
                              </span>
                            </div>
                            <span className="text-[11px] text-stone-500 block mt-0.5">
                              {formattedDate} · {totalCount} treats
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteHistory(order.orderRef)}
                            className="text-stone-400 hover:text-rose-600 p-1"
                            title="Remove from history"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Items Preview */}
                        <div className="space-y-1.5 pt-1 border-t border-stone-200/60 text-xs text-stone-700">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[11px]">
                              <span className="truncate pr-2">
                                <span className="font-semibold text-stone-900">{item.quantity}x</span>{' '}
                                {item.productTitle}{' '}
                                <span className="text-stone-500 font-normal">({item.variantName})</span>
                              </span>
                              <span className="font-medium text-stone-600 shrink-0 tabular-nums">
                                {formatPrice(
                                  (order.currency === 'NGN'
                                    ? item.unitPriceNGN
                                    : order.currency === 'USD'
                                    ? item.unitPriceUSD
                                    : item.unitPriceGBP) * item.quantity,
                                  order.currency
                                )}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Total & Meta */}
                        <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                              Order Total:
                            </span>
                            <span className="font-bold text-stone-900 text-sm tabular-nums">
                              {formatPrice(order.total, order.currency)}
                            </span>
                          </div>

                          {order.deliveryDate && order.deliveryDate !== 'As requested' && (
                            <div className="text-right text-[11px] text-stone-500">
                              <span>Event Date: </span>
                              <span className="font-medium text-stone-700">{order.deliveryDate}</span>
                            </div>
                          )}
                        </div>

                        {/* Actions for this past order */}
                        <div className="pt-2 grid grid-cols-3 gap-1.5 text-xs">
                          {/* Re-order items */}
                          <button
                            type="button"
                            onClick={() => handleReorder(order)}
                            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#2D1B06] hover:bg-[#432A0C] text-amber-50 font-semibold text-[11px] transition-colors"
                            title="Load these items back into active bag"
                          >
                            <RotateCcw className="w-3 h-3 text-amber-400" />
                            <span>Re-Order</span>
                          </button>

                          {/* View quote slip */}
                          <button
                            type="button"
                            onClick={() => handleViewPastReceipt(order)}
                            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 font-medium text-[11px] transition-colors"
                            title="View / Print Quote Slip"
                          >
                            <FileCheck className="w-3 h-3 text-stone-600" />
                            <span>View Slip</span>
                          </button>

                          {/* Track status on WhatsApp */}
                          <button
                            type="button"
                            onClick={() => handleTrackWhatsApp(order)}
                            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-900 font-medium text-[11px] transition-colors"
                            title="Inquire status on WhatsApp"
                          >
                            <MessageCircle className="w-3 h-3 text-emerald-700" />
                            <span>Track</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
