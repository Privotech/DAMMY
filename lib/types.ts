export type Currency = 'NGN' | 'USD' | 'GBP';

export interface ProductVariant {
  id: string;
  name: string;
  description: string;
  priceNGN: number;
  priceUSD: number;
  priceGBP: number;
  weightOrUnit: string;
  recommendedFor?: string;
  isBulk?: boolean;
}

export interface PastryItem {
  id: string;
  title: string;
  category: 'chin-chin' | 'donuts' | 'egg-rolls' | 'savory-chops' | 'bulk-buckets';
  categoryLabel: string;
  tagline: string;
  description: string;
  image: string;
  fallbackGradient: string;
  flavors?: string[];
  ingredients: string[];
  shelfLife: string;
  isPopular?: boolean;
  isBulkAvailable: boolean;
  minOrderQuantity?: number;
  variants: ProductVariant[];
  bakingMethod: 'Freshly Fried' | 'Slow Baked' | 'Crispy Fried';
}

export interface CartItem {
  id: string; // unique item instance id
  productId: string;
  productTitle: string;
  variantId: string;
  variantName: string;
  weightOrUnit: string;
  selectedFlavor?: string;
  unitPriceNGN: number;
  unitPriceUSD: number;
  unitPriceGBP: number;
  quantity: number;
  image: string;
  specialNote?: string;
}

export interface SavedOrder {
  orderRef: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  currency: Currency;
  customerName: string;
  deliveryDate: string;
  deliveryAddress: string;
  specialNotes: string;
  channel: 'WhatsApp' | 'Email' | 'Quote Slip';
}

export interface BulkCateringSelection {
  eventType: 'wedding' | 'birthday' | 'corporate' | 'church' | 'party' | 'other';
  guestCount: number;
  eventDate: string;
  deliveryLocation: string;
  items: {
    productId: string;
    variantId: string;
    quantity: number;
  }[];
  customPackaging: 'standard' | 'souvenir-jars' | 'custom-branded' | 'bulk-tubs';
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string;
}
