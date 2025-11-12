'use client';

import { useState, useEffect } from 'react';
import { Fish, FilterType } from '@/types/api';
import { fishApi } from '@/lib/api';
import FishCard from '@/components/FishCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import EmptyState from '@/components/EmptyState';

export default function Home() {
  const [fish, setFish] = useState<Fish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const fetchFish = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fishApi.getAll(search, filter);
      setFish(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load fish');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFish();
  }, [search, filter]);

  const filterButtons: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All Fish' },
    { value: 'seen', label: 'Seen' },
    { value: 'unseen', label: 'Not Seen' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-ocean-900 mb-2">Ocean Fish Catalogue</h1>
        <p className="text-lg text-ocean-700">Discover and track the amazing fish of our oceans</p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, scientific name, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-12"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ocean-400 text-xl">
            🔍
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                filter === btn.value
                  ? 'bg-ocean-600 text-white shadow-md'
                  : 'bg-white text-ocean-700 hover:bg-ocean-100 border-2 border-ocean-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchFish} />
      ) : fish.length === 0 ? (
        <EmptyState
          message="No fish found"
          description={search ? 'Try adjusting your search or filter' : 'Check back later for more fish!'}
        />
      ) : (
        <>
          <div className="mb-6 text-ocean-700 font-medium">
            Found {fish.length} {fish.length === 1 ? 'fish' : 'fish'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fish.map((f) => (
              <FishCard key={f.id} fish={f} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
