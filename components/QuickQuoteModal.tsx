'use client';

import React, { useState } from 'react';
import { X, Sparkles, MessageCircle, Mail, CheckCircle2, Calendar, MapPin, Users } from 'lucide-react';
import { BAKER_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';

interface QuickQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    eventType?: string;
    guestCount?: number;
    date?: string;
    details?: string;
  };
}

export function QuickQuoteModal({ isOpen, onClose, initialData }: QuickQuoteModalProps) {
  const [orderType, setOrderType] = useState<'bulk-catering' | 'small-retail'>('bulk-catering');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [guestCount, setGuestCount] = useState<string>(initialData?.guestCount ? `${initialData.guestCount} guests` : '50 - 100 guests');
  const [eventDate, setEventDate] = useState<string>(initialData?.date || '');
  const [cityVenue, setCityVenue] = useState<string>('');
  const [treatsInterested, setTreatsInterested] = useState<string[]>(['Chin Chin (Bulk Buckets)', 'Artisan Glazed Donuts', 'Golden Egg Rolls']);
  const [extraDetails, setExtraDetails] = useState<string>(initialData?.details || '');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleTreat = (treat: string) => {
    setTreatsInterested((prev) =>
      prev.includes(treat) ? prev.filter((t) => t !== treat) : [...prev, treat]
    );
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      alert('Please enter your name.');
      return;
    }

    const message = [
      `*DIRECT ORDER & BULK QUOTE INQUIRY — ${BAKER_INFO.businessName}*`,
      `=========================================`,
      `• *Client Name:* ${fullName}`,
      phone ? `• *Phone / WhatsApp:* ${phone}` : '',
      email ? `• *Email:* ${email}` : '',
      `• *Order Scale:* ${orderType === 'bulk-catering' ? 'Bulk / Event Catering' : 'Retail / Personal Snack Batch'}`,
      orderType === 'bulk-catering' ? `• *Guest Size:* ${guestCount}` : '',
      eventDate ? `• *Target Date:* ${eventDate}` : '',
      cityVenue ? `• *Location / Venue:* ${cityVenue}` : '',
      `• *Treats of Interest:* ${treatsInterested.join(', ') || 'Custom Selection'}`,
      extraDetails ? `• *Details / Notes:* ${extraDetails}` : '',
      ``,
      `Hello Chef Privilege! Please advise on bulk pricing and availability for this date. Thank you!`,
    ]
      .filter(Boolean)
      .join('\n');

    const url = generateWhatsAppLink(BAKER_INFO.whatsappNumber, message);
    window.open(url, '_blank');
    setSubmitted(true);
  };

  const handleEmailSubmit = () => {
    if (!fullName.trim()) {
      alert('Please enter your name.');
      return;
    }

    const subject = encodeURIComponent(`Order & Bulk Inquiry: ${fullName}`);
    const body = encodeURIComponent(
      `Hello Chef Privilege Oyegbile,\n\n` +
      `I would like to inquire about ordering:\n` +
      `- Order Type: ${orderType === 'bulk-catering' ? 'Bulk / Event Catering' : 'Retail / Personal Batch'}\n` +
      `- Guest Count: ${guestCount}\n` +
      `- Event Date: ${eventDate}\n` +
      `- Location: ${cityVenue}\n` +
      `- Selected Treats: ${treatsInterested.join(', ')}\n` +
      `- Additional Notes: ${extraDetails}\n\n` +
      `Contact Details:\nName: ${fullName}\nPhone: ${phone}\nEmail: ${email}\n\n` +
      `Looking forward to your response!\n\nBest regards,\n${fullName}`
    );

    window.location.href = `mailto:${BAKER_INFO.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 sm:p-5 bg-[#FAFAF7] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h3 className="font-display font-bold text-base sm:text-lg text-stone-900">
              Direct Order & Bulk Pricing Inquiry
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-display text-xl font-bold text-stone-900">
                Inquiry Form Prepared!
              </h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                Chef Privilege Oyegbile has been notified. You can also reach him directly at{' '}
                <a href={`mailto:${BAKER_INFO.email}`} className="font-bold text-amber-900 underline">
                  {BAKER_INFO.email}
                </a>{' '}
                or via phone at {BAKER_INFO.phoneDisplay}.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-5 py-2 rounded-xl bg-[#2D1B06] text-amber-50 text-xs font-semibold"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleWhatsAppSubmit} className="space-y-4 text-xs">
              {/* Scale toggle */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">
                  Order Type:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('bulk-catering')}
                    className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                      orderType === 'bulk-catering'
                        ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Bulk & Event Catering (Parties)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('small-retail')}
                    className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                      orderType === 'small-retail'
                        ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Retail & Small Snack Batch
                  </button>
                </div>
              </div>

              {/* Treats Selection checkboxes */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">
                  Treats of Interest:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Chin Chin (Bulk Buckets)',
                    'Chin Chin (Souvenir Jars)',
                    'Artisan Glazed Donuts',
                    'Golden Egg Rolls',
                    'Flaky Meat / Chicken Pies',
                    'Sweet Puff Puff Drums',
                    'Anything Flour Can Make (Custom)',
                  ].map((treat) => {
                    const isChecked = treatsInterested.includes(treat);
                    return (
                      <button
                        key={treat}
                        type="button"
                        onClick={() => toggleTreat(treat)}
                        className={`text-left p-2 rounded-lg border transition-all ${
                          isChecked
                            ? 'bg-stone-900 border-stone-900 text-amber-200 font-semibold'
                            : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        {treat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Event details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-600 mb-1">
                    Event / Delivery Date:
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-600 mb-1">
                    Venue / City / State:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lagos, Abuja, or City"
                    value={cityVenue}
                    onChange={(e) => setCityVenue(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Contact info */}
              <div className="pt-2 border-t border-stone-200 space-y-2">
                <div>
                  <label className="block font-medium text-stone-600 mb-1">Your Full Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Bukola Adebisi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-medium text-stone-600 mb-1">Phone / WhatsApp:</label>
                    <input
                      type="tel"
                      placeholder="+234..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-600 mb-1">Email Address:</label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-stone-600 mb-1">Special Notes / Questions:</label>
                  <textarea
                    rows={2}
                    placeholder="Quantity questions, custom flavors, or delivery requirements..."
                    value={extraDetails}
                    onChange={(e) => setExtraDetails(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 resize-none placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-200" />
                  <span>Send via WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={handleEmailSubmit}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold shadow-xs transition-colors"
                >
                  <Mail className="w-4 h-4 text-amber-700" />
                  <span>Email to Privilege</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
