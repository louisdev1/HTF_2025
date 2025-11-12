import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fishy Dex - Your Aquatic Species Catalog',
  description: 'Track and discover ocean fish species with Fishy Dex',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen pb-12">
          {children}
        </main>
        <footer className="bg-gradient-to-r from-ocean-800 to-ocean-900 text-ocean-100 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-lg mb-2">🐟 Fishy Dex - Your Aquatic Species Catalog</p>
            <p className="text-sm text-ocean-300">Exploring ocean life, one fish at a time</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
