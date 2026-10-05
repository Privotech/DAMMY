import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { CartItem, Currency, SavedOrder } from '@/lib/types';

export const runtime = 'nodejs';

const currencies: Currency[] = ['NGN', 'USD', 'GBP'];
const channels: SavedOrder['channel'][] = ['WhatsApp', 'Email', 'Quote Slip'];

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<CartItem>;
  return typeof item.id === 'string' && item.id.length <= 160 &&
    typeof item.productId === 'string' && item.productId.length <= 120 &&
    typeof item.productTitle === 'string' && item.productTitle.length <= 200 &&
    typeof item.variantId === 'string' && item.variantId.length <= 120 &&
    typeof item.variantName === 'string' && item.variantName.length <= 200 &&
    typeof item.weightOrUnit === 'string' && item.weightOrUnit.length <= 200 &&
    typeof item.quantity === 'number' && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 10_000 &&
    ['unitPriceNGN', 'unitPriceUSD', 'unitPriceGBP'].every((key) => {
      const price = item[key as keyof CartItem];
      return typeof price === 'number' && Number.isFinite(price) && price >= 0;
    }) && typeof item.image === 'string' && item.image.length <= 500;
}

export async function POST(request: Request) {
  let payload: Partial<SavedOrder>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!payload.orderRef || !/^[A-Za-z0-9_-]{4,80}$/.test(payload.orderRef) ||
      !Array.isArray(payload.items) || payload.items.length === 0 || payload.items.length > 100 ||
      !payload.items.every(isCartItem) || !payload.currency || !currencies.includes(payload.currency) ||
      !payload.channel || !channels.includes(payload.channel) ||
      ![payload.subtotal, payload.discount, payload.total].every((n) => typeof n === 'number' && Number.isFinite(n) && n >= 0) ||
      typeof payload.customerName !== 'string' || payload.customerName.length > 200 ||
      typeof payload.deliveryDate !== 'string' || payload.deliveryDate.length > 100 ||
      typeof payload.deliveryAddress !== 'string' || payload.deliveryAddress.length > 500 ||
      typeof payload.specialNotes !== 'string' || payload.specialNotes.length > 3000 ||
      (payload.createdAt !== undefined && Number.isNaN(Date.parse(payload.createdAt)))) {
    return NextResponse.json({ error: 'Order data is incomplete or invalid' }, { status: 400 });
  }

  try {
    const result = await prisma.order.upsert({
      where: { orderRef: payload.orderRef },
      update: {},
      create: {
        orderRef: payload.orderRef,
        createdAt: payload.createdAt ? new Date(payload.createdAt) : undefined,
        items: payload.items as unknown as Prisma.InputJsonValue,
        subtotal: payload.subtotal!,
        discount: payload.discount!,
        total: payload.total!,
        currency: payload.currency,
        customerName: payload.customerName,
        deliveryDate: payload.deliveryDate,
        deliveryAddress: payload.deliveryAddress,
        specialNotes: payload.specialNotes,
        channel: payload.channel,
      },
    });
    return NextResponse.json({ saved: true, orderRef: result.orderRef });
  } catch (error) {
    console.error('Order persistence failed', error);
    return NextResponse.json({ error: 'Could not save this order right now' }, { status: 503 });
  }
}
