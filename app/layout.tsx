import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Privy FlourCraft - Homemade Pastries, Chin Chin & Bulk Catering',
  description: 'Artisanal homemade Nigerian chin chin, fluffy glazed donuts, golden egg rolls, and custom flour treats. Retail pouches to wholesale bulk party buckets and event catering.',
  openGraph: {
    title: 'Privy FlourCraft - Homemade Pastries, Chin Chin & Bulk Catering',
    description: 'Artisanal homemade Nigerian chin chin, fluffy glazed donuts, golden egg rolls, and custom flour treats. Retail pouches to wholesale bulk party buckets and event catering.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privy FlourCraft - Homemade Pastries, Chin Chin & Bulk Catering',
    description: 'Artisanal homemade Nigerian chin chin, fluffy glazed donuts, golden egg rolls, and custom flour treats. Retail pouches to wholesale bulk party buckets and event catering.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${playfair.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#FAFAF7] text-[#1E1E1E] antialiased selection:bg-[#E5A823]/25 selection:text-[#3B2506]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
