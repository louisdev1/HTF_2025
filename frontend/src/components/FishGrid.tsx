import { Fish } from '@/types/api';
import FishCard from './FishCard';

interface FishGridProps {
  fish: Fish[];
}

export default function FishGrid({ fish }: FishGridProps) {
  if (fish.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-12 bg-white rounded-xl shadow-md text-center animate-fade-in">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold text-ocean-900 mb-2">No fish found</h3>
        <p className="text-ocean-600 text-lg">
          Try adjusting your search or filter to discover more species!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {fish.map((f) => (
        <FishCard key={f.id} fish={f} />
      ))}
    </div>
  );
}
