import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fish Catalogue - Ocean Life Explorer',
  description: 'Explore and track your ocean fish sightings',
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
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-ocean-900 text-ocean-100 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; 2025 Fish Catalogue. Exploring ocean life one fish at a time.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
