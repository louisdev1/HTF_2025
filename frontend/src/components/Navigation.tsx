'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/catalog', label: 'Catalog', icon: '🐠' },
    { href: '/map', label: 'Map', icon: '🗺️' },
  ];

  return (
    <nav className="bg-gradient-to-r from-ocean-700 to-ocean-900 text-white shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <span className="text-4xl">🐟</span>
            <div>
              <div className="text-2xl font-bold">Fishy Dex</div>
              <div className="text-xs text-ocean-200">Your Aquatic Species Catalog</div>
            </div>
          </Link>
          <div className="flex space-x-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'bg-ocean-500 text-white shadow-lg scale-105'
                    : 'text-ocean-100 hover:bg-ocean-600 hover:text-white'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
