import Link from 'next/link';
import Image from 'next/image';
import { Fish } from '@/types/api';

interface FishCardProps {
  fish: Fish;
}

export default function FishCard({ fish }: FishCardProps) {
  return (
    <Link href={`/fish/${fish.id}`}>
      <div className="card overflow-hidden h-full hover:scale-105 transition-transform duration-300">
        <div className="relative h-48 bg-ocean-100">
          <Image
            src={fish.imageUrl}
            alt={fish.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {fish.seen && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-1">
              <span>✓</span>
              <span>Seen</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold text-ocean-900 mb-1">{fish.name}</h3>
          <p className="text-sm text-ocean-600 italic mb-2">{fish.scientificName}</p>
          <p className="text-sm text-ocean-700 line-clamp-2 mb-3">{fish.description}</p>
          <div className="flex items-center space-x-4 text-xs text-ocean-500">
            <div className="flex items-center space-x-1">
              <span>📍</span>
              <span>{fish.habitat.split(',')[0]}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>📏</span>
              <span>{fish.size}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
