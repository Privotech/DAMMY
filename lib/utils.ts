import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Currency, SavedOrder } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: Currency): string {
  if (currency === 'NGN') {
    return `₦${amount.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
  } else if (currency === 'USD') {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (currency === 'GBP') {
    return `£${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${amount}`;
}

export function generateWhatsAppLink(cleanPhone: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

export function generateOrderReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'PFC-';
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

const ORDERS_STORAGE_KEY = 'privy_flourcraft_orders_history_v1';

export function getSavedOrders(): SavedOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read saved orders from localStorage:', err);
    return [];
  }
}

export function saveOrderToHistory(order: SavedOrder): SavedOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getSavedOrders();
    // Prepend new order, filter out duplicates by orderRef
    const updated = [order, ...existing.filter((o) => o.orderRef !== order.orderRef)];
    // Keep last 30 orders
    const trimmed = updated.slice(0, 30);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(trimmed));
    return trimmed;
  } catch (err) {
    console.error('Failed to save order to localStorage:', err);
    return [];
  }
}

export function deleteSavedOrder(orderRef: string): SavedOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getSavedOrders();
    const updated = existing.filter((o) => o.orderRef !== orderRef);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete order from localStorage:', err);
    return [];
  }
}
