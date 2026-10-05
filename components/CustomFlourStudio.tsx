'use client';

import React, { useState } from 'react';
import { Sparkles, MessageCircle, Send, CheckCircle2, Wand2, ChefHat, Cookie, Heart } from 'lucide-react';
import { BAKER_INFO } from '@/lib/data';
import { generateWhatsAppLink } from '@/lib/utils';

interface CustomFlourStudioProps {
  onSuccessToast?: (msg: string) => void;
}

export function CustomFlourStudio({ onSuccessToast }: CustomFlourStudioProps) {
  const [creationType, setCreationType] = useState<string>('Custom Savory Meat Pies / Chops');
  const [guestCount, setGuestCount] = useState<string>('50-100 guests');
  const [eventDate, setEventDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dietaryNotes, setDietaryNotes] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientContact, setClientContact] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const presets = [
    {
      title: 'Custom Savory Chops & Pies',
      desc: 'Meat pies with customized spice levels, fish rolls, cocktail sausage rolls, or mini samosas.',
      example: 'I need 80 spicy beef meat pies and 40 sausage twists for our office anniversary.',
    },
    {
      title: 'Themed & Branded Donuts',
      desc: 'Company logo icing colors, wedding palette glazes, or mini donut towers for dessert bars.',
      example: 'Looking for 100 donuts glazed in pastel blue and gold sprinkles for a baby shower.',
    },
    {
      title: 'Bespoke Chin Chin Jars',
      desc: 'Custom jar shapes, personalized couple souvenir stickers, gold ribbons, or special coconut crunch.',
      example: 'We need 150 glass souvenir jars of crunchy chin chin with our wedding hashtag printed on stickers.',
    },
    {
      title: 'Special Flour Breads & Pastries',
      desc: 'Braided sweet milk bread, cinnamon swirl buns, flaky chicken turnovers, or family recipes.',
      example: 'Can you bake 30 loaves of fresh sweet bakery milk bread and 50 cinnamon twists?',
    },
  ];

  const handleSelectPreset = (title: string, sample: string) => {
    setCreationType(title);
    if (!description) {
      setDescription(sample);
    }
  };

  const handleWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() || !clientName.trim()) {
      alert('Please fill in your name and a brief description of what you would like Chef Privilege to bake.');
      return;
    }

    const message = [
      `*CUSTOM FLOUR CRAFT INQUIRY — ${BAKER_INFO.businessName}*`,
      `------------------------------------------`,
      `• *Client Name:* ${clientName}`,
      clientContact ? `• *Phone / WhatsApp:* ${clientContact}` : '',
      clientEmail ? `• *Email:* ${clientEmail}` : '',
      `• *Pastry Creation:* ${creationType}`,
      `• *Target Servings:* ${guestCount}`,
      eventDate ? `• *Event Date:* ${eventDate}` : '',
      dietaryNotes ? `• *Dietary / Recipe Notes:* ${dietaryNotes}` : '',
      ``,
      `*CUSTOM REQUEST DETAILS:*`,
      `${description}`,
      ``,
      `Hello Chef Privilege! I would like to discuss bulk pricing and custom options for this order. Thank you!`,
    ]
      .filter(Boolean)
      .join('\n');

    const url = generateWhatsAppLink(BAKER_INFO.whatsappNumber, message);
    window.open(url, '_blank');
    setIsSubmitted(true);
  };

  const handleEmailDirect = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() || !clientName.trim()) {
      alert('Please provide your name and custom order description.');
      return;
    }

    const subject = encodeURIComponent(`Custom Pastry Inquiry: ${creationType} - ${clientName}`);
    const body = encodeURIComponent(
      `Hello Chef Privilege Oyegbile,\n\n` +
      `I would like to inquire about a custom order for "${creationType}".\n\n` +
      `Details:\n` +
      `- Client Name: ${clientName}\n` +
      `- Phone/WhatsApp: ${clientContact}\n` +
      `- Email: ${clientEmail}\n` +
      `- Target Guest Count / Servings: ${guestCount}\n` +
      `- Event Date: ${eventDate}\n` +
      `- Dietary / Spice Notes: ${dietaryNotes}\n\n` +
      `Description & Vision:\n${description}\n\n` +
      `Looking forward to discussing pricing and options.\n\n` +
      `Best regards,\n${clientName}`
    );

    const mailtoUrl = `mailto:${BAKER_INFO.email}?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, '_self');
    setIsSubmitted(true);
  };

  return (
    <section id="custom-studio" className="py-16 lg:py-24 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: The Flour Craft Philosophy & Inspiration Cards */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900/90 mb-2">
              <ChefHat className="w-4 h-4 text-amber-700" />
              <span>Anything Flour Can Make</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2B1805] tracking-tight mb-4">
              The Flour Craft Studio
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6">
              Have an idea that goes beyond our standard menu? From savory finger chops to bespoke party
              souvenir jars, Chef Privilege Oyegbile bakes with traditional techniques and customized recipes.
            </p>

            {/* Inspiration presets */}
            <div className="space-y-3 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                Popular Custom Commissions:
              </span>
              {presets.map((preset) => (
                <button
                  key={preset.title}
                  type="button"
                  onClick={() => handleSelectPreset(preset.title, preset.example)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs ${
                    creationType === preset.title
                      ? 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="font-bold text-stone-900 flex items-center justify-between">
                    <span>{preset.title}</span>
                    <Wand2 className="w-3.5 h-3.5 text-amber-700" />
                  </div>
                  <p className="text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {preset.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* Direct Contact reminder */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
              <div className="font-semibold text-stone-800">Direct Inquiries:</div>
              <div>Email: <a href={`mailto:${BAKER_INFO.email}`} className="text-amber-800 underline">{BAKER_INFO.email}</a></div>
              <div>WhatsApp / Call: <span className="font-medium text-stone-900">{BAKER_INFO.phoneDisplay}</span></div>
            </div>
          </div>

          {/* Right Column: Custom Order Request Form */}
          <div className="lg:col-span-7 bg-[#FAFAF7] p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                <h3 className="font-display text-2xl font-bold text-stone-900">
                  Custom Request Initiated!
                </h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  Thank you! Your custom inquiry has been pre-formatted for Chef Privilege Oyegbile.
                  If your WhatsApp or email did not open automatically, you can also email directly to{' '}
                  <strong className="text-stone-900">{BAKER_INFO.email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-[#2D1B06] text-amber-50 text-xs font-semibold hover:bg-[#432A0C] transition-colors"
                >
                  Submit Another Custom Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleWhatsAppSend} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <h3 className="font-bold text-stone-900 text-base">
                    Describe Your Custom Pastry Vision
                  </h3>
                  <span className="text-[11px] text-stone-500 font-medium">Quick 24h Turnaround</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Creation Category:
                    </label>
                    <input
                      type="text"
                      value={creationType}
                      onChange={(e) => setCreationType(e.target.value)}
                      placeholder="e.g. Wedding Souvenir Chin Chin Jars"
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Target Servings / Guest Count:
                    </label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="10-25 guests (Small Gathering)">10-25 guests (Small Gathering)</option>
                      <option value="50-100 guests (Standard Event)">50-100 guests (Standard Event)</option>
                      <option value="150-300 guests (Wedding / Large Banquet)">150-300 guests (Wedding / Large Banquet)</option>
                      <option value="500+ guests (Mega Celebration / Convention)">500+ guests (Mega Celebration / Convention)</option>
                      <option value="Sample / Tasting Batch">Sample / Tasting Batch</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Describe Your Vision (Shapes, Fillings, Flavors, Custom Packaging):
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us what you would love made! e.g., 'Need 120 custom cinnamon glazed donuts with edible gold dust, plus 50 souvenir jars of peppered chin chin with our corporate branding stickers...'"
                    className="w-full bg-white border border-stone-200 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none placeholder:text-stone-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Target Event / Delivery Date:
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Dietary / Spice Preferences:
                    </label>
                    <input
                      type="text"
                      value={dietaryNotes}
                      onChange={(e) => setDietaryNotes(e.target.value)}
                      placeholder="e.g. Mild spice, no nutmeg, extra crunchy, halal"
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-stone-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-200/60">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Your Full Name:
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Tolani Adeleke"
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      WhatsApp / Phone:
                    </label>
                    <input
                      type="tel"
                      value={clientContact}
                      onChange={(e) => setClientContact(e.target.value)}
                      placeholder="e.g. +234 800 000 0000"
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Your Email:
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Submit buttons */}
                <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-200" />
                    <span>Send Custom Request via WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleEmailDirect}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-xs sm:text-sm shadow-xs transition-colors"
                  >
                    <Send className="w-4 h-4 text-amber-700" />
                    <span>Email to Privilege</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
