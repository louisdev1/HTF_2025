import Link from 'next/link';
import Image from 'next/image';
import { Fish } from '@/types/api';

interface FishCardProps {
  fish: Fish;
}

export default function FishCard({ fish }: FishCardProps) {
  const rarityColors = {
    Common: 'badge-common',
    Rare: 'badge-rare',
    Epic: 'badge-epic',
  };

  return (
    <Link href={`/fish/${fish.id}`}>
      <div className={fish.seen ? 'fish-card-seen' : 'fish-card-unseen'}>
        <div className="relative h-48 bg-ocean-50">
          <Image
            src={fish.imageUrl}
            alt={fish.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <span className={`badge ${rarityColors[fish.rarity]}`}>
              {fish.rarity}
            </span>
          </div>
          {fish.seen && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center space-x-1">
              <span>✓</span>
              <span>Spotted</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold text-ocean-900 mb-1 fish-name">{fish.name}</h3>
          <p className="text-sm text-ocean-600 italic mb-2">{fish.scientificName}</p>
          <p className="text-sm text-gray-700 line-clamp-2 mb-3">{fish.description}</p>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1 text-ocean-600">
              <span>📍</span>
              <span className="line-clamp-1">{fish.habitat.split(',')[0]}</span>
            </div>
            <div className="flex items-center space-x-1 text-ocean-600">
              <span>📏</span>
              <span>{fish.size}</span>
            </div>
          </div>
          {fish.seen && fish.lastSeen && (
            <div className="mt-2 pt-2 border-t border-ocean-100">
              <p className="text-xs text-green-600">
                Last seen: {new Date(fish.lastSeen).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
