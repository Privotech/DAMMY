'use client';

import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Calendar,
  MapPin,
  Users,
  Sparkles,
  MessageCircle,
  FileText,
  Check,
  PackageCheck,
  Send,
} from 'lucide-react';
import { Currency, CartItem } from '@/lib/types';
import { BAKER_INFO, PASTRIES_CATALOG } from '@/lib/data';
import { formatPrice, generateWhatsAppLink } from '@/lib/utils';

interface BulkCalculatorProps {
  currency: Currency;
  onAddCustomPackageToCart: (items: CartItem[]) => void;
  onOpenDirectInquiry: (initialData?: {
    eventType: string;
    guestCount: number;
    date: string;
    details: string;
  }) => void;
}

export function BulkCalculator({
  currency,
  onAddCustomPackageToCart,
  onOpenDirectInquiry,
}: BulkCalculatorProps) {
  const [eventType, setEventType] = useState<string>('Wedding Reception');
  const [guestCount, setGuestCount] = useState<number>(75);
  const [eventDate, setEventDate] = useState<string>('');
  const [deliveryLocation, setDeliveryLocation] = useState<string>('');
  const [packagingChoice, setPackagingChoice] = useState<'standard' | 'souvenirs' | 'buffet-trays'>('standard');

  // Quantities of popular bulk units
  const [chinChinBuckets5L, setChinChinBuckets5L] = useState<number>(2); // ~30-40 servings each
  const [donutPlatters24, setDonutPlatters24] = useState<number>(3); // 72 donuts
  const [eggRollTrays30, setEggRollTrays30] = useState<number>(2); // 60 egg rolls
  const [meatPieTrays30, setMeatPieTrays30] = useState<number>(2); // 60 pies
  const [puffPuffDrums180, setPuffPuffDrums180] = useState<number>(1); // 180 puff puff

  // Auto-preset for guest count
  const applyGuestPreset = (count: number) => {
    setGuestCount(count);
    if (count <= 30) {
      setChinChinBuckets5L(1);
      setDonutPlatters24(1);
      setEggRollTrays30(1);
      setMeatPieTrays30(1);
      setPuffPuffDrums180(0);
    } else if (count <= 60) {
      setChinChinBuckets5L(2);
      setDonutPlatters24(2);
      setEggRollTrays30(2);
      setMeatPieTrays30(2);
      setPuffPuffDrums180(1);
    } else if (count <= 120) {
      setChinChinBuckets5L(3);
      setDonutPlatters24(4);
      setEggRollTrays30(4);
      setMeatPieTrays30(4);
      setPuffPuffDrums180(1);
    } else {
      setChinChinBuckets5L(5);
      setDonutPlatters24(8);
      setEggRollTrays30(8);
      setMeatPieTrays30(8);
      setPuffPuffDrums180(2);
    }
  };

  // Unit pricing from catalog
  const prices = useMemo(() => {
    // 5L Chin Chin bucket
    const ccPriceNGN = 22000;
    const ccPriceUSD = 48.0;
    const ccPriceGBP = 38.0;

    // 24-donut platter
    const donutPriceNGN = 18000;
    const donutPriceUSD = 38.0;
    const donutPriceGBP = 30.0;

    // 30 egg rolls tray
    const eggRollPriceNGN = 26000;
    const eggRollPriceUSD = 55.0;
    const eggRollPriceGBP = 44.0;

    // 30 meat pies tray
    const piePriceNGN = 30000;
    const piePriceUSD = 64.0;
    const piePriceGBP = 51.0;

    // 180 puff puff drum
    const puffPriceNGN = 18000;
    const puffPriceUSD = 39.0;
    const puffPriceGBP = 31.0;

    const baseNGN =
      chinChinBuckets5L * ccPriceNGN +
      donutPlatters24 * donutPriceNGN +
      eggRollTrays30 * eggRollPriceNGN +
      meatPieTrays30 * piePriceNGN +
      puffPuffDrums180 * puffPriceNGN;

    const baseUSD =
      chinChinBuckets5L * ccPriceUSD +
      donutPlatters24 * donutPriceUSD +
      eggRollTrays30 * eggRollPriceUSD +
      meatPieTrays30 * piePriceUSD +
      puffPuffDrums180 * puffPriceUSD;

    const baseGBP =
      chinChinBuckets5L * ccPriceGBP +
      donutPlatters24 * donutPriceGBP +
      eggRollTrays30 * eggRollPriceGBP +
      meatPieTrays30 * piePriceGBP +
      puffPuffDrums180 * puffPriceGBP;

    // Total bulk items count
    const totalItems =
      chinChinBuckets5L + donutPlatters24 + eggRollTrays30 + meatPieTrays30 + puffPuffDrums180;

    // Bulk discount tier
    let discountPct = 0;
    if (totalItems >= 10 || guestCount >= 150) {
      discountPct = 15;
    } else if (totalItems >= 6 || guestCount >= 70) {
      discountPct = 10;
    } else if (totalItems >= 3 || guestCount >= 30) {
      discountPct = 5;
    }

    // Packaging surcharge (if souvenir custom ribbons & labels requested)
    let packagingSurchargeNGN = 0;
    let packagingSurchargeUSD = 0;
    let packagingSurchargeGBP = 0;
    if (packagingChoice === 'souvenirs') {
      packagingSurchargeNGN = Math.round(baseNGN * 0.08);
      packagingSurchargeUSD = Number((baseUSD * 0.08).toFixed(2));
      packagingSurchargeGBP = Number((baseGBP * 0.08).toFixed(2));
    }

    const discountAmountNGN = Math.round((baseNGN * discountPct) / 100);
    const discountAmountUSD = Number(((baseUSD * discountPct) / 100).toFixed(2));
    const discountAmountGBP = Number(((baseGBP * discountPct) / 100).toFixed(2));

    const finalNGN = baseNGN - discountAmountNGN + packagingSurchargeNGN;
    const finalUSD = baseUSD - discountAmountUSD + packagingSurchargeUSD;
    const finalGBP = baseGBP - discountAmountGBP + packagingSurchargeGBP;

    return {
      baseNGN,
      baseUSD,
      baseGBP,
      discountPct,
      discountAmountNGN,
      discountAmountUSD,
      discountAmountGBP,
      packagingSurchargeNGN,
      packagingSurchargeUSD,
      packagingSurchargeGBP,
      finalNGN,
      finalUSD,
      finalGBP,
      totalItems,
    };
  }, [
    chinChinBuckets5L,
    donutPlatters24,
    eggRollTrays30,
    meatPieTrays30,
    puffPuffDrums180,
    guestCount,
    packagingChoice,
  ]);

  const activeFinalPrice =
    currency === 'NGN' ? prices.finalNGN : currency === 'USD' ? prices.finalUSD : prices.finalGBP;

  const activeSubtotal =
    currency === 'NGN' ? prices.baseNGN : currency === 'USD' ? prices.baseUSD : prices.baseGBP;

  const activeDiscount =
    currency === 'NGN'
      ? prices.discountAmountNGN
      : currency === 'USD'
      ? prices.discountAmountUSD
      : prices.discountAmountGBP;

  // Format order summary for WhatsApp
  const handleSendViaWhatsApp = () => {
    const lines = [
      `*BULK EVENT CATERING INQUIRY — ${BAKER_INFO.businessName}*`,
      `===============================`,
      `• *Event Type:* ${eventType}`,
      `• *Guest Count:* ${guestCount} guests`,
      eventDate ? `• *Event Date:* ${eventDate}` : '',
      deliveryLocation ? `• *Delivery Location:* ${deliveryLocation}` : '',
      `• *Packaging Choice:* ${
        packagingChoice === 'souvenirs'
          ? 'Custom Souvenir Jars / Bags with Ribbons'
          : packagingChoice === 'buffet-trays'
          ? 'Insulated Buffet Trays'
          : 'Standard Bulk Catering Tubs'
      }`,
      ``,
      `*ORDER SELECTIONS:*`,
      chinChinBuckets5L > 0 ? `  - ${chinChinBuckets5L}x 5-Litre Chin Chin Buckets` : '',
      donutPlatters24 > 0 ? `  - ${donutPlatters24}x Donut Platters (24 pcs each = ${donutPlatters24 * 24} donuts)` : '',
      eggRollTrays30 > 0 ? `  - ${eggRollTrays30}x Golden Egg Roll Trays (30 pcs each = ${eggRollTrays30 * 30} rolls)` : '',
      meatPieTrays30 > 0 ? `  - ${meatPieTrays30}x Flaky Meat Pie Trays (30 pcs each = ${meatPieTrays30 * 30} pies)` : '',
      puffPuffDrums180 > 0 ? `  - ${puffPuffDrums180}x Sweet Puff Puff Drums (180 pcs each)` : '',
      ``,
      `*ESTIMATED QUOTE:* ${formatPrice(activeFinalPrice, currency)} (${prices.discountPct}% bulk discount applied)`,
      ``,
      `Hello Chef Privilege! Please review this estimate and let me know your availability for this date. Thank you!`,
    ]
      .filter(Boolean)
      .join('\n');

    const url = generateWhatsAppLink(BAKER_INFO.whatsappNumber, lines);
    window.open(url, '_blank');
  };

  const handleTransferToCart = () => {
    const itemsToAdd: CartItem[] = [];

    if (chinChinBuckets5L > 0) {
      itemsToAdd.push({
        id: `bulk-cc-5l-${Date.now()}`,
        productId: 'chin-chin-classic',
        productTitle: 'Golden Signature Chin Chin',
        variantId: 'cc-bucket-5l',
        variantName: 'Party Bucket (5 Litres)',
        weightOrUnit: '5-Litre sealed handle bucket',
        unitPriceNGN: 22000,
        unitPriceUSD: 48.0,
        unitPriceGBP: 38.0,
        quantity: chinChinBuckets5L,
        image: '/images/chin_chin.jpg',
        specialNote: `Event: ${eventType} (${guestCount} guests)`,
      });
    }

    if (donutPlatters24 > 0) {
      itemsToAdd.push({
        id: `bulk-donut-24-${Date.now()}`,
        productId: 'artisan-donuts',
        productTitle: 'Fluffy Artisan Glazed Donuts',
        variantId: 'donut-party-24',
        variantName: 'Party Platter Box (24 Pcs)',
        weightOrUnit: '24-piece catering platter',
        unitPriceNGN: 18000,
        unitPriceUSD: 38.0,
        unitPriceGBP: 30.0,
        quantity: donutPlatters24,
        image: '/images/donuts.jpg',
        specialNote: `Event: ${eventType} (${guestCount} guests)`,
      });
    }

    if (eggRollTrays30 > 0) {
      itemsToAdd.push({
        id: `bulk-eggroll-30-${Date.now()}`,
        productId: 'nigerian-egg-rolls',
        productTitle: 'Traditional Golden Egg Rolls',
        variantId: 'eggroll-event-30',
        variantName: 'Event Buffet Tray (30 Pcs)',
        weightOrUnit: '30-piece food service tray',
        unitPriceNGN: 26000,
        unitPriceUSD: 55.0,
        unitPriceGBP: 44.0,
        quantity: eggRollTrays30,
        image: '/images/egg_rolls.jpg',
        specialNote: `Event: ${eventType} (${guestCount} guests)`,
      });
    }

    if (meatPieTrays30 > 0) {
      itemsToAdd.push({
        id: `bulk-meatpie-30-${Date.now()}`,
        productId: 'flaky-meat-pie',
        productTitle: 'Nigerian Flaky Meat Pies & Chicken Pies',
        variantId: 'pie-event-30',
        variantName: 'Event Catering Tray (30 Pcs)',
        weightOrUnit: '30-piece catering flat',
        unitPriceNGN: 30000,
        unitPriceUSD: 64.0,
        unitPriceGBP: 51.0,
        quantity: meatPieTrays30,
        image: '/images/hero.jpg',
        specialNote: `Event: ${eventType} (${guestCount} guests)`,
      });
    }

    if (puffPuffDrums180 > 0) {
      itemsToAdd.push({
        id: `bulk-puff-180-${Date.now()}`,
        productId: 'sweet-puff-puff',
        productTitle: 'Pillowy Golden Puff Puff',
        variantId: 'puff-event-180',
        variantName: 'Grand Event Drum (180 Pcs)',
        weightOrUnit: '180 pieces in banquet bucket',
        unitPriceNGN: 18000,
        unitPriceUSD: 39.0,
        unitPriceGBP: 31.0,
        quantity: puffPuffDrums180,
        image: '/images/hero.jpg',
        specialNote: `Event: ${eventType} (${guestCount} guests)`,
      });
    }

    onAddCustomPackageToCart(itemsToAdd);
  };

  return (
    <section id="calculator" className="py-16 lg:py-24 bg-[#FAF7F2] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900/90 mb-2">
            <Calculator className="w-3.5 h-3.5 text-amber-700" />
            <span>Interactive Bulk Pricing Tool</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2B1805] tracking-tight">
            Event & Bulk Catering Calculator
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            Planning a wedding, birthday party, church banquet, or corporate celebration?
            Select your guest size and desired treat quantities to get instant bulk discounts
            and a complete itemized quote.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Input Form Controls (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
            {/* Step 1: Event Type & Guest Count */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                1. Event Details & Guest Count
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-stone-500 block mb-1">Occasion / Event Type:</span>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Wedding Reception">Wedding Reception & Souvenirs</option>
                    <option value="Birthday Celebration">Birthday Party & Treats</option>
                    <option value="Corporate Town Hall">Corporate Meeting & Office Treats</option>
                    <option value="Church or Community Gathering">Church Fellowship & Banquet</option>
                    <option value="Baby Shower / Naming Ceremony">Baby Shower / Naming Ceremony</option>
                    <option value="Funeral / Memorial Repast">Memorial / Repast Reception</option>
                    <option value="Holiday Feast">Holiday / Family Reunion Feast</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-stone-500">Estimated Guests:</span>
                    <span className="font-bold text-stone-900 tabular-nums">{guestCount} people</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="500"
                    step="5"
                    value={guestCount}
                    onChange={(e) => applyGuestPreset(Number(e.target.value))}
                    className="w-full accent-amber-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                    <span>20 (Intimate)</span>
                    <span>100 (Medium)</span>
                    <span>250+ (Grand)</span>
                    <span>500+</span>
                  </div>
                </div>
              </div>

              {/* Quick Guest Presets */}
              <div className="flex items-center gap-2 mt-3 pt-2">
                <span className="text-[11px] text-stone-500">Quick presets:</span>
                {[30, 50, 100, 200, 350].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => applyGuestPreset(preset)}
                    className={`px-2 py-0.5 text-xs rounded-md border transition-colors ${
                      guestCount === preset
                        ? 'bg-amber-100 border-amber-300 font-bold text-amber-900'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Pastry Mix Selection */}
            <div className="pt-4 border-t border-stone-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                2. Select Treat Quantities
              </label>

              <div className="space-y-3.5">
                {/* Chin Chin Party Buckets */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <div className="pr-2">
                    <div className="font-semibold text-xs sm:text-sm text-stone-900">
                      5-Litre Chin Chin Party Buckets
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Each bucket serves ~25-35 guests · {formatPrice(currency === 'NGN' ? 22000 : currency === 'USD' ? 48 : 38, currency)}/ea
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChinChinBuckets5L(Math.max(0, chinChinBuckets5L - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-sm tabular-nums text-stone-900">
                      {chinChinBuckets5L}
                    </span>
                    <button
                      type="button"
                      onClick={() => setChinChinBuckets5L(chinChinBuckets5L + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Donut Platters */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <div className="pr-2">
                    <div className="font-semibold text-xs sm:text-sm text-stone-900">
                      Artisan Donut Party Platters (24 Pcs)
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Glazed, iced & cinnamon assorted · {formatPrice(currency === 'NGN' ? 18000 : currency === 'USD' ? 38 : 30, currency)}/ea
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDonutPlatters24(Math.max(0, donutPlatters24 - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-sm tabular-nums text-stone-900">
                      {donutPlatters24}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDonutPlatters24(donutPlatters24 + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Egg Roll Buffet Trays */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <div className="pr-2">
                    <div className="font-semibold text-xs sm:text-sm text-stone-900">
                      Golden Egg Roll Buffet Trays (30 Pcs)
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Delivered hot & crisp in insulated flats · {formatPrice(currency === 'NGN' ? 26000 : currency === 'USD' ? 55 : 44, currency)}/ea
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEggRollTrays30(Math.max(0, eggRollTrays30 - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-sm tabular-nums text-stone-900">
                      {eggRollTrays30}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEggRollTrays30(eggRollTrays30 + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Meat Pie Catering Trays */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <div className="pr-2">
                    <div className="font-semibold text-xs sm:text-sm text-stone-900">
                      Flaky Meat / Chicken Pie Trays (30 Pcs)
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Buttery crust & seasoned meat/potato filling · {formatPrice(currency === 'NGN' ? 30000 : currency === 'USD' ? 64 : 51, currency)}/ea
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMeatPieTrays30(Math.max(0, meatPieTrays30 - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-sm tabular-nums text-stone-900">
                      {meatPieTrays30}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMeatPieTrays30(meatPieTrays30 + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Puff Puff Drums */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <div className="pr-2">
                    <div className="font-semibold text-xs sm:text-sm text-stone-900">
                      Sweet Pillowy Puff Puff Drum (180 Pcs)
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Festive crowd favorite · {formatPrice(currency === 'NGN' ? 18000 : currency === 'USD' ? 39 : 31, currency)}/ea
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPuffPuffDrums180(Math.max(0, puffPuffDrums180 - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-sm tabular-nums text-stone-900">
                      {puffPuffDrums180}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPuffPuffDrums180(puffPuffDrums180 + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Packaging Options & Delivery Details */}
            <div className="pt-4 border-t border-stone-100 space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                3. Packaging & Event Date
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPackagingChoice('standard')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    packagingChoice === 'standard'
                      ? 'bg-amber-50 border-amber-400 text-amber-950 font-semibold shadow-xs'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="block font-bold">Standard Bulk</span>
                  <span className="text-[11px] text-stone-500">Sealed tubs & buffet boxes</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPackagingChoice('souvenirs')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    packagingChoice === 'souvenirs'
                      ? 'bg-amber-50 border-amber-400 text-amber-950 font-semibold shadow-xs'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="block font-bold">Souvenir Ribbons (+8%)</span>
                  <span className="text-[11px] text-stone-500">Individual bags + custom tags</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPackagingChoice('buffet-trays')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    packagingChoice === 'buffet-trays'
                      ? 'bg-amber-50 border-amber-400 text-amber-950 font-semibold shadow-xs'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="block font-bold">Buffet Warmers</span>
                  <span className="text-[11px] text-stone-500">Insulated trays for party food line</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] text-stone-500 block mb-1">Target Event Date:</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-stone-500 block mb-1">Venue / City / Area:</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Lekki Phase 1, Ikeja, or City"
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-800 placeholder:text-stone-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Quote Summary & Action Card (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider">
                  Live Quote Summary
                </span>
                <h3 className="font-display text-xl font-bold text-stone-900">
                  {eventType}
                </h3>
              </div>
              <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md">
                {guestCount} Guests
              </span>
            </div>

            {/* Line items selected */}
            <div className="space-y-2 text-xs text-stone-700">
              {prices.totalItems === 0 ? (
                <div className="text-center py-6 text-stone-400">
                  Select at least one treat quantity to calculate pricing.
                </div>
              ) : (
                <>
                  {chinChinBuckets5L > 0 && (
                    <div className="flex justify-between py-1">
                      <span>{chinChinBuckets5L}x 5L Chin Chin Buckets</span>
                      <span className="font-medium tabular-nums">
                        {formatPrice(
                          chinChinBuckets5L * (currency === 'NGN' ? 22000 : currency === 'USD' ? 48 : 38),
                          currency
                        )}
                      </span>
                    </div>
                  )}

                  {donutPlatters24 > 0 && (
                    <div className="flex justify-between py-1">
                      <span>{donutPlatters24}x Donut Platters ({donutPlatters24 * 24} pcs)</span>
                      <span className="font-medium tabular-nums">
                        {formatPrice(
                          donutPlatters24 * (currency === 'NGN' ? 18000 : currency === 'USD' ? 38 : 30),
                          currency
                        )}
                      </span>
                    </div>
                  )}

                  {eggRollTrays30 > 0 && (
                    <div className="flex justify-between py-1">
                      <span>{eggRollTrays30}x Egg Roll Trays ({eggRollTrays30 * 30} pcs)</span>
                      <span className="font-medium tabular-nums">
                        {formatPrice(
                          eggRollTrays30 * (currency === 'NGN' ? 26000 : currency === 'USD' ? 55 : 44),
                          currency
                        )}
                      </span>
                    </div>
                  )}

                  {meatPieTrays30 > 0 && (
                    <div className="flex justify-between py-1">
                      <span>{meatPieTrays30}x Meat Pie Trays ({meatPieTrays30 * 30} pcs)</span>
                      <span className="font-medium tabular-nums">
                        {formatPrice(
                          meatPieTrays30 * (currency === 'NGN' ? 30000 : currency === 'USD' ? 64 : 51),
                          currency
                        )}
                      </span>
                    </div>
                  )}

                  {puffPuffDrums180 > 0 && (
                    <div className="flex justify-between py-1">
                      <span>{puffPuffDrums180}x Puff Puff Drums ({puffPuffDrums180 * 180} pcs)</span>
                      <span className="font-medium tabular-nums">
                        {formatPrice(
                          puffPuffDrums180 * (currency === 'NGN' ? 18000 : currency === 'USD' ? 39 : 31),
                          currency
                        )}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-stone-100 space-y-2 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Standard Catering Subtotal:</span>
                <span className="tabular-nums">{formatPrice(activeSubtotal, currency)}</span>
              </div>

              {prices.discountPct > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Bulk Event Discount ({prices.discountPct}% off):</span>
                  <span className="tabular-nums">- {formatPrice(activeDiscount, currency)}</span>
                </div>
              )}

              {packagingChoice === 'souvenirs' && (
                <div className="flex justify-between text-amber-800">
                  <span>Custom Souvenir Tags & Ribbons (+8%):</span>
                  <span className="tabular-nums">
                    +{' '}
                    {formatPrice(
                      currency === 'NGN'
                        ? prices.packagingSurchargeNGN
                        : currency === 'USD'
                        ? prices.packagingSurchargeUSD
                        : prices.packagingSurchargeGBP,
                      currency
                    )}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-900 block">
                    Estimated Total:
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Includes morning-of-event frying & packaging
                  </span>
                </div>
                <span className="text-2xl font-bold text-[#2B1805] tabular-nums">
                  {formatPrice(activeFinalPrice, currency)}
                </span>
              </div>
            </div>

            {/* Tier guidance message */}
            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 leading-relaxed">
              <Sparkles className="w-3.5 h-3.5 text-amber-700 inline-block mr-1 align-text-bottom" />
              <span>
                <strong>Bulk Tier Benefit:</strong> Orders over 6 units receive 10% off. Orders over 10 units receive 15% off.
                Bespoke quotes available for mega events (500+ guests).
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              {/* WhatsApp instant dispatch */}
              <button
                type="button"
                onClick={handleSendViaWhatsApp}
                disabled={prices.totalItems === 0}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-4 h-4 text-emerald-200" />
                <span>Send Quote via WhatsApp to Baker</span>
              </button>

              {/* Add entire package to cart */}
              <button
                type="button"
                onClick={handleTransferToCart}
                disabled={prices.totalItems === 0}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2D1B06] hover:bg-[#432A0C] text-amber-50 font-semibold text-xs sm:text-sm shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PackageCheck className="w-4 h-4 text-amber-400" />
                <span>Load Package into Order Bag</span>
              </button>

              {/* Direct Email inquiry */}
              <button
                type="button"
                onClick={() =>
                  onOpenDirectInquiry({
                    eventType,
                    guestCount,
                    date: eventDate,
                    details: `Quote items: ${chinChinBuckets5L}x 5L Chin Chin, ${donutPlatters24}x Donut Platters, ${eggRollTrays30}x Egg Roll Trays, ${meatPieTrays30}x Meat Pies. Estimated: ${formatPrice(activeFinalPrice, currency)}`,
                  })
                }
                className="w-full text-center py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
              >
                Or submit custom inquiry form to {BAKER_INFO.email}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
