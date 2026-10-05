'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search, Plus, Check, Sparkles, Package, Info, ChevronDown } from 'lucide-react';
import { PastryItem, ProductVariant, Currency } from '@/lib/types';
import { PASTRIES_CATALOG } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

interface MenuCatalogProps {
  currency: Currency;
  onAddToCart: (item: PastryItem, variant: ProductVariant, flavor?: string) => void;
  onOpenBulkCalculator: () => void;
}

export function MenuCatalog({ currency, onAddToCart, onOpenBulkCalculator }: MenuCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Track selected variant per product
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    PASTRIES_CATALOG.forEach((item) => {
      if (item.variants.length > 0) {
        initial[item.id] = item.variants[0].id;
      }
    });
    return initial;
  });

  // Track selected flavor per product
  const [selectedFlavors, setSelectedFlavors] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    PASTRIES_CATALOG.forEach((item) => {
      if (item.flavors && item.flavors.length > 0) {
        initial[item.id] = item.flavors[0];
      }
    });
    return initial;
  });

  // Added-to-cart temporary state for button feedback
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Treats' },
    { id: 'chin-chin', label: 'Crunchy Chin Chin' },
    { id: 'donuts', label: 'Artisan Donuts' },
    { id: 'egg-rolls', label: 'Golden Egg Rolls' },
    { id: 'savory-chops', label: 'Savory & Small Chops' },
  ];

  const filteredItems = useMemo(() => {
    return PASTRIES_CATALOG.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.flavors && item.flavors.some((f) => f.toLowerCase().includes(q))) ||
        item.variants.some((v) => v.name.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleVariantChange = (productId: string, variantId: string) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantId }));
  };

  const handleFlavorChange = (productId: string, flavor: string) => {
    setSelectedFlavors((prev) => ({ ...prev, [productId]: flavor }));
  };

  const handleAdd = (item: PastryItem) => {
    const variantId = selectedVariants[item.id] || item.variants[0]?.id;
    const variant = item.variants.find((v) => v.id === variantId) || item.variants[0];
    const flavor = selectedFlavors[item.id];

    onAddToCart(item, variant, flavor);

    setRecentlyAddedId(`${item.id}-${variant.id}`);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1500);
  };

  return (
    <section id="menu" className="py-16 lg:py-24 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-stone-200 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900/90 mb-2">
              <span>Fresh Homemade Treats</span>
              <span aria-hidden="true">·</span>
              <span>Available in Single & Bulk Sizes</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2B1805] tracking-tight">
              Our Artisanal Pastry Menu
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
              From our famous crunchy chin chin to fluffy morning glazed donuts and hearty golden egg rolls.
              Select your preferred pack size or bucket below.
            </p>
          </div>

          {/* Quick link to bulk quote */}
          <button
            type="button"
            onClick={onOpenBulkCalculator}
            className="self-start md:self-auto inline-flex items-center gap-2 text-sm font-semibold text-amber-900 hover:text-amber-950 underline underline-offset-4"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Need catering for 50+ guests? Calculate bulk discount</span>
          </button>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          {/* Category Tabs (Segmented control buttons) */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search treats, flavors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-stone-900 placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
            <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-stone-800">No pastries match your search</h3>
            <p className="text-sm text-stone-500 mt-1 max-w-md mx-auto">
              We also bake custom items! Contact Chef Privilege for custom orders, or clear your search to see our full catalog.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const activeVariantId = selectedVariants[item.id] || item.variants[0]?.id;
              const activeVariant =
                item.variants.find((v) => v.id === activeVariantId) || item.variants[0];
              const activeFlavor = selectedFlavors[item.id] || (item.flavors ? item.flavors[0] : '');

              const currentPrice =
                currency === 'NGN'
                  ? activeVariant.priceNGN
                  : currency === 'USD'
                  ? activeVariant.priceUSD
                  : activeVariant.priceGBP;

              const isAdded = recentlyAddedId === `${item.id}-${activeVariant.id}`;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
                >
                  {/* Product Card Image (65-75% visual prominence) */}
                  <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                    {/* Unboxed category & method indicator */}
                    <div className="absolute top-3 left-3 text-white text-[11px] font-medium drop-shadow-sm flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md">
                      <span>{item.categoryLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.bakingMethod}</span>
                    </div>

                    {/* Popular indicator */}
                    {item.isPopular && (
                      <div className="absolute top-3 right-3 text-amber-950 font-semibold text-[11px] bg-[#F5C242] px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-900" />
                        <span>Best Seller</span>
                      </div>
                    )}

                    {/* Quick shelf-life note in photo */}
                    <div className="absolute bottom-3 left-3 right-3 text-white text-[11px] drop-shadow-sm truncate">
                      <span>Freshness: {item.shelfLife}</span>
                    </div>
                  </div>

                  {/* Product Card Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-xl font-bold text-stone-900 tracking-tight leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-amber-900/80 font-medium mt-1 leading-relaxed">
                        {item.tagline}
                      </p>
                      <p className="text-stone-600 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Variant & Size Selector */}
                    <div className="mt-4 pt-4 border-t border-stone-100 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-medium text-stone-700">Choose Size / Packaging:</span>
                          <span className="text-stone-500 font-normal">
                            {activeVariant.recommendedFor}
                          </span>
                        </div>
                        <div className="relative">
                          <select
                            value={activeVariantId}
                            onChange={(e) => handleVariantChange(item.id, e.target.value)}
                            aria-label={`Choose size for ${item.title}`}
                            className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 pr-8 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                          >
                            {item.variants.map((variant) => {
                              const varPrice =
                                currency === 'NGN'
                                  ? variant.priceNGN
                                  : currency === 'USD'
                                  ? variant.priceUSD
                                  : variant.priceGBP;

                              return (
                                <option key={variant.id} value={variant.id}>
                                  {variant.name} — {formatPrice(varPrice, currency)} {variant.isBulk ? '(Bulk Tier)' : ''}
                                </option>
                              );
                            })}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1 italic">
                          {activeVariant.weightOrUnit}
                        </p>
                      </div>

                      {/* Flavor Selector if product offers flavors */}
                      {item.flavors && item.flavors.length > 0 && (
                        <div>
                          <label
                            htmlFor={`flavor-${item.id}`}
                            className="block text-xs font-medium text-stone-700 mb-1"
                          >
                            Flavor / Spice Blend:
                          </label>
                          <div className="relative">
                            <select
                              id={`flavor-${item.id}`}
                              value={activeFlavor}
                              onChange={(e) => handleFlavorChange(item.id, e.target.value)}
                              className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 pr-8 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                            >
                              {item.flavors.map((flavor) => (
                                <option key={flavor} value={flavor}>
                                  {flavor}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      {/* Price & Add to Bag Row */}
                      <div className="pt-2 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-stone-400 block tracking-wider">
                            Price
                          </span>
                          <span className="text-xl font-bold text-[#2B1805] tabular-nums">
                            {formatPrice(currentPrice, currency)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAdd(item)}
                          className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                            isAdded
                              ? 'bg-emerald-700 text-white'
                              : 'bg-[#2D1B06] hover:bg-[#432A0C] text-amber-50 shadow-xs'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-300" />
                              <span>Added to Bag</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 text-amber-400" />
                              <span>Add to Order</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footnote about Custom Flour Creations */}
        <div className="mt-12 p-6 rounded-2xl bg-[#F4EFE6] border border-amber-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200/60 flex items-center justify-center text-amber-900 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-sm">Have a special pastry request in mind?</h3>
              <p className="text-xs text-stone-600 mt-0.5">
                We craft meat pie rolls, samosas, cinnamon rolls, customized party cakes, and anything flour can make.
              </p>
            </div>
          </div>
          <a
            href="#custom-studio"
            className="px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 font-semibold text-xs whitespace-nowrap shadow-xs"
          >
            Custom Pastry Request
          </a>
        </div>
      </div>
    </section>
  );
}
